"use client"

import { useEffect, useRef, useState } from "react"

import { useLocale, useTranslations } from "@/i18n/provider"
import { getExportSize } from "@/lib/export-sizes"
import { useCoverStore } from "@/stores/cover-store"
import { getTemplate } from "@/templates/registry"

import { CoverPreview, coverCanvas } from "./cover-preview"
import { SelectionLayer, useEditingApi } from "./inline-editing"

const PADDING = 24
const PADDING_MOBILE = 12

export function CanvasStage() {
  const t = useTranslations("editor")
  const tSizes = useTranslations("exportSizes")
  const locale = useLocale()
  const config = useCoverStore((state) => state.config)
  const stageRef = useRef<HTMLDivElement>(null)
  const template = getTemplate(config.template)
  const canvas = coverCanvas(template, config)
  const output = getExportSize(config.export.size)
  const [box, setBox] = useState<{ width: number; height: number }>()
  const editing = useEditingApi(template)
  const setSelection = useCoverStore((state) => state.setSelection)
  const exportRender = useCoverStore((state) => state.exportRender)

  // Échap désélectionne (en saisie, le texte l'intercepte), sauf depuis un
  // champ ou une fenêtre ouverte (sélecteur de couleur, menu des polices).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return
      const target = event.target as HTMLElement
      if (
        target.isContentEditable ||
        target.closest?.("input, textarea, select, [role='dialog']")
      )
        return
      const { selection, editing } = useCoverStore.getState()
      if (selection && !editing) setSelection(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [setSelection])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ width, height })
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const padding = box && box.width < 768 ? PADDING_MOBILE : PADDING
  const scale = box
    ? Math.max(
        0.05,
        Math.min(
          (box.width - padding * 2) / canvas.width,
          (box.height - padding * 2) / canvas.height
        )
      )
    : 0

  return (
    <section
      ref={stageRef}
      aria-label={t("previewLabel")}
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[var(--stage)]"
      // Clic hors d'un texte (fond, captures) : désélection. La barre d'outils
      // est un portail : ses clics remontent ici côté React, pas dans le DOM.
      onPointerDown={(event) => {
        const target = event.target as Element
        if (!event.currentTarget.contains(target)) return
        if (!target.closest("[data-edit-path]")) setSelection(null)
      }}
    >
      {scale > 0 && (
        <div className="rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_40px_rgba(0,0,0,0.12)]">
          <CoverPreview
            template={template}
            config={config}
            scale={scale}
            editing={editing}
          >
            <SelectionLayer scale={scale} />
          </CoverPreview>
        </div>
      )}
      {/* Copie sans édition directe, montée le temps d'un export : c'est elle
          qui est capturée, sans emplacements vides ni bouton d'ajout. */}
      {exportRender && (
        <div aria-hidden className="pointer-events-none fixed top-0 left-[-100000px]">
          <CoverPreview template={template} config={config} scale={1} exportable />
        </div>
      )}
      <div className="absolute right-4 bottom-4 hidden rounded-full md:block bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground tabular-nums shadow-sm ring-1 ring-foreground/10 backdrop-blur">
        {tSizes(output.labelKey)} · {output.width} × {output.height} ·{" "}
        {new Intl.NumberFormat(locale, { style: "percent" }).format(
          Math.round((scale * canvas.width) / output.width * 100) / 100
        )}
      </div>
    </section>
  )
}

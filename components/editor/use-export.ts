"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useLocale, useTranslations } from "@/i18n/provider"
import { trackCoverGenerated, trackExportFailed } from "@/lib/analytics"
import { EXPORT_NODE_ID, ExportError, coverFilename, exportCover } from "@/lib/export"
import { getExportSize } from "@/lib/export-sizes"
import { useCoverStore } from "@/stores/cover-store"
import { getTemplate } from "@/templates/registry"

import { coverCanvas } from "./cover-preview"

/**
 * Attend que la copie d'export soit montée (une demi-seconde au plus). Pas de
 * requestAnimationFrame : il est suspendu quand l'onglet est en arrière-plan.
 */
async function exportNode() {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (document.getElementById(EXPORT_NODE_ID)) return
    await new Promise((resolve) => setTimeout(resolve, 16))
  }
}

export function useExport() {
  const t = useTranslations("export")
  const tErrors = useTranslations("errors")
  const locale = useLocale()
  const config = useCoverStore((state) => state.config)
  const [exporting, setExporting] = useState(false)
  const output = getExportSize(config.export.size)
  const scale = config.export.scale
  const filename = coverFilename(config.content, output.id)
  const canvas = coverCanvas(getTemplate(config.template), config)

  async function run() {
    // Le PNG vient d'une copie de la cover sans édition directe.
    const { setSelection, setExportRender } = useCoverStore.getState()
    setSelection(null)
    setExportRender(true)
    setExporting(true)
    const started = performance.now()
    try {
      await exportNode()
      await exportCover(canvas, output, filename, scale)
      trackCoverGenerated({ template: config.template, size: output.id, scale })
      const seconds = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format((performance.now() - started) / 1000)
      toast.success(t("toastSuccess"), {
        description: t("toastSuccessDescription", { filename, seconds }),
      })
    } catch (error) {
      trackExportFailed({ reason: error instanceof ExportError ? error.code : "unknown" })
      toast.error(t("toastError"), {
        description:
          error instanceof ExportError
            ? tErrors(error.code)
            : error instanceof Error
              ? error.message
              : undefined,
      })
    } finally {
      setExportRender(false)
      setExporting(false)
    }
  }

  return {
    run,
    exporting,
    filename,
    output,
    scale,
    pixels: { width: output.width * scale, height: output.height * scale },
  }
}

"use client"

import {
  Check,
  Eraser,
  Highlighter,
  ListPlus,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Type,
  X,
} from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { HexColorInput, HexColorPicker } from "react-colorful"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLocale, useTranslations } from "@/i18n/provider"
import { clamp, cssToHex } from "@/lib/color"
import { FONTS, SCALE_MAX, SCALE_MIN, fontStack, getFont } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useCoverStore } from "@/stores/cover-store"
import {
  selectedNameRange,
  setActiveNameAccent,
} from "@/templates/shared/editable"
import { COLOR_PRESETS } from "@/templates/showcase/defaults"
import type { BadgeShape, TextRange } from "@/types/cover"

import { insertChip, removeChip } from "./chip-actions"

const HEIGHT = 44
const GAP = 12
/** Demi-largeur approximative : garde la barre dans la fenêtre. */
const HALF_WIDTH = 240
const STEP = 0.1

/**
 * Barre d'outils de l'élément de texte sélectionné (docs/INLINE-EDITING.md
 * §2.2), en position fixe au-dessus de lui, en dessous s'il manque de place.
 */
export function TextToolbar({
  anchor,
  target,
}: {
  anchor: DOMRect
  /** Sélecteur du texte, pour lire sa couleur calculée. */
  target: string
}) {
  const t = useTranslations("inlineEditing")
  const locale = useLocale()
  const selection = useCoverStore((state) => state.selection)
  const editing = useCoverStore((state) => state.editing)
  const style = useCoverStore((state) => state.config.style)
  const setField = useCoverStore((state) => state.setField)
  const setSelection = useCoverStore((state) => state.setSelection)
  const setEditing = useCoverStore((state) => state.setEditing)
  if (!selection) return null

  const element = selection.element
  const scale = style.textScale?.[element] ?? 1
  const font = style.textFont?.[element]
  const color = style.textColor?.[element]
  const shown = color ?? computedColor(target)

  const above = anchor.top - GAP - HEIGHT
  const top = above >= 8 ? above : anchor.bottom + GAP
  const left = clamp(
    anchor.left + anchor.width / 2,
    HALF_WIDTH + 8,
    Math.max(HALF_WIDTH + 8, window.innerWidth - HALF_WIDTH - 8)
  )

  function setScale(next: number) {
    setField(
      `style.textScale.${element}`,
      Math.round(clamp(next, SCALE_MIN, SCALE_MAX) * 100) / 100
    )
  }

  return (
    <div
      role="toolbar"
      aria-label={t("toolbarLabel")}
      data-inline-toolbar=""
      // Garde le focus dans le texte en saisie : on peut régler la taille en
      // tapant. Les popovers (portails) gardent leur comportement normal.
      onMouseDown={(event) => {
        if (
          event.currentTarget.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest("input")
        )
          event.preventDefault()
      }}
      className="fixed z-40 flex h-11 max-w-[calc(100vw-16px)] -translate-x-1/2 items-center gap-0.5 rounded-xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10"
      style={{ left, top }}
    >
      {!editing && (
        <>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil data-icon="inline-start" />
            {t("edit")}
          </Button>
          <Divider />
        </>
      )}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("smaller")}
        disabled={scale <= SCALE_MIN}
        onClick={() => setScale(scale - STEP)}
      >
        <Minus />
      </Button>
      <button
        type="button"
        aria-label={t("sizeReset")}
        title={t("sizeReset")}
        onClick={() => setScale(1)}
        className="h-7 min-w-12 rounded-md px-1 text-xs font-medium tabular-nums outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {new Intl.NumberFormat(locale, { style: "percent" }).format(scale)}
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("larger")}
        disabled={scale >= SCALE_MAX}
        onClick={() => setScale(scale + STEP)}
      >
        <Plus />
      </Button>

      <Divider />

      <Popover>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="sm" aria-label={t("font")}>
              <Type data-icon="inline-start" />
              <span className="max-w-24 truncate">
                {font ? getFont(font).label : t("templateFont")}
              </span>
            </Button>
          }
        />
        <PopoverContent side="bottom" className="w-56 gap-1 p-1">
          <div
            role="radiogroup"
            aria-label={t("font")}
            className="flex flex-col"
          >
            <FontOption
              checked={!font}
              onSelect={() => setField(`style.textFont.${element}`, undefined)}
            >
              {t("templateFont")}
            </FontOption>
            {FONTS.map((option) => (
              <FontOption
                key={option.id}
                checked={font === option.id}
                fontFamily={fontStack(option.id)}
                onSelect={() =>
                  setField(`style.textFont.${element}`, option.id)
                }
              >
                {option.label}
              </FontOption>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={t("color")}>
              <span
                className="size-4 rounded-full ring-1 ring-foreground/20"
                style={{ background: shown }}
              />
            </Button>
          }
        />
        <PopoverContent side="bottom" className="w-60 gap-3 p-3">
          <HexColorPicker
            color={shown}
            onChange={(next) => setField(`style.textColor.${element}`, next)}
            className="canva-picker"
          />
          <HexColorInput
            color={shown}
            onChange={(next) => setField(`style.textColor.${element}`, next)}
            prefixed
            aria-label={t("colorHex")}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 font-mono text-sm uppercase outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="grid grid-cols-5 gap-1.5">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                title={preset}
                aria-label={t("colorPreset", { color: preset })}
                aria-pressed={preset.toLowerCase() === color?.toLowerCase()}
                onClick={() => setField(`style.textColor.${element}`, preset)}
                className="aspect-square rounded-md ring-1 ring-foreground/10 outline-none ring-inset focus-visible:ring-3 focus-visible:ring-ring/60 aria-pressed:ring-2 aria-pressed:ring-primary"
                style={{ background: preset }}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!color}
            onClick={() => setField(`style.textColor.${element}`, undefined)}
          >
            <RotateCcw data-icon="inline-start" />
            {t("colorReset")}
          </Button>
        </PopoverContent>
      </Popover>

      {element === "name" && (
        <>
          <Divider />
          <AccentControls editing={editing} />
        </>
      )}

      {element === "badge" && (
        <>
          <Divider />
          <ShapeControls />
        </>
      )}

      {element === "chips" && (
        <>
          <Divider />
          <ChipControls index={Number(selection.path.split(".").pop())} />
        </>
      )}

      <Divider />

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("close")}
        onClick={() => setSelection(null)}
      >
        <X />
      </Button>
    </div>
  )
}

/**
 * Accent du nom : en saisie, met en accent les lettres sélectionnées ; hors
 * saisie, le bouton passe en saisie pour permettre la sélection.
 */
function AccentControls({ editing }: { editing: boolean }) {
  const t = useTranslations("inlineEditing")
  const accent = useCoverStore((state) => state.config.content.accent)
  const setField = useCoverStore((state) => state.setField)
  const setEditing = useCoverStore((state) => state.setEditing)
  const [range, setRange] = useState<TextRange | null>(null)

  useEffect(() => {
    if (!editing) return
    const update = () => setRange(selectedNameRange())
    document.addEventListener("selectionchange", update)
    const frame = requestAnimationFrame(update)
    return () => {
      document.removeEventListener("selectionchange", update)
      cancelAnimationFrame(frame)
    }
  }, [editing])

  const selected = editing ? range : null

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        title={selected ? undefined : t("accentHint")}
        disabled={editing && !selected}
        onClick={() =>
          selected ? setActiveNameAccent(selected) : setEditing(true)
        }
      >
        <Highlighter data-icon="inline-start" />
        {t("accent")}
      </Button>
      {accent && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("accentRemove")}
          title={t("accentRemove")}
          onClick={() =>
            editing
              ? setActiveNameAccent(undefined)
              : setField("content.accent", undefined)
          }
        >
          <Eraser />
        </Button>
      )}
    </>
  )
}

const SHAPES: {
  value: BadgeShape | undefined
  label:
    | "badgeShapeTemplate"
    | "badgeShapeSquare"
    | "badgeShapeRounded"
    | "badgeShapePill"
    | "badgeShapeNone"
  radius?: number
}[] = [
  { value: undefined, label: "badgeShapeTemplate" },
  { value: "square", label: "badgeShapeSquare", radius: 0 },
  { value: "rounded", label: "badgeShapeRounded", radius: 4 },
  { value: "pill", label: "badgeShapePill", radius: 999 },
  { value: "none", label: "badgeShapeNone" },
]

/** Forme de la pastille : rectangle, arrondi, pilule ou sans fond. */
function ShapeControls() {
  const t = useTranslations("inlineEditing")
  const shape = useCoverStore((state) => state.config.style.badgeShape)
  const setField = useCoverStore((state) => state.setField)
  const current = SHAPES.find((option) => option.value === shape) ?? SHAPES[0]

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("badgeShape")}
            title={t("badgeShape")}
          >
            <ShapePreview
              radius={current.radius}
              empty={!current.value || current.value === "none"}
            />
            <span className="max-w-24 truncate">{t(current.label)}</span>
          </Button>
        }
      />
      <PopoverContent side="bottom" className="w-56 gap-1 p-1">
        <div
          role="radiogroup"
          aria-label={t("badgeShape")}
          className="flex flex-col"
        >
          {SHAPES.map((option) => (
            <FontOption
              key={option.label}
              checked={option.value === shape}
              onSelect={() => setField("style.badgeShape", option.value)}
            >
              <span className="flex items-center gap-2.5">
                <ShapePreview
                  radius={option.radius}
                  empty={!option.value || option.value === "none"}
                />
                {t(option.label)}
              </span>
            </FontOption>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Petite pastille d'exemple ; pointillés pour « modèle » et « sans forme ». */
function ShapePreview({ radius, empty }: { radius?: number; empty: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-3 w-5 shrink-0 border-[1.5px] border-current",
        empty ? "border-dashed opacity-60" : "bg-current/15"
      )}
      style={{ borderRadius: radius ?? 3 }}
    />
  )
}

/** Fonctionnalités : ajout après la chip sélectionnée, suppression. */
function ChipControls({ index }: { index: number }) {
  const t = useTranslations("inlineEditing")
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("chipAdd")}
        title={t("chipAdd")}
        onClick={() => insertChip(index)}
      >
        <ListPlus />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("chipRemove")}
        title={t("chipRemove")}
        onClick={() => removeChip(index)}
      >
        <Trash2 />
      </Button>
    </>
  )
}

function Divider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px bg-border" />
}

function FontOption({
  checked,
  fontFamily,
  onSelect,
  children,
}: {
  checked: boolean
  fontFamily?: string
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      style={{ fontFamily }}
      className={cn(
        "flex h-9 items-center justify-between gap-2 rounded-md px-2.5 text-left text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        checked && "text-primary"
      )}
    >
      {children}
      {checked && <Check className="size-4" />}
    </button>
  )
}

/** Couleur affichée par le template, quand aucune n'est choisie. */
function computedColor(selector: string) {
  const node = document.querySelector<HTMLElement>(selector)
  return node ? cssToHex(getComputedStyle(node).color) : "#000000"
}

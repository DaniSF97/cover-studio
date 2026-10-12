import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react"

import { fontStack } from "@/lib/fonts"
import { clampRange, nameParts } from "@/lib/name"
import type {
  EditableField,
  TextElement,
  TextRange,
  TextSelection,
} from "@/types/cover"

import { TypographyContext } from "./typography"

/**
 * Édition directe sur l'aperçu (docs/INLINE-EDITING.md). Fourni par l'éditeur
 * pour l'aperçu principal uniquement : sans lui, les textes se rendent tels
 * quels (miniatures, export). Les templates n'accèdent jamais au store.
 */
export type EditingApi = {
  selection: TextSelection | null
  editing: boolean
  select: (selection: TextSelection) => void
  /** Passe le texte sélectionné en saisie. */
  startEditing: () => void
  /** Valeur saisie, à chaque frappe ; `accent` pour le nom seulement. */
  update: (
    field: EditableField,
    value: string,
    index?: number,
    accent?: TextRange
  ) => void
  /** Fin de saisie. */
  commit: (
    field: EditableField,
    value: string,
    index?: number,
    accent?: TextRange
  ) => void
  /** Ajoute une chip vide après `after` (en fin de liste sans rang) et la saisit. */
  addChip: (after?: number) => void
  maxLength: (field: EditableField) => number | undefined
  label: (field: EditableField, index?: number) => string
  /** Texte grisé d'un emplacement vide, jamais exporté. */
  placeholder: (field: EditableField) => string
  addChipLabel: string
}

export const EditingContext = createContext<EditingApi | null>(null)

export function fieldElement(field: EditableField): TextElement {
  return field
}

export function fieldPath(field: EditableField, index?: number) {
  return field === "chips" ? `content.chips.${index ?? 0}` : `content.${field}`
}

/** Vrai quand l'élément est en cours de saisie (pour lever un rognage, par ex.). */
export function useIsEditing(element: TextElement) {
  const editing = useContext(EditingContext)
  return Boolean(editing?.editing && editing.selection?.element === element)
}

/**
 * Faut-il rendre un élément ? Oui s'il a du contenu ; dans l'éditeur, un
 * élément vide reste rendu comme emplacement grisé pour pouvoir le remplir.
 */
export function useShowSlot() {
  const editing = useContext(EditingContext)
  return (value: string | string[] | undefined) =>
    Boolean(editing) ||
    (Array.isArray(value) ? value.length > 0 : Boolean(value))
}

/** Chips à afficher : une chip vide sert d'emplacement dans l'éditeur. */
export function useEditorChips(chips: string[]) {
  const editing = useContext(EditingContext)
  return editing && chips.length === 0 ? [""] : chips
}

/** Ajout d'une chip depuis l'aperçu, absent hors éditeur. */
export function useAddChip() {
  const editing = useContext(EditingContext)
  return editing
    ? { label: editing.addChipLabel, add: () => editing.addChip() }
    : null
}

// Point cliqué pour entrer en saisie : lu par le span de saisie à son montage.
let pendingCaret: { x: number; y: number } | null = null

// Nom en cours de saisie : la barre d'outils y pose l'accent sur la sélection.
let activeName: {
  element: HTMLElement
  setAccent: (range?: TextRange) => void
} | null = null

/** Lettres sélectionnées dans le nom en saisie, si la sélection n'est pas vide. */
export function selectedNameRange(): TextRange | null {
  if (!activeName) return null
  const range = selectionOffsets(activeName.element)
  return range && range.end > range.start ? range : null
}

/** Met en accent (ou retire l'accent de) la plage donnée du nom en saisie. */
export function setActiveNameAccent(range?: TextRange) {
  activeName?.setAccent(range)
}

type EditableTextProps = {
  field: EditableField
  text: string
  /** Rang de la chip, pour `field="chips"`. */
  index?: number
  /** Nom : partie en accent et son style (couleur d'accent du template…). */
  accent?: TextRange
  accentStyle?: CSSProperties
}

/** Texte d'un champ de contenu, modifiable sur place quand l'éditeur le permet. */
export function EditableText({
  field,
  text,
  index,
  accent,
  accentStyle,
}: EditableTextProps) {
  const editing = useContext(EditingContext)
  const typography = useContext(TypographyContext)
  const element = fieldElement(field)
  const font = typography?.textFont?.[element]
  // La couleur choisie vaut pour le texte ; l'accent garde son propre style.
  const color = typography?.textColor?.[element]
  const style: CSSProperties = {
    fontFamily: font ? fontStack(font) : undefined,
    color,
  }
  const rich = field === "name"
  const body = rich ? (
    <NameText name={text} accent={accent} accentStyle={accentStyle} />
  ) : (
    text
  )

  if (!editing)
    return font || color ? <span style={style}>{body}</span> : <>{body}</>

  const path = fieldPath(field, index)
  const selected = editing.selection?.path === path

  if (selected && editing.editing) {
    return (
      <ActiveText
        key="edit"
        path={path}
        initial={text}
        accent={accent}
        accentStyle={rich ? (accentStyle ?? {}) : undefined}
        style={style}
        label={editing.label(field, index)}
        placeholder={editing.placeholder(field)}
        maxLength={editing.maxLength(field)}
        onInput={(value, range) => editing.update(field, value, index, range)}
        onCommit={(value, range) => editing.commit(field, value, index, range)}
      />
    )
  }

  function enter(point?: { x: number; y: number }) {
    if (!editing) return
    if (!selected) editing.select({ element, path })
    pendingCaret = point ?? null
    editing.startEditing()
  }

  return (
    <span
      key="view"
      data-edit-path={path}
      data-editable=""
      data-selected={selected || undefined}
      role="button"
      tabIndex={0}
      aria-label={editing.label(field, index)}
      onClick={(event: MouseEvent) => {
        // Premier clic : sélection ; clic sur le texte déjà sélectionné : saisie.
        if (selected)
          enter(text ? { x: event.clientX, y: event.clientY } : undefined)
        else editing.select({ element, path })
      }}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        enter()
      }}
      style={{ ...style, cursor: "text" }}
    >
      {text ? (
        body
      ) : (
        // Emplacement vide : visible dans l'éditeur, absent de l'export.
        <span data-placeholder="" style={{ opacity: 0.45 }}>
          {editing.placeholder(field)}
        </span>
      )}
    </span>
  )
}

function NameText({
  name,
  accent,
  accentStyle,
}: {
  name: string
  accent?: TextRange
  accentStyle?: CSSProperties
}) {
  return nameParts(name, accent).map((part, index) =>
    part.accent ? (
      <span key={index} data-accent="" style={accentStyle}>
        {part.text}
      </span>
    ) : (
      part.text
    )
  )
}

type ActiveTextProps = {
  path: string
  initial: string
  accent?: TextRange
  /** Présent pour le nom : le texte porte un span d'accent. */
  accentStyle?: CSSProperties
  style: CSSProperties
  label: string
  placeholder: string
  maxLength?: number
  onInput: (value: string, accent?: TextRange) => void
  onCommit: (value: string, accent?: TextRange) => void
}

/**
 * Span en saisie, non contrôlé par React : le texte est posé au montage et lu à
 * chaque frappe, sinon chaque rendu replacerait le curseur. Pour le nom, le
 * span d'accent est dans le DOM : sa position donne la plage d'accent.
 */
function ActiveText({
  path,
  initial,
  accent,
  accentStyle,
  style,
  label,
  placeholder,
  maxLength,
  onInput,
  onCommit,
}: ActiveTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const committed = useRef(false)
  // Valeurs à l'entrée en saisie : les props suivent ensuite la frappe.
  const [start] = useState(() => ({ text: initial, accent }))
  const [caret] = useState(() => pendingCaret)
  const report = useRef(onInput)
  useLayoutEffect(() => {
    report.current = onInput
  })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    fill(element, start.text, start.accent, accentStyle)
    element.focus({ preventScroll: true })
    placeCaret(element, caret)
    pendingCaret = null
    if (!accentStyle) return
    const entry = {
      element,
      setAccent: (range?: TextRange) => {
        const selection = selectionOffsets(element)
        const text = element.textContent ?? ""
        fill(element, text, range, accentStyle)
        if (selection) restoreSelection(element, selection)
        report.current(text, clampRange(text, range))
      },
    }
    activeName = entry
    return () => {
      if (activeName === entry) activeName = null
    }
    // Pas de validation au démontage : chaque frappe est déjà dans le store, et
    // StrictMode démonte puis remonte cet effet en développement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function commit() {
    if (committed.current || !ref.current) return
    committed.current = true
    const { text, accent: range } = read(ref.current, Boolean(accentStyle))
    onCommit(text, range)
  }

  return (
    <span
      ref={ref}
      data-edit-path={path}
      data-editing=""
      data-placeholder={placeholder}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-label={label}
      aria-multiline={false}
      spellCheck={false}
      onInput={() => {
        const element = ref.current
        if (!element) return
        const rich = Boolean(accentStyle)
        const raw = read(element, rich)
        let value = raw.text.replace(/[\r\n]+/g, " ")
        if (maxLength && value.length > maxLength)
          value = value.slice(0, maxLength)
        const accent = clampRange(value, raw.accent)
        if (value !== raw.text) {
          fill(element, value, accent, accentStyle)
          placeCaret(element, null)
        } else if (!isCanonical(element, rich)) {
          // Le navigateur ajoute ses propres balises (<font color>, span
          // stylé repris d'un texte supprimé, <br>) : l'aperçu montrerait une
          // couleur que le modèle n'a pas. On reconstruit depuis le modèle.
          const selection = selectionOffsets(element)
          fill(element, value, accent, accentStyle)
          if (selection) restoreSelection(element, selection)
        }
        onInput(value, accent)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== "Escape") return
        event.preventDefault()
        // Échap ne doit pas aussi désélectionner : il quitte seulement la saisie.
        event.stopPropagation()
        ref.current?.blur()
      }}
      onBlur={commit}
      style={{
        ...style,
        cursor: "text",
        outline: "none",
        whiteSpace: "pre-wrap",
      }}
    />
  )
}

/** Remplit le span de saisie ; avec un style d'accent, l'accent devient un span. */
function fill(
  element: HTMLElement,
  text: string,
  accent: TextRange | undefined,
  accentStyle: CSSProperties | undefined
) {
  if (!accentStyle) {
    element.replaceChildren(...(text ? [document.createTextNode(text)] : []))
    return
  }
  element.replaceChildren(
    ...nameParts(text, accent).map((part) => {
      if (!part.accent) return document.createTextNode(part.text)
      const span = document.createElement("span")
      span.dataset.accent = ""
      applyStyle(span, accentStyle)
      span.textContent = part.text
      return span
    })
  )
}

/**
 * Vrai si le span de saisie ne contient que du texte et, pour le nom, un seul
 * span d'accent non vide : la forme produite par `fill`.
 */
function isCanonical(element: HTMLElement, rich: boolean) {
  let accents = 0
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent) return false
      continue
    }
    if (
      !rich ||
      !(node instanceof HTMLElement) ||
      !node.hasAttribute("data-accent")
    )
      return false
    accents += 1
    if (
      accents > 1 ||
      node.childNodes.length !== 1 ||
      node.firstChild?.nodeType !== Node.TEXT_NODE ||
      !node.textContent
    )
      return false
  }
  return true
}

/** Texte du span de saisie et, pour le nom, la plage couverte par l'accent. */
function read(element: HTMLElement, rich: boolean) {
  const text = element.textContent ?? ""
  const span = rich ? element.querySelector("[data-accent]") : null
  if (!span?.textContent) return { text }
  const start = offsetOf(element, span, 0)
  return { text, accent: { start, end: start + span.textContent.length } }
}

const UNITLESS = new Set([
  "opacity",
  "zIndex",
  "fontWeight",
  "lineHeight",
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
  "zoom",
])

/** Style React appliqué à un élément créé hors de React (nombres en px). */
function applyStyle(element: HTMLElement, style: CSSProperties) {
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || value === null || value === "") continue
    const property = key.startsWith("--")
      ? key
      : key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    const css =
      typeof value === "number" && !UNITLESS.has(key)
        ? `${value}px`
        : String(value)
    element.style.setProperty(property, css)
  }
}

/** Position dans le texte de l'élément d'un point (nœud, décalage) du DOM. */
function offsetOf(element: HTMLElement, node: Node, offset: number) {
  const range = document.createRange()
  range.setStart(element, 0)
  range.setEnd(node, offset)
  return range.toString().length
}

function selectionOffsets(element: HTMLElement): TextRange | null {
  const selection = window.getSelection()
  if (!selection?.rangeCount) return null
  const range = selection.getRangeAt(0)
  if (
    !element.contains(range.startContainer) ||
    !element.contains(range.endContainer)
  )
    return null
  return {
    start: offsetOf(element, range.startContainer, range.startOffset),
    end: offsetOf(element, range.endContainer, range.endOffset),
  }
}

/** Replace la sélection sur des positions du texte après reconstruction du DOM. */
function restoreSelection(element: HTMLElement, { start, end }: TextRange) {
  const locate = (position: number) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    let remaining = position
    let node = walker.nextNode()
    while (node) {
      const length = node.textContent?.length ?? 0
      if (remaining <= length) return { node, offset: remaining }
      remaining -= length
      node = walker.nextNode()
    }
    return { node: element, offset: element.childNodes.length }
  }
  const from = locate(start)
  const to = locate(end)
  const range = document.createRange()
  range.setStart(from.node, from.offset)
  range.setEnd(to.node, to.offset)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

/** Place le curseur au point donné s'il tombe dans l'élément, sinon en fin de texte. */
function placeCaret(
  element: HTMLElement,
  point: { x: number; y: number } | null
) {
  const selection = window.getSelection()
  if (!selection) return
  let range: Range | null = null
  if (point) {
    if (typeof document.caretPositionFromPoint === "function") {
      const position = document.caretPositionFromPoint(point.x, point.y)
      if (position && element.contains(position.offsetNode)) {
        range = document.createRange()
        range.setStart(position.offsetNode, position.offset)
      }
    } else if (typeof document.caretRangeFromPoint === "function") {
      const found = document.caretRangeFromPoint(point.x, point.y)
      if (found && element.contains(found.startContainer)) range = found
    }
  }
  if (range) {
    range.collapse(true)
  } else {
    range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
  }
  selection.removeAllRanges()
  selection.addRange(range)
}

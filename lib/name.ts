import type { TextRange } from "@/types/cover"

export type NamePart = { text: string; accent: boolean }

/** Plage ramenée dans le texte ; absente si elle est vide. */
export function clampRange(
  text: string,
  range?: TextRange
): TextRange | undefined {
  if (!range) return undefined
  const start = Math.max(0, Math.min(range.start, text.length))
  const end = Math.max(start, Math.min(range.end, text.length))
  return end > start ? { start, end } : undefined
}

/** Découpe le nom en parties normale / accent, sans partie vide. */
export function nameParts(name: string, accent?: TextRange): NamePart[] {
  const range = clampRange(name, accent)
  if (!range) return name ? [{ text: name, accent: false }] : []
  return [
    { text: name.slice(0, range.start), accent: false },
    { text: name.slice(range.start, range.end), accent: true },
    { text: name.slice(range.end), accent: false },
  ].filter((part) => part.text)
}

/**
 * Reporte une plage sur un texte modifié : la zone changée est déduite du plus
 * long préfixe et suffixe communs. Un ajout au bord de la plage reste dehors,
 * un ajout à l'intérieur l'agrandit, une suppression la réduit.
 */
export function rebaseRange(
  before: string,
  after: string,
  range?: TextRange
): TextRange | undefined {
  if (!range) return undefined
  if (before === after) return clampRange(after, range)
  let prefix = 0
  const max = Math.min(before.length, after.length)
  while (prefix < max && before[prefix] === after[prefix]) prefix++
  let suffix = 0
  while (
    suffix < max - prefix &&
    before[before.length - 1 - suffix] === after[after.length - 1 - suffix]
  )
    suffix++
  const changedEnd = before.length - suffix
  const delta = after.length - before.length

  // Plage prise dans une modification plus large (nom retapé) : elle disparaît ;
  // plage exactement remplacée : elle suit le nouveau texte.
  if (range.start >= prefix && range.end <= changedEnd) {
    const exact = range.start === prefix && range.end === changedEnd
    return exact
      ? clampRange(after, { start: prefix, end: after.length - suffix })
      : undefined
  }

  const move = (position: number, edge: "start" | "end") => {
    if (position < prefix || (position === prefix && edge === "end"))
      return position
    if (position > changedEnd || (position === changedEnd && edge === "start"))
      return position + delta
    // Dans la zone modifiée : le début se cale avant elle, la fin après.
    return edge === "start" ? prefix : after.length - suffix
  }

  return clampRange(after, {
    start: move(range.start, "start"),
    end: move(range.end, "end"),
  })
}

/** Nom et plage d'accent à partir des deux parties des anciennes versions. */
export function joinName(
  main: string,
  accent = ""
): { name: string; accent?: TextRange } {
  const name = `${main}${accent}`
  return {
    name,
    accent: clampRange(name, { start: main.length, end: name.length }),
  }
}

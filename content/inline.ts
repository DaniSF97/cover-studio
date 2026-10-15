import type { InlineText } from "./types"

/** `[ancre](cible)`, `` `code` `` ou `**gras**` dans un texte de contenu ; le reste est du texte. */
export const INLINE_TOKEN =
  /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g

/** Slugs visés par les liens `page:` d'un texte, pour vérifier le maillage interne. */
export function internalLinks(text: InlineText) {
  return [...text.matchAll(INLINE_TOKEN)]
    .map(([, , target]) => target)
    .filter((target): target is string => target?.startsWith("page:") ?? false)
    .map((target) => target.slice("page:".length))
}

/** Texte brut, sans balisage de lien ni de code (JSON-LD, attributs). */
export function plainText(text: InlineText) {
  return text.replace(
    INLINE_TOKEN,
    (_, anchor?: string, _target?: string, code?: string, strong?: string) =>
      anchor ?? code ?? strong ?? ""
  )
}

import { createContext, useContext, type CSSProperties } from "react"

import type { BadgeShape, CoverConfig, TextElement } from "@/types/cover"

/** Police et tailles choisies par l'utilisateur, lues par les blocs de texte. */
export const TypographyContext = createContext<CoverConfig["style"] | null>(
  null
)

/** Multiplicateur de taille d'un élément de texte (1 si non réglé). */
export function useTextScale(element: TextElement) {
  return useContext(TypographyContext)?.textScale?.[element] ?? 1
}

const BADGE_SHAPES: Record<BadgeShape, CSSProperties> = {
  square: { borderRadius: 0 },
  // En em : l'arrondi suit la taille de la pastille.
  rounded: { borderRadius: "0.6em" },
  pill: { borderRadius: 999 },
  none: {
    background: "transparent",
    border: "none",
    boxShadow: "none",
    paddingLeft: 0,
    paddingRight: 0,
  },
}

/** Style de la forme choisie, à appliquer après celui du template (vide sinon). */
export function useBadgeShape(): CSSProperties {
  const shape = useContext(TypographyContext)?.badgeShape
  return shape ? BADGE_SHAPES[shape] : {}
}

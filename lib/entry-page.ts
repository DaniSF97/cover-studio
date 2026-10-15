import { stripLocale } from "@/i18n/paths"

import { findPage, type PageKind } from "./pages"

/**
 * Page d'entrée de la session : la première page vue dans l'onglet. Jointe à
 * l'événement d'export pour mesurer les exports par page d'entrée (docs/SEO.md).
 */
export type EntryPage = {
  /** Type de page du registre, ou « other » (éditeur ouvert directement, etc.). */
  type: PageKind | "other"
  /** Slug de la page ; « / » pour la Landing, le chemin sans langue sinon. */
  slug: string
}

export const ENTRY_PAGE_KEY = "cover-studio-entry"

type SessionStore = Pick<Storage, "getItem" | "setItem">

/** Page d'entrée correspondant à un chemin (`/en/readme-banner`). */
export function entryPageFor(pathname: string): EntryPage {
  // Hébergement statique : `/en/readme-banner/` ou `/en/readme-banner.html` selon le serveur.
  const clean = pathname.replace(/\.html$/, "").replace(/(.)\/+$/, "$1")
  const [, locale = ""] = clean.split("/")
  const path = stripLocale(clean)
  const page = findPage(locale, path === "/" ? "" : path.slice(1))
  if (!page) return { type: "other", slug: path }
  return { type: page.kind, slug: page.slug || "/" }
}

/** Retient la page d'entrée si la session n'en a pas encore. */
export function rememberEntryPage(storage: SessionStore, pathname: string) {
  try {
    if (storage.getItem(ENTRY_PAGE_KEY)) return
    storage.setItem(ENTRY_PAGE_KEY, JSON.stringify(entryPageFor(pathname)))
  } catch {
    // Stockage indisponible (navigation privée stricte) : la mesure s'en passe.
  }
}

/** Page d'entrée retenue, ou `undefined` si inconnue. */
export function readEntryPage(storage: SessionStore): EntryPage | undefined {
  try {
    const saved = storage.getItem(ENTRY_PAGE_KEY)
    return saved ? (JSON.parse(saved) as EntryPage) : undefined
  } catch {
    return undefined
  }
}

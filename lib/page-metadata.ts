import type { Metadata } from "next"

import { OPEN_GRAPH_LOCALES } from "@/i18n/routing"

import {
  alternateLanguages,
  pagePath,
  translationsOf,
  type SitePage,
} from "./pages"

type PageMeta = {
  /** Titre propre à la page ; le gabarit du layout ajoute « · Cover Studio ». */
  title: string
  description: string
  /** Titre complet, sans gabarit (la Landing porte déjà le nom du site). */
  absoluteTitle?: boolean
  ogImage: { url: string; width: number; height: number; alt: string }
}

/**
 * Métadonnées d'une page indexable : canonique vers elle-même, hreflang entre
 * traductions réelles seulement, Open Graph et Twitter complets (Next fusionne
 * les métadonnées de façon superficielle : la page remplace ceux du layout).
 */
export function pageMetadata(page: SitePage, meta: PageMeta): Metadata {
  const path = pagePath(page)
  const languages = alternateLanguages(page)
  const others = translationsOf(page).filter(
    (other) => other.locale !== page.locale
  )
  const title = meta.absoluteTitle ? { absolute: meta.title } : meta.title

  return {
    title,
    description: meta.description,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    alternates: { canonical: path, ...(languages && { languages }) },
    openGraph: {
      type: "website",
      url: path,
      siteName: "Cover Studio",
      title: meta.title,
      description: meta.description,
      locale: OPEN_GRAPH_LOCALES[page.locale],
      ...(others.length > 0 && {
        alternateLocale: others.map(
          (other) => OPEN_GRAPH_LOCALES[other.locale]
        ),
      }),
      images: [meta.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [{ url: meta.ogImage.url, alt: meta.ogImage.alt }],
    },
  }
}

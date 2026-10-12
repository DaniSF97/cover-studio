import type { MetadataRoute } from "next"

import { locales } from "@/i18n/routing"
import { SITE_URL } from "@/lib/site"

// Généré au build : obligatoire avec `output: "export"`.
export const dynamic = "force-static"

// Seules les landings sont indexables : l'éditeur est en noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((locale) => [locale, `${SITE_URL}/${locale}`])),
    "x-default": SITE_URL,
  }

  // Date du build : le site est statique, le contenu change à chaque déploiement.
  const lastModified = new Date()

  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }))
}

import type { MetadataRoute } from "next"

import { PAGES, alternateLanguages, pagePath } from "@/lib/pages"
import { SITE_URL } from "@/lib/site"

// Généré au build : obligatoire avec `output: "export"`.
export const dynamic = "force-static"

// Les pages indexables viennent du registre (lib/pages.ts) ; l'éditeur, en noindex, n'y est pas.
// `lastModified` est la date réelle du contenu, pas celle du build : Google ignore
// une date qui change à chaque déploiement.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => {
    const languages = alternateLanguages(page)
    return {
      url: `${SITE_URL}${pagePath(page)}`,
      lastModified: page.updatedAt,
      ...(languages && {
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([lang, path]) => [
              lang,
              `${SITE_URL}${path}`,
            ])
          ),
        },
      }),
    }
  })
}

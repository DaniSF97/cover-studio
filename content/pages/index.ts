import type { Locale } from "@/i18n/routing"
import { pagePath, pagesOf, type SitePage } from "@/lib/pages"

import type { PageContent, PageLink } from "../types"
import githubSocialPreviewEn from "./github-social-preview.en"
import mockupSiteWebFr from "./mockup-site-web.fr"
import readmeBannerEn from "./readme-banner.en"
import websiteMockupFromUrlEn from "./website-mockup-from-url.en"

/** Contenu de chaque page indexable hors Landing, par chemin (`/en/readme-banner`). */
export const PAGE_CONTENT: Record<string, PageContent> = {
  "/en/github-social-preview": githubSocialPreviewEn,
  "/en/readme-banner": readmeBannerEn,
  "/en/website-mockup-from-url": websiteMockupFromUrlEn,
  "/fr/mockup-site-web": mockupSiteWebFr,
}

export function contentFor(page: SitePage): PageContent | undefined {
  return PAGE_CONTENT[pagePath(page)]
}

/**
 * Use-case pages et Feature pages d'une langue, dans l'ordre du registre. Calculé côté
 * serveur et passé en props : ni le registre ni le contenu ne partent au navigateur.
 */
export function pageLinks(locale: Locale): PageLink[] {
  return pagesOf(locale, ["use-case", "feature"]).flatMap((page) => {
    const content = contentFor(page)
    return content
      ? [{ slug: page.slug, label: content.label, summary: content.summary }]
      : []
  })
}

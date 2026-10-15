import { pagePath, type SitePage } from "@/lib/pages"

import type { PageContent } from "../types"
import githubSocialPreviewEn from "./github-social-preview.en"

/** Contenu de chaque page indexable hors Landing, par chemin (`/en/readme-banner`). */
export const PAGE_CONTENT: Record<string, PageContent> = {
  "/en/github-social-preview": githubSocialPreviewEn,
}

export function contentFor(page: SitePage): PageContent | undefined {
  return PAGE_CONTENT[pagePath(page)]
}

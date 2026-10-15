import { existsSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { internalLinks } from "@/content/inline"
import { PAGE_CONTENT, contentFor } from "@/content/pages"
import type { InlineText, PageContent } from "@/content/types"
import { PAGES, findPage, pagePath } from "@/lib/pages"

const contentPages = PAGES.filter(
  (page) => page.kind !== "landing" && page.kind !== "guide"
)

/** Tous les textes en ligne d'une page, là où un lien peut apparaître. */
function texts(content: PageContent): InlineText[] {
  return [
    content.intro,
    ...content.sections.flatMap((section) =>
      section.blocks.flatMap((block) => {
        switch (block.type) {
          case "p":
            return [block.text]
          case "list":
            return block.items
          case "table":
            return block.rows.flat()
          case "figure":
            return block.caption ? [block.caption] : []
          default:
            return []
        }
      })
    ),
    ...content.faq.map(({ answer }) => answer),
  ]
}

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

describe.each(contentPages.map((page) => [pagePath(page), page] as const))(
  "%s",
  (_, page) => {
    const content = contentFor(page)!

    it("a un contenu", () => {
      expect(content).toBeDefined()
    })

    it("porte son mot-clé principal dans le H1", () => {
      const h1 = new Set(words(content.h1))
      expect(
        words(page.primaryKeyword).filter((word) => !h1.has(word))
      ).toEqual([])
    })

    it("a un title et une description à la bonne longueur", () => {
      expect(`${content.title} · Cover Studio`.length).toBeLessThanOrEqual(75)
      expect(content.description.length).toBeGreaterThanOrEqual(70)
      expect(content.description.length).toBeLessThanOrEqual(170)
    })

    it("ne lie que des pages existantes de sa langue", () => {
      for (const slug of texts(content).flatMap(internalLinks)) {
        expect(
          findPage(page.locale, slug),
          `lien vers « ${slug} »`
        ).toBeDefined()
      }
    })

    it("lie chacune de ses pages sœurs dans le corps", () => {
      const linked = new Set(texts(content).flatMap(internalLinks))
      for (const sister of page.sisters ?? []) expect(linked).toContain(sister)
    })

    it("a ses images dans public/", () => {
      const images = [
        content.ogImage.src,
        ...content.sections.flatMap((section) =>
          section.blocks.flatMap((block) =>
            block.type === "figure" ? [block.src] : []
          )
        ),
      ]
      for (const src of images) {
        expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true)
      }
    })

    it("a une FAQ", () => {
      expect(content.faq.length).toBeGreaterThan(0)
    })
  }
)

it("n'a pas de contenu orphelin, hors registre", () => {
  const registered = new Set(contentPages.map(pagePath))
  expect(
    Object.keys(PAGE_CONTENT).filter((path) => !registered.has(path))
  ).toEqual([])
})

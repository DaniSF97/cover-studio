import { createElement, type ComponentProps } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { I18nProvider } from "@/i18n/provider"
import { placeImages } from "@/lib/slots"
import { EditingContext, type EditingApi } from "@/templates/shared/editable"
import { TypographyContext } from "@/templates/shared/typography"
import { templates } from "@/templates/registry"
import { defaultConfig } from "@/templates/showcase/defaults"
import type { CoverConfig, Template } from "@/types/cover"

const noop = () => {}
const api: EditingApi = {
  selection: null,
  editing: false,
  select: noop,
  startEditing: noop,
  update: noop,
  commit: noop,
  maxLength: () => undefined,
  label: (field) => field,
  placeholder: (field) => `[${field}]`,
  addChip: noop,
  addChipLabel: "add-chip",
}

function render(template: Template, config: CoverConfig, editing: EditingApi | null) {
  const cover = createElement(template.component, { config: placeImages(config, template) })
  return renderToStaticMarkup(
    createElement(
      I18nProvider,
      // Les enfants passent en 3e argument ; le type des props les exige.
      { locale: "en" } as ComponentProps<typeof I18nProvider>,
      createElement(
        TypographyContext,
        { value: config.style },
        createElement(EditingContext, { value: editing }, cover)
      )
    )
  )
}

/** Édition directe (docs/INLINE-EDITING.md) : contrat valable pour tout template. */
describe.each(templates)("édition directe du template « $id »", (template) => {
  const config = { ...defaultConfig("en"), template: template.id }

  it("expose ses textes à l'édition sur l'aperçu principal", () => {
    const html = render(template, config, api)
    for (const path of ["content.badge", "content.name", "content.description", "content.chips.0", "content.footer"]) {
      expect(html, path).toContain(`data-edit-path="${path}"`)
    }
  })

  it("ne rend rien d'éditable sans contexte (miniatures, export)", () => {
    const html = render(template, config, null)
    expect(html).not.toContain("data-edit-path")
    expect(html).not.toContain("add-chip")
  })

  it("garde un emplacement pour chaque texte vidé, dans l'éditeur seulement", () => {
    const empty: CoverConfig = {
      ...config,
      content: { ...config.content, badge: "", name: "", description: "", chips: [], footer: "" },
    }
    const editor = render(template, empty, api)
    for (const field of ["badge", "name", "description", "chips", "footer"]) {
      expect(editor, field).toContain(`[${field}]`)
    }
    const clean = render(template, empty, null)
    expect(clean).not.toContain("data-placeholder")
    expect(clean).not.toMatch(/\[(badge|name|description|chips|footer)\]/)
  })

  it("affiche la partie en accent du nom dans un span à part", () => {
    const named: CoverConfig = {
      ...config,
      content: { ...config.content, name: "OngolaPhone", accent: { start: 6, end: 11 } },
    }
    expect(render(template, named, null)).toMatch(/Ongola<span[^>]*data-accent[^>]*>Phone<\/span>/)
  })

  it("applique la police et la couleur choisies par élément", () => {
    const styled: CoverConfig = {
      ...config,
      style: {
        ...config.style,
        textColor: { name: "#123456" },
        textFont: { description: "playfair" },
      },
    }
    const html = render(template, styled, null)
    expect(html).toContain("color:#123456")
    expect(html).toContain("var(--font-playfair)")
  })
})

describe("forme de la pastille", () => {
  const template = templates.find((item) => item.id === "showcase")!
  const base = defaultConfig("en")
  const badge = (shape?: CoverConfig["style"]["badgeShape"]) => {
    const html = render(template, { ...base, style: { ...base.style, badgeShape: shape } }, null)
    // Le conteneur de la pastille précède directement son texte.
    const text = base.content.badge
    return html.slice(html.lastIndexOf("<div", html.indexOf(text)), html.indexOf(text))
  }

  it("garde la forme du template par défaut", () => {
    expect(badge()).toContain("border-radius:999px")
  })

  it("applique la forme choisie", () => {
    expect(badge("square")).toContain("border-radius:0")
    expect(badge("rounded")).toContain("border-radius:0.6em")
    expect(badge("none")).toContain("background:transparent")
    expect(badge("none")).toContain("border:none")
  })
})

/**
 * Contenu rédactionnel des pages indexables autres que la Landing (Use-case pages,
 * Feature pages…). Il vit ici, une page par fichier et par langue, plutôt que dans
 * `messages/*.json` : ces pages n'existent que dans les langues où la recherche
 * existe (docs/SEO.md), alors que les messages imposent la parité des clés.
 *
 * Texte en ligne : `[ancre](page:slug)` lie une page de la même langue,
 * `[ancre](https://…)` un site externe, `` `code` `` du code, `**gras**` du gras.
 */
export type InlineText = string

export type Block =
  | { type: "p"; text: InlineText }
  | { type: "list"; items: InlineText[]; ordered?: boolean }
  | { type: "table"; caption: string; head: string[]; rows: InlineText[][] }
  | { type: "code"; label: string; code: string }
  | {
      type: "figure"
      /** Image sous `public/`, générée avec Cover Studio (pnpm seo:visuals). */
      src: string
      alt: string
      caption?: InlineText
      width: number
      height: number
    }

export type ContentSection = {
  /** Titre H2 de la section. */
  heading: string
  blocks: Block[]
}

export type PageContent = {
  /** Balise <title>, sans le nom du site (ajouté par le gabarit). */
  title: string
  description: string
  h1: string
  /** Libellé court des liens vers la page (pied de page, fil d'Ariane, Destinations). */
  label: string
  /** Une phrase sur la page, sous son lien dans la section Destinations de la Landing. */
  summary: string
  /** Accroche sous le H1, au-dessus du bloc de démarrage. */
  intro: InlineText
  sections: ContentSection[]
  faq: { question: string; answer: InlineText }[]
  ogImage: { src: string; alt: string }
}

/** Lien vers une page de contenu, calculé côté serveur pour la Landing et le pied de page. */
export type PageLink = { slug: string; label: string; summary: string }

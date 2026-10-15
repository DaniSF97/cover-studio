import { FAQ_ITEMS } from "@/components/landing/faq-items"
import { plainText } from "@/content/inline"
import type { PageContent } from "@/content/types"
import { MESSAGES } from "@/i18n/messages"
import { locales, type Locale } from "@/i18n/routing"
import { createTranslator } from "@/i18n/translator"

import { pagePath, type SitePage } from "./pages"
import { GITHUB_URL, SITE_URL } from "./site"

const MIT_URL = "https://opensource.org/licenses/MIT"

// Identifiants partagés : les pages de contenu renvoient à l'application décrite sur la Landing.
const WEBSITE_ID = `${SITE_URL}/#website`
const APP_ID = `${SITE_URL}/#app`

/** Données structurées (schema.org) de la landing, dans la langue de la page. */
export function landingStructuredData(locale: Locale) {
  const messages = MESSAGES[locale]
  const meta = createTranslator(messages, "meta")
  const faq = createTranslator(messages, "faq")
  const url = `${SITE_URL}/${locale}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "Cover Studio",
        url,
        inLanguage: locale,
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Cover Studio",
        url: SITE_URL,
        logo: `${SITE_URL}/android-chrome-512x512.png`,
        sameAs: [GITHUB_URL],
      },
      {
        "@type": "SoftwareApplication",
        "@id": APP_ID,
        name: "Cover Studio",
        url,
        image: `${SITE_URL}/og-image.png`,
        description: meta("siteDescription"),
        applicationCategory: "DesignApplication",
        operatingSystem: "Any (web browser)",
        inLanguage: [...locales],
        isAccessibleForFree: true,
        license: MIT_URL,
        featureList: meta("appFeatures"),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        sameAs: [GITHUB_URL],
      },
      {
        "@type": "SoftwareSourceCode",
        name: "Cover Studio",
        codeRepository: GITHUB_URL,
        programmingLanguage: "TypeScript",
        license: MIT_URL,
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
          "@type": "Question",
          name: faq(question),
          acceptedAnswer: { "@type": "Answer", text: faq(answer) },
        })),
      },
    ],
  }
}

/**
 * Données structurées d'une Use-case page ou d'une Feature page : la page, son fil
 * d'Ariane et sa FAQ, reliés à l'application par son `@id`.
 */
export function contentPageStructuredData(
  page: SitePage,
  content: PageContent
) {
  const url = `${SITE_URL}${pagePath(page)}`
  const home = `${SITE_URL}/${page.locale}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: content.title,
        description: content.description,
        inLanguage: page.locale,
        dateModified: page.updatedAt,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": APP_ID },
        primaryImageOfPage: `${SITE_URL}${content.ogImage.src}`,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Cover Studio",
            item: home,
          },
          { "@type": "ListItem", position: 2, name: content.label, item: url },
        ],
      },
      ...(content.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              inLanguage: page.locale,
              mainEntity: content.faq.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: plainText(answer) },
              })),
            },
          ]
        : []),
    ],
  }
}

/** Sérialise pour une balise <script> : `<` échappé pour que le JSON ne ferme jamais la balise. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

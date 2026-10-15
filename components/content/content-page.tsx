import NextLink from "next/link"

import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { StartSection } from "@/components/landing/start-section"
import { pageLinks } from "@/content/pages"
import type { Block, PageContent } from "@/content/types"
import { MESSAGES } from "@/i18n/messages"
import { localizePath } from "@/i18n/paths"
import { createTranslator } from "@/i18n/translator"
import { localePaths, type SitePage } from "@/lib/pages"

import { RichText } from "./rich-text"

type Props = { page: SitePage; content: PageContent }

/**
 * Use-case page ou Feature page : le bloc de démarrage répond à l'intention
 * (l'export format de la page est présélectionné), le contenu vient dessous.
 */
export function ContentPage({ page, content }: Props) {
  const { locale } = page
  const t = createTranslator(MESSAGES[locale], "contentPage")
  const tFaq = createTranslator(MESSAGES[locale], "faq")

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader localePaths={localePaths(page)} />

      <main className="flex flex-col">
        <StartSection
          exportSize={page.exportSize}
          source={page.startSource}
          heading={
            <>
              <nav
                aria-label={t("breadcrumbLabel")}
                className="text-sm text-muted-foreground"
              >
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <NextLink
                      href={localizePath(locale, "/")}
                      className="rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      Cover Studio
                    </NextLink>
                  </li>
                  <li aria-hidden>/</li>
                  <li aria-current="page" className="text-foreground">
                    {content.label}
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {content.h1}
              </h1>
              <p className="max-w-lg text-base text-muted-foreground">
                <RichText text={content.intro} locale={locale} />
              </p>
            </>
          }
        />

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-4 py-16">
          {content.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-5">
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.heading}
              </h2>
              {section.blocks.map((block, index) => (
                <ContentBlock key={index} block={block} locale={locale} />
              ))}
            </section>
          ))}

          {content.faq.length > 0 && (
            <section
              aria-labelledby="page-faq-title"
              className="flex flex-col gap-6"
            >
              <h2
                id="page-faq-title"
                className="text-2xl font-semibold tracking-tight"
              >
                {tFaq("title")}
              </h2>
              <div className="flex flex-col gap-3">
                {content.faq.map(({ question, answer }) => (
                  <details
                    key={question}
                    className="group rounded-xl border border-border bg-background px-5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                      {question}
                    </summary>
                    <p className="pb-4 text-sm text-muted-foreground">
                      <RichText text={answer} locale={locale} />
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter destinations={pageLinks(locale)} />
    </div>
  )
}

function ContentBlock({
  block,
  locale,
}: {
  block: Block
  locale: SitePage["locale"]
}) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-7 text-muted-foreground">
          <RichText text={block.text} locale={locale} />
        </p>
      )
    case "list": {
      const List = block.ordered ? "ol" : "ul"
      return (
        <List
          className={`flex flex-col gap-2 pl-5 leading-7 text-muted-foreground ${block.ordered ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} locale={locale} />
            </li>
          ))}
        </List>
      )
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-muted/60">
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="px-4 py-2.5 font-semibold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-border">
                  {row.map((cell, index) => (
                    <td
                      key={index}
                      className="px-4 py-2.5 text-muted-foreground"
                    >
                      <RichText text={cell} locale={locale} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "code":
      return (
        <pre
          aria-label={block.label}
          className="overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 font-mono text-[13px] leading-6"
        >
          <code>{block.code}</code>
        </pre>
      )
    case "figure":
      return (
        <figure className="flex flex-col gap-2">
          {/* Export statique : les images sont déjà au bon format (WebP), sans optimiseur. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-xl border border-border shadow-sm"
          />
          {block.caption && (
            <figcaption className="text-sm text-muted-foreground">
              <RichText text={block.caption} locale={locale} />
            </figcaption>
          )}
        </figure>
      )
  }
}

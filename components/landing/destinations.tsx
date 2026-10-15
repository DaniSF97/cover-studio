"use client"

import { ArrowRight } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "@/i18n/provider"
import { pagesOf } from "@/lib/pages"

/**
 * Liens de la Landing vers les Use-case pages et Feature pages de sa langue, tirés
 * du registre : le haut du cocon (docs/SEO.md). Masquée s'il n'y en a aucune.
 */
export function Destinations() {
  const t = useTranslations("landing")
  const locale = useLocale()
  const pages = pagesOf(locale, ["use-case", "feature"])
  if (pages.length === 0) return null

  return (
    <section
      aria-labelledby="destinations-title"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="destinations-title"
          className="text-2xl font-semibold tracking-tight"
        >
          {t("destinationsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("destinationsText")}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={`/${page.slug}`}
              className="group flex h-full flex-col gap-2 rounded-2xl border border-border bg-background p-5 transition-colors outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex items-center justify-between gap-3 font-semibold">
                {page.label}
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </span>
              <span className="text-sm text-muted-foreground">
                {page.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

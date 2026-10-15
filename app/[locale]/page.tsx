import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Landing } from "@/components/landing/landing"
import { MESSAGES } from "@/i18n/messages"
import { hasLocale } from "@/i18n/routing"
import { createTranslator } from "@/i18n/translator"
import { pageMetadata } from "@/lib/page-metadata"
import { findPage } from "@/lib/pages"
import { landingStructuredData, serializeJsonLd } from "@/lib/structured-data"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = findPage(locale, "")
  if (!hasLocale(locale) || !page) return {}

  const t = createTranslator(MESSAGES[locale], "meta")
  return pageMetadata(page, {
    title: t("siteTitle"),
    absoluteTitle: true,
    description: t("siteDescription"),
    ogImage: {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: t("ogImageAlt"),
    },
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(landingStructuredData(locale)),
        }}
      />
      <Landing />
    </>
  )
}

"use client"

import { Download, ImageUp, Palette, type LucideIcon } from "lucide-react"

import { useTranslations } from "@/i18n/provider"

import { Faq } from "./faq"
import { OpenSourceSection } from "./open-source"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { StartSection } from "./start-section"

// Textes dans le namespace `landing` : seules les icônes et les clés vivent ici.
const STEPS: {
  icon: LucideIcon
  title: "step1Title" | "step2Title" | "step3Title"
  text: "step1Text" | "step2Text" | "step3Text"
}[] = [
  { icon: ImageUp, title: "step1Title", text: "step1Text" },
  { icon: Palette, title: "step2Title", text: "step2Text" },
  { icon: Download, title: "step3Title", text: "step3Text" },
]

export function Landing() {
  const t = useTranslations("landing")

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      <main className="flex flex-col">
        <StartSection
          heading={
            <>
              <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {t("heroTitle")}
              </h1>
              <p className="max-w-lg text-base text-muted-foreground">
                {t("heroText")}
              </p>
            </>
          }
        />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16">
          <section aria-labelledby="how-title" className="flex flex-col gap-8">
            <h2
              id="how-title"
              className="text-2xl font-semibold tracking-tight"
            >
              {t("howTitle")}
            </h2>
            <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, text }, index) => (
                <li
                  key={title}
                  className="flex flex-col gap-4 bg-background p-6"
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon className="size-5 text-primary" />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-semibold">{t(title)}</span>
                    <span className="text-sm text-muted-foreground">
                      {t(text)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <OpenSourceSection />
          <Faq />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

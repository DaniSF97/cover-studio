"use client"

import { saveLocale } from "@/i18n/detect"
import { usePathname } from "@/i18n/navigation"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "@/i18n/provider"
import { LOCALE_NAMES, locales, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  /** `onGradient` : texte blanc, pour la barre colorée de l'éditeur. */
  tone?: "default" | "onGradient"
  className?: string
  /** Chemin (sans préfixe) de la page dans chaque langue, quand il diffère du chemin courant. */
  paths?: Partial<Record<Locale, string>>
}

export function LocaleSwitcher({ tone = "default", className, paths }: Props) {
  const t = useTranslations("localeSwitcher")
  const current = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Select
      value={current}
      onValueChange={(value: string) => {
        const locale = value as Locale
        saveLocale(locale)

    const targetPath = paths?.[locale] ?? pathname
    router.replace(`/${locale}${targetPath === "/" ? "" : targetPath}`)
  }}
>
      <SelectTrigger
        aria-label={t("label")}
        className={cn(
          "h-8 w-auto min-w-[76px] gap-1 px-2 text-xs font-semibold uppercase",
          tone === "onGradient" &&
            "border-white/30 bg-white/10 text-white focus:ring-white/60",
          className
        )}
      >
        <SelectValue>{LOCALE_NAMES[current]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {LOCALE_NAMES[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
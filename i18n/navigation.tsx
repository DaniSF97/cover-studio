"use client"

import NextLink from "next/link"
import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation"
import { useMemo, type ComponentProps } from "react"

import { localizePath, stripLocale } from "./paths"
import { useLocale } from "./provider"
import type { Locale } from "./routing"

export { localizePath, stripLocale }

// Équivalents de next/link et next/navigation qui gardent la langue courante.
// Les chemins passés et reçus sont toujours sans préfixe de langue.
export function Link({
  href,
  locale,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string; locale?: Locale }) {
  const current = useLocale()
  return <NextLink href={localizePath(locale ?? current, href)} {...props} />
}

export function usePathname() {
  return stripLocale(useNextPathname())
}

export function useRouter() {
  const router = useNextRouter()
  const locale = useLocale()

  return useMemo(
    () => ({
      push: (href: string) => router.push(localizePath(locale, href)),
      replace: (href: string) => router.replace(localizePath(locale, href)),
      prefetch: (href: string) => router.prefetch(localizePath(locale, href)),
    }),
    [router, locale]
  )
}

import { hasLocale, type Locale } from "./routing"

// Sans React : utilisable côté serveur et dans lib/.

/** `/editor` + `fr` → `/fr/editor`. */
export function localizePath(locale: Locale, href: string) {
  return href === "/" ? `/${locale}` : `/${locale}${href}`
}

/** `/fr/editor` → `/editor`. Sans préfixe de langue, le chemin est rendu tel quel. */
export function stripLocale(pathname: string) {
  const [, first] = pathname.split("/")
  if (!hasLocale(first)) return pathname
  return pathname.slice(first.length + 1) || "/"
}

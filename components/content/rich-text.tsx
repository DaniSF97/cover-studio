import NextLink from "next/link"
import type { ReactNode } from "react"

import { INLINE_TOKEN } from "@/content/inline"
import type { InlineText } from "@/content/types"
import { localizePath } from "@/i18n/paths"
import type { Locale } from "@/i18n/routing"

const LINK_CLASS =
  "rounded-sm font-medium text-foreground underline underline-offset-4 outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"

/** Rend un texte de contenu (content/types.ts) : liens internes et externes, code, gras. */
export function RichText({
  text,
  locale,
}: {
  text: InlineText
  locale: Locale
}) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_TOKEN)) {
    const [whole, anchor, target, code, strong] = match
    if (match.index > last) parts.push(text.slice(last, match.index))
    const key = match.index
    if (strong !== undefined) {
      parts.push(
        <strong key={key} className="font-semibold text-foreground">
          {strong}
        </strong>
      )
    } else if (code !== undefined) {
      parts.push(
        <code
          key={key}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        >
          {code}
        </code>
      )
    } else if (target.startsWith("page:")) {
      const slug = target.slice("page:".length)
      parts.push(
        <NextLink
          key={key}
          href={localizePath(locale, slug ? `/${slug}` : "/")}
          className={LINK_CLASS}
        >
          {anchor}
        </NextLink>
      )
    } else {
      parts.push(
        <a
          key={key}
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {anchor}
        </a>
      )
    }
    last = match.index + whole.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

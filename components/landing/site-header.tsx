"use client"

import { GithubIcon } from "@/components/github-icon"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/provider"
import type { Locale } from "@/i18n/routing"
import { LINKS } from "@/lib/site"
import { cn } from "@/lib/utils"

type Props = {
  /**
   * Chemins (sans préfixe) de cette page dans chaque langue : une page qui n'existe
   * pas dans une langue renvoie vers sa Landing. Absent : même chemin partout.
   */
  localePaths?: Partial<Record<Locale, string>>
}

/** En-tête des pages publiques : le logo ramène à la Landing de la langue courante. */
export function SiteHeader({ localePaths }: Props) {
  const t = useTranslations("landing")

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Logo className="size-8" />
          <span className="font-semibold tracking-tight">Cover Studio</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("githubAria")}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-1.5"
            )}
          >
            <GithubIcon className="size-4" />
            {t("github")}
          </a>
          <LocaleSwitcher paths={localePaths} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

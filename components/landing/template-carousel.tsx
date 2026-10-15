"use client"

import { Check, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useState, useSyncExternalStore, type CSSProperties } from "react"

import { FitPreview } from "@/components/editor/fit-preview"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/i18n/provider"
import { cn } from "@/lib/utils"
import { templates } from "@/templates/registry"
import type { CoverConfig } from "@/types/cover"

/** Durée d'affichage d'un modèle avant de passer au suivant. */
const INTERVAL = 4000

/**
 * Place de chaque carte de la pile selon son écart avec la diapositive
 * affichée : -1 sort par la gauche, 0 est au premier plan, 1 et 2 dépassent
 * en haut, en retrait, et 3 attend, invisible, au fond de la pile.
 */
const STACK: Record<
  number,
  { transform: string; opacity: number; shade: number }
> = {
  [-1]: {
    transform: "translate3d(-38%, 4%, 0) rotate(-6deg) scale(0.94)",
    opacity: 0,
    shade: 0,
  },
  0: { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1, shade: 0 },
  1: {
    transform: "translate3d(0, -5%, 0) scale(0.93)",
    opacity: 1,
    shade: 0.35,
  },
  2: {
    transform: "translate3d(0, -10%, 0) scale(0.86)",
    opacity: 1,
    shade: 0.6,
  },
  3: {
    transform: "translate3d(0, -10%, 0) scale(0.79)",
    opacity: 0,
    shade: 0.8,
  },
}
/** Hauteur visible des cartes du fond, en part de la hauteur d'une carte. */
const PEEK = 0.1
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

type TemplateCarouselProps = {
  /** Configuration d'aperçu (textes, couleur, captures) ; le modèle est celui de la diapositive. */
  config: CoverConfig
  picked?: string
  onPick: (id: string | undefined) => void
}

/**
 * Carrousel des modèles en pile : le modèle affiché au premier plan, les
 * suivants en retrait derrière lui. Défilement automatique rythmé par une jauge
 * (en pause au survol, au focus ou si l'utilisateur réduit les animations).
 * Cliquer sur la carte de devant choisit le modèle, cliquer à nouveau l'annule.
 */
export function TemplateCarousel({
  config,
  picked,
  onPick,
}: TemplateCarouselProps) {
  const t = useTranslations("landing")
  const tTemplates = useTranslations("templates")
  const count = templates.length
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      templates.findIndex((template) => template.id === picked)
    )
  )
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const reducedMotion = useReducedMotion()
  const autoplay = playing && !hovered && !focused && !reducedMotion

  const go = (step: number) =>
    setIndex((current) => (current + step + count) % count)
  const current = templates[index]
  const currentPicked = picked === current.id
  const { width, height } = current.size
  const transition = (property: string, duration: number) =>
    reducedMotion ? "none" : `${property} ${duration}ms ${EASE}`

  function pick(id: string) {
    const next = picked === id ? undefined : id
    onPick(next)
    // Un modèle choisi reste affiché : le défilement s'arrête.
    if (next) setPlaying(false)
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
      className="flex flex-col gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
      }}
    >
      {/* Le retrait en haut laisse dépasser les cartes du fond. */}
      <div style={{ paddingTop: `${(PEEK * height * 100) / width}%` }}>
        <div
          className="relative w-full"
          style={{ aspectRatio: `${width} / ${height}` }}
          aria-live={autoplay ? "off" : "polite"}
        >
          {/* Seules la diapositive affichée, la précédente et les trois suivantes sont rendues. */}
          {[-1, 0, 1, 2, 3].map((offset) => {
            const position = (index + offset + count) % count
            const template = templates[position]
            const selected = picked === template.id
            const name = tTemplates(template.nameKey)
            const place = STACK[offset]
            const style: CSSProperties = {
              transform: place.transform,
              opacity: place.opacity,
              zIndex: offset < 0 ? 50 : 40 - offset * 10,
              transformOrigin: "50% 0",
              transition: reducedMotion
                ? "none"
                : `${transition("transform", 700)}, ${transition("opacity", offset < 0 ? 350 : 700)}`,
            }
            return (
              <div
                key={template.id}
                role="group"
                aria-roledescription="slide"
                aria-label={t("slideLabel", {
                  position: position + 1,
                  total: count,
                })}
                aria-hidden={offset !== 0}
                inert={offset !== 0}
                className="absolute inset-0 will-change-transform"
                style={style}
              >
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-label={t("pickTemplate", { name })}
                  onClick={() => pick(template.id)}
                  className="group relative block size-full cursor-pointer overflow-hidden rounded-xl shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] ring-1 ring-foreground/10 outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
                >
                  <FitPreview
                    template={template}
                    config={{ ...config, template: template.id }}
                  />
                  {/* Voile des cartes du fond, plus dense à mesure qu'elles s'éloignent. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-background"
                    style={{
                      opacity: place.shade,
                      transition: transition("opacity", 700),
                    }}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-shadow",
                      selected
                        ? "ring-3 ring-primary ring-inset"
                        : "group-hover:ring-2 group-hover:ring-primary/50 group-hover:ring-inset"
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm transition-opacity",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/90 text-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    )}
                  >
                    {selected && <Check className="size-3.5" />}
                    {selected ? t("picked") : t("pickCta")}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Jauge du défilement : quand elle est pleine, le modèle suivant passe devant. */}
      {!reducedMotion && (
        <div
          aria-hidden
          className="h-0.5 overflow-hidden rounded-full bg-foreground/10"
        >
          <div
            key={index}
            className="h-full origin-left rounded-full bg-primary"
            style={{
              animation: `carousel-progress ${INTERVAL}ms linear forwards`,
              animationPlayState: autoplay ? "running" : "paused",
            }}
            onAnimationEnd={() => go(1)}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <div
          key={current.id}
          className="min-w-0 flex-1 animate-in duration-500 fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
        >
          <p className="truncate text-sm font-semibold">
            {tTemplates(current.nameKey)}
            {currentPicked && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Check className="size-3.5" />
                {t("picked")}
              </span>
            )}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {tTemplates(current.descriptionKey)}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {index + 1} / {count}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("previousTemplate")}
            onClick={() => go(-1)}
          >
            <ChevronLeft />
          </Button>
          {!reducedMotion && (
            <Button
              variant="outline"
              size="icon"
              className={"rounded-full"}
              aria-label={playing ? t("pauseCarousel") : t("playCarousel")}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("nextTemplate")}
            onClick={() => go(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {picked
          ? t("pickedHint", {
              name: tTemplates(
                templates.find((template) => template.id === picked)!.nameKey
              ),
            })
          : t("pickHint")}
      </p>
    </section>
  )
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** Préférence système « réduire les animations » : pas de défilement automatique. */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    // Export statique : rendu serveur sans préférence connue.
    () => false
  )
}

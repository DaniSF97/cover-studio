"use client"

import { ArrowRight } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

import { ImageGallery } from "@/components/canva/image-gallery"
import { Swatch } from "@/components/canva/swatch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "@/i18n/provider"
import { trackScreenshotImported, trackTemplateSelected } from "@/lib/analytics"
import { isPortrait } from "@/lib/slots"
import { hydrateCoverStore, useCoverStore } from "@/stores/cover-store"
import { getTemplate } from "@/templates/registry"
import { COLOR_PRESETS, defaultConfig } from "@/templates/showcase/defaults"
import type { ImageAsset } from "@/types/cover"

import { TemplateCarousel } from "./template-carousel"

type Props = {
  /** Titre (le H1 de la page) et accroche, au-dessus du bloc de démarrage. */
  heading: ReactNode
  /** Export format recommandé par la page : l'éditeur s'ouvre dessus. */
  exportSize?: string
  /** Source d'import ouverte à l'arrivée (« url » : capture d'un site). */
  source?: "files" | "url"
}

/**
 * Bloc de démarrage des pages publiques : import des captures (fichiers ou URL),
 * couleur de marque et choix du modèle, puis ouverture de l'éditeur.
 */
export function StartSection({ heading, exportSize, source }: Props) {
  const t = useTranslations("landing")
  const tFields = useTranslations("fields")
  const locale = useLocale()
  const router = useRouter()
  const startFrom = useCoverStore((state) => state.startFrom)
  const [images, setImages] = useState<ImageAsset[]>([])
  const [picked, setPicked] = useState<string>()
  // Couleur choisie à la main ; sinon celle de la première capture.
  const [chosenColor, setChosenColor] = useState<string>()

  useEffect(() => {
    router.prefetch("/editor")
  }, [router])

  function updateImages(next: ImageAsset[]) {
    const known = new Set(images.map((image) => image.id))
    for (const image of next) {
      if (!known.has(image.id)) {
        trackScreenshotImported({
          orientation: isPortrait(image) ? "portrait" : "landscape",
        })
      }
    }
    setImages(next)
  }

  function start() {
    if (images.length === 0) return
    hydrateCoverStore()
    startFrom(images, {
      template: picked,
      brandColor: chosenColor,
      exportSize,
    })
    router.push("/editor")
  }

  const base = defaultConfig(locale)
  const detectedColor = images[0]?.dominant
  const brandColor = chosenColor ?? detectedColor ?? base.style.brandColor
  const previewConfig = {
    ...base,
    style: { brandColor },
    mockups: { ...base.mockups, images },
  }

  // Les libellés d'emplacement suivent le modèle qui sera ouvert dans l'éditeur.
  const slotsTemplate = getTemplate(
    picked ??
      (images.length > 0 && images.every(isPortrait)
        ? "mobile-trio"
        : "showcase")
  )

  function pickTemplate(id: string | undefined) {
    setPicked(id)
    if (id) trackTemplateSelected({ template: id })
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent),radial-gradient(40%_40%_at_0%_100%,color-mix(in_oklab,var(--primary)_8%,transparent),transparent)]"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:py-20">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-4">{heading}</div>

          <section
            id="start"
            aria-labelledby="start-title"
            className="flex flex-col gap-6 rounded-2xl border border-primary/25 bg-background p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-12px_color-mix(in_oklab,var(--primary)_35%,transparent)] sm:p-6"
          >
            <div className="flex flex-col gap-1">
              <h2
                id="start-title"
                className="text-xl font-semibold tracking-tight"
              >
                {t("startTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">{t("startText")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="landing-image" className="sr-only">
                {t("imageLabel")}
              </Label>
              <ImageGallery
                id="landing-image"
                images={images}
                slots={slotsTemplate.slots}
                onChange={updateImages}
                initialSource={source}
              />
            </div>
            {/* Couleur : libellé et aide à gauche, sélecteur à droite (empilés sur mobile). */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor="landing-color"
                  className="text-[13px] font-semibold"
                >
                  {tFields("brandColorLabel")}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t("colorHint")}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:w-60 sm:shrink-0">
                <Swatch
                  id="landing-color"
                  value={brandColor}
                  onChange={setChosenColor}
                  presets={COLOR_PRESETS}
                  compact
                />
                {chosenColor &&
                  detectedColor &&
                  chosenColor !== detectedColor && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start"
                      onClick={() => setChosenColor(undefined)}
                    >
                      <span
                        aria-hidden
                        className="size-3.5 rounded-full ring-1 ring-foreground/15"
                        style={{ background: detectedColor }}
                      />
                      {t("useScreenshotColor")}
                    </Button>
                  )}
              </div>
            </div>
            <Button
              size="lg"
              className="h-11 w-full text-base"
              disabled={images.length === 0}
              onClick={start}
            >
              {t("createButton")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </section>
        </div>

        <div className="min-w-0 rounded-2xl border border-border bg-muted/50 p-2 shadow-sm sm:p-3">
          <TemplateCarousel
            config={previewConfig}
            picked={picked}
            onPick={pickTemplate}
          />
        </div>
      </div>
    </section>
  )
}

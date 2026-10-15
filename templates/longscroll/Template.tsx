import { useLocale, useTranslations } from "@/i18n/provider"
import { contrast, hexAlpha, tone } from "@/lib/color"
import { fontStack } from "@/lib/fonts"
import { Placeholder } from "@/mockups/BrowserFrame"
import { COVER_SIZE } from "@/templates/shared/mockups"
import { CoverRoot, Footer, TextBlock } from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

const COLUMN = { left: 140, top: 330, width: 760 }
const STRIP_WIDTH = 450
const STRIPS = [
  { left: 960, top: 360 },
  { left: 1440, top: 240 },
  { left: 1920, top: 480 },
]
/** Hauteur maximale d'une bande : au-delà, elle sortirait du cadre. */
const STRIP_MAX = 1000

/**
 * Défilement : la capture pleine page coupée en trois bandes qui se suivent,
 * côte à côte, légendées de la plage de pixels qu'elles couvrent.
 */
export function LongscrollTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const locale = useLocale()
  const t = useTranslations("mockups")
  const brand = style.brandColor
  const light = contrast(brand, "#ffffff") < 3
  const text = light ? tone(brand, 0.2, 0.6) : "#ffffff"
  const overlay = light ? "#000000" : "#ffffff"
  const accent =
    style.accentColor ?? (light ? tone(brand, 0.35, 1) : tone(brand, 0.9, 0.5))
  const image = mockups.desktopImage
  const number = new Intl.NumberFormat(locale)

  // La page est mise à la largeur d'une bande, puis découpée en trois tranches
  // réparties du haut au bas de la page : consécutives pour une page longue, qui se
  // recouvrent pour une capture courte.
  const pageHeight = image
    ? (STRIP_WIDTH * image.height) / image.width
    : STRIP_MAX
  const stripHeight = Math.min(
    STRIP_MAX,
    Math.max(pageHeight / 3, Math.min(pageHeight, 500))
  )
  const offsets = STRIPS.map(
    (_, index) => (index * Math.max(0, pageHeight - stripHeight)) / 2
  )
  const toImagePx = (value: number) =>
    image ? Math.round((value * image.width) / STRIP_WIDTH) : 0

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: brand,
        backgroundImage: `radial-gradient(circle at 85% 20%, ${hexAlpha(tone(brand, 0.8, 1), 0.45)} 0%, transparent 50%)`,
      }}
    >
      <TextBlock
        content={content}
        width={COLUMN.width}
        nameSize={150}
        chipRadius={999}
        colors={{
          text,
          muted: hexAlpha(light ? text : "#ffffff", 0.85),
          accent,
          badgeBorder: "transparent",
          badgeBg: text,
          badgeText: brand,
          chipBg: hexAlpha(overlay, 0.14),
        }}
        style={{ position: "absolute", left: COLUMN.left, top: COLUMN.top }}
      />

      <Footer
        text={content.footer}
        color={hexAlpha(light ? text : "#ffffff", 0.75)}
        style={{ left: COLUMN.left, bottom: 100, width: COLUMN.width }}
      />

      {STRIPS.map((strip, index) => (
        <div key={strip.left}>
          {image && (
            <div
              style={{
                position: "absolute",
                left: strip.left,
                top: strip.top - 56,
                fontFamily: fontStack("geist-mono"),
                fontSize: 22,
                color: hexAlpha(light ? text : "#ffffff", 0.75),
                whiteSpace: "nowrap",
              }}
            >
              {number.format(toImagePx(offsets[index]))} –{" "}
              {number.format(toImagePx(offsets[index] + stripHeight))} px
            </div>
          )}
          <div
            role="presentation"
            style={{
              position: "absolute",
              left: strip.left,
              top: strip.top,
              width: STRIP_WIDTH,
              height: stripHeight,
              borderRadius: 14,
              overflow: "hidden",
              background: "#f4f4f6",
              backgroundImage: image ? `url("${image.dataUrl}")` : undefined,
              backgroundSize: `${STRIP_WIDTH}px auto`,
              backgroundPosition: `0 ${-offsets[index]}px`,
              backgroundRepeat: "no-repeat",
              boxShadow: `0 0 0 8px ${hexAlpha("#ffffff", 0.22)}, 0 40px 80px rgba(0, 0, 0, 0.3)`,
            }}
          >
            {!image && index === 1 && (
              <Placeholder
                color="#a0a0a8"
                label={t("desktopPlaceholder")}
                iconSize={64}
              />
            )}
          </div>
        </div>
      ))}
    </CoverRoot>
  )
}

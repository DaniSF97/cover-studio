import { hexAlpha, readableOn, tone } from "@/lib/color"
import { LaptopFrame, laptopHeight } from "@/mockups/LaptopFrame"
import { COVER_SIZE } from "@/templates/shared/mockups"
import {
  Chips,
  CoverRoot,
  Footer,
  TextBlock,
} from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

const TEXT = { top: 100, width: 1500 }
const LAPTOP_WIDTH = 1360
const LAPTOP_TOP = 560

/**
 * Studio : un ordinateur portable seul sous un projecteur, sur fond noir,
 * titre centré au-dessus ; le site présenté comme un produit.
 */
export function StudioTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const bg = "#060708"
  const glow = tone(brand, 0.6, 1)
  const accent = style.accentColor ?? readableOn(tone(brand, 0.78, 1), bg)
  const floor = LAPTOP_TOP + laptopHeight(LAPTOP_WIDTH)

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: bg,
        backgroundImage: [
          // Cône du projecteur, puis reflet de marque sous le laptop.
          `radial-gradient(ellipse 38% 62% at 50% 22%, ${hexAlpha(glow, 0.3)} 0%, ${hexAlpha(glow, 0.1)} 45%, transparent 100%)`,
          `radial-gradient(ellipse 34% 6% at 50% ${(floor / COVER_SIZE.height) * 100}%, ${hexAlpha(glow, 0.5)} 0%, transparent 100%)`,
        ].join(", "),
      }}
    >
      <TextBlock
        content={content}
        width={TEXT.width}
        align="center"
        nameSize={130}
        descriptionLines={1}
        hideChips
        colors={{
          text: "#f4f4f2",
          muted: "rgba(255, 255, 255, 0.6)",
          accent,
          badgeBorder: "transparent",
          badgeBg: "transparent",
          badgeText: accent,
          chipBg: "transparent",
        }}
        style={{
          position: "absolute",
          left: (COVER_SIZE.width - TEXT.width) / 2,
          top: TEXT.top,
        }}
      />

      <LaptopFrame
        image={mockups.desktopImage}
        cropY={mockups.desktopCropY}
        width={LAPTOP_WIDTH}
        style={{
          position: "absolute",
          left: (COVER_SIZE.width - LAPTOP_WIDTH) / 2,
          top: LAPTOP_TOP,
        }}
      />

      <Chips
        chips={content.chips}
        maxWidth={TEXT.width}
        justify="center"
        colors={{ text: "rgba(255, 255, 255, 0.55)", chipBg: "transparent" }}
        style={{
          position: "absolute",
          left: (COVER_SIZE.width - TEXT.width) / 2,
          width: TEXT.width,
          top: floor + 30,
          maxHeight: 58,
          overflow: "hidden",
        }}
      />

      <Footer
        text={content.footer}
        color="rgba(255, 255, 255, 0.45)"
        style={{
          right: 120,
          bottom: 50,
          maxWidth: 360,
          fontSize: 24,
          textAlign: "right",
        }}
      />
    </CoverRoot>
  )
}

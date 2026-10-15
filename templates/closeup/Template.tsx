import { hexAlpha, readableOn, tone } from "@/lib/color"
import { PhoneFrame } from "@/mockups/PhoneFrame"
import { COVER_SIZE } from "@/templates/shared/mockups"
import { CoverRoot, Footer, TextBlock } from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

const COLUMN = { left: 140, top: 230, width: 1250 }
/** Téléphone géant, droit, coupé par les bords droit et bas du cadre. */
const PHONE = { left: 1530, top: 230, scale: 2.4 }
const DISC = { left: 1420, top: 160, size: 1240 }

/**
 * Gros plan : un téléphone immense qui déborde du cadre, devant un disque de la
 * couleur de marque ; à gauche, un nom en très grand.
 */
export function CloseupTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const bg = tone(brand, 0.97, 0.12)
  const ink = tone(brand, 0.2, 0.5)
  const accent = style.accentColor ?? readableOn(brand, bg)

  return (
    <CoverRoot size={COVER_SIZE} style={{ backgroundColor: bg }}>
      <div
        style={{
          position: "absolute",
          left: DISC.left,
          top: DISC.top,
          width: DISC.size,
          height: DISC.size,
          borderRadius: "50%",
          background: brand,
        }}
      />

      <PhoneFrame
        image={mockups.mobileImage}
        scale={PHONE.scale}
        style={{
          position: "absolute",
          left: PHONE.left,
          top: PHONE.top,
          boxShadow: `0 60px 120px ${hexAlpha(tone(brand, 0.3, 0.8), 0.35)}`,
        }}
      />

      <TextBlock
        content={content}
        width={COLUMN.width}
        nameSize={240}
        chipRadius={999}
        colors={{
          text: ink,
          muted: tone(brand, 0.4, 0.3),
          accent,
          badgeBorder: "transparent",
          badgeBg: ink,
          badgeText: "#ffffff",
          chipBg: "transparent",
          chipText: tone(brand, 0.35, 0.9),
          chipBorder: tone(brand, 0.82, 0.6),
        }}
        style={{ position: "absolute", left: COLUMN.left, top: COLUMN.top }}
      />

      <Footer
        text={content.footer}
        color={tone(brand, 0.4, 0.3)}
        style={{ left: COLUMN.left, bottom: 100, width: COLUMN.width }}
      />
    </CoverRoot>
  )
}

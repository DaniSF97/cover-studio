import { hexAlpha, readableOn, tone } from "@/lib/color"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import { COVER_SIZE, phoneScreens } from "@/templates/shared/mockups"
import { CoverRoot, Footer, TextBlock } from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

const TEXT = { top: 90, width: 1600 }
const PHONE_SCALE = 0.9
const PHONE_TOP = 560
/**
 * Cinq écrans en éventail autour d'un pivot sous le cadre : les plus inclinés
 * d'abord, l'écran central en dernier pour passer devant.
 */
const FAN = [
  { screen: 1, angle: -30 },
  { screen: 2, angle: 30 },
  { screen: 2, angle: -15 },
  { screen: 1, angle: 15 },
  { screen: 0, angle: 0 },
]

/** Éventail : cinq écrans déployés comme une main de cartes, sur fond sombre et halo de marque. */
export function FanTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const bg = tone(brand, 0.16, 0.6)
  const glow = tone(brand, 0.55, 1.1)
  const accent = style.accentColor ?? readableOn(tone(brand, 0.8, 1), bg)
  const screens = phoneScreens(mockups)
  const width = PHONE_SIZE.width * PHONE_SCALE

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: bg,
        backgroundImage: `radial-gradient(ellipse 38% 46% at 50% 82%, ${hexAlpha(glow, 0.75)} 0%, ${hexAlpha(glow, 0.2)} 50%, transparent 100%)`,
      }}
    >
      <TextBlock
        content={content}
        width={TEXT.width}
        align="center"
        nameSize={140}
        descriptionLines={1}
        chipRadius={999}
        colors={{
          text: "#ffffff",
          muted: tone(brand, 0.85, 0.5),
          accent,
          badgeBorder: hexAlpha(accent, 0.5),
          badgeBg: hexAlpha(accent, 0.14),
          badgeText: accent,
          chipBg: "rgba(255, 255, 255, 0.08)",
          chipBorder: "rgba(255, 255, 255, 0.18)",
        }}
        style={{
          position: "absolute",
          left: (COVER_SIZE.width - TEXT.width) / 2,
          top: TEXT.top,
        }}
      />

      {FAN.map(({ screen, angle }) => (
        <PhoneFrame
          key={angle}
          image={screens[screen].image}
          imagePosition={screens[screen].position}
          scale={PHONE_SCALE}
          style={{
            position: "absolute",
            left: (COVER_SIZE.width - width) / 2,
            top: PHONE_TOP,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50% 190%",
          }}
        />
      ))}

      <Footer
        text={content.footer}
        color="rgba(255, 255, 255, 0.7)"
        style={{
          right: 120,
          bottom: 70,
          maxWidth: 600,
          fontSize: 24,
          textAlign: "right",
        }}
      />
    </CoverRoot>
  )
}

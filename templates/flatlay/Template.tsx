import { hexAlpha, readableOn, tone } from "@/lib/color"
import { PhoneFrame } from "@/mockups/PhoneFrame"
import {
  EditableText,
  useEditorChips,
  useShowSlot,
} from "@/templates/shared/editable"
import { COVER_SIZE, phoneScreens } from "@/templates/shared/mockups"
import { AppName, Badge, Description } from "@/templates/shared/pieces"
import { CoverRoot, Footer } from "@/templates/shared/text-block"
import { useTextScale } from "@/templates/shared/typography"
import type { PlacedConfig } from "@/types/cover"

const CARD = { left: 150, top: 300, width: 780, height: 880 }
/** Interligne du papier réglé : le texte de la fiche s'y aligne. */
const LINE = 70
const PHONE_SCALE = 1.02
const PHONES = [
  { screen: 1, left: 1010, top: 110 },
  { screen: 0, left: 1480, top: 320 },
  { screen: 2, left: 1950, top: 530 },
]
const TILT = "rotate(-12deg)"

/**
 * À plat, vu du dessus : trois téléphones posés sur une surface avec de longues
 * ombres, et une fiche bristol réglée qui porte le texte.
 */
export function FlatlayTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const surface = tone(brand, 0.9, 0.35)
  const ink = tone(brand, 0.2, 0.5)
  const accent = style.accentColor ?? readableOn(brand, "#fffdf8")
  const shadow = `40px 60px 70px ${hexAlpha(tone(brand, 0.2, 0.6), 0.32)}`
  const screens = phoneScreens(mockups)
  const show = useShowSlot()
  const chips = useEditorChips(content.chips)
  const chipsScale = useTextScale("chips")

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: surface,
        backgroundImage: `radial-gradient(${hexAlpha(tone(brand, 0.4, 0.6), 0.1)} 1.5px, transparent 1.6px)`,
        backgroundSize: "14px 14px",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...CARD,
          transform: "rotate(-5deg)",
          background: "#fffdf8",
          backgroundImage: `repeating-linear-gradient(transparent 0 ${LINE - 2}px, ${hexAlpha(tone(brand, 0.6, 0.8), 0.25)} ${LINE - 2}px ${LINE}px)`,
          backgroundPosition: "0 18px",
          boxShadow: shadow,
          padding: "70px 70px 0 130px",
          overflow: "hidden",
        }}
      >
        {/* Marge rouge du bristol. */}
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 0,
            bottom: 0,
            width: 3,
            background: "rgba(229, 72, 77, 0.5)",
          }}
        />
        <Badge
          text={content.badge}
          style={{ background: readableOn(brand, "#ffffff"), color: "#ffffff" }}
        />
        <AppName
          content={content}
          size={140}
          color={ink}
          accent={accent}
          style={{ margin: "36px 0 26px" }}
        />
        <Description
          text={content.description}
          size={38}
          lines={3}
          style={{ lineHeight: `${LINE}px`, color: ink }}
        />
        {show(content.chips) && (
          <div
            style={{
              marginTop: 16,
              fontSize: 30 * chipsScale,
              lineHeight: `${LINE}px`,
              fontWeight: 600,
              color: tone(brand, 0.35, 0.9),
            }}
          >
            {chips.slice(0, 3).map((chip, index) => (
              <div key={`${chip}-${index}`}>
                — <EditableText field="chips" text={chip} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>

      {PHONES.map(({ screen, left, top }) => (
        <PhoneFrame
          key={screen}
          image={screens[screen].image}
          imagePosition={screens[screen].position}
          scale={PHONE_SCALE}
          style={{
            position: "absolute",
            left,
            top,
            transform: TILT,
            boxShadow: shadow,
          }}
        />
      ))}

      <Footer
        text={content.footer}
        color={tone(brand, 0.35, 0.6)}
        style={{ left: CARD.left + 40, bottom: 80, maxWidth: 700 }}
      />
    </CoverRoot>
  )
}

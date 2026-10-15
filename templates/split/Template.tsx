import { contrast, hexAlpha, tone } from "@/lib/color"
import { BrowserFrame } from "@/mockups/BrowserFrame"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import {
  EditableText,
  useEditorChips,
  useShowSlot,
} from "@/templates/shared/editable"
import { COVER_SIZE, resolveBrowserTheme } from "@/templates/shared/mockups"
import { CoverRoot, Footer, TextBlock } from "@/templates/shared/text-block"
import { useTextScale } from "@/templates/shared/typography"
import type { PlacedConfig } from "@/types/cover"

/** Le panneau de marque occupe la gauche ; le reste est un aplat clair. */
const PANEL_WIDTH = 1020
const COLUMN = { left: 120, top: 150, width: 860 }
const FEATURES = { left: 1140, top: 180, width: 640 }
const BROWSER = { left: 560, top: 640, width: 1440 }
const PHONE = { left: 1960, top: 230, scale: 0.82 }

/**
 * Partage : le cadre coupé en deux aplats ; la fenêtre du navigateur chevauche
 * la frontière et sort par le bas, les fonctionnalités en liste à droite.
 */
export function SplitTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const light = contrast(brand, "#ffffff") < 3
  const onBrand = light ? tone(brand, 0.2, 0.6) : "#ffffff"
  const paper = tone(brand, 0.97, 0.12)
  const ink = tone(brand, 0.2, 0.5)
  const accent =
    style.accentColor ?? (light ? tone(brand, 0.35, 1) : tone(brand, 0.9, 0.5))
  const rule = tone(brand, 0.85, 0.6)
  const show = useShowSlot()
  const chips = useEditorChips(content.chips)
  const chipsScale = useTextScale("chips")

  const phoneOnly = mockups.showMobile && !mockups.showDesktop
  const phone = phoneOnly
    ? {
        left: PANEL_WIDTH - (PHONE_SIZE.width * 1.25) / 2,
        top: 560,
        scale: 1.25,
      }
    : PHONE

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: paper,
        backgroundImage: `linear-gradient(90deg, ${brand} ${(PANEL_WIDTH / COVER_SIZE.width) * 100}%, transparent ${(PANEL_WIDTH / COVER_SIZE.width) * 100}%)`,
      }}
    >
      <TextBlock
        content={content}
        width={COLUMN.width}
        nameSize={140}
        descriptionLines={2}
        hideChips
        colors={{
          text: onBrand,
          muted: hexAlpha(light ? onBrand : "#ffffff", 0.88),
          accent,
          badgeBorder: "transparent",
          badgeBg: hexAlpha(light ? "#000000" : "#ffffff", 0.15),
          chipBg: "transparent",
        }}
        style={{ position: "absolute", left: COLUMN.left, top: COLUMN.top }}
      />

      {show(content.chips) && (
        <div style={{ position: "absolute", ...FEATURES }}>
          {chips.slice(0, 4).map((chip, index) => (
            <div
              key={`${chip}-${index}`}
              style={{
                fontSize: 50 * chipsScale,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: ink,
                borderTop: `2px solid ${rule}`,
                padding: "14px 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <EditableText field="chips" text={chip} index={index} />
            </div>
          ))}
        </div>
      )}

      {mockups.showDesktop && (
        <BrowserFrame
          image={mockups.desktopImage}
          url={content.browserUrl}
          favicon={content.icon}
          theme={resolveBrowserTheme(mockups)}
          width={BROWSER.width}
          contentHeight={1000}
          cropY={mockups.desktopCropY}
          style={{
            position: "absolute",
            left: BROWSER.left,
            top: BROWSER.top,
            boxShadow: `0 -10px 80px ${hexAlpha(ink, 0.3)}`,
          }}
        />
      )}

      {mockups.showMobile && (
        <PhoneFrame
          image={mockups.mobileImage}
          scale={phone.scale}
          style={{ position: "absolute", left: phone.left, top: phone.top }}
        />
      )}

      <Footer
        text={content.footer}
        color={hexAlpha(light ? onBrand : "#ffffff", 0.75)}
        style={{
          left: COLUMN.left,
          top: 90,
          maxWidth: COLUMN.width,
          fontSize: 24,
        }}
      />
    </CoverRoot>
  )
}

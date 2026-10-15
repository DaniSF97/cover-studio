import type { CSSProperties } from "react"

import { hexAlpha, tone } from "@/lib/color"
import { fontStack } from "@/lib/fonts"
import { BROWSER_BAR_HEIGHT, BrowserFrame } from "@/mockups/BrowserFrame"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import {
  EditableText,
  useEditorChips,
  useShowSlot,
} from "@/templates/shared/editable"
import {
  COVER_SIZE,
  gridLayers,
  resolveBrowserTheme,
} from "@/templates/shared/mockups"
import { AppName, Badge, Description } from "@/templates/shared/pieces"
import { CoverRoot, Footer } from "@/templates/shared/text-block"
import type { ImageAsset, PlacedConfig } from "@/types/cover"

const LINE = "rgba(255, 255, 255, 0.85)"
const BROWSER = { left: 220, top: 300, width: 1280, height: 800 }
const PHONE = { left: 1720, top: 260, scale: 0.85 }
/** Cartouche, en bas à droite, comme sur un plan. */
const TITLE_BLOCK = { left: 1620, top: 1120, width: 680 }
/** Repères numérotés : point visé, puis position de l'étiquette (une par fonctionnalité). */
const PINS = [
  { x: 340, y: 520, labelX: 380, labelY: 1200 },
  { x: 900, y: 660, labelX: 780, labelY: 1290 },
  { x: 1840, y: 520, labelX: 1640, labelY: 1050 },
]

function size(image: ImageAsset | undefined) {
  return image ? `${image.width} × ${image.height} px` : null
}

/** Cote horizontale : trait, deux talons et la mesure au-dessus. */
function HDim({
  x1,
  x2,
  y,
  text,
  mono,
}: {
  x1: number
  x2: number
  y: number
  text: string
  mono: CSSProperties
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x1,
          top: y,
          width: x2 - x1,
          height: 2,
          background: LINE,
        }}
      />
      {[x1, x2 - 2].map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: x,
            top: y - 14,
            width: 2,
            height: 30,
            background: LINE,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: x1,
          top: y - 44,
          width: x2 - x1,
          textAlign: "center",
          ...mono,
        }}
      >
        {text}
      </div>
    </>
  )
}

/**
 * Plan technique : fond de calque quadrillé, appareils au trait, cotes aux
 * dimensions réelles des captures, repères numérotés sur les fonctionnalités et
 * cartouche portant le nom.
 */
export function BlueprintTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const paper = tone(brand, 0.3, 0.75)
  const mono: CSSProperties = {
    fontFamily: fontStack("geist-mono"),
    fontSize: 24,
    color: LINE,
  }
  const show = useShowSlot()
  const chips = useEditorChips(content.chips)

  const phoneOnly = mockups.showMobile && !mockups.showDesktop
  const phone = phoneOnly
    ? { left: (TITLE_BLOCK.left - PHONE_SIZE.width) / 2, top: 220, scale: 1 }
    : PHONE
  const phoneWidth = PHONE_SIZE.width * phone.scale
  const desktopSize = size(mockups.desktopImage)
  const mobileSize = size(mockups.mobileImage)
  const pins = PINS.filter((_, index) =>
    index < 2 ? mockups.showDesktop : mockups.showMobile
  )

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: paper,
        backgroundImage: [
          ...gridLayers("rgba(255, 255, 255, 0.07)"),
          ...gridLayers("rgba(255, 255, 255, 0.14)"),
        ].join(", "),
        backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
      }}
    >
      {mockups.showDesktop && (
        <>
          <BrowserFrame
            image={mockups.desktopImage}
            url={content.browserUrl}
            favicon={content.icon}
            theme={resolveBrowserTheme(mockups)}
            width={BROWSER.width}
            contentHeight={BROWSER.height}
            cropY={mockups.desktopCropY}
            style={{
              position: "absolute",
              left: BROWSER.left,
              top: BROWSER.top - BROWSER_BAR_HEIGHT,
              borderRadius: 8,
              boxShadow: `0 0 0 3px ${LINE}`,
            }}
          />
          {desktopSize && (
            <HDim
              x1={BROWSER.left}
              x2={BROWSER.left + BROWSER.width}
              y={BROWSER.top - 110}
              text={desktopSize}
              mono={mono}
            />
          )}
        </>
      )}

      {mockups.showMobile && (
        <>
          <PhoneFrame
            image={mockups.mobileImage}
            scale={phone.scale}
            style={{
              position: "absolute",
              left: phone.left,
              top: phone.top,
              boxShadow: `0 0 0 3px ${LINE}`,
            }}
          />
          {mobileSize && (
            <HDim
              x1={phone.left}
              x2={phone.left + phoneWidth}
              y={phone.top - 50}
              text={mobileSize}
              mono={mono}
            />
          )}
        </>
      )}

      {show(content.chips) && !phoneOnly && (
        <svg
          width={COVER_SIZE.width}
          height={COVER_SIZE.height}
          style={{ position: "absolute", left: 0, top: 0 }}
          aria-hidden
        >
          {pins.slice(0, chips.length).map((pin) => (
            <g key={pin.x}>
              <line
                x1={pin.x}
                y1={pin.y}
                x2={pin.labelX}
                y2={pin.labelY}
                stroke={LINE}
                strokeWidth="2"
                strokeDasharray="8 6"
              />
              <circle cx={pin.x} cy={pin.y} r="9" fill={LINE} />
            </g>
          ))}
        </svg>
      )}

      {show(content.chips) &&
        !phoneOnly &&
        pins.slice(0, chips.length).map((pin, index) => (
          <div
            key={pin.x}
            style={{
              position: "absolute",
              left: pin.labelX - 26,
              top: pin.labelY - 26,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: LINE,
                color: paper,
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                fontWeight: 700,
                fontFamily: mono.fontFamily,
              }}
            >
              {index + 1}
            </span>
            <span
              style={{
                ...mono,
                fontSize: 26,
                background: paper,
                padding: "4px 10px",
                whiteSpace: "nowrap",
              }}
            >
              <EditableText field="chips" text={chips[index]} index={index} />
            </span>
          </div>
        ))}

      <div
        style={{
          position: "absolute",
          left: TITLE_BLOCK.left,
          top: TITLE_BLOCK.top,
          width: TITLE_BLOCK.width,
          border: `3px solid ${LINE}`,
          background: paper,
        }}
      >
        <div
          style={{ padding: "22px 26px", borderBottom: `2px solid ${LINE}` }}
        >
          <AppName
            content={content}
            size={76}
            color="#ffffff"
            accent={tone(brand, 0.85, 0.8)}
          />
          <Description
            text={content.description}
            size={24}
            lines={2}
            style={{ ...mono, marginTop: 10, lineHeight: 1.5 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "14px 26px",
            minHeight: 64,
          }}
        >
          <Badge
            text={content.badge}
            style={{
              fontFamily: mono.fontFamily,
              borderRadius: 0,
              border: `2px solid ${LINE}`,
              color: LINE,
            }}
          />
          <Footer
            text={content.footer}
            color={hexAlpha("#ffffff", 0.85)}
            style={{ position: "static", ...mono, fontSize: 22, minWidth: 0 }}
          />
        </div>
      </div>
    </CoverRoot>
  )
}

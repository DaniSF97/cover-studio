import { readableOn, tone } from "@/lib/color"
import { fontStack } from "@/lib/fonts"
import { MonitorFrame, monitorHeight } from "@/mockups/MonitorFrame"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import { TabletFrame, tabletHeight } from "@/mockups/TabletFrame"
import { COVER_SIZE } from "@/templates/shared/mockups"
import { AppName, Badge, Description } from "@/templates/shared/pieces"
import { Chips, CoverRoot, Footer } from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

/** Ligne sur laquelle tous les appareils sont posés. */
const SHELF = 1250
const MONITOR = { left: 670, width: 1060 }
const TABLET = { left: 250, width: 600 }
const PHONE_SCALE = 0.72
const PHONE_LEFT = 1780
const RIGHT_COLUMN = { left: 1420, width: 860 }

/**
 * Famille d'écrans : écran de bureau, tablette et téléphone posés sur la même
 * étagère, chacun légendé de la largeur de son point de rupture.
 */
export function DevicesTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const bg = tone(brand, 0.96, 0.15)
  const shelf = tone(brand, 0.92, 0.3)
  const ink = tone(brand, 0.2, 0.5)
  const accent = style.accentColor ?? readableOn(brand, bg)
  const rule = tone(brand, 0.7, 0.8)
  const mono = fontStack("geist-mono")

  // Sans capture mobile, le téléphone disparaît ; sans capture desktop, il reste seul, plus grand.
  const phoneOnly = mockups.showMobile && !mockups.showDesktop
  const phoneScale = phoneOnly ? 0.95 : PHONE_SCALE
  const phoneLeft = phoneOnly
    ? (COVER_SIZE.width - PHONE_SIZE.width * phoneScale) / 2
    : PHONE_LEFT
  const phoneHeight = PHONE_SIZE.height * phoneScale

  const legends = [
    ...(mockups.showDesktop
      ? [
          { left: TABLET.left, width: TABLET.width, text: "1024 px" },
          {
            left: MONITOR.left + 300,
            width: MONITOR.width - 600,
            text: "1440 px",
          },
        ]
      : []),
    ...(mockups.showMobile
      ? [
          {
            left: phoneLeft,
            width: PHONE_SIZE.width * phoneScale,
            text: "390 px",
          },
        ]
      : []),
  ]

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: bg,
        backgroundImage: `linear-gradient(180deg, transparent ${(SHELF / COVER_SIZE.height) * 100}%, ${shelf} ${(SHELF / COVER_SIZE.height) * 100}%)`,
      }}
    >
      <div style={{ position: "absolute", left: 140, top: 100, width: 1180 }}>
        <Badge
          text={content.badge}
          style={{ background: readableOn(brand, "#ffffff"), color: "#ffffff" }}
        />
        <AppName
          content={content}
          size={120}
          color={ink}
          accent={accent}
          style={{ marginTop: 28 }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: RIGHT_COLUMN.left,
          top: 130,
          width: RIGHT_COLUMN.width,
        }}
      >
        <Description
          text={content.description}
          size={38}
          lines={2}
          style={{ color: ink, fontWeight: 500 }}
        />
        <Chips
          chips={content.chips}
          radius={999}
          maxWidth={RIGHT_COLUMN.width}
          colors={{
            text: tone(brand, 0.35, 0.9),
            chipBg: "#ffffff",
            chipBorder: tone(brand, 0.85, 0.6),
          }}
          style={{ marginTop: 26, maxHeight: 58, overflow: "hidden" }}
        />
      </div>

      {mockups.showDesktop && (
        <>
          <MonitorFrame
            image={mockups.desktopImage}
            cropY={mockups.desktopCropY}
            width={MONITOR.width}
            style={{
              position: "absolute",
              left: MONITOR.left,
              top: SHELF - monitorHeight(MONITOR.width),
            }}
          />
          <TabletFrame
            image={mockups.desktopImage}
            cropY={mockups.desktopCropY}
            width={TABLET.width}
            style={{
              position: "absolute",
              left: TABLET.left,
              top: SHELF - tabletHeight(TABLET.width),
            }}
          />
        </>
      )}

      {mockups.showMobile && (
        <PhoneFrame
          image={mockups.mobileImage}
          scale={phoneScale}
          style={{
            position: "absolute",
            left: phoneLeft,
            top: SHELF - phoneHeight,
            boxShadow: "0 30px 50px rgba(0, 0, 0, 0.25)",
          }}
        />
      )}

      {legends.map((legend) => (
        <div
          key={legend.text}
          style={{
            position: "absolute",
            left: legend.left,
            top: SHELF + 40,
            width: legend.width,
            textAlign: "center",
            fontFamily: mono,
            fontSize: 24,
            color: tone(brand, 0.4, 0.8),
          }}
        >
          <div
            style={{
              height: 14,
              border: `2px solid ${rule}`,
              borderTop: "none",
              marginBottom: 12,
            }}
          />
          {legend.text}
        </div>
      ))}

      <Footer
        text={content.footer}
        color={tone(brand, 0.4, 0.5)}
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

import type { CSSProperties } from "react"

import { hexAlpha, readableOn, tone } from "@/lib/color"
import { BrowserFrame } from "@/mockups/BrowserFrame"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import { useShowSlot } from "@/templates/shared/editable"
import {
  COVER_SIZE,
  gridLayers,
  resolveBrowserTheme,
} from "@/templates/shared/mockups"
import { AppName, Badge, Description } from "@/templates/shared/pieces"
import { Chips, CoverRoot, Footer } from "@/templates/shared/text-block"
import type { PlacedConfig, Stat } from "@/types/cover"

const PAD = 140
const BROWSER = { left: 140, top: 340, width: 1480, height: 920 }
const PHONE = { left: 1530, top: 470, scale: 0.94 }
/** Cartes des chiffres clés, dans l'ordre de la liste. */
const CARDS = [
  { left: 1960, top: 380 },
  { left: 1960, top: 740 },
  { left: 1000, top: 1150 },
]
const CARD_WIDTH = 340
const GRID_CELL = 80

/** Courbe montante décorative, à côté du premier chiffre. */
function Sparkline({ color }: { color: string }) {
  return (
    <svg width="120" height="50" viewBox="0 0 120 50" aria-hidden>
      <polyline
        points="0,42 20,36 40,38 60,24 80,28 100,12 120,6"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StatCard({
  stat,
  ink,
  muted,
  spark,
  style,
}: {
  stat: Stat
  ink: string
  muted: string
  spark?: string
  style: CSSProperties
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        padding: "30px 34px",
        background: "#ffffff",
        borderRadius: 28,
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: ink,
            whiteSpace: "nowrap",
          }}
        >
          {stat.value}
        </div>
        {spark && <Sparkline color={spark} />}
      </div>
      <div
        style={{ marginTop: 12, fontSize: 26, lineHeight: 1.3, color: muted }}
      >
        {stat.label}
      </div>
    </div>
  )
}

/**
 * Chiffres : tableau de bord et téléphone sur fond profond quadrillé, entourés
 * de cartes de chiffres clés (valeur et légende modifiables).
 */
export function MetricsTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const deep = tone(brand, 0.18, 0.6)
  const mid = tone(brand, 0.32, 0.9)
  const accent = style.accentColor ?? readableOn(tone(brand, 0.78, 1), deep)
  const ink = tone(brand, 0.2, 0.5)
  const show = useShowSlot()
  const stats = content.stats
    .filter((stat) => show(stat.value))
    .slice(0, CARDS.length)

  const phoneOnly = mockups.showMobile && !mockups.showDesktop
  const phone = phoneOnly
    ? {
        left: (BROWSER.left + BROWSER.width) / 2 - (PHONE_SIZE.width * 1.2) / 2,
        top: 300,
        scale: 1.2,
      }
    : PHONE

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: deep,
        backgroundImage: [
          ...gridLayers("rgba(255, 255, 255, 0.04)"),
          `linear-gradient(135deg, ${deep} 0%, ${mid} 70%, ${brand} 130%)`,
        ].join(", "),
        backgroundSize: `${GRID_CELL}px ${GRID_CELL}px, ${GRID_CELL}px ${GRID_CELL}px, 100% 100%`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 110,
          width: COVER_SIZE.width - 2 * PAD,
          display: "flex",
          alignItems: "flex-end",
          gap: 60,
        }}
      >
        <AppName
          content={content}
          size={120}
          color="#ffffff"
          accent={accent}
          style={{ flexShrink: 0, maxWidth: 1000 }}
        />
        <Description
          text={content.description}
          size={34}
          lines={2}
          style={{
            flex: 1,
            minWidth: 0,
            color: tone(brand, 0.88, 0.5),
            paddingBottom: 10,
          }}
        />
      </div>

      <Badge
        text={content.badge}
        style={{
          position: "absolute",
          right: PAD,
          top: 52,
          maxWidth: 700,
          background: hexAlpha(accent, 0.14),
          border: `2px solid ${hexAlpha(accent, 0.5)}`,
          color: accent,
        }}
      />

      {mockups.showDesktop && (
        <BrowserFrame
          image={mockups.desktopImage}
          url={content.browserUrl}
          favicon={content.icon}
          theme={resolveBrowserTheme(mockups)}
          width={BROWSER.width}
          contentHeight={BROWSER.height}
          cropY={mockups.desktopCropY}
          style={{ position: "absolute", left: BROWSER.left, top: BROWSER.top }}
        />
      )}

      {mockups.showMobile && (
        <PhoneFrame
          image={mockups.mobileImage}
          scale={phone.scale}
          style={{ position: "absolute", left: phone.left, top: phone.top }}
        />
      )}

      {stats.map((stat, index) => (
        <StatCard
          key={index}
          stat={stat}
          ink={ink}
          muted="#6b717c"
          spark={index === 0 ? "#16a34a" : undefined}
          style={CARDS[index]}
        />
      ))}

      <Chips
        chips={content.chips}
        radius={999}
        maxWidth={1100}
        colors={{
          text: "#ffffff",
          chipBg: "rgba(255, 255, 255, 0.1)",
          chipBorder: "rgba(255, 255, 255, 0.2)",
        }}
        style={{
          position: "absolute",
          right: PAD,
          bottom: 44,
          width: 1100,
          justifyContent: "flex-end",
          maxHeight: 58,
          overflow: "hidden",
        }}
      />

      <Footer
        text={content.footer}
        color="rgba(255, 255, 255, 0.7)"
        style={{ left: PAD, bottom: 56, maxWidth: 800, fontSize: 24 }}
      />
    </CoverRoot>
  )
}

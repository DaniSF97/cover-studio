import type { CSSProperties, ReactNode } from "react"

import { contrast, hexAlpha, readableOn, tone } from "@/lib/color"
import { fontStack, getFont } from "@/lib/fonts"
import { BrowserFrame } from "@/mockups/BrowserFrame"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import { TabletFrame, tabletHeight } from "@/mockups/TabletFrame"
import { COVER_SIZE, resolveBrowserTheme } from "@/templates/shared/mockups"
import { AppName, Badge, Description } from "@/templates/shared/pieces"
import { Chips, CoverRoot, Footer } from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

const MONO = fontStack("geist-mono")

/** Grille 3 × 2 à angles droits ; la case écrans du haut couvre deux colonnes. */
const TILES = {
  brand: { left: 24, top: 24, width: 800, height: 700 },
  type: { left: 24, top: 748, width: 800, height: 728 },
  screen: { left: 848, top: 24, width: 1528, height: 700 },
  device: { left: 848, top: 748, width: 728, height: 728 },
  palette: { left: 1600, top: 748, width: 776, height: 728 },
}

function Tile({
  box,
  background,
  children,
}: {
  box: { left: number; top: number; width: number; height: number }
  background: string
  children: ReactNode
}) {
  return (
    <div
      style={{ position: "absolute", ...box, background, overflow: "hidden" }}
    >
      {children}
    </div>
  )
}

/**
 * Planche de marque : aplat de la couleur avec le nom, spécimen de la police,
 * nuancier tiré de la couleur de marque, puis les écrans, en grille sans arrondis.
 */
export function BrandboardTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const base = style.brandColor
  const onBrand =
    contrast(base, "#ffffff") >= 3 ? "#ffffff" : tone(base, 0.2, 0.6)
  const ink = tone(base, 0.18, 0.6)
  const tint = tone(base, 0.95, 0.35)
  const accent =
    style.accentColor ?? (onBrand === "#ffffff" ? tone(base, 0.88, 0.6) : ink)
  const swatches = [
    ink,
    tone(base, 0.35, 0.9),
    base,
    tone(base, 0.72, 0.8),
    tone(base, 0.88, 0.5),
  ]
  const font = getFont(style.fontFamily)
  const both = mockups.showDesktop && mockups.showMobile

  const label: CSSProperties = {
    fontFamily: MONO,
    fontSize: 24,
    color: tone(base, 0.4, 0.6),
  }

  return (
    <CoverRoot size={COVER_SIZE} style={{ backgroundColor: "#ffffff" }}>
      <Tile box={TILES.brand} background={base}>
        <Badge
          text={content.badge}
          style={{
            position: "absolute",
            right: 56,
            top: 64,
            maxWidth: 480,
            background: hexAlpha(
              onBrand === "#ffffff" ? "#ffffff" : "#000000",
              0.16
            ),
            color: onBrand,
          }}
        />
        <AppName
          content={content}
          size={180}
          color={onBrand}
          accent={accent}
          style={{ position: "absolute", left: 56, right: 56, bottom: 60 }}
        />
      </Tile>

      <Tile box={TILES.type} background={tint}>
        <div style={{ position: "absolute", left: 60, top: 56, ...label }}>
          {font.label}
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 48,
            top: 90,
            fontSize: 400,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.05em",
            color: ink,
          }}
        >
          Aa
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 60,
            bottom: 110,
            fontSize: 40,
            letterSpacing: "0.02em",
            color: ink,
          }}
        >
          ABCDEFGHIJKLM 0123456789
        </div>
        <div style={{ position: "absolute", left: 60, bottom: 56, ...label }}>
          400 · 500 · 700
        </div>
      </Tile>

      <Tile box={TILES.screen} background={tone(base, 0.85, 0.6)}>
        {mockups.showDesktop ? (
          <BrowserFrame
            image={mockups.desktopImage}
            url={content.browserUrl}
            favicon={content.icon}
            theme={resolveBrowserTheme(mockups)}
            width={1328}
            contentHeight={830}
            cropY={mockups.desktopCropY}
            style={{ position: "absolute", left: 100, top: 100 }}
          />
        ) : (
          <PhoneFrame
            image={mockups.mobileImage}
            imagePosition="50%"
            scale={1.2}
            style={{
              position: "absolute",
              left: 764 - PHONE_SIZE.width * 0.6,
              top: 90,
            }}
          />
        )}
      </Tile>

      <Tile box={TILES.device} background={ink}>
        {both || !mockups.showDesktop ? (
          <PhoneFrame
            image={mockups.mobileImage}
            scale={0.68}
            style={{
              position: "absolute",
              left: (TILES.device.width - PHONE_SIZE.width * 0.68) / 2,
              top: (TILES.device.height - PHONE_SIZE.height * 0.68) / 2,
            }}
          />
        ) : (
          <TabletFrame
            image={mockups.desktopImage}
            cropY={mockups.desktopCropY}
            width={600}
            style={{
              position: "absolute",
              left: 64,
              top: (TILES.device.height - tabletHeight(600)) / 2,
            }}
          />
        )}
      </Tile>

      <Tile box={TILES.palette} background="#ffffff">
        <div style={{ display: "flex", height: 400 }}>
          {swatches.map((color, index) => (
            <div
              key={index}
              style={{ flex: 1, position: "relative", background: color }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  bottom: 16,
                  fontFamily: MONO,
                  fontSize: 19,
                  color: contrast(color, "#ffffff") >= 3 ? "#ffffff" : ink,
                }}
              >
                {color.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
        <Description
          text={content.description}
          size={36}
          lines={3}
          style={{
            position: "absolute",
            left: 44,
            right: 44,
            top: 436,
            color: ink,
            fontWeight: 500,
          }}
        />
        <Chips
          chips={content.chips}
          radius={0}
          maxWidth={TILES.palette.width - 88}
          colors={{ text: tone(base, 0.35, 0.9), chipBg: tint }}
          style={{
            position: "absolute",
            left: 44,
            right: 44,
            bottom: 44,
            maxHeight: 132,
            overflow: "hidden",
          }}
        />
      </Tile>

      <Footer
        text={content.footer}
        color={readableOn(onBrand, base)}
        style={{
          left: TILES.brand.left + 56,
          top: 82,
          maxWidth: 300,
          fontSize: 24,
        }}
      />
    </CoverRoot>
  )
}

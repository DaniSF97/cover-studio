import { hexAlpha, readableOn, tone } from "@/lib/color"
import { PHONE_SCREEN, PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import { COVER_SIZE } from "@/templates/shared/mockups"
import { CoverRoot, Footer, TextBlock } from "@/templates/shared/text-block"
import type { ImageAsset, PlacedConfig } from "@/types/cover"

const COLUMN = { left: 140, top: 330, width: 860 }
const PHONE_SCALE = 1.3
const PHONE = {
  left: 1460,
  top: (COVER_SIZE.height - PHONE_SIZE.height * PHONE_SCALE) / 2,
}
/** Les morceaux sortis de l'écran sont un peu plus grands que dans le téléphone. */
const ZOOM = 1.32

/**
 * Bandes de l'écran extraites, en fractions de la partie visible de la capture
 * (x0, x1 sur la largeur ; y0, y1 sur la hauteur), et leur place sur le canevas.
 */
const PIECES = [
  { x0: 0.04, x1: 0.96, y0: 0.13, y1: 0.33, left: 1090, top: 290, rotate: -4 },
  { x0: 0.04, x1: 0.96, y0: 0.5, y1: 0.58, left: 1750, top: 780, rotate: 3 },
  { x0: 0, x1: 1, y0: 0.9, y1: 1, left: 1180, top: 1180, rotate: -2 },
]

/** Hauteur de capture visible dans l'écran : le cadre cale l'image sur la largeur, en haut. */
function visibleHeight(image: ImageAsset) {
  return Math.min(
    image.height,
    (image.width * PHONE_SCREEN.height) / PHONE_SCREEN.width
  )
}

/**
 * Vue éclatée : un téléphone, et des bandes de sa propre capture qui en sortent,
 * agrandies ; leur place d'origine reste marquée en pointillés sur l'écran.
 */
export function ExplodedTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const brand = style.brandColor
  const bg = tone(brand, 0.97, 0.3)
  const ink = tone(brand, 0.22, 0.5)
  const accent = style.accentColor ?? readableOn(brand, bg)
  const shadow = tone(brand, 0.3, 0.8)
  const image = mockups.mobileImage

  // Échelle écran : pixels du canevas par pixel de capture.
  const screenScale = image
    ? (PHONE_SCREEN.width * PHONE_SCALE) / image.width
    : 0
  const pieceScale = screenScale * ZOOM
  const visible = image ? visibleHeight(image) : 0

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: bg,
        backgroundImage: `radial-gradient(circle at 72% 50%, ${hexAlpha(tone(brand, 0.85, 0.7), 0.9)} 0%, transparent 45%)`,
      }}
    >
      <TextBlock
        content={content}
        width={COLUMN.width}
        nameSize={150}
        chipRadius={999}
        colors={{
          text: ink,
          muted: tone(brand, 0.4, 0.3),
          accent,
          badgeBorder: tone(brand, 0.85, 0.6),
          badgeBg: "#ffffff",
          badgeText: accent,
          chipBg: readableOn(brand, "#ffffff"),
          chipText: "#ffffff",
        }}
        style={{ position: "absolute", left: COLUMN.left, top: COLUMN.top }}
      />

      <Footer
        text={content.footer}
        color={tone(brand, 0.4, 0.3)}
        style={{ left: COLUMN.left, bottom: 100, width: COLUMN.width }}
      />

      <PhoneFrame
        image={image}
        scale={PHONE_SCALE}
        style={{
          position: "absolute",
          ...PHONE,
          boxShadow: `0 50px 100px ${hexAlpha(shadow, 0.3)}, 0 14px 30px rgba(0, 0, 0, 0.2)`,
        }}
      />

      {image &&
        PIECES.map((piece) => (
          <div
            key={`ghost-${piece.y0}`}
            style={{
              position: "absolute",
              left:
                PHONE.left +
                PHONE_SCREEN.left * PHONE_SCALE +
                piece.x0 * image.width * screenScale,
              top:
                PHONE.top +
                PHONE_SCREEN.top * PHONE_SCALE +
                piece.y0 * visible * screenScale,
              width: (piece.x1 - piece.x0) * image.width * screenScale,
              height: (piece.y1 - piece.y0) * visible * screenScale,
              border: `3px dashed ${hexAlpha(tone(brand, 0.55, 1), 0.8)}`,
              borderRadius: 14,
            }}
          />
        ))}

      {image &&
        PIECES.map((piece) => (
          <div
            key={`piece-${piece.y0}`}
            role="presentation"
            style={{
              position: "absolute",
              left: piece.left,
              top: piece.top,
              width: (piece.x1 - piece.x0) * image.width * pieceScale,
              height: (piece.y1 - piece.y0) * visible * pieceScale,
              borderRadius: 24,
              backgroundImage: `url("${image.dataUrl}")`,
              backgroundSize: `${image.width * pieceScale}px auto`,
              backgroundPosition: `${-piece.x0 * image.width * pieceScale}px ${-piece.y0 * visible * pieceScale}px`,
              backgroundRepeat: "no-repeat",
              boxShadow: `0 0 0 6px #ffffff, 0 30px 60px ${hexAlpha(shadow, 0.28)}`,
              transform: `rotate(${piece.rotate}deg)`,
            }}
          />
        ))}
    </CoverRoot>
  )
}

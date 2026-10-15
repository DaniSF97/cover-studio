import type { CSSProperties } from "react"

import { DESKTOP_SCREEN_RATIO, DeviceScreen } from "@/mockups/DeviceScreen"
import type { ImageAsset } from "@/types/cover"

/** Le socle déborde de l'écran de chaque côté. */
const LID = 1 / 1.14
const BEZEL = 0.022
const CHIN = 0.035
const BASE = 0.028

/** Hauteur totale (écran + socle) d'un laptop de largeur `width` (largeur du socle). */
export function laptopHeight(width: number) {
  const lid = width * LID
  const bezel = lid * BEZEL
  return (
    bezel + (lid - 2 * bezel) / DESKTOP_SCREEN_RATIO + lid * CHIN + width * BASE
  )
}

type LaptopFrameProps = {
  image?: ImageAsset
  /** Largeur du socle ; l'écran est un peu plus étroit. */
  width: number
  cropY?: number
  style?: CSSProperties
}

/** Ordinateur portable vu de face : écran à cadre noir, socle aluminium. */
export function LaptopFrame({ image, width, cropY, style }: LaptopFrameProps) {
  const lid = width * LID
  const bezel = lid * BEZEL
  const screenHeight = (lid - 2 * bezel) / DESKTOP_SCREEN_RATIO

  return (
    <div style={{ width, ...style }}>
      <div
        style={{
          width: lid,
          height: bezel + screenHeight + lid * CHIN,
          margin: "0 auto",
          padding: `${bezel}px ${bezel}px ${lid * CHIN}px`,
          borderRadius: `${lid * 0.03}px ${lid * 0.03}px ${lid * 0.008}px ${lid * 0.008}px`,
          background: "#0b0c0e",
          boxShadow: "inset 0 0 0 3px #2c2e33",
        }}
      >
        <DeviceScreen
          image={image}
          cropY={cropY}
          radius={6}
          iconSize={lid * 0.05}
          dark
        />
      </div>
      <div
        style={{
          position: "relative",
          height: width * BASE,
          borderRadius: `0 0 ${width * 0.03}px ${width * 0.03}px`,
          background: "linear-gradient(#d4d7dc, #8d9097 70%, #5b5e64)",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Encoche d'ouverture au centre du socle. */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: width * 0.16,
            height: width * BASE * 0.35,
            marginLeft: -width * 0.08,
            borderRadius: `0 0 ${width * 0.01}px ${width * 0.01}px`,
            background: "#9b9ea4",
          }}
        />
      </div>
    </div>
  )
}

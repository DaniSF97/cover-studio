import type { CSSProperties } from "react"

import { DESKTOP_SCREEN_RATIO, DeviceScreen } from "@/mockups/DeviceScreen"
import type { ImageAsset } from "@/types/cover"

const BEZEL = 0.017
const CHIN = 0.045
const NECK = 0.13
const FOOT = 0.016

/** Hauteur de la dalle seule (sans pied). */
function panelHeight(width: number) {
  const bezel = width * BEZEL
  return bezel + (width - 2 * bezel) / DESKTOP_SCREEN_RATIO + width * CHIN
}

/** Hauteur totale (dalle + pied) d'un écran de largeur `width`. */
export function monitorHeight(width: number) {
  return panelHeight(width) + width * (NECK + FOOT)
}

type MonitorFrameProps = {
  image?: ImageAsset
  width: number
  cropY?: number
  style?: CSSProperties
}

/** Écran de bureau tout-en-un : dalle claire à menton, pied aluminium. */
export function MonitorFrame({
  image,
  width,
  cropY,
  style,
}: MonitorFrameProps) {
  const bezel = width * BEZEL
  const panel = panelHeight(width)

  return (
    <div
      style={{
        position: "relative",
        width,
        height: monitorHeight(width),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: width * 0.43,
          top: panel - 10,
          width: width * 0.14,
          height: width * NECK + 10,
          background: "linear-gradient(90deg, #b9bcc2, #e3e5e8 50%, #b0b3b9)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.34,
          bottom: 0,
          width: width * 0.32,
          height: width * FOOT,
          borderRadius: "8px 8px 4px 4px",
          background: "#c9ccd1",
          boxShadow: "0 18px 30px rgba(0, 0, 0, 0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: `0 0 auto 0`,
          height: panel,
          padding: `${bezel}px ${bezel}px ${width * CHIN}px`,
          borderRadius: width * 0.018,
          background: "linear-gradient(#e8eaed, #d3d6da)",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.18)",
        }}
      >
        <DeviceScreen
          image={image}
          cropY={cropY}
          radius={4}
          iconSize={width * 0.05}
        />
      </div>
    </div>
  )
}

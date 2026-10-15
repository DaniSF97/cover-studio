import type { CSSProperties } from "react"

import { DeviceScreen } from "@/mockups/DeviceScreen"
import type { ImageAsset } from "@/types/cover"

const BEZEL = 0.035
/** Tablette à l'horizontale : écran 4:3. */
const SCREEN_RATIO = 4 / 3

/** Hauteur d'une tablette de largeur `width`. */
export function tabletHeight(width: number) {
  const bezel = width * BEZEL
  return (width - 2 * bezel) / SCREEN_RATIO + 2 * bezel
}

type TabletFrameProps = {
  image?: ImageAsset
  width: number
  cropY?: number
  style?: CSSProperties
}

/** Tablette tenue à l'horizontale, cadre noir fin ; la capture desktop y est recadrée. */
export function TabletFrame({ image, width, cropY, style }: TabletFrameProps) {
  return (
    <div
      style={{
        width,
        height: tabletHeight(width),
        padding: width * BEZEL,
        borderRadius: width * 0.055,
        background: "#111215",
        boxShadow: "inset 0 0 0 3px #303237, 0 30px 60px rgba(0, 0, 0, 0.22)",
        ...style,
      }}
    >
      <DeviceScreen
        image={image}
        cropY={cropY}
        radius={width * 0.02}
        iconSize={width * 0.07}
      />
    </div>
  )
}

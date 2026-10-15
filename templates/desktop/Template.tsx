import type { CSSProperties, ReactNode } from "react"

import { useTranslations } from "@/i18n/provider"
import { hexAlpha, readableOn, tone } from "@/lib/color"
import { BrowserFrame } from "@/mockups/BrowserFrame"
import { PHONE_SIZE, PhoneFrame } from "@/mockups/PhoneFrame"
import { COVER_SIZE, resolveBrowserTheme } from "@/templates/shared/mockups"
import { AppName, Badge, Description } from "@/templates/shared/pieces"
import {
  AppIcon,
  Chips,
  CoverRoot,
  Footer,
} from "@/templates/shared/text-block"
import type { PlacedConfig } from "@/types/cover"

const MENU_BAR = 48
const TITLE_BAR = 52
const BROWSER = { left: 120, top: 120, width: 1480, height: 900 }
const SIMULATOR = { left: 1720, top: 150, width: 520 }
const PHONE_SCALE = 1.04
const ABOUT = { left: 960, top: 860, width: 740 }
const DOCK_ICON = 84

const TRAFFIC_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"]

/** Fenêtre claire translucide, barre de titre centrée et feux tricolores. */
function Window({
  title,
  style,
  children,
}: {
  title: ReactNode
  style: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(247, 247, 248, 0.97)",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow:
          "0 40px 90px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08)",
        ...style,
      }}
    >
      <div
        style={{
          height: TITLE_BAR,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        {TRAFFIC_LIGHTS.map((color) => (
          <span
            key={color}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: color,
            }}
          />
        ))}
        <span
          style={{
            flex: 1,
            marginRight: 60,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 600,
            color: "#4b4f57",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

/**
 * Bureau : un fond d'écran aux couleurs de la marque, barre de menus et Dock ;
 * le site et l'app tournent dans leurs fenêtres, le texte dans « À propos ».
 */
export function DesktopTemplate({ config }: { config: PlacedConfig }) {
  const { content, style, mockups } = config
  const t = useTranslations("mockups")
  const brand = style.brandColor
  const deep = tone(brand, 0.35, 0.9)
  const ink = "#16181d"
  const accent = style.accentColor ?? readableOn(brand, "#f7f7f8")
  const glass = "rgba(255, 255, 255, 0.32)"
  const menus = [t("menuFile"), t("menuEdit"), t("menuView"), t("menuWindow")]
  // Icônes du Dock autour de celle de l'app (au centre).
  const dock = [
    tone(brand, 0.85, 0.5),
    "#f2b33d",
    "#38bdf8",
    null,
    "#94a3b8",
    "#e5484d",
    tone(brand, 0.65, 0.9),
  ]

  const phoneOnly = mockups.showMobile && !mockups.showDesktop
  const simulator = phoneOnly ? { ...SIMULATOR, left: 520 } : SIMULATOR
  const phoneWidth = PHONE_SIZE.width * PHONE_SCALE

  const appMark = (size: number) =>
    content.icon ? (
      <AppIcon image={content.icon} size={size} />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: size * 0.225,
          background: `linear-gradient(145deg, ${tone(brand, 0.7, 1)}, ${brand} 55%, ${tone(brand, 0.35, 1)})`,
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontSize: size * 0.5,
          fontWeight: 700,
        }}
      >
        {content.name.slice(0, 1).toUpperCase()}
      </div>
    )

  return (
    <CoverRoot
      size={COVER_SIZE}
      style={{
        backgroundColor: deep,
        backgroundImage: [
          `radial-gradient(circle at 20% 30%, ${brand} 0%, transparent 42%)`,
          `radial-gradient(circle at 80% 78%, ${tone(brand, 0.7, 1.1)} 0%, transparent 40%)`,
          `radial-gradient(circle at 70% 8%, ${tone(brand, 0.8, 0.8)} 0%, transparent 32%)`,
        ].join(", "),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: MENU_BAR,
          display: "flex",
          alignItems: "center",
          gap: 34,
          padding: "0 30px",
          background: glass,
          fontSize: 21,
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        <b
          style={{
            maxWidth: 420,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {content.name}
        </b>
        {menus.map((menu) => (
          <span key={menu}>{menu}</span>
        ))}
        <Footer
          text={content.footer}
          color="#111111"
          style={{
            position: "static",
            marginLeft: "auto",
            fontSize: 21,
            maxWidth: 600,
          }}
        />
      </div>

      {mockups.showDesktop && (
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
            top: BROWSER.top,
            borderRadius: 22,
          }}
        />
      )}

      {mockups.showMobile && (
        <Window
          title={content.name}
          style={{
            left: simulator.left,
            top: simulator.top,
            width: simulator.width,
          }}
        >
          <div
            style={{
              padding: `30px ${(simulator.width - phoneWidth) / 2}px 40px`,
            }}
          >
            <PhoneFrame
              image={mockups.mobileImage}
              scale={PHONE_SCALE}
              style={{ boxShadow: "none" }}
            />
          </div>
        </Window>
      )}

      <Window
        title={t("aboutWindow", { name: content.name })}
        style={{
          left: phoneOnly ? 1100 : ABOUT.left,
          top: phoneOnly ? 360 : ABOUT.top,
          width: ABOUT.width,
        }}
      >
        <div style={{ display: "flex", gap: 34, padding: "36px 40px" }}>
          {appMark(130)}
          <div style={{ minWidth: 0, flex: 1 }}>
            <AppName
              content={content}
              size={72}
              color={ink}
              accent={accent}
              icon={false}
            />
            <Badge
              text={content.badge}
              style={{
                marginTop: 10,
                height: "auto",
                padding: 0,
                letterSpacing: "0.04em",
                textTransform: "none",
                color: "#6b717c",
                fontWeight: 500,
              }}
            />
            <Description
              text={content.description}
              size={28}
              lines={3}
              style={{ marginTop: 12, color: "#2a2d33", lineHeight: 1.3 }}
            />
            <Chips
              chips={content.chips}
              radius={999}
              maxWidth={ABOUT.width - 250}
              colors={{
                text: tone(brand, 0.35, 0.9),
                chipBg: tone(brand, 0.94, 0.4),
              }}
              style={{ marginTop: 20, maxHeight: 58, overflow: "hidden" }}
            />
          </div>
        </div>
      </Window>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          display: "flex",
          gap: 18,
          padding: "16px 20px",
          borderRadius: 30,
          background: glass,
          boxShadow: `0 0 0 1px ${hexAlpha("#ffffff", 0.4)}`,
        }}
      >
        {dock.map((color, index) =>
          color ? (
            <div
              key={index}
              style={{
                width: DOCK_ICON,
                height: DOCK_ICON,
                borderRadius: 20,
                background: color,
              }}
            />
          ) : (
            <div key={index} style={{ position: "relative" }}>
              {appMark(DOCK_ICON)}
              <span
                style={{
                  position: "absolute",
                  left: DOCK_ICON / 2 - 4,
                  bottom: -12,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#111111",
                }}
              />
            </div>
          )
        )}
      </div>
    </CoverRoot>
  )
}

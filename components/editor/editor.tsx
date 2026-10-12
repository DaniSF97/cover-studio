"use client"

import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "@/i18n/provider"
import { trackEditorOpened } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { hydrateCoverStore, useCoverStore } from "@/stores/cover-store"

import { CanvasStage } from "./canvas-stage"
import { Panel, type PanelId } from "./panels"
import { SideRail } from "./side-rail"
import { TopBar } from "./top-bar"

export function Editor() {
  const t = useTranslations("editor")
  const router = useRouter()
  const panel = useCoverStore((state) => state.activePanel)
  const setPanel = useCoverStore((state) => state.setActivePanel)
  const sheetOpen = useCoverStore((state) => state.sheetOpen)
  const setSheetOpen = useCoverStore((state) => state.setSheetOpen)
  const desktop = useMediaQuery("(min-width: 768px)")
  const dragStart = useRef<number | null>(null)
  // Les captures ne sont pas persistées : sans elles à l'arrivée (accès direct,
  // rechargement), on renvoie vers l'accueil. Ensuite, retirer toutes les
  // captures laisse l'éditeur ouvert, avec des emplacements vides.
  const [arrivedWithImage] = useState(
    () => useCoverStore.getState().config.mockups.images.length > 0
  )

  useEffect(() => {
    hydrateCoverStore()
  }, [])

  useEffect(() => {
    if (arrivedWithImage) trackEditorOpened()
  }, [arrivedWithImage])

  useEffect(() => {
    if (!arrivedWithImage) router.replace("/")
  }, [arrivedWithImage, router])

  if (!arrivedWithImage) return null

  // Mobile : un second appui sur l'item actif referme le tiroir.
  function selectPanel(id: PanelId) {
    if (!desktop && sheetOpen && id === panel) {
      setSheetOpen(false)
      return
    }
    setPanel(id)
    setSheetOpen(true)
  }

  return (
    <div className="flex h-svh flex-col bg-background">
      <TopBar />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Mobile : l'aperçu prend la place restante et se redimensionne quand le tiroir s'ouvre (SPECS §9). */}
        <div className="order-1 flex min-h-0 flex-1 md:order-3 md:min-w-0">
          <CanvasStage />
        </div>
        {/* En flex : le rail s'étire sur toute la hauteur de l'éditeur. */}
        <div className="order-3 md:order-1 md:flex">
          <SideRail active={desktop || sheetOpen ? panel : null} onSelect={selectPanel} />
        </div>
        {/* Mobile : tiroir sous l'aperçu, au-dessus de la barre d'items (hauteur animée). */}
        <aside
          aria-label={t("settingsLabel")}
          data-open={sheetOpen}
          className={cn(
            "order-2 flex min-h-0 flex-col overflow-hidden bg-background md:w-[350px] md:flex-none md:border-r",
            "max-md:h-[46svh] max-md:rounded-t-2xl max-md:shadow-[0_-8px_28px_rgba(0,0,0,0.14)] max-md:ring-1 max-md:ring-foreground/10 max-md:transition-[height] max-md:duration-200",
            "max-md:data-[open=false]:invisible max-md:data-[open=false]:h-0"
          )}
        >
          {/* Poignée : glisser vers le bas ferme le tiroir. */}
          <div
            className="relative flex h-9 shrink-0 touch-none items-center justify-center md:hidden"
            onPointerDown={(event) => {
              dragStart.current = event.clientY
            }}
            onPointerUp={(event) => {
              if (dragStart.current !== null && event.clientY - dragStart.current > 32)
                setSheetOpen(false)
              dragStart.current = null
            }}
            onPointerCancel={() => {
              dragStart.current = null
            }}
          >
            <span aria-hidden className="h-1 w-10 rounded-full bg-foreground/20" />
            <button
              type="button"
              aria-label={t("closePanel")}
              onClick={() => setSheetOpen(false)}
              onPointerDown={(event) => event.stopPropagation()}
              className="absolute top-0.5 right-2 grid size-8 place-items-center rounded-full text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Panel id={panel} />
          </div>
        </aside>
      </div>
    </div>
  )
}

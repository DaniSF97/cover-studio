import { sendGAEvent } from "@next/third-parties/google"

import { readEntryPage } from "./entry-page"

/**
 * ID de mesure Google Analytics 4 (`G-XXXXXXXXXX`). Sans lui, aucun script n'est
 * chargé et les événements sont ignorés (dev local, forks).
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/** Envoie un événement GA4. Sans effet si Analytics n'est pas configuré. */
function track(name: string, params: Record<string, string | number>) {
  if (!GA_ID) return
  try {
    sendGAEvent("event", name, params)
  } catch {
    // La mesure ne doit jamais casser l'export.
  }
}

/**
 * Une cover a été générée et téléchargée. La page d'entrée de la session y est jointe :
 * c'est l'indicateur principal du référencement (exports par page d'entrée).
 */
export function trackCoverGenerated(params: { template: string; size: string; scale: number }) {
  const entry = typeof sessionStorage === "undefined" ? undefined : readEntryPage(sessionStorage)
  track("cover_generated", {
    ...params,
    entry_type: entry?.type ?? "unknown",
    entry_slug: entry?.slug ?? "unknown",
  })
}

/** Une capture a été importée sur l'accueil. */
export function trackScreenshotImported(params: { orientation: "portrait" | "landscape" }) {
  track("screenshot_imported", params)
}

/** L'éditeur s'est ouvert avec une capture. */
export function trackEditorOpened() {
  track("editor_opened", {})
}

/** Un template a été choisi dans l'éditeur. */
export function trackTemplateSelected(params: { template: string }) {
  track("template_selected", params)
}

/** Les pages d'un site ont été listées (jamais l'adresse, seulement le nombre). */
export function trackUrlDiscovered(params: { pages: number }) {
  track("url_discovered", params)
}

/** Un aperçu de page a été demandé. */
export function trackUrlPreviewed() {
  track("url_previewed", {})
}

/** Des captures depuis une URL ont été lancées. */
export function trackUrlCaptured(params: { count: number; failed: number }) {
  track("url_captured", params)
}

/** L'export a échoué : `reason` est un code d'erreur, jamais un message libre. */
export function trackExportFailed(params: { reason: string }) {
  track("cover_export_failed", params)
}

/** Le visiteur a cliqué sur « une étoile sur GitHub » après un export. */
export function trackStarClicked() {
  track("star_clicked", {})
}

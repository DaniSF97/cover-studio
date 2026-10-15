"use client"

import { useEffect } from "react"

import { rememberEntryPage } from "@/lib/entry-page"

/**
 * Retient la première page vue de la session (sessionStorage), jointe ensuite à
 * l'événement d'export. Rendu une fois par le layout de langue ; ne rend rien.
 */
export function EntryPageTracker() {
  useEffect(() => {
    rememberEntryPage(window.location.pathname)
  }, [])

  return null
}

import { describe, expect, it } from "vitest"

import {
  ENTRY_PAGE_KEY,
  entryPageFor,
  readEntryPage,
  rememberEntryPage,
} from "@/lib/entry-page"

function memoryStorage() {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

describe("page d'entrée", () => {
  it("reconnaît la Landing et les pages hors registre", () => {
    expect(entryPageFor("/en")).toEqual({ type: "landing", slug: "/" })
    expect(entryPageFor("/fr/")).toEqual({ type: "landing", slug: "/" })
    expect(entryPageFor("/en/editor")).toEqual({
      type: "other",
      slug: "/editor",
    })
    expect(entryPageFor("/en.html")).toEqual({ type: "landing", slug: "/" })
  })

  it("ne retient que la première page de la session", () => {
    const storage = memoryStorage()
    rememberEntryPage("/fr", () => storage)
    rememberEntryPage("/fr/editor", () => storage)
    expect(readEntryPage(() => storage)).toEqual({ type: "landing", slug: "/" })
  })

  it("se passe d'un stockage indisponible ou corrompu", () => {
    const broken = {
      getItem: () => {
        throw new Error("SecurityError")
      },
      setItem: () => {
        throw new Error("SecurityError")
      },
    }
    expect(() => rememberEntryPage("/en", () => broken)).not.toThrow()
    expect(readEntryPage(() => broken)).toBeUndefined()

    // Stockage bloqué : c'est l'accès à `sessionStorage` lui-même qui lève.
    const blocked = () => {
      throw new DOMException("Access denied", "SecurityError")
    }
    expect(() => rememberEntryPage("/en", blocked)).not.toThrow()
    expect(readEntryPage(blocked)).toBeUndefined()

    const corrupted = memoryStorage()
    corrupted.data.set(ENTRY_PAGE_KEY, "{")
    expect(readEntryPage(() => corrupted)).toBeUndefined()
  })
})

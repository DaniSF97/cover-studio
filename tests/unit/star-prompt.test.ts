import { describe, expect, it } from "vitest"

import { dismissStarPrompt, registerExport } from "@/lib/star-prompt"

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial }
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => {
      data[key] = value
    },
  }
}

describe("registerExport", () => {
  it("affiche le rappel au premier et au cinquième export seulement", () => {
    const storage = memoryStorage()
    const shown = Array.from({ length: 7 }, () => registerExport(storage))
    expect(shown).toEqual([true, false, false, false, true, false, false])
  })

  it("ne relance plus une fois l'étoile demandée", () => {
    const storage = memoryStorage()
    expect(registerExport(storage)).toBe(true)
    dismissStarPrompt(storage)
    for (let i = 0; i < 6; i++) expect(registerExport(storage)).toBe(false)
  })

  it("ignore un stockage corrompu ou absent", () => {
    expect(registerExport(memoryStorage({ "cover-studio:star-prompt": "{pas du json" }))).toBe(true)
    expect(registerExport(null)).toBe(false)
  })

  it("ne plante pas si l'écriture échoue", () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota")
      },
    }
    expect(registerExport(storage)).toBe(true)
  })
})

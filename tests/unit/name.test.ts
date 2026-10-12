import { describe, expect, it } from "vitest"

import { joinName, nameParts, rebaseRange } from "@/lib/name"

describe("nameParts", () => {
  it("découpe le nom autour de l'accent", () => {
    expect(nameParts("OngolaPhone", { start: 6, end: 11 })).toEqual([
      { text: "Ongola", accent: false },
      { text: "Phone", accent: true },
    ])
    expect(nameParts("MyBigApp", { start: 2, end: 5 })).toEqual([
      { text: "My", accent: false },
      { text: "Big", accent: true },
      { text: "App", accent: false },
    ])
  })

  it("ignore une plage vide ou hors du texte", () => {
    expect(nameParts("App", { start: 2, end: 2 })).toEqual([{ text: "App", accent: false }])
    expect(nameParts("App", { start: 5, end: 9 })).toEqual([{ text: "App", accent: false }])
    expect(nameParts("", undefined)).toEqual([])
  })
})

describe("rebaseRange", () => {
  const accent = { start: 3, end: 6 } // "MonApp" → "App"

  it("laisse dehors un ajout au bord de l'accent", () => {
    expect(rebaseRange("MonApp", "MonAppX", accent)).toEqual({ start: 3, end: 6 })
    expect(rebaseRange("MonApp", "MonXApp", accent)).toEqual({ start: 4, end: 7 })
    expect(rebaseRange("MonApp", "XMonApp", accent)).toEqual({ start: 4, end: 7 })
  })

  it("agrandit ou réduit l'accent modifié de l'intérieur", () => {
    expect(rebaseRange("MonApp", "MonApXp", accent)).toEqual({ start: 3, end: 7 })
    expect(rebaseRange("MonApp", "Monpp", accent)).toEqual({ start: 3, end: 5 })
  })

  it("suit un accent remplacé, oublie un nom retapé", () => {
    expect(rebaseRange("MonApp", "MonKit", accent)).toEqual({ start: 3, end: 6 })
    expect(rebaseRange("MonApp", "Klivar", accent)).toBeUndefined()
    expect(rebaseRange("MonApp", "Mon", accent)).toBeUndefined()
  })
})

describe("joinName", () => {
  it("reprend les deux parties des anciennes versions", () => {
    expect(joinName("Ongola", "Phone")).toEqual({ name: "OngolaPhone", accent: { start: 6, end: 11 } })
    expect(joinName("Klivar")).toEqual({ name: "Klivar", accent: undefined })
  })
})

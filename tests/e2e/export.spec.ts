import { expect, test, type Page } from "@playwright/test"
import { readFile } from "node:fs/promises"

import { openEditor, openPanel, templateButtons } from "./helpers/editor"
import { en } from "./helpers/messages"
import { pngSize } from "./helpers/png"

// Un export rend le DOM en PNG : plusieurs tests en parallèle se disputent le CPU,
// les délais par défaut (30 s par test, 5 s par assertion) sont alors trop justes.
const EXPORT_TIMEOUT = 60_000

async function download(page: Page) {
  const [file] = await Promise.all([
    page.waitForEvent("download", { timeout: EXPORT_TIMEOUT }),
    page.getByRole("button", { name: en("export", "downloadPng") }).click(),
  ])
  const path = await file.path()
  return { filename: file.suggestedFilename(), png: await readFile(path) }
}

test.describe("export PNG", () => {
  test("chaque template produit un PNG aux dimensions du format", async ({ page }) => {
    await openEditor(page)

    // Les templates sont découverts dans l'interface : en ajouter un l'inclut ici sans rien changer.
    const buttons = templateButtons(page)
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(5)
    // Chaque export prend quelques secondes : le délai suit le nombre de templates.
    test.setTimeout(count * 30_000)

    for (let i = 0; i < count; i++) {
      await openPanel(page, "railTemplates")
      const button = templateButtons(page).nth(i)
      const name = (await button.innerText()).split("\n")[0]

      await test.step(`template « ${name} »`, async () => {
        await button.click()
        await expect(button).toHaveAttribute("aria-pressed", "true")

        await openPanel(page, "railExport")
        const { filename, png } = await download(page)

        expect(filename).toMatch(/-cover\.png$/)
        expect(pngSize(png)).toEqual({ width: 2400, height: 1500 })
      })
    }
  })

  test("respecte le format choisi et la haute résolution", async ({ page }) => {
    test.setTimeout(3 * EXPORT_TIMEOUT)
    await openEditor(page)
    await openPanel(page, "railExport")

    await page.getByRole("button", { name: /Open Graph/ }).click()
    const standard = await download(page)
    expect(standard.filename).toMatch(/-og\.png$/)
    expect(pngSize(standard.png)).toEqual({ width: 1200, height: 630 })

    await page.getByRole("switch", { name: new RegExp(en("export", "hdLabel").replace(/[()]/g, "\\$&")) }).click()
    const hd = await download(page)
    expect(pngSize(hd.png)).toEqual({ width: 2400, height: 1260 })
  })

  test("nomme le fichier d'après le nom de l'application", async ({ page }) => {
    test.setTimeout(2 * EXPORT_TIMEOUT)
    await openEditor(page)
    await openPanel(page, "railContent")
    await page.locator("#field-content-name").fill("Café Pro")

    await openPanel(page, "railExport")
    const { filename } = await download(page)

    expect(filename).toBe("cafepro-cover.png")
  })

  test("affiche la confirmation de téléchargement", async ({ page }) => {
    test.setTimeout(2 * EXPORT_TIMEOUT)
    await openEditor(page)
    await openPanel(page, "railExport")
    await download(page)

    await expect(page.getByText(en("export", "toastSuccess"))).toBeVisible({ timeout: EXPORT_TIMEOUT })
  })
})

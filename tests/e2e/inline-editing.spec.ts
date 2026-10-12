import { expect, test } from "@playwright/test"

import { openEditor, openPanel } from "./helpers/editor"
import { en } from "./helpers/messages"

// Édition directe sur l'aperçu (docs/INLINE-EDITING.md).
test.describe("édition directe", () => {
  test("le nom se modifie sur l'aperçu et dans le panneau", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    const name = preview.getByRole("button", { name: en("fields", "nameLabel"), exact: true })

    await name.click()
    const toolbar = page.getByRole("toolbar", { name: en("inlineEditing", "toolbarLabel") })
    await expect(toolbar).toBeVisible()

    await name.click()
    const input = preview.getByRole("textbox", { name: en("fields", "nameLabel"), exact: true })
    await expect(input).toBeFocused()
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.type("Klivar")
    await page.keyboard.press("Enter")

    await expect(preview.getByRole("button", { name: en("fields", "nameLabel"), exact: true })).toHaveText("Klivar")
    await openPanel(page, "railContent")
    const settings = page.getByRole("complementary", { name: en("editor", "settingsLabel") })
    await expect(settings.getByLabel(en("fields", "nameLabel"), { exact: true })).toHaveValue("Klivar")

    await page.keyboard.press("Escape")
    await expect(toolbar).toBeHidden()
  })

  test("un texte vidé laisse un emplacement, absent de l'export", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    const description = preview.getByRole("button", { name: en("fields", "descriptionLabel") })

    await description.focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.press("Backspace")
    await page.keyboard.press("Enter")

    // L'emplacement porte le libellé du champ, pour pouvoir le remplir à nouveau.
    await expect(description).toHaveText(en("fields", "descriptionLabel"))

    await openPanel(page, "railExport")
    const [file] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: en("export", "downloadPng") }).click(),
    ])
    expect(file.suggestedFilename()).toMatch(/\.png$/)
    // La copie d'export est démontée après la capture.
    await expect(page.locator("#cover-export-node")).toHaveCount(0)
  })

  test("met en accent les lettres sélectionnées du nom", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    const name = preview.getByRole("button", { name: en("fields", "nameLabel"), exact: true })

    await name.focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.type("CoverStudio")
    await page.keyboard.press("Home")
    for (let i = 0; i < 5; i++) await page.keyboard.press("Shift+ArrowRight")

    const toolbar = page.getByRole("toolbar", { name: en("inlineEditing", "toolbarLabel") })
    await toolbar.getByRole("button", { name: en("inlineEditing", "accent"), exact: true }).click()
    await page.keyboard.press("Enter")

    const accent = name.locator("[data-accent]")
    await expect(accent).toHaveText("Cover")
    await expect(name).toHaveText("CoverStudio")

    await toolbar.getByRole("button", { name: en("inlineEditing", "accentRemove") }).click()
    await expect(accent).toHaveCount(0)
  })

  test("retaper le nom par-dessus un accent ne colore que la partie choisie", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    const name = preview.getByRole("button", { name: en("fields", "nameLabel"), exact: true })
    const toolbar = page.getByRole("toolbar", { name: en("inlineEditing", "toolbarLabel") })
    const accentButton = toolbar.getByRole("button", { name: en("inlineEditing", "accent"), exact: true })

    // Accent sur le début du nom, puis tout le nom retapé.
    await name.focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("Home")
    for (let i = 0; i < 2; i++) await page.keyboard.press("Shift+ArrowRight")
    await accentButton.click()
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.type("MonApp")

    // Le navigateur ne doit pas réappliquer la couleur supprimée.
    const input = preview.getByRole("textbox", { name: en("fields", "nameLabel"), exact: true })
    await expect(input.locator("font, span:not([data-accent])")).toHaveCount(0)

    await page.keyboard.press("End")
    for (let i = 0; i < 3; i++) await page.keyboard.press("Shift+ArrowLeft")
    await accentButton.click()
    await page.keyboard.press("Enter")

    await expect(name.locator("[data-accent]")).toHaveText("App")
    await expect(name).toHaveText("MonApp")
  })

  test("change la forme de la pastille", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    await preview.getByRole("button", { name: en("fields", "badgeLabel") }).click()

    const toolbar = page.getByRole("toolbar", { name: en("inlineEditing", "toolbarLabel") })
    await toolbar.getByRole("button", { name: en("inlineEditing", "badgeShape") }).click()
    await page.getByRole("radio", { name: en("inlineEditing", "badgeShapeSquare"), exact: true }).click()

    const pill = preview.getByRole("button", { name: en("fields", "badgeLabel") }).locator("..")
    await expect(pill).toHaveCSS("border-radius", "0px")
  })

  test("ajoute des fonctionnalités comme des tags", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    const chips = preview.locator("[data-edit-path^='content.chips.']")
    const count = await chips.count()

    await preview.getByRole("button", { name: en("inlineEditing", "chipAdd") }).click()
    await page.keyboard.type("Offline")
    await page.keyboard.press("Enter")
    await expect(chips).toHaveCount(count + 1)
    await expect(chips.last()).toHaveText("Offline")

    // Une chip vidée disparaît.
    await chips.last().click()
    const toolbar = page.getByRole("toolbar", { name: en("inlineEditing", "toolbarLabel") })
    await toolbar.getByRole("button", { name: en("inlineEditing", "chipRemove") }).click()
    await expect(chips).toHaveCount(count)
  })

  test("la barre d'outils règle la taille de l'élément", async ({ page }) => {
    await openEditor(page)
    const preview = page.getByRole("region", { name: en("editor", "previewLabel") })
    await preview.getByRole("button", { name: en("fields", "descriptionLabel") }).click()

    const toolbar = page.getByRole("toolbar", { name: en("inlineEditing", "toolbarLabel") })
    await toolbar.getByRole("button", { name: en("inlineEditing", "larger") }).click()
    await expect(toolbar.getByRole("button", { name: en("inlineEditing", "sizeReset") })).toHaveText(/110/)

    // Le réglage est le même que celui du panneau Police.
    await openPanel(page, "railTypography")
    await expect(page.getByText(/110\s?%/).first()).toBeVisible()
  })
})

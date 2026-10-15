/**
 * Génère les visuels des pages indexables (docs/SEO.md) avec Cover Studio lui-même :
 *   public/seo/<page>/og.png         image Open Graph 1200×630 de la page
 *   public/seo/<page>/example-*.webp exemples affichés dans la page
 *
 * Usage : pnpm build && pnpm seo:visuals
 * Les « captures d'app » sont celles de Cover Studio (Landing, éditeur, en ordinateur et
 * mobile) : les exemples montrent un vrai projet, le nôtre, et non une maquette inventée.
 */
import { spawn, spawnSync } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { chromium } from "@playwright/test"

const PORT = 3111
const BASE = `http://localhost:${PORT}`
const OUT_DIR = "public/seo"
const COVER = {
  badge: "OPEN SOURCE",
  name: "Cover Studio",
  description: "Turn your app screenshots into a cover for your README, Product Hunt or LinkedIn.",
  chips: ["Free", "No account", "100% client-side"],
  footer: "github.com/roosveltkn/cover-studio",
  browserUrl: "coverstudio.roosveltkn.com",
}

// Format (bouton du panneau Export : libellé + largeur) de chaque Export format utilisé.
const FORMATS = {
  og: { name: /Open Graph/, width: "1200" },
  github: { name: /GitHub/, width: "1280" },
  cover: { name: /^Cover/, width: "2400" },
}

const VISUALS = [
  { file: "github-social-preview/og.png", format: "og", template: "Showcase", shots: ["editor", "landing-mobile"] },
  { file: "github-social-preview/example-showcase.webp", format: "github", template: "Showcase", shots: ["editor", "landing-mobile"] },
  { file: "github-social-preview/example-spotlight.webp", format: "github", template: "Spotlight", shots: ["landing"] },
  { file: "readme-banner/og.png", format: "og", template: "Bento", shots: ["landing", "editor", "landing-mobile"] },
  { file: "readme-banner/example-bento.webp", format: "cover", template: "Bento", shots: ["landing", "editor", "landing-mobile"] },
  { file: "readme-banner/example-editorial.webp", format: "cover", template: "Editorial", shots: ["editor"] },
]

const sharp = createRequire(createRequire(import.meta.url).resolve("next/package.json"))("sharp")

async function rail(page, name) {
  await page.getByRole("navigation", { name: "Editor sections" }).getByRole("button", { name }).click()
}

async function fill(page, id, value) {
  await page.locator(`#${id}`).fill(value)
}

async function setChips(page, chips) {
  for (const label of await page
    .getByRole("button", { name: /^Remove / })
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label")))) {
    await page.getByRole("button", { name: label, exact: true }).first().click()
  }
  for (const chip of chips) {
    await page.locator("#field-content-chips").fill(chip)
    await page.locator("#field-content-chips").press("Enter")
  }
}

/** Ouvre l'éditeur depuis la Landing, avec ces captures. */
async function openEditor(page, files) {
  await page.goto(`${BASE}/en`)
  await page.locator("#landing-image").setInputFiles(files)
  await page.getByRole("button", { name: "Create my cover" }).click()
  await page.waitForURL(/\/en\/editor/)
  await page.getByRole("region", { name: "Cover preview" }).waitFor()
}

async function pickTemplate(page, name) {
  await rail(page, "Templates")
  await page
    .getByRole("list", { name: "Available templates" })
    .getByRole("button")
    .filter({ has: page.getByText(name, { exact: true }) })
    .click()
}

/** Captures d'écran de Cover Studio, servant de « captures d'app » aux exemples. */
async function takeShots(browser) {
  const dir = join(tmpdir(), "cs-seo-shots")
  await mkdir(dir, { recursive: true })
  const shots = {}

  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US" })
  const page = await desktop.newPage()
  await page.goto(`${BASE}/en`)
  await page.waitForTimeout(1500)
  shots.landing = join(dir, "landing.png")
  await page.screenshot({ path: shots.landing })
  await openEditor(page, shots.landing)
  await rail(page, "Templates")
  await page.waitForTimeout(800)
  shots.editor = join(dir, "editor.png")
  await page.screenshot({ path: shots.editor })
  await desktop.close()

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: "en-US",
  })
  const phone = await mobile.newPage()
  await phone.goto(`${BASE}/en`)
  await phone.waitForTimeout(1500)
  shots["landing-mobile"] = join(dir, "landing-mobile.png")
  await phone.screenshot({ path: shots["landing-mobile"] })
  await phone.goto(`${BASE}/en/github-social-preview`)
  await phone.waitForTimeout(1000)
  await phone.mouse.wheel(0, 1400)
  await phone.waitForTimeout(600)
  shots["page-mobile"] = join(dir, "page-mobile.png")
  await phone.screenshot({ path: shots["page-mobile"] })
  await phone.goto(`${BASE}/en`)
  await phone.locator("#landing-image").setInputFiles(shots.landing)
  await phone.getByRole("button", { name: "Create my cover" }).click()
  await phone.waitForURL(/\/en\/editor/)
  await phone.waitForTimeout(1500)
  shots["editor-mobile"] = join(dir, "editor-mobile.png")
  await phone.screenshot({ path: shots["editor-mobile"] })
  await mobile.close()

  return shots
}

const server = spawn("pnpm", ["exec", "serve", "out", "-l", String(PORT)], {
  stdio: "ignore",
  shell: true,
})

try {
  for (let i = 0; i < 60; i++) {
    if (await fetch(`${BASE}/en`).then((r) => r.ok, () => false)) break
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const browser = await chromium.launch()
  const shots = await takeShots(browser)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: "en-US",
    acceptDownloads: true,
  })
  const page = await context.newPage()

  for (const visual of VISUALS) {
    await openEditor(page, visual.shots.map((shot) => shots[shot]))
    await pickTemplate(page, visual.template)
    await rail(page, "Text")
    await fill(page, "field-content-badge", COVER.badge)
    await fill(page, "field-content-name", COVER.name)
    await fill(page, "field-content-description", COVER.description)
    await setChips(page, COVER.chips)
    await fill(page, "field-content-footer", COVER.footer)
    const browserUrl = page.locator("#field-content-browserUrl")
    if (await browserUrl.count()) await browserUrl.fill(COVER.browserUrl)
    await rail(page, "Export")
    const format = FORMATS[visual.format]
    await page.getByRole("button", { name: format.name }).filter({ hasText: format.width }).click()
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download PNG" }).click(),
    ])
    const png = await download.path().then((path) => sharp(path).toBuffer())
    const target = join(OUT_DIR, visual.file)
    await mkdir(join(target, ".."), { recursive: true })
    await writeFile(
      target,
      visual.file.endsWith(".webp")
        ? await sharp(png).webp({ quality: 82 }).toBuffer()
        : await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
    )
    console.log(`${target} écrit`)
  }

  await browser.close()
} finally {
  // Avec `shell: true`, `kill()` n'arrête que le shell sous Windows : le serveur
  // garderait `out/` verrouillé et ferait échouer le build suivant.
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" })
  } else {
    server.kill()
  }
}

// ContrÃ´le des messages : `pnpm i18n:check`.
//   1. mÃªmes clÃ©s dans toutes les langues ;
//   2. mÃªmes variables `{nom}` dans chaque message ;
//   3. aucune clÃ© inutilisÃ©e dans le code ;
//   4. aucun texte accentuÃ© en dur dans les composants (hors commentaires).
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = process.cwd()
const LOCALES = ["fr", "en", "es"]
const REFERENCE = "fr"
// Namespaces dont les clÃ©s sont composÃ©es dynamiquement (`${id}Title`).
const DYNAMIC_NAMESPACES = new Set(["panels"])
const SOURCE_DIRS = ["app", "components", "i18n", "lib", "mockups", "stores", "templates"]
const TEXT_DIRS = ["components", "mockups", "templates"]

const messages = Object.fromEntries(
  LOCALES.map((locale) => [locale, JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"))])
)

function flatten(tree) {
  const flat = new Map()
  for (const [namespace, entries] of Object.entries(tree)) {
    for (const [key, value] of Object.entries(entries)) flat.set(`${namespace}.${key}`, value)
  }
  return flat
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === "node_modules" ? [] : walk(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

const problems = []
const flat = Object.fromEntries(LOCALES.map((locale) => [locale, flatten(messages[locale])]))
const variables = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",")

// 1 et 2 : paritÃ© des clÃ©s et des variables avec la langue de rÃ©fÃ©rence.
for (const locale of LOCALES.filter((l) => l !== REFERENCE)) {
  for (const key of flat[REFERENCE].keys()) {
    if (!flat[locale].has(key)) problems.push(`[${locale}] clÃ© manquante : ${key}`)
    else if (variables(flat[locale].get(key)) !== variables(flat[REFERENCE].get(key)))
      problems.push(`[${locale}] variables diffÃ©rentes de ${REFERENCE} : ${key}`)
  }
  for (const key of flat[locale].keys()) {
    if (!flat[REFERENCE].has(key)) problems.push(`[${locale}] clÃ© absente de ${REFERENCE} : ${key}`)
  }
}

// 3 : une clÃ© est utilisÃ©e si son nom apparaÃ®t dans le code. Les familles de
// pluriel (`xOne` / `xOther`) sont rÃ©solues par leur prÃ©fixe.
const sources = SOURCE_DIRS.flatMap((dir) => walk(join(ROOT, dir)))
const code = sources.map((file) => readFileSync(file, "utf8")).join("\n")
for (const key of flat[REFERENCE].keys()) {
  const [namespace, name] = key.split(".")
  if (DYNAMIC_NAMESPACES.has(namespace)) continue
  const base = name.replace(/(One|Other)$/, "")
  if (!code.includes(`"${name}"`) && !code.includes(`${base}$\{`) && !code.includes(`\`${base}`)) {
    problems.push(`clÃ© inutilisÃ©e : ${key}`)
  }
}

// 4 : texte accentuÃ© hors commentaires dans les fichiers de rendu.
const ACCENTS = /[Ã Ã¢Ã§Ã©Ã¨ÃªÃ«Ã®Ã¯Ã´Ã»Ã¹Ã¼Å“Ã€Ã‰ÃˆÃŠ]/
for (const file of TEXT_DIRS.flatMap((dir) => walk(join(ROOT, dir)))) {
  const stripped = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ""))
    .split(/\r?\n/)
    .map((line) => line.replace(/(^|\s)\/\/.*$/, "$1"))
  stripped.forEach((line, index) => {
    if (ACCENTS.test(line)) problems.push(`texte en dur : ${relative(ROOT, file)}:${index + 1}`)
  })
}

if (problems.length) {
  console.error(problems.map((problem) => `âœ— ${problem}`).join("\n"))
  console.error(`\n${problems.length} problÃ¨me(s) i18n.`)
  process.exit(1)
}
console.log(`i18n OK : ${flat[REFERENCE].size} clÃ©s Ã— ${LOCALES.length} langues.`)

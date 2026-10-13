/**
 * Rappel discret « une étoile sur GitHub » après un export réussi.
 * Il apparaît au premier export puis au cinquième, et plus jamais une fois
 * l'étoile demandée. Le compteur vit dans localStorage, jamais dans le store.
 */

const STORAGE_KEY = "cover-studio:star-prompt"

/** Numéros d'export (1 = le premier) qui affichent le rappel. */
export const STAR_PROMPT_EXPORTS: readonly number[] = [1, 5]

type State = { exports: number; dismissed: boolean }

type Storage = Pick<globalThis.Storage, "getItem" | "setItem">

function read(storage: Storage): State {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) ?? "null") as Partial<State> | null
    return {
      exports: typeof parsed?.exports === "number" ? parsed.exports : 0,
      dismissed: parsed?.dismissed === true,
    }
  } catch {
    return { exports: 0, dismissed: false }
  }
}

function write(storage: Storage, state: State) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Stockage indisponible (navigation privée) : on perd seulement le compteur.
  }
}

function defaultStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage
  } catch {
    return null
  }
}

/** Compte un export réussi et indique s'il faut afficher le rappel. */
export function registerExport(storage: Storage | null = defaultStorage()): boolean {
  if (!storage) return false
  const state = read(storage)
  const next = { ...state, exports: state.exports + 1 }
  write(storage, next)
  return !next.dismissed && STAR_PROMPT_EXPORTS.includes(next.exports)
}

/** Le visiteur a cliqué sur l'étoile : on ne le relance plus. */
export function dismissStarPrompt(storage: Storage | null = defaultStorage()) {
  if (!storage) return
  write(storage, { ...read(storage), dismissed: true })
}

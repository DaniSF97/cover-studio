import { useCoverStore } from "@/stores/cover-store"

/** Insère une chip vide après `after` (en fin de liste sans rang) et la passe en saisie. */
export function insertChip(after?: number) {
  const { config, setField, setSelection, setEditing } =
    useCoverStore.getState()
  const chips = [...config.content.chips]
  const index = after === undefined ? chips.length : after + 1
  chips.splice(index, 0, "")
  setField("content.chips", chips)
  setSelection({ element: "chips", path: `content.chips.${index}` })
  setEditing(true)
}

/** Retire une chip et la désélectionne. */
export function removeChip(index: number) {
  const { config, setField, setSelection } = useCoverStore.getState()
  setSelection(null)
  setField(
    "content.chips",
    config.content.chips.filter((_, position) => position !== index)
  )
}

import { DefaultIcon, Icons } from "../data/icons"

const DEFAULT_COLOR = 'bg-black'
const JOINER = "--"
const DEFAULT_RESULT = { color: "white", label: "N/A", indexes: null }

export const showTileContent = (tile, data) => {
  tile.dataset.isOpen = 'true'
  tile.src = Icons[data.label.toLowerCase()] || DefaultIcon
  tile.style.backgroundColor = data.color
  tile.alt = data.label.toUpperCase()
  tile.classList.remove(DEFAULT_COLOR)
}

export const resetTileContent = (tile) => {
  tile.dataset.isOpen = 'false'
  tile.style.backgroundColor = null
  tile.src = DefaultIcon
  tile.alt = 'No Image'
  tile.classList.add(DEFAULT_COLOR)
}

export const extractTileContentsFromFinishedResult = (tileIndex, finishedResultValue) => {
  const tileKeyInBoard =
    Object
      .keys(finishedResultValue)
      .filter(key => {
        return finishedResultValue[key].includes(tileIndex)
      })

  if (tileKeyInBoard.length < 1) { return DEFAULT_RESULT }

  const result = tileKeyInBoard[0].split(JOINER)

  return {
    color: result[0],
    label: result[1],
    indexes: finishedResultValue[tileKeyInBoard[0]]
  }
}
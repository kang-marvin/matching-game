import { DefaultIcon, Icons } from "../data/icons"

interface DefaultResult {
  color: string;
  label: string;
  indexes: null | Array<number>
}

interface TileData {
  label: string;
  color: string;
}

interface FinishedResultInterface {
  [key: string]: Array<number>
}

const DEFAULT_COLOR: Readonly<string> = 'bg-black'
const JOINER: Readonly<string> = "--"
const DEFAULT_RESULT: Readonly<DefaultResult> = { color: "white", label: "N/A", indexes: null }


export const showTileContent = (tile: HTMLImageElement, data: Readonly<TileData>): void => {
  tile.dataset.isOpen = 'true'
  tile.src = Icons[data.label.toLowerCase() as keyof TileData] || DefaultIcon
  tile.style.backgroundColor = data.color
  tile.alt = data.label.toUpperCase()
  tile.classList.remove(DEFAULT_COLOR)
}

export const resetTileContent = (tile: HTMLImageElement): void => {
  tile.dataset.isOpen = 'false'
  tile.style.backgroundColor = ''
  tile.src = DefaultIcon
  tile.alt = 'No Image'
  tile.classList.add(DEFAULT_COLOR)
}

export const extractTileContentsFromFinishedResult = (tileIndex: number, finishedResultValue: FinishedResultInterface): DefaultResult => {
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
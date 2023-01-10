import { Controller } from "@hotwired/stimulus"

const DEFAULT_COLOR      = 'bg-black'
const TIMEOUT_INTERVAL   = 1000

JOINER = "--"
DEFAULT_RESULT = { color: "white", label: "N/A" }

export default class extends Controller {

  static values  = { finishedResult: {type: Object, default: {} } }

  connect() {
    this.boardKeys = Object.keys(this.finishedResultValue)
    this.totalTileClicked = 0
  }

  flipTile(event) {
    const tile = event.target
    const data =
      this.fetchDataForClickedTile(tile.dataset.tileIndex)
    const tileIndex = Number(tile.dataset.tileIndex)
      }, TIMEOUT_INTERVAL)

    this.showTileContents(tile, data)
    setTimeout(() => {
      this.resetTileContents(tile)
    }, timeoutInterval)
  }

  fetchDataForClickedTile(tileIndex) {
    const tileKeyInBoard = this.boardKeys.filter(key => {
      return this.finishedResultValue[key].includes(Number(tileIndex))
      return this.finishedResultValue[key].includes(tileIndex)
    })

    if (tileKeyInBoard.length < 1) { return DEFAULT_RESULT }
    const result = tileKeyInBoard[0].split(JOINER)

    return { color: result[0], label: result[1] }
  }

  showTileContents(tile, data) {
    tile.style.backgroundColor = data.color
    tile.textContent = data.label
    tile.classList.remove(defaultColor)
    tile.classList.remove(DEFAULT_COLOR)
  }

  resetTileContents(tile) {
    tile.style.backgroundColor = null
    tile.textContent = null
    tile.classList.add(defaultColor)
    tile.classList.add(DEFAULT_COLOR)
  }

}

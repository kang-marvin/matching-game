import { Controller } from "@hotwired/stimulus"

const defaultColor      = 'bg-black'
const timeoutInterval   = 1000

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

    this.showTileContents(tile, data)
    setTimeout(() => {
      this.resetTileContents(tile)
    }, timeoutInterval)
  }

  fetchDataForClickedTile(tileIndex) {
    const tileKeyInBoard = this.boardKeys.filter(key => {
      return this.finishedResultValue[key].includes(Number(tileIndex))
    })

    if (tileKeyInBoard.length < 1) { return DEFAULT_RESULT }
    const result = tileKeyInBoard[0].split(JOINER)

    return { color: result[0], label: result[1] }
  }

  showTileContents(tile, data) {
    tile.style.backgroundColor = data.color
    tile.textContent = data.label
    tile.classList.remove(defaultColor)
  }

  resetTileContents(tile) {
    tile.style.backgroundColor = null
    tile.textContent = null
    tile.classList.add(defaultColor)
  }

}

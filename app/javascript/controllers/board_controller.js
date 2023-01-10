import { Controller } from "@hotwired/stimulus"

const DEFAULT_COLOR      = 'bg-black'
const TIMEOUT_INTERVAL   = 1000
const DEFAULT_TILE_INDEX = 0

JOINER = "--"
DEFAULT_RESULT = { color: "white", label: "N/A" }

export default class extends Controller {

  static values  = { finishedResult: {type: Object, default: {} } }

  connect() {
    this.boardKeys = Object.keys(this.finishedResultValue)
    this.previouslyClickedTileIndex = DEFAULT_TILE_INDEX
    this.successiveTilesClicked = []
  }

  flipTile(event) {
    const tile = event.target
    const tileIndex = Number(tile.dataset.tileIndex)

    if (tileIndex != this.previouslyClickedTileIndex) {

      const data =
        this.fetchDataForClickedTile(tileIndex)

      this.showTileContents(tile, data)

      this.successiveTilesClicked = [...this.successiveTilesClicked, tile]

      if (this.successiveTilesClicked.length == 2) {
        setTimeout(() => {
          this.successiveTilesClicked.forEach(tile => {
            this.resetTileContents(tile)
          });
        }, TIMEOUT_INTERVAL)
        this.successiveTilesClicked = []
      }

      this.previouslyClickedTileIndex = tileIndex
    }
  }

  fetchDataForClickedTile(tileIndex) {
    const tileKeyInBoard = this.boardKeys.filter(key => {
      return this.finishedResultValue[key].includes(tileIndex)
    })

    if (tileKeyInBoard.length < 1) { return DEFAULT_RESULT }
    const result = tileKeyInBoard[0].split(JOINER)

    return { color: result[0], label: result[1] }
  }

  showTileContents(tile, data) {
    tile.style.backgroundColor = data.color
    tile.textContent = data.label
    tile.classList.remove(DEFAULT_COLOR)
  }

  resetTileContents(tile) {
    tile.style.backgroundColor = null
    tile.textContent = null
    tile.classList.add(DEFAULT_COLOR)
  }

}

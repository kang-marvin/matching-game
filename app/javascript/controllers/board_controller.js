import { Controller } from "@hotwired/stimulus"
import { DefaultIcon, Icons } from "./data/icons"

const DEFAULT_COLOR       = 'bg-black'
const TIMEOUT_INTERVAL    = 1500
const MATCHING_TILES_SIZE = 2
const DEFAULT_TILE_INDEX_OBJECT =  { mainIndex: null, matchingIndex: null }

JOINER = "--"
DEFAULT_RESULT = { color: "white", label: "N/A" }

export default class extends Controller {

  static values  = {
    finishedResult: {type: Object, default: {} },
    boardSize: Number,
    movesCount: {type: Number, default: 0}
  }
  static targets = [ "completion" ]
  static outlets = [ "timer" ]

  connect() {
    this.boardKeys = Object.keys(this.finishedResultValue)
    this.previouslyClickedTileIndexObject = DEFAULT_TILE_INDEX_OBJECT
    this.solvedTileIndexes      = []
    this.successiveTilesClicked = []

    this.timerOutlet.start()
  }

  flipTile(event) {
    this.movesCountValue++
    // const tile = event.target
    // const tileIndex = Number(tile.dataset.tileIndex)
    // const tileIsOpen = tile.dataset.isOpen == 'true'

    // if (this.previouslyClickedTileIsTheCurrentTile(tileIndex) == false || tileIsOpen == false) {
    //   const data = this.fetchDataForClickedTile(tileIndex)

    //   this.showTileContents(tile, data)
    //   this.successiveTilesClicked.push(tile)

    //   if (this.successiveTilesClicked.length == MATCHING_TILES_SIZE) {
    //     this.previouslyClickedTileContentsMatchesTheCurrentTile(tileIndex) ?
    //       this.updateSolvedTilesCollection() :
    //       this.resetSuccessiveClickedTilesContents()

    //     this.movesCountValue++
    //   }

    //   this.updatePreviouslyClickedTileIndexes(tileIndex, data['indexes'])

    //   this.showCompletionTextWhenAllTilesHaveBeenSolved()
    // }

  }

  fetchDataForClickedTile(tileIndex) {
    const tileKeyInBoard = this.boardKeys.filter(key => {
      return this.finishedResultValue[key].includes(tileIndex)
    })

    if (tileKeyInBoard.length < 1) { return DEFAULT_RESULT }
    const result = tileKeyInBoard[0].split(JOINER)

    return {
      color: result[0],
      label: result[1],
      indexes: this.finishedResultValue[tileKeyInBoard[0]]
    }
  }

  showTileContents(tile, data) {
    tile.dataset.isOpen = 'true'
    tile.src = Icons[data.label.toLowerCase()] || DefaultIcon
    tile.style.backgroundColor = data.color
    tile.alt = data.label.toUpperCase()
    tile.classList.remove(DEFAULT_COLOR)
  }

  showCompletionTextWhenAllTilesHaveBeenSolved() {
    if (this.solvedTileIndexes.length == this.boardSizeValue) {
      this.timerOutlet.stop()
      this.completionTarget.textContent = "Board Solved!!! Congratulations"
    }
  }

  previouslyClickedTileIsTheCurrentTile(tileIndex) {
    return (tileIndex == this.previouslyClickedTileIndexObject.mainIndex)
  }

  previouslyClickedTileContentsMatchesTheCurrentTile(tileIndex) {
    return (tileIndex == this.previouslyClickedTileIndexObject.matchingIndex)
  }

  updateSolvedTilesCollection() {
    this.solvedTileIndexes = [
      ...this.solvedTileIndexes,
      ...Object.values(this.previouslyClickedTileIndexObject)
    ]
    this.resetSuccessiveTileArray()
  }

  updatePreviouslyClickedTileIndexes(tileIndex, indexes) {
    this.previouslyClickedTileIndexObject = {
      mainIndex: tileIndex,
      matchingIndex: (indexes.filter(i => i != tileIndex)[0])
    }
  }

  resetSuccessiveTileArray() {
    this.successiveTilesClicked = []
  }

  resetSuccessiveClickedTilesContents() {
    setTimeout(() => {
      this.successiveTilesClicked.forEach(tile => {
        this.resetTileContents(tile)
      });
      this.resetSuccessiveTileArray()
    }, TIMEOUT_INTERVAL)
  }

  resetTileContents(tile) {
    tile.dataset.isOpen = 'false'
    tile.style.backgroundColor = null
    tile.src = DefaultIcon
    tile.alt = 'No Image'
    tile.classList.add(DEFAULT_COLOR)
  }

  movesCountValueChanged() {
    this.countOutlet.updateMovesCounter(this.movesCountValue)
  }

}

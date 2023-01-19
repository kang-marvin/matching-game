import { Controller } from "@hotwired/stimulus"
import { resetTileContent, showTileContent } from "./helper/tile"

const TIMEOUT_INTERVAL    = 1500
const MATCHING_TILES_SIZE = 2
const DEFAULT_TILE_INDEX_OBJECT =  { mainIndex: null, matchingIndex: null }

JOINER = "--"
DEFAULT_RESULT = { color: "white", label: "N/A" }

export default class extends Controller {

  static values  = {
    finishedResult: {type: Object, default: {} },
    boardSize: Number,
  }

  static outlets = [ "timer", "moves", "alert" ]

  connect() {
    this.boardKeys = Object.keys(this.finishedResultValue)
    this.previouslyClickedTileIndexObject = DEFAULT_TILE_INDEX_OBJECT
    this.solvedTileIndexes      = []
    this.successiveTilesClicked = []

    this.timerOutlet.start()
  }

  flipTile(event) {
    const tile = event.target
    const tileIndex = Number(tile.dataset.tileIndex)
    const tileIsOpen = tile.dataset.isOpen == 'true'

    if (
        this.#previouslyClickedTileIsTheCurrentTile(tileIndex) == false ||
        tileIsOpen == false
      ) {
      const data = this.#fetchDataForClickedTile(tileIndex)

      showTileContent(tile, data)
      this.successiveTilesClicked.push(tile)

      if (this.successiveTilesClicked.length == MATCHING_TILES_SIZE) {
        this.#previouslyClickedTileContentsMatchesTheCurrentTileContents(tileIndex) ?
          this.#updateSolvedTilesCollection() :
          this.#resetSuccessiveClickedTilesContents()

        this.movesOutlet.increaseCount()
      }

      this.#updatePreviouslyClickedTileIndexes(tileIndex, data['indexes'])

      this.#showCompletionInformationIfBoardIsCompleted()
    }

  }

  #fetchDataForClickedTile(tileIndex) {
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

  #showCompletionInformationIfBoardIsCompleted() {
    if (this.solvedTileIndexes.length == this.boardSizeValue) {
      this.timerOutlet.stop()
      this.alertOutlet.boardCompleted()
    }
  }

  #previouslyClickedTileIsTheCurrentTile(tileIndex) {
    return (tileIndex == this.previouslyClickedTileIndexObject.mainIndex)
  }

  #previouslyClickedTileContentsMatchesTheCurrentTileContents(tileIndex) {
    return (tileIndex == this.previouslyClickedTileIndexObject.matchingIndex)
  }

  #updateSolvedTilesCollection() {
    this.solvedTileIndexes = [
      ...this.solvedTileIndexes,
      ...Object.values(this.previouslyClickedTileIndexObject)
    ]
    this.resetSuccessiveTileArray()
  }

  #updatePreviouslyClickedTileIndexes(tileIndex, indexes) {
    this.previouslyClickedTileIndexObject = {
      mainIndex: tileIndex,
      matchingIndex: (indexes.filter(i => i != tileIndex)[0])
    }
  }

  #resetSuccessiveTileArray() {
    this.successiveTilesClicked = []
  }

  #resetSuccessiveClickedTilesContents() {
    setTimeout(() => {
      this.successiveTilesClicked.forEach(tile => {
        resetTileContent(tile)
      });
      this.#resetSuccessiveTileArray()
    }, TIMEOUT_INTERVAL)
  }

}

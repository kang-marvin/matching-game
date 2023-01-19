import { Controller } from "@hotwired/stimulus"
import {
  extractTileContentsFromFinishedResult,
  resetTileContent,
  showTileContent
} from "./helper/tile"

const TIMEOUT_INTERVAL    = 1500
const MATCHING_TILES_SIZE = 2
const DEFAULT_TILE_INDEX_OBJECT =  { mainIndex: null, matchingIndex: null }

export default class extends Controller {

  static values  = {
    finishedResult: {type: Object, default: {} },
    boardSize: Number,
  }

  static outlets = [ "timer", "moves", "alert" ]

  connect() {
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
      const tileContent =
        extractTileContentsFromFinishedResult(
          tileIndex,
          this.finishedResultValue
        )
      showTileContent(tile, tileContent)
      this.successiveTilesClicked.push(tile)

      if (this.successiveTilesClicked.length == MATCHING_TILES_SIZE) {
        this.movesOutlet.increaseCount()
        this.#previouslyClickedTileContentsMatchesTheCurrentTileContents(tileIndex) ?
          this.#updateSolvedTilesCollection() :
          this.#resetSuccessiveClickedTilesContents()
      }

      this.#updatePreviouslyClickedTileIndexes(tileIndex, tileContent['indexes'])

      this.#showCompletionInformationIfBoardIsCompleted()
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
    this.#resetSuccessiveTileArray()
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

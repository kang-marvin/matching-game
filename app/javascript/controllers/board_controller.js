import { Controller } from "@hotwired/stimulus"
import {
  extractTileContentsFromFinishedResult,
  resetTileContent,
  showTileContent
} from "./helper/tile"

const TIMEOUT_INTERVAL    = 1500
const MATCHING_TILES_SIZE = 2

export default class extends Controller {

  static values  = {
    finishedResult: {type: Object, default: {} },
    boardSize: Number,
  }

  static outlets = [ "timer", "moves", "alert", "store" ]

  connect() {
    this.solvedTileIndexes      = []
    this.successiveTilesClicked = []

    this.timerOutlet.start()
  }

  flipTile(event) {
    const tile = event.target
    const tileIndex = Number(tile.dataset.tileIndex)
    const tileIsOpen = tile.dataset.isOpen == 'true'
    const previousTile = this.storeOutlet.tile

    if (
        previousTile.mainIndex !== tileIndex ||
        tileIsOpen == false
      ) {

      this.storeOutlet.addToSuccessiveTilesCollection(tile)
      const currentTileContent =
        extractTileContentsFromFinishedResult(
          tileIndex,
          this.finishedResultValue
        )
      showTileContent(tile, currentTileContent)

      if (
        this.storeOutlet.successiveTilesClickedCount == MATCHING_TILES_SIZE
      ) {
        this.movesOutlet.increaseCount()
        previousTile.matchingIndex === tileIndex ?
          this.#updateSolvedTilesCollection(previousTile) :
          this.#resetSuccessiveClickedTilesContents()
      }

      this.storeOutlet.updatePreviouslyClickedTile(
        tileIndex,
        currentTileContent['indexes']
      )

      this.#showCompletionInformationIfBoardIsCompleted()
    }

  }

  #updateSolvedTilesCollection(previousTile) {
    this.storeOutlet.addToSolvedTilesCollection(previousTile)
    this.storeOutlet.resetSuccessiveTilesCollection()
  }

  #showCompletionInformationIfBoardIsCompleted() {
    if (
      this.storeOutlet.solvedTilesCollectionCount == this.boardSizeValue
    ) {
      this.timerOutlet.stop()
      this.storeOutlet.resetStore()
      this.alertOutlet.boardCompleted()
    }
  }

  #resetSuccessiveClickedTilesContents() {
    setTimeout(() => {
      this.storeOutlet.successiveTiles.forEach(tile => {
        resetTileContent(tile)
      });
      this.storeOutlet.resetSuccessiveTilesCollection()
    }, TIMEOUT_INTERVAL)
  }

}

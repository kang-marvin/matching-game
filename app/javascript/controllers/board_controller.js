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

      this.successiveTilesClicked.push(tile)
      const currentTileContent =
        extractTileContentsFromFinishedResult(
          tileIndex,
          this.finishedResultValue
        )
      showTileContent(tile, currentTileContent)

      if (
        this.storeOutlet.successiveTilesClickedCount == MATCHING_TILES_SIZE
      ) {
        previousTile.matchingIndex === tileIndex ?
          this.storeOutlet.addToSolvedTilesCollection(previousTile) :
          this.#resetSuccessiveClickedTilesContents()

        this.movesOutlet.increaseCount()
        this.storeOutlet.resetSuccessiveTilesCollection()
      }

      this.storeOutlet.updatePreviouslyClickedTile(
        tileIndex,
        currentTileContent['indexes']
      )

      this.#showCompletionInformationIfBoardIsCompleted()
    }

  }

  #showCompletionInformationIfBoardIsCompleted() {
    if (
      this.storeOutlet.solvedTilesCollectionCount == this.boardSizeValue
    ) {
      this.timerOutlet.stop()
      this.alertOutlet.boardCompleted()
      this.storeOutlet.resetStore()
    }
  }

  #resetSuccessiveClickedTilesContents() {
    setTimeout(() => {
      this.successiveTilesClicked.forEach(tile => {
        resetTileContent(tile)
      });
    }, TIMEOUT_INTERVAL)
  }

}

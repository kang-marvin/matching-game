import { Controller } from "@hotwired/stimulus"

const DEFAULT_TILE_INDEX_OBJECT =  { mainIndex: null, matchingIndex: null }

// Connects to data-controller="store"
export default class extends Controller {
  connect() {
    this.solvedTilesCollection = []
    this.successiveTilesClicked = []
    this.lastClickedTileObject = DEFAULT_TILE_INDEX_OBJECT
  }

  updatePreviouslyClickedTile(currentTileIndex, indexes) {
    this.lastClickedTileObject = {
      mainIndex: currentTileIndex,
      matchingIndex: (indexes.filter(i => i != currentTileIndex)[0])
    }
  }

  addToSolvedTilesCollection(tile) {
    this.solvedTilesCollection = [
      ...this.solvedTilesCollection,
      ...Object.values(tile)
    ]
  }

  addToSuccessiveTilesCollection(tile) {
    this.successiveTilesClicked.push(tile)
  }

  resetStore() {
    this.resetPreviousTile()
    this.resetSuccessiveTilesCollection()
    this.resetSolvedTilesCollection()
  }

  resetPreviousTile() {
    this.lastClickedTileObject = DEFAULT_TILE_INDEX_OBJECT
  }

  resetSuccessiveTilesCollection() {
    this.successiveTilesClicked = []
  }

  resetSolvedTilesCollection() {
    this.solvedTilesCollection = []
  }

  get tile(){
    return this.lastClickedTileObject
  }

  get successiveTiles() {
    return this.successiveTilesClicked
  }

  get successiveTilesClickedCount() {
    return this.successiveTilesClicked.length
  }

  get solvedTilesCollectionCount() {
    return this.solvedTilesCollection.length
  }
}

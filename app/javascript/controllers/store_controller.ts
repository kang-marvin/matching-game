import { Controller } from "@hotwired/stimulus"

interface TileInterface {
  mainIndex: number | null;
  matchingIndex: number | null;
}

const DEFAULT_TILE_INDEX_OBJECT: TileInterface =  { mainIndex: null, matchingIndex: null }

export default class extends Controller {

  solvedTilesCollection: Array<number>
  successiveTilesClicked: Array<HTMLImageElement>
  lastClickedTileObject: TileInterface

  connect() {
    this.solvedTilesCollection = []
    this.successiveTilesClicked = []
    this.lastClickedTileObject = DEFAULT_TILE_INDEX_OBJECT
  }

  updatePreviouslyClickedTile(currentTileIndex: number, indexes: Array<number> ) {
    this.lastClickedTileObject = {
      mainIndex: currentTileIndex,
      matchingIndex: (indexes.filter((i: number) => i != currentTileIndex)[0])
    }
  }

  addToSolvedTilesCollection(tile: TileInterface) {
    this.solvedTilesCollection = [
      ...this.solvedTilesCollection,
      ...Object.values(tile)
    ]
  }

  addToSuccessiveTilesCollection(tile: HTMLImageElement) {
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

  resetSuccessiveTilesCollection(): void {
    this.successiveTilesClicked = []
  }

  resetSolvedTilesCollection() {
    this.solvedTilesCollection = []
  }

  get tile(): TileInterface {
    return this.lastClickedTileObject
  }

  get successiveTiles(): Array<HTMLImageElement> {
    return this.successiveTilesClicked
  }

  get successiveTilesClickedCount(): number {
    return this.successiveTilesClicked.length
  }

  get solvedTilesCollectionCount(): number {
    return this.solvedTilesCollection.length
  }
}

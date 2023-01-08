import { Controller } from "@hotwired/stimulus"

const defaultColor      = 'bg-black'
const timeoutInterval   = 1000

// Connects to data-controller="board"
export default class extends Controller {

  static values  = { board: Object }
  static targets = [ "test" ]

  initialize() {
    console.log("Board controller initialized")
  }

  connect() {
    console.log("Board controller connected")
    this.totalTileClicked = 0
  }

  flipTile(event) {
    const tile = event.target
    this.showTileContents(tile)
    setTimeout(() => {
      this.resetTileContents(tile)
    }, timeoutInterval)

    this.totalTileClicked++
    this.testTarget.textContent = this.totalTileClicked
  }

  showTileContents(tile) {
    tile.style.backgroundColor = "yellow"
    tile.textContent = "X"
    tile.classList.remove(defaultColor)
  }

  resetTileContents(tile) {
    tile.style.backgroundColor = null
    tile.textContent = null
    tile.classList.add(defaultColor)
  }

}

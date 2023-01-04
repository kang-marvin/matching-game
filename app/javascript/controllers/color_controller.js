import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="color"
const defaultColor = 'bg-black'
const timeoutInterval = 1000
const colorOptionIndex = 0

export default class extends Controller {

  static values = { board: Object }

  connect() {}

  flip(event) {
    const tile = event.target;
    const keys =
      Object
        .keys(this.boardValue)
        .filter(key => {
          return this.boardValue[key].includes(Number(tile.dataset.tileIndex))
        })
    const color = keys.length > 0
      ? keys[0].split('--')[colorOptionIndex]
      : defaultColor

    tile.style.backgroundColor = color

    tile.classList.remove(defaultColor)
    setTimeout( () => {
      tile.classList.add(defaultColor)
      tile.style.backgroundColor = null;
    }, timeoutInterval);
  }
}

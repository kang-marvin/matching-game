import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="moves"
export default class extends Controller {
  static targets = [ "display" ]

  static values = {count: {type: Number, default: 0}}

  increaseCount() {
    this.countValue++
  }

  countValueChanged() {
    this.#display()
  }

  #display() {
    if(this.hasDisplayTarget) {
      this.displayTarget.textContent = `${this.countValue} moves`
    }
  }
}

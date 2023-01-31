import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="moves"
export default class extends Controller {
  static targets = [ "display" ]
  declare hasDisplayTarget: boolean
  declare displayTarget: HTMLElement

  static values = {count: {type: Number, default: 0}}
  declare countValue: number

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

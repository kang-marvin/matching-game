import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="count"
export default class extends Controller {
  elapsedInterval: number

  static targets = [ "display" ]
  declare displayTarget: HTMLDivElement
  declare hasDisplayTarget: boolean

  static values = {
    elapsedDuration: {type: Number, default: 0 }
  }

  declare elapsedDurationValue: number


  connect() {
    this.elapsedInterval = 0
  }

  /** Public Methods */
  start() {
    this.elapsedInterval = setInterval(() => {
      this.elapsedDurationValue++
    },1000)
  }

  stop() {
    clearInterval(this.elapsedInterval)
  }

  elapsedDurationValueChanged() {
    if(this.hasDisplayTarget) {
      this.displayTarget.textContent =
        this.#calculateElapsedTime(this.elapsedDurationValue)
    }
  }

  /** Private Methods */
  #calculateElapsedTime(duration: number): string {
    const minutes = this.#toPadStart(Math.floor((duration % 3600) / 60))
    const seconds = this.#toPadStart(Math.floor(duration % 60))

    return `${minutes}:${seconds}`
  }

  #toPadStart(time: number): string {
    return time.toString().padStart(2,'0')
  }
}

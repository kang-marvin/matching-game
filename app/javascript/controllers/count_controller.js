import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="count"
export default class extends Controller {
  static targets = [ "moveCounter", "timeCounter" ]

  static values = {
    elapsedDuration: { type: Number, default: 0 }
  }

  connect() {
    this.elapsedInterval = null
  }

  /** Public Methods */
  startTimeCounter() {
    this.elapsedInterval = setInterval(() => {
      this.elapsedDurationValue++
    },1000)
  }

  stopTimeCounter() {
    clearInterval(this.elapsedInterval)
  }

  updateMovesCounter(movesCount) {
    this.moveCounterTarget.textContent =
      `${movesCount} move`
    // if(this.hasMoveCounterTarget) {
    // }
  }

  elapsedDurationValueChanged() {
    if(this.hasTimeCounterTarget) {
      this.timeCounterTarget.textContent =
        this.#calculateElapsedTime(this.elapsedDurationValue)
    }
  }

  /** Private Methods */
  #calculateElapsedTime(duration) {
    const minutes = this.#toPadStart(Math.floor((duration % 3600) / 60))
    const seconds = this.#toPadStart(Math.floor(duration % 60))

    return `${minutes}:${seconds}`
  }

  #toPadStart(time) {
    return time.toString().padStart(2,'0')
  }
}

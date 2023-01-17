import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="message"
export default class extends Controller {
  static targets = [ "movesCounter", "timeCounter" ]
  static values = {
    duration: {type: Number, default: 0}
  }

  connect() {
    this.interval = null
  }

  updateMovesCounter(count) {
    if(this.hasMovesCounterTarget) {
      this.movesCounterTarget.textContent = `${count} moves`
    }
  }

  startTimerCounter() {
    this.interval = setInterval(() => {
      this.durationValue++
    }, 1000)
  }

  stopTimerCounter() {
    // return this.calculateElapsedTime(this.durationValue)
    clearInterval(this.interval)
  }

  calculateElapsedTime(duration) {
    // const hours = this.toPadStart(Math.floor(duration / 3600))
    const minutes = this.toPadStart(Math.floor((duration % 3600) / 60))
    const seconds = this.toPadStart(Math.floor(duration % 60))

    return `${minutes}:${seconds}`
  }

  durationValueChanged() {
    if(this.hasTimeCounterTarget) {
      this.timeCounterTarget.textContent =
        this.calculateElapsedTime(this.durationValue)
    }
  }

  toPadStart(time) {
    return time.toString().padStart(2,'0')
  }

}

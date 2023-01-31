import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="message"
export default class extends Controller {
  interval: number

  static targets = [ "movesCounter", "timeCounter" ]
  declare hasMovesCounterTarget: boolean
  declare hasTimeCounterTarget: boolean
  declare movesCounterTarget: HTMLDivElement
  declare timeCounterTarget: HTMLDivElement

  static values = {
    duration: {type: Number, default: 0}
  }
  declare durationValue: number

  connect() {
    this.interval = 0
  }

  updateMovesCounter(count: number) {
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
    clearInterval(this.interval)
  }

  calculateElapsedTime(duration: number) {
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

  toPadStart(time: number) {
    return time.toString().padStart(2,'0')
  }

}

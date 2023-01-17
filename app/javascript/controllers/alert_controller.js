import { Controller } from "@hotwired/stimulus"

BOARD_COMPLETED =  "Board Solved!!! Congratulations"

// Connects to data-controller="alert"
export default class extends Controller {
  static targets = ["success"]

  boardCompleted() {
    if(this.hasSuccessTarget) {
      this.successTarget.textContent = BOARD_COMPLETED
    }
  }
}

import { Controller } from "@hotwired/stimulus"

const BOARD_COMPLETED: Readonly<string> = "Board Solved!!! Congratulations"

// Connects to data-controller="alert"
export default class extends Controller {
  static targets = ["success"]

  declare successTarget: HTMLElement;
  declare hasSuccessTarget: boolean;

  boardCompleted() {
    if(this.hasSuccessTarget) {
      this.successTarget.textContent = BOARD_COMPLETED
    }
  }
}

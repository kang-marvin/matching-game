import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="settings"
export default class extends Controller {

  static targets = [ 'boardLevel' ]
  static values =  { defaultBoardLevel: String }

  initialize() {
    this.currentURL = window.location
    this.#setDefaultLevelParams()
  }

  setBoardLevel() {
    const level = this.boardLevelTarget.value
    let params = this.searchParams
    params.set('level', level)

    this.#setURLWithRefresh(params)
  }

  refresh() {
    this.#setURLWithRefresh(this.searchParams)
  }

  #setURLWithoutRefresh(params) {
    window.history.replaceState(null, null, `?${params.toString()}`)
  }

  #setURLWithRefresh(params) {
    window.location.replace(`${this.currentURL.origin}?${params.toString()}`)
  }

  #setDefaultLevelParams() {
    let params = this.searchParams
    if (params.get('level') == null){
      params.set('level', this.defaultBoardLevelValue)
      this.#setURLWithoutRefresh(params)
    }
  }

  get searchParams() {
    return new URLSearchParams(this.currentURL.search)
  }
}

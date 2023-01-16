import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="settings"
export default class extends Controller {

  static targets = [ 'difficultyLevel' ]
  static values =  { defaultLevel: String }

  initialize() {
    this.currentURL = window.location
    this.setDefaultLevelParams()
  }

  setDifficultyLevel() {
    const level = this.difficultyLevelTarget.value
    let params = this.searchParams
    params.set('level', level)

    this.setURLWithRefresh(params)
  }

  setDefaultLevelParams() {
    let params = this.searchParams
    if (params.get('level') == null){
      params.set('level', this.defaultLevelValue)
      this.setURLWithoutRefresh(params)
    }
  }

  setURLWithoutRefresh(params) {
    window.history.replaceState(null, null, `?${params.toString()}`)
  }

  setURLWithRefresh(params) {
    window.location.replace(`${this.currentURL.origin}?${params.toString()}`)
  }

  get searchParams() {
    return new URLSearchParams(this.currentURL.search)
  }
}

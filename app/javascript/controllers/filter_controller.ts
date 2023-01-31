import { Controller } from "@hotwired/stimulus"

interface BoardInterface {
  [key: string]: string
}
// Connects to data-controller="settings"
export default class extends Controller {
  currentURL: Location

  static targets = [ 'boardLevel' ]
  declare boardLevelTarget: BoardInterface

  static values =  { defaultBoardLevel: String }
  declare defaultBoardLevelValue: string

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

  #setURLWithoutRefresh(params: URLSearchParams) {
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  #setURLWithRefresh(params: URLSearchParams) {
    window.location.replace(`${this.currentURL.origin}?${params.toString()}`)
  }

  #setDefaultLevelParams() {
    let params = this.searchParams
    if (params.get('level') == null){
      params.set('level', this.defaultBoardLevelValue)
      this.#setURLWithoutRefresh(params)
    }
  }

  get searchParams(): URLSearchParams {
    return new URLSearchParams(this.currentURL.search)
  }
}

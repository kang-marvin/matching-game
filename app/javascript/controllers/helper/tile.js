import { DefaultIcon } from "../data/icons"

const DEFAULT_COLOR = 'bg-black'

export const resetTileContent = (tile) => {
  tile.dataset.isOpen = 'false'
  tile.style.backgroundColor = null
  tile.src = DefaultIcon
  tile.alt = 'No Image'
  tile.classList.add(DEFAULT_COLOR)
}

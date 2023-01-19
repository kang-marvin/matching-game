import { DefaultIcon, Icons } from "../data/icons"

const DEFAULT_COLOR = 'bg-black'

export const showTileContent = (tile, data) => {
  tile.dataset.isOpen = 'true'
  tile.src = Icons[data.label.toLowerCase()] || DefaultIcon
  tile.style.backgroundColor = data.color
  tile.alt = data.label.toUpperCase()
  tile.classList.remove(DEFAULT_COLOR)
}

export const resetTileContent = (tile) => {
  tile.dataset.isOpen = 'false'
  tile.style.backgroundColor = null
  tile.src = DefaultIcon
  tile.alt = 'No Image'
  tile.classList.add(DEFAULT_COLOR)
}

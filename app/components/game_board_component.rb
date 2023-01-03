# frozen_string_literal: true

class GameBoardComponent < ViewComponent::Base

  SUPPORTED_BOARD_SIZE = [ 3, 4, 5].freeze

  def initialize(size: SUPPORTED_BOARD_SIZE[0])
    @size = size
    @board_size = (size * size)
  end

  def render?
    SUPPORTED_BOARD_SIZE.include?(@size)
  end
end

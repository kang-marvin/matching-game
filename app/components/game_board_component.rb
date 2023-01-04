# frozen_string_literal: true

class GameBoardComponent < ViewComponent::Base

  SUPPORTED_BOARD_SIZE = [ 2, 4 ].freeze

  def initialize(size: SUPPORTED_BOARD_SIZE[0])
    @size = size
    @board_size = (size * size)
    @decoded_object = { "yellow--rock": [ 2, 13 ] }.to_json
  end

  def render?
    SUPPORTED_BOARD_SIZE.include?(@size)
  end
end

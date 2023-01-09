# frozen_string_literal: true

class GameBoardComponent < ViewComponent::Base

  SUPPORTED_BOARD_SIZE = [ 2, 4, 6 ].freeze
  JOINER = "--"

  def initialize(size: SUPPORTED_BOARD_SIZE[0], board: [])
    @size = size
    @board_size = (size * size)
    @board_object = hashfied_board(board).to_json
  end

  def render?
    SUPPORTED_BOARD_SIZE.include?(@size)
  end

  private

  def hashfied_board(board)
    result = {}
    board
      .group_by.with_index { |_, index| index }
      .transform_values { |value| value.join(JOINER)}
      .each do |key, value|
        result[value] ||= []
        result[value] << key
        result[value].uniq!
      end

    result
  end
end

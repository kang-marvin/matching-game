class DashboardController < ApplicationController

  COLORS = ['red', 'green', 'blue', 'pink', 'orange', 'brown']
  LETTERS = ['Dog', 'Cats', 'Monkey', 'Ostrich', 'Pig', 'Fish']

  def index
    @game_board_size = 4
    @game_board = board_generator(@game_board_size)
  end

  private

  def board_generator(board_size)
    color_options = COLORS.shuffle.take(board_size)
    letter_options = LETTERS.shuffle.take(board_size)
    options = color_options.product(letter_options)

    uniq_options =
      options.rotate(rand(10)).each_slice(options.count / 2).to_a.sample

    (uniq_options * 2).shuffle
  end

end

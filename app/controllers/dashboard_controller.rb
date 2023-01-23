class DashboardController < ApplicationController

  COLORS = ['red', 'purple', 'lime', 'blue', 'gold', 'orange', 'aqua', 'blue', 'pink' ]
  LETTERS = [ "Ant", "Bird", "Cat", "Dog", "Frog", "Horse", "Monkey", "Sea-horse", "Spider" ]

  LEVELS = I18n.t('game.data.levels')

  def index
    @game_levels = LEVELS
    @game_board_size = LEVELS[dashboard_params[:level]&.to_sym] || 4
    @game_board = board_generator(@game_board_size)
  end

  private

  def board_generator(board_size)
    color_options = COLORS.shuffle.take(board_size / 2)
    letter_options = LETTERS.shuffle.take(board_size)
    options = color_options.product(letter_options)

    (options * 2).shuffle
  end

  def dashboard_params
    params.permit(:level, :locale)
  end

end

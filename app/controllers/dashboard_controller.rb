class DashboardController < ApplicationController

  LEVELS = I18n.t('game.data.levels')

  def index
    @game_levels = LEVELS
    @game_board_size = LEVELS[dashboard_params[:level]&.to_sym] || 4
    @game_board = BoardGenerator.call(@game_board_size)
  end

  private

  def dashboard_params
    params.permit(:level, :locale)
  end

end

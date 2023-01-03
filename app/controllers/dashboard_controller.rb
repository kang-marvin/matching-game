class DashboardController < ApplicationController

  def index
    @game_board_size = 3

    @game_board = Array.new(@game_board_size) do
      Array.new(@game_board_size) { rand(5) }
    end
  end

end

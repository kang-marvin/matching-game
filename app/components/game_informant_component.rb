# frozen_string_literal: true

class GameInformantComponent < ViewComponent::Base
  GAME_DIFFICULTY_LEVELS = [ 'Easy', 'Standard', 'Hard' ]

  def initialize()
    @game_levels = GAME_DIFFICULTY_LEVELS
    @default_game_level = 'Hard'
  end
end

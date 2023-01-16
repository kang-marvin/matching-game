# frozen_string_literal: true

class GameInformantComponent < ViewComponent::Base
  DEFAULT_LEVEL = 'standard'

  def initialize(levels: [], selected_level: DEFAULT_LEVEL)
    @available_levels = levels
    @default_level = DEFAULT_LEVEL
    @selected_level = selected_level || DEFAULT_LEVEL
  end
end

# frozen_string_literal: true

class UI::HeaderComponent < ViewComponent::Base

  def initialize
    @name = I18n.t('game.board.name')
  end

end

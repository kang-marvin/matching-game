# frozen_string_literal: true

class UI::HeaderComponent < ViewComponent::Base

  def initialize(name: nil, size: '')
    @name = name || I18n.t('game.board.name')
  end

end

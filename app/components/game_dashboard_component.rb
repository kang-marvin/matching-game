# frozen_string_literal: true

class GameDashboardComponent < ViewComponent::Base

  DEFAULT_IMAGE_SRC = "https://img.freepik.com/free-vector/white-abstract-background_23-2148808256.jpg?w=2000".freeze

  def initialize(background_image_src: nil)
    @background_image_src = background_image_src || DEFAULT_IMAGE_SRC
  end

end

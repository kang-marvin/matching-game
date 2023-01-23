require "application_system_test_case"

class DashboardTest < ApplicationSystemTestCase

  setup do
    visit root_path
  end

  test "shows game header" do
    assert_selector "h3", text: I18n.t('game.board.name')
  end

  test "shows how to play summary header" do
    assert_text I18n.t('information.tutorial.topic').titlecase
  end

end
require 'test_helper'

class BoardGeneratorTest < ActiveSupport::TestCase
  test "has double the provided size for supported levels" do
    board = BoardGenerator.call(4)
    assert_equal(16, board.count)
  end

  test "has half its double size as uniq products for supported levels" do
    board = BoardGenerator.call(4)
    assert_equal(8, board.uniq.count)
  end

  test "is empty for unsupported levels" do
    board = BoardGenerator.call(1)
    assert_empty(board)
  end
end

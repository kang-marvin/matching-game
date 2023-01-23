class BoardGenerator
  COLORS = [
    'red', 'purple', 'lime', 'blue', 'gold',
    'orange', 'aqua', 'blue', 'pink'
  ]

  LETTERS = [
    "Ant", "Bird", "Cat", "Dog", "Frog", "Horse",
    "Monkey", "Sea-horse", "Spider"
  ]

  def self.call(size)
    return [] unless size.even?

    color_options = COLORS.shuffle.take(size / 2)
    letter_options = LETTERS.shuffle.take(size)
    options = color_options.product(letter_options)

    (options * 2).shuffle
  end

end
# How I built a matching game using rails stimulus js

## **What is Stimulus JS**

From the official [stimulus](https://stimulus.hotwired.dev), Stimulus is defined as
> Stimulus is a JavaScript framework with modest ambitions. It doesn’t seek to take over your entire front-end—in fact, it’s not concerned with rendering HTML at all. Instead, it’s designed to augment your HTML with just enough behavior to make it shine.

It works by attaching javascript objects called controllers to your HTML elements via `data-controller` attributes and having Stimulus continuously monitoring the page

## **Demo of the finished game**
The finished game is deployed to fly.io, the link is [here](https://matching-animal-color-game.fly.dev).
You can get the link to the codebase on the same page.

## **Generating a new rails app**
Create a new app that will use tailwind for styling and esbuild to build our javascript.
 ```
<!-- Terminal -->

    rails new matching-game --css=tailwind --javascript=esbuild
 ```
Create **DashboardController** with `index` method
```
<!-- Terminal -->

    rails g controller index
```
Edit the `/views/dashboard/index.html.erb` file
```
<!-- views/dashboard/index.html.erb -->

    <p>This is a test</p>
```

Update the root path to point to Dashboard#index
```
<!-- routes.rb -->

    root "dashboard#index"
```

## Game Board UI
The board we are building will be a square. It can either be a `2 by 2`, `4 by 4` or `6 by 6`. Note, we will build it so it can support `8 by 8` and so on.

First thing we need to do it create a `board_size` variable on dashboard#index
```
<!-- Dashboard controller -->

    ...
    def index
        @board_size = 2
    end
```

In the `dashboard/index.html.erb`, we need to create tiles. The number of tiles is the `board_size ^ 2`
This will create divs whose text content is the index value.
```
<!-- dashboard/index.html.erb -->

    <#-- Create the board -->
    <div class="">
        <% (@board_size * @board_size).times do |index| %>
          <#-- Create tile -->
          <div class="">
            <%= index %>
          </div>
        <% end %>
      </div>
    </div>
```

The problem is that we have the correct number of tiles for our board but the structure is all wrong. We need a `board_size by board_size` structure but currently it is `1 by (board_size^2)`. We can solve this issue using tailwind grid.

The official tailwind site can be found here [here](https://tailwindcss.com)

```
<!-- dashboard/index.html.erb -->

    <%
        boardClassName ="
          bg-gradient-to-r from-violet-500 to-indigo-500 p-8
          rounded aspect-square justify-center items-center
          grid gap-6 grid-cols-#{@board_size} grid-rows-#{@board_size}
        "
        tileClassName = "
          shadow-sm hover:shadow-2xl rounded bg-white
          justify-self-center w-24 max-w-36 aspect-square
        "
    %>

    ...
    <#-- Create the board -->
      <div class="<%= boardClassName %>">
      ...
        <#-- Create tile -->
        <div class="<%= tileClassName %>">
      ...
  </div>
```

Before we test this on the browser, we need to keep a few things in mind
>
 - We are setting the background color of each tile to White using `bg-white` on tileClassName
 - The board is using a grid display
 - The board grid rows and columns count are being set dynamically using `grid-cols-X` and `grid-rows-X`

Now, let us test this on the browser. You will notice the UI looks much better and sometimes, the board has same `X by y` tiles while other times it reverts back to `1 by tilesCount` UI. If you inspect the css, you will notice that sometimes `grid-rows-X` and `grid-cols-X` are added while others it is not.

This is because tailwind does not work well with setting class names dynamically. We need to inform tailwind to preload these classes before we use them. To do this, we add `safelist` to tailwind.config.js

```
<!-- tailwind.config.js  -->

    module.exports = {
        ...
          safelist: [
            'grid-cols-2', 'grid-rows-2',
            'grid-cols-4', 'grid-rows-4',
            'grid-cols-6', 'grid-rows-6',
          ],
    }

```
Remember to add any other `board_sizes` you intended to support in the `safelist` above.
Last thing to do before we test to is style the body so our board does not fill the whole page

```
<!-- views/layouts/application.html.erb -->

    ...
    <body>
      <main class="
        flex flex-col items-center justify-center
        bg-fixed h-screen w-full"
      >
        <%= yield %>
      </main>
    </body>
```
Now if we test, all is well. Awesome

## Game Board Controller
Now we have to create a stimulus controller, finally.
```
<!-- Terminal -->

    rails g stimulus board
```
Let us connect this controller to our UI and test.
```
<!-- dashboard/index.html.rb -->

    ...
    <#-- Create the board -->
      <div
        class="<%= boardClassName %>"
        data-controller="board"
      >
      ...
```
```
<!-- board_controller.js -->

    ...
    connect() {
        console.log("Board controller connected")
    }
```
When you reload the UI and inspect the console, the text `Board controller connected` should be present. The `connect` function is called when the page with `data-controller` is loaded. Think of it as `componentDidMount` from react.

Let us replace the background color of tiles from white `bg-white` to black `bg-black` and also remove the index inside the tile divs. dashboard/index.html.erb

Now, let us a `click` action to our tile divs, so that when clicked, the tile changes background color to `red` and text content is it's `index value` for 1second and then it reverts bad to `black`

```
<!-- dashboard/index.html.erb -->

    ...
    <#-- Create tile -->
    <div
        class="<%= tileClassName %>"
        data-action="click->board#flip"
        data-tile-index="<%= index %>"
    >
    ...

```

```
<!-- board controller -->
    ...

    flip(event) {
        const tile = event.target
        const tileIndex = Number(tile.dataset.tileIndex)

        this.#showContent(tile, tileIndex)
        setTimeout(() => {
            this.#hideContent(tile)
        }, 1000)
    }

    #showContent(tile, tileIndex) {
        tile.textContent = tileIndex
        tile.style.backgroundColor = 'red'
        tile.classList.remove('bg-black')
    }

    #hideContent(tile) {
        tile.textContent = null
        tile.style.backgroundColor = null
        tile.classList.add('bg-black')
    }
```

What is happening is when a tile is click, the `flip` method is called and we extract both tile and tileIndex. then we call private method `showContent` which sets text content, background color and remove `bg-black` tailwind class from the tile. Then after 1 second, we call `hideContent` to revert the changes on the showContent method

> for tileIndex, we are getting this data from UI which was set as `data-{attribute-name}`.
So if for example, we set another attribute like `data-tile-is-open="false"`, we would be this value as
`const tileIsOpen = String(tile.dataset.tileIsOpen) `

## Board Functionality Store
To build our matching game, we will need these features
 - Do nothing if an already opened tile is clicked again
 - Compare if the 2 successively clicked tiles have the same background color and text content
 - Do nothing is the 2 successively clicked tiles have the same background color and text content
 - Reset the 2 successively clicked tiles if their text content and background color is not the same

This is clearly alot and we don't want to have all of these functionality in one controller ie `board_controller`. So we will create another controller called `store_controller` and have it as an Outlet.

In stimulus, [Outlets](https://stimulus.hotwired.dev/reference/outlets) are explained as
> Outlets let you reference Stimulus controller instances and their controller element from within another Stimulus Controller by using CSS selectors.
The use of Outlets helps with cross-controller communication and coordination as an alternative to dispatching custom events on controller elements.

Before we create that controller, let us solve the double clicking on the same tile. To do this, we can add a `data-tile-is-open="false"` for tile and we do nothing is the value is _"true"_. Remember to set it as "true" on `showContent` and as _"false"_ on `hideContent`

```
<!-- dashboard/index.html.erb -->

    ...
    <#-- Create tile -->
    <div
        class="<%= tileClassName %>"
        data-action="click->board#flip"
        data-tile-index="<%= index %>"
        data-tile-is-open="false"
    >
    ...
```

```
<!-- board controller -->

    ...
    flip(event) {
        const tile = event.target
        const tileIndex = Number(tile.dataset.tileIndex)
        const tileIsOpen = String(tile.dataset.tileIsOpen)

        if (tileIsOpen === "false") {
            ...
        }
    }
    ...
    #showContent(tile, tileIndex) {
        ...
        tile.dataset.tileIsOpen = "true"
    }
    ...
    #hideContent(tile) {
        ...
        tile.dataset.tileIsOpen = "false"
    }
```
 To test this, you can comment out the SetTimeout code.
 You will notice clicking a tile that is already open has no effect that all. Sweet.

 Now to create `store_controller` and add it as outlet to the board controller.
 ```
 <!-- Terminal -->

    rails g stimulus store
 ```

 ```
 <!-- dashboard/index.html.erb -->

    ...

    <div id="store--elements" data-controller="store"></div>

    <div
      class="<%= boardClassName %>"
      data-board-store-outlet="div#store--elements"
      ...

 ```
 You can either use the `id` or `class` to pass the element whose controller you want as outlet.
 ```
 <!-- board controller -->

    export default class extends Controller {
        static outlets = [ "store" ]

        ...
        flip(event) {
            // this is for testing if we can call public functions defined on store controller
            this.storeOutlet.test()
            ...
        }
    ...
 ```
 ```
 <!-- store controller -->

    ...
    // This is for testing. Remove when done
    test() {
        console.log("A tile has been clicked")
    }
    ...
 ```

 When you test, you will notice the text "A tile has been clicked" and it increases with each click. Now, let us use store controller to store array of successive tiles clicked. These are what we want
  - Clicking a tile more than once only pushes the tile to the array once
  - We only reset tiles when the array has exactly 2 tiles inside it
  - We only reset the tiles inside the array.

```
<!-- store controller -->

    ...
    connect(){
        this.successiveTilesCollection = []
    }

    addToSuccessiveTilesCollection(tile){
        this.successiveTilesCollection.push(tile)
    }

    resetSuccessiveTilesCollection() {
        this.successiveTilesCollection = []
    }

    get successiveTilesCollectionCount() {
        return this.successiveTilesCollection.length
    }
```

```
<!-- board controller -->

    ...
    this.#showContent(tile, tileIndex)
    this.storeOutlet.addToSuccessiveTilesCollection(tile)

    ...
    if (this.storeOutlet.successiveTilesCollectionCount === 2) {
        setTimeout(() => {
            this.storeOutlet.successiveTilesCollection.forEach(tile => {
                this.#hideContent(tile)
            })
            this.storeOutlet.resetSuccessiveTilesCollection()
            ...
        ...
    }

```

so far so good.

Let us pause JS & UI and focus on the board backend functionality. Right now, a tile text content and background color are not dynamic. Let us build this.

## Board Tiles Content
To be able to have matching contents in a board of 4 by 4, we need to have 8 uniq items. and 18 for a 6 by 6 and so on and so forth.

First, let us create 2 collections on dashboard controller

```
<!-- dashboard controller -->

    class DashboardController < ApplicationController

        ANIMALS = ['dog', 'cat', 'pig', 'owl', 'ant']
        COLORS = ['red', 'green', 'yellow', 'lime', 'pink']

        def index
            @board_size = 4
            @board_finished_result = generate_board_result(@board_size) // will build this soon
         end
        ...
```
Before we build the `generate_board_result`, let me explain.

We want to express a tile contents as `[color, label]` meaning that our board will be an array of arrays. To do this we will employ the `array#product` function from ruby. [documentation](https://apidock.com/ruby/v2_5_5/Array/product)

Let us do a few example
```
<!-- irb -->
> [1,2].product([3,4])
(result) [ [1,3], [1,4], [2,3], [2,4] ]
> ['cat', 'dog'].product(['pink'])
(result) [ ['cat', 'pink'], ['dog', pink] ]
```

So based on this and the knowledge we have that for 4 by 4 board, we need 8 uniq tile contents, then we can do this
```
<!-- dashboard controller -->

    ...

    private

    def generate_board_result(size)
        board = create_board(size)
    end

    def create_board(size)
        return [] unless size.even?

        color_options = COLORS.shuffle.take(size / 2)
        letter_options = ANIMALS.shuffle.take(size)
        options = color_options.product(letter_options)

        (options * 2).shuffle
    end

    ...
```
So we have the board tile values generated and randomized in the array. Next is to hash the board so that key is the joining of `color` and `label/animal` and the hash value will be array of indexes that have the same content

Example of the result should be something like this
```
{ 'red--dog': [0,2], 'green--monkey': [1,3] }

(explanation)
This means for this board ie 2by2, tiles that have red color and dog as label are on indexes 0 and 2.
```

```
<!-- dashboard controller -->

    ...
    def generate_board_result(size)
        board = create_board(size)
        hashify_board(board).to_json
    end

    ...
    def hashify_board(board)
        result = {}
        board
          .group_by.with_index { |_, index| index }
          .transform_values { |value| value.join("--")}
          .each do |key, value|
            result[value] ||= []
            result[value] << key
            result[value].uniq!
          end

        result
    end
```

Now that we have our hash, we need to pass it to board controller.
The way to do this is using [Stimulus Values](https://stimulus.hotwired.dev/reference/values)

```
<!-- dashboard/index.html.erb -->

    ...
    <div
      class="<%= boardClassName %>"
      data-board-store-outlet="div#store--elements"
      data-controller="board"
      data-board-finished-result-value="<%= @board_finished_result %>"
    >
    ...
```

```
<!-- board controller -->
    ...
    static outlets = [ "store" ]
    static values = {
        finishedResult:{type: Object, default:{}}
    }
    ...
    connect() {
       // For testing. remove when done
       console.table(this.finishedResultValue)
    }
    ...
```
When testing, you should be able to see the hash result on your console. Before we move on, let us ensure clicking a tile has the correct color and label based on the `finishedResult` hash.

```
<!-- board controller -->

    ...
    this.storeOutlet.addToSuccessiveTilesCollection(tile)
    const currentTileContent =
        this.#extractTileContentsFromFinishedResult(
            tileIndex,
            this.finishedResultValue
        )
    this.#showContent(tile, currentTileContent)
    ...

    showContent = (tile, data) => {
        tile.dataset.tileIsOpen = "true"
        tile.textContent = data.label
        tile.style.backgroundColor = data.color
        tile.classList.remove('bg-black')
    }

    ...

    #extractTileContentsFromFinishedResult = (tileIndex, finishedResultValue) => {
        const tileKeyInBoard =
            Object
                .keys(finishedResultValue)
                .filter(key => {
                    return finishedResultValue[key].includes(tileIndex)
                })

        if (tileKeyInBoard.length < 1) {
            return {color: null, label: null, indexes: [] }
        }

        const result = tileKeyInBoard[0].split("--")
        return {
            color: result[0],
            label: result[1],
            indexes: finishedResultValue[tileKeyInBoard[0]]
        }
    }

```
And with that, each tile now shows the correct label and background color from the board result that was generated on the `DashboardController`

Now we have to handle not resetting the successive tiles collection if the last clicked tile has the same contents as the current tile.

```
<!-- store controller -->
    ...
    connect () {
        ...
        /*
        * matchingIndex is the index of the tile with same contents
        */
        this.lastClickedTile = { matchingIndex: null}
    }

    ...
    updatePreviouslyClickedTile(currentTileIndex, indexes) {
        this.lastClickedTile = {
            matchingIndex: (indexes.filter(i => i != currentTileIndex)[0])
        }
    }

    resetPreviousTile() {
        this.lastClickedTile = { matchingIndex: null}
    }

    get tile() {
        return this.lastClickedTile
    }
```

```
<!-- board controller -->

    ...
    flip(event) {
        const tile = event.target
        const tileIndex = Number(tile.dataset.tileIndex)
        const tileIsOpen = String(tile.dataset.tileIsOpen)

        if (tileIsOpen === "false") {
            const currentTileContent =
                this.#extractTileContentsFromFinishedResult(
                    tileIndex,
                    this.finishedResultValue
                )
            this.#showContent(tile, currentTileContent)
            this.storeOutlet.addToSuccessiveTilesCollection(tile)

            if (this.storeOutlet.successiveTilesCollectionCount === 2) {
                setTimeout(() => {
                    if (this.storeOutlet.tile.matchingIndex !== tileIndex) {
                        this.storeOutlet.successiveTilesCollection.forEach(tile => {
                            this.#hideContent(tile)
                        });
                    }
                    this.storeOutlet.resetSuccessiveTilesCollection()
                    this.storeOutlet.resetPreviousTile()
                }, 1000)
            } else {
                this.storeOutlet.updatePreviouslyClickedTile(
                    tileIndex,
                    currentTileContent['indexes']
                )
            }
        }
    }
```

And with that, we have finished our game.

## Features to do next
 - Add time counter
 - Add moves counter
 - Select tag for changing difficulty levels
 - Add congratulation message when all tiles are solved.
 - Replace label with an image of the animal on a tile
 - Code cleanup and refactoring

## Thank you :)

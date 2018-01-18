//This project implements Conway's Game of Life
(function () {

    var gameOfLife = self.Life = function (seed) {
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;

        this.prevBoard = [];
        this.board = cloneArray(seed);

    };

    gameOfLife.prototype = {
        next: function () {
            this.prevBoard = cloneArray(this.board);

            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var neighbors = this.aliveNeighbors(this.prevBoard, x, y);
                    var alive = !!this.board[y][x]; //This converts an undefined to a zero

                    if (alive) { //If a cell is alive, it will die if it has less than 2 live neighbors due to underpopulation.  It will also die if more than 3 due to over population.
                        if (neighbors < 2 || neighbors > 3) {
                            this.board[y][x] = 0;
                        }
                    }
                    else { //Dead cells will come to life if they have exactly 3 live neighbors due to reproduction.
                        if (neighbors == 3) {
                            this.board[y][x] = 1;
                        }
                    }
                }
            }
        },
        aliveNeighbors: function (array, x, y) {
            var prevRow = array[y - 1] || [];
            var nextRow = array[y + 1] || [];

            return [
                prevRow[x - 1], prevRow[x], prevRow[x + 1],
                array[y][x - 1], array[y][x + 1],
                nextRow[x - 1], nextRow[x], nextRow[x + 1]
            ].reduce(function (prev, cur) {
                return prev + +!!cur;
            }, 0);
        },
        toString: function () {
            return this.board.map(function (row) { return row.join(' '); }).join('\n');
        }
    };

    //Helper function but only works for two dimension arrays
    function cloneArray(array) {
        return array.slice().map(function (row) { return row.slice(); });
    }

})();


(function () {
    var gameOfLife = self.LifeView = function (table, size) {
        this.grid = table;
        this.size = size;

        this.createGrid();

    };
    var count = 0;
    gameOfLife.prototype = {

        createGrid: function () {
            var me = this;

            var fragment = document.createDocumentFragment(); //Minimize DOM interactions whenever possible.
            this.grid.innerHTML = '';
            this.checkboxes = [];




            for (var y = 0; y < this.size; y++) {
                var row = document.createElement('tr');
                this.checkboxes[y] = [];

                for (var x = 0; x < this.size; x++) {
                    var cell = document.createElement('td');
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    this.checkboxes[y][x] = checkbox;
                    checkbox.coords = [y, x];

                    cell.appendChild(checkbox);
                    row.appendChild(cell);

                }
                fragment.appendChild(row);
            }
            this.grid.addEventListener('change', function (evt) {
                if (evt.target.nodeName.toLowerCase() == 'input') {
                    me.started = false;
                }
            });

            this.grid.addEventListener('keyup', function (evt) {
                var checkbox = evt.target;

                if (checkbox.nodeName.toLowerCase() == 'input') {
                    var coords = checkbox.coords;
                    var y = coords[0];
                    var x = coords[1];

                    switch (evt.keyCode) {
                        case 37:  //left arrow key
                            if (x > 0) {
                                me.checkboxes[y][x - 1].focus();
                            }
                            break;
                        case 38: //up arrow key
                            if (y > 0) {
                                me.checkboxes[y - 1][x].focus();
                            }
                            break;
                        case 39: //right arrow key
                            if (x < me.size - 1) {
                                me.checkboxes[y][x + 1].focus();
                            }
                            break;
                        case 40: //down arrow key
                            if (y < me.size - 1) {
                                me.checkboxes[y + 1][x].focus();
                            }
                            break;

                    }
                }
            });
            this.grid.appendChild(fragment);
        },
        get boardArray() {
            return this.checkboxes.map(function (row) {
                return row.map(function (checkbox) {
                    return +checkbox.checked;
                })
            })
        },
        play: function () {
            this.game = new Life(this.boardArray);
            this.started = true;
        },
        next: function () {
            var me = this;

            //console.log(++count);
            document.getElementById('Counter').textContent = ++count;

            if (!this.started || this.game) {
                this.play();
            }
            this.game.next();
            var board = this.game.board;

            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    this.checkboxes[y][x].checked = !!board[y][x];
                }
            }
            if (document.getElementById('autoplay').checked) {
                setTimeout(function () {
                    me.next();
                }, 1000)
            }


        }
    };
})();
var lifeView = new LifeView(document.getElementById('grid'), 12);


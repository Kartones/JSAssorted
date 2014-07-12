
function ThePlagueGame() {
    var self = this,
        gameEngine;

    this.Init = function (boardContainer, turnContainer, easyButtonContainer, mediumButtonContainer,
                          hardButtonContainer, statusContainer) {
        Math.seedrandom();
        gameEngine = new GameEngine();
        gameEngine.Init(boardContainer, turnContainer, easyButtonContainer, mediumButtonContainer,
                        hardButtonContainer, statusContainer);
    };
};

function DOMRenderer() {
    var $boardContainer,
        $turnContainer,
        $statusContainer,
        gameEngine,
        self = this,
        tileSymbols = ['α', 'β', 'γ', 'δ', 'ε', 'ζ'];

    this.SetupButtons = function (easyButtonContainer, mediumButtonContainer, hardButtonContainer) {
        $("#" + easyButtonContainer).on("click", function() {
            gameEngine.StartPlaying(gameEngine.DIFFICULTY_LEVELS.EASY);
        });
        $("#" + mediumButtonContainer).on("click", function() {
            gameEngine.StartPlaying(gameEngine.DIFFICULTY_LEVELS.MEDIUM);
        });
        $("#" + hardButtonContainer).on("click", function() {
            gameEngine.StartPlaying(gameEngine.DIFFICULTY_LEVELS.HARD);
        });
    };

    this.Init = function (runningGameEngine, boardContainer, turnContainer, easyButtonContainer, mediumButtonContainer,
                          hardButtonContainer, statusContainer) {
        $boardContainer = $("#" + boardContainer);
        $turnContainer = $("#" + turnContainer);
        $statusContainer = $("#" + statusContainer);
        gameEngine = runningGameEngine;

        self.SetupButtons(easyButtonContainer, mediumButtonContainer, hardButtonContainer);
    };

    this.SetupBoard = function (boardWidth, boardHeight) {
        var content = "<table class='board'>",
            x,
            y;

        for (y = 0; y < boardHeight; y++) {
            content += "<tr>";
            for (x = 0; x < boardWidth; x++) {
                content += "<td id='pos-" + x + "-" + y + "' class='js-tile' data-x='" + x + "' data-y='" + y + "'></td>";
            }
            content += "</tr>";
        }
        content += "</table>";

        $boardContainer.html(content);
        $boardContainer.on("click", ".js-tile", self.TileClick);
    };

    this.TileClick = function () {
        var tileData = $(this).data();
        gameEngine.PlayTurn(parseInt(tileData["x"], 10), parseInt(tileData["y"], 10));
    };

    this.DrawBoard = function (boardContents, ownedBoardContents) {
        var x,
            y,
            $cell,
            cellContent;
        for (y = 0; y < gameEngine.BOARD_HEIGHT; y++) {
            for (x = 0; x < gameEngine.BOARD_WIDTH; x++) {
                $cell = $boardContainer.find("#pos-" + x + "-" + y);
                cellContent = boardContents[y * gameEngine.BOARD_WIDTH + x];
                if (ownedBoardContents[y * gameEngine.BOARD_WIDTH + x] == true) {
                    $cell.removeClass('type' + cellContent);
                    $cell.addClass('owned');
                    $cell.html('☣');
                } else {
                    $cell.addClass('type' + cellContent);
                    $cell.html(tileSymbols[cellContent-1]);
                }
            }
        }
    };

    this.DrawTurn = function (currentTurn, maxTurns) {
        $turnContainer.html("Turn: " + currentTurn + "/" + maxTurns);
    };

    this.EmptyStatus = function() {
        $statusContainer.html("");
    };

    this.DrawWon = function(currentTurn) {
        $boardContainer.html('');
        $turnContainer.html('');
        $statusContainer.html("You won in " + currentTurn + " turns !!!");
    };

    this.DrawLost = function() {
        $boardContainer.html('');
        $turnContainer.html('');
        $statusContainer.html("You lost!!!");
    };
};

function GameEngine() {

    this.CELL_TYPES = 6;
    this.BOARD_WIDTH = 12;
    this.BOARD_HEIGHT = 15;
    this.DIFFICULTY_LEVELS = {
        EASY: 0,
        MEDIUM: 1,
        HARD: 2
    };
    this.MAXTURNS = 25;

    var self = this,
        gameBoard,
        ownedBoard,
        checkedBoard,
        renderer,
        currentDifficulty,
        currentTurn,
        playingGame = false;

    var DrawBoard = function () {
        renderer.DrawBoard(gameBoard, ownedBoard);
    };

    var DrawTurn = function () {
        renderer.DrawTurn(currentTurn, self.MAXTURNS);
    };

    var SetupInternalBoards = function () {
        ownedBoard = [];
        checkedBoard = [];
        for (var i = 0, size = self.BOARD_WIDTH * self.BOARD_HEIGHT; i < size; i++) {
            ownedBoard.push(false);
            checkedBoard.push(false);
        }
        ownedBoard[0] = true;
    };

    var HasAdjacentTiles = function (x, y) {
        var hasAdjacent = false;

        if (x > 0) {
            hasAdjacent = ownedBoard[y * self.BOARD_WIDTH + (x - 1)];
        }
        if (!hasAdjacent && x < self.BOARD_WIDTH - 1) {
            hasAdjacent = ownedBoard[y * self.BOARD_WIDTH + (x + 1)];
        }
        if (!hasAdjacent && y > 0) {
            hasAdjacent = ownedBoard[(y - 1) * self.BOARD_WIDTH + x];
        }
        if (!hasAdjacent && y < self.BOARD_HEIGHT - 1) {
            hasAdjacent = ownedBoard[(y + 1) * self.BOARD_WIDTH + x];
        }

        return hasAdjacent;
    };

    var CanMoveTo = function (x, y) {
        var canMove = false;

        if (!playingGame) {
            return false;
        }

        // First movement done by game start, so always allowed
        if (currentTurn === 0) {
            return true;
        }

        if (x >= 0 && y >= 0 && x < self.BOARD_WIDTH && y < self.BOARD_HEIGHT) {
            if (!ownedBoard[y * self.BOARD_WIDTH + x]) {
                return HasAdjacentTiles(x, y);
            }
        }
    };

    var ExpandTo = function (x, y) {
        if (!playingGame) {
            return;
        }

        if (currentTurn == 0) {
            ownedBoard[y * self.BOARD_WIDTH + x] = true;
        } else {
            FloodTo(x, y, gameBoard[y * self.BOARD_WIDTH + x]);
        }
    };

    var FloodTo = function (x, y, originType) {
        var canFlood = false;

        if (!checkedBoard[y * self.BOARD_WIDTH + x] && x >= 0 && y >= 0 && x < self.BOARD_WIDTH && y < self.BOARD_HEIGHT) {
            if (gameBoard[y * self.BOARD_WIDTH + x] === originType || ownedBoard[y * self.BOARD_WIDTH + x]) {
                canFlood = true;
            }
        }

        if (canFlood) {
            checkedBoard[y * self.BOARD_WIDTH + x] = true;
            if (!ownedBoard[y * self.BOARD_WIDTH + x]) {
                ownedBoard[y * self.BOARD_WIDTH + x] = true;
            }
            FloodTo(x-1, y, originType);
            FloodTo(x+1, y, originType);
            FloodTo(x, y-1, originType);
            FloodTo(x, y+1, originType);
        }
    };

    var AdvanceTurn = function () {
        var i,
            size,
            wonGame;

        if (!playingGame) {
            return;
        }

        if (currentTurn < self.MAXTURNS) {
            currentTurn++;
            wonGame = true;
            for (i = 0, size = self.BOARD_WIDTH * self.BOARD_HEIGHT; i < size; i++) {
                wonGame = wonGame && ownedBoard[i];
            }
            if (wonGame) {
                playingGame = false;
                renderer.DrawWon(currentTurn);
            } else {
                for (i = 0, size = self.BOARD_WIDTH * self.BOARD_HEIGHT; i < size; i++) {
                    checkedBoard[i] = false;
                }
            }
        } else {
            playingGame = false;
            renderer.DrawLost();
        }
    };

    this.Init = function (boardContainer, turnContainer, easyButtonContainer, mediumButtonContainer,
                          hardButtonContainer, statusContainer) {
        renderer = new DOMRenderer();
        renderer.Init(self, boardContainer, turnContainer, easyButtonContainer, mediumButtonContainer,
                      hardButtonContainer, statusContainer);
    };

    this.StartPlaying = function (difficulty) {
        var board = new Board(self);

        currentDifficulty = difficulty;
        currentTurn = 0;

        gameBoard = board.SeedNew(board.GetNewSeed(difficulty));

        SetupInternalBoards();
        renderer.SetupBoard(self.BOARD_WIDTH, self.BOARD_HEIGHT);
        renderer.EmptyStatus();

        playingGame = true;
        this.PlayTurn(0, 0);
    };

    this.PlayTurn = function (x, y) {
        if (!playingGame) {
            return;
        }

        if (CanMoveTo(x, y)) {
            ExpandTo(x,y);
            AdvanceTurn();
            if (playingGame) {
                DrawBoard();
                DrawTurn();
            }
        }
    };

};

function Board(runningGameEngine) {
    var self = this,
        gameEngine = runningGameEngine,
        gameBoard = [];

    this.GetNewSeed = function (difficulty) {
        var seedFragments = [],
            sameCellChance,
            cellType;

        cellType = Math.floor(Math.random() * gameEngine.CELL_TYPES) + 1;
        seedFragments.push(cellType);

        switch (difficulty) {
            case gameEngine.DIFFICULTY_LEVELS.EASY:
                sameCellChance = 40;
                break;
            case gameEngine.DIFFICULTY_LEVELS.MEDIUM:
                sameCellChance = 20;
                break;
            case gameEngine.DIFFICULTY_LEVELS.HARD:
                sameCellChance = 0;
                break;
        }

        for (var i = 1, size = gameEngine.BOARD_WIDTH * gameEngine.BOARD_HEIGHT; i < size; i++) {
            if ((Math.floor(Math.random() * 100) + 1) > sameCellChance) {
                cellType = Math.floor(Math.random() * gameEngine.CELL_TYPES) + 1;
            }
            seedFragments.push(cellType);
        }

        return seedFragments;
    };

    this.SeedNew = function (seed) {
        self.gameBoard = seed;
        return self.gameBoard;
    };
};
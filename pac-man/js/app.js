/**
 *
 * Based on https://www.youtube.com/watch?v=CeUGlSl2i4Q
 *
 * TODOs:
 * - remove hardcoded coordinates, make then relative to width
 * - Pacman at minimum should be in a class
 *
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 28;                   /// 28 * 28 = 784 squares
    const maxIndex = width * width;     // for position calculation
    const ghostScaredDuration = 10000;  // in millis

    // map:
    // 0: dots
    // 1: wall
    // 2: ghost-lair
    // 3: power-pellet
    // 4: empty
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
      ];
    const squares = [];

    // starting position (below ghosts lair)
    let pacmanIndex = 490;
    let score = 0;


    // functions:

    function createBoard() {
        for (cell of layout) {
            const square = document.createElement('div');
            grid.appendChild(square);

            switch(cell) {
                case 0:
                    square.classList.add('dot');
                    break;
                case 1:
                    square.classList.add('wall');
                    break;
                case 2:
                    square.classList.add('ghost-lair');
                    break;
                case 3:
                    square.classList.add('power-pellet');
                    break;
            }
            squares.push(square);
        }
    };

    function isWall(index) {
        return squares[index].classList.contains('wall');
    };

    function isGhostLair(index) {
        return squares[index].classList.contains('ghost-lair');
    };

    function movePacMan(event) {
        let newIndex = pacmanIndex;
        let directionClass = undefined;
        // cursors
        switch(event.keyCode) {
            case 37:
                // left (default image position so no direction class)
                if (newIndex - 1 === 363) {
                    newIndex = 391;
                } else {
                    newIndex -= (newIndex % width !== 0) ? 1 : 0;
                }
            break;
            case 38:
                directionClass = 'up';
                newIndex -= (newIndex - width >= 0) ? width : 0;
            break;
            case 39:
                directionClass = 'right';
                if (newIndex + 1 === 392) {
                    newIndex = 364;
                } else {
                    newIndex += (newIndex % width < width - 1) ? 1 : 0;
                }
            break;
            case 40:
                directionClass = 'down';
                newIndex += (newIndex + width < maxIndex) ? width : 0;
            break;
        }

        // can't move there
        if (isWall(newIndex) || isGhostLair(newIndex)) {
            newIndex = pacmanIndex;
        }

        // only refresh if moved
        if (newIndex !== pacmanIndex) {
            squares[pacmanIndex].classList.remove('pac-man', 'right', 'up', 'down');

            pacmanIndex = newIndex;
            squares[pacmanIndex].classList.add('pac-man');
            if (directionClass) {
                squares[pacmanIndex].classList.add(directionClass);
            }

            // only check if moved
            eatenDot();
            eatenPowerPellet();
            eatenScaredGhost();

            // this can happen if we move
            ghostCatchedPacman();
        }
    };

    function eatenDot() {
        if (squares[pacmanIndex].classList.contains('dot')) {
            score++;
            scoreDisplay.innerHTML = score;
            squares[pacmanIndex].classList.remove('dot');
        }
    }

    function eatenPowerPellet() {
        if (squares[pacmanIndex].classList.contains('power-pellet')) {
            score += 10;
            ghosts.forEach(ghost => {
                ghost.makeScared();
            });
            squares[pacmanIndex].classList.remove('power-pellet');
        }
    }

    function eatenScaredGhost() {
        if (squares[pacmanIndex].classList.contains('ghost') && squares[pacmanIndex].classList.contains('scared')) {
            let eatenGhost = ghosts.filter(ghost => ghost.index === pacmanIndex)[0];
            eatenGhost.respawn();
            score += 100;
        }
    }

    function ghostCatchedPacman() {
        if (squares[pacmanIndex].classList.contains('ghost') && !squares[pacmanIndex].classList.contains('scared')) {
            ghosts.forEach(ghost => ghost.stop());
            document.removeEventListener('keyup', movePacMan);
            squares[pacmanIndex].classList.remove('pac-man');

            scoreDisplay.innerHTML = `${score} .:. Game Over!`;
        }
    }

    function ghostAI(ghost) {
        ghost.timerId = setInterval(function() {
            if (squares[ghost.index].classList.contains('ghost-lair')) {
                moveGhostOutsideLair(ghost);
            } else {
                moveGhost(ghost);
            }
        }, ghost.speed);
    }

    function ghostCanMoveTo(position, ghost) {
        return (
            // not outside bounds
            squares[position] !== undefined
            // not through walls
            && !squares[position].classList.contains('wall')
            // not through other ghosts
            && !squares[position].classList.contains('ghost')
            // not attempting to re-enter the lair once outside of it
            && !(squares[position].classList.contains('ghost-lair') && !squares[ghost.index].classList.contains('ghost-lair'))
        );
    }

    function moveGhostOutsideLair(ghost) {
        // left, right, up
        const directions = [-1, 1, -width];

        let newIndex = ghost.index;

        // try north first
        if (ghostCanMoveTo(ghost.index - width, ghost)) {
            newIndex = -width;
        } else {
            // go random, but never down, so they move towards the exit
            newIndex = directions[Math.floor(Math.random() * directions.length)]
        }

        if (ghostCanMoveTo(ghost.index + newIndex, ghost)) {
            squares[ghost.index].classList.remove('ghost', 'scared', ghost.className);
            ghost.index += newIndex;
            squares[ghost.index].classList.add('ghost', ghost.className);
        }

        // should only happen if pacman was near lair entrance, but can happen
        ghostCatchedPacman();
    }

    function moveGhost(ghost) {
        // left, right, down, up
        const directions = [-1, 1, width, -width];

        let newIndex = directions[Math.floor(Math.random() * directions.length)];

        if (ghostCanMoveTo(ghost.index + newIndex, ghost)) {
            squares[ghost.index].classList.remove('ghost', 'scared', ghost.className);
            ghost.index += newIndex;
        } else {
            // try with another direction
            newIndex = directions[Math.floor(Math.random() * directions.length)];
        }

        if (ghost.isScared) {
            squares[ghost.index].classList.add('ghost', 'scared');
        } else {
            squares[ghost.index].classList.add('ghost', ghost.className);
        }

        // but also can happen when the ghost moves
        ghostCatchedPacman();
    }

    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.index = startIndex;
            this.timerId = NaN;
            this.isScared = false;
        }

        makeScared() {
            this.isScared = true;
            squares[this.index].classList.remove(this.className);
            squares[this.index].classList.add('scared');
            setTimeout(this.makeUnscared.bind(this), ghostScaredDuration);
        }

        makeUnscared() {
            this.isScared = false;
        }

        respawn() {
            squares[this.index].classList.remove('ghost', 'scared');

            this.index = this.startIndex;
            this.makeUnscared();
        }

        stop() {
            clearInterval(this.timerId);;
        }
    }

    // initial setup:

    createBoard();

    squares[pacmanIndex].classList.add('pac-man');

    document.addEventListener('keyup', movePacMan);

    const ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500),
    ];

    ghosts.forEach(ghost => {
        squares[ghost.index].classList.add('ghost', ghost.className);
        ghostAI(ghost);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    try {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next');
    const nextContext = nextCanvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const linesElement = document.getElementById('lines');
    const levelElement = document.getElementById('level');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 20;

    const COLORS = [
        null,
        '#FF0D72',
        '#0DC2FF',
        '#0DFF72',
        '#F538FF',
        '#FF8E0D',
        '#FFE138',
        '#3877FF'
    ];

    const SHAPES = [
        [],
        [[1, 1, 1, 1]],
        [[2, 2], [2, 2]],
        [[0, 3, 0], [3, 3, 3]],
        [[4, 4, 0], [0, 4, 4]],
        [[0, 5, 5], [5, 5, 0]],
        [[6, 0, 0], [6, 6, 6]],
        [[0, 0, 7], [7, 7, 7]]
    ];

    let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let score = 0;
    let lines = 0;
    let level = 1;
    let piece;
    let nextPiece;
    let gameStarted = false;
    let gamePaused = false;
    let gameInterval;

    function randomPiece() {
        const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
        const shape = SHAPES[typeId];
        return { shape, color: COLORS[typeId], x: 3, y: 0 };
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawPiece(piece, context);
        drawNext();
    }

    function drawBlock(x, y, color, context) {
        context.fillStyle = color;
        context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, 2);

        context.fillStyle = 'rgba(0, 0, 0, 0.2)';
        context.fillRect(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE - 2, BLOCK_SIZE, 2);
    }

    function drawBoard() {
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    drawBlock(x, y, COLORS[value], context);
                }
            });
        });
    }

    function drawPiece(p, ctx) {
        p.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    drawBlock(p.x + x, p.y + y, p.color, ctx);
                }
            });
        });
    }

    function drawNext() {
        nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
        const p = { ...nextPiece, x: 1, y: 1 };
        drawPiece(p, nextContext);
    }

    function move() {
        if (isValid(piece, 0, 1)) {
            piece.y++;
        } else {
            freeze();
            clearLines();
            piece = nextPiece;
            nextPiece = randomPiece();
            if (!isValid(piece, 0, 0)) {
                alert('Game Over');
                board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
                score = 0;
                lines = 0;
                level = 1;
            }
        }
        draw();
    }

    function isValid(p, dx, dy, newShape) {
        const shape = newShape || p.shape;
        const x = p.x + dx;
        const y = p.y + dy;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] > 0) {
                    const newX = x + col;
                    const newY = y + row;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] > 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function freeze() {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    board[piece.y + y][piece.x + x] = value;
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(value => value > 0)) {
                linesCleared++;
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                y++;
            }
        }
        if (linesCleared > 0) {
            lines += linesCleared;
            score += linesCleared * 100 * level;
            if (lines >= level * 10) {
                level++;
            }
            updateInfo();
        }
    }

    function updateInfo() {
        scoreElement.textContent = score;
        linesElement.textContent = lines;
        levelElement.textContent = level;
    }

    function rotate() {
        const shape = piece.shape;
        const newShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
        if (isValid(piece, 0, 0, newShape)) {
            piece.shape = newShape;
        }
    }

    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft') {
            if (isValid(piece, -1, 0)) piece.x--;
        } else if (e.code === 'ArrowRight') {
            if (isValid(piece, 1, 0)) piece.x++;
        } else if (e.code === 'ArrowDown') {
            move();
        } else if (e.code === 'ArrowUp') {
            rotate();
        } else if (e.code === 'Space') {
            hardDrop();
        }
        draw();
    });

    document.getElementById('left-btn').addEventListener('click', () => {
        if (isValid(piece, -1, 0)) piece.x--;
        draw();
    });

    document.getElementById('right-btn').addEventListener('click', () => {
        if (isValid(piece, 1, 0)) piece.x++;
        draw();
    });

    document.getElementById('down-btn').addEventListener('click', () => {
        move();
    });

    document.getElementById('rotate-btn').addEventListener('click', () => {
        rotate();
    });

    document.getElementById('drop-btn').addEventListener('click', () => {
        hardDrop();
    });

    function hardDrop() {
        while (isValid(piece, 0, 1)) {
            piece.y++;
        }
        move();
    }

    function gameLoop() {
        if (!gamePaused) {
            move();
        }
        gameInterval = setTimeout(gameLoop, 1000 / level);
    }

    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            gamePaused = false;
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            score = 0;
            lines = 0;
            level = 1;
            piece = randomPiece();
            nextPiece = randomPiece();
            updateInfo();
            gameLoop();
        }
    }

    function pauseGame() {
        gamePaused = true;
    }

    function resumeGame() {
        gamePaused = false;
    }

    function stopGame() {
        clearTimeout(gameInterval);
        gameStarted = false;
        gamePaused = false;
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        score = 0;
        lines = 0;
        level = 1;
        updateInfo();
        context.clearRect(0, 0, canvas.width, canvas.height);
        nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    }

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
    document.getElementById('stop-btn').addEventListener('click', stopGame);

    // Initial setup, wait for start button
    updateInfo();
    context.clearRect(0, 0, canvas.width, canvas.height);
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    } catch (error) {
        alert("An error occurred: " + error.message + "\n\n" + error.stack);
    }
});
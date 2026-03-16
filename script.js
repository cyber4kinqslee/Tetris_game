document.addEventListener('DOMContentLoaded', () => {
    try {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next');
    const nextContext = nextCanvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const linesElement = document.getElementById('lines');
    const levelElement = document.getElementById('level');

    // Sound Manager using Web Audio API
    class SoundManager {
        constructor() {
            this.audioContext = null;
            this.muted = false;
            this.musicEnabled = false;
            this.musicOscillators = [];
            this.musicGain = null;
            this.musicInterval = null;
        }

        init() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }

        playTone(frequency, duration, type = 'square', volume = 0.1) {
            if (this.muted || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        }

        playMove() {
            this.playTone(200, 0.05, 'square', 0.05);
        }

        playRotate() {
            this.playTone(400, 0.08, 'square', 0.05);
        }

        playDrop() {
            this.playTone(150, 0.1, 'square', 0.08);
        }

        playClear(lines = 1) {
            if (this.muted || !this.audioContext) return;
            
            const baseFreq = 523.25; // C5
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            
            for (let i = 0; i < Math.min(lines, 4); i++) {
                setTimeout(() => {
                    this.playTone(notes[i], 0.15, 'sine', 0.1);
                }, i * 80);
            }
        }

        playLevelUp() {
            if (this.muted || !this.audioContext) return;
            
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    this.playTone(freq, 0.2, 'sine', 0.1);
                }, i * 100);
            });
        }

        playGameOver() {
            if (this.muted || !this.audioContext) return;
            
            const notes = [392.00, 369.99, 349.23, 329.63, 311.13, 293.66]; // G4, F#4, F4, E4, Eb4, D4
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    this.playTone(freq, 0.3, 'sawtooth', 0.08);
                }, i * 150);
            });
        }

        playStart() {
            if (this.muted || !this.audioContext) return;
            
            const notes = [523.25, 783.99, 1046.50]; // C5, G5, C6
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    this.playTone(freq, 0.15, 'square', 0.08);
                }, i * 100);
            });
        }

        playPause() {
            this.playTone(300, 0.1, 'square', 0.05);
        }

        // Background Music - Tetris-inspired loop
        startBackgroundMusic() {
            console.log('startBackgroundMusic called, musicEnabled:', this.musicEnabled, 'muted:', this.muted, 'audioContext:', !!this.audioContext);
            if (!this.musicEnabled || this.muted || !this.audioContext) return;
            
            // Resume audio context if suspended (browser policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
                console.log('Audio context resumed');
            }

            // Tetris theme (Korobeiniki) simplified melody
            const melody = [
                659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, 523.25, 440.00, 440.00,
                523.25, 659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, 523.25, 440.00, 440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, 523.25, 440.00, 440.00,
                392.00, 493.88, 587.33, 523.25, 440.00, 392.00, 329.63, 349.23, 392.00, 440.00, 392.00, 329.63, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23,
                440.00, 523.25, 587.33, 523.25, 440.00, 392.00, 349.23, 329.63, 392.00, 440.00, 392.00, 329.63, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23
            ];
            
            let noteIndex = 0;
            const tempo = 200; // ms per note
            
            // Clear any existing music interval
            if (this.musicInterval) {
                clearInterval(this.musicInterval);
            }
            
            // Create music gain node if not exists
            if (!this.musicGain) {
                this.musicGain = this.audioContext.createGain();
                this.musicGain.gain.value = 0.1; // Increased volume
                this.musicGain.connect(this.audioContext.destination);
                console.log('Created music gain node');
            }
            
            const playNote = () => {
                if (!this.musicEnabled || this.muted || !this.audioContext) return;
                
                const freq = melody[noteIndex];
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.musicGain);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine'; // Changed to sine for smoother sound
                
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
                
                noteIndex = (noteIndex + 1) % melody.length;
            };
            
            console.log('Starting music interval with tempo:', tempo);
            playNote();
            this.musicInterval = setInterval(playNote, tempo);
        }

        stopBackgroundMusic() {
            if (this.musicInterval) {
                clearInterval(this.musicInterval);
                this.musicInterval = null;
            }
        }

        toggleMute() {
            this.muted = !this.muted;
            if (this.muted) {
                this.stopBackgroundMusic();
            } else if (this.musicEnabled) {
                this.startBackgroundMusic();
            }
            this.init();
            return this.muted;
        }

        toggleMusic() {
            this.musicEnabled = !this.musicEnabled;
            if (this.musicEnabled && !this.muted) {
                this.startBackgroundMusic();
            } else {
                this.stopBackgroundMusic();
            }
            return this.musicEnabled;
        }
    }

    const sound = new SoundManager();

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
                sound.playGameOver();
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
                sound.playLevelUp();
            }
            sound.playClear(linesCleared);
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
            sound.playRotate();
        }
    }

    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft') {
            if (isValid(piece, -1, 0)) {
                piece.x--;
                sound.playMove();
            }
        } else if (e.code === 'ArrowRight') {
            if (isValid(piece, 1, 0)) {
                piece.x++;
                sound.playMove();
            }
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
        if (isValid(piece, -1, 0)) {
            piece.x--;
            sound.playMove();
        }
        draw();
    });

    document.getElementById('right-btn').addEventListener('click', () => {
        if (isValid(piece, 1, 0)) {
            piece.x++;
            sound.playMove();
        }
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
        sound.playDrop();
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
            sound.init();
            gameStarted = true;
            gamePaused = false;
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            score = 0;
            lines = 0;
            level = 1;
            piece = randomPiece();
            nextPiece = randomPiece();
            updateInfo();
            sound.playStart();
            sound.musicEnabled = true;
            document.getElementById('music-btn').classList.remove('disabled');
            document.getElementById('music-btn').textContent = '🎵';
            sound.startBackgroundMusic();
            gameLoop();
        }
    }

    function pauseGame() {
        gamePaused = true;
        sound.playPause();
        sound.stopBackgroundMusic();
    }

    function resumeGame() {
        gamePaused = false;
        if (sound.musicEnabled && !sound.muted) {
            sound.startBackgroundMusic();
        }
    }

    function stopGame() {
        clearTimeout(gameInterval);
        gameStarted = false;
        gamePaused = false;
        sound.stopBackgroundMusic();
        sound.musicEnabled = false;
        document.getElementById('music-btn').classList.add('disabled');
        document.getElementById('music-btn').textContent = '🎵';
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

    document.getElementById('mute-btn').addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        document.getElementById('mute-btn').textContent = isMuted ? '🔇' : '🔊';
    });

    document.getElementById('music-btn').addEventListener('click', () => {
        const isMusicEnabled = sound.toggleMusic();
        const musicBtn = document.getElementById('music-btn');
        if (isMusicEnabled) {
            musicBtn.textContent = '🎵';
            musicBtn.classList.remove('disabled');
        } else {
            musicBtn.textContent = '🔇';
            musicBtn.classList.add('disabled');
        }
    });

    // Initial setup, wait for start button
    updateInfo();
    context.clearRect(0, 0, canvas.width, canvas.height);
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    } catch (error) {
        alert("An error occurred: " + error.message + "\n\n" + error.stack);
    }
});
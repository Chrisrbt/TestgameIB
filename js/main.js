// ============================================
// MAIN - Entry point, input handling, game loop
// ============================================

(function() {
    'use strict';

    // Cache grass tiles to avoid random flickering
    const grassCache = {};

    function initGrassCache() {
        for (const mapName in Maps) {
            const map = Maps[mapName];
            grassCache[mapName] = {};
            for (let y = 0; y < map.height; y++) {
                for (let x = 0; x < map.width; x++) {
                    grassCache[mapName][`${x},${y}`] = Math.random() > 0.7;
                }
            }
        }
    }

    // Override drawMapTile to use cached grass
    const originalDrawMapTile = Game.drawMapTile.bind(Game);
    Game.drawMapTile = function(tile, x, y) {
        if (tile === 0) {
            if (this.currentMapName.startsWith('otherworld') || this.currentMapName === 'otherworld_secret') {
                Renderer.drawTile(x, y, TileSprites.voidFloor());
            } else if (this.currentMapName === 'house_exterior' &&
                x >= 5 && x <= 14 && y >= 3 && y <= 9) {
                Renderer.drawTile(x, y, TileSprites.houseFloor());
            } else {
                const dark = grassCache[this.currentMapName]
                    ? grassCache[this.currentMapName][`${x},${y}`]
                    : false;
                Renderer.drawTile(x, y, TileSprites.grass(dark));
            }
            return;
        }
        if (tile === 1) {
            if (this.currentMapName.startsWith('otherworld')) {
                const key = `${this.currentMapName}_${x}_${y}`;
                if (grassCache[key] === undefined) {
                    grassCache[key] = Math.random() > 0.3;
                }
                if (grassCache[key]) {
                    Renderer.drawTile(x, y, TileSprites.brickWall());
                } else {
                    Renderer.drawTile(x, y, TileSprites.fleshWall());
                }
                return;
            }
        }
        originalDrawMapTile(tile, x, y);
    };

    // ===== INITIALIZATION =====
    function initGame() {
        Renderer.init();
        Dialogue.init();
        initGrassCache();

        setupInput();
        setupUI();

        // Start game loop
        requestAnimationFrame(gameLoop);
    }

    // ===== INPUT =====
    const keys = {};
    let lastInputTime = 0;
    const INPUT_DELAY = 120; // ms

    function setupInput() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            AudioCtx.init();

            if (Dialogue.isActive()) {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'z') {
                    Dialogue.advance();
                }
                return;
            }

            if (e.key === 'z' || e.key === 'Enter' || e.key === ' ') {
                Game.interact();
            }
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Mobile controls
        const btns = document.querySelectorAll('.ctrl-btn');
        btns.forEach(btn => {
            const dir = btn.dataset.dir;

            const handlePress = (e) => {
                e.preventDefault();
                AudioCtx.init();

                if (dir === 'action') {
                    if (Dialogue.isActive()) {
                        Dialogue.advance();
                    } else {
                        Game.interact();
                    }
                } else {
                    if (!Dialogue.isActive()) {
                        Game.movePlayer(dir);
                    }
                }
            };

            btn.addEventListener('touchstart', handlePress, { passive: false });
            btn.addEventListener('mousedown', handlePress);

            // Repeat movement while held
            let holdInterval = null;
            const startHold = (e) => {
                e.preventDefault();
                if (dir !== 'action') {
                    holdInterval = setInterval(() => {
                        if (!Dialogue.isActive()) {
                            Game.movePlayer(dir);
                        }
                    }, 150);
                }
            };
            const endHold = () => {
                if (holdInterval) {
                    clearInterval(holdInterval);
                    holdInterval = null;
                }
            };

            btn.addEventListener('touchstart', startHold, { passive: false });
            btn.addEventListener('touchend', endHold);
            btn.addEventListener('touchcancel', endHold);
            btn.addEventListener('mousedown', startHold);
            btn.addEventListener('mouseup', endHold);
            btn.addEventListener('mouseleave', endHold);
        });

        // Swipe support for canvas
        let touchStartX = 0;
        let touchStartY = 0;
        const canvas = document.getElementById('game-canvas');

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            AudioCtx.init();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (Dialogue.isActive()) {
                Dialogue.advance();
                return;
            }

            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx < 10 && absDy < 10) {
                // Tap - interact
                Game.interact();
                return;
            }

            if (absDx > absDy) {
                Game.movePlayer(dx > 0 ? 'right' : 'left');
            } else {
                Game.movePlayer(dy > 0 ? 'down' : 'up');
            }
        }, { passive: false });
    }

    function processKeyboardInput() {
        const now = Date.now();
        if (now - lastInputTime < INPUT_DELAY) return;
        if (Dialogue.isActive()) return;

        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
            Game.movePlayer('up');
            lastInputTime = now;
        } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            Game.movePlayer('down');
            lastInputTime = now;
        } else if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            Game.movePlayer('left');
            lastInputTime = now;
        } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            Game.movePlayer('right');
            lastInputTime = now;
        }
    }

    // ===== UI =====
    function setupUI() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            AudioCtx.init();
            document.getElementById('title-screen').classList.add('hidden');
            Game.init();
        });

        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('game-over-screen').classList.add('hidden');
            const title = document.getElementById('game-over-title');
            title.style.color = '';
            title.style.textShadow = '';
            initGrassCache();
            Game.init();
        });

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // ===== GAME LOOP =====
    let lastTime = 0;
    const FPS = 60;
    const frameTime = 1000 / FPS;

    function gameLoop(timestamp) {
        requestAnimationFrame(gameLoop);

        if (timestamp - lastTime < frameTime) return;
        lastTime = timestamp;

        if (!Game.gameStarted) {
            // Draw title background
            Renderer.clear();
            return;
        }

        // Input
        processKeyboardInput();

        // Update
        Game.update();
        Dialogue.update(timestamp);

        // Render
        Game.render();
    }

    // ===== START =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
})();

// ============================================
// RENDERER - Pixel art drawing engine
// ============================================

const Renderer = {
    canvas: null,
    ctx: null,
    shakeTimer: 0,
    darkness: 0, // 0 = full light, 1 = pitch dark
    tint: null,   // {r,g,b,a} color overlay

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_W;
        this.canvas.height = CANVAS_H;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        const maxW = window.innerWidth;
        const maxH = window.innerHeight * 0.65;
        const scale = Math.min(maxW / CANVAS_W, maxH / CANVAS_H);
        this.canvas.style.width = (CANVAS_W * scale) + 'px';
        this.canvas.style.height = (CANVAS_H * scale) + 'px';
    },

    clear() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    },

    shake(frames) {
        this.shakeTimer = frames;
    },

    applyShake() {
        if (this.shakeTimer > 0) {
            const s = 3;
            this.ctx.save();
            this.ctx.translate(rng(-s, s), rng(-s, s));
            this.shakeTimer--;
        }
    },

    removeShake() {
        if (this.shakeTimer >= 0) {
            this.ctx.restore();
        }
    },

    // Draw a single tile
    drawTile(x, y, colors) {
        // colors is a 2D array [row][col] of hex colors, 8x8 pixels per tile
        const px = TILE / 8;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (colors[r] && colors[r][c]) {
                    this.ctx.fillStyle = colors[r][c];
                    this.ctx.fillRect(x * TILE + c * px, y * TILE + r * px, px, px);
                }
            }
        }
    },

    // Draw a simple colored rect tile
    drawRect(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
    },

    // Draw a rect with border
    drawRectBorder(x, y, fill, border) {
        this.ctx.fillStyle = fill;
        this.ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        this.ctx.strokeStyle = border;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * TILE + 0.5, y * TILE + 0.5, TILE - 1, TILE - 1);
    },

    // Draw character sprite (simple pixel art)
    drawSprite(x, y, sprite, frame) {
        const data = sprite.frames[frame % sprite.frames.length];
        const px = TILE / 8;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const color = data[r][c];
                if (color && color !== '.') {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x * TILE + c * px, y * TILE + r * px, px, px);
                }
            }
        }
    },

    // Draw text on canvas
    drawText(x, y, text, color = '#fff', size = 12) {
        this.ctx.fillStyle = color;
        this.ctx.font = size + 'px Courier New';
        this.ctx.fillText(text, x, y);
    },

    // Apply darkness/fog overlay
    applyDarkness(playerX, playerY, radius) {
        if (this.darkness <= 0) return;
        const gradient = this.ctx.createRadialGradient(
            playerX * TILE + TILE/2, playerY * TILE + TILE/2, radius * TILE,
            playerX * TILE + TILE/2, playerY * TILE + TILE/2, (radius + 3) * TILE
        );
        gradient.addColorStop(0, `rgba(0,0,0,0)`);
        gradient.addColorStop(1, `rgba(0,0,0,${this.darkness})`);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    },

    // Apply color tint
    applyTint() {
        if (!this.tint) return;
        this.ctx.fillStyle = `rgba(${this.tint.r},${this.tint.g},${this.tint.b},${this.tint.a})`;
        this.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    },

    // Transition effect
    fadeRect(alpha) {
        this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        this.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
};

// ============================================
// UTILS - Helper functions
// ============================================

const TILE = 32;
const COLS = 20;
const ROWS = 15;
const CANVAS_W = COLS * TILE;
const CANVAS_H = ROWS * TILE;

const DIR = {
    up:    { x: 0, y: -1 },
    down:  { x: 0, y: 1 },
    left:  { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function dist(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Simple audio context for sound effects
const AudioCtx = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    play(freq, duration, type = 'square', volume = 0.1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    step() {
        this.play(200, 0.05, 'square', 0.03);
    },
    pickup() {
        this.play(600, 0.1, 'square', 0.08);
        setTimeout(() => this.play(800, 0.15, 'square', 0.08), 100);
    },
    door() {
        this.play(150, 0.2, 'sawtooth', 0.06);
    },
    puzzle() {
        this.play(400, 0.1, 'sine', 0.1);
        setTimeout(() => this.play(500, 0.1, 'sine', 0.1), 100);
        setTimeout(() => this.play(700, 0.2, 'sine', 0.1), 200);
    },
    error() {
        this.play(100, 0.3, 'sawtooth', 0.08);
    },
    scary() {
        this.play(80, 0.8, 'sawtooth', 0.06);
        setTimeout(() => this.play(60, 1.0, 'sawtooth', 0.04), 300);
    },
    win() {
        [400,500,600,700,800].forEach((f,i) => {
            setTimeout(() => this.play(f, 0.2, 'sine', 0.1), i * 150);
        });
    }
};

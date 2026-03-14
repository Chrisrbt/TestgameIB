// ============================================
// DIALOGUE - Text display system
// ============================================

const Dialogue = {
    box: null,
    textEl: null,
    active: false,
    queue: [],
    currentText: '',
    charIndex: 0,
    typeSpeed: 30, // ms per character
    lastCharTime: 0,
    callback: null,

    init() {
        this.box = document.getElementById('dialogue-box');
        this.textEl = document.getElementById('dialogue-text');

        // Click/touch to advance
        this.box.addEventListener('click', () => this.advance());
        this.box.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.advance();
        });
    },

    show(text, callback) {
        if (this.active) {
            this.queue.push({ text, callback });
            return;
        }
        this.active = true;
        this.currentText = text;
        this.charIndex = 0;
        this.callback = callback || null;
        this.textEl.textContent = '';
        this.box.classList.remove('hidden');
        this.lastCharTime = 0;
    },

    advance() {
        if (!this.active) return;

        if (this.charIndex < this.currentText.length) {
            // Skip to end
            this.charIndex = this.currentText.length;
            this.textEl.textContent = this.currentText;
        } else {
            // Close dialogue
            this.close();
        }
    },

    close() {
        this.active = false;
        this.box.classList.add('hidden');
        if (this.callback) {
            this.callback();
            this.callback = null;
        }
        // Process queue
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            setTimeout(() => this.show(next.text, next.callback), 200);
        }
    },

    update(time) {
        if (!this.active) return;
        if (this.charIndex >= this.currentText.length) return;

        if (time - this.lastCharTime > this.typeSpeed) {
            this.charIndex++;
            this.textEl.textContent = this.currentText.substring(0, this.charIndex);
            this.lastCharTime = time;
        }
    },

    isActive() {
        return this.active;
    }
};

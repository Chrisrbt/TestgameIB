// ============================================
// PUZZLES - Puzzle logic for each room
// ============================================

const Puzzles = {
    // Track puzzle states
    leverState: {},
    floorBtnSequence: [],
    floorBtnExpected: [1, 2, 3, 4], // red, green, blue, yellow

    reset() {
        this.leverState = {};
        this.floorBtnSequence = [];
    },

    // Toggle a lever and check puzzle
    toggleLever(entity, game) {
        entity.on = !entity.on;
        this.leverState[entity.id] = entity.on;
        AudioCtx.play(entity.on ? 400 : 200, 0.15, 'square', 0.08);

        // Check: lever1 and lever3 should be ON, lever2 and lever4 OFF
        const l1 = this.leverState['lever1'] || false;
        const l2 = this.leverState['lever2'] || false;
        const l3 = this.leverState['lever3'] || false;
        const l4 = this.leverState['lever4'] || false;

        if (l1 && !l2 && l3 && !l4) {
            // Puzzle solved!
            AudioCtx.puzzle();
            game.showDialogue("Le leve scattano... senti un rumore. Qualcosa e' apparso al centro della stanza!");
            // Reveal the blue crystal
            const crystal = game.currentEntities.find(e => e.id === 'crystal_blue');
            if (crystal) crystal.hidden = false;
            game.puzzleSolved('west_levers');
        }
    },

    // Step on floor button
    stepFloorBtn(entity, game) {
        if (entity.pressed) return;

        entity.pressed = true;
        this.floorBtnSequence.push(entity.order);
        AudioCtx.play(300 + entity.order * 100, 0.1, 'sine', 0.08);

        // Check if sequence is correct so far
        for (let i = 0; i < this.floorBtnSequence.length; i++) {
            if (this.floorBtnSequence[i] !== this.floorBtnExpected[i]) {
                // Wrong sequence!
                AudioCtx.error();
                game.showDialogue("Le piastrelle si spengono... devi ricominciare la sequenza.");
                this.floorBtnSequence = [];
                // Reset all floor buttons
                game.currentEntities.forEach(e => {
                    if (e.type === 'floor_btn') e.pressed = false;
                });
                return;
            }
        }

        // Check if complete
        if (this.floorBtnSequence.length === this.floorBtnExpected.length) {
            AudioCtx.puzzle();
            game.showDialogue("Le piastrelle brillano! Un cristallo rosso appare dal pavimento!");
            const crystal = game.currentEntities.find(e => e.id === 'crystal_red');
            if (crystal) crystal.hidden = false;
            game.puzzleSolved('east_pattern');
        }
    },

    // Check if player can enter final door
    canEnterFinal(game) {
        return game.inventory.includes('crystal_blue')
            && game.inventory.includes('crystal_red')
            && game.inventory.includes('crystal_green');
    },
};

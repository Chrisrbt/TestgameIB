// ============================================
// GAME - Main game engine
// ============================================

const Game = {
    player: { x: 0, y: 0 },
    currentMap: null,
    currentMapName: '',
    currentEntities: [],
    inventory: [],
    inventoryNames: {},
    solvedPuzzles: [],
    frame: 0,
    moveTimer: 0,
    moveDelay: 8, // frames between moves
    transitioning: false,
    transitionAlpha: 0,
    transitionTarget: null,
    gameStarted: false,
    dead: false,
    nonnaFound: false,
    greenCrystalGiven: false,

    init() {
        this.loadMap('forest');
        this.gameStarted = true;
        this.dead = false;
        this.inventory = [];
        this.inventoryNames = {};
        this.solvedPuzzles = [];
        this.nonnaFound = false;
        this.greenCrystalGiven = false;
        Puzzles.reset();
        this.updateInventoryUI();

        // Opening dialogue
        setTimeout(() => {
            Dialogue.show("Devo trovare la casa della nonna... il bosco e' cosi' buio stasera...", () => {
                Dialogue.show("Dicono che vive da sola da quando il nonno e' scomparso. Non risponde al telefono da giorni...");
            });
        }, 500);
    },

    loadMap(name) {
        const map = Maps[name];
        if (!map) return;
        this.currentMap = map;
        this.currentMapName = name;
        this.player.x = map.playerStart.x;
        this.player.y = map.playerStart.y;
        Renderer.darkness = map.darkness || 0;
        Renderer.tint = map.tint || null;

        // Deep copy entities
        this.currentEntities = map.entities.map(e => {
            const copy = { ...e };
            if (e.patrol) copy.patrol = e.patrol.map(p => ({ ...p }));
            // Restore collected state
            if (this.inventory.includes(e.id)) {
                copy.collected = true;
            }
            // Restore puzzle states
            if (e.type === 'lever' && Puzzles.leverState[e.id] !== undefined) {
                copy.on = Puzzles.leverState[e.id];
            }
            if (e.type === 'crystal' && this.solvedPuzzles.includes('west_levers') && e.id === 'crystal_blue') {
                copy.hidden = false;
            }
            if (e.type === 'crystal' && this.solvedPuzzles.includes('east_pattern') && e.id === 'crystal_red') {
                copy.hidden = false;
            }
            if (e.type === 'portal' && this.nonnaFound) {
                copy.hidden = false;
            }
            return copy;
        });
    },

    loadMapAt(name, x, y) {
        this.loadMap(name);
        this.player.x = x;
        this.player.y = y;
    },

    movePlayer(dir) {
        if (this.dead || this.transitioning || Dialogue.isActive()) return;
        if (this.moveTimer > 0) return;

        const d = DIR[dir];
        if (!d) return;

        const nx = this.player.x + d.x;
        const ny = this.player.y + d.y;

        // Bounds check
        if (nx < 0 || nx >= this.currentMap.width || ny < 0 || ny >= this.currentMap.height) return;

        // Wall check
        const tile = this.currentMap.tiles[ny][nx];
        if (tile === 1 || tile === 2 || tile === 7) return; // wall, tree, house wall

        // Move
        this.player.x = nx;
        this.player.y = ny;
        this.moveTimer = this.moveDelay;
        AudioCtx.step();

        // Check interactions at new position
        this.checkInteractions();
        this.checkTransitions();
        this.checkEnemies();
    },

    interact() {
        if (this.dead || this.transitioning || Dialogue.isActive()) return;

        // Check adjacent tiles and current tile for interactables
        const positions = [
            { x: this.player.x, y: this.player.y },
            { x: this.player.x + 1, y: this.player.y },
            { x: this.player.x - 1, y: this.player.y },
            { x: this.player.x, y: this.player.y + 1 },
            { x: this.player.x, y: this.player.y - 1 },
        ];

        for (const pos of positions) {
            for (const entity of this.currentEntities) {
                if (entity.x === pos.x && entity.y === pos.y) {
                    this.interactWith(entity);
                    return;
                }
            }
        }
    },

    interactWith(entity) {
        switch (entity.type) {
            case 'note':
                if (entity.text) {
                    Dialogue.show(entity.text);
                }
                break;
            case 'key':
                if (!entity.collected) {
                    entity.collected = true;
                    this.addToInventory(entity.id, 'Chiave');
                    AudioCtx.pickup();
                    Dialogue.show(entity.text || "Hai trovato una chiave!");
                }
                break;
            case 'crystal':
                if (!entity.collected && !entity.hidden) {
                    entity.collected = true;
                    const names = { blue: 'Cristallo Blu', red: 'Cristallo Rosso', green: 'Cristallo Verde' };
                    this.addToInventory(entity.id, names[entity.color] || 'Cristallo');
                    AudioCtx.pickup();
                    Dialogue.show(entity.text || "Hai trovato un cristallo!");
                }
                break;
            case 'lever':
                Puzzles.toggleLever(entity, this);
                break;
            case 'nonna':
                if (!this.nonnaFound) {
                    this.nonnaFound = true;
                    AudioCtx.scary();
                    Renderer.shake(20);
                    Dialogue.show("Nonna! Ti ho trovata! Stai bene?", () => {
                        Dialogue.show("Nonna Maria: \"Nipote mio... sei venuto a cercarmi... Questo posto... non e' quello che sembra.\"", () => {
                            Dialogue.show("Nonna Maria: \"Prendi questo cristallo. L'ho protetto per tutto questo tempo. Usalo insieme agli altri per aprire il portale.\"", () => {
                                // Give green crystal
                                if (!this.greenCrystalGiven) {
                                    this.greenCrystalGiven = true;
                                    this.addToInventory('crystal_green', 'Cristallo Verde');
                                    AudioCtx.pickup();
                                    Dialogue.show("Nonna Maria ti ha dato il Cristallo Verde!", () => {
                                        Dialogue.show("Nonna Maria: \"Il portale si e' aperto! Presto, dobbiamo uscire da qui prima che le ombre ci raggiungano!\"", () => {
                                            // Show portal
                                            const portal = this.currentEntities.find(e => e.id === 'exit_portal');
                                            if (portal) portal.hidden = false;
                                            AudioCtx.puzzle();
                                        });
                                    });
                                }
                            });
                        });
                    });
                } else {
                    Dialogue.show("Nonna Maria: \"Sbrigati nipote! Il portale e' aperto, dobbiamo andare!\"");
                }
                break;
            case 'portal':
                if (!entity.hidden && this.nonnaFound) {
                    this.victory();
                }
                break;
        }
    },

    checkInteractions() {
        const px = this.player.x;
        const py = this.player.y;

        for (const entity of this.currentEntities) {
            if (entity.x === px && entity.y === py) {
                // Auto-interact with floor buttons
                if (entity.type === 'floor_btn') {
                    Puzzles.stepFloorBtn(entity, this);
                }
                // Auto-interact with portal
                if (entity.type === 'portal' && !entity.hidden && this.nonnaFound) {
                    this.victory();
                }
            }
        }
    },

    checkTransitions() {
        if (!this.currentMap.transitions) return;

        for (const t of this.currentMap.transitions) {
            if (this.player.x === t.x && this.player.y === t.y) {
                // Check requirements
                if (t.needCrystals && !Puzzles.canEnterFinal(this)) {
                    Dialogue.show("La porta e' sigillata. Servono tre cristalli per aprirla: Rosso, Blu e Verde.");
                    this.player.y += 1; // push back
                    return;
                }
                if (t.needPortal) {
                    const portal = this.currentEntities.find(e => e.id === 'exit_portal');
                    if (!portal || portal.hidden) {
                        this.player.y += 1;
                        return;
                    }
                    this.victory();
                    return;
                }
                if (t.to === 'victory') {
                    this.victory();
                    return;
                }

                // Start transition
                this.startTransition(t);
                return;
            }
        }
    },

    checkEnemies() {
        for (const entity of this.currentEntities) {
            if (entity.type === 'shadow') {
                if (dist(entity, this.player) <= 0) {
                    this.die();
                    return;
                }
            }
        }
    },

    startTransition(t) {
        this.transitioning = true;
        this.transitionTarget = t;
        this.transitionAlpha = 0;

        if (t.isTrap) {
            AudioCtx.scary();
            Renderer.shake(30);
            if (t.dialogue) {
                Dialogue.show(t.dialogue);
            }
        } else {
            AudioCtx.door();
        }
    },

    updateTransition() {
        if (!this.transitioning) return;

        this.transitionAlpha += 0.03;

        if (this.transitionAlpha >= 1.0) {
            const t = this.transitionTarget;
            this.loadMapAt(t.to, t.toX, t.toY);
            this.transitioning = false;
            this.transitionAlpha = 0;
            this.transitionTarget = null;

            // Map-specific intro dialogues
            this.showMapIntro(t.to);
        }
    },

    showMapIntro(mapName) {
        switch (mapName) {
            case 'house_exterior':
                setTimeout(() => {
                    Dialogue.show("Questa e' la casa della nonna... sembra abbandonata da tempo.", () => {
                        Dialogue.show("La porta e' aperta. Dentro e' tutto sottosopra. C'e' qualcosa sul pavimento... una botola?");
                    });
                }, 300);
                break;
            case 'otherworld_hall':
                setTimeout(() => {
                    Dialogue.show("Dove... dove sono?! Questo posto non ha senso!", () => {
                        Dialogue.show("Le pareti pulsano come se fossero vive. Devo trovare la nonna e uscire da qui!");
                    });
                }, 300);
                break;
            case 'otherworld_west':
                setTimeout(() => {
                    Dialogue.show("Una stanza piena di leve... ci dev'essere un meccanismo da attivare.");
                }, 300);
                break;
            case 'otherworld_east':
                setTimeout(() => {
                    Dialogue.show("Piastrelle colorate sul pavimento... forse devo calpestarle in un ordine preciso.");
                }, 300);
                break;
            case 'otherworld_final':
                setTimeout(() => {
                    Dialogue.show("La nonna! La vedo! Ma... quelle ombre... devo stare attento!", () => {
                        AudioCtx.scary();
                    });
                }, 300);
                break;
        }
    },

    addToInventory(id, name) {
        if (!this.inventory.includes(id)) {
            this.inventory.push(id);
            this.inventoryNames[id] = name;
            this.updateInventoryUI();
        }
    },

    updateInventoryUI() {
        const container = document.getElementById('inventory-items');
        container.innerHTML = '';
        for (const id of this.inventory) {
            const div = document.createElement('div');
            div.className = 'inv-item';
            div.textContent = this.inventoryNames[id] || id;
            container.appendChild(div);
        }
    },

    puzzleSolved(puzzleId) {
        if (!this.solvedPuzzles.includes(puzzleId)) {
            this.solvedPuzzles.push(puzzleId);
        }
    },

    showDialogue(text, callback) {
        Dialogue.show(text, callback);
    },

    die() {
        if (this.dead) return;
        this.dead = true;
        AudioCtx.scary();
        Renderer.shake(40);

        setTimeout(() => {
            const screen = document.getElementById('game-over-screen');
            const text = document.getElementById('game-over-text');
            const title = document.getElementById('game-over-title');
            title.textContent = 'GAME OVER';
            text.textContent = "Le ombre ti hanno raggiunto.\nL'oscurita' ti ha inghiottito...";
            screen.classList.remove('hidden');
        }, 1000);
    },

    victory() {
        if (this.dead) return;
        this.dead = true; // prevent further input
        AudioCtx.win();

        setTimeout(() => {
            const screen = document.getElementById('game-over-screen');
            const text = document.getElementById('game-over-text');
            const title = document.getElementById('game-over-title');
            title.textContent = 'HAI VINTO!';
            title.style.color = '#4a4';
            title.style.textShadow = '0 0 30px #4a4';
            text.innerHTML = "Sei riuscito a trovare la nonna e a fuggire dall'altro mondo!<br><br>" +
                "Nonna Maria: \"Grazie, nipote mio. Non sarei mai riuscita a uscire da sola.\"<br><br>" +
                "Insieme, attraversate il portale e tornate nel mondo reale.<br>" +
                "La casa nel bosco e' di nuovo tranquilla...<br><br>" +
                "<em>FINE</em>";
            screen.classList.remove('hidden');
        }, 500);
    },

    // ===== RENDERING =====
    render() {
        Renderer.clear();
        Renderer.applyShake();

        const map = this.currentMap;
        if (!map) return;

        // Draw tiles
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const tile = map.tiles[y][x];
                this.drawMapTile(tile, x, y);
            }
        }

        // Draw entities
        for (const entity of this.currentEntities) {
            Entities.draw(entity, this.frame);
        }

        // Draw player
        const walkFrame = (this.moveTimer > 0) ? 1 : 0;
        Renderer.drawSprite(this.player.x, this.player.y, PlayerSprite, walkFrame);

        // Apply darkness
        Renderer.applyDarkness(this.player.x, this.player.y, 2.5);

        // Apply tint
        Renderer.applyTint();

        // Transition fade
        if (this.transitioning) {
            Renderer.fadeRect(this.transitionAlpha);
        }

        // Death fade
        if (this.dead) {
            Renderer.fadeRect(0.02);
        }

        Renderer.removeShake();
    },

    drawMapTile(tile, x, y) {
        switch (tile) {
            case 0: // grass / floor
                if (this.currentMapName.startsWith('otherworld') || this.currentMapName === 'otherworld_secret') {
                    Renderer.drawTile(x, y, TileSprites.voidFloor());
                } else if (this.currentMapName === 'house_exterior' &&
                    x >= 5 && x <= 14 && y >= 3 && y <= 9) {
                    Renderer.drawTile(x, y, TileSprites.houseFloor());
                } else {
                    Renderer.drawTile(x, y, TileSprites.grass(Math.random() > 0.7));
                }
                break;
            case 1: // wall
                if (this.currentMapName.startsWith('otherworld')) {
                    if (Math.random() > 0.3) {
                        Renderer.drawTile(x, y, TileSprites.brickWall());
                    } else {
                        Renderer.drawTile(x, y, TileSprites.fleshWall());
                    }
                } else {
                    Renderer.drawRect(x, y, '#333');
                }
                break;
            case 2: // tree
                Renderer.drawTile(x, y, TileSprites.grass(true));
                Renderer.drawTile(x, y, TileSprites.tree());
                break;
            case 3: // path
                Renderer.drawTile(x, y, TileSprites.path());
                break;
            case 4: // door
                Renderer.drawTile(x, y, TileSprites.door());
                break;
            case 5: // water
                Renderer.drawTile(x, y, TileSprites.water(this.frame));
                break;
            case 6: // bush
                Renderer.drawTile(x, y, TileSprites.grass(false));
                break;
            case 7: // house wall
                Renderer.drawTile(x, y, TileSprites.houseWall());
                break;
            case 8: // trapdoor
                Renderer.drawTile(x, y, TileSprites.trapdoor(false));
                break;
            case 9: // special (otherworld floor)
                Renderer.drawTile(x, y, TileSprites.voidFloor());
                break;
        }
    },

    // ===== UPDATE =====
    update() {
        if (!this.gameStarted || this.dead) return;

        this.frame++;
        if (this.moveTimer > 0) this.moveTimer--;

        // Update entities
        for (const entity of this.currentEntities) {
            Entities.update(entity, this.frame, this.player.x, this.player.y);
        }

        // Check enemy collisions every frame
        this.checkEnemies();

        // Update transition
        if (this.transitioning) {
            this.updateTransition();
        }
    }
};

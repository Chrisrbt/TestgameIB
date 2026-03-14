// ============================================
// MAPS - All game levels and tile definitions
// ============================================
// Tile legend:
// 0 = empty/floor, 1 = wall, 2 = tree, 3 = path, 4 = door/transition
// 5 = water, 6 = bush, 7 = house wall, 8 = trapdoor, 9 = special

const TILE_COLORS = {
    // Forest tiles
    grass:      '#2d5a1e',
    grassDark:  '#1e4015',
    tree:       '#0a3000',
    treeTrunk:  '#4a2800',
    path:       '#6b5a3e',
    pathEdge:   '#5a4a30',
    water:      '#1a3a6b',
    waterLight: '#2a4a8b',
    bush:       '#1a4a10',
    // House tiles
    wallExt:    '#4a4040',
    wallInt:    '#3a3030',
    roof:       '#5a2020',
    floor:      '#4a3a2a',
    floorTile:  '#3a2a1a',
    doorWood:   '#6a4a20',
    window:     '#1a2a4a',
    // Other world tiles
    void:       '#0a0010',
    brickDark:  '#2a1a2a',
    brickLight: '#3a2a3a',
    fleshWall:  '#4a1a1a',
    eyeFloor:   '#1a1020',
    crystalB:   '#2040aa',
    crystalR:   '#aa2040',
    lava:       '#aa3010',
    portal:     '#6030aa',
};

// Pixel art patterns for tiles (8x8)
const TileSprites = {
    grass(dark) {
        const b = dark ? TILE_COLORS.grassDark : TILE_COLORS.grass;
        const g = dark ? '#1a3510' : '#3a6a2e';
        return [
            [b,b,b,g,b,b,b,b],
            [b,b,b,b,b,b,g,b],
            [b,g,b,b,b,b,b,b],
            [b,b,b,b,g,b,b,b],
            [b,b,b,b,b,b,b,g],
            [g,b,b,b,b,b,b,b],
            [b,b,g,b,b,g,b,b],
            [b,b,b,b,b,b,b,b],
        ];
    },
    tree() {
        const l = '#1a5a10';
        const d = '#0a3a00';
        const t = '#4a2800';
        const _ = null;
        return [
            [_,_,d,l,l,d,_,_],
            [_,d,l,l,l,l,d,_],
            [d,l,l,d,l,l,l,d],
            [d,l,d,l,l,d,l,d],
            [_,d,l,l,l,l,d,_],
            [_,_,d,t,t,d,_,_],
            [_,_,_,t,t,_,_,_],
            [_,_,_,t,t,_,_,_],
        ];
    },
    path() {
        const p = TILE_COLORS.path;
        const e = TILE_COLORS.pathEdge;
        const s = '#7a6a4e';
        return [
            [p,p,e,p,p,p,e,p],
            [p,p,p,p,s,p,p,p],
            [e,p,p,p,p,p,p,e],
            [p,p,s,p,p,p,p,p],
            [p,p,p,p,p,s,p,p],
            [p,e,p,p,p,p,p,p],
            [p,p,p,p,p,p,e,p],
            [p,p,p,s,p,p,p,p],
        ];
    },
    water(frame) {
        const w = TILE_COLORS.water;
        const l = TILE_COLORS.waterLight;
        const shift = frame % 4;
        const rows = [];
        for (let r = 0; r < 8; r++) {
            const row = [];
            for (let c = 0; c < 8; c++) {
                row.push(((c + r + shift) % 3 === 0) ? l : w);
            }
            rows.push(row);
        }
        return rows;
    },
    houseWall() {
        const w = TILE_COLORS.wallExt;
        const d = '#3a3030';
        return [
            [w,w,w,w,w,w,w,w],
            [w,w,w,d,w,w,w,w],
            [w,d,w,w,w,w,d,w],
            [w,w,w,w,w,w,w,w],
            [w,w,w,w,d,w,w,w],
            [w,w,d,w,w,w,w,w],
            [w,w,w,w,w,w,w,d],
            [w,w,w,w,w,w,w,w],
        ];
    },
    houseFloor() {
        const f = TILE_COLORS.floor;
        const t = TILE_COLORS.floorTile;
        return [
            [f,f,f,f,t,f,f,f],
            [f,f,f,f,f,f,f,f],
            [f,f,t,f,f,f,f,f],
            [f,f,f,f,f,f,t,f],
            [t,f,f,f,f,f,f,f],
            [f,f,f,t,f,f,f,f],
            [f,f,f,f,f,f,f,f],
            [f,f,f,f,f,t,f,f],
        ];
    },
    trapdoor(open) {
        const w = '#4a3020';
        const d = open ? '#000' : '#5a4030';
        const h = '#3a2010';
        return [
            [w,w,w,w,w,w,w,w],
            [w,d,d,d,d,d,d,w],
            [w,d,h,d,d,h,d,w],
            [w,d,d,d,d,d,d,w],
            [w,d,d,d,d,d,d,w],
            [w,d,h,d,d,h,d,w],
            [w,d,d,d,d,d,d,w],
            [w,w,w,w,w,w,w,w],
        ];
    },
    voidFloor() {
        const v = TILE_COLORS.void;
        const e = TILE_COLORS.eyeFloor;
        return [
            [v,v,v,e,v,v,v,v],
            [v,e,v,v,v,v,v,v],
            [v,v,v,v,v,e,v,v],
            [v,v,v,v,v,v,v,v],
            [v,v,e,v,v,v,v,e],
            [v,v,v,v,v,v,v,v],
            [e,v,v,v,v,e,v,v],
            [v,v,v,v,v,v,v,v],
        ];
    },
    brickWall() {
        const d = TILE_COLORS.brickDark;
        const l = TILE_COLORS.brickLight;
        return [
            [l,l,l,d,l,l,l,l],
            [l,l,l,d,l,l,l,l],
            [d,d,d,d,d,d,d,d],
            [l,l,l,l,l,d,l,l],
            [l,l,l,l,l,d,l,l],
            [d,d,d,d,d,d,d,d],
            [l,l,d,l,l,l,l,l],
            [l,l,d,l,l,l,l,l],
        ];
    },
    fleshWall() {
        const f = TILE_COLORS.fleshWall;
        const d = '#3a0a0a';
        const v = '#5a1a2a';
        return [
            [f,f,d,f,f,f,v,f],
            [f,d,f,f,v,f,f,f],
            [f,f,f,v,f,f,d,f],
            [d,f,f,f,f,d,f,f],
            [f,f,v,f,f,f,f,d],
            [f,f,f,f,d,f,f,f],
            [f,d,f,f,f,f,v,f],
            [f,f,f,d,f,f,f,f],
        ];
    },
    door() {
        const d = TILE_COLORS.doorWood;
        const h = '#8a6a30';
        const k = '#aaa';
        return [
            [d,d,d,d,d,d,d,d],
            [d,h,h,d,d,h,h,d],
            [d,h,h,d,d,h,h,d],
            [d,d,d,d,d,d,d,d],
            [d,d,d,d,k,d,d,d],
            [d,d,d,d,d,d,d,d],
            [d,h,h,d,d,h,h,d],
            [d,d,d,d,d,d,d,d],
        ];
    },
    portal(frame) {
        const colors = ['#4020aa','#6030cc','#8040ee','#6030cc'];
        const c1 = colors[frame % 4];
        const c2 = colors[(frame + 2) % 4];
        const _ = null;
        return [
            [_,_,c1,c2,c2,c1,_,_],
            [_,c1,c2,c1,c1,c2,c1,_],
            [c1,c2,c1,_,_,c1,c2,c1],
            [c2,c1,_,_,_,_,c1,c2],
            [c2,c1,_,_,_,_,c1,c2],
            [c1,c2,c1,_,_,c1,c2,c1],
            [_,c1,c2,c1,c1,c2,c1,_],
            [_,_,c1,c2,c2,c1,_,_],
        ];
    },
    crystal(color) {
        const c = color === 'blue' ? '#4080ff' : color === 'red' ? '#ff4040' : '#40ff40';
        const d = color === 'blue' ? '#2050aa' : color === 'red' ? '#aa2020' : '#20aa20';
        const l = color === 'blue' ? '#80b0ff' : color === 'red' ? '#ff8080' : '#80ff80';
        const _ = null;
        return [
            [_,_,_,l,_,_,_,_],
            [_,_,l,c,l,_,_,_],
            [_,_,c,c,c,_,_,_],
            [_,l,c,d,c,l,_,_],
            [_,c,d,d,d,c,_,_],
            [_,c,c,d,c,c,_,_],
            [_,_,c,c,c,_,_,_],
            [_,_,_,d,_,_,_,_],
        ];
    },
    key() {
        const k = '#daa520';
        const _ = null;
        return [
            [_,_,k,k,k,_,_,_],
            [_,k,_,_,_,k,_,_],
            [_,k,_,_,_,k,_,_],
            [_,_,k,k,k,_,_,_],
            [_,_,_,k,_,_,_,_],
            [_,_,_,k,k,_,_,_],
            [_,_,_,k,_,_,_,_],
            [_,_,_,k,k,_,_,_],
        ];
    },
    nonna() {
        const h = '#aaa';    // hair
        const s = '#daa';    // skin
        const d = '#604080'; // dress
        const _ = null;
        return [
            [_,_,h,h,h,h,_,_],
            [_,h,h,h,h,h,h,_],
            [_,h,s,s,s,s,h,_],
            [_,_,s,'#000',s,'#000',_,_],
            [_,_,s,s,s,s,_,_],
            [_,d,d,d,d,d,d,_],
            [_,d,d,d,d,d,d,_],
            [_,_,d,_,_,d,_,_],
        ];
    },
    lever(on) {
        const b = '#555';
        const h = on ? '#4a4' : '#a44';
        const _ = null;
        return [
            [_,_,_,_,_,_,_,_],
            [_,_,_,on?_:h,on?h:_,_,_,_],
            [_,_,_,on?_:h,on?h:_,_,_,_],
            [_,_,_,b,b,_,_,_],
            [_,_,_,b,b,_,_,_],
            [_,_,b,b,b,b,_,_],
            [_,b,b,b,b,b,b,_],
            [_,_,_,_,_,_,_,_],
        ];
    },
    note() {
        const p = '#ddd';
        const t = '#666';
        const _ = null;
        return [
            [_,p,p,p,p,p,_,_],
            [_,p,t,t,t,p,_,_],
            [_,p,p,p,p,p,_,_],
            [_,p,t,t,p,p,_,_],
            [_,p,p,p,p,p,_,_],
            [_,p,t,t,t,p,_,_],
            [_,p,p,p,p,p,_,_],
            [_,_,_,_,_,_,_,_],
        ];
    },
};

// Character sprites
const PlayerSprite = {
    frames: [
        // Frame 0 - standing
        [
            ['.','.','.','#654','#654','.','.','.'],
            ['.','.','#654','#fdb','#fdb','#654','.','.'],
            ['.','.','#fdb','#345','#345','#fdb','.','.'],
            ['.','.','.','#fdb','#fdb','.','.','.'],
            ['.','#36a','#36a','#36a','#36a','#36a','#36a','.'],
            ['.','.','.','#36a','#36a','.','.','.'],
            ['.','.','#36a','.','.','#36a','.','.'],
            ['.','.','#543','.','.','#543','.','.'],
        ],
        // Frame 1 - walking
        [
            ['.','.','.','#654','#654','.','.','.'],
            ['.','.','#654','#fdb','#fdb','#654','.','.'],
            ['.','.','#fdb','#345','#345','#fdb','.','.'],
            ['.','.','.','#fdb','#fdb','.','.','.'],
            ['.','#36a','#36a','#36a','#36a','#36a','#36a','.'],
            ['.','.','.','#36a','#36a','.','.','.'],
            ['.','#36a','.','.','.','.','#36a','.'],
            ['.','#543','.','.','.','.','#543','.'],
        ],
    ]
};

const ShadowSprite = {
    frames: [
        [
            ['.','.','.','#111','#111','.','.','.'],
            ['.','.','#111','#222','#222','#111','.','.'],
            ['.','.','#222','#a00','#a00','#222','.','.'],
            ['.','.','.','#222','#222','.','.','.'],
            ['.','#111','#111','#222','#222','#111','#111','.'],
            ['.','.','.','#222','#222','.','.','.'],
            ['.','.','#111','.','.','#111','.','.'],
            ['.','.','#111','.','.','#111','.','.'],
        ],
        [
            ['.','.','.','#111','#111','.','.','.'],
            ['.','.','#111','#222','#222','#111','.','.'],
            ['.','.','#222','#a00','#a00','#222','.','.'],
            ['.','.','.','#222','#222','.','.','.'],
            ['.','#111','#111','#222','#222','#111','#111','.'],
            ['.','.','.','#222','#222','.','.','.'],
            ['.','#111','.','.','.','.','#111','.'],
            ['.','#111','.','.','.','.','#111','.'],
        ],
    ]
};


// ===== MAP DATA =====
// Each map: { width, height, tiles[][], entities[], transitions[], darkness, tint }

const Maps = {
    // LEVEL 1: The Forest
    forest: {
        width: 20,
        height: 15,
        darkness: 0.6,
        tint: { r: 0, g: 20, b: 0, a: 0.1 },
        playerStart: { x: 1, y: 13 },
        tiles: [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,0,0,2,0,0,0,2,2,0,0,0,2,0,0,0,2,0,0,2],
            [2,0,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,0,0,2],
            [2,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,2,2],
            [2,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
            [2,2,0,0,0,0,3,3,3,3,3,0,0,0,2,0,0,2,0,2],
            [2,0,0,2,0,0,3,2,3,2,3,0,2,0,0,0,0,0,0,2],
            [2,0,0,0,0,0,3,3,4,2,3,0,0,0,0,2,0,0,0,2],
            [2,0,2,0,0,0,3,2,3,2,3,0,0,2,0,0,0,2,0,2],
            [2,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,2],
            [2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2],
            [2,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,2,0,0,2],
            [2,0,2,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,2],
            [2,3,3,3,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ],
        entities: [
            { type: 'note', x: 3, y: 3, id: 'forest_note1',
              text: "Un biglietto strappato: \"Non entrare nella casa... lei non e' piu' la stessa...\"" },
            { type: 'note', x: 15, y: 2, id: 'forest_note2',
              text: "Inciso su un albero: \"La botola si apre solo per chi ha il coraggio di scendere.\"" },
        ],
        transitions: [
            { x: 8, y: 7, to: 'house_exterior', toX: 9, toY: 13 }
        ]
    },

    // LEVEL 2: House Exterior
    house_exterior: {
        width: 20,
        height: 15,
        darkness: 0.4,
        tint: { r: 10, g: 0, b: 10, a: 0.08 },
        playerStart: { x: 9, y: 13 },
        tiles: [
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
            [2,0,0,0,0,2,7,7,7,7,7,7,7,7,2,0,0,0,0,2],
            [2,0,0,0,0,2,7,7,7,7,7,7,7,7,2,0,0,0,0,2],
            [2,0,2,0,0,7,7,0,0,0,0,0,0,7,7,0,0,2,0,2],
            [2,0,0,0,0,7,0,0,0,0,0,0,0,0,7,0,0,0,0,2],
            [2,0,0,0,0,7,0,0,0,0,0,0,0,0,7,0,0,0,0,2],
            [2,0,2,0,0,7,0,0,0,8,0,0,0,0,7,0,2,0,0,2],
            [2,0,0,0,0,7,0,0,0,0,0,0,0,0,7,0,0,0,0,2],
            [2,0,0,0,0,7,0,0,0,0,0,0,0,0,7,0,0,0,0,2],
            [2,0,0,2,0,7,7,0,0,0,0,0,0,7,7,0,2,0,0,2],
            [2,0,0,0,0,2,7,7,7,4,7,7,7,7,2,0,0,0,0,2],
            [2,0,0,0,0,2,2,2,2,3,2,2,2,2,2,0,0,0,0,2],
            [2,0,2,0,0,0,0,0,3,3,3,0,0,0,0,0,2,0,0,2],
            [2,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,2],
            [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        ],
        entities: [
            { type: 'note', x: 7, y: 4, id: 'house_note1',
              text: "Un diario polveroso: \"I rumori dal seminterrato sono diventati insopportabili. Qualcosa bussa da sotto...\"" },
            { type: 'note', x: 13, y: 5, id: 'house_note2',
              text: "Una foto sbiadita di una donna anziana. Sul retro: \"Nonna Maria, 1985\". Sorride, ma i suoi occhi sembrano tristi." },
            { type: 'key', x: 12, y: 8, id: 'house_key',
              text: "Hai trovato una vecchia chiave arrugginita!" },
        ],
        transitions: [
            { x: 9, y: 10, to: 'forest', toX: 8, toY: 8, needKey: false },
            { x: 9, y: 6, to: 'otherworld_hall', toX: 10, toY: 13, isTrap: true,
              dialogue: "La botola cede sotto i tuoi piedi! Cadi nel buio..." },
        ]
    },

    // LEVEL 3: Other World - Main Hall
    otherworld_hall: {
        width: 20,
        height: 15,
        darkness: 0.85,
        tint: { r: 30, g: 0, b: 20, a: 0.15 },
        playerStart: { x: 10, y: 13 },
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,9,9,9,9,1,9,9,9,4,9,9,9,1,9,9,9,9,9,1],
            [1,9,9,9,9,1,9,9,9,9,9,9,9,1,9,9,9,9,9,1],
            [1,9,9,9,9,1,9,9,9,9,9,9,9,1,9,9,9,9,9,1],
            [1,9,9,9,9,4,9,9,9,9,9,9,9,4,9,9,9,9,9,1],
            [1,1,1,1,1,1,9,9,9,9,9,9,9,1,1,1,1,1,1,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,1,1,1,1,1,9,9,9,9,9,9,9,1,1,1,1,1,1,1],
            [1,9,9,9,9,4,9,9,9,9,9,9,9,4,9,9,9,9,9,1],
            [1,9,9,9,9,1,9,9,9,9,9,9,9,1,9,9,9,9,9,1],
            [1,9,9,9,9,1,9,9,9,9,9,9,9,1,9,9,9,9,9,1],
            [1,9,9,9,9,1,9,9,9,9,9,9,9,1,9,9,9,9,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        entities: [
            { type: 'note', x: 10, y: 7, id: 'hall_note',
              text: "Scritto col sangue sul muro: \"Tre cristalli aprono la via. Rosso, Blu, Verde. Trovali nelle stanze.\"" },
            { type: 'shadow', x: 5, y: 7, id: 'shadow1', patrol: [{x:5,y:6},{x:5,y:8},{x:5,y:7}] },
            { type: 'shadow', x: 14, y: 7, id: 'shadow2', patrol: [{x:14,y:6},{x:14,y:8},{x:14,y:7}] },
        ],
        transitions: [
            // West room
            { x: 5, y: 4, to: 'otherworld_west', toX: 17, toY: 7 },
            { x: 5, y: 10, to: 'otherworld_west', toX: 17, toY: 7 },
            // East room
            { x: 13, y: 4, to: 'otherworld_east', toX: 1, toY: 7 },
            { x: 13, y: 10, to: 'otherworld_east', toX: 1, toY: 7 },
            // North - final room (needs 3 crystals)
            { x: 9, y: 1, to: 'otherworld_final', toX: 10, toY: 13, needCrystals: true },
        ]
    },

    // Other World - West Room (Puzzle: Levers)
    otherworld_west: {
        width: 20,
        height: 15,
        darkness: 0.9,
        tint: { r: 0, g: 0, b: 40, a: 0.15 },
        playerStart: { x: 17, y: 7 },
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1],
            [1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1],
            [1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1,1,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        entities: [
            { type: 'lever', x: 4, y: 2, id: 'lever1', on: false },
            { type: 'lever', x: 10, y: 2, id: 'lever2', on: false },
            { type: 'lever', x: 15, y: 2, id: 'lever3', on: false },
            { type: 'lever', x: 4, y: 12, id: 'lever4', on: false },
            { type: 'note', x: 10, y: 7, id: 'west_note',
              text: "\"Solo due delle quattro leve devono essere alzate. La prima e la terza dal lato sinistro.\"" },
            { type: 'crystal', x: 10, y: 6, id: 'crystal_blue', color: 'blue', hidden: true,
              text: "Hai trovato il Cristallo Blu!" },
            { type: 'shadow', x: 8, y: 5, id: 'shadow_w1', patrol: [{x:6,y:5},{x:12,y:5}] },
        ],
        transitions: [
            { x: 18, y: 7, to: 'otherworld_hall', toX: 6, toY: 7 },
        ]
    },

    // Other World - East Room (Puzzle: Pattern)
    otherworld_east: {
        width: 20,
        height: 15,
        darkness: 0.9,
        tint: { r: 40, g: 0, b: 0, a: 0.15 },
        playerStart: { x: 1, y: 7 },
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        entities: [
            // Floor tiles puzzle - step on them in the right order
            { type: 'floor_btn', x: 7,  y: 4,  id: 'fb1', order: 1, color: '#a33' },
            { type: 'floor_btn', x: 12, y: 4,  id: 'fb2', order: 2, color: '#3a3' },
            { type: 'floor_btn', x: 7,  y: 10, id: 'fb3', order: 3, color: '#33a' },
            { type: 'floor_btn', x: 12, y: 10, id: 'fb4', order: 4, color: '#aa3' },
            { type: 'note', x: 10, y: 7, id: 'east_note',
              text: "\"Rosso, Verde, Blu, Giallo. I colori del tramonto guidano il cammino.\"" },
            { type: 'crystal', x: 10, y: 2, id: 'crystal_red', color: 'red', hidden: true,
              text: "Hai trovato il Cristallo Rosso!" },
            { type: 'shadow', x: 15, y: 7, id: 'shadow_e1', patrol: [{x:14,y:3},{x:14,y:11}] },
        ],
        transitions: [
            { x: 0, y: 7, to: 'otherworld_hall', toX: 13, toY: 7 },
        ]
    },

    // Other World - Final Room
    otherworld_final: {
        width: 20,
        height: 15,
        darkness: 0.7,
        tint: { r: 20, g: 0, b: 30, a: 0.12 },
        playerStart: { x: 10, y: 13 },
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,1,1,1,9,9,9,9,9,1,1,1,9,9,9,9,1],
            [1,9,9,9,1,9,9,9,9,9,9,9,9,9,1,9,9,9,9,1],
            [1,9,9,9,1,9,9,9,9,9,9,9,9,9,1,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,1,9,9,9,9,9,9,9,9,9,1,9,9,9,9,1],
            [1,9,9,9,1,9,9,9,9,9,9,9,9,9,1,9,9,9,9,1],
            [1,9,9,9,1,1,1,9,9,9,9,9,1,1,1,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        entities: [
            { type: 'nonna', x: 9, y: 7, id: 'nonna' },
            { type: 'portal', x: 10, y: 2, id: 'exit_portal', hidden: true },
            { type: 'shadow', x: 3, y: 3, id: 'shadow_f1', patrol: [{x:2,y:2},{x:2,y:12},{x:17,y:12},{x:17,y:2}] },
            { type: 'shadow', x: 16, y: 11, id: 'shadow_f2', patrol: [{x:17,y:12},{x:17,y:2},{x:2,y:2},{x:2,y:12}] },
        ],
        transitions: [
            { x: 10, y: 2, to: 'victory', toX: 0, toY: 0, needPortal: true },
        ]
    },

    // Hidden room with green crystal
    otherworld_secret: {
        width: 20,
        height: 15,
        darkness: 0.95,
        tint: { r: 0, g: 30, b: 0, a: 0.2 },
        playerStart: { x: 10, y: 7 },
        tiles: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,4,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        entities: [
            { type: 'crystal', x: 10, y: 7, id: 'crystal_green', color: 'green',
              text: "Hai trovato il Cristallo Verde!" },
            { type: 'note', x: 10, y: 10, id: 'secret_note',
              text: "\"Questo e' il terzo cristallo. Ora puoi aprire la porta del Nord nella sala principale.\"" },
        ],
        transitions: [
            { x: 9, y: 7, to: 'otherworld_hall', toX: 10, toY: 7 },
        ]
    },
};

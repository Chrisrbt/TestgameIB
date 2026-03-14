// ============================================
// ENTITIES - NPCs, enemies, items
// ============================================

const Entities = {
    // Draw entity based on type
    draw(entity, frame) {
        switch (entity.type) {
            case 'note':
                if (!entity.collected) {
                    Renderer.drawTile(entity.x, entity.y, TileSprites.note());
                }
                break;
            case 'key':
                if (!entity.collected) {
                    Renderer.drawTile(entity.x, entity.y, TileSprites.key());
                }
                break;
            case 'crystal':
                if (!entity.collected && !entity.hidden) {
                    Renderer.drawTile(entity.x, entity.y, TileSprites.crystal(entity.color));
                    // Glow effect
                    const glowColor = entity.color === 'blue' ? '40,80,255'
                        : entity.color === 'red' ? '255,40,40' : '40,255,40';
                    const alpha = 0.15 + Math.sin(frame * 0.1) * 0.1;
                    Renderer.ctx.fillStyle = `rgba(${glowColor},${alpha})`;
                    Renderer.ctx.fillRect(
                        entity.x * TILE - 4, entity.y * TILE - 4,
                        TILE + 8, TILE + 8
                    );
                }
                break;
            case 'lever':
                Renderer.drawTile(entity.x, entity.y, TileSprites.lever(entity.on));
                break;
            case 'floor_btn':
                const brightness = entity.pressed ? 1.0 : 0.4;
                const c = entity.color;
                Renderer.ctx.fillStyle = c;
                Renderer.ctx.globalAlpha = brightness;
                Renderer.ctx.fillRect(
                    entity.x * TILE + 4, entity.y * TILE + 4,
                    TILE - 8, TILE - 8
                );
                Renderer.ctx.globalAlpha = 1.0;
                Renderer.ctx.strokeStyle = '#fff';
                Renderer.ctx.lineWidth = 1;
                Renderer.ctx.strokeRect(
                    entity.x * TILE + 4, entity.y * TILE + 4,
                    TILE - 8, TILE - 8
                );
                break;
            case 'shadow':
                Renderer.drawSprite(entity.x, entity.y, ShadowSprite, frame);
                // Red glow
                const sa = 0.08 + Math.sin(frame * 0.15) * 0.05;
                Renderer.ctx.fillStyle = `rgba(200,0,0,${sa})`;
                Renderer.ctx.fillRect(
                    entity.x * TILE - 8, entity.y * TILE - 8,
                    TILE + 16, TILE + 16
                );
                break;
            case 'nonna':
                Renderer.drawTile(entity.x, entity.y, TileSprites.nonna());
                break;
            case 'portal':
                if (!entity.hidden) {
                    Renderer.drawTile(entity.x, entity.y, TileSprites.portal(frame));
                    // Portal glow
                    const pa = 0.1 + Math.sin(frame * 0.08) * 0.08;
                    Renderer.ctx.fillStyle = `rgba(100,50,200,${pa})`;
                    Renderer.ctx.fillRect(
                        entity.x * TILE - 8, entity.y * TILE - 8,
                        TILE + 16, TILE + 16
                    );
                }
                break;
        }
    },

    // Update entity (AI, movement)
    update(entity, frame, playerX, playerY) {
        if (entity.type === 'shadow' && entity.patrol) {
            // Move along patrol path
            if (frame % 30 === 0) {
                if (!entity.patrolIdx) entity.patrolIdx = 0;
                const target = entity.patrol[entity.patrolIdx];
                if (entity.x < target.x) entity.x++;
                else if (entity.x > target.x) entity.x--;
                else if (entity.y < target.y) entity.y++;
                else if (entity.y > target.y) entity.y--;
                else {
                    entity.patrolIdx = (entity.patrolIdx + 1) % entity.patrol.length;
                }
            }

            // Chase player if close
            const d = dist(entity, { x: playerX, y: playerY });
            if (d <= 3 && frame % 15 === 0) {
                if (entity.x < playerX) entity.x++;
                else if (entity.x > playerX) entity.x--;
                if (entity.y < playerY) entity.y++;
                else if (entity.y > playerY) entity.y--;
            }
        }
    },

    // Check collision with player
    checkCollision(entity, px, py) {
        return entity.x === px && entity.y === py;
    }
};

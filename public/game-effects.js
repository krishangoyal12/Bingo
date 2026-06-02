/**
 * game-effects.js
 * ================
 * Standalone visual effects engine for game win / lose / tie states.
 * Zero dependencies — drop in any HTML project.
 *
 * Public API:
 *   GameEffects.win()   → confetti burst + golden screen flash
 *   GameEffects.lose()  → grey rain + screen shake + dark flash
 *   GameEffects.tie()   → gentle mixed confetti + neutral flash
 *   GameEffects.clear() → remove all active effects immediately
 *
 * z-index stack: effects layer = 160 (sits between confetti layer 150
 * and the winner overlay 200 so particles appear behind the overlay card).
 */

window.GameEffects = (() => {
    'use strict';

    // ── Palette ───────────────────────────────────────────────────────────────
    const WIN_COLORS  = ['#FF5252','#FF6D00','#FFD740','#69F0AE','#40C4FF','#E040FB','#FF4081','#CCFF90','#18FFFF','#FF6E40'];
    const TIE_COLORS  = ['#90A4AE','#FFD740','#80CBC4','#CE93D8','#FFCC80','#A5D6A7'];
    const RAIN_COLORS = ['#607D8B','#90A4AE','#78909C','#546E7A','#B0BEC5'];
    const SHAPES      = ['rect', 'circle', 'strip', 'star'];

    // ── Internal state ────────────────────────────────────────────────────────
    let particles = [];
    let rafId     = null;
    let effectsEl = null;
    let flashEl   = null;
    let shaking   = false;

    // ── DOM helpers ───────────────────────────────────────────────────────────
    function getLayer() {
        if (effectsEl && document.body.contains(effectsEl)) return effectsEl;
        effectsEl = document.createElement('div');
        effectsEl.id = 'game-effects-layer';
        Object.assign(effectsEl.style, {
            position: 'fixed', inset: '0',
            pointerEvents: 'none',
            zIndex: '160',          // below overlay (200), above game panels
            overflow: 'hidden',
        });
        document.body.appendChild(effectsEl);
        return effectsEl;
    }

    function rand(min, max) { return min + Math.random() * (max - min); }

    // ── Particle factory ──────────────────────────────────────────────────────
    function makeParticle(x, y, vx, vy, color, shape) {
        const el = document.createElement('div');
        const isStar   = shape === 'star';
        const isCircle = shape === 'circle';
        const isStrip  = shape === 'strip';
        const size     = rand(7, 15);

        if (isStar) {
            Object.assign(el.style, {
                position: 'absolute', left: x + 'px', top: y + 'px',
                color, background: 'transparent',
                fontSize: (size + 4) + 'px', lineHeight: '1',
                willChange: 'transform, opacity',
            });
            el.textContent = '★';
        } else {
            Object.assign(el.style, {
                position: 'absolute', left: x + 'px', top: y + 'px',
                width:  (isStrip ? rand(3, 5) : size) + 'px',
                height: (isStrip ? rand(14, 24) : size) + 'px',
                background: color,
                borderRadius: isCircle ? '50%' : '2px',
                willChange: 'transform, opacity',
            });
        }

        getLayer().appendChild(el);

        return {
            el, x, y, vx, vy,
            gravity:   rand(0.12, 0.28),
            rot:       rand(0, 360),
            rotSpeed:  rand(-9, 9),
            opacity:   1,
            fadeAt:    rand(0.5, 0.72),
            life:      0,
            maxLife:   rand(110, 220),
        };
    }

    // ── Animation loop ────────────────────────────────────────────────────────
    function tick() {
        const dead = [];

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.life++;
            p.vx *= 0.985;
            p.vy += p.gravity;
            p.x  += p.vx;
            p.y  += p.vy;
            p.rot += p.rotSpeed;

            const ratio = p.life / p.maxLife;
            if (ratio > p.fadeAt) {
                p.opacity = 1 - (ratio - p.fadeAt) / (1 - p.fadeAt);
            }

            const ox = p.x - parseFloat(p.el.style.left);
            const oy = p.y - parseFloat(p.el.style.top);
            p.el.style.transform = `translate(${ox}px,${oy}px) rotate(${p.rot}deg)`;
            p.el.style.opacity   = p.opacity;

            if (p.life >= p.maxLife || p.y > window.innerHeight + 100) {
                dead.push(i);
            }
        }

        // Remove dead (reverse so splice indices stay valid)
        for (let i = dead.length - 1; i >= 0; i--) {
            particles[dead[i]].el.remove();
            particles.splice(dead[i], 1);
        }

        rafId = particles.length > 0 ? requestAnimationFrame(tick) : null;
    }

    function addParticle(p) {
        particles.push(p);
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    // ── Burst helper ──────────────────────────────────────────────────────────
    function burst(cx, cy, count, speedMin, speedMax, palette) {
        for (let i = 0; i < count; i++) {
            const angle  = rand(0, Math.PI * 2);
            const speed  = rand(speedMin, speedMax);
            const color  = palette[Math.floor(rand(0, palette.length))];
            const shape  = SHAPES[Math.floor(rand(0, SHAPES.length))];
            addParticle(makeParticle(
                cx, cy,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - rand(2, 7),
                color, shape
            ));
        }
    }

    // ── Screen flash ─────────────────────────────────────────────────────────
    function flash(color, duration) {
        if (flashEl) flashEl.remove();
        flashEl = document.createElement('div');
        Object.assign(flashEl.style, {
            position: 'fixed', inset: '0',
            background: color, opacity: '0.38',
            pointerEvents: 'none',
            zIndex: '159',
            transition: `opacity ${duration}ms ease`,
        });
        document.body.appendChild(flashEl);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (flashEl) flashEl.style.opacity = '0';
            setTimeout(() => { flashEl?.remove(); flashEl = null; }, duration + 60);
        }));
    }

    // ── Screen shake ─────────────────────────────────────────────────────────
    function shake(intensity, duration) {
        if (shaking) return;
        shaking = true;
        const root  = document.querySelector('.app') || document.body;
        const start = performance.now();
        (function loop(now) {
            const t = (now - start) / duration;
            if (t >= 1) { root.style.transform = ''; shaking = false; return; }
            const decay = 1 - t;
            root.style.transform = `translate(${(rand(0,1)-0.5)*intensity*2*decay}px,${(rand(0,1)-0.5)*intensity*decay}px)`;
            requestAnimationFrame(loop);
        })(performance.now());
    }

    // ── Rain (lose) ───────────────────────────────────────────────────────────
    function rain(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const p = makeParticle(
                    rand(0, window.innerWidth), rand(-30, -5),
                    rand(-0.4, 0.4), rand(3, 8),
                    RAIN_COLORS[Math.floor(rand(0, RAIN_COLORS.length))], 'strip'
                );
                p.gravity  = 0.04;
                p.maxLife  = rand(70, 130);
                p.rotSpeed = rand(-2, 2);
                addParticle(p);
            }, i * rand(8, 45));
        }
    }

    // ═════════════════════════ Public API ════════════════════════════════════

    /**
     * Call on WIN — multi-wave confetti + golden flash.
     */
    function win() {
        clear();
        flash('#FFD740', 500);

        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;

        // Wave 1: centre burst
        burst(cx, cy, 65, 5, 16, WIN_COLORS);

        // Wave 2: corner cannons
        setTimeout(() => {
            [[0, 0], [window.innerWidth, 0],
             [0, window.innerHeight * 0.5], [window.innerWidth, window.innerHeight * 0.5]]
            .forEach(([x, y]) => burst(x, y, 22, 3, 11, WIN_COLORS));
        }, 350);

        // Wave 3: top-down shower
        setTimeout(() => {
            for (let i = 0; i < 55; i++) {
                const p = makeParticle(
                    rand(0, window.innerWidth), rand(-60, -10),
                    rand(-1.5, 1.5), rand(2, 6),
                    WIN_COLORS[Math.floor(rand(0, WIN_COLORS.length))],
                    SHAPES[Math.floor(rand(0, SHAPES.length))]
                );
                p.gravity = 0.10;
                p.maxLife = rand(160, 260);
                addParticle(p);
            }
        }, 750);
    }

    /**
     * Call on LOSE — grey rain + screen shake + dark flash.
     */
    function lose() {
        clear();
        flash('#263238', 650);
        shake(6, 480);
        rain(70);
    }

    /**
     * Call on TIE — gentle mixed confetti + neutral flash.
     */
    function tie() {
        clear();
        flash('#78909C', 450);
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        burst(cx, cy, 42, 3, 9, TIE_COLORS);
        setTimeout(() => burst(cx, cy, 22, 2, 6, TIE_COLORS), 350);
    }

    /**
     * Remove all active effects immediately.
     */
    function clear() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        particles.forEach(p => p.el?.remove());
        particles = [];
        flashEl?.remove(); flashEl = null;
        // Remove the layer element so it's cleanly recreated next time
        effectsEl?.remove(); effectsEl = null;
    }

    return { win, lose, tie, clear };
})();

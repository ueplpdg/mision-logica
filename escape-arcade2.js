// Sala Arcade 2 · Flappy, Breakout, Pong, Wordle, Deslizante, Tuberías, Intruso y KenKen (cooperativos J1/J2).
(function () {
  function make(React, U) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const { div, P, B, Tag, Ctrls, Stat, Box, Wrap, useKeys, useDual, Dual, useOnce } = U, { J1, J2, OK, ER, TX, MU, BG, LN, MONO, HEAD } = U.C;
    const GOLD = '#ffd166';
    const useTick = () => { const [, s] = useState(0); return () => s(x => x + 1); };
    const Pant = (st, ...ch) => div(Object.assign({ position: 'relative', background: '#05080c', border: '4px solid #26343e', borderRadius: 14, overflow: 'hidden', boxShadow: 'inset 0 0 30px rgba(95,208,232,.12)' }, st), ...ch);
    const loop = (fn, ms) => useEffect(() => { const t = setInterval(() => { if (!window.__escPausa) fn(); }, ms); return () => clearInterval(t); }, []);
    function Sel(n, onOk, p, off) { const [c1, setC1] = useState(0), [c2, setC2] = useState(0); const dual = useDual(() => { if (off) return; if (c1 !== c2) { p.onErr('Marquen los dos la misma opción.', 0); return; } onOk(c1); });
      useKeys((c, dn) => { if (!dn || p.fin || off) return; if (c === 'KeyA') setC1((c1 + n - 1) % n); if (c === 'KeyD') setC1((c1 + 1) % n); if (c === 'ArrowLeft') setC2((c2 + n - 1) % n); if (c === 'ArrowRight') setC2((c2 + 1) % n); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return { c1, c2, set: i => { setC1(i); setC2(i); }, dual, reset: () => { setC1(0); setC2(0); } }; }
    const marcas = (i, A) => div({ display: 'flex', gap: 4 }, div({ width: 12, height: 12, background: A.c1 === i ? J1 : 'transparent', border: '2px solid ' + J1 }), div({ width: 12, height: 12, background: A.c2 === i ? J2 : 'transparent', border: '2px solid ' + J2 }));

    // ---------- FLAPPY DE CONDICIONES ----------
    function expr(T, H, val) { for (let k = 0; k < 60; k++) { const a = H.int(1, 12), b = H.int(1, 12); let s, v;
        if (T === 1) { const op = H.pick(['>', '<', '=']); s = a + ' ' + op + ' ' + b; v = op === '>' ? a > b : op === '<' ? a < b : a === b; }
        else if (T === 2) { const op = H.pick(['+', '×']), r = op === '+' ? a + b : a * b, c = H.pick([r, r + H.int(1, 3), r - H.int(1, 3)]); s = a + ' ' + op + ' ' + b + ' = ' + c; v = c === r; }
        else { const p1 = a > b, p2 = (a + b) % 2 === 0, op = H.pick(['&&', '||']); s = '(' + a + ' > ' + b + ') ' + op + ' (' + (a + b) + ' es par)'; v = op === '&&' ? p1 && p2 : p1 || p2; }
        if (v === val) return s; } return val ? '1 = 1' : '1 = 2'; }
    function Flappy(p) {
      const T = p.tier, fin = useOnce(p), meta = [5, 7, 9][T - 1], draw = useTick(), g = useRef(null);
      const gate = () => { const ok = p.h.int(0, 1); return { x: 110, ok, t: [expr(T, p.h, ok === 0), expr(T, p.h, ok === 1)] }; };
      if (!g.current) g.current = { y: 50, vy: 0, gate: gate(), pas: 0, vidas: 3, end: false, msg: '' };
      loop(() => { const s = g.current; if (s.end || p.fin) return; s.vy = Math.min(3.2, s.vy + 0.22); s.y += s.vy; if (s.y < 2) { s.y = 2; s.vy = 0; } if (s.y > 98) { s.y = 98; s.vy = 0; }
        const px = s.gate.x; s.gate.x -= [0.55, 0.65, 0.75][T - 1];
        if (px > 22 && s.gate.x <= 22) { const lane = s.y >= 8 && s.y <= 42 ? 0 : s.y >= 58 && s.y <= 92 ? 1 : -1;
          if (lane === s.gate.ok) { s.pas++; p.snd('ok'); s.msg = '✓ ' + s.gate.t[lane] + ' es verdadero'; if (s.pas >= meta) { s.end = true; fin(true, s.vidas === 3 ? 1 : 0.75, 'Cruzaron ' + meta + ' puertas verdaderas. Evaluar condiciones rápido es pensar como un if.'); } }
          else { s.vidas--; p.snd('err'); s.msg = lane < 0 ? '✗ Chocaron con la pared' : '✗ ' + s.gate.t[lane] + ' es falso'; if (s.vidas <= 0) { s.end = true; fin(false, 0, 'Se acabaron las vidas con ' + s.pas + ' de ' + meta + '. Lean las dos condiciones antes de llegar.'); } } }
        if (s.gate.x < -12) s.gate = gate(); draw(); }, 30);
      useKeys((c, dn) => { if (dn && (c === 'KeyW' || c === 'ArrowUp' || c === 'Space')) g.current.vy = -3.4; });
      const s = g.current, W = 560, H = 320, y = v => v / 100 * H, x = v => v / 100 * W;
      return Wrap(P(['Pasen solo por la puerta cuya condición es ', B('verdadera'), '. Cualquiera de los dos aletea (J1 W · J2 ↑): repártanse quién mira arriba y quién abajo.']), Ctrls(Tag(1, 'W aletear'), Tag(2, '↑ aletear')),
        div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('PUERTAS ' + s.pas + ' / ' + meta, OK), Stat('VIDAS ' + '♥'.repeat(Math.max(0, s.vidas)), ER), s.msg ? Stat(s.msg, s.msg[0] === '✓' ? OK : ER) : null),
        Pant({ width: W, maxWidth: '100%', height: H, background: 'linear-gradient(#0b2a3d,#05080c)' },
          div({ position: 'absolute', left: x(s.gate.x) - 14, top: 0, width: 28, height: y(8), background: '#3fd0b8' }), div({ position: 'absolute', left: x(s.gate.x) - 14, top: y(42), width: 28, height: y(16), background: '#3fd0b8' }), div({ position: 'absolute', left: x(s.gate.x) - 14, top: y(92), width: 28, height: y(8), background: '#3fd0b8' }),
          ...[0, 1].map(k => div({ key: k, position: 'absolute', left: Math.min(W - 230, x(s.gate.x) + 22), top: y(k ? 68 : 18), background: 'rgba(5,9,14,.85)', border: '1px solid ' + GOLD, color: TX, fontFamily: MONO, fontSize: 15, fontWeight: 700, padding: '4px 8px', whiteSpace: 'nowrap' }, s.gate.t[k])),
          div({ position: 'absolute', left: x(22) - 14, top: y(s.y) - 12, width: 28, height: 24, borderRadius: '50%', background: GOLD, boxShadow: '0 0 12px ' + GOLD })));
    }

    // ---------- BREAKOUT DE FRACCIONES ----------
    const FR = [[1, 2], [1, 3], [1, 4], [1, 6], [2, 3], [3, 4], [1, 8], [3, 8]];
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    function Breakout(p) {
      const T = p.tier, fin = useOnce(p), meta = [2, 3, 4][T - 1], draw = useTick(), g = useRef(null);
      if (!g.current) { const br = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { const f = p.h.pick(T === 1 ? FR.slice(0, 3) : FR); br.push({ x: c * 12.5, y: 8 + r * 7, f, vivo: true }); } g.current = { px: 50, bx: 50, by: 80, vx: 0.9, vy: -1.1, br, n: 0, d: 1, vidas: 3, end: false, ult: '' }; }
      loop(() => { const s = g.current; if (s.end || p.fin) return; s.bx += s.vx; s.by += s.vy; if (s.bx < 1 || s.bx > 99) s.vx *= -1; if (s.by < 1) s.vy = Math.abs(s.vy);
        if (s.by > 92 && s.by < 96 && Math.abs(s.bx - s.px) < 10) { s.vy = -Math.abs(s.vy); s.vx = (s.bx - s.px) / 7; }
        if (s.by > 100) { s.vidas--; p.snd('err'); s.bx = s.px; s.by = 80; s.vy = -1.1; if (s.vidas <= 0) { s.end = true; fin(false, 0, 'Se acabaron las vidas. Sumaron ' + s.n + '/' + s.d + '.'); } }
        for (const b of s.br) if (b.vivo && s.bx > b.x && s.bx < b.x + 12.5 && s.by > b.y && s.by < b.y + 6) { b.vivo = false; s.vy *= -1; const n = s.n * b.f[1] + b.f[0] * s.d, d = s.d * b.f[1], gg = gcd(n, d); s.n = n / gg; s.d = d / gg; s.ult = '+ ' + b.f[0] + '/' + b.f[1]; p.snd('click');
          if (s.n / s.d >= meta) { s.end = true; fin(true, s.vidas === 3 ? 1 : 0.75, 'Juntaron ' + s.n + '/' + s.d + ' ≥ ' + meta + ' enteros. Sumar fracciones = buscar el denominador común.'); } break; }
        if (s.br.every(b => !b.vivo) && !s.end) { s.br.forEach(b => { b.vivo = true; }); } draw(); }, 22);
      useKeys((c, dn) => { const s = g.current; if (!dn) return; if (c === 'KeyA' || c === 'ArrowLeft') s.px = Math.max(9, s.px - 6); if (c === 'KeyD' || c === 'ArrowRight') s.px = Math.min(91, s.px + 6); });
      const s = g.current, W = 560, H = 340, X = v => v / 100 * W, Y = v => v / 100 * H;
      return Wrap(P(['Breakout de fracciones: cada bloque suma su fracción. Junten ', B(meta + ' enteros'), '. Los dos mueven la paleta (J1 A · D, J2 ← · →).']), div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('SUMA ' + s.n + '/' + s.d + ' = ' + (s.n / s.d).toFixed(2), OK), Stat('META ' + meta, GOLD), Stat('VIDAS ' + '♥'.repeat(Math.max(0, s.vidas)), ER), s.ult ? Stat(s.ult, J1) : null),
        Pant({ width: W, maxWidth: '100%', height: H }, ...s.br.filter(b => b.vivo).map((b, i) => div({ key: i, position: 'absolute', left: X(b.x) + 2, top: Y(b.y), width: X(12.5) - 4, height: Y(6) - 3, background: ['#ff7b72', '#f0a726', '#ffd166', '#7fe0a0'][Math.floor((b.y - 8) / 7)], color: '#081018', fontFamily: HEAD, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }, b.f[0] + '/' + b.f[1])),
          div({ position: 'absolute', left: X(s.px - 10), top: Y(93), width: X(20), height: 10, background: J1, borderRadius: 5, boxShadow: '0 0 10px ' + J1 }), div({ position: 'absolute', left: X(s.bx) - 6, top: Y(s.by) - 6, width: 12, height: 12, borderRadius: '50%', background: '#fff' })));
    }

    // ---------- PONG CON PREGUNTAS ----------
    function Pong(p) {
      const T = p.tier, fin = useOnce(p), meta = 5, draw = useTick(), g = useRef(null), kr = useRef({});
      const preg = () => { const a = p.h.int(2, 9 + T * 3), b = p.h.int(2, 9), op = T === 1 ? '+' : p.h.pick(['+', '×', '−']), r = op === '+' ? a + b : op === '×' ? a * b : a - b; const o = p.h.shuffle([r, r + p.h.int(1, 4), r - p.h.int(1, 4)]); return { t: a + ' ' + op + ' ' + b, o, a: o.indexOf(r) }; };
      if (!g.current) g.current = { py: 50, ay: 50, bx: 50, by: 50, vx: 1.1, vy: 0.7, yo: 0, el: 0, q: null, end: false, vel: 1 };
      loop(() => { const s = g.current; if (s.end || p.fin || s.q) return; const k = kr.current; if (k.KeyW) s.py = Math.max(10, s.py - 2.4); if (k.ArrowDown) s.py = Math.min(90, s.py + 2.4);
        s.ay += Math.sign(s.by - s.ay) * Math.min(Math.abs(s.by - s.ay), [0.9, 1.15, 1.4][T - 1]); s.bx += s.vx * s.vel; s.by += s.vy * s.vel; if (s.by < 2 || s.by > 98) s.vy *= -1;
        if (s.bx < 6 && Math.abs(s.by - s.py) < 11 && s.vx < 0) { s.vx = Math.abs(s.vx) * 1.04; s.vy = (s.by - s.py) / 8; p.snd('click'); } if (s.bx > 94 && Math.abs(s.by - s.ay) < 11 && s.vx > 0) { s.vx = -Math.abs(s.vx); s.vy = (s.by - s.ay) / 8; }
        const punto = q => { if (q) s.yo++; else s.el++; p.snd(q ? 'ok' : 'err'); s.bx = 50; s.by = 50; s.vx = (q ? -1 : 1) * 1.1; if (s.yo >= meta) { s.end = true; fin(true, s.el <= 1 ? 1 : s.el <= 3 ? 0.75 : 0.5, 'Ganaron ' + s.yo + ' a ' + s.el + '.'); return; } if (s.el >= meta) { s.end = true; fin(false, 0, 'Perdieron ' + s.yo + ' a ' + s.el + '. Coordinen: uno sube y otro baja.'); return; } s.q = preg(); };
        if (s.bx < 0) punto(false); if (s.bx > 100) punto(true); draw(); }, 22);
      const s = g.current, A = Sel(3, i => { const ok = i === s.q.a; s.vel = ok ? 0.85 : 1.25; p.snd(ok ? 'ok' : 'err'); s.q = null; A.reset(); draw(); }, p, !s.q);
      useKeys((c, dn) => { kr.current[c] = !!dn; });
      const W = 560, H = 320, X = v => v / 100 * W, Y = v => v / 100 * H;
      return Wrap(P(['Pong contra la máquina: ', B('J1 sube la paleta (W)'), ' y ', B('J2 la baja (↓)'), '. Después de cada punto, una pregunta rápida: si aciertan, la pelota va más lenta.']), div({ display: 'flex', gap: 16 }, Stat('USTEDES ' + s.yo, OK), Stat('MÁQUINA ' + s.el, ER), Stat('PRIMERO A ' + meta)),
        s.q ? Box({ border: '2px solid ' + GOLD, display: 'flex', flexDirection: 'column', gap: 10 }, div({ fontFamily: HEAD, fontSize: 28, color: TX }, s.q.t + ' = ?'), div({ display: 'flex', gap: 10, flexWrap: 'wrap' }, ...s.q.o.map((o, i) => h('button', { key: i, onClick: () => A.set(i), style: { display: 'flex', gap: 10, alignItems: 'center', padding: '12px 18px', background: BG, color: TX, border: '2px solid ' + LN, fontFamily: HEAD, fontSize: 22, cursor: 'pointer' } }, marcas(i, A), String(o)))), Dual(A.dual, 'J1 A·D · J2 ←·→ · E + ENTER')) :
        Pant({ width: W, maxWidth: '100%', height: H }, div({ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '2px dashed #26343e' }), div({ position: 'absolute', left: X(3), top: Y(s.py - 11), width: 10, height: Y(22), background: J1, boxShadow: '0 0 10px ' + J1 }), div({ position: 'absolute', left: X(95), top: Y(s.ay - 11), width: 10, height: Y(22), background: ER }), div({ position: 'absolute', left: X(s.bx) - 7, top: Y(s.by) - 7, width: 14, height: 14, background: '#fff', borderRadius: 3 })));
    }

    // ---------- WORDLE DE ROBÓTICA ----------
    const PAL = [['SERVO', 'Motor que gira a un ángulo exacto'], ['MOTOR', 'Convierte electricidad en movimiento'], ['PLACA', 'Tarjeta de circuito como el Arduino'], ['DIODO', 'Deja pasar la corriente en un solo sentido'], ['CABLE', 'Conecta los componentes'], ['RUEDA', 'Hace avanzar al robot'], ['BOTON', 'Entrada que se presiona'], ['SONAR', 'Mide distancias con sonido'], ['BUCLE', 'Instrucciones que se repiten'], ['DATOS', 'Lo que guarda una variable'], ['PILAS', 'Dan energía sin enchufe'], ['CHIPS', 'Circuitos integrados'], ['LASER', 'Luz muy concentrada'], ['RADIO', 'Comunicación sin cables'], ['LOGICO', '']].filter(x => x[0].length === 5);
    function Wordle(p) {
      const T = p.tier, fin = useOnce(p), [w] = useState(() => p.h.pick(PAL)), max = [6, 6, 5][T - 1], [tries, setTries] = useState([]), [cur, setCur] = useState('');
      const col = (g, i) => g[i] === w[0][i] ? OK : w[0].includes(g[i]) ? GOLD : '#3a4650';
      const enviar = () => { if (cur.length !== 5) { p.onErr('La palabra debe tener 5 letras.', 0); return; } const nt = tries.concat([cur]); setTries(nt); setCur('');
        if (cur === w[0]) { p.snd('ok'); fin(true, nt.length <= 3 ? 1 : nt.length <= 5 ? 0.75 : 0.5, '¡Era ' + w[0] + '! La encontraron en ' + nt.length + ' intentos usando las pistas de colores.'); } else if (nt.length >= max) fin(false, 0, 'La palabra era ' + w[0] + '. Usen las letras amarillas en otra posición.'); else p.snd('click'); };
      useKeys((c, dn, e) => { if (!dn || p.fin) return; const ch = e && e.key && e.key.length === 1 ? e.key.toUpperCase() : null; if (ch && /[A-Z]/.test(ch) && cur.length < 5) setCur(cur + ch); if (c === 'Backspace') setCur(cur.slice(0, -1)); if (c === 'Enter') enviar(); });
      const fila = (g, done) => div({ display: 'flex', gap: 6 }, ...[0, 1, 2, 3, 4].map(i => div({ key: i, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 28, color: '#fff', background: done ? col(g, i) : '#0e1820', border: '2px solid ' + (done ? 'transparent' : g[i] ? '#9fb6c0' : '#26343e') }, g[i] || '')));
      return Wrap(P(['Adivinen la palabra de Robótica de 5 letras en ', B(max + ' intentos'), '. Escriban con el teclado y pulsen ENTER. ', B('Verde'), ': letra en su lugar. ', B('Amarilla'), ': está, pero en otro lugar.']),
        T === 1 ? Box({ border: '2px solid ' + GOLD }, P([B('Pista: '), w[1]])) : null,
        div({ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }, ...tries.map((g, i) => h('div', { key: i }, fila(g, true))), tries.length < max ? fila(cur, false) : null, ...[...Array(Math.max(0, max - tries.length - 1))].map((_, i) => h('div', { key: 'v' + i }, fila('', false)))));
    }

    // ---------- ROMPECABEZAS DESLIZANTE ----------
    function Deslizante(p) {
      const T = p.tier, fin = useOnce(p), N = T === 3 ? 4 : 3, prof = [18, 40, 70][T - 1];
      const [b, setB] = useState(() => { let a = [...Array(N * N).keys()], z = N * N - 1, prev = -1; for (let k = 0; k < prof; k++) { const x = z % N, y = Math.floor(z / N), op = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([q, w]) => q >= 0 && w >= 0 && q < N && w < N).map(([q, w]) => w * N + q).filter(i => i !== prev); const n = p.h.pick(op); a[z] = a[n]; a[n] = N * N - 1; prev = z; z = n; } return a; }), [mv, setMv] = useState(0);
      const z = b.indexOf(N * N - 1);
      const tocar = i => { if (p.fin) return; const x = i % N, y = Math.floor(i / N), zx = z % N, zy = Math.floor(z / N); if (Math.abs(x - zx) + Math.abs(y - zy) !== 1) return; const nb = b.slice(); nb[z] = nb[i]; nb[i] = N * N - 1; setB(nb); setMv(mv + 1); p.snd('click'); if (nb.every((v, k) => v === k)) { p.snd('ok'); fin(true, mv + 1 <= prof * 1.3 ? 1 : 0.75, 'Armaron la foto del colegio en ' + (mv + 1) + ' movimientos.'); } };
      useKeys((c, dn) => { if (!dn) return; const zx = z % N, zy = Math.floor(z / N); if (c === 'KeyA' && zx < N - 1) tocar(z + 1); if (c === 'KeyD' && zx > 0) tocar(z - 1); if (c === 'ArrowUp' && zy < N - 1) tocar(z + N); if (c === 'ArrowDown' && zy > 0) tocar(z - N); });
      const S = Math.floor(360 / N);
      return Wrap(P(['Armen la foto del colegio. ', B('J1 mueve las piezas a los lados'), ' (A · D) y ', B('J2 arriba y abajo'), ' (↑ · ↓). También con clic.']), div({ display: 'flex', gap: 16 }, Stat('MOVIMIENTOS ' + mv), Stat('PIEZAS EN SU LUGAR ' + b.filter((v, k) => v === k && v !== N * N - 1).length + ' / ' + (N * N - 1), OK)),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),max-content))', gap: 16, alignItems: 'start', justifyContent: 'center' },
          div({ display: 'grid', gridTemplateColumns: 'repeat(' + N + ',' + S + 'px)', gap: 2, background: '#26343e', padding: 2 }, ...b.map((v, i) => h('button', { key: i, onClick: () => tocar(i), style: { width: S, height: S, border: 'none', padding: 0, cursor: 'pointer', background: v === N * N - 1 ? '#05080c' : 'url(./colegio.png)', backgroundSize: (S * N) + 'px ' + (S * N) + 'px', backgroundPosition: (-(v % N) * S) + 'px ' + (-Math.floor(v / N) * S) + 'px', position: 'relative' } }, v === N * N - 1 ? null : h('span', { style: { position: 'absolute', left: 4, top: 2, fontFamily: HEAD, fontSize: 14, color: '#fff', textShadow: '0 0 3px #000' } }, String(v + 1))))),
          div({ width: 160, height: 160, backgroundImage: 'url(./colegio.png)', backgroundSize: '160px 160px', border: '2px solid ' + LN })));
    }

    // ---------- TUBERÍAS DEL RIEGO ----------
    const rotM = m => ((m << 1) | (m >> 3)) & 15, DD = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]];
    function Tuberias(p) {
      const T = p.tier, fin = useOnce(p), N = [4, 5, 6][T - 1];
      const [st] = useState(() => { for (let it = 0; it < 300; it++) { const path = [[0, 0]], seen = { '0,0': 1 }; let ok = false; for (let k = 0; k < 60; k++) { const [x, y] = path[path.length - 1]; if (x === N - 1 && y === N - 1) { ok = true; break; } const op = p.h.shuffle(DD).map(d => [x + d[0], y + d[1]]).filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && !seen[a + ',' + b]); if (!op.length) break; const n = op[0]; seen[n[0] + ',' + n[1]] = 1; path.push(n); }
          if (!ok || path.length < N * 1.5) continue; const m = Array(N * N).fill(0); path.forEach(([x, y], i) => { const id = y * N + x; if (i === 0) m[id] |= 8; if (i === path.length - 1) m[id] |= 2; [path[i - 1], path[i + 1]].forEach(q => { if (!q) return; const d = DD.find(d => x + d[0] === q[0] && y + d[1] === q[1]); m[id] |= d[2]; }); });
          for (let i = 0; i < N * N; i++) if (!m[i]) m[i] = p.h.pick([5, 10, 3, 6, 12, 9]); const r = m.map(v => { let q = v; for (let k = p.h.int(1, 3); k > 0; k--) q = rotM(q); return q; }); return r; } return Array(N * N).fill(5); });
      const [b, setB] = useState(st), [c1, setC1] = useState(0), [c2, setC2] = useState(N * N - 1), [gir, setGir] = useState(0);
      const flujo = bb => { const v = {}, q = []; if (bb[0] & 8) { q.push(0); v[0] = 1; } while (q.length) { const i = q.shift(), x = i % N, y = Math.floor(i / N); DD.forEach(([dx, dy, a, o]) => { const nx = x + dx, ny = y + dy, j = ny * N + nx; if ((bb[i] & a) && nx >= 0 && ny >= 0 && nx < N && ny < N && (bb[j] & o) && !v[j]) { v[j] = 1; q.push(j); } }); } return v; };
      const F = flujo(b), llega = F[N * N - 1] && (b[N * N - 1] & 2);
      const girar = i => { if (p.fin) return; const nb = b.slice(); nb[i] = rotM(nb[i]); setB(nb); setGir(gir + 1); p.snd('click'); const f = flujo(nb); if (f[N * N - 1] && (nb[N * N - 1] & 2)) { p.snd('ok'); fin(true, gir < N * N * 1.5 ? 1 : 0.75, '¡El agua llega a la maceta! Seguir el flujo es leer un diagrama.'); } };
      const mv = (c, d) => ({ L: c % N ? c - 1 : c, R: c % N < N - 1 ? c + 1 : c, U: c >= N ? c - N : c, D: c < N * (N - 1) ? c + N : c })[d];
      useKeys((c, dn) => { if (!dn || p.fin) return; const a = { KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D' }[c], r = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[c]; if (a) setC1(mv(c1, a)); if (r) setC2(mv(c2, r)); if (c === 'KeyE') girar(c1); if (c === 'Enter') girar(c2); });
      const S = Math.floor(360 / N), seg = (m, on) => { const c = on ? '#5fd0e8' : '#7a8a94', w = S * 0.26; return [m & 1 ? div({ key: 'n', position: 'absolute', left: (S - w) / 2, top: 0, width: w, height: S / 2 + w / 2, background: c }) : null, m & 4 ? div({ key: 's', position: 'absolute', left: (S - w) / 2, top: S / 2 - w / 2, width: w, height: S / 2 + w / 2, background: c }) : null, m & 8 ? div({ key: 'w', position: 'absolute', left: 0, top: (S - w) / 2, width: S / 2 + w / 2, height: w, background: c }) : null, m & 2 ? div({ key: 'e', position: 'absolute', left: S / 2 - w / 2, top: (S - w) / 2, width: S / 2 + w / 2, height: w, background: c }) : null]; };
      return Wrap(P(['Giren las tuberías para que el agua vaya del ', B('tanque'), ' (arriba a la izquierda) a la ', B('maceta del patio'), ' (abajo a la derecha). J1 gira con E y J2 con ENTER (o clic).']), Ctrls(Tag(1, 'W A S D mover · E girar'), Tag(2, 'flechas mover · ENTER girar')), div({ display: 'flex', gap: 16 }, Stat('GIROS ' + gir), Stat(llega ? '¡EL AGUA LLEGA!' : 'EL AGUA NO LLEGA', llega ? OK : MU)),
        div({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }, div({ fontSize: 30 }, '🛢'), div({ display: 'grid', gridTemplateColumns: 'repeat(' + N + ',' + S + 'px)', gap: 2, background: '#26343e', padding: 2 }, ...b.map((m, i) => h('button', { key: i, onClick: () => girar(i), style: { width: S, height: S, padding: 0, position: 'relative', background: '#0e1820', border: '2px solid ' + (c1 === i && c2 === i ? '#fff' : c1 === i ? J1 : c2 === i ? J2 : '#0e1820'), cursor: 'pointer' } }, ...seg(m, !!F[i])))), div({ fontSize: 30, alignSelf: 'flex-end' }, '🪴')));
    }

    // ---------- ENCUENTRA EL INTRUSO ----------
    const FORMAS = ['c', 's', 't', 'r'], COLS = ['#ff7b72', '#5fd0e8', '#7fe0a0', '#ffd166'];
    const fig = (f, k) => h('svg', { key: k, viewBox: '0 0 60 60', style: { width: 56, height: 56 } }, f.s === 'c' ? h('circle', { cx: 30, cy: 30, r: 22, fill: f.f ? f.c : 'none', stroke: f.c, strokeWidth: 4 }) : f.s === 's' ? h('rect', { x: 9, y: 9, width: 42, height: 42, fill: f.f ? f.c : 'none', stroke: f.c, strokeWidth: 4 }) : f.s === 't' ? h('polygon', { points: '30,6 54,52 6,52', fill: f.f ? f.c : 'none', stroke: f.c, strokeWidth: 4 }) : h('polygon', { points: '30,4 56,30 30,56 4,30', fill: f.f ? f.c : 'none', stroke: f.c, strokeWidth: 4 }));
    function Intruso(p) {
      const T = p.tier, fin = useOnce(p), R = 5;
      const gen = () => { for (let it = 0; it < 200; it++) { const attrs = ['s', 'c', 'f', 'n'], key = p.h.pick(T === 1 ? ['s', 'c'] : attrs), base = { s: p.h.pick(FORMAS), c: p.h.pick(COLS), f: p.h.int(0, 1), n: p.h.int(1, 3) };
          const it5 = [...Array(5)].map(() => ({ s: key === 's' ? base.s : p.h.pick(FORMAS), c: key === 'c' ? base.c : p.h.pick(COLS), f: key === 'f' ? base.f : p.h.int(0, 1), n: key === 'n' ? base.n : p.h.int(1, 3) })), x = p.h.int(0, 4);
          const alt = { s: FORMAS.filter(v => v !== base.s), c: COLS.filter(v => v !== base.c), f: [1 - base.f], n: [1, 2, 3].filter(v => v !== base.n) }; it5[x][key] = p.h.pick(alt[key]);
          const otro = attrs.filter(a => a !== key).some(a => { const vals = it5.map(o => o[a]); return vals.some((v, i) => vals.filter(w => w === v).length === 1 && vals.filter(w => w === vals[(i + 1) % 5]).length === 4); }); if (otro) continue;
          return { it5, x, key }; } };
      const [q, setQ] = useState(gen), [n, setN] = useState(0), [ok, setOk] = useState(0), [fb, setFb] = useState('');
      const NOM = { s: 'la forma', c: 'el color', f: 'el relleno', n: 'la cantidad' };
      const A = Sel(5, i => { const bien = i === q.x; p.snd(bien ? 'ok' : 'err'); const no = ok + (bien ? 1 : 0); setOk(no); setFb((bien ? '✓ ' : '✗ ') + 'El intruso era el ' + (q.x + 1) + ': no comparte ' + NOM[q.key] + '.');
        if (n + 1 >= R) { if (no >= 4) fin(true, no === 5 ? 1 : 0.75, no + ' de 5. Encontrar la regla común es razonamiento abstracto.'); else fin(false, 0, no + ' de 5. Revisen forma, color, relleno y cantidad, una por una.'); return; } setN(n + 1); setQ(gen()); A.reset(); }, p, false);
      return Wrap(P(['Cuatro figuras siguen una regla; una ', B('no'), '. ¿Cuál es el intruso? Marquen los dos la misma (J1 A · D, J2 ← · →) y confirmen con E + ENTER.']), div({ display: 'flex', gap: 16 }, Stat('RONDA ' + (n + 1) + ' / ' + R), Stat('ACIERTOS ' + ok, OK)), fb ? Stat(fb, fb[0] === '✓' ? OK : ER) : null,
        div({ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }, ...q.it5.map((f, i) => h('button', { key: n + '-' + i, onClick: () => A.set(i), style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 10, background: '#07111a', border: '3px solid ' + (A.c1 === i && A.c2 === i ? '#fff' : LN), cursor: 'pointer', minWidth: 90 } }, div({ display: 'flex', gap: 2 }, ...[...Array(f.n)].map((_, k) => fig(f, k))), marcas(i, A)))), Dual(A.dual, 'a la vez para confirmar'));
    }

    // ---------- KENKEN ----------
    function KenKen(p) {
      const T = p.tier, fin = useOnce(p), N = T === 1 ? 3 : 4;
      const [z] = useState(() => { const pr = p.h.shuffle([...Array(N).keys()]), pc = p.h.shuffle([...Array(N).keys()]), sol = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) sol.push((pr[r] + pc[c]) % N + 1);
        const cage = Array(N * N).fill(-1), cs = []; p.h.shuffle([...Array(N * N).keys()]).forEach(i => { if (cage[i] >= 0) return; const x = i % N, y = Math.floor(i / N), nb = p.h.shuffle([[1, 0], [0, 1], [-1, 0], [0, -1]]).map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && cage[b * N + a] < 0).map(([a, b]) => b * N + a);
          const cells = [i]; if (nb.length && p.h.int(0, 9) < (T === 3 ? 9 : 7)) cells.push(nb[0]); cells.forEach(k => { cage[k] = cs.length; }); cs.push({ cells, s: cells.reduce((a, k) => a + sol[k], 0) }); }); return { sol, cage, cs }; });
      const [v, setV] = useState(Array(N * N).fill(0)), [cur, setCur] = useState(0), [tries, setTries] = useState(0), [mal, setMal] = useState({});
      const comprobar = () => { const m = {}; for (let i = 0; i < N * N; i++) { const x = i % N, y = Math.floor(i / N); if (!v[i]) m[i] = 1; for (let k = 0; k < N; k++) { if (k !== x && v[y * N + k] === v[i]) m[i] = 1; if (k !== y && v[k * N + x] === v[i]) m[i] = 1; } } z.cs.forEach(c => { if (c.cells.reduce((a, k) => a + v[k], 0) !== c.s) c.cells.forEach(k => { m[k] = 1; }); });
        setTries(tries + 1); if (!Object.keys(m).length) { p.snd('ok'); fin(true, tries === 0 ? 1 : tries <= 2 ? 0.75 : 0.5, 'KenKen resuelto: cada fila y columna tiene 1 a ' + N + ' sin repetir y todas las sumas cuadran.'); } else { setMal(m); p.snd('err'); p.onErr('Hay casillas en rojo: se repite un número o una suma no cuadra.', 0); } };
      const mv = (c, d) => ({ L: c % N ? c - 1 : c, R: c % N < N - 1 ? c + 1 : c, U: c >= N ? c - N : c, D: c < N * (N - 1) ? c + N : c })[d];
      useKeys((c, dn, e) => { if (!dn || p.fin) return; const d = { KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D', ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[c]; if (d) setCur(mv(cur, d)); const k = e && e.key; if (/^[1-9]$/.test(k || '') && +k <= N) { const nv = v.slice(); nv[cur] = +k; setV(nv); setMal({}); } if (c === 'Backspace') { const nv = v.slice(); nv[cur] = 0; setV(nv); } if (c === 'Enter') comprobar(); });
      const S = Math.floor(320 / N), first = {}; z.cs.forEach((c, i) => { first[Math.min(...c.cells)] = c.s; });
      const bd = (i, dx, dy) => { const x = i % N + dx, y = Math.floor(i / N) + dy; return x < 0 || y < 0 || x >= N || y >= N || z.cage[y * N + x] !== z.cage[i] ? '3px solid #e8f4f8' : '1px solid #3a5160'; };
      return Wrap(P(['KenKen: llenen con números del 1 al ' + N + ' sin repetir en filas ni columnas. Los números de cada grupo deben ', B('sumar'), ' lo indicado. Muevan con las flechas o W A S D, escriban el número y pulsen ENTER para comprobar. Uno propone y el otro verifica.']), Stat('INTENTOS ' + tries),
        div({ display: 'grid', gridTemplateColumns: 'repeat(' + N + ',' + S + 'px)', justifyContent: 'center' }, ...v.map((x, i) => h('button', { key: i, onClick: () => setCur(i), style: { width: S, height: S, position: 'relative', padding: 0, background: mal[i] ? 'rgba(255,123,114,.25)' : cur === i ? 'rgba(255,209,102,.25)' : '#0e1820', color: TX, fontFamily: HEAD, fontSize: S * 0.42, cursor: 'pointer', borderTop: bd(i, 0, -1), borderBottom: bd(i, 0, 1), borderLeft: bd(i, -1, 0), borderRight: bd(i, 1, 0) } }, first[i] != null ? h('span', { style: { position: 'absolute', left: 4, top: 2, fontFamily: MONO, fontSize: 13, color: GOLD } }, String(first[i])) : null, x ? String(x) : ''))),
        h('button', { onClick: comprobar, style: { alignSelf: 'flex-start', background: OK, border: 'none', color: '#081018', fontFamily: HEAD, fontSize: 16, padding: '10px 18px', cursor: 'pointer' } }, 'Comprobar (ENTER)'));
    }
    make.c = { flappy: Flappy, breakout: Breakout, pong: Pong, wordle: Wordle, deslizante: Deslizante, tuberias: Tuberias, intruso: Intruso, kenken: KenKen };
    return make.c;
  }
  window.ESC_ARCADE2 = { make };
})();

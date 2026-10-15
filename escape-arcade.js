// Sala Arcade · juegos clásicos que desarrollan la mente (cooperativos J1/J2) para Escape del Laboratorio.
(function () {
  function make(React, U) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const { div, P, B, Tag, Ctrls, Stat, Box, Wrap, useKeys, useDual, Dual, useOnce } = U, { J1, J2, OK, ER, TX, MU, BG, LN, MONO, HEAD } = U.C;
    const GOLD = '#ffd166';
    const useTick = () => { const [, s] = useState(0); return () => s(x => x + 1); };
    const Pantalla = (...ch) => div({ background: '#05080c', border: '4px solid #26343e', borderRadius: 14, padding: 12, boxShadow: 'inset 0 0 30px rgba(95,208,232,.12), 0 0 24px rgba(95,208,232,.15)', display: 'flex', justifyContent: 'center' }, ...ch);
    const Celda = (s, bg, extra, ...ch) => div(Object.assign({ width: s, height: s, background: bg, boxSizing: 'border-box' }, extra || {}), ...ch);

    // ---------- TETRIS ----------
    const PZ = [[[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]]];
    const PC = ['#5fd0e8', '#ffd166', '#c58cf0', '#5f8fe8', '#f0a726', '#7fe0a0', '#ff7b72'];
    const rot = m => m[0].map((_, c) => m.map(r => r[c]).reverse());
    function Tetris(p) {
      const T = p.tier, fin = useOnce(p), W = 10, H = 16, meta = [3, 5, 8][T - 1], vel = [650, 480, 340][T - 1], draw = useTick(), g = useRef(null);
      const choca = (s, m, x, y) => m.some((r, i) => r.some((v, j) => v && (x + j < 0 || x + j >= W || y + i >= H || (y + i >= 0 && s.b[y + i][x + j]))));
      const nueva = s => { const k = Math.floor(Math.random() * 7); s.pc = { m: PZ[k], c: PC[k], x: 3, y: -1 }; s.n++; if (choca(s, s.pc.m, s.pc.x, 0)) s.over = true; };
      if (!g.current) { g.current = { b: [...Array(H)].map(() => Array(W).fill(null)), lines: 0, over: false, n: 0, end: false }; nueva(g.current); }
      const revisar = () => { const s = g.current; if (s.end) return; if (s.lines >= meta) { s.end = true; fin(true, s.n <= meta * 9 ? 1 : 0.75, 'Completaron ' + s.lines + ' líneas con ' + s.n + ' piezas. Planificar dónde cae cada pieza es pensamiento espacial.'); } else if (s.over) { s.end = true; fin(false, 0, 'Se llenó la pantalla con ' + s.lines + ' de ' + meta + ' líneas. Hablen antes de girar: ¿dónde encaja mejor?'); } };
      const fijar = s => { const { m, c, x, y } = s.pc; m.forEach((r, i) => r.forEach((v, j) => { if (v && y + i >= 0) s.b[y + i][x + j] = c; })); if (y < 0) s.over = true;
        const keep = s.b.filter(r => r.some(v => !v)), n = H - keep.length; if (n) { p.snd('ok'); s.lines += n; s.b = [...Array(n)].map(() => Array(W).fill(null)).concat(keep); } else p.snd('click'); if (!s.over) nueva(s); revisar(); };
      const bajar = () => { const s = g.current; if (s.end) return; if (!choca(s, s.pc.m, s.pc.x, s.pc.y + 1)) s.pc.y++; else fijar(s); draw(); };
      useEffect(() => { const t = setInterval(() => { if (!p.fin && !window.__escPausa) bajar(); }, vel); return () => clearInterval(t); }, []);
      useKeys((c, dn) => { const s = g.current; if (!dn || p.fin || s.end) return; const q = s.pc;
        if (c === 'KeyA' && !choca(s, q.m, q.x - 1, q.y)) q.x--; if (c === 'KeyD' && !choca(s, q.m, q.x + 1, q.y)) q.x++; if (c === 'KeyS') bajar();
        if (c === 'ArrowUp') { const r = rot(q.m); for (const dx of [0, -1, 1, -2, 2]) if (!choca(s, r, q.x + dx, q.y)) { q.m = r; q.x += dx; break; } }
        if (c === 'ArrowDown') { while (!choca(s, q.m, q.x, q.y + 1)) q.y++; fijar(s); } draw(); });
      const s = g.current, vis = s.b.map(r => r.slice()); s.pc.m.forEach((r, i) => r.forEach((v, j) => { if (v && s.pc.y + i >= 0 && s.pc.y + i < H) vis[s.pc.y + i][s.pc.x + j] = s.pc.c; }));
      return Wrap(P(['Tetris en equipo: ', B('J1 mueve'), ' la pieza y ', B('J2 la gira'), '. Completen ' + meta + ' líneas sin llenar la pantalla. ¡Coordínense!']), Ctrls(Tag(1, 'A · D mover · S bajar'), Tag(2, '↑ girar · ↓ soltar')),
        div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('LÍNEAS ' + s.lines + ' / ' + meta, OK), Stat('PIEZAS ' + s.n)),
        Pantalla(div({ display: 'grid', gridTemplateColumns: 'repeat(' + W + ',26px)', gap: 1 }, ...vis.flat().map((v, i) => Celda(26, v || '#0e1820', v ? { boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.25), 0 0 8px ' + v } : {})))));
    }

    // ---------- PAC-MAN LÓGICO ----------
    const DIR = { L: [-1, 0, '←'], R: [1, 0, '→'], U: [0, -1, '↑'], D: [0, 1, '↓'] };
    function PacLogico(p) {
      const T = p.tier, fin = useOnce(p), N = [7, 8, 9][T - 1];
      const [lv] = useState(() => { for (let it = 0; it < 400; it++) { const wall = [...Array(N * N)].map((_, i) => { const x = i % N, y = Math.floor(i / N); return x === 0 || y === 0 || x === N - 1 || y === N - 1 || p.h.int(0, 99) < 16; });
          const free = wall.map((w, i) => w ? -1 : i).filter(i => i >= 0), st = p.h.pick(free); const slide = (pos, d) => { const [dx, dy] = DIR[d], path = []; let x = pos % N, y = Math.floor(pos / N); while (!wall[(y + dy) * N + x + dx]) { x += dx; y += dy; path.push(y * N + x); } return path; };
          let pos = st; const pasa = []; const L = [3, 4, 5][T - 1]; let okp = true; for (let k = 0; k < L; k++) { const d = p.h.pick(['L', 'R', 'U', 'D']), pa = slide(pos, d); if (!pa.length) { okp = false; break; } pa.forEach(c => pasa.push(c)); pos = pa[pa.length - 1]; } if (!okp) continue;
          const cand = [...new Set(pasa)].filter(c => c !== st); if (cand.length < [3, 4, 6][T - 1]) continue; const dots = p.h.shuffle(cand).slice(0, [3, 4, 6][T - 1]);
          const full = (1 << dots.length) - 1, seen = {}, q = [[st, 0, 0]]; seen[st + ',0'] = 1; let opt = -1;
          while (q.length) { const [ps, m, dd] = q.shift(); if (m === full) { opt = dd; break; } if (dd > 8) break; for (const d of ['L', 'R', 'U', 'D']) { const pa = slide(ps, d); if (!pa.length) continue; let nm = m; pa.forEach(c => { const k = dots.indexOf(c); if (k >= 0) nm |= 1 << k; }); const np = pa[pa.length - 1]; if (!seen[np + ',' + nm]) { seen[np + ',' + nm] = 1; q.push([np, nm, dd + 1]); } } }
          if (opt < 2) continue; return { wall, st, dots, opt, lim: opt + (T === 1 ? 2 : 1), slide }; }
          const wall = [...Array(49)].map((_, i) => { const x = i % 7, y = Math.floor(i / 7); return x === 0 || y === 0 || x === 6 || y === 6; }), N2 = 7, slide = (pos, d) => { const [dx, dy] = DIR[d], path = []; let x = pos % N2, y = Math.floor(pos / N2); while (!wall[(y + dy) * N2 + x + dx]) { x += dx; y += dy; path.push(y * N2 + x); } return path; };
          return { wall, st: 8, dots: [12, 40, 36], opt: 2, lim: 4, slide }; });
      const [prog, setProg] = useState([]), [pos, setPos] = useState(lv.st), [com, setCom] = useState([]), [run, setRun] = useState(false), [fallos, setFallos] = useState(0);
      const ejecutar = () => { if (run || p.fin || !prog.length) return; setRun(true); let ps = lv.st, comidos = [], pasos = []; prog.forEach(d => lv.slide(ps, d).forEach(c => { pasos.push(c); ps = c; }));
        let k = 0; setPos(lv.st); setCom([]); const t = setInterval(() => { if (k >= pasos.length) { clearInterval(t); setRun(false); const todos = lv.dots.every(d => comidos.includes(d));
            if (todos) { p.snd('ok'); fin(true, prog.length === lv.opt ? 1 : 0.75, 'Comieron todo con ' + prog.length + ' instrucciones (el mínimo era ' + lv.opt + '). ¡Eso es pensar como programador!'); }
            else { p.snd('err'); const f = fallos + 1; setFallos(f); if (f >= 4) fin(false, 0, 'El programa no comió todos los puntos. Recorran el camino con el dedo antes de ejecutar.'); else p.onErr('Quedaron puntos sin comer. Corrijan el programa (intento ' + f + ' de 4).', 0); setPos(lv.st); setCom([]); } return; }
          const c = pasos[k++]; setPos(c); if (lv.dots.includes(c) && !comidos.includes(c)) { comidos.push(c); setCom(comidos.slice()); p.snd('click'); } }, 110); };
      const dual = useDual(ejecutar), add = d => { if (!run && prog.length < lv.lim) setProg(prog.concat([d])); };
      useKeys((c, dn) => { if (!dn || p.fin || run) return; if (c === 'KeyA') add('L'); if (c === 'KeyD') add('R'); if (c === 'ArrowUp') add('U'); if (c === 'ArrowDown') add('D'); if (c === 'KeyS' || c === 'Backspace') setProg(prog.slice(0, -1)); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      const S = Math.floor(380 / N);
      return Wrap(P(['Pac-Man programable: el personaje ', B('se desliza hasta chocar con una pared'), '. Armen el programa para comer todos los puntos con máximo ', B(String(lv.lim)), ' instrucciones. J1 agrega ← →, J2 agrega ↑ ↓.']), Ctrls(Tag(1, 'A ← · D → · S borrar'), Tag(2, '↑ · ↓')),
        div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('PUNTOS ' + com.length + ' / ' + lv.dots.length, GOLD), Stat('INSTRUCCIONES ' + prog.length + ' / ' + lv.lim), Stat('FALLOS ' + fallos + ' / 4', fallos ? ER : MU)),
        Pantalla(div({ display: 'grid', gridTemplateColumns: 'repeat(' + N + ',' + S + 'px)' }, ...lv.wall.map((w, i) => Celda(S, w ? '#1f3fae' : '#05080c', { display: 'flex', alignItems: 'center', justifyContent: 'center', border: w ? '2px solid #3a63ff' : 'none' },
          i === pos ? div({ width: S * 0.7, height: S * 0.7, borderRadius: '50%', background: GOLD, clipPath: 'polygon(100% 20%,50% 50%,100% 80%,100% 100%,0 100%,0 0,100% 0)', boxShadow: '0 0 10px ' + GOLD }) : lv.dots.includes(i) && !com.includes(i) ? div({ width: S * 0.24, height: S * 0.24, borderRadius: '50%', background: '#ffe9b0', boxShadow: '0 0 6px #ffe9b0' }) : null)))),
        Box({ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', minHeight: 40 }, Stat('PROGRAMA:', MU), ...prog.map((d, i) => div({ key: i, fontFamily: HEAD, fontSize: 24, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid ' + (d === 'L' || d === 'R' ? J1 : J2), color: TX }, DIR[d][2]))),
        Dual(dual, 'J1 E + J2 ENTER = ejecutar'));
    }

    // ---------- SNAKE MATEMÁTICO ----------
    const primo = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
    const REGLAS = { 1: [['pares', n => n % 2 === 0], ['impares', n => n % 2 === 1]], 2: [['múltiplos de 3', n => n % 3 === 0], ['múltiplos de 4', n => n % 4 === 0], ['múltiplos de 5', n => n % 5 === 0]], 3: [['números primos', primo], ['múltiplos de 6', n => n % 6 === 0]] };
    function Snake(p) {
      const T = p.tier, fin = useOnce(p), W = 16, H = 11, meta = [6, 8, 10][T - 1], vel = [230, 190, 160][T - 1], [regla] = useState(() => p.h.pick(REGLAS[T])), draw = useTick(), g = useRef(null);
      const libre = (s) => { for (;;) { const x = Math.floor(Math.random() * W), y = Math.floor(Math.random() * H); if (!s.cu.some(c => c[0] === x && c[1] === y) && !s.nums.some(n => n.x === x && n.y === y)) return [x, y]; } };
      const nuevoNum = (s, forzarOk) => { const [x, y] = libre(s); let v; const tope = T === 1 ? 30 : 60; for (let k = 0; k < 200; k++) { v = 1 + Math.floor(Math.random() * tope); if (forzarOk == null || regla[1](v) === forzarOk) break; } s.nums.push({ x, y, v }); };
      if (!g.current) { const s = { cu: [[5, 5], [4, 5], [3, 5]], d: [1, 0], nd: [1, 0], nums: [], ok: 0, vidas: 3, end: false, flash: 0 }; nuevoNum(s, true); nuevoNum(s, true); nuevoNum(s, false); nuevoNum(s, false); nuevoNum(s, null); g.current = s; }
      const perder = (s, msg) => { s.vidas--; s.flash = 6; p.snd('err'); if (s.vidas <= 0) { s.end = true; fin(false, 0, msg + ' Se acabaron las vidas con ' + s.ok + ' de ' + meta + '.'); } return s.vidas > 0; };
      useEffect(() => { const t = setInterval(() => { const s = g.current; if (s.end || p.fin || window.__escPausa) return; if (s.flash) s.flash--; s.d = s.nd; const [hx, hy] = s.cu[0], nx = hx + s.d[0], ny = hy + s.d[1];
          if (nx < 0 || ny < 0 || nx >= W || ny >= H || s.cu.some(c => c[0] === nx && c[1] === ny)) { if (perder(s, 'Chocaron.')) { s.cu = [[5, 5], [4, 5], [3, 5]]; s.d = s.nd = [1, 0]; } draw(); return; }
          s.cu.unshift([nx, ny]); const k = s.nums.findIndex(n => n.x === nx && n.y === ny);
          if (k >= 0) { const n = s.nums[k]; s.nums.splice(k, 1); if (regla[1](n.v)) { s.ok++; p.snd('ok'); if (s.ok >= meta) { s.end = true; fin(true, s.vidas === 3 ? 1 : 0.75, 'Comieron ' + meta + ' ' + regla[0] + ' sin equivocarse más de ' + (3 - s.vidas) + ' veces.'); } } else { s.cu.pop(); perder(s, n.v + ' no es de los ' + regla[0] + '.'); }
            nuevoNum(s, s.nums.some(q => regla[1](q.v)) ? null : true); } else s.cu.pop(); draw(); }, vel); return () => clearInterval(t); }, []);
      useKeys((c, dn) => { const s = g.current; if (!dn || s.end) return; const set = d => { if (d[0] !== -s.d[0] || d[1] !== -s.d[1]) s.nd = d; }; if (c === 'KeyA') set([-1, 0]); if (c === 'KeyD') set([1, 0]); if (c === 'ArrowUp') set([0, -1]); if (c === 'ArrowDown') set([0, 1]); });
      const s = g.current, S = 30;
      return Wrap(P(['Snake matemático: coman solo los ', B(regla[0]), '. ', B('J1 gira a los lados'), ' y ', B('J2 arriba y abajo'), '. Necesitan ' + meta + '.']), Ctrls(Tag(1, 'A ← · D →'), Tag(2, '↑ · ↓')),
        div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('REGLA: ' + regla[0].toUpperCase(), GOLD), Stat('COMIDOS ' + s.ok + ' / ' + meta, OK), Stat('VIDAS ' + '♥'.repeat(Math.max(0, s.vidas)), ER)),
        Pantalla(div({ position: 'relative', width: W * S, height: H * S, background: s.flash ? '#2a0d10' : '#07131a', backgroundImage: 'linear-gradient(rgba(95,208,232,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(95,208,232,.06) 1px,transparent 1px)', backgroundSize: S + 'px ' + S + 'px' },
          ...s.nums.map((n, i) => div({ key: 'n' + i, position: 'absolute', left: n.x * S, top: n.y * S, width: S, height: S, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 15, color: '#081018', background: '#e8f4f8', borderRadius: 6 }, String(n.v))),
          ...s.cu.map((c, i) => div({ key: 'c' + i, position: 'absolute', left: c[0] * S + 2, top: c[1] * S + 2, width: S - 4, height: S - 4, borderRadius: i ? 6 : 10, background: i ? '#3fd0b8' : '#7fe0a0', boxShadow: i ? 'none' : '0 0 10px #7fe0a0' })))));
    }

    // ---------- 2048 ----------
    function Dosmil(p) {
      const T = p.tier, fin = useOnce(p), meta = [64, 128, 256][T - 1];
      const add = b => { const v = b.map((x, i) => x ? -1 : i).filter(i => i >= 0); if (!v.length) return b; const n = b.slice(); n[v[Math.floor(Math.random() * v.length)]] = Math.random() < 0.9 ? 2 : 4; return n; };
      const [b, setB] = useState(() => add(add(Array(16).fill(0)))), [mov, setMov] = useState(0), [end, setEnd] = useState(false);
      const mover = d => { if (end || p.fin) return; const n = b.slice(); let cambio = false;
        for (let k = 0; k < 4; k++) { const idx = [0, 1, 2, 3].map(j => d === 'L' ? k * 4 + j : d === 'R' ? k * 4 + 3 - j : d === 'U' ? j * 4 + k : (3 - j) * 4 + k), fila = idx.map(i => n[i]).filter(Boolean), out = [];
          for (let i = 0; i < fila.length; i++) { if (fila[i] === fila[i + 1]) { out.push(fila[i] * 2); i++; } else out.push(fila[i]); } while (out.length < 4) out.push(0); idx.forEach((i, j) => { if (n[i] !== out[j]) cambio = true; n[i] = out[j]; }); }
        if (!cambio) return; const nb = add(n); setB(nb); setMov(mov + 1); p.snd('click');
        if (Math.max(...nb) >= meta) { setEnd(true); fin(true, mov < meta * 0.7 ? 1 : 0.75, '¡Llegaron a ' + meta + ' en ' + (mov + 1) + ' movimientos! Estrategia: mantener el número grande en una esquina.'); return; }
        const puede = nb.some((v, i) => !v || (i % 4 < 3 && v === nb[i + 1]) || (i < 12 && v === nb[i + 4])); if (!puede) { setEnd(true); fin(false, 0, 'Sin movimientos. Su mayor número fue ' + Math.max(...nb) + '. Prueben a acumular todo en una esquina.'); } };
      useKeys((c, dn) => { if (!dn) return; if (c === 'KeyA') mover('L'); if (c === 'KeyD') mover('R'); if (c === 'ArrowUp') mover('U'); if (c === 'ArrowDown') mover('D'); });
      const col = v => ({ 2: '#e8f4f8', 4: '#cfe9f2', 8: '#ffd166', 16: '#f0a726', 32: '#ff9f6b', 64: '#ff7b72', 128: '#c58cf0', 256: '#7fe0a0' }[v] || '#5fd0e8');
      return Wrap(P(['2048: al chocar, dos números iguales se suman. Lleguen a ', B(String(meta)), '. ', B('J1 mueve a los lados'), ' y ', B('J2 arriba y abajo'), ': decidan juntos cada jugada.']), Ctrls(Tag(1, 'A ← · D →'), Tag(2, '↑ · ↓')),
        div({ display: 'flex', gap: 16 }, Stat('META ' + meta, GOLD), Stat('MAYOR ' + Math.max(...b), OK), Stat('MOVIMIENTOS ' + mov)),
        Pantalla(div({ display: 'grid', gridTemplateColumns: 'repeat(4,78px)', gap: 8 }, ...b.map((v, i) => div({ key: i, height: 78, borderRadius: 8, background: v ? col(v) : '#122029', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: v >= 100 ? 26 : 32, color: '#081018', boxShadow: v ? '0 0 12px ' + col(v) : 'none' }, v ? String(v) : '')))));
    }

    // ---------- BUSCAMINAS ----------
    function Minas(p) {
      const T = p.tier, fin = useOnce(p), N = 8, M = [7, 10, 13][T - 1];
      const [mn, setMn] = useState(null), [ab, setAb] = useState({}), [fl, setFl] = useState({}), [c1, setC1] = useState(27), [c2, setC2] = useState(36), [end, setEnd] = useState(false);
      const vec = i => { const x = i % N, y = Math.floor(i / N), r = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const a = x + dx, b = y + dy; if (a >= 0 && b >= 0 && a < N && b < N) r.push(b * N + a); } return r; };
      const cnt = (m, i) => vec(i).filter(j => m[j]).length;
      const abrir = i => { if (end || p.fin || fl[i] || ab[i]) return; let m = mn; if (!m) { m = {}; const prohib = [i].concat(vec(i)); const libres = [...Array(N * N).keys()].filter(k => !prohib.includes(k)); p.h.shuffle(libres).slice(0, M).forEach(k => { m[k] = 1; }); setMn(m); }
        if (m[i]) { setAb(Object.assign({}, ab, { [i]: 1 })); setEnd(true); p.snd('err'); fin(false, 0, '¡Era una mina! Antes de abrir, cuenten: si un 1 ya tiene su mina marcada, sus demás vecinos son seguros.'); return; }
        const na = Object.assign({}, ab), q = [i]; while (q.length) { const k = q.pop(); if (na[k]) continue; na[k] = 1; if (!cnt(m, k)) vec(k).forEach(j => { if (!na[j] && !m[j]) q.push(j); }); } setAb(na); p.snd('click');
        if (Object.keys(na).length === N * N - M) { setEnd(true); const malas = Object.keys(fl).filter(k => !m[k]).length; fin(true, malas === 0 ? 1 : 0.75, 'Despejaron el campo sin pisar ninguna mina. Eso es deducción lógica.'); } };
      const marcar = i => { if (end || ab[i]) return; setFl(Object.assign({}, fl, { [i]: !fl[i] })); p.snd('click'); };
      const mv = (c, k) => ({ L: c % N ? c - 1 : c, R: c % N < N - 1 ? c + 1 : c, U: c >= N ? c - N : c, D: c < N * (N - 1) ? c + N : c })[k];
      useKeys((c, dn) => { if (!dn || p.fin) return; const a = { KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D' }[c], r = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[c]; if (a) setC1(mv(c1, a)); if (r) setC2(mv(c2, r)); if (c === 'KeyE') abrir(c1); if (c === 'Enter') marcar(c2); });
      const NC = ['', '#5fd0e8', '#7fe0a0', '#ff7b72', '#c58cf0', '#f0a726', '#ff8fd0', '#fff', '#fff'];
      return Wrap(P(['Buscaminas: hay ', B(M + ' minas'), '. Cada número dice cuántas minas tiene alrededor. ', B('J1 abre'), ' casillas y ', B('J2 marca'), ' las minas con banderas. También con clic (izquierdo abre, derecho marca).']), Ctrls(Tag(1, 'W A S D mover · E abrir'), Tag(2, 'flechas mover · ENTER bandera')),
        div({ display: 'flex', gap: 16 }, Stat('MINAS ' + M, ER), Stat('BANDERAS ' + Object.values(fl).filter(Boolean).length, GOLD), Stat('ABIERTAS ' + Object.keys(ab).length + ' / ' + (N * N - M), OK)),
        Pantalla(div({ display: 'grid', gridTemplateColumns: 'repeat(' + N + ',44px)', gap: 3 }, ...[...Array(N * N)].map((_, i) => { const o = ab[i], n = o && mn && !mn[i] ? cnt(mn, i) : 0;
          return h('button', { key: i, onClick: () => abrir(i), onContextMenu: e => { e.preventDefault(); marcar(i); }, style: { width: 44, height: 44, padding: 0, fontFamily: HEAD, fontSize: 20, cursor: 'pointer', background: o ? (mn && mn[i] ? ER : '#0e1820') : '#2c4452', color: NC[n] || TX, border: '2px solid ' + (c1 === i && c2 === i ? '#fff' : c1 === i ? J1 : c2 === i ? J2 : o ? '#16242f' : '#3e5c6c'), borderRadius: 4 } }, o ? (mn && mn[i] ? '✹' : n ? String(n) : '') : fl[i] ? '⚑' : ''); }))));
    }

    // ---------- SOKOBAN ----------
    const SOK = { 1: ['######', '#    #', '# $  #', '#  . #', '#@   #', '######'], 2: ['#######', '#     #', '# $$  #', '#  .. #', '#@    #', '#######'], 3: ['########', '#      #', '# $ $$ #', '#  ... #', '#@     #', '########'] };
    function Sokoban(p) {
      const T = p.tier, fin = useOnce(p), L = SOK[T], W = L[0].length, Hh = L.length;
      const ini = () => { let pl = 0; const bx = [], gl = [], wl = {}; L.forEach((r, y) => r.split('').forEach((ch, x) => { const i = y * W + x; if (ch === '#') wl[i] = 1; if (ch === '$') bx.push(i); if (ch === '.') gl.push(i); if (ch === '@') pl = i; })); return { pl, bx, gl, wl }; };
      const [s, setS] = useState(ini), [mov, setMov] = useState(0), [hist, setHist] = useState([]);
      const ir = (dx, dy) => { if (p.fin) return; const d = dy * W + dx, n = s.pl + d; if (s.wl[n]) return; const k = s.bx.indexOf(n); let bx = s.bx;
        if (k >= 0) { const m = n + d; if (s.wl[m] || s.bx.includes(m)) { p.snd('err'); return; } bx = s.bx.slice(); bx[k] = m; p.snd('click'); }
        const ns = Object.assign({}, s, { pl: n, bx }); setHist(hist.concat([s])); setS(ns); setMov(mov + 1);
        if (ns.gl.every(g => ns.bx.includes(g))) { p.snd('ok'); fin(true, mov + 1 <= [10, 22, 30][T - 1] ? 1 : 0.75, 'Todas las cajas en su lugar con ' + (mov + 1) + ' movimientos. Planificar antes de empujar evita quedar atrapados.'); } };
      useKeys((c, dn) => { if (!dn || p.fin) return; if (c === 'KeyA') ir(-1, 0); if (c === 'KeyD') ir(1, 0); if (c === 'ArrowUp') ir(0, -1); if (c === 'ArrowDown') ir(0, 1); if ((c === 'KeyS' || c === 'Backspace') && hist.length) { setS(hist[hist.length - 1]); setHist(hist.slice(0, -1)); setMov(mov + 1); } if (c === 'KeyR') { setS(ini()); setHist([]); setMov(0); } });
      const S2 = 54;
      return Wrap(P(['Sokoban: lleven las cajas a los puntos dorados. Solo se pueden ', B('empujar'), ', nunca jalar: ¡si una caja queda en una esquina, se traba! ', B('J1'), ' mueve a los lados y ', B('J2'), ' arriba y abajo.']), Ctrls(Tag(1, 'A ← · D → · S deshacer'), Tag(2, '↑ · ↓ · R reiniciar')),
        div({ display: 'flex', gap: 16 }, Stat('MOVIMIENTOS ' + mov), Stat('CAJAS EN SU LUGAR ' + s.gl.filter(g => s.bx.includes(g)).length + ' / ' + s.gl.length, OK)),
        Pantalla(div({ display: 'grid', gridTemplateColumns: 'repeat(' + W + ',' + S2 + 'px)' }, ...[...Array(W * Hh)].map((_, i) => { const w = s.wl[i], bxi = s.bx.includes(i), gi = s.gl.includes(i);
          return Celda(S2, w ? '#4a3a2a' : '#1a242c', { display: 'flex', alignItems: 'center', justifyContent: 'center', border: w ? '2px solid #6b5640' : '1px solid #22303a' },
            bxi ? div({ width: S2 * 0.8, height: S2 * 0.8, background: gi ? OK : '#c68a3e', border: '3px solid ' + (gi ? '#c9ffd9' : '#7a4f1f'), borderRadius: 4, boxShadow: gi ? '0 0 12px ' + OK : 'none' }) : i === s.pl ? div({ width: S2 * 0.62, height: S2 * 0.62, borderRadius: '50%', background: J1, boxShadow: '0 0 10px ' + J1 }) : gi ? div({ width: 14, height: 14, borderRadius: '50%', background: GOLD, boxShadow: '0 0 8px ' + GOLD }) : null); }))));
    }
    make.c = { tetris: Tetris, pacman: PacLogico, snake: Snake, dosmil: Dosmil, minas: Minas, sokoban: Sokoban };
    return make.c;
  }
  window.ESC_ARCADE = { make };
})();

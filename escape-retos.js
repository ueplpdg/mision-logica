// Retos nuevos de "Escape del Laboratorio": generadores y verificadores (sin interfaz).
(function () {
  const R = {};
  const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];

  // ---------- ROBOT PROGRAMABLE ----------
  R.ROBOT_CFG = { 1: { W: 5, H: 5, main: 7, fun: 0, tokens: ['F', 'L', 'R'], dens: 0.12 }, 2: { W: 6, H: 6, main: 4, fun: 4, tokens: ['F', 'L', 'R', 'P'], dens: 0.2 }, 3: { W: 7, H: 7, main: 4, fun: 4, tokens: ['F', 'L', 'R', 'P', 'S'], dens: 0.28 } };
  R.robotSim = function (d, main, fun, maxSteps) {
    let x = d.sx, y = d.sy, dir = d.sdir, steps = 0, status = 'run';
    const trail = [{ x, y, dir }];
    const pared = (cx, cy) => cx < 0 || cy < 0 || cx >= d.W || cy >= d.H || !!d.walls[cy * d.W + cx];
    const ex = t => {
      if (status !== 'run' || !t) return;
      if (++steps > (maxSteps || 80)) { status = 'loop'; return; }
      if (t === 'F') { const nx = x + DX[dir], ny = y + DY[dir]; if (pared(nx, ny)) { status = 'crash'; trail.push({ x, y, dir, crash: true }); return; } x = nx; y = ny; }
      else if (t === 'L') dir = (dir + 3) % 4;
      else if (t === 'R') dir = (dir + 1) % 4;
      else if (t === 'S') { const nx = x + DX[dir], ny = y + DY[dir]; if (pared(nx, ny)) dir = (dir + 1) % 4; else { x = nx; y = ny; } }
      trail.push({ x, y, dir });
      if (x === d.gx && y === d.gy) status = 'goal';
    };
    for (const t of main) { if (t === 'P') { for (const u of fun) if (u !== 'P') ex(u); } else ex(t); if (status !== 'run') break; }
    if (status === 'run') status = 'end';
    return { trail, status };
  };
  R.genRobot = function (tier, h) {
    const c = R.ROBOT_CFG[tier];
    for (let it = 0; it < 600; it++) {
      let main, fun = [];
      if (tier === 1) { const n = h.int(5, 7); main = []; for (let i = 0; i < n; i++) main.push(i < 2 ? 'F' : h.pick(['F', 'F', 'L', 'R'])); }
      else { const n = h.int(3, 4); for (let i = 0; i < n; i++) fun.push(i === 0 ? 'F' : h.pick(['F', 'F', 'L', 'R'])); if (!fun.includes('L') && !fun.includes('R')) fun[n - 1] = h.pick(['L', 'R']); main = h.pick([['P', 'P', 'P'], ['P', 'P', 'P', 'P'], ['F', 'P', 'P', 'P']]); }
      if (main.join('').includes('LR') || main.join('').includes('RL')) continue;
      const sx = h.int(0, c.W - 1), sy = h.int(0, c.H - 1), sdir = h.int(0, 3);
      const d0 = { W: c.W, H: c.H, sx, sy, sdir, gx: -1, gy: -1, walls: [] };
      const r = R.robotSim(d0, main, fun, 80);
      if (r.status !== 'end') continue;
      const last = r.trail[r.trail.length - 1], cells = {};
      r.trail.forEach(p => { cells[p.y * c.W + p.x] = 1; });
      if (Math.abs(last.x - sx) + Math.abs(last.y - sy) < (tier === 1 ? 3 : 4)) continue;
      if (Object.keys(cells).length < (tier === 1 ? 5 : 7)) continue;
      const walls = [];
      for (let i = 0; i < c.W * c.H; i++) walls.push(!cells[i] && h.int(0, 99) < c.dens * 100 ? 1 : 0);
      const d = { W: c.W, H: c.H, sx, sy, sdir, gx: last.x, gy: last.y, walls, cfg: c, ref: { main, fun } };
      const chk = R.robotSim(d, main, fun, 80);
      if (chk.status !== 'goal') continue;
      // evitar que sin programar nada o con un solo avance ya se llegue
      if (R.robotSim(d, ['F'], [], 5).status === 'goal') continue;
      return d;
    }
    return { W: 5, H: 5, sx: 0, sy: 4, sdir: 0, gx: 2, gy: 1, walls: Array(25).fill(0), cfg: c, ref: { main: ['F', 'F', 'F', 'R', 'F', 'F'], fun: [] } };
  };

  // ---------- MATRIZ DE RAVEN ----------
  R.FIG = ['●', '■', '▲', '◆'];
  R.FIG_V = ['○', '□', '△', '◇'];
  R.genRaven = function (tier, h) {
    const regla = (tipo, vals, sh) => (r, c) => tipo === 'const' ? vals[0] : tipo === 'col' ? vals[c] : tipo === 'row' ? vals[r] : vals[(r * sh + c) % 3];
    const tres = n => h.shuffle([...Array(n).keys()]).slice(0, 3);
    const num = () => h.shuffle([1, 2, 3]);
    let rf, rn, rl, desc;
    if (tier === 1) { rf = regla('latin', tres(4), 1); rn = regla('col', num()); const k = h.int(0, 1); rl = regla('const', [k]); desc = 'figura: cada fila tiene las tres · cantidad: depende de la columna · relleno: siempre igual'; }
    else if (tier === 2) { rf = regla('latin', tres(4), 1); rn = regla('latin', num(), 2); rl = regla('row', h.shuffle([0, 1, 2])); desc = 'figura y cantidad: cada fila tiene los tres valores · relleno: cambia por fila'; }
    else { const s1 = h.pick([1, 2]); rf = regla('latin', tres(4), s1); rn = regla('latin', num(), 3 - s1); rl = regla('latin', h.shuffle([0, 1, 2]), s1); desc = 'las tres propiedades rotan en cada fila, en distinto sentido'; }
    const celdas = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) celdas.push({ fig: rf(r, c), num: rn(r, c), fill: rl(r, c) });
    return { celdas, resp: celdas[8], desc };
  };

  // ---------- LA REGLA CAMBIÓ ----------
  R.WC_COL = ['#ff5d5d', '#7fe0a0', '#ffd166', '#5fd0e8'];
  R.WC_FIG = ['●', '▲', '★', '■'];
  R.WC_PILAS = [{ color: 0, forma: 0, numero: 1 }, { color: 1, forma: 1, numero: 2 }, { color: 2, forma: 2, numero: 3 }, { color: 3, forma: 3, numero: 4 }];
  R.genWcst = function (tier, h) {
    const n = tier === 1 ? 3 : tier === 2 ? 4 : 5, K = tier === 3 ? 3 : 4, reglas = [];
    let prev = null;
    for (let i = 0; i < n; i++) { const op = ['color', 'forma', 'numero'].filter(x => x !== prev); prev = h.pick(op); reglas.push(prev); }
    const cartas = [];
    while (cartas.length < 80) {
      const c = { color: h.int(0, 3), forma: h.int(0, 3), numero: h.int(1, 4) };
      if (R.WC_PILAS.some(p => p.color === c.color && p.forma === c.forma && p.numero === c.numero)) continue;
      const iguales = R.WC_PILAS.map(p => (p.color === c.color) + (p.forma === c.forma) + (p.numero === c.numero));
      if (iguales.some(x => x >= 2)) continue;
      cartas.push(c);
    }
    return { reglas, K, max: n * K + (tier === 1 ? 14 : tier === 2 ? 12 : 10), cartas, avisa: tier === 1 };
  };
  R.pilaDe = (carta, regla) => R.WC_PILAS.findIndex(p => p[regla] === carta[regla]);

  // ---------- REJILLA DE EINSTEIN ----------
  const PERSONAS = ['Ana', 'Beto', 'Carla', 'Dani', 'Elena', 'Fer'];
  const PROY = ['riego', 'semáforo', 'alarma', 'radar'];
  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves'];
  const perms = n => { const out = [], a = [...Array(n).keys()]; const rec = (k) => { if (k === n) { out.push(a.slice()); return; } for (let i = k; i < n; i++) { [a[k], a[i]] = [a[i], a[k]]; rec(k + 1); [a[k], a[i]] = [a[i], a[k]]; } }; rec(0); return out; };
  R.genEinstein = function (tier, h) {
    const n = tier === 1 ? 3 : 4, dos = tier === 3;
    const P = h.shuffle(PERSONAS).slice(0, n), A = h.shuffle(PROY).slice(0, n), B = h.shuffle(DIAS).slice(0, n);
    const solA = h.shuffle([...Array(n).keys()]), solB = h.shuffle([...Array(n).keys()]);
    const cand = [];
    for (let p = 0; p < n; p++) for (let i = 0; i < n; i++) {
      if (solA[p] === i) cand.push({ t: P[p] + ' hace el proyecto de ' + A[i] + '.', f: (a) => a[p] === i, w: 1 });
      else cand.push({ t: P[p] + ' no hace el proyecto de ' + A[i] + '.', f: (a) => a[p] !== i, w: 3 });
      if (dos) {
        if (solB[p] === i) cand.push({ t: P[p] + ' presenta el ' + B[i] + '.', f: (a, b) => b[p] === i, w: 1 });
        else cand.push({ t: P[p] + ' no presenta el ' + B[i] + '.', f: (a, b) => b[p] !== i, w: 3 });
      }
    }
    if (dos) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const pi = solA.indexOf(i), ok = solB[pi] === j;
      cand.push(ok ? { t: 'Quien hace ' + A[i] + ' presenta el ' + B[j] + '.', f: (a, b) => b[a.indexOf(i)] === j, w: 2 } : { t: 'Quien hace ' + A[i] + ' no presenta el ' + B[j] + '.', f: (a, b) => b[a.indexOf(i)] !== j, w: 2 });
    }
    const PA = perms(n), PB = dos ? perms(n) : [null];
    const cuenta = cl => { let c = 0; for (const a of PA) for (const b of PB) { if (cl.every(q => q.f(a, b))) { c++; if (c > 1) return c; } } return c; };
    const bolsa = []; cand.forEach(q => { for (let k = 0; k < q.w; k++) bolsa.push(q); });
    const orden = h.shuffle(bolsa), pistas = [];
    for (const q of orden) { if (pistas.includes(q)) continue; pistas.push(q); if (cuenta(pistas) === 1) break; }
    for (let i = pistas.length - 1; i >= 0; i--) { const sin = pistas.filter((_, j) => j !== i); if (cuenta(sin) === 1) pistas.splice(i, 1); }
    return { n, dos, P, A, B, solA, solB, pistas: h.shuffle(pistas).map(q => q.t) };
  };

  // ---------- ESTIMACIÓN CON APUESTA ----------
  R.genEstim = function (tier, h, st) {
    st = st || {};
    const pool = {
      1: [{ q: '¿Cuántos minutos tiene una semana?', v: 10080, paso: 10 }, { q: '¿Cuántas baldosas de 50 cm × 50 cm cubren un patio de 20 m × 15 m?', v: 1200, paso: 10 }, { q: '¿Cuántas horas tiene un año de 365 días?', v: 8760, paso: 10 }],
      2: [{ q: '¿Cuántas veces late tu corazón durante una hora clase de 40 minutos? (pulso tranquilo)', v: 2800, paso: 100, tol: 0.2 }, { q: '¿Cuántos pasos de 70 cm hacen falta para recorrer 1 km? (redondeen hacia arriba)', v: 1429, paso: 10 }, { q: '¿Cuántas hojas de papel de 0,1 mm forman una pila de 1 metro?', v: 10000, paso: 100 }],
      3: [{ q: '¿Cuántos litros de agua caben en una piscina de 25 m × 10 m × 2 m?', v: 500000, paso: 5000 }, { q: '¿Cuántos segundos vive una persona de 15 años? (365 días por año)', v: 473040000, paso: 1000000 }, { q: '¿Cuántas horas duerme en un año alguien que duerme 8 horas cada noche?', v: 2920, paso: 10 }]
    };
    const e = h.pick(pool[tier]);
    const base = Math.max(0, Math.round(e.v * 0.3 / e.paso) * e.paso);
    return Object.assign({ min0: Math.max(0, base), max0: Math.max(base, base + e.paso * 2) }, e);
  };
  R.evalEstim = function (d, min, max) {
    const ok = d.v >= min && d.v <= max, ancho = (max - min) / Math.max(1, d.v);
    return { ok, ancho, eff: !ok ? 0 : ancho <= 0.3 ? 1 : ancho <= 0.8 ? 0.75 : 0.5 };
  };

  // ---------- RUTAS DE LA CIUDAD ----------
  R.genRutas = function (tier, h) {
    const C = tier === 1 ? 4 : 5, F = tier === 1 ? 3 : 4, aristas = {};
    const k = (a, b) => a < b ? a + '-' + b : b + '-' + a;
    for (let r = 0; r < F; r++) for (let c = 0; c < C; c++) {
      const id = r * C + c;
      if (c < C - 1) aristas[k(id, id + 1)] = { a: id, b: id + 1, w: h.int(1, 9), obra: false, dir: 'h' };
      if (r < F - 1) aristas[k(id, id + C)] = { a: id, b: id + C, w: h.int(1, 9), obra: false, dir: 'v' };
    }
    const ini = (F - 1) * C, fin = C - 1;
    const dijkstra = () => {
      const dist = Array(C * F).fill(Infinity); dist[ini] = 0; const vis = {};
      for (;;) { let u = -1; dist.forEach((d, i) => { if (!vis[i] && d < Infinity && (u < 0 || d < dist[u])) u = i; }); if (u < 0) break; vis[u] = 1;
        Object.values(aristas).forEach(e => { if (e.obra) return; const v = e.a === u ? e.b : e.b === u ? e.a : -1; if (v >= 0 && dist[u] + e.w < dist[v]) dist[v] = dist[u] + e.w; }); }
      return dist[fin];
    };
    if (tier === 3) { const ks = h.shuffle(Object.keys(aristas)); let puestas = 0; for (const kk of ks) { if (puestas >= 3) break; aristas[kk].obra = true; if (dijkstra() === Infinity) aristas[kk].obra = false; else puestas++; } }
    return { C, F, ini, fin, aristas, opt: dijkstra() };
  };
  R.aristaEntre = (d, a, b) => d.aristas[a < b ? a + '-' + b : b + '-' + a] || null;

  window.ESC_RETOS = R;
})();

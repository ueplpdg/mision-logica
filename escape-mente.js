// Retos de desarrollo del pensamiento para "Escape del Laboratorio" (12 retos, 3 niveles, controles divididos J1/J2).
(function () {
  const J1 = '#5fd0e8', J2 = '#f0a726', OK = '#7fe0a0', ER = '#ff7b72', TX = '#e8f4f8', MU = '#9fb6c0', PAN = '#0f1b26', BG = '#0a141d', LN = 'rgba(232,244,248,.16)';
  const MONO = "'IBM Plex Mono',monospace", HEAD = "'Archivo Black',sans-serif";
  const IDS = ['simon', 'calculo', 'tangram', 'sudoku', 'cubos', 'cerillos', 'stroop', 'tuberias', 'balanza', 'cripto', 'pares', 'laser'];

  function make(React) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const div = (st, ...ch) => h('div', { style: st }, ...ch);
    const P = t => div({ fontSize: 17, color: '#c9dbe2', lineHeight: 1.45, textWrap: 'pretty' }, t);
    const B = t => h('b', { style: { color: TX } }, t);
    const Tag = (j, t) => div({ display: 'flex', alignItems: 'center', gap: 8, border: '2px solid ' + (j === 1 ? J1 : J2), padding: '6px 10px', fontFamily: MONO, fontSize: 13, color: j === 1 ? J1 : J2, fontWeight: 700 }, 'J' + j + ' · ', h('span', { style: { color: TX, fontWeight: 500 } }, t));
    const Ctrls = (...l) => div({ display: 'flex', flexWrap: 'wrap', gap: 8 }, ...l);
    const Stat = (t, c) => div({ fontFamily: MONO, fontSize: 14, color: c || MU, fontWeight: 600, letterSpacing: '.04em' }, t);
    const Box = (st, ...ch) => div(Object.assign({ background: PAN, border: '1px solid ' + LN, padding: 18 }, st || {}), ...ch);
    const Wrap = (...ch) => div({ display: 'flex', flexDirection: 'column', gap: 16 }, ...ch);

    function useKeys(fn) {
      const r = useRef(fn); r.current = fn;
      useEffect(() => {
        const d = e => { if (window.__escPausa) return; if (e.repeat && !/^(Arrow|KeyW|KeyA|KeyS|KeyD)/.test(e.code)) return; r.current(e.code, true, e); };
        const u = e => r.current(e.code, false, e);
        window.addEventListener('keydown', d); window.addEventListener('keyup', u);
        return () => { window.removeEventListener('keydown', d); window.removeEventListener('keyup', u); };
      }, []);
    }
    function useDual(cb) {
      const r = useRef([0, 0]), [, set] = useState(0);
      useEffect(() => { const t = setInterval(() => set(x => x + 1), 400); return () => clearInterval(t); }, []);
      const press = i => { const now = Date.now(); r.current[i] = now; if (r.current[1 - i] && now - r.current[1 - i] < 1500) { r.current = [0, 0]; set(x => x + 1); cb(); } else set(x => x + 1); };
      const now = Date.now();
      return { press, lit: [now - r.current[0] < 1500, now - r.current[1] < 1500] };
    }
    const Dual = (d, label) => div({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontFamily: MONO, fontSize: 13, fontWeight: 700 },
      div({ border: '2px solid ' + J1, background: d.lit[0] ? J1 : 'transparent', color: d.lit[0] ? '#081018' : J1, padding: '8px 12px' }, 'J1 · E'),
      div({ border: '2px solid ' + J2, background: d.lit[1] ? J2 : 'transparent', color: d.lit[1] ? '#081018' : J2, padding: '8px 12px' }, 'J2 · ENTER'),
      div({ color: MU, fontWeight: 500 }, label || 'a la vez para comprobar'));
    function useOnce(p) { const r = useRef(false); return (ok, eff, txt) => { if (r.current || p.fin) return; r.current = true; p.onFin(ok, eff, txt); }; }
    const effBy = (n, a, b) => n <= a ? 1 : n <= b ? 0.75 : 0.5;

    // ---------- 1. SIMON ----------
    const SIM_C = ['#ff5d5d', '#4fd18b', '#5f9dff', '#ffd166'], SIM_K = ['A', 'D', '←', '→'];
    function Simon(p) {
      const T = p.tier, meta = [5, 7, 9][T - 1], vel = [650, 520, 420][T - 1], fin = useOnce(p);
      const [seq] = useState(() => { const a = []; for (let i = 0; i < meta; i++) a.push(p.h.int(0, 3)); return a; });
      const [len, setLen] = useState(3), [fase, setFase] = useState('ver'), [idx, setIdx] = useState(0), [luz, setLuz] = useState(-1), [vidas, setV] = useState(3), [msg, setMsg] = useState('Miren la secuencia…'), [rev, setRev] = useState(0);
      useEffect(() => {
        if (fase !== 'ver' || p.fin) return; let i = 0, alive = true, tm;
        const tick = () => { if (!alive) return; if (i >= len) { setLuz(-1); setFase('tu'); setIdx(0); setMsg(T === 3 ? 'Ahora ustedes: ¡al revés, de la última a la primera!' : 'Ahora ustedes: repitan la secuencia.'); return; }
          setLuz(seq[i]); p.snd('click'); tm = setTimeout(() => { if (!alive) return; setLuz(-1); i++; tm = setTimeout(tick, 170); }, vel); };
        tm = setTimeout(tick, 800); return () => { alive = false; clearTimeout(tm); };
      }, [fase, len, rev]);
      const pulsar = k => {
        if (fase !== 'tu' || p.fin) return; setLuz(k); setTimeout(() => setLuz(-1), 170);
        const esperado = T === 3 ? seq[len - 1 - idx] : seq[idx];
        if (esperado !== k) { const v = vidas - 1; setV(v); p.snd('err'); if (v <= 0) { fin(false, 0, 'Se acabaron las vidas. Llegaron a ' + (len - 1) + ' luces.'); return; } setMsg('¡Error! Vuelvan a mirar.'); setFase('ver'); setRev(r => r + 1); return; }
        if (idx + 1 >= len) { if (len >= meta) { fin(true, vidas === 3 ? 1 : vidas === 2 ? 0.75 : 0.5, 'Recordaron ' + meta + ' luces' + (T === 3 ? ' en orden inverso.' : ' seguidas.')); return; } p.snd('ok'); setMsg('¡Bien! Una luz más…'); setLen(len + 1); setFase('ver'); }
        else setIdx(idx + 1);
      };
      useKeys((c, dn) => { if (!dn) return; const m = { KeyA: 0, KeyD: 1, ArrowLeft: 2, ArrowRight: 3 }; if (m[c] != null) pulsar(m[c]); });
      return Wrap(P(['La terminal muestra una secuencia de luces. ', B('J1'), ' maneja el rojo y el verde; ', B('J2'), ' el azul y el amarillo. Tienen que repetirla entre los dos' + (T === 3 ? ', pero en orden inverso.' : '.')]),
        Ctrls(Tag(1, 'A rojo · D verde'), Tag(2, '← azul · → amarillo')),
        div({ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 14, maxWidth: 640 },
          ...SIM_C.map((c, i) => h('button', { key: i, onClick: () => pulsar(i), style: { aspectRatio: '1', border: '3px solid ' + c, background: luz === i ? c : 'rgba(255,255,255,.03)', boxShadow: luz === i ? '0 0 50px ' + c : 'none', color: luz === i ? '#081018' : c, fontFamily: HEAD, fontSize: 30, cursor: 'pointer', transition: 'background .08s' } }, SIM_K[i]))),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }, Stat('SECUENCIA ' + len + ' / ' + meta), Stat('VIDAS ' + '♥'.repeat(vidas) + '♡'.repeat(3 - vidas), vidas < 2 ? ER : MU), Stat(fase === 'ver' ? '● MIRANDO' : '● SU TURNO · ' + idx + ' / ' + len, fase === 'ver' ? J1 : OK)),
        div({ fontSize: 18, color: TX, fontWeight: 600 }, msg));
    }

    // ---------- 2. CÁLCULO MENTAL ----------
    function genCalc(T, H) {
      const it = [];
      for (let n = 0; n < 4; n++) {
        let A, B, op;
        if (T === 1) { const a = H.int(12, 48), b = H.int(11, 39); A = { t: a + ' + ' + b, v: a + b }; const c = H.int(3, 9), d = H.int(2, 9); B = { t: c + ' × ' + d, v: c * d }; op = '+'; }
        else if (T === 2) { const a = H.int(13, 29), b = H.int(3, 8); A = { t: a + ' × ' + b, v: a * b }; const q = H.int(4, 12), d = H.int(3, 9); B = { t: q * d + ' ÷ ' + d, v: q }; op = '−'; }
        else { const pc = H.pick([10, 20, 25, 50, 75]), base = H.pick([40, 60, 80, 120, 200]); A = { t: pc + ' % de ' + base, v: pc * base / 100 }; const e = H.pick([[2, 5], [2, 6], [3, 3], [3, 4], [5, 3], [4, 3], [2, 7]]); B = { t: e[0] + '^' + e[1], v: Math.pow(e[0], e[1]) }; op = H.pick(['+', '−']); }
        const tot = op === '+' ? A.v + B.v : A.v - B.v;
        const opts = v => { const s = new Set([v]); let g = 0; while (s.size < 4 && g++ < 60) { const d = H.pick([1, 2, 10, -1, -2, -10, 5, -5]); s.add(v + d); } return H.shuffle([...s]); };
        it.push({ A, B, op, tot, oA: opts(A.v), oB: opts(B.v), oT: opts(tot) });
      }
      return it;
    }
    function Calculo(p) {
      const T = p.tier, fin = useOnce(p), lim = [100, 90, 80][T - 1];
      const [it] = useState(() => genCalc(T, p.h));
      const [n, setN] = useState(0), [cA, setCA] = useState(0), [cB, setCB] = useState(0), [lA, setLA] = useState(null), [lB, setLB] = useState(null), [cT, setCT] = useState(0), [res, setRes] = useState([]), [t0] = useState(Date.now()), [, tick] = useState(0);
      useEffect(() => { const t = setInterval(() => tick(x => x + 1), 250); return () => clearInterval(t); }, []);
      const queda = Math.max(0, lim - Math.floor((Date.now() - t0) / 1000));
      const cerrar = r => { const bien = r.filter(Boolean).length; if (bien >= 3) fin(true, bien === 4 ? 1 : 0.75, bien + ' de 4 cálculos correctos en ' + (lim - queda) + ' s.'); else fin(false, 0, 'Solo ' + bien + ' de 4 correctos. Necesitaban 3.'); };
      useEffect(() => { if (queda <= 0 && !p.fin) cerrar(res.concat(Array(4 - res.length).fill(false))); });
      const q = it[Math.min(n, 3)], fase2 = lA != null && lB != null;
      const final = () => { const r = res.concat([q.oT[cT] === q.tot]); p.snd(q.oT[cT] === q.tot ? 'ok' : 'err'); setRes(r); if (r.length >= 4) { cerrar(r); return; } setN(n + 1); setCA(0); setCB(0); setLA(null); setLB(null); setCT(0); };
      useKeys((c, dn) => {
        if (!dn || p.fin) return;
        if (!fase2) { if (lA == null) { if (c === 'KeyA') setCA((cA + 3) % 4); if (c === 'KeyD') setCA((cA + 1) % 4); if (c === 'KeyE') { setLA(q.oA[cA]); p.snd('click'); } }
          if (lB == null) { if (c === 'ArrowLeft') setCB((cB + 3) % 4); if (c === 'ArrowRight') setCB((cB + 1) % 4); if (c === 'Enter') { setLB(q.oB[cB]); p.snd('click'); } } }
        else { if (c === 'KeyA') setCT((cT + 3) % 4); if (c === 'KeyD') setCT((cT + 1) % 4); if (c === 'Enter') final(); }
      });
      const fila = (ops, cur, lock, col, onPick) => div({ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 8 }, ...ops.map((v, i) => h('button', { key: i, onClick: () => onPick(i), style: { border: '2px solid ' + (i === cur ? col : LN), background: lock != null && v === lock ? col : i === cur ? 'rgba(255,255,255,.06)' : BG, color: lock != null && v === lock ? '#081018' : TX, fontFamily: HEAD, fontSize: 22, padding: '12px 4px', cursor: 'pointer' } }, String(v))));
      const half = (j, part, ops, cur, lock, setC, setL) => Box({ border: '2px solid ' + (j === 1 ? J1 : J2), display: 'flex', flexDirection: 'column', gap: 12 },
        Stat('PARTE DE J' + j + (lock != null ? ' · LISTO ✓' : ''), j === 1 ? J1 : J2), div({ fontFamily: HEAD, fontSize: 34, color: TX }, part.t + ' = ?'),
        fila(ops, cur, lock, j === 1 ? J1 : J2, i => { if (lock == null && !fase2) { setC(i); setL(ops[i]); } }));
      return Wrap(P(['Cada uno calcula ', B('su mitad'), ' de cabeza. Cuando los dos tengan su parte, juntan los resultados: ', B('J1 propone'), ' el total y ', B('J2 lo aprueba'), '. Necesitan 3 de 4.']),
        Ctrls(Tag(1, 'A · D elegir · E fijar · total: A · D'), Tag(2, '← · → elegir · ENTER fijar · aprobar total: ENTER')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('CÁLCULO ' + (Math.min(n, 3) + 1) + ' / 4'), Stat('TIEMPO ' + queda + ' s', queda < 15 ? ER : MU), Stat('ACIERTOS ' + res.filter(Boolean).length, OK)),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 14 }, half(1, q.A, q.oA, cA, lA, setCA, setLA), half(2, q.B, q.oB, cB, lB, setCB, setLB)),
        fase2 ? Box({ border: '2px solid ' + OK, display: 'flex', flexDirection: 'column', gap: 12 }, Stat('TOTAL · J1 PROPONE · J2 APRUEBA', OK), div({ fontFamily: HEAD, fontSize: 30 }, lA + ' ' + q.op + ' ' + lB + ' = ?'),
          fila(q.oT, cT, null, OK, i => setCT(i)), h('button', { onClick: final, style: { alignSelf: 'flex-start', background: OK, border: 'none', fontFamily: HEAD, fontSize: 17, padding: '10px 20px', cursor: 'pointer', color: '#081018' } }, 'J2 aprueba (ENTER)')) : null);
    }

    // ---------- 3. TANGRAM DE BLOQUES ----------
    const PZC = ['#5fd0e8', '#f0a726', '#7fe0a0', '#c58cf0', '#ff7b72', '#ffd166'];
    const norm = cs => { const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); return cs.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
    const rot = cs => norm(cs.map(([x, y]) => [-y, x]));
    function genTangram(T, H) {
      const k = [3, 4, 5][T - 1], N = 7;
      for (let it = 0; it < 200; it++) {
        const own = {}, pcs = [], key = (x, y) => x + ',' + y;
        let ok = true;
        for (let i = 0; i < k && ok; i++) {
          const sz = H.int(3, T === 1 ? 4 : 5); let start;
          if (i === 0) start = [3, 3]; else { const fr = []; Object.keys(own).forEach(kk => { const [x, y] = kk.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N && !own[key(nx, ny)]) fr.push([nx, ny]); }); }); if (!fr.length) { ok = false; break; } start = H.pick(fr); }
          const cells = [start]; own[key(...start)] = i + 1;
          for (let g = 0; cells.length < sz && g < 60; g++) { const [x, y] = H.pick(cells), [dx, dy] = H.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N && !own[key(nx, ny)]) { cells.push([nx, ny]); own[key(nx, ny)] = i + 1; } }
          if (cells.length < 3) ok = false; pcs.push(cells);
        }
        if (!ok) continue;
        const all = [].concat(...pcs), mx = Math.min(...all.map(c => c[0])), my = Math.min(...all.map(c => c[1]));
        const reg = all.map(([x, y]) => [x - mx, y - my]), W = Math.max(...reg.map(c => c[0])) + 1, Hh = Math.max(...reg.map(c => c[1])) + 1;
        if (W > 6 || Hh > 6 || W * Hh === reg.length) continue;
        const piezas = pcs.map(cs => { let c = norm(cs); for (let r = H.int(0, 3); r > 0; r--) c = rot(c); return c; });
        return { W, H: Hh, reg: reg.map(c => c.join(',')), piezas };
      }
      return { W: 3, H: 3, reg: ['0,0', '1,0', '2,0', '0,1', '1,1', '0,2', '1,2', '2,2', '2,1'].slice(0, 9), piezas: [[[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1]]] };
    }
    function Tangram(p) {
      const T = p.tier, fin = useOnce(p);
      const [d] = useState(() => genTangram(T, p.h));
      const [pz, setPz] = useState(() => d.piezas.map(c => ({ c, at: null }))), [sel, setSel] = useState(0), [cur, setCur] = useState([0, 0]), [err, setErr] = useState(0), [fl, setFl] = useState(null);
      const reg = new Set(d.reg), W = d.W + 2, Hh = d.H + 2, OFF = 1;
      const ocup = (excl) => { const m = {}; pz.forEach((q, i) => { if (i !== excl && q.at) q.c.forEach(([x, y]) => { m[(x + q.at[0]) + ',' + (y + q.at[1])] = i; }); }); return m; };
      const valida = (i, at) => { const m = ocup(i); return pz[i].c.every(([x, y]) => { const k = (x + at[0] - OFF) + ',' + (y + at[1] - OFF); return reg.has(k) && m[(x + at[0]) + ',' + (y + at[1])] == null; }); };
      const poner = (at) => {
        if (p.fin) return; const q = pz[sel]; if (!q) return;
        if (q.at) { const n = pz.slice(); n[sel] = { c: q.c, at: null }; setPz(n); p.snd('click'); return; }
        if (!valida(sel, at)) { setErr(err + 1); setFl(Date.now()); p.snd('err'); return; }
        const n = pz.slice(); n[sel] = { c: q.c, at }; setPz(n); p.snd('click');
        if (n.every(x => x.at)) { fin(true, effBy(err, 2, 6), 'Silueta completa con ' + n.length + ' piezas y ' + err + ' intentos fallidos.'); return; }
        const sig = n.findIndex(x => !x.at); if (sig >= 0) setSel(sig);
      };
      const girar = () => { if (p.fin) return; const n = pz.slice(), q = n[sel]; if (q.at) return; n[sel] = { c: rot(q.c), at: null }; setPz(n); p.snd('click'); };
      useKeys((c, dn) => {
        if (!dn || p.fin) return;
        const mv = { KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] }[c];
        if (mv) setCur([Math.max(0, Math.min(W - 1, cur[0] + mv[0])), Math.max(0, Math.min(Hh - 1, cur[1] + mv[1]))]);
        if (c === 'KeyE') girar();
        if (c === 'ArrowLeft') setSel((sel + pz.length - 1) % pz.length);
        if (c === 'ArrowRight') setSel((sel + 1) % pz.length);
        if (c === 'Enter') poner(cur);
      });
      const m = ocup(-1), S = 44, ghost = {};
      if (pz[sel] && !pz[sel].at) { const okG = valida(sel, cur); pz[sel].c.forEach(([x, y]) => { ghost[(x + cur[0]) + ',' + (y + cur[1])] = okG; }); }
      const celdas = [];
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
        const k = x + ',' + y, enReg = reg.has((x - OFF) + ',' + (y - OFF)), pi = m[k], g = ghost[k];
        celdas.push(h('div', { key: k, onClick: () => { if (pi != null) { const n = pz.slice(); n[pi] = { c: pz[pi].c, at: null }; setPz(n); setSel(pi); p.snd('click'); return; } setCur([x, y]); poner([x, y]); }, style: { width: S, height: S, boxSizing: 'border-box', background: pi != null ? PZC[pi % 6] : g != null ? (g ? 'rgba(127,224,160,.45)' : 'rgba(255,123,114,.45)') : enReg ? 'rgba(232,244,248,.1)' : 'transparent', border: enReg ? '1px dashed rgba(232,244,248,.35)' : '1px solid rgba(232,244,248,.04)', outline: cur[0] === x && cur[1] === y ? '3px solid ' + J1 : 'none', outlineOffset: -3, cursor: 'pointer' } }));
      }
      const mini = (q, i) => { const w = Math.max(...q.c.map(c => c[0])) + 1, hh = Math.max(...q.c.map(c => c[1])) + 1, s = new Set(q.c.map(c => c.join(','))), out = [];
        for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) out.push(h('div', { key: x + '-' + y, style: { width: 16, height: 16, background: s.has(x + ',' + y) ? PZC[i % 6] : 'transparent' } }));
        return h('button', { key: i, onClick: () => setSel(i), style: { display: 'grid', gridTemplateColumns: 'repeat(' + w + ',16px)', gap: 2, padding: 10, background: BG, border: '2px solid ' + (i === sel ? J2 : LN), opacity: q.at ? 0.35 : 1, cursor: 'pointer' } }, ...out); };
      return Wrap(P(['Cubran la ', B('silueta punteada'), ' con todas las piezas, sin dejar huecos ni salirse. ', B('J1'), ' mueve el cursor y gira la pieza; ', B('J2'), ' elige la pieza y la coloca. Si eligen una pieza ya puesta, ENTER la saca (o hagan clic sobre ella).']),
        Ctrls(Tag(1, 'W A S D cursor · E girar'), Tag(2, '← → pieza · ENTER colocar / sacar')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'flex-start' },
          div({ display: 'grid', gridTemplateColumns: 'repeat(' + W + ',' + S + 'px)', gap: 0, background: BG, padding: 10, border: '1px solid ' + LN, boxShadow: fl && Date.now() - fl < 400 ? '0 0 0 3px ' + ER : 'none' }, ...celdas),
          div({ display: 'flex', flexDirection: 'column', gap: 10 }, Stat('PIEZAS · J2 ELIGE', J2), div({ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 360 }, ...pz.map(mini)), Stat('INTENTOS FALLIDOS ' + err, err > 6 ? ER : MU))));
    }

    // ---------- 4. SUDOKU ----------
    function genSudoku(T, H) {
      const n = T === 3 ? 6 : 4, bw = T === 3 ? 3 : 2, bh = 2;
      const dig = H.shuffle([...Array(n).keys()].map(x => x + 1));
      let rows = []; const bands = H.shuffle([...Array(n / bh).keys()]); bands.forEach(b => H.shuffle([...Array(bh).keys()]).forEach(r => rows.push(b * bh + r)));
      let cols = []; const st = H.shuffle([...Array(n / bw).keys()]); st.forEach(b => H.shuffle([...Array(bw).keys()]).forEach(c => cols.push(b * bw + c)));
      const base = (r, c) => (bw * (r % bh) + Math.floor(r / bh) + c) % n;
      const sol = rows.map(r => cols.map(c => dig[base(r, c)]));
      const vac = [6, 9, 18][T - 1], idx = H.shuffle([...Array(n * n).keys()]).slice(0, vac);
      const giv = sol.map(r => r.slice()); idx.forEach(i => { giv[Math.floor(i / n)][i % n] = 0; });
      return { n, bw, bh, sol, giv };
    }
    function Sudoku(p) {
      const T = p.tier, fin = useOnce(p);
      const [d] = useState(() => genSudoku(T, p.h));
      const [g, setG] = useState(() => d.giv.map(r => r.slice())), [cur, setCur] = useState([0, 0]), [checks, setChecks] = useState(0), [malas, setMalas] = useState(null);
      const n = d.n;
      const conflict = (gr, r, c) => { const v = gr[r][c]; if (!v) return false; for (let i = 0; i < n; i++) { if (i !== c && gr[r][i] === v) return true; if (i !== r && gr[i][c] === v) return true; } const r0 = r - r % d.bh, c0 = c - c % d.bw; for (let y = r0; y < r0 + d.bh; y++) for (let x = c0; x < c0 + d.bw; x++) if ((y !== r || x !== c) && gr[y][x] === v) return true; return false; };
      const comprobar = () => {
        if (p.fin) return; const vac = g.flat().filter(v => !v).length;
        let mal = 0; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (conflict(g, r, c)) mal++;
        if (!vac && !mal) { fin(true, checks === 0 ? 1 : checks === 1 ? 0.75 : 0.5, 'Tablero completo y sin repetidos.'); return; }
        const k = checks + 1; setChecks(k); setMalas(mal);
        if (k >= 3) { fin(false, 0, 'Tres comprobaciones fallidas.'); return; }
        p.onErr((vac ? 'Faltan ' + vac + ' casillas. ' : '') + (mal ? 'Hay ' + mal + ' casillas que chocan con otra.' : ''), -4);
      };
      const dual = useDual(comprobar);
      const cambiar = dlt => { if (p.fin) return; const [r, c] = cur; if (d.giv[r][c]) return; const ng = g.map(x => x.slice()); ng[r][c] = (ng[r][c] + dlt + n + 1) % (n + 1); setG(ng); setMalas(null); p.snd('click'); };
      useKeys((c, dn) => {
        if (!dn || p.fin) return;
        const mv = { KeyW: [-1, 0], KeyS: [1, 0], KeyA: [0, -1], KeyD: [0, 1] }[c];
        if (mv) setCur([Math.max(0, Math.min(n - 1, cur[0] + mv[0])), Math.max(0, Math.min(n - 1, cur[1] + mv[1]))]);
        if (c === 'ArrowUp' || c === 'ArrowRight') cambiar(1); if (c === 'ArrowDown' || c === 'ArrowLeft') cambiar(-1);
        if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1);
      });
      const S = n === 6 ? 58 : 72, cells = [];
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const fijo = !!d.giv[r][c], v = g[r][c], sel = cur[0] === r && cur[1] === c, cf = T === 1 && conflict(g, r, c);
        cells.push(h('div', { key: r + '-' + c, onClick: () => setCur([r, c]), style: { width: S, height: S, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: S * 0.48, color: cf ? ER : fijo ? TX : J2, background: sel ? 'rgba(95,208,232,.2)' : fijo ? 'rgba(232,244,248,.06)' : BG, borderRight: (c + 1) % d.bw === 0 && c < n - 1 ? '3px solid ' + TX : '1px solid ' + LN, borderBottom: (r + 1) % d.bh === 0 && r < n - 1 ? '3px solid ' + TX : '1px solid ' + LN, outline: sel ? '3px solid ' + J1 : 'none', outlineOffset: -3, cursor: 'pointer' } }, v ? String(v) : ''));
      }
      return Wrap(P(['Completen el tablero: en cada fila, columna y bloque van los números del 1 al ' + n + ' sin repetir. ', B('J1'), ' mueve el cursor y ', B('J2'), ' cambia el número. Tienen 3 comprobaciones.' + (T === 1 ? ' En este nivel, los repetidos se ven en rojo.' : '')]),
        Ctrls(Tag(1, 'W A S D mover'), Tag(2, '↑ ↓ cambiar número')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'center' },
          div({ display: 'grid', gridTemplateColumns: 'repeat(' + n + ',' + S + 'px)', border: '3px solid ' + TX }, ...cells),
          div({ display: 'flex', flexDirection: 'column', gap: 12 }, Stat('COMPROBACIONES ' + checks + ' / 3', checks ? ER : MU), malas != null ? Stat(malas + ' en conflicto', malas ? ER : OK) : null, Dual(dual))));
    }

    // ---------- 5. CUBOS OCULTOS ----------
    function genCubos(T, H) {
      const R = [3, 3, 4][T - 1], C = [3, 4, 4][T - 1], mx = [2, 3, 4][T - 1], hm = [];
      for (let r = 0; r < R; r++) { hm.push([]); for (let c = 0; c < C; c++) hm[r].push(H.int(T === 1 ? 0 : 0, mx)); }
      hm[0][0] = Math.max(1, hm[0][0]); hm[R - 1][C - 1] = Math.max(1, hm[R - 1][C - 1]);
      const tot = hm.flat().reduce((a, b) => a + b, 0), top = Math.max(...hm.flat());
      return T === 3 ? { hm, R, C, preg: '¿Cuántos cubos FALTAN para completar un prisma de ' + C + ' × ' + R + ' × ' + top + '?', resp: R * C * top - tot } : { hm, R, C, preg: '¿Cuántos cubos hay en total?', resp: tot };
    }
    function isoSvg(hm, vista, S) {
      let g = hm; for (let k = 0; k < vista; k++) { const R = g.length, C = g[0].length, n = []; for (let c = 0; c < C; c++) { n.push([]); for (let r = R - 1; r >= 0; r--) n[c].push(g[r][c]); } g = n; }
      const R = g.length, C = g[0].length, items = [];
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) for (let z = 0; z < g[r][c]; z++) items.push([c, r, z]);
      items.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[2] - b[2]);
      const cx = R * S * 0.87 + 20, cy = 40 + 4 * S, pt = (x, y, z) => [cx + (x - y) * S * 0.87, cy + (x + y) * S * 0.5 - z * S];
      const poly = (pts, f) => h('polygon', { points: pts.map(q => q.join(',')).join(' '), fill: f, stroke: '#0a141d', strokeWidth: 1.5, strokeLinejoin: 'round' });
      const W = (R + C) * S * 0.87 + 40, Ht = cy + (R + C) * S * 0.5 + 20;
      const piso = []; for (let r = 0; r <= R; r++) piso.push(h('line', { key: 'r' + r, x1: pt(0, r, 0)[0], y1: pt(0, r, 0)[1], x2: pt(C, r, 0)[0], y2: pt(C, r, 0)[1], stroke: 'rgba(232,244,248,.18)' }));
      for (let c = 0; c <= C; c++) piso.push(h('line', { key: 'c' + c, x1: pt(c, 0, 0)[0], y1: pt(c, 0, 0)[1], x2: pt(c, R, 0)[0], y2: pt(c, R, 0)[1], stroke: 'rgba(232,244,248,.18)' }));
      return h('svg', { viewBox: '0 0 ' + W + ' ' + Ht, style: { width: '100%', maxWidth: 520, height: 'auto', display: 'block' } }, ...piso, ...items.map(([x, y, z], i) => h('g', { key: i },
        poly([pt(x, y, z + 1), pt(x + 1, y, z + 1), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)], '#9ee7f5'),
        poly([pt(x, y + 1, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)], '#3a9bbd'),
        poly([pt(x + 1, y, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x + 1, y, z + 1)], '#2a6f8a'))));
    }
    function Cubos(p) {
      const T = p.tier, fin = useOnce(p);
      const [d] = useState(() => genCubos(T, p.h));
      const [vista, setVista] = useState(0), [v, setV] = useState(0), [int, setInt] = useState(0);
      const probar = () => { if (p.fin) return; if (v === d.resp) { fin(true, int === 0 ? 1 : int === 1 ? 0.75 : 0.5, 'Eran ' + d.resp + ' cubos.'); return; } const k = int + 1; setInt(k); if (k >= 3) { fin(false, 0, 'La respuesta era ' + d.resp + '.'); return; } p.onErr('No son ' + v + '. ' + (v < d.resp ? 'Hay más: piensen en los cubos que sostienen a los de arriba.' : 'Son menos.'), -4); };
      const dual = useDual(probar);
      useKeys((c, dn) => { if (!dn || p.fin) return; if (c === 'KeyA') setVista((vista + 3) % 4); if (c === 'KeyD') setVista((vista + 1) % 4); if (c === 'ArrowUp') setV(v + 1); if (c === 'ArrowDown') setV(Math.max(0, v - 1)); if (c === 'ArrowRight') setV(v + 5); if (c === 'ArrowLeft') setV(Math.max(0, v - 5)); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return Wrap(P(['Una torre de cubos en el graderío. Ningún cubo flota: todos se apoyan en otro o en el piso. ', B('J1'), ' gira la torre para ver los lados escondidos; ', B('J2'), ' escribe la respuesta. Tienen 3 intentos.']),
        Ctrls(Tag(1, 'A · D girar la vista'), Tag(2, '↑ ↓ ±1 · ← → ±5')),
        div({ fontFamily: HEAD, fontSize: 22, color: TX }, d.preg),
        div({ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }, Box({ flex: '1 1 320px', maxWidth: 560 }, isoSvg(d.hm, vista, 34), Stat('VISTA ' + (vista + 1) + ' DE 4', J1)),
          div({ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }, div({ fontFamily: HEAD, fontSize: 72, color: J2, lineHeight: 1 }, String(v)), Stat('INTENTOS ' + int + ' / 3', int ? ER : MU), Dual(dual))));
    }

    // ---------- 6. CERILLOS ----------
    const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
    const MASK = {}; Object.keys(SEG).forEach(d => { MASK[SEG[d].split('').sort().join('')] = +d; });
    const SL = 'abcdefg'.split('');
    function genCerillos(T, H) {
      for (let it = 0; it < 4000; it++) {
        let a, b, op, c, tok;
        if (T === 1) { a = H.int(1, 9); b = H.int(0, 9); op = H.pick(['+', '-']); c = op === '+' ? a + b : a - b; if (c < 0 || c > 9) continue; tok = [[a], op, [b], [c]]; }
        else { a = H.int(10, 39); b = H.int(1, 9); op = H.pick(['+', '-']); c = op === '+' ? a + b : a - b; if (c < 10 || c > 99) continue; tok = [String(a).split('').map(Number), op, [b], String(c).split('').map(Number)]; }
        const slots = []; tok.forEach((t, ti) => { if (Array.isArray(t)) t.forEach((dg, di) => SL.forEach(s => slots.push({ ti, di, s, on: SEG[dg].includes(s) }))); else slots.push({ ti, di: 0, s: 'op', on: t === '+' }); });
        const k = T === 3 ? 2 : 1; let st = slots.map(x => x.on);
        for (let m = 0; m < k; m++) { const on = st.map((v, i) => v ? i : -1).filter(i => i >= 0), off = st.map((v, i) => v ? -1 : i).filter(i => i >= 0); const f = H.pick(on), t = H.pick(off); st = st.slice(); st[f] = false; st[t] = true; }
        const r = evalC(slots, st); if (!r.valido || r.ok) continue;
        return { slots, ini: st, k };
      }
      return null;
    }
    function evalC(slots, st) {
      const g = {}; slots.forEach((x, i) => { const k = x.ti + ':' + x.di; if (x.s === 'op') g[k] = { op: st[i] ? '+' : '-' }; else { g[k] = g[k] || { m: [] }; if (st[i]) g[k].m.push(x.s); } });
      let txt = '', valido = true; const nums = [[], [], [], []]; let op = '+';
      Object.keys(g).forEach(k => { const [ti] = k.split(':').map(Number), o = g[k]; if (o.op) { op = o.op; return; } const d = MASK[o.m.sort().join('')]; if (d == null) valido = false; else nums[ti].push(d); });
      if (!valido) return { valido };
      const n = t => Number(nums[t].join('')), A = n(0), Bv = n(2), Cv = n(3);
      return { valido, ok: (op === '+' ? A + Bv : A - Bv) === Cv, txt: A + ' ' + op + ' ' + Bv + ' = ' + Cv };
    }
    function Cerillos(p) {
      const T = p.tier, fin = useOnce(p);
      const [d] = useState(() => genCerillos(T, p.h));
      const [st, setSt] = useState(d ? d.ini.slice() : []), [mano, setMano] = useState(0), [mov, setMov] = useState(0), [c1, setC1] = useState(0), [c2, setC2] = useState(0), [int, setInt] = useState(0);
      if (!d) return P('No se pudo generar la ecuación.');
      const onI = st.map((v, i) => v ? i : -1).filter(i => i >= 0), offI = st.map((v, i) => v ? -1 : i).filter(i => i >= 0);
      const levantar = i => { if (p.fin || mano >= d.k || mov >= d.k || !st[i]) return; const n = st.slice(); n[i] = false; setSt(n); setMano(mano + 1); p.snd('click'); };
      const soltar = i => {
        if (p.fin || !mano || st[i]) return; const n = st.slice(); n[i] = true; setSt(n); setMano(mano - 1); const mv = mov + 1; setMov(mv); p.snd('click');
        if (mv >= d.k) { const r = evalC(d.slots, n); if (r.valido && r.ok) { fin(true, int === 0 ? 1 : int === 1 ? 0.75 : 0.5, 'Quedó ' + r.txt + '.'); return; }
          const k = int + 1; setInt(k); if (k >= 3) { fin(false, 0, 'No lograron corregir la operación.'); return; }
          p.onErr(r.valido ? 'Quedó ' + r.txt + ', que no es verdad. Se reinicia.' : 'Algún número quedó mal formado. Se reinicia.', -4); setTimeout(() => { setSt(d.ini.slice()); setMov(0); setMano(0); }, 900); }
      };
      useKeys((c, dn) => {
        if (!dn || p.fin) return;
        if (c === 'KeyA') setC1((c1 + onI.length - 1) % Math.max(1, onI.length)); if (c === 'KeyD') setC1((c1 + 1) % Math.max(1, onI.length)); if (c === 'KeyE') levantar(onI[c1 % onI.length]);
        if (c === 'ArrowLeft') setC2((c2 + offI.length - 1) % Math.max(1, offI.length)); if (c === 'ArrowRight') setC2((c2 + 1) % Math.max(1, offI.length)); if (c === 'Enter') soltar(offI[c2 % offI.length]);
      });
      const sel1 = onI[c1 % Math.max(1, onI.length)], sel2 = offI[c2 % Math.max(1, offI.length)];
      const GEO = { a: [8, 0, 44, 8], b: [52, 6, 8, 44], c: [52, 54, 8, 44], d: [8, 96, 44, 8], e: [0, 54, 8, 44], f: [0, 6, 8, 44], g: [8, 48, 44, 8] };
      let x = 10; const els = [], pos = {};
      d.slots.forEach((s, i) => { const k = s.ti + ':' + s.di; if (pos[k] == null) { if (s.ti === 3 && !pos.eq) { pos.eq = x; x += 64; } pos[k] = x; x += s.s === 'op' ? 64 : 80; } });
      d.slots.forEach((s, i) => {
        const ox = pos[s.ti + ':' + s.di], on = st[i], hl = i === sel1 && on ? J1 : i === sel2 && !on ? J2 : null;
        const [gx, gy, w, hh] = s.s === 'op' ? [ox + 22, 30, 8, 44] : GEO[s.s];
        const rx = s.s === 'op' ? gx : ox + gx, ry = s.s === 'op' ? gy : 10 + gy;
        els.push(h('rect', { key: 's' + i, x: rx, y: ry, width: w, height: hh, rx: 3, fill: on ? '#f1d9a8' : 'transparent', stroke: hl || (on ? '#c9a46a' : 'rgba(232,244,248,.18)'), strokeWidth: hl ? 4 : 1.5, strokeDasharray: on ? '' : '4 4', onClick: () => on ? levantar(i) : soltar(i), style: { cursor: 'pointer' } }));
        if (on) { const vert = hh > w; els.push(h('circle', { key: 't' + i, cx: vert ? rx + w / 2 : rx + w - 4, cy: vert ? ry + 4 : ry + hh / 2, r: 4.5, fill: '#e2543d', pointerEvents: 'none' })); }
        if (s.s === 'op') els.push(h('rect', { key: 'h' + i, x: ox + 4, y: 48, width: 44, height: 8, rx: 3, fill: '#f1d9a8' }));
      });
      els.push(h('rect', { key: 'e1', x: pos.eq + 6, y: 40, width: 44, height: 8, rx: 3, fill: '#f1d9a8' }), h('rect', { key: 'e2', x: pos.eq + 6, y: 58, width: 44, height: 8, rx: 3, fill: '#f1d9a8' }));
      return Wrap(P(['La operación de fósforos es falsa. Muevan ', B(d.k === 1 ? '1 fósforo' : '2 fósforos'), ' para que sea verdadera. ', B('J1'), ' levanta un fósforo y ', B('J2'), ' lo deja en un espacio vacío. El igual no se mueve. Tienen 3 intentos.']),
        Ctrls(Tag(1, 'A · D elegir fósforo · E levantar'), Tag(2, '← · → elegir espacio · ENTER soltar')),
        Box({ overflowX: 'auto' }, h('svg', { viewBox: '0 0 ' + (x + 10) + ' 124', style: { width: '100%', maxWidth: (x + 10) * 1.6, height: 'auto', display: 'block' } }, ...els)),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('MOVIDOS ' + mov + ' / ' + d.k), Stat('EN LA MANO ' + mano, mano ? J2 : MU), Stat('INTENTOS ' + int + ' / 3', int ? ER : MU)));
    }

    // ---------- 7. STROOP ----------
    const SC = [['ROJO', '#ff5d5d'], ['VERDE', '#4fd18b'], ['AZUL', '#5f9dff'], ['AMARILLO', '#ffd166']];
    function Stroop(p) {
      const T = p.tier, fin = useOnce(p), N = [12, 14, 16][T - 1], tmax = [4000, 3200, 2600][T - 1];
      const [items] = useState(() => [...Array(N)].map(() => { const w = p.h.int(0, 3); let k = p.h.int(0, 3); if (p.h.int(0, 99) < 75) while (k === w) k = p.h.int(0, 3); return { w, k, regla: T === 1 ? 'tinta' : p.h.int(0, 99) < 45 ? 'palabra' : 'tinta' }; }));
      const [i, setI] = useState(-1), [ok, setOk] = useState(0), [fb, setFb] = useState(null), [t0, setT0] = useState(0), [, tick] = useState(0);
      useEffect(() => { const t = setInterval(() => tick(x => x + 1), 100); return () => clearInterval(t); }, []);
      useEffect(() => { if (i === -1) { const t = setTimeout(() => { setI(0); setT0(Date.now()); }, 2500); return () => clearTimeout(t); } }, [i]);
      const sig = (bien) => { const nok = ok + (bien ? 1 : 0); setOk(nok); setFb(bien); p.snd(bien ? 'click' : 'err');
        setTimeout(() => { setFb(null); if (i + 1 >= N) { const r = nok / N; if (r >= 0.7) fin(true, r >= 0.9 ? 1 : r >= 0.8 ? 0.75 : 0.5, nok + ' de ' + N + ' respuestas correctas.'); else fin(false, 0, 'Solo ' + nok + ' de ' + N + '. Necesitaban el 70 %.'); return; } setI(i + 1); setT0(Date.now()); }, 350); };
      useEffect(() => { if (i >= 0 && i < N && fb == null && !p.fin && Date.now() - t0 > tmax) sig(false); });
      const it = items[Math.max(0, Math.min(i, N - 1))], resp = it.regla === 'tinta' ? it.k : it.w;
      useKeys((c, dn) => { if (!dn || p.fin || i < 0 || fb != null) return; const m = { KeyA: 0, KeyD: 1, ArrowLeft: 2, ArrowRight: 3 }[c]; if (m != null) sig(m === resp); });
      const pct = i >= 0 ? Math.max(0, 1 - (Date.now() - t0) / tmax) : 1;
      return Wrap(P(['Respondan el ', B('color de la tinta'), ', no lo que dice la palabra.' + (T > 1 ? ' Pero si la palabra aparece dentro de un ' : ''), T > 1 ? B('círculo') : '', T > 1 ? ', respondan lo que dice la palabra.' : '', ' Cada color tiene dueño: estén atentos los dos. Necesitan 70 %.']),
        Ctrls(Tag(1, 'A rojo · D verde'), Tag(2, '← azul · → amarillo')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('PALABRA ' + Math.max(1, Math.min(i + 1, N)) + ' / ' + N), Stat('ACIERTOS ' + ok, OK)),
        Box({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 30, border: '2px solid ' + (fb == null ? LN : fb ? OK : ER) },
          i < 0 ? div({ fontFamily: HEAD, fontSize: 40, color: MU }, 'Prepárense…') :
            div({ fontFamily: HEAD, fontSize: 64, color: SC[it.k][1], padding: '18px 40px', border: T > 1 ? '4px solid ' + TX : 'none', borderRadius: it.regla === 'palabra' ? 999 : 0, minWidth: 340, textAlign: 'center' }, SC[it.w][0]),
          div({ width: '100%', maxWidth: 420, height: 8, background: 'rgba(232,244,248,.1)' }, div({ width: (pct * 100) + '%', height: '100%', background: pct < 0.3 ? ER : J1 }))),
        div({ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, maxWidth: 640 }, ...SC.map(([n, c], k) => div({ key: k, border: '2px solid ' + (k < 2 ? J1 : J2), padding: '10px 6px', textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 13, color: c }, ['A', 'D', '←', '→'][k] + ' · ' + n))));
    }

    // ---------- 8. TUBERÍAS ----------
    const NN = 1, EE = 2, SS = 4, WW = 8, DIRS = [[NN, 0, -1, SS], [EE, 1, 0, WW], [SS, 0, 1, NN], [WW, -1, 0, EE]];
    const rotM = m => ((m << 1) | (m >> 3)) & 15;
    function genTub(T, H) {
      const n = [4, 5, 6][T - 1];
      for (let it = 0; it < 500; it++) {
        const sr = H.int(0, n - 1), er = H.int(0, n - 1), path = [[0, sr]], vis = { ['0,' + sr]: 1 };
        let ok = false;
        const dfs = (x, y, dep) => { if (x === n - 1 && y === er && dep >= n + 1) return true; if (dep > n * n) return false;
          const opts = H.shuffle(DIRS.slice()).sort((a, b) => (b[1] - a[1]) * (H.int(0, 99) < 55 ? 1 : 0));
          for (const [, dx, dy] of opts) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n || vis[nx + ',' + ny]) continue; vis[nx + ',' + ny] = 1; path.push([nx, ny]); if (dfs(nx, ny, dep + 1)) return true; path.pop(); delete vis[nx + ',' + ny]; }
          return false; };
        ok = dfs(0, sr, 0); if (!ok || path.length > n * n * 0.7) continue;
        const sol = Array(n * n).fill(0), onP = {};
        path.forEach(([x, y], i) => { let m = 0; const pv = i === 0 ? [-1, sr] : path[i - 1], nx = i === path.length - 1 ? [n, er] : path[i + 1];
          [pv, nx].forEach(([qx, qy]) => { DIRS.forEach(([b, dx, dy]) => { if (qx === x + dx && qy === y + dy) m |= b; }); }); sol[y * n + x] = m; onP[y * n + x] = 1; });
        for (let i = 0; i < n * n; i++) if (!onP[i]) sol[i] = H.pick(T === 3 ? [5, 10, 3, 6, 12, 9, 7, 14] : [5, 10, 3, 6, 12, 9]);
        const cur = sol.map(m => { let r = m; for (let k = H.int(0, 3); k > 0; k--) r = rotM(r); return r; });
        let minR = 0; path.forEach(([x, y]) => { let r = cur[y * n + x], k = 0; while (r !== sol[y * n + x] && k < 4) { r = rotM(r); k++; } minR += k; });
        if (minR < 3) continue;
        return { n, sr, er, cur, minR };
      }
      return null;
    }
    function flujo(n, sr, er, g) {
      const lleno = {}, q = []; if (g[sr * n] & WW) { lleno[sr * n] = 1; q.push([0, sr]); }
      while (q.length) { const [x, y] = q.shift(), m = g[y * n + x]; DIRS.forEach(([b, dx, dy, op]) => { if (!(m & b)) return; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= n || ny >= n) return; const k = ny * n + nx; if (!lleno[k] && (g[k] & op)) { lleno[k] = 1; q.push([nx, ny]); } }); }
      return { lleno, gana: !!lleno[er * n + n - 1] && !!(g[er * n + n - 1] & EE) };
    }
    function Tuberias(p) {
      const T = p.tier, fin = useOnce(p);
      const [d] = useState(() => genTub(T, p.h));
      const [g, setG] = useState(d ? d.cur.slice() : []), [c1, setC1] = useState([0, 0]), [c2, setC2] = useState(d ? [d.n - 1, 0] : [0, 0]), [giros, setGiros] = useState(0);
      if (!d) return P('No se pudo generar el tablero.');
      const n = d.n, mitad = Math.ceil(n / 2), F = flujo(n, d.sr, d.er, g);
      const girar = (x, y) => { if (p.fin) return; const ng = g.slice(); ng[y * n + x] = rotM(ng[y * n + x]); setG(ng); const k = giros + 1; setGiros(k); p.snd('click');
        if (flujo(n, d.sr, d.er, ng).gana) fin(true, effBy(k, d.minR + 4, d.minR + 12), '¡El agua llegó a la planta! ' + k + ' giros (el mínimo era ' + d.minR + ').'); };
      useKeys((c, dn) => {
        if (!dn || p.fin) return;
        const m1 = { KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] }[c], m2 = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[c];
        if (m1) setC1([Math.max(0, Math.min(mitad - 1, c1[0] + m1[0])), Math.max(0, Math.min(n - 1, c1[1] + m1[1]))]);
        if (m2) setC2([Math.max(mitad, Math.min(n - 1, c2[0] + m2[0])), Math.max(0, Math.min(n - 1, c2[1] + m2[1]))]);
        if (c === 'KeyE') girar(c1[0], c1[1]); if (c === 'Enter') girar(c2[0], c2[1]);
      });
      const S = n === 6 ? 62 : 72, tiles = [];
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const m = g[y * n + x], w = !!F.lleno[y * n + x], col = w ? '#4fc3ff' : '#8a9aa3', sel = c1[0] === x && c1[1] === y ? J1 : c2[0] === x && c2[1] === y ? J2 : null;
        const bars = []; if (m & NN) bars.push([S / 2 - 7, 0, 14, S / 2 + 7]); if (m & SS) bars.push([S / 2 - 7, S / 2 - 7, 14, S / 2 + 7]); if (m & EE) bars.push([S / 2 - 7, S / 2 - 7, S / 2 + 7, 14]); if (m & WW) bars.push([0, S / 2 - 7, S / 2 + 7, 14]);
        tiles.push(h('svg', { key: x + '-' + y, width: S, height: S, onClick: () => girar(x, y), style: { display: 'block', cursor: 'pointer', background: x < mitad ? 'rgba(95,208,232,.05)' : 'rgba(240,167,38,.05)', outline: sel ? '3px solid ' + sel : '1px solid ' + LN, outlineOffset: sel ? -3 : 0 } },
          ...bars.map((b, i) => h('rect', { key: i, x: b[0], y: b[1], width: b[2], height: b[3], fill: col, rx: 2 })), h('circle', { cx: S / 2, cy: S / 2, r: 9, fill: col })));
      }
      return Wrap(P(['Giren las piezas para llevar el agua del ', B('tanque'), ' (izquierda) a la ', B('maceta'), ' (derecha). ', B('J1'), ' gira las piezas de la mitad izquierda y ', B('J2'), ' las de la derecha. El agua avanza en vivo.']),
        Ctrls(Tag(1, 'W A S D mover · E girar'), Tag(2, 'flechas mover · ENTER girar')),
        div({ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' },
          div({ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: d.sr * S + S / 2 - 22, alignSelf: 'stretch' }, div({ width: 44, height: 44, background: '#4fc3ff', fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#081018', display: 'flex', alignItems: 'center', justifyContent: 'center' }, 'AGUA')),
          div({ display: 'grid', gridTemplateColumns: 'repeat(' + n + ',' + S + 'px)', border: '2px solid ' + LN }, ...tiles),
          div({ display: 'flex', flexDirection: 'column', paddingTop: d.er * S + S / 2 - 22, alignSelf: 'stretch' }, div({ width: 44, height: 44, background: F.gana ? OK : '#5c8a6c', fontFamily: MONO, fontSize: 10, fontWeight: 700, color: '#081018', display: 'flex', alignItems: 'center', justifyContent: 'center' }, 'PLANTA'))),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('GIROS ' + giros), Stat('MÍNIMO POSIBLE ' + d.minR, MU)));
    }

    // ---------- 9. BALANZA ----------
    function Balanza(p) {
      const T = p.tier, fin = useOnce(p), N = [3, 9, 27][T - 1], maxP = [1, 2, 3][T - 1];
      const [cand, setCand] = useState(() => [...Array(N).keys()]), [lado, setLado] = useState(() => Array(N).fill(0)), [hist, setHist] = useState([]), [c1, setC1] = useState(0), [c2, setC2] = useState(N - 1), [tilt, setTilt] = useState(0);
      const L = lado.map((v, i) => v === 1 ? i : -1).filter(i => i >= 0), R = lado.map((v, i) => v === 2 ? i : -1).filter(i => i >= 0);
      const pesar = () => {
        if (p.fin) return; if (hist.length >= maxP) { p.onErr('Ya usaron las ' + maxP + ' pesadas. Ahora elijan la caja.', 0); return; }
        if (!L.length || L.length !== R.length) { p.onErr('Pongan la misma cantidad de cajas en cada platillo (y al menos una).', 0); return; }
        const cL = cand.filter(i => L.includes(i)), cR = cand.filter(i => R.includes(i)), cF = cand.filter(i => !L.includes(i) && !R.includes(i));
        const ops = [[cL, -1], [cR, 1], [cF, 0]].filter(o => o[0].length).sort((a, b) => b[0].length - a[0].length);
        const mx = ops[0][0].length, top = ops.filter(o => o[0].length === mx), pick = top[p.h.int(0, top.length - 1)];
        setCand(pick[0]); setTilt(pick[1]); setHist(hist.concat([{ L: L.map(i => i + 1), R: R.map(i => i + 1), r: pick[1] }])); setLado(Array(N).fill(0)); p.snd('click');
      };
      const elegir = () => {
        if (p.fin) return; if (c1 !== c2) { p.onErr('Para elegir, los dos cursores deben estar sobre la misma caja.', 0); return; }
        if (cand.length === 1 && cand[0] === c1) fin(true, 1, 'La caja ' + (c1 + 1) + ' era la pesada. Lo demostraron con ' + hist.length + ' pesada(s).');
        else if (cand.includes(c1)) fin(false, 0, 'Podía ser la ' + (c1 + 1) + ', pero no lo habían demostrado: también podía ser otra. Era la ' + (cand.find(x => x !== c1) + 1) + '.');
        else fin(false, 0, 'La caja ' + (c1 + 1) + ' no podía ser: la balanza ya la había descartado.');
      };
      const dP = useDual(pesar), dE = useDual(elegir);
      useKeys((c, dn) => {
        if (!dn || p.fin) return; const cols = Math.min(9, N);
        if (c === 'KeyA') setC1((c1 + N - 1) % N); if (c === 'KeyD') setC1((c1 + 1) % N); if (c === 'ArrowLeft') setC2((c2 + N - 1) % N); if (c === 'ArrowRight') setC2((c2 + 1) % N);
        if (c === 'KeyE') { const n = lado.slice(); n[c1] = n[c1] === 1 ? 0 : 1; setLado(n); } if (c === 'Enter') { const n = lado.slice(); n[c2] = n[c2] === 2 ? 0 : 2; setLado(n); }
        if (c === 'KeyW') dP.press(0); if (c === 'ArrowUp') dP.press(1); if (c === 'KeyS') dE.press(0); if (c === 'ArrowDown') dE.press(1);
      });
      const ang = tilt * 9, pan = (xs, col, items) => h('g', null, h('line', { x1: xs, y1: 0, x2: xs - 50, y2: 60, stroke: MU }), h('line', { x1: xs, y1: 0, x2: xs + 50, y2: 60, stroke: MU }), h('rect', { x: xs - 60, y: 60, width: 120, height: 6, fill: col }), h('text', { x: xs, y: 52, fill: TX, fontSize: 15, textAnchor: 'middle', fontFamily: 'IBM Plex Mono' }, items));
      return Wrap(P(['Una de las ' + N + ' cajas pesa más que las demás. Encuéntrenla usando la balanza ', B('como máximo ' + maxP + ' vez' + (maxP > 1 ? 'es' : '')), '. Ojo: no basta con adivinar, deben poder demostrarlo. ', B('J1'), ' pone cajas a la izquierda y ', B('J2'), ' a la derecha.']),
        Ctrls(Tag(1, 'A · D caja · E platillo izq.'), Tag(2, '← · → caja · ENTER platillo der.')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 10 }, Tag(1, 'W pesar · S elegir caja'), Tag(2, '↑ pesar · ↓ elegir caja')),
        Box({ display: 'flex', justifyContent: 'center' }, h('svg', { viewBox: '-220 -40 440 170', style: { width: '100%', maxWidth: 520, height: 'auto' } },
          h('rect', { x: -6, y: 0, width: 12, height: 120, fill: '#4d6674' }), h('rect', { x: -60, y: 120, width: 120, height: 8, fill: '#4d6674' }),
          h('g', { transform: 'rotate(' + ang + ')', style: { transition: 'transform .6s' } }, h('rect', { x: -170, y: -4, width: 340, height: 8, fill: TX }),
            h('g', { transform: 'translate(-160,0) rotate(' + (-ang) + ')' }, pan(0, J1, L.length ? L.map(i => i + 1).join(',') : '—')),
            h('g', { transform: 'translate(160,0) rotate(' + (-ang) + ')' }, pan(0, J2, R.length ? R.map(i => i + 1).join(',') : '—'))))),
        div({ display: 'grid', gridTemplateColumns: 'repeat(' + Math.min(9, N) + ',minmax(0,52px))', gap: 6 }, ...lado.map((v, i) => h('button', { key: i, onClick: () => { const n = lado.slice(); n[i] = (n[i] + 1) % 3; setLado(n); }, style: { height: 50, fontFamily: HEAD, fontSize: 18, color: v ? '#081018' : TX, background: v === 1 ? J1 : v === 2 ? J2 : BG, border: '2px solid ' + LN, outline: c1 === i && c2 === i ? '3px solid ' + OK : c1 === i ? '3px solid ' + J1 : c2 === i ? '3px solid ' + J2 : 'none', outlineOffset: 2, cursor: 'pointer' } }, String(i + 1)))),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }, Stat('PESADAS ' + hist.length + ' / ' + maxP, hist.length >= maxP ? J2 : MU), Dual(dP, 'J1 W + J2 ↑ = pesar'), Dual(dE, 'J1 S + J2 ↓ = elegir')),
        hist.length ? div({ display: 'flex', flexDirection: 'column', gap: 4 }, ...hist.map((x, i) => Stat((i + 1) + '. [' + x.L.join(',') + '] vs [' + x.R.join(',') + '] → ' + (x.r < 0 ? 'baja la izquierda' : x.r > 0 ? 'baja la derecha' : 'equilibrio'), TX))) : null);
    }

    // ---------- 10. CRIPTOGRAMA ----------
    const FRASES = ['EL ROBOT RIEGA LA PLANTA', 'LA LUZ SE ENCIENDE CON EL SENSOR', 'TODO ALGORITMO TIENE INICIO Y FIN', 'SI LLUEVE NO SE RIEGA', 'EL ARDUINO LEE EL SENSOR', 'LA PUERTA SE ABRE CON LA CLAVE', 'PENSAR ANTES DE PROBAR', 'EL EQUIPO QUE COOPERA GANA', 'LA LOGICA ABRE TODAS LAS PUERTAS', 'EL ROMBO ES UNA DECISION', 'UN BUCLE REPITE LOS PASOS', 'LA ALARMA SUENA SI HAY MOVIMIENTO'];
    const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sh = (ch, k) => AB[(AB.indexOf(ch) + k + 260) % 26];
    function Cripto(p) {
      const T = p.tier, fin = useOnce(p), nk = T === 1 ? 1 : 2;
      const [d] = useState(() => { const f = p.h.pick(FRASES), ks = [p.h.int(T === 1 ? 2 : 1, T === 1 ? 7 : 25), p.h.int(1, 25)].slice(0, nk), pal = f.split(' '), pista = p.h.pick(pal.filter(w => w.length >= 4).concat(pal)); let li = 0; const cif = f.split('').map(ch => ch === ' ' ? ' ' : sh(ch, ks[(li++) % nk])).join(''); return { f, ks, cif, pista }; });
      const [k, setK] = useState(() => Array(nk).fill(0)), [int, setInt] = useState(0), [ver, setVer] = useState(false);
      let li = 0; const dec = d.cif.split('').map(ch => ch === ' ' ? ' ' : sh(ch, -k[(li++) % nk])).join('');
      const probar = () => { if (p.fin) return; if (dec === d.f) { fin(true, int === 0 ? 1 : int === 1 ? 0.75 : 0.5, 'Mensaje descifrado: «' + d.f + '».'); return; } const n = int + 1; setInt(n); if (n >= 3) { fin(false, 0, 'El mensaje era «' + d.f + '».'); return; } p.onErr('El mensaje todavía no se lee bien.', -4); };
      const dual = useDual(probar);
      useKeys((c, dn) => {
        if (c === 'KeyP') { setVer(dn); return; }
        if (!dn || p.fin) return;
        if (c === 'KeyA') setK([(k[0] + 25) % 26].concat(k.slice(1))); if (c === 'KeyD') setK([(k[0] + 1) % 26].concat(k.slice(1)));
        if (nk > 1 && c === 'ArrowLeft') setK([k[0], (k[1] + 25) % 26]); if (nk > 1 && c === 'ArrowRight') setK([k[0], (k[1] + 1) % 26]);
        if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1);
      });
      let lj = 0; const letras = dec.split('').map((ch, i) => { if (ch === ' ') return h('div', { key: i, style: { width: 18 } }); const who = nk > 1 ? (lj++ % 2) : 0; return div({ key: i, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }, div({ fontFamily: MONO, fontSize: 14, color: MU }, d.cif[i]), div({ fontFamily: HEAD, fontSize: 26, color: who ? J2 : J1, borderBottom: '2px solid ' + (who ? J2 : J1), minWidth: 22, textAlign: 'center' }, ch)); });
      const rueda = (kk, col) => div({ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: MONO, fontSize: 13, overflowX: 'auto' }, div({ display: 'flex', color: MU }, ...AB.split('').map((c, i) => div({ key: i, width: 20, textAlign: 'center' }, c))), div({ display: 'flex', color: col, fontWeight: 700 }, ...AB.split('').map((c, i) => div({ key: i, width: 20, textAlign: 'center' }, sh(c, kk)))));
      return Wrap(P(['Un mensaje del colegio está cifrado: cada letra se corrió varias posiciones en el abecedario. Giren la rueda hasta que se pueda leer.' + (nk > 1 ? ' Hay dos claves: ' : ''), nk > 1 ? B('J1 descifra las letras celestes y J2 las naranjas.') : '', nk === 1 ? [' ', B('J2'), ' tiene la pista: manténganla con P y léanla en voz alta.'] : '']),
        Ctrls(Tag(1, 'A · D girar clave 1'), nk > 1 ? Tag(2, '← · → girar clave 2') : Tag(2, 'mantener P = ver pista')),
        Box({ display: 'flex', flexWrap: 'wrap', gap: '14px 6px' }, ...letras),
        rueda(k[0], J1), nk > 1 ? rueda(k[1], J2) : null,
        nk === 1 ? div({ fontSize: 16, color: ver ? J2 : MU, fontFamily: MONO }, ver ? 'PISTA: una palabra del mensaje es «' + d.pista + '»' : 'PISTA OCULTA · J2 mantiene P') : null,
        div({ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }, Stat('CLAVE' + (nk > 1 ? 'S ' + k.join(' · ') : ' ' + k[0])), Stat('INTENTOS ' + int + ' / 3', int ? ER : MU), Dual(dual)));
    }

    // ---------- 11. PARES DE MEMORIA ----------
    const CONC = [['Óvalo', 'Inicio / Fin'], ['Rombo', 'Decisión'], ['Rectángulo', 'Proceso'], ['Paralelogramo', 'Entrada / Salida'], ['Flecha', 'Indica el flujo'], ['Sensor', 'Entrada de datos'], ['LED', 'Salida de luz'], ['Bucle', 'Repetir pasos'], ['Variable', 'Guarda un valor'], ['AND', 'Las dos a la vez'], ['OR', 'Al menos una'], ['Algoritmo', 'Pasos ordenados']];
    const SIMB = ['●', '■', '▲', '◆', '★', '✚', '⬟', '◐', '☾', '♣'];
    function Pares(p) {
      const T = p.tier, fin = useOnce(p), np = [6, 8, 8][T - 1], cols = 2, lim = np * 2 + 2;
      const [d] = useState(() => { let pares;
        if (T === 1) pares = p.h.shuffle(SIMB).slice(0, np).map(s => [s, s]);
        else if (T === 2) { const vs = new Set(); pares = []; while (pares.length < np) { const a = p.h.int(3, 9), b = p.h.int(3, 9), op = p.h.pick(['×', '+']), v = op === '×' ? a * b : a + b + 10; if (vs.has(v)) continue; vs.add(v); pares.push([op === '×' ? a + ' × ' + b : (a + 10) + ' + ' + b, String(v)]); } }
        else pares = p.h.shuffle(CONC).slice(0, np);
        const izq = p.h.shuffle([...Array(np).keys()]), der = p.h.shuffle([...Array(np).keys()]);
        return { pares, izq, der }; });
      const [c1, setC1] = useState(0), [c2, setC2] = useState(0), [a, setA] = useState(null), [b, setB] = useState(null), [hechos, setH] = useState({}), [int, setInt] = useState(0), [esp, setEsp] = useState(false);
      useEffect(() => {
        if (a == null || b == null) return; setEsp(true);
        const pa = d.izq[a], pb = d.der[b], k = int + 1; setInt(k);
        const t = setTimeout(() => { setEsp(false);
          if (pa === pb) { const nh = Object.assign({}, hechos, { [pa]: 1 }); setH(nh); p.snd('ok'); setA(null); setB(null); if (Object.keys(nh).length >= np) fin(true, effBy(k, Math.round(np * 1.4), Math.round(np * 1.8)), 'Encontraron los ' + np + ' pares en ' + k + ' intentos.'); }
          else { p.snd('err'); setA(null); setB(null); if (k >= lim) fin(false, 0, 'Se acabaron los ' + lim + ' intentos.'); }
        }, pa === pb ? 500 : 1100);
        return () => clearTimeout(t);
      }, [a, b]);
      const rows = Math.ceil(np / cols);
      useKeys((c, dn) => {
        if (!dn || p.fin || esp) return;
        const mv = (cur, dx, dy) => { const x = cur % cols, y = Math.floor(cur / cols); const nx = Math.max(0, Math.min(cols - 1, x + dx)), ny = Math.max(0, Math.min(rows - 1, y + dy)); return Math.min(np - 1, ny * cols + nx); };
        const m1 = { KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] }[c], m2 = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[c];
        if (m1) setC1(mv(c1, ...m1)); if (m2) setC2(mv(c2, ...m2));
        if (c === 'KeyE' && a == null && !hechos[d.izq[c1]]) { setA(c1); p.snd('click'); }
        if (c === 'Enter' && b == null && !hechos[d.der[c2]]) { setB(c2); p.snd('click'); }
      });
      const carta = (lado, i, cur, open, col) => { const pi = lado === 0 ? d.izq[i] : d.der[i], hecho = hechos[pi], vis = hecho || open, txt = d.pares[pi][lado];
        return h('button', { key: i, onClick: () => { if (esp || p.fin || hecho) return; if (lado === 0 && a == null) { setC1(i); setA(i); } if (lado === 1 && b == null) { setC2(i); setB(i); } }, style: { minHeight: 76, padding: 8, background: hecho ? 'rgba(127,224,160,.15)' : vis ? '#16283a' : 'repeating-linear-gradient(45deg,#13222f 0 8px,#0f1b26 8px 16px)', border: '2px solid ' + (hecho ? OK : cur === i ? col : LN), color: hecho ? OK : TX, fontFamily: T === 1 ? 'sans-serif' : HEAD, fontSize: T === 1 ? 34 : 17, cursor: 'pointer', boxShadow: cur === i ? '0 0 0 2px ' + col : 'none' } }, vis ? txt : '?'); };
      const mitad = (lado, cur, sel, col, tit) => div({ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 260px' }, Stat(tit, col), div({ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ',minmax(0,1fr))', gap: 8 }, ...[...Array(np).keys()].map(i => carta(lado, i, cur, sel === i, col))));
      return Wrap(P(['Cada par tiene una carta en el lado de ', B('J1'), ' y su pareja en el lado de ', B('J2'), '. Cada uno da vuelta una carta de su lado: si forman pareja, quedan abiertas. ' + (T === 2 ? 'Las parejas son una operación y su resultado.' : T === 3 ? 'Las parejas son un concepto y su significado.' : 'Las parejas son símbolos iguales.') + ' Tienen ' + lim + ' intentos.']),
        Ctrls(Tag(1, 'W A S D mover · E voltear'), Tag(2, 'flechas mover · ENTER voltear')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, mitad(0, c1, a, J1, 'LADO DE J1'), mitad(1, c2, b, J2, 'LADO DE J2')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('PARES ' + Object.keys(hechos).length + ' / ' + np, OK), Stat('INTENTOS ' + int + ' / ' + lim, int > np * 1.8 ? ER : MU)));
    }

    // ---------- 12. LÁSER Y ESPEJOS ----------
    const LD = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // E S W N
    const refl = (dir, m) => m === '/' ? [3, 2, 1, 0][dir] : [1, 0, 3, 2][dir];
    function trazar(n, d, esp) {
      let x = -1, y = d.r0, dir = 0; const pts = [[x + 0.5, y + 0.5]]; const vis = {};
      for (let s = 0; s < 200; s++) { x += LD[dir][0]; y += LD[dir][1];
        if (x < 0 || y < 0 || x >= n || y >= n) { pts.push([x + 0.5, y + 0.5]); return { pts, gana: false }; }
        const k = x + ',' + y; if (d.muros[k]) { pts.push([x + 0.5 - LD[dir][0] * 0.5, y + 0.5 - LD[dir][1] * 0.5]); return { pts, gana: false }; }
        if (x === d.tx && y === d.ty) { pts.push([x + 0.5, y + 0.5]); return { pts, gana: true }; }
        if (esp[k]) { pts.push([x + 0.5, y + 0.5]); dir = refl(dir, esp[k]); const vk = k + dir; if (vis[vk]) return { pts, gana: false }; vis[vk] = 1; } }
      return { pts, gana: false };
    }
    function genLaser(T, H) {
      const n = [5, 6, 7][T - 1], turns = [2, 3, 4][T - 1];
      for (let it = 0; it < 800; it++) {
        const r0 = H.int(0, n - 1); let x = -1, y = r0, dir = 0; const usados = {}, esp = {}; let ok = true;
        for (let t = 0; t <= turns && ok; t++) {
          const lmax = []; let cx = x, cy = y; for (let l = 1; l < n; l++) { cx += LD[dir][0]; cy += LD[dir][1]; if (cx < 0 || cy < 0 || cx >= n || cy >= n || usados[cx + ',' + cy]) break; lmax.push(l); }
          if (!lmax.length) { ok = false; break; }
          const L = H.pick(lmax); for (let l = 1; l <= L; l++) { x += LD[dir][0]; y += LD[dir][1]; usados[x + ',' + y] = 1; }
          if (t < turns) { const nd = H.pick([(dir + 1) % 4, (dir + 3) % 4]); const m = refl(dir, '/') === nd ? '/' : '\\'; esp[x + ',' + y] = m; dir = nd; }
        }
        if (!ok) continue; const tx = x, ty = y; if (esp[tx + ',' + ty]) continue;
        const sol = Object.assign({}, esp), libres = []; for (let yy = 0; yy < n; yy++) for (let xx = 0; xx < n; xx++) if (!usados[xx + ',' + yy]) libres.push(xx + ',' + yy);
        const ls = H.shuffle(libres), muros = {}; let li = 0;
        for (let k = 0; k < [1, 2, 4][T - 1] && li < ls.length; k++) esp[ls[li++]] = H.pick(['/', '\\']);
        for (let k = 0; k < (T === 3 ? 2 : 0) && li < ls.length; k++) muros[ls[li++]] = 1;
        const d = { n, r0, tx, ty, muros };
        const ini = {}; Object.keys(esp).forEach(k => { ini[k] = H.int(0, 1) ? '/' : '\\'; });
        if (trazar(n, d, ini).gana || !trazar(n, d, sol).gana) continue;
        let minT = 0; Object.keys(sol).forEach(k => { if (ini[k] !== sol[k]) minT++; });
        const keys = Object.keys(ini).sort((a, b) => { const [ax, ay] = a.split(',').map(Number), [bx, by] = b.split(',').map(Number); return ay - by || ax - bx; });
        const dueño = {}; keys.forEach((k, i) => { dueño[k] = i % 2; });
        return Object.assign(d, { ini, minT, keys, dueño });
      }
      return null;
    }
    function Laser(p) {
      const T = p.tier, fin = useOnce(p);
      const [d] = useState(() => genLaser(T, p.h));
      const [esp, setEsp] = useState(d ? Object.assign({}, d.ini) : {}), [c1, setC1] = useState(0), [c2, setC2] = useState(0), [tog, setTog] = useState(0);
      if (!d) return P('No se pudo generar el tablero.');
      const n = d.n, mis = [d.keys.filter(k => d.dueño[k] === 0), d.keys.filter(k => d.dueño[k] === 1)], tr = trazar(n, d, esp);
      const girar = k => { if (p.fin || !k) return; const ne = Object.assign({}, esp, { [k]: esp[k] === '/' ? '\\' : '/' }); setEsp(ne); const t = tog + 1; setTog(t); p.snd('click');
        if (trazar(n, d, ne).gana) fin(true, effBy(t, d.minT + 2, d.minT + 6), '¡El láser llegó al sensor! ' + t + ' giros (mínimo ' + d.minT + ').'); };
      useKeys((c, dn) => {
        if (!dn || p.fin) return; const a = mis[0].length || 1, b = mis[1].length || 1;
        if (c === 'KeyA') setC1((c1 + a - 1) % a); if (c === 'KeyD') setC1((c1 + 1) % a); if (c === 'KeyE') girar(mis[0][c1 % a]);
        if (c === 'ArrowLeft') setC2((c2 + b - 1) % b); if (c === 'ArrowRight') setC2((c2 + 1) % b); if (c === 'Enter') girar(mis[1][c2 % b]);
      });
      const S = 60, W = (n + 2) * S, s1 = mis[0][c1 % Math.max(1, mis[0].length)], s2 = mis[1][c2 % Math.max(1, mis[1].length)], els = [];
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const k = x + ',' + y; els.push(h('rect', { key: 'g' + k, x: (x + 1) * S, y: y * S, width: S, height: S, fill: d.muros[k] ? '#2a3a46' : BG, stroke: LN })); }
      Object.keys(esp).forEach(k => { const [x, y] = k.split(',').map(Number), cx = (x + 1.5) * S, cy = (y + 0.5) * S, o = d.dueño[k] ? J2 : J1, sel = k === s1 || k === s2, m = esp[k];
        els.push(h('g', { key: 'm' + k, onClick: () => girar(k), style: { cursor: 'pointer' } }, h('rect', { x: (x + 1) * S + 3, y: y * S + 3, width: S - 6, height: S - 6, fill: sel ? 'rgba(255,255,255,.08)' : 'transparent', stroke: sel ? o : 'transparent', strokeWidth: 3 }),
          h('line', { x1: m === '/' ? cx - 20 : cx - 20, y1: m === '/' ? cy + 20 : cy - 20, x2: m === '/' ? cx + 20 : cx + 20, y2: m === '/' ? cy - 20 : cy + 20, stroke: o, strokeWidth: 7, strokeLinecap: 'round' }))); });
      els.push(h('rect', { key: 'em', x: S * 0.25, y: d.r0 * S + S * 0.25, width: S * 0.6, height: S * 0.5, fill: '#ff3b5c' }));
      els.push(h('circle', { key: 'tg', cx: (d.tx + 1.5) * S, cy: (d.ty + 0.5) * S, r: 16, fill: tr.gana ? OK : 'transparent', stroke: OK, strokeWidth: 4 }));
      els.push(h('polyline', { key: 'bm', points: tr.pts.map(([x, y]) => ((x + 1) * S) + ',' + (y * S)).join(' '), fill: 'none', stroke: '#ff3b5c', strokeWidth: 4, strokeLinejoin: 'round', style: { filter: 'drop-shadow(0 0 6px #ff3b5c)' } }));
      return Wrap(P(['Giren los espejos para que el ', B('láser rojo'), ' llegue al ', B('sensor verde'), '. Cada espejo tiene dueño: ', B('J1'), ' gira los celestes y ', B('J2'), ' los naranjas.' + (T === 3 ? ' Los bloques grises frenan el láser.' : '')]),
        Ctrls(Tag(1, 'A · D elegir espejo · E girar'), Tag(2, '← · → elegir espejo · ENTER girar')),
        Box({ display: 'flex', justifyContent: 'center' }, h('svg', { viewBox: '0 0 ' + W + ' ' + n * S, style: { width: '100%', maxWidth: W, height: 'auto' } }, ...els)),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('GIROS ' + tog), Stat('MÍNIMO ' + d.minT, MU)));
    }


    // ---------- QUIZ COOPERATIVO (código Arduino, variables, sistemas) ----------
    const pick = (H, a) => a[H.int(0, a.length - 1)];
    function genCodigo(T, H) {
      const it = [];
      if (T === 1) {
        const pool = [['pinMode(LED, OUTPUT);', 0, 'Configurar un pin se hace una sola vez: va en setup().'], ['pinMode(BOTON, INPUT);', 0, 'Configurar un pin se hace una sola vez: va en setup().'], ['Serial.begin(9600);', 0, 'Abrir la comunicación se hace una vez al encender: setup().'],
          ['digitalWrite(LED, HIGH);', 1, 'Encender el LED es parte del comportamiento que se repite: loop().'], ['delay(500);', 1, 'La espera forma parte del ciclo que se repite: loop().'], ['digitalWrite(LED, LOW);', 1, 'Apagar el LED se repite en cada vuelta: loop().'], ['estado = digitalRead(BOTON);', 1, 'El botón hay que leerlo todo el tiempo: loop().'], ['pinMode(ZUMBADOR, OUTPUT);', 0, 'Configurar un pin se hace una sola vez: va en setup().']];
        H.shuffle(pool).slice(0, 6).forEach(([c, a, ex]) => it.push({ code: [c], q: '¿Dónde va esta instrucción?', opts: ['setup()', 'loop()'], ans: a, ex }));
      } else if (T === 2) {
        for (let k = 0; k < 5; k++) {
          const on = pick(H, [200, 250, 500, 1000]), off = pick(H, [200, 250, 500, 1000]), pin = H.int(8, 13), seg = pick(H, [4, 6, 10]);
          const n = Math.floor(seg * 1000 / (on + off)), tipo = k % 3;
          const code = ['int LED = ' + pin + ';  // pin del LED', 'void setup() {', '  pinMode(LED, OUTPUT);', '}', 'void loop() {', '  digitalWrite(LED, HIGH);', '  delay(' + on + ');', '  digitalWrite(LED, LOW);', '  delay(' + off + ');', '}'];
          if (tipo === 0) { const o = [...new Set([n, n + 1, Math.max(1, n - 1), n * 2])].slice(0, 4); it.push({ code, q: '¿Cuántas veces se enciende el LED en ' + seg + ' segundos?', opts: H.shuffle(o.map(String)), ansV: String(n), ex: 'Cada vuelta del loop dura ' + on + ' + ' + off + ' = ' + (on + off) + ' ms. En ' + seg * 1000 + ' ms caben ' + n + ' vueltas.' }); }
          else if (tipo === 1) it.push({ code, q: '¿En qué pin está conectado el LED?', opts: H.shuffle([pin, pin === 13 ? 12 : pin + 1, 0, 9 === pin ? 10 : 9].filter((v, i, a) => a.indexOf(v) === i)).map(String), ansV: String(pin), ex: 'La variable LED guarda el número ' + pin + '; pinMode(LED, …) usa ese pin.' });
          else it.push({ code, q: '¿Cuánto tiempo pasa el LED encendido en cada vuelta?', opts: H.shuffle([on, off === on ? on * 2 : off, on + off, on / 2].map(v => v + ' ms').filter((v, i, a) => a.indexOf(v) === i)), ansV: on + ' ms', ex: 'Después de HIGH viene delay(' + on + '): ese es el tiempo encendido.' });
        }
      } else {
        const errs = [
          [['void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {', '  digitalWrite(13, HIGH)', '  delay(1000);', '}'], 'Línea 5', ['Línea 2', 'Línea 5', 'Línea 6', 'No hay error'], 'A la línea 5 le falta el punto y coma (;).'],
          [['void setup() {', '}', 'void loop() {', '  digitalWrite(13, HIGH);', '  delay(500);', '  digitalWrite(13, LOW);', '  delay(500);', '}'], 'Falta pinMode', ['Falta pinMode', 'Falta un delay', 'loop está vacío', 'No hay error'], 'Sin pinMode(13, OUTPUT) en setup(), el pin no queda configurado como salida.'],
          [['void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {', '  digitalWrite(13, HIGH);', '  digitalWrite(13, LOW);', '}'], 'Parpadea tan rápido que no se ve', ['Parpadea cada segundo', 'Queda siempre apagado', 'Parpadea tan rápido que no se ve', 'No compila'], 'Sin delay() entre HIGH y LOW, el cambio es tan rápido que el ojo no lo ve.'],
          [['void setup() {', '  pinMode(13, OUTPUT);', '  digitalWrite(13, HIGH);', '  delay(1000);', '  digitalWrite(13, LOW);', '}', 'void loop() {', '}'], 'Parpadea una sola vez', ['Parpadea siempre', 'Parpadea una sola vez', 'Nunca se enciende', 'No compila'], 'Todo está en setup(), que se ejecuta una sola vez. loop() está vacío.'],
          [['// Enciende el LED', 'void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {', '  digitalWrite(13, HIGH); // encender', '}'], 'Queda siempre encendido', ['Queda siempre encendido', 'Parpadea', 'Da error por los comentarios', 'Queda apagado'], 'Los comentarios (//) no se ejecutan. El loop solo enciende, así que el LED queda encendido.'],
          [['void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {', '  digitalWrite(13, HIGH);', '  delay(1000);', '  digitalWrite(13, LOW);', '  delay(1000);', '}'], 'Parpadea cada segundo', ['Parpadea cada segundo', 'Queda encendido', 'Parpadea una vez', 'No compila'], 'Programa correcto: 1 s encendido y 1 s apagado, repetido en el loop.']];
        H.shuffle(errs).slice(0, 5).forEach(([code, a, opts, ex]) => it.push({ code, q: opts.includes('Línea 5') || opts.includes('Falta pinMode') ? '¿Dónde está el error?' : '¿Qué hace este programa?', opts, ansV: a, ex }));
      }
      return it;
    }
    function genVars(T, H) {
      const it = [];
      for (let k = 0; k < 5; k++) {
        if (T === 1) {
          const a = H.int(2, 9), b = H.int(2, 6), op = pick(H, ['+', '*', '-']), c = op === '+' ? a + b : op === '*' ? a * b : a - b, d = c * 2;
          const code = ['int a = ' + a + ';', 'int b = ' + b + ';', 'a = a ' + op + ' b;', 'b = a * 2;'], q = k % 2 ? '¿Cuánto vale b al final?' : '¿Cuánto vale a al final?', v = k % 2 ? d : c;
          it.push({ code, q, opts: H.shuffle([v, v + 1, k % 2 ? c : a, v + b].filter((x, i, ar) => ar.indexOf(x) === i)).map(String), ansV: String(v), ex: 'Paso a paso: a = ' + a + ' ' + op + ' ' + b + ' = ' + c + '; luego b = ' + c + ' × 2 = ' + d + '.' });
        } else if (T === 2) {
          const t = H.int(18, 40), L = pick(H, [25, 28, 30, 35]), op = pick(H, ['>', '<', '>=', '==', '!=']), r = op === '>' ? t > L : op === '<' ? t < L : op === '>=' ? t >= L : op === '==' ? t === L : t !== L;
          it.push({ code: ['const int LIMITE = ' + L + ';', 'int temperatura = ' + t + ';', 'bool ventilador = (temperatura ' + op + ' LIMITE);'], q: '¿Qué valor queda en ventilador?', opts: ['true (se enciende)', 'false (apagado)'], ans: r ? 0 : 1, ex: t + ' ' + op + ' ' + L + ' es ' + (r ? 'verdadero' : 'falso') + '. ' + (op === '!=' ? '!= significa «distinto de».' : op === '==' ? '== compara si son iguales.' : '') });
        } else {
          const luz = H.int(100, 900), mov = H.int(0, 1), op = pick(H, ['&&', '||']), neg = H.int(0, 2) === 0, c1 = luz < 400, c2 = neg ? !mov : !!mov, r = op === '&&' ? c1 && c2 : c1 || c2;
          it.push({ code: ['int luz = ' + luz + ';        // sensor de luz (0 a 1023)', 'int movimiento = ' + (mov ? 'HIGH' : 'LOW') + ';', 'if (luz < 400 ' + op + ' ' + (neg ? '!' : '') + 'movimiento) {', '  digitalWrite(LAMPARA, HIGH);', '} else {', '  digitalWrite(LAMPARA, LOW);', '}'], q: '¿La lámpara del pasillo se enciende?', opts: ['Sí, se enciende', 'No, queda apagada'], ans: r ? 0 : 1, ex: '(luz < 400) es ' + c1 + ' y (' + (neg ? '!' : '') + 'movimiento) es ' + c2 + '. Con ' + (op === '&&' ? '&& (Y) deben cumplirse las dos' : '|| (O) basta con una') + ': resultado ' + r + '.' });
        }
      }
      return it;
    }
    function genSistema(T, H) {
      const it = [];
      if (T === 1) {
        const pool = [['Sensor de humedad de suelo', 0], ['Sensor ultrasónico', 0], ['Pulsador', 0], ['Sensor de luz (LDR)', 0], ['Sensor PIR de movimiento', 0], ['Arduino UNO', 1], ['Servomotor', 2], ['Bomba de agua', 2], ['LED', 2], ['Zumbador', 2], ['Pantalla LCD', 2]];
        H.shuffle(pool).slice(0, 6).forEach(([c, a]) => it.push({ code: [c], q: '¿Qué papel cumple en el sistema?', opts: ['Entrada (lee datos)', 'Proceso (decide)', 'Salida (actúa)'], ans: a, ex: a === 0 ? 'Mide algo del entorno y se lo envía al Arduino: es una entrada.' : a === 1 ? 'Recibe las entradas, ejecuta el algoritmo y decide: es el proceso.' : 'Recibe la orden del Arduino y hace algo en el mundo: es una salida.' }));
      } else if (T === 2) {
        const pool = [['Regar la maceta del patio solo cuando la tierra esté seca.', 'Sensor de humedad → bomba de agua'], ['Abrir la puerta del laboratorio cuando alguien se acerque.', 'Sensor ultrasónico → servomotor'], ['Encender la luz del pasillo al anochecer.', 'Sensor de luz (LDR) → LED / lámpara'], ['Avisar si alguien entra al aula en la noche.', 'Sensor PIR → zumbador'], ['Mostrar la temperatura del aula.', 'Sensor de temperatura → pantalla LCD']];
        const all = pool.map(p => p[1]);
        H.shuffle(pool).forEach(([n, a]) => it.push({ code: ['NECESIDAD DEL COLEGIO:', n], q: '¿Qué entrada y qué salida elegirían?', opts: H.shuffle(all.slice()).filter(x => x !== a).slice(0, 3).concat([a]).sort(() => H.int(0, 1) ? 1 : -1), ansV: a, ex: 'La entrada mide lo que importa (' + a.split(' → ')[0] + ') y la salida resuelve la necesidad (' + a.split(' → ')[1] + ').' }));
      } else {
        const pool = [['Riego automático', ['INICIO', 'Leer humedad', '¿humedad < 30 %?', '  Sí → ???', '  No → apagar bomba', 'Volver a leer'], 'Encender bomba', ['Encender bomba', 'Leer humedad otra vez', 'Apagar bomba', 'FIN'], 'Si la tierra está seca (Sí), la acción es regar: encender la bomba.'],
          ['Puerta automática', ['INICIO', 'Medir distancia', '¿distancia < ???', '  Sí → abrir puerta (servo 90°)', '  No → cerrar puerta (servo 0°)'], '50 cm', ['50 cm', '5 m', '0 cm', '1023'], 'Debe abrirse cuando alguien está cerca: un umbral razonable es 50 cm.'],
          ['Luz del pasillo', ['INICIO', 'Leer luz (LDR)', '??? ', '  Sí → encender lámpara', '  No → apagar lámpara'], '¿luz < 300?', ['¿luz < 300?', '¿luz > 900?', '¿lámpara encendida?', 'Esperar 1 s'], 'La lámpara se enciende cuando hay poca luz: la decisión es ¿luz < 300?.'],
          ['Alarma del laboratorio', ['INICIO', '???', '¿hay movimiento?', '  Sí → sonar zumbador', '  No → silencio'], 'Leer sensor PIR', ['Leer sensor PIR', 'Sonar zumbador', 'FIN', 'Abrir puerta'], 'Antes de decidir hay que leer la entrada: leer el sensor PIR.'],
          ['Semáforo escolar', ['INICIO', 'Verde 5 s', 'Amarillo 2 s', 'Rojo 5 s', '???'], 'Volver al inicio (repetir)', ['Volver al inicio (repetir)', 'FIN', 'Apagar todo', 'Leer humedad'], 'Un semáforo nunca termina: el diagrama vuelve al inicio, como el loop().']];
        H.shuffle(pool).forEach(([t, code, a, opts, ex]) => it.push({ code: ['SISTEMA: ' + t.toUpperCase()].concat(code), q: '¿Qué va en lugar de ???', opts: H.shuffle(opts), ansV: a, ex }));
      }
      return it;
    }
    const GEN = { codigo: genCodigo, vars: genVars, sistema: genSistema };
    function Quiz(p) {
      const fin = useOnce(p);
      const [it] = useState(() => GEN[p.id](p.tier, p.h).map(x => Object.assign({}, x, { ans: x.ansV != null ? x.opts.indexOf(x.ansV) : x.ans })));
      const [n, setN] = useState(0), [c1, setC1] = useState(0), [c2, setC2] = useState(0), [res, setRes] = useState([]), [fb, setFb] = useState(null);
      const q = it[Math.min(n, it.length - 1)], no = q.opts.length;
      const sig = () => { setFb(null); if (n + 1 >= it.length) { const bien = res.filter(Boolean).length, r = bien / it.length; if (r >= 0.7) fin(true, r === 1 ? 1 : r >= 0.8 ? 0.75 : 0.5, bien + ' de ' + it.length + ' respuestas correctas.'); else fin(false, 0, 'Solo ' + bien + ' de ' + it.length + '. Necesitaban el 70 %.'); return; } setN(n + 1); setC1(0); setC2(0); };
      const enviar = () => { if (p.fin) return; if (fb) { sig(); return; } if (c1 !== c2) { p.onErr('No están de acuerdo: J1 marcó «' + q.opts[c1] + '» y J2 «' + q.opts[c2] + '». Conversen y elijan la misma.', 0); return; } const ok = c1 === q.ans; p.snd(ok ? 'ok' : 'err'); setRes(res.concat([ok])); setFb({ ok, ex: q.ex }); };
      const dual = useDual(enviar);
      useKeys((c, dn) => { if (!dn || p.fin) return; if (fb) { if (c === 'KeyE' || c === 'Enter' || c === 'Space') sig(); return; }
        if (c === 'KeyA' || c === 'KeyW') setC1((c1 + no - 1) % no); if (c === 'KeyD' || c === 'KeyS') setC1((c1 + 1) % no); if (c === 'ArrowLeft' || c === 'ArrowUp') setC2((c2 + no - 1) % no); if (c === 'ArrowRight' || c === 'ArrowDown') setC2((c2 + 1) % no);
        if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      const intro = { codigo: ['Lean el código de Arduino y respondan. Los dos deben marcar ', B('la misma opción'), ': J1 con A · D y J2 con ← · →. Después, E + ENTER a la vez.'], vars: ['Sigan el valor de cada variable línea por línea, como lo haría el Arduino. Los dos deben marcar ', B('la misma opción'), ' y confirmar con E + ENTER.'], sistema: ['Planifiquen un sistema para el colegio: entradas, proceso y salidas. Los dos deben marcar ', B('la misma opción'), ' y confirmar con E + ENTER.'] }[p.id];
      return Wrap(P(intro), Ctrls(Tag(1, 'A · D elegir · E confirmar'), Tag(2, '← · → elegir · ENTER confirmar')),
        div({ display: 'flex', flexWrap: 'wrap', gap: 18 }, Stat('PREGUNTA ' + (Math.min(n, it.length - 1) + 1) + ' / ' + it.length), Stat('ACIERTOS ' + res.filter(Boolean).length, OK)),
        Box({ fontFamily: MONO, fontSize: q.code.length === 1 ? 26 : 17, lineHeight: 1.6, color: TX, whiteSpace: 'pre-wrap', overflowX: 'auto' }, ...q.code.map((l, i) => div({ key: i, display: 'flex', gap: 14 }, q.code.length > 2 ? h('span', { style: { color: MU, minWidth: 22, textAlign: 'right' } }, String(i + 1)) : null, h('span', { style: { color: /\/\//.test(l) ? '#7fe0a0' : TX } }, l)))),
        div({ fontFamily: HEAD, fontSize: 22, color: TX }, q.q),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 10 }, ...q.opts.map((o, i) => { const a1 = c1 === i, a2 = c2 === i, okc = fb && i === q.ans;
          return h('button', { key: i, onClick: () => { setC1(i); setC2(i); }, style: { position: 'relative', textAlign: 'left', padding: '14px 16px', background: okc ? 'rgba(127,224,160,.18)' : BG, border: '2px solid ' + (okc ? OK : a1 && a2 ? '#ffffff' : LN), color: TX, fontSize: 17, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 } },
            div({ display: 'flex', gap: 4, flex: 'none' }, div({ width: 12, height: 12, background: a1 ? J1 : 'transparent', border: '2px solid ' + J1 }), div({ width: 12, height: 12, background: a2 ? J2 : 'transparent', border: '2px solid ' + J2 })), o); })),
        fb ? Box({ border: '2px solid ' + (fb.ok ? OK : ER), display: 'flex', flexDirection: 'column', gap: 8 }, div({ fontFamily: HEAD, fontSize: 20, color: fb.ok ? OK : ER }, fb.ok ? '¡Correcto!' : 'No era esa.'), P(fb.ex), Stat('E o ENTER para seguir', MU)) : Dual(dual));
    }
    const MAP = { codigo: Quiz, vars: Quiz, sistema: Quiz, simon: Simon, calculo: Calculo, tangram: Tangram, sudoku: Sudoku, cubos: Cubos, cerillos: Cerillos, stroop: Stroop, tuberias: Tuberias, balanza: Balanza, cripto: Cripto, pares: Pares, laser: Laser };
    function Mente(p) {
      const C = MAP[p.id]; if (!C) return null;
      return div({ opacity: p.fin ? 0.6 : 1, pointerEvents: p.fin ? 'none' : 'auto', transition: 'opacity .3s' }, h(C, p));
    }
    make.c = Mente; make.map = MAP; return Mente;
  }
  window.ESC_MENTE = { make, IDS };
})();

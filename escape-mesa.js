// Sala de juegos · juegos de mesa y populares para Escape del Laboratorio (cooperativos J1/J2).
(function () {
  function make(React, U) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const { div, P, B, Tag, Ctrls, Stat, Box, Wrap, useKeys, useDual, Dual, useOnce } = U, { J1, J2, OK, ER, TX, MU, PAN, BG, LN, MONO, HEAD } = U.C;
    const GOLD = '#ffd166';
    const Btn = (t, on, col, dis) => h('button', { onClick: on, disabled: dis, style: { alignSelf: 'flex-start', background: dis ? '#1b2a33' : col || GOLD, color: dis ? MU : '#081018', border: 'none', fontFamily: HEAD, fontSize: 16, padding: '10px 18px', cursor: dis ? 'default' : 'pointer' } }, t);
    const Opc = (opts, sel, set) => div({ display: 'flex', flexDirection: 'column', gap: 6 }, ...opts.map((o, i) => h('button', { key: i, onClick: () => set(i), style: { textAlign: 'left', padding: '10px 12px', background: sel === i ? GOLD : BG, color: sel === i ? '#081018' : TX, border: '2px solid ' + (sel === i ? GOLD : LN), fontSize: 15, fontWeight: 600, cursor: 'pointer' } }, o)));

    // ---------- TRES EN RAYA ----------
    const LIN = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const gana = b => { for (const [a, c, d] of LIN) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]; return b.every(Boolean) ? 'E' : null; };
    const mm = (b, yo) => { const g = gana(b); if (g === 'O') return [1]; if (g === 'X') return [-1]; if (g === 'E') return [0]; let best = yo ? [-2] : [2];
      for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = yo ? 'O' : 'X'; const v = mm(b, !yo)[0]; b[i] = null; if (yo ? v > best[0] : v < best[0]) best = [v, i]; } return best; };
    const REG = ['Si puedo ganar en esta jugada, gano', 'Si el rival va a ganar, lo bloqueo', 'Si el centro está libre, lo tomo', 'Si hay una esquina libre, la tomo', 'Si no, juego en cualquier casilla libre'];
    function TresEnRaya(p) {
      const T = p.tier, fin = useOnce(p), [b, setB] = useState(Array(9).fill(null)), [c1, setC1] = useState(4), [c2, setC2] = useState(4), [pj, setPj] = useState(0), [res, setRes] = useState({ g: 0, e: 0, p: 0 }), [msg, setMsg] = useState(''), [ord, setOrd] = useState(null), [orden, setOrden] = useState([]);
      const meta = T === 1 ? 'Ganen 1 partida (la máquina a veces se equivoca).' : 'La máquina juega perfecto. No pierdan en 2 partidas seguidas.';
      const turnoMaq = nb => { const g = gana(nb); if (g) return fin2(nb, g); const libres = nb.map((x, i) => x ? -1 : i).filter(i => i >= 0); const i = T === 1 && Math.random() < 0.45 ? libres[Math.floor(Math.random() * libres.length)] : mm(nb.slice(), true)[1]; nb[i] = 'O'; setB(nb.slice()); const g2 = gana(nb); if (g2) fin2(nb, g2); };
      const fin2 = (nb, g) => { const r = Object.assign({}, res); if (g === 'X') r.g++; else if (g === 'E') r.e++; else r.p++; setRes(r); setPj(pj + 1); setMsg(g === 'X' ? '¡Ganaron!' : g === 'E' ? 'Empate.' : 'Perdieron: la máquina encontró un camino.'); p.snd(g === 'O' ? 'err' : 'ok');
        if (T === 1 && r.g >= 1) setOrd(true); else if (T > 1 && (r.g + r.e) >= 2 && r.p === 0) setOrd(true); else if (T > 1 && r.p > 0) setRes({ g: 0, e: 0, p: 0 }); };
      const jugar = i => { if (b[i] || gana(b) || ord) return; const nb = b.slice(); nb[i] = 'X'; setB(nb); setTimeout(() => turnoMaq(nb), 350); };
      const dual = useDual(() => { if (c1 !== c2) { p.onErr('Pongan los dos cursores en la misma casilla.', 0); return; } jugar(c1); });
      const mv = (c, k) => ({ L: c % 3 ? c - 1 : c + 2, R: c % 3 < 2 ? c + 1 : c - 2, U: c > 2 ? c - 3 : c + 6, D: c < 6 ? c + 3 : c - 6 })[k];
      useKeys((k, dn) => { if (!dn || p.fin || ord) return; const a = { KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D' }[k], r = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[k]; if (a) setC1(mv(c1, a)); if (r) setC2(mv(c2, r)); if (k === 'KeyE') dual.press(0); if (k === 'Enter') dual.press(1); if (k === 'Space' && gana(b)) { setB(Array(9).fill(null)); setMsg(''); } });
      const okOrden = () => { const ok = orden.join() === '0,1,2,3,4'; if (ok) fin(true, res.p === 0 ? 1 : 0.75, 'Ese es el diagrama de decisiones de la máquina: revisar las reglas en orden, de la más importante a la menos.'); else { p.snd('err'); p.onErr('Piensen: ¿qué es más urgente, ganar o tomar el centro? El orden importa.', 0); setOrden([]); } };
      if (ord) return Wrap(Box({ border: '2px solid ' + OK }, P([B('¡Lo lograron! '), T === 1 ? 'Ahora piensen como la máquina.' : 'Ahora escriban el diagrama que usa la máquina para no perder nunca.'])), P('Toquen las reglas en el orden en que la máquina las revisa (como los rombos de un diagrama, de arriba hacia abajo):'),
        div({ display: 'flex', flexDirection: 'column', gap: 6 }, ...REG.map((r, i) => h('button', { key: i, disabled: orden.includes(i), onClick: () => setOrden(orden.concat([i])), style: { textAlign: 'left', padding: '10px 12px', background: orden.includes(i) ? '#1b2a33' : BG, color: orden.includes(i) ? MU : TX, border: '2px solid ' + LN, fontSize: 15, cursor: 'pointer' } }, (orden.includes(i) ? (orden.indexOf(i) + 1) + '. ' : '◆ ') + r))),
        div({ display: 'flex', gap: 10 }, Btn('Comprobar el diagrama', okOrden, OK, orden.length < 5), Btn('Borrar', () => setOrden([]), '#9fb6c0')));
      return Wrap(P(['Ustedes son las ', B('X'), '. ', meta, ' J1 mueve con W A S D, J2 con las flechas; cuando los dos estén en la misma casilla, juegan con E + ENTER (o clic).']), div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('GANADAS ' + res.g, OK), Stat('EMPATES ' + res.e), Stat('PERDIDAS ' + res.p, ER)),
        div({ display: 'grid', gridTemplateColumns: 'repeat(3,96px)', gap: 8, justifyContent: 'center' }, ...b.map((x, i) => h('button', { key: i, onClick: () => jugar(i), style: { height: 96, fontFamily: HEAD, fontSize: 54, background: '#07111a', color: x === 'X' ? J1 : J2, border: '3px solid ' + (c1 === i && c2 === i ? '#fff' : c1 === i ? J1 : c2 === i ? J2 : LN), cursor: 'pointer', textShadow: x ? '0 0 14px currentColor' : 'none' } }, x || ''))),
        msg ? Box({ border: '2px solid ' + GOLD }, P([B(msg), ' · ESPACIO para otra partida.'])) : Dual(dual, 'a la vez para jugar'));
    }
    // ---------- NIM ----------
    function Nim(p) {
      const T = p.tier, fin = useOnce(p);
      const gen = () => T === 1 ? [p.h.pick([13, 14, 15, 17, 18, 19])] : T === 2 ? p.h.pick([[2, 3, 4], [1, 4, 6], [3, 5, 7], [2, 5, 6]]) : p.h.pick([[3, 4, 6, 8], [2, 5, 7, 9], [1, 6, 9, 11], [4, 5, 8, 10]]);
      const xr = hs => hs.reduce((a, b) => a ^ b, 0);
      const [hs, setHs] = useState(gen), [hi, setHi] = useState(0), [k, setK] = useState(1), [w, setW] = useState(0), [l, setL] = useState(0), [msg, setMsg] = useState(''), [maq, setMaq] = useState('');
      const maxT = T === 1 ? 3 : 99, fuera = hs.every(x => x === 0);
      const maquina = s => { let a = s.slice(); if (T === 1) { const r = a[0] % 4; const t = r === 0 ? 1 : r; a[0] -= Math.min(t, a[0]); setMaq('La máquina sacó ' + (r === 0 ? 1 : r)); }
        else { const x = xr(a); let i = a.findIndex(v => (v ^ x) < v); if (x === 0 || i < 0) { i = a.findIndex(v => v > 0); a[i] -= 1; setMaq('La máquina sacó 1 del montón ' + (i + 1)); } else { const q = a[i] - (a[i] ^ x); a[i] -= q; setMaq('La máquina sacó ' + q + ' del montón ' + (i + 1)); } } return a; };
      const tomar = () => { if (fuera || msg) return; if (k < 1 || k > hs[hi] || k > maxT) { p.onErr(T === 1 ? 'Pueden sacar de 1 a 3, sin pasarse.' : 'Ese montón no tiene tantos.', 0); return; } const a = hs.slice(); a[hi] -= k;
        if (a.every(x => x === 0)) { setHs(a); const nw = w + 1; setW(nw); setMsg('¡Ganaron! Sacaron el último.'); p.snd('ok'); if (nw >= 2) fin(true, l === 0 ? 1 : 0.75, 'Descubrieron la estrategia: ' + (T === 1 ? 'dejar siempre un múltiplo de 4.' : 'dejar la suma binaria (XOR) de los montones en 0.')); return; }
        const b2 = maquina(a); setHs(b2); setK(1); if (b2.every(x => x === 0)) { setL(l + 1); setMsg('La máquina sacó el último. Perdieron.'); p.snd('err'); } };
      const dual = useDual(tomar);
      useKeys((c, dn) => { if (!dn || p.fin) return; if (c === 'Space' && msg) { setHs(gen()); setMsg(''); setMaq(''); setHi(0); setK(1); } if (c === 'KeyA') setHi((hi + hs.length - 1) % hs.length); if (c === 'KeyD') setHi((hi + 1) % hs.length); if (c === 'ArrowLeft') setK(Math.max(1, k - 1)); if (c === 'ArrowRight') setK(k + 1); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      const pista = l >= 1 ? (T === 1 ? 'Pista: quien deja 4 fósforos gana. ¿Y 8? ¿Y 12?' : 'Pista: escriban cada montón en binario y sumen sin llevar (XOR). Si el resultado es 0 después de su jugada, van ganando.') : '';
      return Wrap(P(['Nim contra la máquina. Por turnos sacan fósforos; ', B('quien saca el último, gana'), '. ', T === 1 ? 'Pueden sacar de 1 a 3.' : 'Pueden sacar cuantos quieran, pero de un solo montón.', ' Ganen 2 partidas: hay una estrategia que nunca falla.']),
        Ctrls(Tag(1, 'A · D elige el montón'), Tag(2, '← · → cuántos sacar')), div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('GANADAS ' + w + ' / 2', OK), Stat('PERDIDAS ' + l, ER)),
        Box({ display: 'flex', flexDirection: 'column', gap: 12 }, ...hs.map((n, i) => h('div', { key: i, onClick: () => setHi(i), style: { display: 'flex', alignItems: 'center', gap: 10, padding: 8, border: '2px solid ' + (hi === i ? J1 : 'transparent'), cursor: 'pointer' } }, Stat('M' + (i + 1) + ' · ' + n + (T > 1 ? ' (' + n.toString(2).padStart(4, '0') + ')' : ''), hi === i ? J1 : MU),
          div({ display: 'flex', gap: 4, flexWrap: 'wrap' }, ...[...Array(n)].map((_, j) => div({ key: j, width: 8, height: 46, background: hi === i && j >= n - k ? J2 : '#e8d9b0', borderTop: '8px solid #c62828', boxShadow: hi === i && j >= n - k ? '0 0 8px ' + J2 : 'none' })))))),
        maq ? Stat(maq, GOLD) : null, pista ? Box({ border: '2px solid ' + GOLD }, P(pista)) : null,
        msg ? Box({ border: '2px solid ' + (/Ganaron/.test(msg) ? OK : ER) }, P([B(msg), ' · ESPACIO para otra partida.'])) : Dual(dual, 'J1 E + J2 ENTER = sacar ' + k + ' del montón ' + (hi + 1)));
    }
    // ---------- AJEDREZ ----------
    const PZ = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
    const POS = [{ t: 1, d: 'Mate del pasillo', p: { a1: 'R', g1: 'K', g8: 'k', f7: 'p', g7: 'p', h7: 'p' }, sol: [['a1', 'a8']], ex: 'La torre da jaque en la última fila y los peones encierran a su propio rey.' },
      { t: 1, d: 'La dama y el rey juntos', p: { g6: 'K', d1: 'Q', g8: 'k' }, sol: [['d1', 'd8']], ex: 'La dama controla la fila 8 y el rey blanco tapa f7, g7 y h7.' },
      { t: 2, d: 'La dama protegida', p: { f6: 'K', a7: 'Q', h8: 'k' }, sol: [['a7', 'g7']], ex: 'En g7 la dama da jaque, controla g8 y h7, y el rey blanco la protege.' },
      { t: 2, d: 'Torre larga', p: { b6: 'K', h1: 'R', a8: 'k' }, sol: [['h1', 'h8']], ex: 'El rey blanco tapa a7 y b7; la torre cubre toda la fila 8.' },
      { t: 3, d: 'Mate en 2: la escalera de torres', p: { a6: 'R', b5: 'R', g1: 'K', h8: 'k' }, sol: [['b5', 'b7'], ['a6', 'a7']], resp: ['h8', 'g8'], sol2: { 'b5b7': ['a6', 'a8'], 'a6a7': ['b5', 'b8'] }, ex: 'La primera torre encierra al rey en la última fila; la segunda da el mate.' }];
    const sq = (f, r) => 'abcdefgh'[f] + (r + 1);
    function Ajedrez(p) {
      const T = p.tier, fin = useOnce(p), L = POS.filter(x => T === 3 ? x.t === 3 || x.t === 2 : x.t === T);
      const [i, setI] = useState(0), [pos, setPos] = useState(() => Object.assign({}, L[0].p)), [o, setO] = useState(null), [paso, setPaso] = useState(0), [ok, setOk] = useState(0), [err, setErr] = useState(0), [fb, setFb] = useState(null), [c1, setC1] = useState(0), [c2, setC2] = useState(63), [prim, setPrim] = useState(null);
      const X = L[i];
      const intentar = (a, b) => { if (fb) return; const k = a + b;
        if (X.sol2 && paso === 1) { const s = X.sol2[prim]; if (s && s[0] === a && s[1] === b) { const np = Object.assign({}, pos); np[b] = np[a]; delete np[a]; setPos(np); listo(true); } else mal(); return; }
        if (X.sol.some(s => s[0] === a && s[1] === b)) { const np = Object.assign({}, pos); np[b] = np[a]; delete np[a];
          if (X.sol2) { np[X.resp[1]] = np[X.resp[0]]; delete np[X.resp[0]]; setPos(np); setPrim(k); setPaso(1); setO(null); p.snd('click'); setFb(null); return; } setPos(np); listo(true); } else mal(); };
      const mal = () => { setErr(err + 1); setO(null); p.snd('err'); p.onErr('Esa jugada no da mate. Busquen un jaque que no deje casillas de escape.', 0); };
      const listo = b => { p.snd('ok'); setOk(ok + 1); setFb(X.ex); };
      const sig = () => { if (i + 1 >= L.length) { fin(true, err === 0 ? 1 : err <= 2 ? 0.75 : 0.5, 'Resolvieron ' + L.length + ' problemas con ' + err + ' errores.'); return; } setI(i + 1); setPos(Object.assign({}, L[i + 1].p)); setFb(null); setPaso(0); setO(null); };
      const clic = s => { if (fb) return; if (o) { if (o === s) { setO(null); return; } intentar(o, s); setO(null); } else if (pos[s] && pos[s] === pos[s].toUpperCase()) setO(s); };
      const idx = n => sq(n % 8, 7 - Math.floor(n / 8));
      const mv = (c, d) => ({ L: c % 8 ? c - 1 : c, R: c % 8 < 7 ? c + 1 : c, U: c > 7 ? c - 8 : c, D: c < 56 ? c + 8 : c })[d];
      useKeys((k, dn) => { if (!dn || p.fin) return; if (fb && k === 'Space') { sig(); return; } const a = { KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D' }[k], r = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[k]; if (a) setC1(mv(c1, a)); if (r) setC2(mv(c2, r)); if (k === 'KeyE') { const s = idx(c1); if (pos[s] && pos[s] === pos[s].toUpperCase()) setO(s); } if (k === 'Enter' && o) { intentar(o, idx(c2)); setO(null); } });
      return Wrap(P(['Juegan las blancas. ', B(X.sol2 ? 'Mate en 2' : 'Mate en 1'), ': ', X.d, '. J1 elige la pieza (W A S D + E) y J2 la casilla de destino (flechas + ENTER). También con clic.']), div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('PROBLEMA ' + (i + 1) + ' / ' + L.length), Stat('ERRORES ' + err, err ? ER : MU), paso === 1 ? Stat('Las negras respondieron ' + X.resp.join('–') + '. ¡Ahora el mate!', GOLD) : null),
        div({ display: 'grid', gridTemplateColumns: 'repeat(8,minmax(0,52px))', justifyContent: 'center', border: '4px solid #5a3a1e' }, ...[...Array(64)].map((_, n) => { const s = idx(n), f = n % 8, r = 7 - Math.floor(n / 8), pz = pos[s];
          return h('button', { key: n, onClick: () => clic(s), style: { aspectRatio: '1', border: 'none', outline: c1 === n && c2 === n ? '3px solid #fff' : c1 === n ? '3px solid ' + J1 : c2 === n ? '3px solid ' + J2 : 'none', outlineOffset: -3, background: o === s ? GOLD : (f + r) % 2 ? '#e9d7b4' : '#a77b52', fontSize: 34, lineHeight: 1, cursor: 'pointer', color: pz && pz === pz.toUpperCase() ? '#fff' : '#111', textShadow: pz && pz === pz.toUpperCase() ? '0 0 2px #000,0 0 2px #000' : 'none', padding: 0 } }, pz ? PZ[pz] : ''); })),
        fb ? Wrap(Box({ border: '2px solid ' + OK }, P([B('¡Jaque mate! '), fb])), Btn(i + 1 >= L.length ? 'Terminar (ESPACIO)' : 'Siguiente problema (ESPACIO)', sig, OK)) : Stat(o ? 'Pieza elegida: ' + o + ' · ahora el destino' : 'Elijan una pieza blanca', MU));
    }
    // ---------- LA GALLETA (puntos y cuadritos) ----------
    function Galleta(p) {
      const T = p.tier, fin = useOnce(p), N = T === 1 ? 3 : 4;
      const lineas = []; for (let r = 0; r <= N; r++) for (let c = 0; c < N; c++) lineas.push(['h', r, c]); for (let r = 0; r < N; r++) for (let c = 0; c <= N; c++) lineas.push(['v', r, c]);
      const key = l => l.join(','), [on, setOn] = useState({}), [own, setOwn] = useState({}), [turno, setTurno] = useState('nos'), [cur, setCur] = useState(0), [quien, setQuien] = useState(1);
      const lados = (o, r, c) => [key(['h', r, c]), key(['h', r + 1, c]), key(['v', r, c]), key(['v', r, c + 1])].filter(k => o[k]).length;
      const cajasDe = (o, l) => { const [t, r, c] = l, cs = t === 'h' ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]]; return cs.filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && lados(o, a, b) === 4); };
      const libres = o => lineas.filter(l => !o[key(l)]);
      const aplicar = (o, ow, l, q) => { const no = Object.assign({}, o, { [key(l)]: q }), nw = Object.assign({}, ow); const cs = cajasDe(no, l); cs.forEach(([a, b]) => { nw[a + ',' + b] = q; }); return [no, nw, cs.length]; };
      const terminar = nw => { const v = Object.values(nw), n = v.filter(x => x === 'nos').length, m = v.length - n; if (n > m) fin(true, n - m >= 3 ? 1 : 0.75, 'Ganaron ' + n + ' a ' + m + '. La clave: no regalar el tercer lado de un cuadrito.'); else { p.snd('err'); p.onErr('Perdieron ' + n + ' a ' + m + '. Empiecen otra partida: eviten dibujar el TERCER lado de un cuadrito.', 0); setTimeout(() => { setOn({}); setOwn({}); setTurno('nos'); }, 1600); } };
      const maquina = (o, ow) => { let a = o, b = ow;
        for (let g = 0; g < 40; g++) { const L = libres(a); if (!L.length) { setOn(a); setOwn(b); terminar(b); return; }
          let l = L.find(x => cajasDe(Object.assign({}, a, { [key(x)]: 1 }), x).length) || null;
          if (!l) { const seg = L.filter(x => { const t = Object.assign({}, a, { [key(x)]: 1 }), [tt, r, c] = x, cs = tt === 'h' ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]]; return !cs.some(([q, w]) => q >= 0 && w >= 0 && q < N && w < N && lados(t, q, w) === 3); }); l = (T === 1 && Math.random() < 0.4 ? L : seg.length ? seg : L)[Math.floor(Math.random() * (seg.length && !(T === 1) ? seg.length : L.length))] || L[0]; }
          const [na, nb, k] = aplicar(a, b, l, 'maq'); a = na; b = nb; if (!k) break; }
        setOn(a); setOwn(b); if (!libres(a).length) { terminar(b); return; } setTurno('nos'); };
      const jugar = l => { if (turno !== 'nos' || on[key(l)]) return; const [no, nw, k] = aplicar(on, own, l, 'nos'); setOn(no); setOwn(nw); setQuien(3 - quien); p.snd('click'); if (!libres(no).length) { terminar(nw); return; } if (!k) { setTurno('maq'); setTimeout(() => maquina(no, nw), 450); } };
      const L = libres(on);
      useKeys((c, dn) => { if (!dn || p.fin || turno !== 'nos' || !L.length) return; const mine = quien === 1 ? ['KeyA', 'KeyD', 'KeyE'] : ['ArrowLeft', 'ArrowRight', 'Enter']; if (c === mine[0]) setCur((cur + L.length - 1) % L.length); if (c === mine[1]) setCur((cur + 1) % L.length); if (c === mine[2]) jugar(L[cur % L.length]); });
      const S = 70, M0 = 20, sel = L[cur % (L.length || 1)], n = Object.values(own).filter(x => x === 'nos').length, m = Object.values(own).length - n;
      return Wrap(P(['La galleta: por turnos dibujan una línea. Quien cierra un cuadrito se lo lleva y ', B('vuelve a jugar'), '. Ganen a la máquina. Se turnan: ahora juega ', B(quien === 1 ? 'J1 (A · D elegir · E dibujar)' : 'J2 (← · → elegir · ENTER dibujar)'), '. También con clic.']), div({ display: 'flex', gap: 16 }, Stat('USTEDES ' + n, OK), Stat('MÁQUINA ' + m, ER), Stat(turno === 'nos' ? 'SU TURNO' : 'PIENSA LA MÁQUINA…', GOLD)),
        h('svg', { viewBox: '0 0 ' + (N * S + M0 * 2) + ' ' + (N * S + M0 * 2), style: { width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', background: '#f7f3e8', borderRadius: 10 } },
          ...Object.keys(own).map(k => { const [r, c] = k.split(',').map(Number); return h('rect', { key: 'o' + k, x: M0 + c * S + 4, y: M0 + r * S + 4, width: S - 8, height: S - 8, fill: own[k] === 'nos' ? 'rgba(95,208,232,.45)' : 'rgba(255,123,114,.45)' }); }),
          ...lineas.map(l => { const [t, r, c] = l, x1 = M0 + c * S, y1 = M0 + r * S, x2 = t === 'h' ? x1 + S : x1, y2 = t === 'h' ? y1 : y1 + S, v = on[key(l)], es = sel && key(sel) === key(l);
            return h('line', { key: key(l), x1, y1, x2, y2, stroke: v ? (v === 'nos' ? '#1f6fb0' : '#c62828') : es ? GOLD : 'rgba(0,0,0,.08)', strokeWidth: v ? 6 : es ? 8 : 14, strokeLinecap: 'round', style: { cursor: v ? 'default' : 'pointer' }, onClick: () => jugar(l) }); }),
          ...[...Array((N + 1) * (N + 1))].map((_, k) => h('circle', { key: 'd' + k, cx: M0 + (k % (N + 1)) * S, cy: M0 + Math.floor(k / (N + 1)) * S, r: 6, fill: '#26323a' }))));
    }
    // ---------- CRUCIGRAMA ----------
    const CRU = [['ARDUINO', 2, 0, 'h', 'Placa programable que usamos en Robótica', 1], ['LED', 0, 2, 'v', 'Luz pequeña que se enciende con digitalWrite', 1], ['SENSOR', 0, 5, 'v', 'Componente que mide algo del entorno', 1], ['LOOP', 4, 3, 'h', 'Función de Arduino que se repite para siempre', 1], ['DELAY', 0, 0, 'h', 'Función que hace esperar al Arduino (en milisegundos)', 2], ['PIN', 4, 6, 'v', 'Cada conexión numerada de la placa', 3]];
    function Crucigrama(p) {
      const T = p.tier, fin = useOnce(p), W = CRU.filter(x => x[5] <= T), cells = {};
      W.forEach(([w, r, c, d], wi) => w.split('').forEach((ch, k) => { const rr = d === 'v' ? r + k : r, cc = d === 'h' ? c + k : c; cells[rr + ',' + cc] = ch; }));
      const [val, setVal] = useState({}), [sel, setSel] = useState(Object.keys(cells)[0]), [dir, setDir] = useState('h'), [mal, setMal] = useState({}), [tries, setTries] = useState(0);
      const mover = (dr, dc) => { const [r, c] = sel.split(',').map(Number); for (let s = 1; s < 8; s++) { const k = (r + dr * s) + ',' + (c + dc * s); if (cells[k]) { setSel(k); return; } } };
      useKeys((c, dn, e) => { if (!dn || p.fin) return; const ch = e && e.key && e.key.length === 1 ? e.key.toUpperCase() : null;
        if (ch && /[A-ZÑ]/.test(ch)) { setVal(Object.assign({}, val, { [sel]: ch })); setMal({}); if (dir === 'h') mover(0, 1); else mover(1, 0); return; }
        if (c === 'Backspace') { setVal(Object.assign({}, val, { [sel]: '' })); return; } if (c === 'ArrowLeft') { setDir('h'); mover(0, -1); } if (c === 'ArrowRight') { setDir('h'); mover(0, 1); } if (c === 'ArrowUp') { setDir('v'); mover(-1, 0); } if (c === 'ArrowDown') { setDir('v'); mover(1, 0); } if (c === 'Enter') comprobar(); });
      const comprobar = () => { const m = {}; Object.keys(cells).forEach(k => { if (val[k] !== cells[k]) m[k] = 1; }); const n = Object.keys(m).length; setTries(tries + 1); if (!n) fin(true, tries === 0 ? 1 : tries <= 2 ? 0.75 : 0.5, '¡Crucigrama completo! Todas son palabras de la clase de Robótica.'); else { setMal(m); p.snd('err'); p.onErr(n + ' casillas incorrectas o vacías (en rojo).', 0); } };
      const maxR = Math.max(...Object.keys(cells).map(k => +k.split(',')[0])) + 1, maxC = Math.max(...Object.keys(cells).map(k => +k.split(',')[1])) + 1;
      const num = {}; W.forEach(([w, r, c], i) => { num[r + ',' + c] = (num[r + ',' + c] ? num[r + ',' + c] + '/' : '') + (i + 1); });
      return Wrap(P(['Crucigrama de Robótica. Toquen una casilla y ', B('escriban con el teclado'), ' (las flechas mueven y cambian la dirección; ENTER comprueba). Pueden turnarse: uno dicta y el otro escribe.']),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 18, alignItems: 'start' },
          div({ display: 'grid', gridTemplateColumns: 'repeat(' + maxC + ',46px)', gap: 3, justifyContent: 'center' }, ...[...Array(maxR * maxC)].map((_, n) => { const k = Math.floor(n / maxC) + ',' + (n % maxC); if (!cells[k]) return div({ key: k, width: 46, height: 46 });
            return h('button', { key: k, onClick: () => setSel(k), style: { width: 46, height: 46, position: 'relative', background: mal[k] ? 'rgba(255,123,114,.3)' : sel === k ? GOLD : '#f7f3e8', border: '2px solid ' + (sel === k ? '#fff' : '#26323a'), fontFamily: HEAD, fontSize: 24, color: '#081018', cursor: 'pointer', padding: 0 } }, num[k] ? h('span', { style: { position: 'absolute', left: 2, top: 0, fontSize: 9, fontFamily: MONO } }, num[k]) : null, val[k] || ''); })),
          Box({ display: 'flex', flexDirection: 'column', gap: 8 }, Stat('PISTAS', GOLD), ...W.map(([w, r, c, d, q], i) => P([B((i + 1) + ' ' + (d === 'h' ? '→ ' : '↓ ')), q + ' (' + w.length + ' letras)'])), Btn('Comprobar (ENTER)', comprobar, OK))));
    }
    // ---------- 7 DIFERENCIAS ----------
    function Diferencias(p) {
      const T = p.tier, fin = useOnce(p), ND = T === 1 ? 5 : 7, lim = T === 3 ? 4 : 6;
      const [esc] = useState(() => { const fig = []; const cols = ['#e63946', '#2a9d8f', '#f4a261', '#457b9d', '#8d5fd3', '#2b9348', '#f72585'];
        for (let i = 0; i < 22; i++) fig.push({ t: p.h.pick(['c', 's', 't', 'e']), x: 30 + p.h.int(0, 340), y: 30 + p.h.int(0, 220), r: 14 + p.h.int(0, 16), col: p.h.pick(cols) });
        const dif = p.h.shuffle([...Array(22).keys()]).slice(0, ND), B2 = fig.map(f => Object.assign({}, f));
        dif.forEach((i, k) => { const tipo = T === 3 ? ['tam', 'col'][k % 2] : ['col', 'falta', 'tam', 'forma'][k % 4]; if (tipo === 'col') B2[i].col = cols[(cols.indexOf(B2[i].col) + 3) % cols.length]; if (tipo === 'falta') B2[i].oculta = true; if (tipo === 'tam') B2[i].r = Math.round(B2[i].r * (T === 3 ? 0.7 : 0.55)); if (tipo === 'forma') B2[i].t = B2[i].t === 'c' ? 's' : 'c'; });
        return { fig, B2, dif }; });
      const [hall, setHall] = useState([]), [err, setErr] = useState(0);
      const dibuja = (fs, click) => h('svg', { viewBox: '0 0 400 280', onClick: click, style: { width: '100%', display: 'block', background: '#fdf6e3', borderRadius: 10, cursor: click ? 'crosshair' : 'default' } }, h('rect', { x: 0, y: 220, width: 400, height: 60, fill: '#cde8b0' }), h('circle', { cx: 360, cy: 40, r: 22, fill: '#ffd166' }),
        ...fs.map((f, i) => f.oculta ? null : f.t === 'c' ? h('circle', { key: i, cx: f.x, cy: f.y, r: f.r, fill: f.col }) : f.t === 's' ? h('rect', { key: i, x: f.x - f.r, y: f.y - f.r, width: f.r * 2, height: f.r * 2, fill: f.col, rx: 3 }) : f.t === 't' ? h('polygon', { key: i, points: f.x + ',' + (f.y - f.r) + ' ' + (f.x + f.r) + ',' + (f.y + f.r) + ' ' + (f.x - f.r) + ',' + (f.y + f.r), fill: f.col }) : h('ellipse', { key: i, cx: f.x, cy: f.y, rx: f.r * 1.4, ry: f.r * 0.7, fill: f.col })),
        ...hall.map(i => h('circle', { key: 'h' + i, cx: esc.fig[i].x, cy: esc.fig[i].y, r: esc.fig[i].r + 8, fill: 'none', stroke: '#1d7a44', strokeWidth: 4 })));
      const clic = e => { const sv = e.currentTarget, r = sv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 400, y = (e.clientY - r.top) / r.height * 280;
        const i = esc.dif.find(k => !hall.includes(k) && Math.hypot(esc.fig[k].x - x, esc.fig[k].y - y) < esc.fig[k].r + 12);
        if (i != null) { const nh = hall.concat([i]); setHall(nh); p.snd('ok'); if (nh.length === ND) fin(true, err === 0 ? 1 : err <= 2 ? 0.75 : 0.5, '¡Encontraron las ' + ND + ' diferencias! Observar con método: por zonas, de izquierda a derecha.'); }
        else { const ne = err + 1; setErr(ne); p.snd('err'); if (ne >= lim) fin(false, 0, 'Demasiados clics al azar. Revisen por zonas antes de tocar.'); else p.onErr('Ahí no hay diferencia. Les quedan ' + (lim - ne) + ' errores.', 0); } };
      return Wrap(P(['Encuentren las ', B(ND + ' diferencias'), ' tocando la imagen de la DERECHA. Divídanse la imagen: J1 revisa la mitad izquierda y J2 la derecha. ', T === 3 ? 'Ojo: son cambios sutiles de tamaño y color.' : '']), div({ display: 'flex', gap: 16 }, Stat('ENCONTRADAS ' + hall.length + ' / ' + ND, OK), Stat('ERRORES ' + err + ' / ' + lim, err ? ER : MU)),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 14 }, Box({ padding: 8 }, Stat('ORIGINAL', MU), dibuja(esc.fig)), Box({ padding: 8, border: '2px solid ' + GOLD }, Stat('TOQUEN AQUÍ', GOLD), dibuja(esc.B2, clic))));
    }
    // ---------- LABERINTO ----------
    function Laberinto(p) {
      const T = p.tier, fin = useOnce(p), N = [7, 9, 11][T - 1], niebla = T === 3;
      const [mz] = useState(() => { const W = {}, vis = {}, st = [[0, 0]]; vis['0,0'] = 1; const k = (a, b, c, d) => [a + ',' + b, c + ',' + d].sort().join('|');
        while (st.length) { const [x, y] = st[st.length - 1], vs = p.h.shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]]).map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && !vis[a + ',' + b]); if (!vs.length) { st.pop(); continue; } const [a, b] = vs[0]; W[k(x, y, a, b)] = 1; vis[a + ',' + b] = 1; st.push([a, b]); }
        const dist = {}, q = [[0, 0]]; dist['0,0'] = 0; while (q.length) { const [x, y] = q.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const a = x + dx, b = y + dy; if (W[k(x, y, a, b)] && dist[a + ',' + b] == null) { dist[a + ',' + b] = dist[x + ',' + y] + 1; q.push([a, b]); } }); }
        return { W, k, opt: dist[(N - 1) + ',' + (N - 1)] }; });
      const [pos, setPos] = useState([0, 0]), [mov, setMov] = useState(0), [visto, setVisto] = useState({ '0,0': 1 });
      const ir = (dx, dy) => { if (p.fin) return; const [x, y] = pos, a = x + dx, b = y + dy; if (!mz.W[mz.k(x, y, a, b)]) { p.snd('err'); return; } setPos([a, b]); setMov(mov + 1); setVisto(Object.assign({}, visto, { [a + ',' + b]: 1 })); p.snd('click');
        if (a === N - 1 && b === N - 1) { const r = (mov + 1) / mz.opt; fin(true, r <= 1.3 ? 1 : r <= 2 ? 0.75 : 0.5, 'Llegaron con ' + (mov + 1) + ' movimientos (el camino más corto tenía ' + mz.opt + ').'); } };
      useKeys((c, dn) => { if (!dn) return; if (c === 'KeyA') ir(-1, 0); if (c === 'KeyD') ir(1, 0); if (c === 'ArrowUp') ir(0, -1); if (c === 'ArrowDown') ir(0, 1); });
      const S = Math.floor(440 / N), cerca = (x, y) => !niebla || Math.abs(x - pos[0]) + Math.abs(y - pos[1]) <= 2 || visto[x + ',' + y];
      return Wrap(P(['Lleven el robot a la salida. ', B('J1 solo mueve a los lados (A · D)'), ' y ', B('J2 solo arriba y abajo (↑ · ↓)'), ': tienen que coordinarse. ', niebla ? 'Solo ven cerca del robot: recuerden el camino.' : '']), div({ display: 'flex', gap: 16 }, Stat('MOVIMIENTOS ' + mov), Stat('CAMINO MÁS CORTO ' + mz.opt, MU)),
        h('svg', { viewBox: '-4 -4 ' + (N * S + 8) + ' ' + (N * S + 8), style: { width: '100%', maxWidth: 480, display: 'block', margin: '0 auto', background: '#07111a' } },
          ...[...Array(N * N)].map((_, n) => { const x = n % N, y = Math.floor(n / N), v = cerca(x, y); const L = []; if (!v) L.push(h('rect', { key: 'f', x: x * S, y: y * S, width: S, height: S, fill: '#0e1a24' }));
            if (v) { if (!mz.W[mz.k(x, y, x + 1, y)]) L.push(h('line', { key: 'r', x1: (x + 1) * S, y1: y * S, x2: (x + 1) * S, y2: (y + 1) * S, stroke: '#5fd0e8', strokeWidth: 3 })); if (!mz.W[mz.k(x, y, x, y + 1)]) L.push(h('line', { key: 'b', x1: x * S, y1: (y + 1) * S, x2: (x + 1) * S, y2: (y + 1) * S, stroke: '#5fd0e8', strokeWidth: 3 })); if (x === 0) L.push(h('line', { key: 'l', x1: 0, y1: y * S, x2: 0, y2: (y + 1) * S, stroke: '#5fd0e8', strokeWidth: 3 })); if (y === 0) L.push(h('line', { key: 't', x1: x * S, y1: 0, x2: (x + 1) * S, y2: 0, stroke: '#5fd0e8', strokeWidth: 3 })); }
            return h('g', { key: n }, ...L); }),
          h('rect', { x: (N - 1) * S + 6, y: (N - 1) * S + 6, width: S - 12, height: S - 12, fill: OK, opacity: 0.8 }), h('circle', { cx: pos[0] * S + S / 2, cy: pos[1] * S + S / 2, r: S * 0.32, fill: GOLD, style: { filter: 'drop-shadow(0 0 6px ' + GOLD + ')' } })));
    }
    // ---------- CARRERA DE ESFEROS ----------
    const PISTAS = { 1: [[40, 250], [200, 250], [320, 160], [480, 160], [560, 60]], 2: [[40, 260], [180, 260], [240, 150], [120, 70], [300, 50], [420, 150], [560, 120]], 3: [[40, 270], [160, 270], [220, 180], [100, 110], [180, 40], [360, 60], [420, 180], [540, 230], [570, 90]] };
    const dSeg = (px, py, [ax, ay], [bx, by]) => { const vx = bx - ax, vy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy))); return Math.hypot(px - ax - t * vx, py - ay - t * vy); };
    function Esferos(p) {
      const T = p.tier, fin = useOnce(p), C = PISTAS[T], AN = [30, 26, 22][T - 1], meta = C[C.length - 1];
      const dentro = (x, y) => C.slice(1).some((b, i) => dSeg(x, y, C[i], b) <= AN);
      const [js, setJs] = useState([{ x: C[0][0], y: C[0][1] - 8, ang: -10, f: 50, n: 0 }, { x: C[0][0], y: C[0][1] + 8, ang: -10, f: 50, n: 0 }]), [t, setT] = useState(0), [anim, setAnim] = useState(null), [msg, setMsg] = useState('');
      const lanzar = j => { if (anim || p.fin || j !== t) return; const J = js[j]; let x = J.x, y = J.y, vx = Math.cos(J.ang * Math.PI / 180) * J.f * 0.22, vy = Math.sin(J.ang * Math.PI / 180) * J.f * 0.22, sale = false; const tray = [];
        for (let k = 0; k < 400 && Math.hypot(vx, vy) > 0.15; k++) { x += vx; y += vy; vx *= 0.955; vy *= 0.955; tray.push([x, y]); if (!dentro(x, y)) { sale = true; break; } if (Math.hypot(x - meta[0], y - meta[1]) < AN) break; }
        let i = 0; setAnim(tray[0]); const tm = setInterval(() => { i += 3; if (i >= tray.length) { clearInterval(tm); setAnim(null);
            const nj = js.slice(); nj[j] = Object.assign({}, J, { n: J.n + 1 }); if (!sale) { nj[j].x = x; nj[j].y = y; } setJs(nj); p.snd(sale ? 'err' : 'click');
            if (!sale && Math.hypot(x - meta[0], y - meta[1]) < AN) { const n = nj[j].n, par = [4, 6, 8][T - 1]; fin(true, n <= par ? 1 : n <= par + 3 ? 0.75 : 0.5, 'Ganó J' + (j + 1) + ' en ' + n + ' lanzamientos. Estimar ángulo y fuerza es geometría en acción.'); return; }
            setMsg(sale ? '¡J' + (j + 1) + ' se salió de la pista! Vuelve a donde estaba.' : ''); setT(1 - t); } else setAnim(tray[i]); }, 16); };
      const aj = (j, da, df) => { if (anim) return; const nj = js.slice(); nj[j] = Object.assign({}, nj[j], { ang: nj[j].ang + da, f: Math.max(10, Math.min(100, nj[j].f + df)) }); setJs(nj); };
      useKeys((c, dn) => { if (!dn || p.fin) return; if (c === 'KeyA') aj(0, -6, 0); if (c === 'KeyD') aj(0, 6, 0); if (c === 'KeyW') aj(0, 0, 5); if (c === 'KeyS') aj(0, 0, -5); if (c === 'KeyE') lanzar(0); if (c === 'ArrowLeft') aj(1, -6, 0); if (c === 'ArrowRight') aj(1, 6, 0); if (c === 'ArrowUp') aj(1, 0, 5); if (c === 'ArrowDown') aj(1, 0, -5); if (c === 'Enter') lanzar(1); });
      const pen = (J, col, k) => { const a = J.ang * Math.PI / 180; return h('g', { key: k }, J === js[t] && !anim ? h('line', { x1: J.x, y1: J.y, x2: J.x + Math.cos(a) * J.f * 1.2, y2: J.y + Math.sin(a) * J.f * 1.2, stroke: col, strokeWidth: 3, strokeDasharray: '6 4' }) : null, h('rect', { x: J.x - 14, y: J.y - 3, width: 28, height: 6, rx: 3, fill: col, transform: 'rotate(' + J.ang + ' ' + J.x + ' ' + J.y + ')', style: { filter: 'drop-shadow(0 0 4px ' + col + ')' } })); };
      return Wrap(P(['Carrera de esferos: por turnos, cada uno elige ', B('ángulo y fuerza'), ' y lanza. Si se sale de la pista, vuelve a donde estaba. ¡Gana quien llegue primero a la meta!']), Ctrls(Tag(1, 'A · D ángulo · W · S fuerza · E lanzar'), Tag(2, '← · → ángulo · ↑ · ↓ fuerza · ENTER lanzar')),
        div({ display: 'flex', gap: 16, flexWrap: 'wrap' }, Stat('TURNO: J' + (t + 1), t ? J2 : J1), Stat('J1 · ' + js[0].n + ' lanz. · fuerza ' + js[0].f, J1), Stat('J2 · ' + js[1].n + ' lanz. · fuerza ' + js[1].f, J2)),
        h('svg', { viewBox: '0 0 600 300', style: { width: '100%', display: 'block', background: '#f7f3e8', borderRadius: 10, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(47,111,208,.15) 24px)' } },
          h('polyline', { points: C.map(q => q.join(',')).join(' '), fill: 'none', stroke: '#c9d6e3', strokeWidth: AN * 2, strokeLinecap: 'round', strokeLinejoin: 'round' }), h('polyline', { points: C.map(q => q.join(',')).join(' '), fill: 'none', stroke: '#2f6fd0', strokeWidth: 2, strokeDasharray: '8 6', opacity: 0.5 }),
          h('circle', { cx: meta[0], cy: meta[1], r: AN, fill: 'none', stroke: '#1d7a44', strokeWidth: 4 }), h('text', { x: meta[0], y: meta[1] + 5, textAnchor: 'middle', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 14, fill: '#1d7a44' }, 'META'),
          pen(js[0], '#1f6fb0', 0), pen(js[1], '#d97706', 1), anim ? h('circle', { cx: anim[0], cy: anim[1], r: 6, fill: t ? '#d97706' : '#1f6fb0' }) : null),
        msg ? Box({ border: '2px solid ' + ER }, P(msg)) : null);
    }
    make.c = { tresenraya: TresEnRaya, nim: Nim, ajedrez: Ajedrez, galleta: Galleta, crucigrama: Crucigrama, diferencias: Diferencias, laberinto: Laberinto, esferos: Esferos };
    return make.c;
  }
  window.ESC_MESA = { make };
})();

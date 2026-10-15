// Laboratorio de inventos · circuitos Arduino, dos robots, el bar del colegio, códigos secretos, ritmo y torre (cooperativos J1/J2).
(function () {
  function make(React, U) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const { div, P, B, Tag, Ctrls, Stat, Box, Wrap, useKeys, useDual, Dual, useOnce } = U, { J1, J2, OK, ER, TX, MU, BG, LN, MONO, HEAD } = U.C;
    const GOLD = '#ffd166';
    const Btn = (t, on, col, dis) => h('button', { onClick: on, disabled: dis, style: { alignSelf: 'flex-start', background: dis ? '#1b2a33' : col || OK, color: dis ? MU : '#081018', border: 'none', fontFamily: HEAD, fontSize: 16, padding: '10px 18px', cursor: dis ? 'default' : 'pointer' } }, t);
    // ---- quiz cooperativo genérico ----
    function Quiz(p, intro, steps, need, cierre, V) {
      const fin = useOnce(p), [i, setI] = useState(0), [ok, setOk] = useState(0), [fb, setFb] = useState(null), [c1, setC1] = useState(0), [c2, setC2] = useState(0), S = steps[Math.min(i, steps.length - 1)], n = S.o.length;
      const sig = () => { setFb(null); setC1(0); setC2(0); if (i + 1 >= steps.length) { if (ok >= need) fin(true, ok === steps.length ? 1 : 0.75, ok + ' de ' + steps.length + ' correctas. ' + (cierre || '')); else fin(false, 0, ok + ' de ' + steps.length + '. Necesitaban ' + need + '. Revisen las explicaciones.'); return; } setI(i + 1); };
      const dual = useDual(() => { if (fb) return; if (c1 !== c2) { p.onErr('Marquen los dos la misma opción.', 0); return; } const b = c1 === S.a; p.snd(b ? 'ok' : 'err'); if (b) setOk(ok + 1); setFb({ b, k: c1 }); });
      useKeys((c, dn) => { if (!dn || p.fin) return; if (fb) { if (c === 'Space') sig(); return; } if (c === 'KeyA' || c === 'KeyW') setC1((c1 + n - 1) % n); if (c === 'KeyD' || c === 'KeyS') setC1((c1 + 1) % n); if (c === 'ArrowLeft' || c === 'ArrowUp') setC2((c2 + n - 1) % n); if (c === 'ArrowRight' || c === 'ArrowDown') setC2((c2 + 1) % n); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return Wrap(P(intro), div({ display: 'flex', gap: 16 }, Stat('PASO ' + (i + 1) + ' / ' + steps.length), Stat('CORRECTAS ' + ok, OK)), V ? V(S) : null, div({ fontFamily: HEAD, fontSize: 22, color: TX, lineHeight: 1.2 }, S.q),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 10 }, ...S.o.map((o, k) => { const m = fb ? (k === S.a ? OK : k === fb.k ? ER : null) : null; return h('button', { key: k, onClick: () => { setC1(k); setC2(k); }, style: { textAlign: 'left', padding: '12px 14px', background: m ? m + '22' : BG, border: '2px solid ' + (m || (c1 === k && c2 === k ? '#fff' : LN)), color: TX, fontSize: 17, fontWeight: 600, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center' } }, div({ display: 'flex', gap: 4, flex: 'none' }, div({ width: 12, height: 12, background: c1 === k ? J1 : 'transparent', border: '2px solid ' + J1 }), div({ width: 12, height: 12, background: c2 === k ? J2 : 'transparent', border: '2px solid ' + J2 })), String(o)); })),
        fb ? Box({ border: '2px solid ' + (fb.b ? OK : ER), display: 'flex', flexDirection: 'column', gap: 8 }, P([B(fb.b ? '¡Correcto! ' : 'No era esa. '), S.ex]), Btn(i + 1 >= steps.length ? 'Terminar (ESPACIO)' : 'Siguiente (ESPACIO)', sig)) : Dual(dual, 'J1 A·D · J2 ←·→ · E + ENTER a la vez'));
    }
    const opts = (H, r, f) => { const s = new Set([r]); let k = 0; while (s.size < 4 && k++ < 50) s.add(f()); const a = H.shuffle([...s]); a.r = r; return a; };

    // ---------- BANCO DE CIRCUITOS ----------
    const COMP = { led: ['LED con resistencia', 'Salida digital: cualquier pin D2 a D13', p => /^D/.test(p)], boton: ['Pulsador', 'Entrada digital: un pin D2 a D13', p => /^D/.test(p)], ldr: ['Sensor de luz (LDR)', 'Da muchos valores: pin analógico A0 a A5', p => /^A/.test(p)], servo: ['Servomotor', 'Necesita PWM: pines con ~ (3, 5, 6, 9, 10, 11)', p => /^D(3|5|6|9|10|11)$/.test(p)], zumb: ['Zumbador', 'Salida digital: D2 a D13', p => /^D/.test(p)], temp: ['Sensor de temperatura', 'Analógico: A0 a A5', p => /^A/.test(p)], motor: ['Motor con velocidad', 'Velocidad variable = PWM (~)', p => /^D(3|5|6|9|10|11)$/.test(p)] };
    const PINES = ['D2', 'D3', 'D5', 'D6', 'D8', 'D9', 'D11', 'D13', 'A0', 'A1'];
    function Circuitos(p) {
      const T = p.tier, fin = useOnce(p), lista = T === 1 ? ['led', 'boton', 'ldr'] : T === 2 ? ['led', 'boton', 'ldr', 'servo'] : ['led', 'boton', 'temp', 'servo', 'motor'];
      const [asig, setAsig] = useState({}), [sel, setSel] = useState(lista[0]), [res, setRes] = useState(false), [int, setInt] = useState(0), [run, setRun] = useState(false);
      const usado = pin => Object.keys(asig).find(k => asig[k] === pin);
      const poner = pin => { if (res) return; const n = Object.assign({}, asig); const o = usado(pin); if (o) delete n[o]; n[sel] = pin; setAsig(n); p.snd('click'); const sig = lista.find(k => !n[k]); if (sig) setSel(sig); };
      const probar = () => { if (lista.some(k => !asig[k])) { p.onErr('Conecten todos los componentes.', 0); return; } const mal = lista.filter(k => !COMP[k][2](asig[k])); setInt(int + 1); setRun(true);
        if (!mal.length) { setRes(true); p.snd('ok'); fin(true, int === 0 ? 1 : int <= 2 ? 0.75 : 0.5, 'Circuito correcto: digitales para encender o leer botones, analógicos para sensores y PWM (~) para controlar ángulo o velocidad.'); }
        else { p.snd('err'); p.onErr(COMP[mal[0]][0] + ' no funciona en ' + asig[mal[0]] + '. ' + (T === 1 ? COMP[mal[0]][1] : 'Piensen qué tipo de señal necesita.'), 0); setTimeout(() => setRun(false), 1500); } };
      const dual = useDual(probar);
      useKeys((c, dn) => { if (!dn || p.fin) return; const i = lista.indexOf(sel); if (c === 'KeyA') setSel(lista[(i + lista.length - 1) % lista.length]); if (c === 'KeyD') setSel(lista[(i + 1) % lista.length]); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return Wrap(P(['Conecten cada componente al pin correcto de la placa. ', B('J1'), ' elige el componente (A · D); ', B('J2'), ' toca el pin con el mouse. Prueben juntos con E + ENTER.']), Ctrls(Tag(1, 'A · D componente · E probar'), Tag(2, 'clic en el pin · ENTER probar')),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 16, alignItems: 'start' },
          div({ display: 'flex', flexDirection: 'column', gap: 8 }, ...lista.map(k => h('button', { key: k, onClick: () => setSel(k), style: { textAlign: 'left', padding: '10px 12px', background: sel === k ? 'rgba(95,208,232,.15)' : BG, border: '2px solid ' + (sel === k ? J1 : LN), color: TX, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 10 } }, h('span', { style: { fontWeight: 700 } }, COMP[k][0]), h('span', { style: { fontFamily: MONO, color: asig[k] ? (run ? (COMP[k][2](asig[k]) ? OK : ER) : GOLD) : MU } }, asig[k] || '—'))), T === 1 ? Box({}, P(COMP[sel][1])) : null),
          div({ background: '#0b4f6c', border: '3px solid #5fd0e8', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }, div({ fontFamily: HEAD, color: '#e8f1f2', fontSize: 18 }, 'ARDUINO UNO'), div({ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }, ...PINES.map(pin => { const u = usado(pin); return h('button', { key: pin, onClick: () => poner(pin), style: { padding: '10px 4px', fontFamily: MONO, fontWeight: 700, fontSize: 15, background: u ? GOLD : '#0a1016', color: u ? '#081018' : '#cfe', border: '2px solid ' + (u ? GOLD : '#3a6b80'), cursor: 'pointer' } }, pin + (/^D(3|5|6|9|10|11)$/.test(pin) ? '~' : '')); })), div({ fontSize: 13, color: '#cfe' }, '~ = PWM (salida con intensidad variable) · A = analógico'))), Dual(dual, 'a la vez para probar el circuito'));
    }

    // ---------- DOS ROBOTS COORDINADOS ----------
    const MV = { U: [0, -1, '↑'], D: [0, 1, '↓'], L: [-1, 0, '←'], R: [1, 0, '→'] };
    function Robots(p) {
      const T = p.tier, fin = useOnce(p), N = [5, 6, 7][T - 1];
      const [lv] = useState(() => { for (let it = 0; it < 300; it++) { const w = [...Array(N * N)].map(() => p.h.int(0, 99) < [8, 14, 18][T - 1]); const fr = w.map((x, i) => x ? -1 : i).filter(i => i >= 0); const [a, b, ga, gb] = p.h.shuffle(fr).slice(0, 4);
          const bfs = (s, g) => { const d = { [s]: 0 }, q = [s]; while (q.length) { const c = q.shift(); if (c === g) return d[c]; Object.values(MV).forEach(([dx, dy]) => { const x = c % N + dx, y = Math.floor(c / N) + dy, j = y * N + x; if (x >= 0 && y >= 0 && x < N && y < N && !w[j] && d[j] == null) { d[j] = d[c] + 1; q.push(j); } }); } return -1; };
          const da = bfs(a, ga), db = bfs(b, gb); if (da < 2 || db < 2 || da > 7 || db > 7) continue; return { w, a, b, ga, gb, lim: Math.max(da, db) + 2 }; } return null; });
      const [pa, setPa] = useState([]), [pb, setPb] = useState([]), [pos, setPos] = useState([lv.a, lv.b]), [run, setRun] = useState(false), [f, setF] = useState(0);
      const paso = (c, d) => { if (!d) return c; const x = c % N + MV[d][0], y = Math.floor(c / N) + MV[d][1], j = y * N + x; return x < 0 || y < 0 || x >= N || y >= N || lv.w[j] ? c : j; };
      const ejecutar = () => { if (run || p.fin) return; setRun(true); let A = lv.a, Bp = lv.b, k = 0, choque = false; const L = Math.max(pa.length, pb.length);
        const t = setInterval(() => { if (k >= L || choque) { clearInterval(t); setRun(false); const ok = !choque && A === lv.ga && Bp === lv.gb;
            if (ok) { p.snd('ok'); fin(true, f === 0 ? 1 : 0.75, 'Los dos robots llegaron sin chocar. Coordinar dos programas en paralelo es trabajo en equipo.'); } else { p.snd('err'); const nf = f + 1; setF(nf); if (nf >= 4) fin(false, 0, 'Los robots no llegaron a sus metas.'); else p.onErr(choque ? '¡Los robots chocaron! Hagan que uno espere o tome otro camino.' : 'Algún robot no llegó a su meta (intento ' + nf + ' de 4).', 0); setPos([lv.a, lv.b]); } return; }
          const nA = paso(A, pa[k]), nB = paso(Bp, pb[k]); if (nA === nB || (nA === Bp && nB === A)) choque = true; A = nA; Bp = nB; k++; setPos([A, Bp]); p.snd('click'); }, 380); };
      const dual = useDual(ejecutar);
      useKeys((c, dn) => { if (!dn || run || p.fin) return; const ma = { KeyW: 'U', KeyS: 'D', KeyA: 'L', KeyD: 'R' }[c], mb = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' }[c]; if (ma && pa.length < lv.lim) setPa(pa.concat([ma])); if (mb && pb.length < lv.lim) setPb(pb.concat([mb])); if (c === 'KeyQ') setPa(pa.slice(0, -1)); if (c === 'Backspace') setPb(pb.slice(0, -1)); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      const S = Math.floor(360 / N), prog = (L, col) => div({ display: 'flex', gap: 4, flexWrap: 'wrap', minHeight: 34 }, ...L.map((d, i) => div({ key: i, width: 30, height: 30, border: '2px solid ' + col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, color: TX }, MV[d][2])));
      return Wrap(P(['Cada uno programa ', B('su propio robot'), ': J1 el azul y J2 el naranja. Los dos avanzan a la vez, paso por paso, y ', B('no pueden chocar'), '. Máximo ' + lv.lim + ' pasos cada uno.']), Ctrls(Tag(1, 'W A S D agregar · Q borrar'), Tag(2, 'flechas agregar · ⌫ borrar')),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 16, alignItems: 'start' }, div({ display: 'grid', gridTemplateColumns: 'repeat(' + N + ',' + S + 'px)', gap: 2, background: '#26343e', padding: 2, justifySelf: 'center' }, ...lv.w.map((w, i) => div({ key: i, width: S, height: S, background: w ? '#4a3a2a' : '#0e1820', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
            i === lv.ga ? div({ position: 'absolute', inset: 6, border: '3px dashed ' + J1 }) : null, i === lv.gb ? div({ position: 'absolute', inset: 6, border: '3px dashed ' + J2 }) : null, pos[0] === i ? div({ width: S * 0.55, height: S * 0.55, background: J1, borderRadius: 6, boxShadow: '0 0 10px ' + J1 }) : null, pos[1] === i ? div({ width: S * 0.55, height: S * 0.55, background: J2, borderRadius: 6, boxShadow: '0 0 10px ' + J2 }) : null))),
          div({ display: 'flex', flexDirection: 'column', gap: 10 }, Stat('ROBOT AZUL (J1) · ' + pa.length + ' / ' + lv.lim, J1), prog(pa, J1), Stat('ROBOT NARANJA (J2) · ' + pb.length + ' / ' + lv.lim, J2), prog(pb, J2), Stat('FALLOS ' + f + ' / 4', f ? ER : MU))), Dual(dual, 'J1 E + J2 ENTER = ejecutar los dos'));
    }

    // ---------- EL BAR DEL COLEGIO ----------
    const MENU = [['Empanada', 0.75], ['Jugo natural', 0.60], ['Sánduche', 1.25], ['Agua', 0.50], ['Fruta picada', 0.80], ['Galletas', 0.40], ['Humita', 1.00], ['Yogur', 0.70]];
    const $ = v => '$' + v.toFixed(2);
    function Bar(p) {
      const T = p.tier, H = p.h, [st] = useState(() => { const S = []; for (let k = 0; k < 4; k++) { const [a, b, c] = H.shuffle(MENU).slice(0, 3), na = H.int(1, 3), nb = H.int(1, 2);
          if (T === 1) { const tot = Math.round((a[1] * na + b[1]) * 100) / 100, pago = tot <= 2 ? 2 : tot <= 5 ? 5 : 10, cam = Math.round((pago - tot) * 100) / 100; S.push(k % 2 ? { q: na + ' ' + a[0] + ' + 1 ' + b[0] + '. ¿Cuánto pagan?', o: opts(H, $(tot), () => $(tot + H.pick([-0.25, 0.25, 0.1, -0.1, 0.5]))), ex: na + ' × ' + $(a[1]) + ' + ' + $(b[1]) + ' = ' + $(tot) + '.' } : { q: 'Compran por ' + $(tot) + ' y pagan con ' + $(pago) + '. ¿Cuánto les dan de vuelto?', o: opts(H, $(cam), () => $(Math.max(0.05, cam + H.pick([-0.25, 0.25, 0.1, -0.1])))), ex: $(pago) + ' − ' + $(tot) + ' = ' + $(cam) + '.' }); }
          else if (T === 2) { const pc = H.pick([10, 20, 25, 50]), tot = Math.round(c[1] * na * 100) / 100, des = Math.round(tot * (1 - pc / 100) * 100) / 100; S.push({ q: na + ' ' + c[0] + ' cuestan ' + $(tot) + '. Hoy hay ' + pc + ' % de descuento. ¿Cuánto pagan?', o: opts(H, $(des), () => $(Math.max(0.05, des + H.pick([-0.2, 0.2, -0.1, 0.15, tot * pc / 100 - des])))), ex: pc + ' % de ' + $(tot) + ' es ' + $(tot * pc / 100) + '; ' + $(tot) + ' − ' + $(tot * pc / 100) + ' = ' + $(des) + '.' }); }
          else { const u = a[1], combo = Math.round((u * 3 - H.pick([0.2, 0.3, 0.1])) * 100) / 100, iva = Math.round(b[1] * nb * 1.15 * 100) / 100;
            S.push(k % 2 ? { q: '¿Qué conviene más: 3 ' + a[0] + ' sueltas a ' + $(u) + ' c/u, o el combo de 3 por ' + $(combo) + '? ¿Cuánto ahorran con la mejor opción?', o: opts(H, $(u * 3 - combo), () => $(Math.max(0.05, u * 3 - combo + H.pick([0.1, -0.05, 0.2, 0.15])))), ex: '3 × ' + $(u) + ' = ' + $(u * 3) + '; el combo ahorra ' + $(u * 3 - combo) + '.' } : { q: nb + ' ' + b[0] + ' a ' + $(b[1]) + ' más 15 % de IVA. ¿Total?', o: opts(H, $(iva), () => $(iva + H.pick([-0.1, 0.1, -0.15, 0.2]))), ex: $(b[1] * nb) + ' × 1,15 = ' + $(iva) + '.' }); } }
        S.forEach(s => { s.a = s.o.indexOf(s.o.r); }); return S; });
      return Quiz(p, ['El bar del colegio: calculen totales, vueltos ', T >= 2 ? 'y descuentos' : '', T === 3 ? ', combos e IVA' : '', '. Marquen los dos la misma respuesta.'], st, 3, 'Las matemáticas del día a día.', () => Box({ display: 'flex', flexWrap: 'wrap', gap: 10 }, ...MENU.map(([n, v]) => div({ key: n, fontFamily: MONO, fontSize: 14, color: TX, border: '1px solid ' + LN, padding: '4px 8px' }, n + ' ' + $(v)))));
    }

    // ---------- CÓDIGOS SECRETOS ----------
    const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ', PALS = ['ROBOT', 'LED', 'DATO', 'SOL', 'LUZ', 'CHIP', 'PIN', 'LOOP', 'CODIGO', 'CLAVE'];
    const cesar = (w, k) => w.split('').map(c => { const i = ABC.indexOf(c); return i < 0 ? c : ABC[(i + k + ABC.length) % ABC.length]; }).join('');
    function Codigos(p) {
      const T = p.tier, H = p.h, [st] = useState(() => { const S = [], mx = [15, 31, 63][T - 1], bits = [4, 5, 6][T - 1];
        for (let k = 0; k < 2; k++) { const n = H.int(3, mx), b = n.toString(2).padStart(bits, '0'); S.push(k ? { q: '¿Qué número es ' + b + ' en binario?', o: opts(H, n, () => Math.max(1, n + H.pick([-2, -1, 1, 2, 4, -4]))), a: 0, ex: b.split('').map((d, i) => d === '1' ? Math.pow(2, bits - 1 - i) : 0).filter(Boolean).join(' + ') + ' = ' + n } : { q: '¿Cómo se escribe ' + n + ' en binario?', o: opts(H, b, () => Math.max(1, n + H.pick([-1, 1, 2, -2])).toString(2).padStart(bits, '0')), a: 0, ex: n + ' = ' + n.toString(2).split('').map((d, i, a) => d === '1' ? Math.pow(2, a.length - 1 - i) : 0).filter(Boolean).join(' + ') + ' → ' + b }); S[S.length - 1].r = k ? n : b; }
        for (let k = 0; k < 2; k++) { const w = H.pick(PALS), sh = T === 1 ? 1 : T === 2 ? 3 : H.int(2, 6), c = cesar(w, sh); S.push(T === 3 && k ? { q: 'El mensaje «' + c + '» es una palabra de Robótica cifrada con César. ¿Qué dice?', o: opts(H, w, () => H.pick(PALS)), r: w, ex: 'Cada letra se movió ' + sh + ' lugares: ' + c + ' → ' + w } : { q: 'César: cada letra avanza ' + sh + ' lugar(es) en el alfabeto. ¿Qué dice «' + c + '»?', o: opts(H, w, () => cesar(w, H.pick([1, -1, 2]))), r: w, ex: 'Retrocedan ' + sh + ': ' + c + ' → ' + w }); }
        S.forEach(s => { s.a = s.o.indexOf(s.r); }); return H.shuffle(S); });
      return Quiz(p, ['Códigos secretos: el ', B('binario'), ' es el idioma de las computadoras (cada lugar vale 1, 2, 4, 8, 16…) y el ', B('cifrado César'), ' mueve las letras del alfabeto.'], st, 3, 'Así se guardan y protegen los datos.', () => Box({ fontFamily: MONO, fontSize: 14, color: TX, overflowWrap: 'anywhere' }, ABC.split('').join(' ')));
    }

    // ---------- RITMO Y PATRONES ----------
    const NOTAS = [262, 330, 392, 523], PCOL = ['#ff7b72', '#7fe0a0', '#5fd0e8', '#ffd166'];
    function Ritmo(p) {
      const T = p.tier, fin = useOnce(p), meta = [4, 6, 8][T - 1], [seq] = useState(() => [...Array(meta)].map(() => p.h.int(0, 3))), [n, setN] = useState(2), [inp, setInp] = useState([]), [luz, setLuz] = useState(-1), [modo, setModo] = useState('esc'), [vidas, setVidas] = useState(2), ac = useRef(null);
      const tono = i => { try { const A = ac.current || (ac.current = new (window.AudioContext || window.webkitAudioContext)()), o = A.createOscillator(), g = A.createGain(), t = A.currentTime; o.type = 'triangle'; o.frequency.value = NOTAS[i]; g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.connect(g); g.connect(A.destination); o.start(t); o.stop(t + 0.36); } catch (e) {} setLuz(i); setTimeout(() => setLuz(-1), 260); };
      const tocar = () => { setModo('esc'); setInp([]); seq.slice(0, n).forEach((x, k) => setTimeout(() => tono(x), 450 + k * 520)); setTimeout(() => setModo('rep'), 450 + n * 520); };
      useEffect(() => { tocar(); }, [n]);
      const pulsar = i => { if (modo !== 'rep' || p.fin) return; tono(i); const ni = inp.concat([i]); if (seq[ni.length - 1] !== i) { p.snd('err'); const v = vidas - 1; setVidas(v); if (v <= 0) fin(false, 0, 'Llegaron a ' + (n - 1) + ' notas. Repítanlas en voz alta mientras escuchan.'); else { p.onErr('Nota equivocada. Escuchen otra vez.', 0); setTimeout(tocar, 600); } return; }
        setInp(ni); if (ni.length === n) { if (n >= meta) fin(true, vidas === 2 ? 1 : 0.75, 'Repitieron un patrón de ' + meta + ' notas. Memoria auditiva y secuencias.'); else setTimeout(() => setN(n + 1), 500); } };
      useKeys((c, dn) => { if (!dn) return; if (c === 'KeyA') pulsar(0); if (c === 'KeyD') pulsar(1); if (c === 'ArrowLeft') pulsar(2); if (c === 'ArrowRight') pulsar(3); });
      return Wrap(P(['Escuchen el patrón y repítanlo. ', B('J1'), ' toca las notas roja y verde (A · D); ', B('J2'), ' la azul y la amarilla (← · →). Cada ronda suma una nota.']), div({ display: 'flex', gap: 16 }, Stat('NOTAS ' + n + ' / ' + meta, OK), Stat('VIDAS ' + '♥'.repeat(vidas), ER), Stat(modo === 'esc' ? 'ESCUCHEN…' : '¡SU TURNO!', modo === 'esc' ? GOLD : OK)),
        div({ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }, ...PCOL.map((c, i) => h('button', { key: i, onClick: () => pulsar(i), style: { width: 110, height: 110, borderRadius: 16, border: '3px solid ' + c, background: luz === i ? c : c + '22', boxShadow: luz === i ? '0 0 30px ' + c : 'none', cursor: 'pointer', fontFamily: HEAD, fontSize: 20, color: luz === i ? '#081018' : c } }, ['A', 'D', '←', '→'][i]))), Btn('Escuchar otra vez', tocar, GOLD, modo === 'esc'));
    }

    // ---------- TORRE DE BLOQUES ----------
    function Torre(p) {
      const T = p.tier, fin = useOnce(p), meta = [7, 9, 11][T - 1], [, setF] = useState(0), g = useRef(null);
      if (!g.current) g.current = { pila: [{ x: 30, w: 40 }], mx: 0, dir: 1, w: 40, end: false, turno: 0 };
      useEffect(() => { const t = setInterval(() => { const s = g.current; if (s.end || window.__escPausa) return; s.mx += s.dir * [0.9, 1.2, 1.5][T - 1]; if (s.mx < 0 || s.mx + s.w > 100) s.dir *= -1; setF(x => x + 1); }, 20); return () => clearInterval(t); }, []);
      const soltar = j => { const s = g.current; if (s.end || p.fin || j !== s.turno) return; const top = s.pila[s.pila.length - 1], a = Math.max(top.x, s.mx), b = Math.min(top.x + top.w, s.mx + s.w), w = b - a;
        if (w <= 1) { s.end = true; p.snd('err'); fin(false, 0, 'El bloque cayó: la torre llegó a ' + (s.pila.length - 1) + ' pisos. El centro de cada bloque debe quedar sobre el de abajo.'); return; }
        s.pila.push({ x: a, w }); s.w = w; s.mx = 0; s.turno = 1 - s.turno; p.snd(w > top.w - 1.5 ? 'ok' : 'click'); if (s.pila.length - 1 >= meta) { s.end = true; fin(true, w >= 25 ? 1 : 0.75, 'Torre de ' + meta + ' pisos. La parte que sobresale se cae: el equilibrio depende del centro de masa.'); } };
      useKeys((c, dn) => { if (!dn) return; if (c === 'KeyE') soltar(0); if (c === 'Enter') soltar(1); });
      const s = g.current, BH = 22, W = 420, base = 300, vis = s.pila.slice(-11), off = s.pila.length - vis.length;
      return Wrap(P(['Apilen ' + meta + ' bloques. ', B('Por turnos'), ', J1 suelta con E y J2 con ENTER. Lo que sobresale se corta: ¡suelten cuando esté justo encima!']), div({ display: 'flex', gap: 16 }, Stat('PISOS ' + (s.pila.length - 1) + ' / ' + meta, OK), Stat('TURNO: J' + (s.turno + 1), s.turno ? J2 : J1)),
        div({ position: 'relative', width: W, maxWidth: '100%', height: base + 40, margin: '0 auto', background: 'linear-gradient(#0b2a3d,#05080c)', border: '4px solid #26343e', borderRadius: 14, overflow: 'hidden' },
          ...vis.map((b, i) => div({ key: i + off, position: 'absolute', left: b.x / 100 * W, width: b.w / 100 * W, bottom: 10 + i * BH, height: BH - 2, background: ['#5fd0e8', '#ffd166', '#7fe0a0', '#ff9f6b', '#c58cf0'][(i + off) % 5], borderRadius: 3 })),
          s.end ? null : div({ position: 'absolute', left: s.mx / 100 * W, width: s.w / 100 * W, bottom: 10 + vis.length * BH + 8, height: BH - 2, background: s.turno ? J2 : J1, borderRadius: 3, boxShadow: '0 0 12px ' + (s.turno ? J2 : J1) })));
    }
    make.c = { circuitos: Circuitos, robots2: Robots, bar: Bar, codigos: Codigos, ritmo: Ritmo, torre: Torre };
    return make.c;
  }
  window.ESC_INVENTOS = { make };
})();

// Casino de la Ciencia ("la casa siempre gana") y Sala de cartas · retos cooperativos para Escape del Laboratorio.
// Fichas SIN valor. El objetivo es entender la probabilidad y los trucos, nunca ganar por suerte.
(function () {
  function make(React, U) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const { div, P, B, Tag, Ctrls, Stat, Box, Wrap, useKeys, useDual, Dual, useOnce } = U, { J1, J2, OK, ER, TX, MU, PAN, BG, LN, MONO, HEAD } = U.C;
    const GOLD = '#ffd166', RED = '#ff5d5d';
    const pct = x => (Math.round(x * 1000) / 10).toLocaleString('es') + ' %';
    // ---- acuerdo: J1 y J2 deben elegir la misma opción y confirmar juntos ----
    function useAcuerdo(n, onPick, p, off) {
      const [c1, setC1] = useState(0), [c2, setC2] = useState(0);
      const dual = useDual(() => { if (off) return; if (c1 !== c2) { p.onErr('No están de acuerdo: conversen y marquen la misma opción.', 0); return; } onPick(c1); });
      useKeys((c, dn) => { if (!dn || p.fin || off) return; if (c === 'KeyA' || c === 'KeyW') setC1((c1 + n - 1) % n); if (c === 'KeyD' || c === 'KeyS') setC1((c1 + 1) % n); if (c === 'ArrowLeft' || c === 'ArrowUp') setC2((c2 + n - 1) % n); if (c === 'ArrowRight' || c === 'ArrowDown') setC2((c2 + 1) % n); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return { c1, c2, set: i => { setC1(i); setC2(i); }, dual, reset: () => { setC1(0); setC2(0); } };
    }
    const Opciones = (opts, A, marca) => div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 10 }, ...opts.map((o, i) => h('button', { key: i, onClick: () => A.set(i), style: { textAlign: 'left', padding: '12px 14px', background: marca && marca[i] ? marca[i] + '22' : BG, border: '2px solid ' + (marca && marca[i] ? marca[i] : A.c1 === i && A.c2 === i ? '#fff' : LN), color: TX, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', lineHeight: 1.3 } },
      div({ display: 'flex', gap: 4, flex: 'none' }, div({ width: 12, height: 12, background: A.c1 === i ? J1 : 'transparent', border: '2px solid ' + J1 }), div({ width: 12, height: 12, background: A.c2 === i ? J2 : 'transparent', border: '2px solid ' + J2 })), o)));
    // ---- pasos: una secuencia de preguntas con visual (simulación) arriba ----
    function Pasos(p, intro, steps, need, cierre) {
      const fin = useOnce(p), [i, setI] = useState(0), [fb, setFb] = useState(null), [ok, setOk] = useState(0);
      const S = steps[Math.min(i, steps.length - 1)];
      const sig = () => { setFb(null); A.reset(); if (i + 1 >= steps.length) { const n = ok; if (n >= need) fin(true, n === steps.length ? 1 : 0.75, n + ' de ' + steps.length + ' correctas. ' + (cierre || '')); else fin(false, 0, 'Solo ' + n + ' de ' + steps.length + '. Necesitaban ' + need + '. Revisen las explicaciones y vuelvan a intentarlo.'); return; } setI(i + 1); };
      const A = useAcuerdo(S.o.length, k => { if (fb) return; const bien = k === S.a; p.snd(bien ? 'ok' : 'err'); if (bien) setOk(ok + 1); setFb({ bien, k }); }, p, !!fb);
      useKeys((c, dn) => { if (dn && fb && (c === 'Space')) sig(); });
      const marca = fb ? S.o.map((_, k) => k === S.a ? OK : k === fb.k ? ER : null) : null;
      return Wrap(P(intro), div({ display: 'flex', flexWrap: 'wrap', gap: 16 }, Stat('PASO ' + (Math.min(i, steps.length - 1) + 1) + ' / ' + steps.length), Stat('CORRECTAS ' + ok, OK), Stat('NECESITAN ' + need, MU)),
        S.V ? h(S.V, { key: i, p }) : null, div({ fontFamily: HEAD, fontSize: 22, color: TX, lineHeight: 1.2 }, S.q), Opciones(S.o, A, marca),
        fb ? Box({ border: '2px solid ' + (fb.bien ? OK : ER), display: 'flex', flexDirection: 'column', gap: 8 }, div({ fontFamily: HEAD, fontSize: 20, color: fb.bien ? OK : ER }, fb.bien ? '¡Correcto!' : 'No era esa.'), P(S.ex), h('button', { onClick: sig, style: { alignSelf: 'flex-start', background: OK, border: 'none', color: '#081018', fontFamily: HEAD, fontSize: 16, padding: '10px 18px', cursor: 'pointer' } }, i + 1 >= steps.length ? 'Terminar (ESPACIO)' : 'Siguiente (ESPACIO)')) : Dual(A.dual, 'a la vez para confirmar · J1 A·D · J2 ←·→'));
    }
    // ---- gráficos ----
    function Linea({ series, h: H, cero }) {
      const all = series.flatMap(s => s.pts), mn = Math.min(0, ...all), mx = Math.max(1, ...all), W = 600, HH = H || 170, n = Math.max(...series.map(s => s.pts.length), 2);
      const X = i => i / (n - 1) * W, Y = v => HH - (v - mn) / (mx - mn || 1) * (HH - 10) - 5;
      return h('svg', { viewBox: '0 0 ' + W + ' ' + HH, style: { width: '100%', height: 'auto', display: 'block', background: '#07111a', border: '1px solid ' + LN } },
        h('line', { x1: 0, x2: W, y1: Y(cero || 0), y2: Y(cero || 0), stroke: MU, strokeDasharray: '4 4' }),
        ...series.map((s, k) => h('polyline', { key: k, points: s.pts.map((v, i) => X(i) + ',' + Y(v)).join(' '), fill: 'none', stroke: s.col, strokeWidth: 2.5, style: { filter: 'drop-shadow(0 0 4px ' + s.col + ')' } })),
        ...series.map((s, k) => h('text', { key: 't' + k, x: W - 6, y: Y(s.pts[s.pts.length - 1] || 0) - 6, textAnchor: 'end', fill: s.col, fontSize: 14, fontFamily: 'monospace', fontWeight: 700 }, s.lab || '')));
    }
    const Btn = (t, on, col, dis) => h('button', { onClick: on, disabled: dis, style: { alignSelf: 'flex-start', background: dis ? '#1b2a33' : col || GOLD, color: dis ? MU : '#081018', border: 'none', fontFamily: HEAD, fontSize: 16, padding: '10px 18px', cursor: dis ? 'default' : 'pointer' } }, t);
    // ---- cartas ----
    const PALO = ['♠', '♥', '♦', '♣'], VAL = v => ({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }[v] || String(v));
    function Carta({ v, s, oculta, sel, mini, onClick, glow }) {
      const W = mini ? 52 : 74, rojo = s === 1 || s === 2;
      return h('div', { onClick, style: { width: W, height: W * 1.4, borderRadius: 8, flex: 'none', cursor: onClick ? 'pointer' : 'default', position: 'relative', boxSizing: 'border-box', transition: 'transform .2s', transform: sel ? 'translateY(-10px)' : 'none',
        background: oculta ? 'repeating-linear-gradient(45deg,#1c3d6e,#1c3d6e 6px,#244b85 6px,#244b85 12px)' : '#fbf8f0', border: '3px solid ' + (sel ? GOLD : glow || (oculta ? '#0f2442' : '#d9d2c1')), boxShadow: sel ? '0 0 16px ' + GOLD : glow ? '0 0 14px ' + glow : '0 3px 8px rgba(0,0,0,.4)' } },
        oculta ? null : h('div', { style: { position: 'absolute', left: 5, top: 3, fontFamily: HEAD, fontSize: mini ? 15 : 20, color: rojo ? '#c62828' : '#111', lineHeight: 1 } }, VAL(v), h('div', { style: { fontSize: mini ? 13 : 17 } }, PALO[s])),
        oculta ? null : h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: mini ? 24 : 36, color: rojo ? '#c62828' : '#111' } }, PALO[s]));
    }
    const Mano = (cs, extra) => div(Object.assign({ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }, extra || {}), ...cs.map((c, i) => h(Carta, Object.assign({ key: i }, c))));
    const mazo = H => { const d = []; for (let s = 0; s < 4; s++) for (let v = 1; v <= 13; v++) d.push({ v, s }); return H.shuffle(d); };
    const Mesa = (...ch) => div({ background: 'radial-gradient(ellipse at center,#1f6b45 0%,#0f3d27 80%)', border: '6px solid #5a3a1e', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: 'inset 0 0 40px rgba(0,0,0,.5)' }, ...ch);

    // ================= CASINO =================
    const QS = [2, 3, 4, 5, 6, 10], PREM = [8, 27, 64, 125, 216, 500, 1000], SIMB = ['7', '★', '◆', '●', '♣', '▲'];
    function Tragamonedas(p) {
      const T = p.tier, fin = useOnce(p), [qi, setQi] = useState(3), [ki, setKi] = useState(1), [sim, setSim] = useState(null), [rod, setRod] = useState(['7', '★', '◆']), [fase, setFase] = useState('config'), [int, setInt] = useState(0);
      const q = QS[qi], prem = PREM[ki], ve = Math.pow(1 / q, 3) * prem - 1;
      const meta = T === 1 ? { t: 'Configuren una máquina JUSTA: que a la larga ni el jugador ni la casa ganen (valor esperado = 0).', ok: v => Math.abs(v) < 0.001 } : T === 2 ? { t: 'Ahora piensen como el dueño: la casa debe quedarse entre el 20 % y el 50 % de lo apostado, pero con un premio llamativo (100 fichas o más).', ok: (v, pr) => v <= -0.2 && v >= -0.5 && pr >= 100 } : { t: 'El dueño quiere un premio enorme (500 o más) y quedarse entre el 20 % y el 50 %. Encuentren la única configuración posible.', ok: (v, pr) => v <= -0.2 && v >= -0.5 && pr >= 500 };
      const correr = () => { if (fase !== 'config') return; let s = 0; const pts = [0]; let wins = 0;
        for (let k = 1; k <= 2000; k++) { const g = Math.random() < 1 / q && Math.random() < 1 / q && Math.random() < 1 / q; s += g ? prem - 1 : -1; if (g) wins++; if (k % 20 === 0) pts.push(s); }
        setSim({ pts, s, wins }); setRod(SIMB.map(() => 0).slice(0, 3).map((_, k) => k < 2 ? '7' : SIMB[1 + Math.floor(Math.random() * 4)]));
        const ok = meta.ok(ve, prem); setInt(int + 1); p.snd(ok ? 'ok' : 'err');
        if (ok) { if (T === 3) setFase('casi'); else fin(true, int === 0 ? 1 : int < 3 ? 0.75 : 0.5, 'Valor esperado ' + ve.toFixed(3) + ' por jugada. En 2000 jugadas el jugador terminó con ' + s + ' fichas.'); }
        else p.onErr('Valor esperado = (1/' + q + ')³ × ' + prem + ' − 1 = ' + ve.toFixed(3) + '. ' + (T === 1 ? (ve < 0 ? 'La casa gana: suban el premio o la probabilidad.' : 'El jugador gana: la máquina quebraría.') : 'No cumple la condición del dueño.'), 0); };
      const dual = useDual(correr);
      useKeys((c, dn) => { if (!dn || p.fin || fase !== 'config') return; if (c === 'KeyA') setQi(Math.max(0, qi - 1)); if (c === 'KeyD') setQi(Math.min(QS.length - 1, qi + 1)); if (c === 'ArrowLeft') setKi(Math.max(0, ki - 1)); if (c === 'ArrowRight') setKi(Math.min(PREM.length - 1, ki + 1)); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      const [casi, setCasi] = useState(null), CO = ['Para que sientan que casi ganan y sigan jugando', 'Porque la máquina está por pagar', 'Es pura casualidad', 'Para avisar que el premio subió'];
      const A = useAcuerdo(4, k => { setCasi(k); if (k === 0) fin(true, int <= 2 ? 1 : 0.75, 'Exacto: el «casi acierto» engaña al cerebro. No acerca el premio, solo te hace seguir jugando.'); else { p.snd('err'); p.onErr('Piénsenlo: ¿qué siente un jugador que ve 7 · 7 · ★?', 0); } }, p, fase !== 'casi');
      const rodillo = (s, k) => div({ key: k, width: 86, height: 104, background: 'linear-gradient(180deg,#e9e4d8,#fffdf6 40%,#e9e4d8)', border: '3px solid #8a6b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 52, color: s === '7' ? '#c62828' : '#1c3d6e' }, s);
      return Wrap(P(['Programen la máquina. ', B('J1'), ' elige la probabilidad de que salga un 7 en cada rodillo (A · D). ', B('J2'), ' elige el premio por 7 · 7 · 7 (← · →). Cada jugada cuesta 1 ficha (sin valor).']), Box({ border: '2px solid ' + GOLD }, P(B(meta.t))),
        Ctrls(Tag(1, 'A · D probabilidad'), Tag(2, '← · → premio')),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 16, alignItems: 'start' },
          div({ background: 'linear-gradient(180deg,#7a1f1f,#3d0f0f)', border: '4px solid ' + GOLD, borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxShadow: '0 0 30px rgba(255,209,102,.3)' },
            div({ fontFamily: HEAD, fontSize: 22, color: GOLD, letterSpacing: '.1em', textShadow: '0 0 12px ' + GOLD }, 'MEGA 7'), div({ display: 'flex', gap: 8, padding: 8, background: '#111', borderRadius: 8 }, ...rod.map(rodillo)),
            div({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }, Box({ padding: 10, border: '2px solid ' + J1 }, Stat('PROB. DE 7', J1), div({ fontFamily: HEAD, fontSize: 26, color: TX }, '1 / ' + q)), Box({ padding: 10, border: '2px solid ' + J2 }, Stat('PREMIO 7·7·7', J2), div({ fontFamily: HEAD, fontSize: 26, color: TX }, prem + ' fichas')))),
          div({ display: 'flex', flexDirection: 'column', gap: 10 }, Box({ display: 'flex', flexDirection: 'column', gap: 6 }, Stat('PROBABILIDAD DE 7 · 7 · 7 = (1/' + q + ')³ = 1/' + q * q * q, TX), Stat('VALOR ESPERADO POR JUGADA = 1/' + q * q * q + ' × ' + prem + ' − 1 = ' + ve.toFixed(3), ve < 0 ? ER : ve > 0 ? OK : GOLD), P(ve < 0 ? 'Por cada 100 fichas, el jugador pierde en promedio ' + Math.round(-ve * 100) + '.' : ve > 0 ? 'El jugador ganaría a la larga: ningún casino haría esto.' : 'Justa: a la larga nadie gana.')),
            sim ? h(Linea, { series: [{ pts: sim.pts, col: sim.s < 0 ? ER : OK, lab: 'jugador ' + sim.s }] }) : Box({}, P('Simulen 2000 jugadas para ver qué pasa con las fichas del jugador.')), sim ? Stat('Ganó 7·7·7 ' + sim.wins + ' veces en 2000 jugadas', MU) : null)),
        fase === 'config' ? Dual(dual, 'J1 E + J2 ENTER = simular 2000 jugadas y comprobar') : Wrap(Box({ border: '2px solid ' + GOLD }, P([B('Último paso. '), 'Las máquinas reales muestran 7 · 7 · ★ mucho más seguido de lo que dicta la probabilidad, aunque eso no paga nada. ¿Para qué?'])), Opciones(CO, A, casi != null ? CO.map((_, k) => k === 0 && casi === 0 ? OK : k === casi ? ER : null) : null), Dual(A.dual, 'a la vez para confirmar')));
    }
    function SimRuleta() {
      const [r, setR] = useState(null);
      const go = () => { let racha = 0, tras = 0, rojoTras = 0; for (let k = 0; k < 200000; k++) { const n = Math.floor(Math.random() * 37), rojo = n > 0 && n <= 18; if (racha >= 6) { tras++; if (rojo) rojoTras++; } racha = rojo ? racha + 1 : 0; } setR({ tras, p: rojoTras / tras }); };
      return Box({ display: 'flex', flexDirection: 'column', gap: 10, border: '2px solid ' + RED }, div({ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }, Stat('ÚLTIMOS GIROS:', MU), ...[3, 21, 7, 14, 1, 9].map((n, i) => div({ key: i, width: 40, height: 40, borderRadius: 20, background: '#c62828', color: '#fff', fontFamily: HEAD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #c62828' }, String(n))), div({ width: 40, height: 40, borderRadius: 20, border: '2px dashed ' + MU, color: MU, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD }, '?')),
        Btn('Simular 200 000 giros y mirar qué pasa después de 6 rojos', go, RED), r ? P(['Hubo ', B(String(r.tras)), ' veces 6 rojos seguidos. El siguiente giro fue rojo el ', B(pct(r.p)), ' de las veces: lo mismo de siempre (18/37 ≈ 48,6 %).']) : null);
    }
    function SimMartingala() {
      const [r, setR] = useState(null);
      const go = () => { let q = 0; const ej = []; for (let j = 0; j < 1000; j++) { let f = 100, ap = 1; const pts = [100]; for (let k = 0; k < 300 && f > 0; k++) { const a = Math.min(ap, f), g = Math.random() < 18 / 37; f += g ? a : -a; ap = g ? 1 : ap * 2; if (j < 3) pts.push(f); } if (f <= 0) q++; if (j < 3) ej.push(pts); } setR({ q, ej }); };
      return Box({ display: 'flex', flexDirection: 'column', gap: 10 }, P('Martingala: apostar 1 y, cada vez que pierden, duplicar la apuesta. Empiezan con 100 fichas y juegan hasta 300 giros.'), Btn('Simular 1000 jugadores', go, RED), r ? h(Linea, { series: r.ej.map((pts, k) => ({ pts, col: [J1, J2, GOLD][k] })) }) : null, r ? P(['Quebraron ', B(r.q + ' de 1000'), ' jugadores. Una racha de pérdidas hace que la apuesta crezca más rápido que sus fichas.']) : null);
    }
    function Ruleta(p) {
      const st = [{ V: SimRuleta, q: 'Salieron 6 rojos seguidos. ¿Qué es más probable en el próximo giro?', o: ['Negro, porque «ya le toca»', 'Rojo, porque está en racha', 'Lo mismo de siempre: la ruleta no tiene memoria'], a: 2, ex: 'Cada giro es independiente. Creer que «ya le toca» se llama falacia del jugador. Simulen y compruébenlo.' },
        { q: 'La ruleta tiene 18 rojos, 18 negros y 1 verde (el 0). ¿Probabilidad de rojo?', o: ['18/37 ≈ 48,6 %', '1/2 = 50 %', '18/36', '1/37'], a: 0, ex: 'Son 37 casillas y 18 son rojas: 18/37. Ese 0 verde es la ventaja de la casa.' }];
      if (p.tier >= 2) st.push({ q: 'Apuestan 1 ficha a rojo 37 veces y les pagan 1 por cada acierto. En promedio, ¿qué pasa?', o: ['Ganan 1', 'Pierden 1 (por el 0 verde)', 'Quedan igual'], a: 1, ex: 'Ganan 18, pierden 19 → −1 cada 37 giros: la casa se queda con el 2,7 %.' });
      if (p.tier >= 3) st.push({ V: SimMartingala, q: '¿Por qué la martingala (duplicar al perder) no les hace ganar?', o: ['Una mala racha los deja sin fichas antes de recuperar', 'Porque la ruleta hace trampa', 'Sí funciona siempre'], a: 0, ex: 'Con 7 pérdidas seguidas ya apostarían 128. Las fichas se acaban mucho antes de recuperar.' });
      return Pasos(p, ['La ruleta: ', B('¿tiene memoria?'), ' Respondan en pareja. J1 elige con A · D, J2 con ← · →, y confirman juntos con E + ENTER.'], st, st.length - 1, 'En la ruleta, a la larga, siempre gana la casa.');
    }
    function SimEsperado({ p }) {
      const [r, setR] = useState(null), J = [['Dado', 1 / 6, 5, J1], ['Moneda', 0.5, 1.8, J2], ['Lotería', 1 / 1000, 500, GOLD]].slice(0, p.tier >= 2 ? 3 : 2);
      const go = () => setR(J.map(([n, pr, pg, c]) => { let s = 0; const pts = [0]; for (let k = 1; k <= 600; k++) { s += (Math.random() < pr ? pg : 0) - 1; if (k % 10 === 0) pts.push(Math.round(s * 10) / 10); } return { pts, col: c, lab: n + ' ' + Math.round(s) }; }));
      return Box({ display: 'flex', flexDirection: 'column', gap: 10 }, div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: 10 }, ...J.map(([n, pr, pg, c]) => Box({ key: n, border: '2px solid ' + c, padding: 12 }, div({ fontFamily: HEAD, fontSize: 20, color: c }, n), P(n === 'Dado' ? 'Pagan 1. Si sale 6, reciben 5.' : n === 'Moneda' ? 'Pagan 1. Si sale cara, reciben 1,8.' : 'Pagan 1. Con 1 en 1000, reciben 500.')))),
        Btn('Simular 600 jugadas de cada juego', go), r ? h(Linea, { series: r }) : null);
    }
    function Esperado(p) {
      const st = [{ V: SimEsperado, q: 'Dado: pagan 1 y reciben 5 si sale 6. ¿Valor esperado por jugada?', o: ['−0,17 (pierden)', '+0,17 (ganan)', '0 (justo)', '−0,50'], a: 0, ex: '5 × 1/6 − 1 = 0,83 − 1 = −0,17. Pierden 17 de cada 100 fichas.' },
        { V: SimEsperado, q: 'Moneda: pagan 1 y reciben 1,8 si sale cara. ¿Valor esperado?', o: ['+0,8', '−0,1', '0', '+0,9'], a: 1, ex: '1,8 × 1/2 − 1 = 0,9 − 1 = −0,1.' }];
      if (p.tier >= 2) st.push({ V: SimEsperado, q: 'Lotería: pagan 1 y con 1 en 1000 reciben 500. ¿Valor esperado?', o: ['−0,5', '+499', '−0,001', '0'], a: 0, ex: '500 × 1/1000 − 1 = 0,5 − 1 = −0,5. ¡Pierden la mitad de lo que juegan!' }, { q: '¿Cuál de los tres juegos hace perder MENOS a la larga?', o: ['Dado', 'Moneda', 'Lotería', 'Todos igual'], a: 1, ex: 'Moneda (−0,1) pierde menos que dado (−0,17) y lotería (−0,5). Pero todos pierden.' });
      if (p.tier >= 3) st.push({ q: 'Si juegan la lotería 1000 veces, ¿cuánto esperan haber perdido?', o: ['Unas 500 fichas', 'Nada, porque alguna vez ganan', '1 ficha', '1000 fichas exactas'], a: 0, ex: '1000 × (−0,5) = −500. El premio grande esconde una pérdida segura.' });
      return Pasos(p, ['El ', B('valor esperado'), ' = lo que ganan en promedio por jugada = premio × probabilidad − costo. Si es negativo, a la larga pierden.'], st, st.length - 1, 'Ningún juego de azar del casino tiene valor esperado positivo para el jugador.');
    }
    function SimCromos({ p }) {
      const N = [10, 20, 50][p.tier - 1], [r, setR] = useState(null), [ab, setAb] = useState(0), tm = useRef(null);
      useEffect(() => () => clearInterval(tm.current), []);
      const go = () => { clearInterval(tm.current); const tiene = Array(N).fill(0); let n = 0; const hist = []; while (tiene.some(x => !x)) { const c = Math.floor(Math.random() * N); tiene[c]++; n++; hist.push(c); } let k = 0; setR({ n, hist, tiene: Array(N).fill(0) }); setAb(0); const paso = Math.max(1, Math.ceil(n / 60));
        tm.current = setInterval(() => { k = Math.min(n, k + paso); setAb(k); if (k >= n) clearInterval(tm.current); }, 50); };
      const tiene = Array(N).fill(0); if (r) for (let k = 0; k < ab; k++) tiene[r.hist[k]]++;
      return Box({ display: 'flex', flexDirection: 'column', gap: 10, border: '2px solid ' + J1 }, Stat('ÁLBUM DE ' + N + ' CROMOS · 1 CROMO POR SOBRE', J1), div({ display: 'grid', gridTemplateColumns: 'repeat(' + Math.min(10, N) + ',minmax(0,1fr))', gap: 4 }, ...tiene.map((x, i) => div({ key: i, aspectRatio: '3/4', background: x ? '#e8f4f8' : '#16242f', border: '1px solid ' + (x ? GOLD : LN), color: '#081018', fontFamily: MONO, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }, x ? String(i + 1) : ''))),
        Btn('Abrir sobres hasta completar el álbum', go, J1), r ? P(['Sobres abiertos: ', B(String(ab)), ab >= r.n ? ' · ¡Álbum completo! Repetidos: ' + (r.n - N) + '.' : '']) : null);
    }
    function Cromos(p) {
      const N = [10, 20, 50][p.tier - 1], esp = { 10: 29, 20: 72, 50: 225 }[N];
      const st = [{ V: SimCromos, q: 'Álbum de ' + N + ' cromos, 1 cromo por sobre. En promedio, ¿cuántos sobres hay que abrir para completarlo?', o: [String(N), 'Unos ' + esp, String(N * 10), 'Unos ' + Math.round(N * 1.5)], a: 1, ex: 'N × (1 + 1/2 + … + 1/N) ≈ ' + esp + '. Simulen varias veces: casi siempre son muchos más que ' + N + '.' },
        { q: '¿Por qué cuestan tanto los últimos cromos?', o: ['Porque casi todo lo que sale ya lo tienen (repetidos)', 'Porque imprimen menos', 'Por mala suerte'], a: 0, ex: 'Cuando les falta 1 de ' + N + ', solo 1 de cada ' + N + ' sobres sirve. Así ganan los vendedores.' }];
      if (p.tier >= 2) st.push({ q: 'Un videojuego vende cajas sorpresa (loot boxes) de $1 con 1 % de recibir una skin legendaria. En promedio, ¿cuánto gastarían para conseguirla?', o: ['$1', '$10', '$100', '$1000'], a: 2, ex: 'Con probabilidad 1/100 se necesitan en promedio 100 cajas: $100 por algo que «parecía» costar $1.' });
      if (p.tier >= 3) st.push({ q: '¿Probabilidad de NO conseguirla después de comprar 100 cajas?', o: ['0 %', 'Cerca de 37 %', '1 %', '50 %'], a: 1, ex: '0,99¹⁰⁰ ≈ 0,366. ¡Más de 1 de cada 3 personas gasta $100 y no la consigue!' });
      return Pasos(p, ['Sobres de cromos y cajas sorpresa de videojuegos: ', B('¿cuánto cuesta en realidad completar?')], st, st.length - 1, 'Las cajas sorpresa funcionan igual que una máquina tragamonedas.');
    }
    const Cuotas = () => Box({ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, border: '2px solid ' + OK }, ...[['EMELEC', '2,10'], ['EMPATE', '3,20'], ['BARCELONA', '3,40']].map(([n, c]) => div({ key: n, background: '#07111a', border: '1px solid ' + LN, padding: 12, textAlign: 'center' }, Stat(n, MU), div({ fontFamily: HEAD, fontSize: 30, color: OK }, c))));
    function Apuestas(p) {
      const st = [{ V: Cuotas, q: 'La cuota de Emelec es 2,10 (si apuestan 1, reciben 2,10). ¿Qué probabilidad de ganar le asigna la casa?', o: ['1 / 2,10 ≈ 47,6 %', '21 %', '2,1 %', '52 %'], a: 0, ex: 'Probabilidad implícita = 1 ÷ cuota = 1 ÷ 2,10 ≈ 47,6 %.' },
        { V: Cuotas, q: 'Sumen las probabilidades implícitas de los 3 resultados (1/2,10 + 1/3,20 + 1/3,40).', o: ['100 %', '≈ 108 %', '≈ 92 %', '≈ 85 %'], a: 1, ex: '47,6 % + 31,3 % + 29,4 % ≈ 108 %. ¡Las probabilidades reales suman 100 %!' },
        { q: '¿Qué significa ese 8 % de más?', o: ['Es la ganancia asegurada de la casa', 'Que hubo un error', 'Que el empate es seguro'], a: 0, ex: 'Se llama margen: la casa paga menos de lo justo en todos los resultados, gane quien gane.' }];
      if (p.tier >= 3) st.push({ q: 'Apuestan $10 cada semana durante un año y la casa se queda en promedio con el 7,7 %. ¿Cuánto pierden?', o: ['≈ $40', '≈ $4', '≈ $400', 'Nada, si saben de fútbol'], a: 0, ex: '52 × $10 × 0,077 ≈ $40. Saber de fútbol no elimina el margen de la casa.' });
      return Pasos(p, ['Apuestas deportivas: ', B('¿quién gana siempre?'), ' Las cuotas esconden la respuesta.'], st, st.length - 1, 'Las casas de apuestas no apuestan: cobran un margen.');
    }
    const TRUCO = [['GIRA LA RULETA DIARIA', '¡Premio sorpresa cada día!', 'azar'], ['SOBRE LEGENDARIO', 'Probabilidad de skin dorada: 0,5 %', 'azar'], ['7 · 7 · ★', '¡UY! ¡CASI GANAS! Intenta otra vez', 'casi'], ['TIENDA DE GEMAS', '500 gemas = $4,99 · La skin cuesta 520 gemas', 'moneda'], ['¡TU RACHA DE 45 DÍAS!', 'Se perderá en 2 horas si no juegas', 'miedo'], ['OFERTA RELÁMPAGO', 'Termina en 09:59 · ¡Solo hoy!', 'miedo']];
    const TCAT = [['azar', 'Recompensa al azar'], ['casi', 'Casi acierto'], ['moneda', 'Moneda que esconde el dinero'], ['miedo', 'Miedo a perder / urgencia']];
    function Trucos(p) {
      const fin = useOnce(p), items = p.tier === 1 ? TRUCO.filter((_, i) => [0, 2, 3, 4].includes(i)) : TRUCO, [r, setR] = useState({}), [rev, setRev] = useState(false);
      const listo = items.every((_, i) => r[i]);
      const dual = useDual(() => { if (!listo) { p.onErr('Clasifiquen todas las pantallas primero.', 0); return; } const bien = items.filter((x, i) => r[i] === x[2]).length; setRev(true); if (bien >= items.length - 1) fin(true, bien === items.length ? 1 : 0.75, bien + ' de ' + items.length + '. Si alguien siente que no puede dejar de jugar o apostar, puede hablar con el DECE: pedir ayuda es de valientes.'); else { p.snd('err'); p.onErr('Acertaron ' + bien + ' de ' + items.length + '. Revisen las marcadas en rojo.', 0); setTimeout(() => setRev(false), 2500); } });
      useKeys((c, dn) => { if (!dn || p.fin) return; if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return Wrap(P(['Las apps y los juegos usan ', B('trucos de los casinos'), ' para que no dejen de jugar. Clasifiquen cada pantalla (con el mouse) y confirmen juntos.']),
        div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))', gap: 12 }, ...items.map(([t, s, k], i) => div({ key: i, background: '#07111a', border: '2px solid ' + (rev ? (r[i] === k ? OK : ER) : LN), borderRadius: 18, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
          div({ background: 'linear-gradient(135deg,#5b2a86,#c2185b)', borderRadius: 12, padding: '14px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }, div({ fontFamily: HEAD, fontSize: 20, color: '#fff', textShadow: '0 0 10px #ff80ab' }, t), div({ fontSize: 14, color: '#ffe0f0', fontWeight: 600 }, s)),
          div({ display: 'flex', flexWrap: 'wrap', gap: 6 }, ...TCAT.map(([c, n]) => h('button', { key: c, onClick: () => !rev && setR(Object.assign({}, r, { [i]: c })), style: { padding: '6px 9px', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: r[i] === c ? GOLD : BG, color: r[i] === c ? '#081018' : TX, border: '1px solid ' + (r[i] === c ? GOLD : LN) } }, n)))))),
        Dual(dual, 'a la vez para comprobar'));
    }

    // ================= CARTAS =================
    const val21 = cs => { let s = 0, a = 0; cs.forEach(c => { const v = Math.min(10, c.v); s += c.v === 1 ? 1 : v; if (c.v === 1) a++; }); while (a > 0 && s + 10 <= 21) { s += 10; a--; } return s; };
    function Veintiuno(p) {
      const T = p.tier, fin = useOnce(p), MANOS = 5;
      const nueva = (d) => { const dk = d && d.length > 15 ? d.slice() : mazo(p.h); const yo = [dk.pop(), dk.pop()], casa = [dk.pop(), dk.pop()]; return { dk, yo, casa, fase: 'jugar', res: '' }; };
      const [m, setM] = useState(() => nueva()), [n, setN] = useState(0), [bien, setBien] = useState(0), [tot, setTot] = useState(0), [ult, setUlt] = useState(null), [fq, setFq] = useState(false);
      const yo = val21(m.yo), restan = m.dk, pBust = restan.filter(c => val21(m.yo.concat([c])) > 21).length / restan.length;
      const buena = acc => yo <= 11 ? acc === 0 : yo >= 17 ? acc === 1 : (acc === 0) === (pBust < 0.5);
      const terminarMano = (yoC, dk) => { const casa = m.casa.slice(); const d = dk.slice(); const vy = val21(yoC); if (vy <= 21) while (val21(casa) < 17) casa.push(d.pop()); const vc = val21(casa);
        const res = vy > 21 ? 'Se pasaron: gana la casa' : vc > 21 ? 'La casa se pasó: ganan ustedes' : vy > vc ? 'Ganan ustedes' : vy < vc ? 'Gana la casa' : 'Empate'; setM({ dk: d, yo: yoC, casa, fase: 'fin', res }); };
      const A = useAcuerdo(2, acc => { if (m.fase !== 'jugar' || fq) return; const ok = buena(acc); setTot(tot + 1); if (ok) setBien(bien + 1); setUlt({ ok, txt: (acc === 0 ? 'Pidieron' : 'Se plantaron') + ' con ' + yo + '. Probabilidad de pasarse: ' + pct(pBust) + '. ' + (ok ? 'Buena decisión.' : 'Con esa probabilidad convenía ' + (acc === 0 ? 'plantarse.' : 'pedir.')) }); p.snd(ok ? 'click' : 'err');
        if (acc === 0) { const d = m.dk.slice(), c = d.pop(), y2 = m.yo.concat([c]); if (val21(y2) >= 21) terminarMano(y2, d); else setM(Object.assign({}, m, { dk: d, yo: y2 })); } else terminarMano(m.yo, m.dk); }, p, m.fase !== 'jugar' || fq);
      const sigMano = () => { if (n + 1 >= MANOS) { if (T === 3) { setFq(true); return; } cerrar(); return; } setN(n + 1); setM(nueva(m.dk)); setUlt(null); A.reset(); };
      const cerrar = extra => { const r = tot ? bien / tot : 0; if (r >= 0.75) fin(true, r === 1 ? 1 : 0.75, bien + ' de ' + tot + ' decisiones buenas. Ganar o perder una mano es suerte; decidir bien es pensamiento.' + (extra || '')); else fin(false, 0, 'Solo ' + bien + ' de ' + tot + ' decisiones buenas. Regla: pidan si la probabilidad de pasarse es menor al 50 %.'); };
      useKeys((c, dn) => { if (dn && m.fase === 'fin' && !fq && c === 'Space') sigMano(); });
      const FQ = ['Porque si los dos se pasan, gana la casa (ustedes se pasan primero)', 'Porque reparte más rápido', 'No tiene ninguna ventaja'];
      const B2 = useAcuerdo(3, k => { if (k === 0) cerrar(' Y entendieron la ventaja de la casa.'); else { p.snd('err'); p.onErr('Piensen: ¿quién juega primero y qué pasa si se pasa?', 0); } }, p, !fq);
      return Wrap(P(['Veintiuno contra la casa. ', B('No se gana por suerte: se gana tomando buenas decisiones.'), ' Pidan carta o plántense. ', T === 1 ? 'Verán la probabilidad de pasarse antes de decidir.' : T === 2 ? 'Verán la probabilidad después de decidir.' : 'Calculen la probabilidad ustedes.']),
        div({ display: 'flex', flexWrap: 'wrap', gap: 16 }, Stat('MANO ' + (n + 1) + ' / ' + MANOS), Stat('BUENAS DECISIONES ' + bien + ' / ' + tot, OK), Stat('CARTAS EN EL MAZO ' + restan.length)),
        Mesa(Stat('LA CASA' + (m.fase === 'fin' ? ' · ' + val21(m.casa) : ''), '#cfe'), Mano(m.casa.map((c, i) => Object.assign({}, c, { oculta: m.fase !== 'fin' && i === 1 }))), Stat('USTEDES · ' + yo, '#cfe'), Mano(m.yo)),
        T === 1 && m.fase === 'jugar' ? Box({ border: '2px solid ' + GOLD }, P(['Si piden, la probabilidad de pasarse de 21 es ', B(pct(pBust)), ' (' + restan.filter(c => val21(m.yo.concat([c])) > 21).length + ' de ' + restan.length + ' cartas).'])) : null,
        ult ? Box({ border: '2px solid ' + (ult.ok ? OK : ER) }, P(ult.txt)) : null,
        fq ? Wrap(Box({ border: '2px solid ' + GOLD }, P(B('¿Por qué, a la larga, la casa gana en el 21?'))), Opciones(FQ, B2), Dual(B2.dual, 'a la vez para confirmar')) : m.fase === 'jugar' ? Wrap(Opciones(['Pedir carta', 'Plantarse'], A), Dual(A.dual, 'a la vez para decidir · J1 A·D · J2 ←·→')) : Wrap(Box({ border: '2px solid ' + MU }, div({ fontFamily: HEAD, fontSize: 22, color: TX }, m.res)), Btn(n + 1 >= MANOS ? 'Terminar (ESPACIO)' : 'Siguiente mano (ESPACIO)', sigMano, OK)));
    }
    function Intermedia(p) {
      const T = p.tier, fin = useOnce(p), R = 5;
      const ronda = d => { let dk = d && d.length > 10 ? d.slice() : mazo(p.h), a, b; do { a = dk.pop(); b = dk.pop(); if (Math.abs(a.v - b.v) < 2) { dk.unshift(a, b); dk = p.h.shuffle(dk); a = null; } } while (!a); const lo = Math.min(a.v, b.v), hi = Math.max(a.v, b.v), entre = dk.filter(c => c.v > lo && c.v < hi).length, pr = entre / dk.length;
        const op = p.h.shuffle([pr, Math.min(0.98, pr + 0.15 + p.h.int(0, 10) / 100), Math.max(0.01, pr - 0.12 - p.h.int(0, 8) / 100), (hi - lo + 1) / 13].map(x => Math.round(x * 100))).filter((x, i, ar) => ar.indexOf(x) === i); while (op.length < 4) op.push(op[op.length - 1] + 7); return { dk, a, b, lo, hi, entre, pr, op, ans: op.indexOf(Math.round(pr * 100)), paso: 'prob', sale: null }; };
      const [r, setR] = useState(() => ronda()), [n, setN] = useState(0), [pts, setPts] = useState(0), [max, setMax] = useState(0), [fb, setFb] = useState(null);
      const A = useAcuerdo(4, k => { if (r.paso !== 'prob') return; const ok = k === r.ans; setMax(max + 1); if (ok) setPts(pts + 1); p.snd(ok ? 'ok' : 'err'); setFb({ ok, t: 'Hay ' + r.entre + ' cartas entre ' + VAL(r.lo) + ' y ' + VAL(r.hi) + ' en un mazo de ' + r.dk.length + ': ' + r.entre + ' / ' + r.dk.length + ' ≈ ' + Math.round(r.pr * 100) + ' %.' }); setR(Object.assign({}, r, { paso: 'apuesta' })); A.reset(); }, p, r.paso !== 'prob');
      const Bt = useAcuerdo(2, k => { if (r.paso !== 'apuesta') return; const ok = (k === 0) === (r.pr > 0.5); setMax(max + 1); if (ok) setPts(pts + 1); const d = r.dk.slice(), c = d.pop(), dentro = c.v > r.lo && c.v < r.hi; p.snd(ok ? 'ok' : 'err');
        setFb({ ok, t: (ok ? 'Decisión correcta: ' : 'Con ' + Math.round(r.pr * 100) + ' % convenía ' + (r.pr > 0.5 ? 'apostar. ' : 'no apostar. ')) + 'Salió ' + VAL(c.v) + PALO[c.s] + (dentro ? ' (entre las dos).' : ' (fuera).') + ' Recuerden: el resultado es suerte, la decisión es pensamiento.' }); setR(Object.assign({}, r, { dk: d, sale: c, paso: 'fin' })); }, p, r.paso !== 'apuesta');
      const sig = () => { if (n + 1 >= R) { const q = pts / max; if (q >= 0.7) fin(true, q >= 0.9 ? 1 : 0.75, pts + ' de ' + max + ' aciertos.'); else fin(false, 0, pts + ' de ' + max + '. Cuenten cuántas cartas hay entre las dos y divídanlo para las que quedan.'); return; } setN(n + 1); setR(ronda(r.dk)); setFb(null); A.reset(); Bt.reset(); };
      useKeys((c, dn) => { if (dn && r.paso === 'fin' && c === 'Space') sig(); });
      return Wrap(P(['Carta intermedia: ¿la siguiente carta caerá ', B('entre las dos'), '? Primero calculen la probabilidad y después decidan si conviene apostar (fichas sin valor). A = 1, J = 11, Q = 12, K = 13.']),
        div({ display: 'flex', flexWrap: 'wrap', gap: 16 }, Stat('RONDA ' + (n + 1) + ' / ' + R), Stat('ACIERTOS ' + pts + ' / ' + max, OK), Stat('QUEDAN ' + r.dk.length + ' CARTAS EN EL MAZO')),
        Mesa(div({ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }, h(Carta, r.a), div({ fontFamily: HEAD, fontSize: 28, color: GOLD }, '¿ ? '), r.sale ? h(Carta, Object.assign({ glow: r.sale.v > r.lo && r.sale.v < r.hi ? OK : ER }, r.sale)) : h(Carta, { oculta: true }), h(Carta, r.b)), T === 1 ? Stat('Pista: los valores entre ' + VAL(r.lo) + ' y ' + VAL(r.hi) + ' son ' + (r.hi - r.lo - 1) + ', y cada valor tiene 4 cartas (menos las que ya salieron).', '#cfe') : null),
        fb ? Box({ border: '2px solid ' + (fb.ok ? OK : ER) }, P(fb.t)) : null,
        r.paso === 'prob' ? Wrap(div({ fontFamily: HEAD, fontSize: 20 }, '¿Probabilidad de que la siguiente caiga entre ' + VAL(r.lo) + ' y ' + VAL(r.hi) + '?'), Opciones(r.op.map(x => x + ' %'), A), Dual(A.dual, 'a la vez para confirmar')) : r.paso === 'apuesta' ? Wrap(div({ fontFamily: HEAD, fontSize: 20 }, '¿Conviene apostar?'), Opciones(['Sí, apostamos', 'No, pasamos'], Bt), Dual(Bt.dual, 'a la vez para decidir')) : Btn(n + 1 >= R ? 'Terminar (ESPACIO)' : 'Siguiente ronda (ESPACIO)', sig, OK));
    }
    const MANOS_P = { par: [[5, 0], [5, 2], [9, 1], [2, 3], [12, 0]], doble: [[7, 0], [7, 3], [11, 1], [11, 2], [3, 0]], trio: [[8, 1], [8, 2], [8, 3], [13, 0], [4, 1]], escalera: [[5, 1], [6, 3], [7, 0], [8, 2], [9, 1]], color: [[2, 1], [6, 1], [9, 1], [11, 1], [13, 1]], full: [[10, 0], [10, 2], [10, 3], [4, 1], [4, 0]], poker: [[12, 0], [12, 1], [12, 2], [12, 3], [6, 2]] };
    const ManoP = k => () => Mano(MANOS_P[k].map(([v, s]) => ({ v, s, mini: true })));
    const DosManos = (a, b) => () => div({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 12 }, Mesa(Stat('MANO A', '#cfe'), ManoP(a)()), Mesa(Stat('MANO B', '#cfe'), ManoP(b)()));
    function Poker(p) {
      const st = [{ V: DosManos('par', 'trio'), q: '¿Qué mano gana?', o: ['Mano A (par)', 'Mano B (trío)'], a: 1, ex: 'Trío (tres iguales) le gana al par. Es menos probable, por eso vale más.' },
        { V: DosManos('escalera', 'color'), q: '¿Qué mano gana?', o: ['Mano A (escalera)', 'Mano B (color)'], a: 1, ex: 'Color (5 del mismo palo) le gana a la escalera porque es más difícil de conseguir.' },
        { V: DosManos('full', 'doble'), q: '¿Qué mano gana?', o: ['Mano A (full)', 'Mano B (doble par)'], a: 0, ex: 'Full = trío + par. Le gana al doble par.' }];
      if (p.tier >= 2) st.push({ V: ManoP('color'), q: 'Tienen 4 corazones y les falta 1 para hacer color. Quedan 47 cartas. ¿Cuántas les sirven?', o: ['9', '13', '4', '1'], a: 0, ex: 'Hay 13 corazones y ya ven 4: quedan 9 que sirven. 9 / 47 ≈ 19 %.' });
      if (p.tier >= 3) st.push({ q: 'Regla del 4: con 9 cartas que sirven y 2 cartas por venir, la probabilidad es aproximadamente 9 × 4. ¿Cuánto da?', o: ['≈ 36 %', '≈ 9 %', '≈ 4 %', '≈ 90 %'], a: 0, ex: '9 × 4 = 36 %. El cálculo exacto da 35 %. Los buenos jugadores calculan, no adivinan.' }, { q: 'En un casino, la casa cobra una comisión de cada mesa de póker. A la larga, ¿quién gana siempre?', o: ['La casa', 'El que hace más faroles', 'El que tiene más suerte'], a: 0, ex: 'Gane quien gane la mano, la casa ya cobró su comisión.' });
      return Pasos(p, ['Póker: ', B('las manos más difíciles de conseguir valen más.'), ' Eso es probabilidad.'], st, st.length - 1, 'Ordenar las manos es ordenar probabilidades.');
    }
    // ---- 40 ----
    const ORD40 = [1, 2, 3, 4, 5, 6, 7, 11, 12, 13];
    const capturas = (c, mesa) => { const res = [], n = mesa.length;
      for (let m = 1; m < (1 << n); m++) { const sub = []; for (let i = 0; i < n; i++) if (m & (1 << i)) sub.push(i);
        const base = sub.length === 1 && mesa[sub[0]].v === c.v ? 'caida' : c.v <= 7 && sub.length >= 2 && sub.every(i => mesa[i].v <= 7) && sub.reduce((s, i) => s + mesa[i].v, 0) === c.v ? 'suma' : null; if (!base) continue;
        const toma = sub.slice(); let k = ORD40.indexOf(c.v) + 1; while (k < ORD40.length) { const j = mesa.findIndex((x, i) => x.v === ORD40[k] && !toma.includes(i)); if (j < 0) break; toma.push(j); k++; }
        res.push({ toma: toma.sort((a, b) => a - b), tipo: base, esc: toma.length - sub.length }); }
      return res; };
    function Cuarenta(p) {
      const T = p.tier, fin = useOnce(p), R = 4;
      const gen = () => { for (let it = 0; it < 300; it++) { const dk = p.h.shuffle(ORD40.flatMap(v => [0, 1, 2, 3].map(s => ({ v, s })))); const mesa = dk.splice(0, T === 1 ? 4 : 5), mano = dk.splice(0, 3); const op = mano.map((c, i) => capturas(c, mesa).map(x => Object.assign({ c: i }, x))).flat(); if (!op.length) continue; const best = Math.max(...op.map(x => x.toma.length)); if (T >= 2 && !op.some(x => x.tipo === 'suma' || x.esc)) continue; return { mesa, mano, op, best }; } return null; };
      const [r, setR] = useState(gen), [n, setN] = useState(0), [hc, setHc] = useState(0), [tc, setTc] = useState(0), [sel, setSel] = useState([]), [pts, setPts] = useState(0), [fb, setFb] = useState(null);
      const enviar = () => { if (fb) return; const ss = sel.slice().sort((a, b) => a - b).join(','), v = r.op.find(x => x.c === hc && x.toma.join(',') === ss);
        if (!v) { p.snd('err'); p.onErr(sel.length ? 'Esa jugada no vale. Caída = misma carta · Suma = cartas hasta 7 que sumen su valor · luego la escalera hacia arriba.' : 'Elijan qué cartas de la mesa se llevan.', 0); return; }
        const ok = v.toma.length === r.best; if (ok) setPts(pts + 1); p.snd(ok ? 'ok' : 'click'); const mj = r.op.filter(x => x.toma.length === r.best)[0];
        setFb({ ok, t: (v.tipo === 'caida' ? 'Caída' : 'Suma') + (v.esc ? ' + escalera de ' + v.esc : '') + ': se llevan ' + v.toma.length + ' carta(s). ' + (ok ? '¡La mejor jugada posible!' : 'Había una mejor: con ' + VAL(r.mano[mj.c].v) + ' se llevaban ' + r.best + '.') }); };
      const dual = useDual(enviar);
      useKeys((c, dn) => { if (!dn || p.fin) return; if (fb) { if (c === 'Space') sig(); return; } if (c === 'KeyA') setHc((hc + 2) % 3); if (c === 'KeyD') setHc((hc + 1) % 3); const N = r.mesa.length; if (c === 'ArrowLeft') setTc((tc + N - 1) % N); if (c === 'ArrowRight') setTc((tc + 1) % N); if (c === 'ArrowUp') setSel(sel.includes(tc) ? sel.filter(x => x !== tc) : sel.concat([tc])); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      const sig = () => { if (n + 1 >= R) { if (pts >= R - 1) fin(true, pts === R ? 1 : 0.75, pts + ' de ' + R + ' jugadas óptimas.'); else fin(false, 0, pts + ' de ' + R + '. Busquen siempre la jugada que se lleva más cartas.'); return; } setN(n + 1); setR(gen()); setSel([]); setFb(null); setHc(0); setTc(0); };
      return Wrap(P(['Cuarenta: encuentren la jugada que ', B('se lleva más cartas'), '. ', B('Caída:'), ' misma carta. ', B('Suma:'), ' cartas de la mesa (hasta 7) que sumen el valor de la suya. Después se llevan la ', B('escalera'), ' hacia arriba (… 6, 7, J, Q, K).']),
        Ctrls(Tag(1, 'A · D elige carta de la mano'), Tag(2, '← · → recorre la mesa · ↑ marcar')), div({ display: 'flex', flexWrap: 'wrap', gap: 16 }, Stat('JUGADA ' + (n + 1) + ' / ' + R), Stat('ÓPTIMAS ' + pts, OK)),
        Mesa(Stat('MESA · J2 marca las que se llevan', '#cfe'), Mano(r.mesa.map((c, i) => Object.assign({}, c, { sel: sel.includes(i), glow: tc === i ? J2 : null, onClick: () => !fb && setSel(sel.includes(i) ? sel.filter(x => x !== i) : sel.concat([i])) })))),
        Box({ display: 'flex', flexDirection: 'column', gap: 8 }, Stat('SU MANO · J1 elige con qué carta juegan', J1), Mano(r.mano.map((c, i) => Object.assign({}, c, { sel: hc === i, onClick: () => !fb && setHc(i) })))),
        fb ? Wrap(Box({ border: '2px solid ' + (fb.ok ? OK : GOLD) }, P(fb.t)), Btn(n + 1 >= R ? 'Terminar (ESPACIO)' : 'Siguiente (ESPACIO)', sig, OK)) : Dual(dual, 'J1 E + J2 ENTER = jugar'));
    }
    // ---- rummy ----
    const valido = cs => { if (cs.length < 3) return false; const gr = cs.every(c => c.v === cs[0].v) && new Set(cs.map(c => c.s)).size === cs.length && cs.length <= 4; const vs = cs.map(c => c.v).sort((a, b) => a - b); const sec = cs.every(c => c.s === cs[0].s) && vs.every((v, i) => !i || v === vs[i - 1] + 1); return gr || sec; };
    function Rummy(p) {
      const T = p.tier, fin = useOnce(p);
      const gen = () => { for (let it = 0; it < 400; it++) { const used = {}, mano = [], k = c => c.v + '-' + c.s; let ok = true; const nc = T === 1 ? 2 : 3;
          for (let j = 0; j < nc && ok; j++) { let g; if (j % 2 === 0) { const s = p.h.int(0, 3), L = p.h.int(3, T === 1 ? 3 : 4), v0 = p.h.int(1, 14 - L); g = [...Array(L)].map((_, i) => ({ v: v0 + i, s })); } else { const v = p.h.int(1, 13), ss = p.h.shuffle([0, 1, 2, 3]).slice(0, 3); g = ss.map(s => ({ v, s })); }
            if (g.some(c => used[k(c)])) ok = false; else g.forEach(c => { used[k(c)] = 1; mano.push(c); }); }
          if (!ok) continue; if (T === 3) { let x; do { x = { v: p.h.int(1, 13), s: p.h.int(0, 3) }; } while (used[k(x)]); mano.push(x); } return p.h.shuffle(mano); } return []; };
      const [mano, setMano] = useState(gen), [baj, setBaj] = useState([]), [sel, setSel] = useState([]), [c1, setC1] = useState(0), [c2, setC2] = useState(1), [err, setErr] = useState(0);
      const meta = T === 3 ? 1 : 0;
      const bajar = () => { const cs = sel.map(i => mano[i]); if (!valido(cs)) { setErr(err + 1); p.snd('err'); p.onErr(cs.length < 3 ? 'Una combinación necesita al menos 3 cartas.' : 'No es válida. Grupo: mismo número, palos distintos. Escalera: mismo palo y números seguidos.', 0); return; }
        const nm = mano.filter((_, i) => !sel.includes(i)), nb = baj.concat([cs]); setMano(nm); setBaj(nb); setSel([]); setC1(0); setC2(Math.min(1, nm.length - 1)); p.snd('ok');
        if (nm.length <= meta) fin(true, err === 0 ? 1 : err <= 2 ? 0.75 : 0.5, 'Bajaron ' + nb.length + ' combinaciones' + (meta ? ' y descartaron la carta que sobraba' : '') + '. Clasificar es pensar con reglas.'); };
      const dual = useDual(bajar), N = mano.length || 1, tg = i => setSel(sel.includes(i) ? sel.filter(x => x !== i) : sel.concat([i]));
      useKeys((c, dn) => { if (!dn || p.fin) return; if (c === 'KeyA') setC1((c1 + N - 1) % N); if (c === 'KeyD') setC1((c1 + 1) % N); if (c === 'KeyW') tg(c1); if (c === 'ArrowLeft') setC2((c2 + N - 1) % N); if (c === 'ArrowRight') setC2((c2 + 1) % N); if (c === 'ArrowUp') tg(c2); if (c === 'KeyE') dual.press(0); if (c === 'Enter') dual.press(1); });
      return Wrap(P(['Rummy: bajen toda la mano en combinaciones. ', B('Grupo:'), ' 3 o 4 cartas del mismo número y palos distintos. ', B('Escalera:'), ' 3 o más del mismo palo y números seguidos.', meta ? ' Una carta no sirve: esa se descarta.' : '']),
        Ctrls(Tag(1, 'A · D mover · W marcar'), Tag(2, '← · → mover · ↑ marcar')), div({ display: 'flex', flexWrap: 'wrap', gap: 16 }, Stat('EN LA MANO ' + mano.length), Stat('COMBINACIONES ' + baj.length, OK), Stat('INTENTOS FALLIDOS ' + err, err ? ER : MU)),
        Mesa(Stat('BAJADAS', '#cfe'), baj.length ? div({ display: 'flex', flexWrap: 'wrap', gap: 14 }, ...baj.map((g, i) => Mano(g.map(c => Object.assign({ mini: true }, c)), { key: i, padding: 6, border: '1px dashed rgba(255,255,255,.3)', borderRadius: 8 }))) : Stat('Todavía ninguna', '#9fc')),
        Box({ display: 'flex', flexDirection: 'column', gap: 8 }, Stat('SU MANO', TX), Mano(mano.map((c, i) => Object.assign({}, c, { sel: sel.includes(i), glow: c1 === i && c2 === i ? '#fff' : c1 === i ? J1 : c2 === i ? J2 : null, onClick: () => tg(i) })))),
        Dual(dual, 'J1 E + J2 ENTER = bajar las cartas marcadas'));
    }
    // ---- cuarteto (memoria de cuatro iguales) ----
    function Cuarteto(p) {
      const T = p.tier, fin = useOnce(p), NR = [3, 4, 5][T - 1], lim = [12, 18, 26][T - 1];
      const [cs] = useState(() => p.h.shuffle(p.h.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]).slice(0, NR).flatMap(v => [0, 1, 2, 3].map(s => ({ v, s }))))), [up, setUp] = useState([]), [ok, setOk] = useState([]), [c1, setC1] = useState(0), [c2, setC2] = useState(cs.length - 1), [int, setInt] = useState(0), [lock, setLock] = useState(false);
      const cols = 4, N = cs.length;
      const voltear = i => { if (lock || p.fin || ok.includes(i) || up.includes(i)) return; const nu = up.concat([i]); setUp(nu); p.snd('click');
        if (cs[nu[0]].v !== cs[i].v) { setLock(true); const ni = int + 1; setInt(ni); setTimeout(() => { setUp([]); setLock(false); if (ni >= lim) fin(false, 0, 'Se acabaron los ' + lim + ' intentos. Usen la memoria: ¡díganse en voz alta dónde vieron cada número!'); }, 900); return; }
        if (nu.length === 4) { const no = ok.concat(nu); setOk(no); setUp([]); p.snd('ok'); if (no.length === N) fin(true, int <= lim * 0.5 ? 1 : 0.75, 'Encontraron los ' + NR + ' cuartetos con ' + int + ' intentos fallidos.'); } };
      const mv = (c, d) => { const r = Math.floor(c / cols), k = c % cols; if (d === 'L') return r * cols + (k + cols - 1) % cols; if (d === 'R') return r * cols + (k + 1) % cols; if (d === 'U') return ((r + Math.ceil(N / cols) - 1) % Math.ceil(N / cols)) * cols + k; return ((r + 1) % Math.ceil(N / cols)) * cols + k; };
      useKeys((c, dn) => { if (!dn || p.fin) return; const L = { KeyA: 'L', KeyD: 'R', KeyW: 'U', KeyS: 'D' }[c], R2 = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[c]; if (L) setC1(Math.min(N - 1, mv(c1, L))); if (R2) setC2(Math.min(N - 1, mv(c2, R2))); if (c === 'KeyE') voltear(c1); if (c === 'Enter') voltear(c2); });
      return Wrap(P(['Cuarteto: encuentren las ', B('4 cartas del mismo número'), '. Volteen una por una; si sale un número distinto, se vuelven a tapar. Ojo: cada uno voltea con su tecla (aquí no se presiona a la vez).']),
        Ctrls(Tag(1, 'W A S D mover · E voltear'), Tag(2, 'flechas mover · ENTER voltear')), div({ display: 'flex', flexWrap: 'wrap', gap: 16 }, Stat('CUARTETOS ' + ok.length / 4 + ' / ' + NR, OK), Stat('INTENTOS FALLIDOS ' + int + ' / ' + lim, int > lim * 0.7 ? ER : MU)),
        Mesa(div({ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ',max-content)', gap: 10, justifyContent: 'center' }, ...cs.map((c, i) => h(Carta, Object.assign({ key: i, oculta: !up.includes(i) && !ok.includes(i), glow: c1 === i && c2 === i ? '#fff' : c1 === i ? J1 : c2 === i ? J2 : ok.includes(i) ? OK : null, onClick: () => voltear(i), mini: N > 16 }, c))))));
    }
    make.c = { tragamonedas: Tragamonedas, ruleta: Ruleta, esperado: Esperado, cromos: Cromos, apuestas: Apuestas, trucos: Trucos, veintiuno: Veintiuno, intermedia: Intermedia, poker: Poker, cuarenta: Cuarenta, rummy: Rummy, cuarteto: Cuarteto };
    make.capturas = capturas; make.valido = valido; make.val21 = val21;
    return make.c;
  }
  window.ESC_CASINO = { make };
})();

// Minijuegos compartidos de las clases interactivas: Carrera, Atrapa el bug, Simón y Circuito.
(function () {
  function make(React, k) {
    const { useState, useEffect, useRef } = React, h = React.createElement, { D, T, K, B, Card, Btn, Row, Code, c } = k;
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const Head = (tit, txt, stats) => D({ display: 'flex', flexDirection: 'column', gap: 10 }, Row({ justifyContent: 'space-between' }, K('Minijuego', c.AMB), Row({ gap: 14 }, ...stats.map((s, i) => D({ key: i, fontFamily: k.MONO, fontWeight: 700, fontSize: 'clamp(15px,1.3vw,20px)', color: s[1] || c.INK }, s[0])))), k.H1(tit, { fontSize: 'clamp(26px,2.8vw,46px)' }), T(txt));
    const RUTA = r => r === 'basico' ? 0 : r === 'experto' ? 2 : 1;

    function Carrera(p) {
      const d = p.data, n = RUTA(p.ruta), lim = [100, 70, 45][n], lines = p.adaptado && d.corto ? d.corto : d.lineas;
      const [mez, setMez] = useState(() => shuffle(lines.map((_, i) => i))), [hech, setHech] = useState([]), [t, setT] = useState(lim), [run, setRun] = useState(false), [mal, setMal] = useState(null), [fin, setFin] = useState(false);
      useEffect(() => { if (!run || fin) return; const i = setInterval(() => setT(x => x - 1), 1000); return () => clearInterval(i); }, [run, fin]);
      useEffect(() => { if (run && t <= 0 && !fin) { setRun(false); p.check(false, 'Se acabó el tiempo. Lean primero todas las líneas y piensen cuál va al inicio antes de tocar.', 'tiempo'); } }, [t]);
      const tocar = i => { if (!run || fin || hech.includes(i)) return; if (i === hech.length) { const nh = hech.concat([i]); setHech(nh); if (nh.length === lines.length) { setFin(true); setRun(false); p.check(true, '¡Ordenado en ' + (lim - t) + ' segundos! ' + (d.ok || ''), ''); } } else { setMal(i); setT(x => Math.max(0, x - 3)); setTimeout(() => setMal(null), 400); } };
      const empezar = () => { setMez(shuffle(lines.map((_, i) => i))); setHech([]); setT(lim); setFin(false); setRun(true); };
      return D({ display: 'flex', flexDirection: 'column', gap: 16 }, Head(d.tit || 'Carrera de instrucciones', d.txt || 'Toquen las líneas en el orden correcto antes de que se acabe el tiempo. Cada error resta 3 segundos.', [[t + ' s', t <= 10 ? c.RED : c.AMB], [hech.length + ' / ' + lines.length, c.TEAL]]),
        !run && !fin ? Btn(t < lim ? '↻ Intentar otra vez' : '▶ Empezar la carrera', empezar, { bg: c.TEAL }) : null,
        k.Grid(320, Card({ gap: 8 }, K('Líneas desordenadas'), ...mez.map(i => h('button', { key: i, onClick: () => tocar(i), disabled: hech.includes(i), style: { textAlign: 'left', fontFamily: k.MONO, fontSize: 'clamp(14px,1.2vw,19px)', padding: '10px 12px', borderRadius: 6, cursor: run ? 'pointer' : 'default', whiteSpace: 'pre-wrap', background: mal === i ? c.RED : hech.includes(i) ? c.OFF : c.SUNK, color: mal === i ? '#fff' : hech.includes(i) ? c.MUTE : c.INK, border: '2px solid ' + (hech.includes(i) ? c.LINE : c.BLUE), filter: run ? 'none' : 'blur(3px)', transition: 'background .2s' } }, lines[i]))),
          Card({ gap: 8 }, K('Su orden'), Code(hech.length ? hech.map(i => lines[i]) : ['// toquen la primera línea'])))
      );
    }

    function Bug(p) {
      const d = p.data, n = RUTA(p.ruta), meta = [4, 6, 8][n], vel = [0.55, 0.8, 1.1][n];
      const [st, setSt] = useState({ items: [], pts: 0, vidas: 3, run: false, fin: false, msg: '' }), ref = useRef(st), id = useRef(0), cola = useRef([]);
      ref.current = st;
      useEffect(() => { if (!st.run) return; let tk = 0;
        const iv = setInterval(() => { const s = ref.current; if (!s.run) return; tk++; let items = s.items.map(x => Object.assign({}, x, { y: x.y + vel })), vidas = s.vidas, msg = s.msg;
          items = items.filter(x => { if (x.y >= 100) { if (x.bug && !x.hit) { vidas--; msg = 'Se escapó un error: ' + x.ex; } return false; } return true; });
          if (tk % Math.round(48 / vel) === 1) { if (!cola.current.length) cola.current = shuffle(d.lineas); const L = cola.current.pop(); items.push({ id: id.current++, t: L[0], bug: L[1], ex: L[2] || '', x: 4 + Math.random() * 52, y: 0 }); }
          const ns = Object.assign({}, s, { items, vidas, msg }); if (vidas <= 0) { ns.run = false; ns.fin = true; setTimeout(() => p.check(false, 'Se acabaron las vidas. ' + msg + ' Lean cada línea con calma: ¿le falta algo? ¿está bien escrita?', 'bug'), 50); } setSt(ns); }, 60);
        return () => clearInterval(iv); }, [st.run]);
      const tocar = x => { const s = ref.current; if (!s.run || x.hit) return; let { pts, vidas, msg } = s;
        if (x.bug) { pts++; msg = '¡Atrapado! ' + x.ex; } else { vidas--; msg = 'Esa línea estaba bien: «' + x.t + '».'; }
        const items = s.items.map(y => y.id === x.id ? Object.assign({}, y, { hit: true, y: 101 }) : y), ns = Object.assign({}, s, { pts, vidas, msg, items });
        if (pts >= meta) { ns.run = false; ns.fin = true; setTimeout(() => p.check(true, '¡Atraparon ' + pts + ' errores! ' + (d.ok || ''), ''), 50); } else if (vidas <= 0) { ns.run = false; ns.fin = true; setTimeout(() => p.check(false, 'Se acabaron las vidas. ' + msg, 'bug'), 50); }
        setSt(ns); };
      const empezar = () => { cola.current = []; setSt({ items: [], pts: 0, vidas: 3, run: true, fin: false, msg: '' }); };
      return D({ display: 'flex', flexDirection: 'column', gap: 14 }, Head(d.tit || 'Atrapa el bug', d.txt || 'Caen líneas de código. Toquen SOLO las que tienen un error. Si tocan una correcta o dejan escapar un error, pierden una vida.', [['Errores ' + st.pts + ' / ' + meta, c.TEAL], ['Vidas ' + '●'.repeat(Math.max(0, st.vidas)) + '○'.repeat(3 - Math.max(0, st.vidas)), c.RED]]),
        !st.run ? Btn(st.fin ? '↻ Jugar otra vez' : '▶ Empezar', empezar, { bg: c.TEAL }) : null,
        h('div', { style: { position: 'relative', height: 'clamp(320px,46vh,520px)', background: c.SUNK, border: '2px solid ' + c.LINE, borderRadius: 12, overflow: 'hidden' } },
          ...st.items.filter(x => !x.hit).map(x => h('button', { key: x.id, onClick: () => tocar(x), style: { position: 'absolute', left: x.x + '%', top: 'calc(' + x.y + '% - 20px)', fontFamily: k.MONO, fontSize: 'clamp(14px,1.2vw,19px)', padding: '8px 12px', borderRadius: 6, background: c.CARD, color: c.INK, border: '2px solid ' + c.BLUE, cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: '46%', overflow: 'hidden', textOverflow: 'ellipsis' } }, x.t)),
          !st.run && !st.items.length ? D({ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.MUTE, fontSize: 18, padding: 20, textAlign: 'center' }, d.ejemplo || 'Ejemplo de error: digitalWrite(13, HIGH)  ← falta el ;') : null),
        st.msg ? T(st.msg, { color: /Atrapado/.test(st.msg) ? c.OKC : c.RED, fontWeight: 600 }) : null);
    }

    function Simon(p) {
      const d = p.data, n = RUTA(p.ruta), L = [3, 4, 5][n] + (p.adaptado ? -1 : 0), pads = d.pads;
      const [seq, setSeq] = useState([]), [luz, setLuz] = useState(-1), [mio, setMio] = useState([]), [fase, setFase] = useState('ini'), [elig, setElig] = useState(null), tm = useRef([]);
      useEffect(() => () => tm.current.forEach(clearTimeout), []);
      const mostrar = s => { setFase('ver'); setMio([]); tm.current.forEach(clearTimeout); tm.current = []; s.forEach((v, i) => { tm.current.push(setTimeout(() => setLuz(v), 300 + i * 750)); tm.current.push(setTimeout(() => setLuz(-1), 300 + i * 750 + 480)); }); tm.current.push(setTimeout(() => setFase('rep'), 300 + s.length * 750)); };
      const empezar = () => { const s = [...Array(L)].map(() => Math.floor(Math.random() * pads.length)); setSeq(s); setElig(null); mostrar(s); };
      const tocar = i => { if (fase !== 'rep') return; setLuz(i); setTimeout(() => setLuz(-1), 220); const m = mio.concat([i]);
        if (seq[m.length - 1] !== i) { setFase('ini'); p.check(false, 'Esa no era la luz número ' + m.length + '. Digan los colores en voz alta mientras miran: ayuda a recordar.', 'simon'); return; }
        setMio(m); if (m.length === seq.length) setFase(d.programa ? 'prog' : 'ok'); if (m.length === seq.length && !d.programa) p.check(true, '¡Secuencia de ' + L + ' perfecta!', ''); };
      const ops = fase === 'prog' || fase === 'fin' ? (() => { const bien = d.programa(seq), otra1 = d.programa(seq.slice().reverse()), sw = seq.slice(); if (sw.length > 1) [sw[0], sw[1]] = [sw[1], sw[0]]; const otra2 = d.programa(sw.join() === seq.join() ? seq.map(v => (v + 1) % pads.length) : sw); return [bien, otra1, otra2]; })() : [];
      const [ord] = useState(() => shuffle([0, 1, 2]));
      return D({ display: 'flex', flexDirection: 'column', gap: 14 }, Head(d.tit || 'Simón del Arduino', d.txt || 'Miren la secuencia, repítanla tocando las luces y luego elijan el programa que la produce.', [['Secuencia de ' + L, c.AMB], [fase === 'rep' ? mio.length + ' / ' + L : fase === 'ver' ? 'MIREN…' : '', c.TEAL]]),
        Row({ justifyContent: 'center', gap: 'clamp(14px,2vw,30px)' }, ...pads.map((pd, i) => h('button', { key: i, onClick: () => tocar(i), style: { width: 'clamp(90px,10vw,150px)', height: 'clamp(90px,10vw,150px)', borderRadius: '50%', border: '4px solid ' + pd.c, background: luz === i ? pd.c : c.SUNK, boxShadow: luz === i ? '0 0 40px ' + pd.c : 'none', color: luz === i ? '#111' : c.INK, fontFamily: k.HEAD, fontSize: 'clamp(14px,1.3vw,20px)', cursor: fase === 'rep' ? 'pointer' : 'default', transition: 'all .12s' } }, pd.t))),
        fase === 'ini' || fase === 'ok' ? Btn(seq.length ? '↻ Nueva secuencia' : '▶ Mostrar la secuencia', empezar, { bg: c.TEAL }) : null,
        fase === 'prog' ? Card({ gap: 10, borderColor: c.BLUE }, K('¡Bien! Ahora: ¿qué programa produce esa secuencia?', c.BLUE), k.Grid(260, ...ord.map(o => h('button', { key: o, onClick: () => { setElig(o); setFase('fin'); p.check(o === 0, o === 0 ? '¡Exacto! Cada luz de la secuencia es una instrucción, en el mismo orden.' : 'Ese programa enciende las luces en otro orden. Comparen línea por línea con la secuencia.', o === 0 ? '' : 'simonprog'); if (o !== 0) setTimeout(() => setFase('prog'), 1200); }, style: { textAlign: 'left', background: 'transparent', border: '2px solid ' + c.LINE, borderRadius: 8, padding: 0, cursor: 'pointer' } }, Code(ops[o]))))) : null);
    }

    function Circuito(p) {
      const d = p.data, pares = p.adaptado && d.corto ? d.pares.slice(0, d.corto) : d.pares;
      const [der] = useState(() => shuffle(pares.map((_, i) => i))), [con, setCon] = useState({}), [sel, setSel] = useState(null), box = useRef(null), [pos, setPos] = useState({});
      useEffect(() => { const m = () => { const b = box.current; if (!b) return; const r0 = b.getBoundingClientRect(), o = {}; b.querySelectorAll('[data-pt]').forEach(e => { const r = e.getBoundingClientRect(); o[e.getAttribute('data-pt')] = [(e.getAttribute('data-pt')[0] === 'L' ? r.right : r.left) - r0.left, r.top + r.height / 2 - r0.top]; }); setPos(o); }; m(); const t = setTimeout(m, 300); window.addEventListener('resize', m); return () => { clearTimeout(t); window.removeEventListener('resize', m); }; }, [Object.keys(con).length]);
      const unir = j => { if (sel == null) return; const n = Object.assign({}, con); Object.keys(n).forEach(x => { if (n[x] === j) delete n[x]; }); n[sel] = j; setCon(n); setSel(null); };
      const listo = pares.every((_, i) => con[i] != null), COLS = [c.RED, c.TEAL, c.AMB, c.BLUE, c.OKC, '#ff8fd0'];
      const pt = (tipo, i, txt, col, on, clk) => h('button', { key: tipo + i, 'data-pt': tipo + i, onClick: clk, style: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: tipo === 'L' ? 'space-between' : 'flex-start', padding: '12px 14px', borderRadius: 8, background: on ? col + '22' : c.CARD, border: '2px solid ' + (on ? col : c.LINE), color: c.INK, fontWeight: 700, fontSize: 'clamp(14px,1.2vw,19px)', cursor: 'pointer', textAlign: 'left' } }, tipo === 'R' ? D({ width: 14, height: 14, borderRadius: 7, background: col, flex: 'none' }) : null, txt, tipo === 'L' ? D({ width: 14, height: 14, borderRadius: 7, background: col, flex: 'none' }) : null);
      return D({ display: 'flex', flexDirection: 'column', gap: 14 }, Head(d.tit || 'Conecta el circuito', d.txt || 'Toquen un componente y luego el pin donde va. Pueden cambiar una conexión tocándola de nuevo.', [[Object.keys(con).length + ' / ' + pares.length + ' cables', c.TEAL]]),
        h('div', { ref: box, style: { position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(40px,.5fr) minmax(0,1fr)', gap: 10 } },
          h('svg', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' } }, ...Object.keys(con).map(i => { const a = pos['L' + i], b = pos['R' + con[i]]; if (!a || !b) return null; const mx = (a[0] + b[0]) / 2; return h('path', { key: i, d: 'M' + a[0] + ' ' + a[1] + ' C' + mx + ' ' + a[1] + ' ' + mx + ' ' + b[1] + ' ' + b[0] + ' ' + b[1], fill: 'none', stroke: COLS[i % COLS.length], strokeWidth: 4, strokeLinecap: 'round' }); })),
          D({ display: 'flex', flexDirection: 'column', gap: 10 }, K(d.izq || 'Componentes'), ...pares.map((pr, i) => pt('L', i, pr[0], COLS[i % COLS.length], sel === i || con[i] != null, () => setSel(sel === i ? null : i)))), D({}),
          D({ display: 'flex', flexDirection: 'column', gap: 10 }, K(d.der || 'Pines del Arduino'), ...der.map(j => { const de = Object.keys(con).find(x => con[x] === j); return pt('R', j, pares[j][1], de != null ? COLS[de % COLS.length] : c.MUTE, de != null, () => unir(j)); }))),
        sel != null ? T('Ahora toquen dónde se conecta «' + pares[sel][0] + '».', { color: c.AMB, fontWeight: 600 }) : null,
        Row({}, Btn('Comprobar', () => { const mal = pares.findIndex((_, i) => con[i] !== i); p.check(mal < 0, mal < 0 ? (d.ok || '¡Circuito correcto!') : '«' + pares[mal][0] + '» no va ahí. ' + (pares[mal][2] || ''), 'circuito'); }, { dis: !listo, bg: c.TEAL }), Btn('Desconectar todo', () => { setCon({}); setSel(null); }, { bg: c.CARD, c: c.INK })));
    }
    return { Carrera, Bug, Simon, Circuito };
  }
  window.CLASE_JUEGOS = { make };
})();

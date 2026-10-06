// Clase interactiva · 9no EGB · Unidad 1 · Variables, constantes, tipos de datos y operadores
(function () {
  const INK = '#e8f1f2', PAPER = '#0b1218', MUTE = '#9fb0ba', LINE = '#2c3e4a', TEAL = '#3fd0b8', AMB = '#f0a726', RED = '#ff7b72', BLUE = '#6ea8ff', OKC = '#7fe0a0', CARD = '#13202a', SINK = '#14181c', DARK = '#06121a';
  const HEAD = "'Archivo Black',sans-serif", MONO = "'IBM Plex Mono',monospace";

  function make(React) {
    if (make.c) return make.c;
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const D = (st, ...ch) => h('div', { style: st }, ...ch);
    const T = (t, st) => h('div', { style: Object.assign({ fontSize: 'clamp(17px,1.5vw,24px)', lineHeight: 1.45, color: INK, textWrap: 'pretty' }, st || {}) }, t);
    const H1 = (t, st) => h('div', { style: Object.assign({ textShadow: '0 0 22px rgba(63,208,184,.22)', fontFamily: HEAD, fontSize: 'clamp(30px,3.6vw,64px)', lineHeight: 1.04, color: INK, letterSpacing: '-.01em', textWrap: 'balance' }, st || {}) }, t);
    const H2 = (t, st) => h('div', { style: Object.assign({ fontFamily: HEAD, fontSize: 'clamp(21px,2vw,34px)', lineHeight: 1.1, color: INK }, st || {}) }, t);
    const K = (t, c) => h('div', { style: { fontFamily: MONO, fontSize: 'clamp(12px,.95vw,16px)', letterSpacing: '.14em', fontWeight: 600, color: c || MUTE, textTransform: 'uppercase' } }, t);
    const B = t => h('b', null, t);
    const Card = (st, ...ch) => D(Object.assign({ background: CARD, border: '2px solid ' + LINE, borderRadius: 10, padding: 'clamp(14px,1.4vw,24px)', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }, st || {}, st && st.borderColor ? { boxShadow: GLOW(st.borderColor) } : {}), ...ch);
    const Btn = (t, onClick, o) => { o = o || {}; return h('button', { onClick, disabled: o.dis, style: { fontFamily: o.head === false ? 'inherit' : HEAD, fontSize: o.fs || 'clamp(15px,1.25vw,20px)', padding: o.pad || '12px 20px', background: o.dis ? '#25333d' : o.bg || INK, color: o.dis ? '#6f828d' : o.c || DARK, border: '2px solid ' + (o.dis ? '#25333d' : o.bd || o.bg || INK), boxShadow: o.dis || o.bg === CARD ? 'none' : '0 0 18px ' + (o.bg || INK) + '33', cursor: o.dis ? 'default' : 'pointer', textAlign: 'left', lineHeight: 1.2 } }, t); };
    const Chip = (t, on, onClick, col) => h('button', { onClick, style: { fontFamily: 'inherit', fontWeight: 600, fontSize: 'clamp(14px,1.15vw,19px)', padding: '10px 14px', background: on ? (col || INK) : CARD, color: on ? DARK : INK, border: '2px solid ' + (on ? (col || INK) : LINE), cursor: 'pointer', textAlign: 'left', lineHeight: 1.25 } }, t);
    const Row = (st, ...ch) => D(Object.assign({ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }, st || {}), ...ch);
    const Grid = (min, ...ch) => D({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,' + min + 'px),1fr))', gap: 'clamp(12px,1.4vw,22px)', alignItems: 'start' }, ...ch);
    const Say = (p, txt) => p.say ? h('button', { onClick: () => p.say(txt), title: 'Escuchar', style: { fontFamily: MONO, fontSize: 13, fontWeight: 700, padding: '6px 10px', background: CARD, border: '2px solid ' + INK, cursor: 'pointer', alignSelf: 'flex-start' } }, '🔊 ESCUCHAR') : null;
    const Fb = (ok, txt) => D({ border: '3px solid ' + (ok ? OKC : RED), background: ok ? 'rgba(127,224,160,.12)' : 'rgba(255,123,114,.12)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }, D({ fontFamily: HEAD, fontSize: 'clamp(17px,1.4vw,22px)', color: ok ? OKC : RED }, ok ? '¡Funciona!' : 'Todavía no funciona'), T(txt, { fontSize: 'clamp(15px,1.2vw,19px)' }));
    const Sel = (val, opts, set) => h('select', { value: val, onChange: e => set(e.target.value), style: { fontFamily: 'inherit', fontSize: 'clamp(15px,1.2vw,19px)', fontWeight: 600, padding: '9px 10px', border: '2px solid ' + INK, background: CARD, color: INK, maxWidth: '100%' } }, ...opts.map(o => h('option', { key: o[0], value: o[0] }, o[1])));
    const Slider = (lab, val, min, max, set, unit) => D({ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }, Row({ justifyContent: 'space-between' }, K(lab, INK), D({ fontFamily: HEAD, fontSize: 'clamp(18px,1.6vw,26px)', whiteSpace: 'nowrap', flex: 'none' }, val + (unit || ''))), h('input', { type: 'range', min, max, value: val, onChange: e => set(Number(e.target.value)), style: { width: '100%', accentColor: TEAL } }));

    // ---------- Diagrama de flujo ----------
    function Flujo({ nodos, activo, err, compact }) {
      const fs = compact ? 'clamp(12px,1vw,16px)' : 'clamp(13px,1.1vw,18px)';
      const forma = (n, act, key) => {
        const bg = act ? '#ffe7a3' : n.bad ? 'rgba(255,123,114,.12)' : '#fff', bd = n.bad ? RED : SINK, base = { fontSize: fs, fontWeight: 600, color: SINK, textAlign: 'center', lineHeight: 1.2, boxShadow: act ? '0 0 0 4px ' + AMB : 'none' };
        if (n.t === 'ini') return h('div', { key, style: Object.assign(base, { border: '3px solid ' + bd, borderRadius: 999, padding: '8px 22px', background: bg }) }, n.txt);
        if (n.t === 'io') return h('div', { key, style: Object.assign(base, { border: '3px solid ' + bd, padding: '8px 22px', background: bg, transform: 'skewX(-14deg)' }) }, h('div', { style: { transform: 'skewX(14deg)' } }, n.txt));
        if (n.t === 'dec') return h('div', { key, style: { position: 'relative', width: 'clamp(170px,15vw,240px)', height: 'clamp(84px,7vw,110px)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          h('svg', { viewBox: '0 0 200 100', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } }, h('polygon', { points: '100,3 197,50 100,97 3,50', fill: bg, stroke: bd, strokeWidth: 3, vectorEffect: 'non-scaling-stroke' })),
          h('div', { style: Object.assign(base, { position: 'relative', padding: '0 34px', boxShadow: 'none' }) }, n.txt), act ? h('div', { style: { position: 'absolute', inset: -6, border: '3px solid ' + AMB, pointerEvents: 'none', clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)' } }) : null);
        return h('div', { key, style: Object.assign(base, { border: '3px solid ' + bd, padding: '8px 18px', background: bg }) }, n.txt);
      };
      const flecha = k => h('div', { key: k, style: { width: 3, height: compact ? 14 : 20, background: SINK, position: 'relative' } }, h('div', { style: { position: 'absolute', bottom: -2, left: -5, borderLeft: '6.5px solid transparent', borderRight: '6.5px solid transparent', borderTop: '8px solid ' + SINK } }));
      const out = [];
      nodos.forEach((n, i) => {
        if (i) out.push(flecha('f' + i));
        if (n.t === 'dec') {
          out.push(forma(n, activo === i, 'n' + i));
          const rama = (lado, r, ak) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }, D({ fontFamily: MONO, fontWeight: 700, fontSize: 14, color: lado === 'SÍ' ? OKC : RED }, lado), flecha('x'), forma(r, activo === ak, ak));
          out.push(h('div', { key: 'r' + i, style: { display: 'flex', gap: 'clamp(14px,2vw,40px)', justifyContent: 'center', alignItems: 'flex-start' } }, rama('SÍ', n.si, i + 's'), rama('NO', n.no, i + 'n')));
        } else out.push(forma(n, activo === i, 'n' + i));
      });
      return D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '10px 4px' }, ...out, nodos.loop ? D({ fontFamily: MONO, fontSize: 14, fontWeight: 700, marginTop: 8, color: SINK }, '↺ ' + nodos.loop) : null);
    }

    // ---------- Simulaciones SVG ----------
    function Planta({ hum, bomba }) {
      const s = hum < 25 ? 'seca' : hum > 85 ? 'ahogada' : 'bien', hoja = s === 'seca' ? '#b9a25a' : s === 'ahogada' ? '#5d8a6a' : '#2f9a55', caida = s === 'seca' ? 18 : 0;
      return h('svg', { viewBox: '0 0 220 200', style: { width: '100%', maxWidth: 260, height: 'auto', display: 'block' } },
        h('rect', { x: 150, y: 20, width: 50, height: 60, fill: '#dfe9f3', stroke: SINK, strokeWidth: 2 }), h('text', { x: 175, y: 55, textAnchor: 'middle', fontSize: 13, fontFamily: 'IBM Plex Mono', fontWeight: 700 }, 'BOMBA'),
        h('rect', { x: 155, y: 70, width: 40, height: 8, fill: bomba ? BLUE : '#aaa' }), h('path', { d: 'M175 78 V100 H120', fill: 'none', stroke: bomba ? BLUE : '#999', strokeWidth: 6 }),
        bomba ? h('g', null, [0, 1, 2].map(k => h('circle', { key: k, cx: 112 - k * 6, cy: 108 + k * 10, r: 4, fill: BLUE }))) : null,
        h('path', { d: 'M60 140 Q90 ' + (90 + caida) + ' 110 ' + (70 + caida), stroke: '#3a6b35', strokeWidth: 5, fill: 'none' }),
        h('ellipse', { cx: 82, cy: 105 + caida, rx: 22, ry: 10, fill: hoja, transform: 'rotate(' + (-30 + caida) + ' 82 ' + (105 + caida) + ')' }), h('ellipse', { cx: 118, cy: 78 + caida, rx: 22, ry: 10, fill: hoja, transform: 'rotate(' + (20 + caida) + ' 118 ' + (78 + caida) + ')' }),
        h('path', { d: 'M30 140 H130 L120 190 H40 Z', fill: '#b5643a', stroke: SINK, strokeWidth: 2 }), h('rect', { x: 34, y: 140, width: 92, height: 10, fill: hum < 25 ? '#c9a77a' : '#5a3b22' }),
        h('text', { x: 80, y: 172, textAnchor: 'middle', fontSize: 14, fontFamily: 'IBM Plex Mono', fontWeight: 700, fill: '#fff' }, hum + ' %'));
    }
    function Lampara({ on, luz }) {
      const cielo = luz < 300 ? '#22304a' : luz < 600 ? '#e7a96b' : '#bfe0f5';
      return h('svg', { viewBox: '0 0 220 170', style: { width: '100%', maxWidth: 260, height: 'auto', display: 'block' } },
        h('rect', { x: 0, y: 0, width: 220, height: 170, fill: cielo }), h('circle', { cx: 180, cy: 36, r: 18, fill: luz < 300 ? '#f2f2e9' : '#ffd84a' }),
        h('rect', { x: 0, y: 130, width: 220, height: 40, fill: '#8d8a83' }), h('rect', { x: 52, y: 40, width: 6, height: 92, fill: SINK }), h('rect', { x: 52, y: 40, width: 46, height: 6, fill: SINK }),
        on ? h('polygon', { points: '84,52 120,130 48,130', fill: 'rgba(255,226,120,.55)' }) : null, h('circle', { cx: 92, cy: 52, r: 11, fill: on ? '#ffe27a' : '#9a9a9a', stroke: SINK, strokeWidth: 2 }),
        h('text', { x: 110, y: 160, textAnchor: 'middle', fontSize: 13, fontFamily: 'IBM Plex Mono', fontWeight: 700, fill: '#fff' }, on ? 'LÁMPARA ENCENDIDA' : 'LÁMPARA APAGADA'));
    }
    function Semaforo({ luz }) {
      const c = (k, col) => h('circle', { cx: 50, cy: 34 + k * 52, r: 20, fill: luz === k ? col : '#3a3a3a', stroke: '#111', strokeWidth: 2 });
      return h('svg', { viewBox: '0 0 100 180', style: { width: 'clamp(80px,7vw,120px)', height: 'auto', display: 'block' } }, h('rect', { x: 18, y: 6, width: 64, height: 160, rx: 10, fill: '#1c1c1c' }), c(0, '#3ad16b'), c(1, '#ffc531'), c(2, '#ff4b3e'));
    }
    function Puerta({ dist, ang }) {
      const ab = Math.max(0, Math.min(90, ang)) / 90, px = 30 + Math.min(200, dist) * 0.8;
      return h('svg', { viewBox: '0 0 260 170', style: { width: '100%', maxWidth: 300, height: 'auto', display: 'block' } },
        h('rect', { x: 0, y: 140, width: 260, height: 30, fill: '#cfc8b8' }), h('rect', { x: 196, y: 20, width: 56, height: 122, fill: '#e8e4da', stroke: SINK, strokeWidth: 2 }),
        h('rect', { x: 198 + ab * 46, y: 22, width: 52 - ab * 46, height: 118, fill: '#7a5a3a' }), h('rect', { x: 186, y: 26, width: 10, height: 10, fill: BLUE }), h('text', { x: 191, y: 16, textAnchor: 'middle', fontSize: 10, fontFamily: 'IBM Plex Mono', fontWeight: 700 }, 'US'),
        h('g', { transform: 'translate(' + Math.max(16, 200 - px) + ',0)' }, h('circle', { cx: 0, cy: 66, r: 12, fill: SINK }), h('rect', { x: -10, y: 80, width: 20, height: 42, fill: SINK }), h('rect', { x: -10, y: 122, width: 7, height: 18, fill: SINK }), h('rect', { x: 3, y: 122, width: 7, height: 18, fill: SINK })),
        h('text', { x: 130, y: 162, textAnchor: 'middle', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 700 }, 'distancia: ' + dist + ' cm · servo ' + Math.round(ang) + '°'));
    }
    function Alarma({ on, noche, mov }) {
      return h('svg', { viewBox: '0 0 240 150', style: { width: '100%', maxWidth: 280, height: 'auto', display: 'block' } },
        h('rect', { x: 0, y: 0, width: 240, height: 150, fill: noche ? '#1e2a40' : '#d9ecf7' }), h('rect', { x: 20, y: 30, width: 120, height: 100, fill: noche ? '#2c3a55' : '#f3efe6', stroke: SINK, strokeWidth: 2 }),
        h('text', { x: 80, y: 52, textAnchor: 'middle', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 700, fill: noche ? '#fff' : SINK }, 'LABORATORIO'),
        mov ? h('g', null, h('circle', { cx: 80, cy: 80, r: 9, fill: '#f0a726' }), h('rect', { x: 72, y: 90, width: 16, height: 30, fill: '#f0a726' })) : null,
        h('rect', { x: 170, y: 50, width: 40, height: 40, fill: on ? RED : '#888', stroke: SINK, strokeWidth: 2 }),
        on ? h('g', null, [0, 1].map(k => h('path', { key: k, d: 'M' + (216 + k * 8) + ' 52 Q' + (226 + k * 8) + ' 70 ' + (216 + k * 8) + ' 88', stroke: RED, strokeWidth: 4, fill: 'none' }))) : null,
        h('text', { x: 190, y: 112, textAnchor: 'middle', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 700, fill: noche ? '#fff' : SINK }, on ? '¡SUENA!' : 'silencio'));
    }

    // ---------- Pregunta en vivo ----------
    function Vivo(p, q, preg, opts, correcta) {
      const mia = p.mis && p.mis[q], res = p.res && p.res[q];
      const conteo = opts.map((o, i) => res ? Object.values(res).filter(v => v.r === String(i)).length : 0), tot = res ? Object.keys(res).length : 0;
      return Card({ borderColor: BLUE, gap: 14 }, Row({ justifyContent: 'space-between' }, K('Pregunta en vivo', BLUE), p.docente ? K(tot + ' parejas respondieron', BLUE) : mia != null ? K('Respuesta enviada ✓', OKC) : null),
        H2(preg), Say(p, preg),
        D({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 10 }, ...opts.map((o, i) => {
          const sel = mia === String(i), mostrar = p.docente && p.ver, pc = tot ? Math.round(conteo[i] * 100 / tot) : 0, esOk = correcta != null && i === correcta && (p.ver || mia != null);
          return h('button', { key: i, onClick: () => { if (!p.docente && mia == null) p.onResp(q, String(i), correcta == null ? true : i === correcta); }, style: { position: 'relative', overflow: 'hidden', textAlign: 'left', padding: '14px 16px', fontFamily: 'inherit', fontWeight: 600, fontSize: 'clamp(15px,1.25vw,20px)', background: CARD, border: '3px solid ' + (esOk ? OKC : sel ? INK : LINE), cursor: p.docente || mia != null ? 'default' : 'pointer', color: INK } },
            mostrar ? h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: pc + '%', background: esOk ? 'rgba(127,224,160,.22)' : 'rgba(110,168,255,.2)' } }) : null,
            h('div', { style: { position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 10 } }, h('span', null, o), mostrar ? h('span', { style: { fontFamily: MONO } }, conteo[i] + ' · ' + pc + '%') : sel ? h('span', null, '●') : null));
        })),
        !p.docente && mia != null && correcta != null ? T(mia === String(correcta) ? '¡Correcto! Esperen la explicación del docente.' : 'Respuesta enviada. Al final veremos juntos la correcta.', { color: MUTE, fontSize: 16 }) : null);
    }

    // ================= DIAPOSITIVAS =================
    // ===== 9no · Variables, constantes, tipos de datos y operadores =====
    const Code = (lines, st) => D(Object.assign({ background: '#070d12', color: '#e8f1f2', fontFamily: MONO, fontSize: 'clamp(14px,1.2vw,19px)', lineHeight: 1.6, padding: '14px 18px', overflowX: 'auto', whiteSpace: 'pre', border: '1px solid ' + LINE, borderRadius: 8 }, st || {}),
      ...lines.map((l, i) => { const parts = String(l).split('//'); return D({ display: 'flex', gap: 14, background: (st && st.hl === i) ? 'rgba(255,209,102,.18)' : 'transparent' }, h('span', { style: { color: '#6b7a83', minWidth: 20, textAlign: 'right', userSelect: 'none' } }, String(i + 1)), h('span', null, parts[0], parts.length > 1 ? h('span', { style: { color: '#7fe0a0' } }, '//' + parts.slice(1).join('//')) : null)); }));
    const Teo = (p, tit, lineas, ej, code) => Card({ borderColor: BLUE, background: 'rgba(110,168,255,.10)', gap: 10 }, D({ display: 'flex', gap: 16, alignItems: 'center' }, h(Icon, { k: ILUS[tit] || 'caja', s: 64, anim: true }), D({ display: 'flex', flexDirection: 'column', gap: 4 }, K('Aprende · 30 segundos', BLUE), H2(tit))), ...lineas.map((x, i) => D({ display: 'flex', gap: 10 }, D({ fontFamily: HEAD, color: BLUE, fontSize: 18 }, '›'), T(x))), code ? Code(code) : null, ej ? D({ borderTop: '2px solid #d5e1f7', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }, K('En la vida real', TEAL), T(ej)) : null, Say(p, tit + '. ' + lineas.join(' ') + (ej ? ' En la vida real: ' + ej : '')));
    const TeoToggle = (p, args) => { const [v, setV] = useState(!p.intentos); return v ? D({ display: 'flex', flexDirection: 'column', gap: 8 }, Teo(p, ...args), Btn('Ocultar teoría', () => setV(false), { bg: CARD, c: BLUE, bd: BLUE, fs: 15, pad: '8px 14px' })) : Btn('Ver la teoría (no resta puntos)', () => setV(true), { bg: CARD, c: BLUE, bd: BLUE, fs: 15, pad: '8px 14px' }); };
    function Caja({ tipo, nombre, valor, cte, flash }) {
      return D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 120 },
        D({ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: cte ? RED : BLUE, letterSpacing: '.08em' }, (cte ? 'const ' : '') + tipo),
        D({ width: 130, height: 86, border: '3px solid ' + (cte ? RED : BLUE), borderRadius: 8, color: INK, background: flash ? '#4a3d12' : '#0a1016', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 30, position: 'relative', transition: 'background .3s' }, String(valor), cte ? D({ position: 'absolute', right: 6, top: 4, fontFamily: MONO, fontSize: 11, color: RED, fontWeight: 700 }, 'FIJA') : null),
        D({ fontFamily: MONO, fontSize: 16, fontWeight: 700, background: BLUE, color: DARK, padding: '3px 10px' }, nombre));
    }
    function Ventilador({ on, temp }) {
      const [a, setA] = useState(0);
      useEffect(() => { if (!on) return; const t = setInterval(() => setA(x => (x + 24) % 360), 40); return () => clearInterval(t); }, [on]);
      const col = temp >= 30 ? '#e2553f' : temp >= 25 ? '#e7a03b' : '#3c8fd6';
      return h('svg', { viewBox: '0 0 220 170', style: { width: '100%', maxWidth: 260, height: 'auto', display: 'block' } },
        h('rect', { x: 0, y: 0, width: 220, height: 170, fill: '#eef1f2' }), h('rect', { x: 0, y: 140, width: 220, height: 30, fill: '#c9c3b6' }),
        h('rect', { x: 166, y: 30, width: 14, height: 100, rx: 7, fill: '#fff', stroke: SINK, strokeWidth: 2 }), h('rect', { x: 169, y: 130 - Math.max(4, Math.min(96, (temp - 10) * 3)), width: 8, height: Math.max(4, Math.min(96, (temp - 10) * 3)), fill: col }), h('circle', { cx: 173, cy: 134, r: 10, fill: col, stroke: SINK, strokeWidth: 2 }),
        h('text', { x: 173, y: 22, textAnchor: 'middle', fontSize: 14, fontWeight: 700, fill: SINK, fontFamily: 'monospace' }, temp + '°C'),
        h('rect', { x: 66, y: 98, width: 8, height: 44, fill: SINK }), h('rect', { x: 46, y: 140, width: 48, height: 6, fill: SINK }),
        h('g', { transform: 'translate(70,70) rotate(' + a + ')' }, ...[0, 120, 240].map(r => h('ellipse', { key: r, cx: 0, cy: -22, rx: 10, ry: 22, fill: on ? '#5fb3c9' : '#9aa5ab', transform: 'rotate(' + r + ')' })), h('circle', { r: 7, fill: SINK })),
        h('circle', { cx: 70, cy: 70, r: 46, fill: 'none', stroke: SINK, strokeWidth: 3 }));
    }
    // ===== FX 9no: neón, placa, monitor serial, escenas reales, íconos =====
    const GLOW = c => '0 0 0 1px ' + c + '44, 0 0 24px ' + c + '30';
    const NE = (c, w) => ({ filter: 'drop-shadow(0 0 ' + (w || 4) + 'px ' + c + ')' });
    function Icon({ k, s, anim }) {
      const z = s || 56, st = { width: z, height: z, display: 'block', overflow: 'visible' }, g = (c, ...ch) => h('g', { fill: 'none', stroke: c, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', style: NE(c, 3) }, ...ch);
      const A = n => anim ? { animation: n } : {};
      const m = {
        caja: () => g(BLUE, h('path', { d: 'M10 22 L32 12 L54 22 L54 46 L32 56 L10 46 Z' }), h('path', { d: 'M10 22 L32 32 L54 22 M32 32 L32 56' }), h('text', { x: 32, y: 10, textAnchor: 'middle', fontSize: 14, fill: BLUE, stroke: 'none', fontFamily: 'monospace', fontWeight: 700, style: A('c9float 1.6s ease-in-out infinite') }, '42')),
        candado: () => g(RED, h('rect', { x: 14, y: 28, width: 36, height: 26, rx: 4 }), h('path', { d: 'M22 28 V20 a10 10 0 0 1 20 0 V28', style: Object.assign({ transformOrigin: '42px 28px' }, A('c9lock 2.4s ease-in-out infinite')) }), h('circle', { cx: 32, cy: 40, r: 3 })),
        contador: () => g(TEAL, h('rect', { x: 8, y: 14, width: 48, height: 36, rx: 4 }), h('text', { x: 32, y: 40, textAnchor: 'middle', fontSize: 20, fill: TEAL, stroke: 'none', fontFamily: 'monospace', fontWeight: 700 }, '+1')),
        barras: () => g(AMB, ...[0, 1, 2].map(i => h('rect', { key: i, x: 8 + i * 17, y: 18, width: 14, height: 28, rx: 2 })), h('rect', { x: 8, y: 50, width: 8, height: 6, rx: 1, style: A('c9blink 1s steps(2) infinite') })),
        balanza: () => g(BLUE, h('path', { d: 'M32 12 V54 M20 54 H44' }), h('g', { style: Object.assign({ transformOrigin: '32px 16px' }, A('c9tilt 2.4s ease-in-out infinite')) }, h('path', { d: 'M10 16 H54 M10 16 L4 32 H18 Z M54 16 L48 32 H60 Z' }))),
        lupa: () => g(AMB, h('circle', { cx: 26, cy: 26, r: 15 }), h('path', { d: 'M37 37 L54 54' }), h('path', { d: 'M20 26 H32', style: A('c9blink 1.2s steps(2) infinite') })),
        puertas: () => g(AMB, h('rect', { x: 6, y: 14, width: 22, height: 40, rx: 2 }), h('rect', { x: 36, y: 14, width: 22, height: 40, rx: 2 }), h('text', { x: 32, y: 10, textAnchor: 'middle', fontSize: 12, fill: AMB, stroke: 'none', fontFamily: 'monospace', fontWeight: 700 }, '&& ||')),
        termo: () => g(RED, h('path', { d: 'M28 10 a4 4 0 0 1 8 0 V38 a10 10 0 1 1 -8 0 Z' }), h('circle', { cx: 32, cy: 46, r: 5, fill: RED, style: A('c9blink 1.4s ease-in-out infinite') })),
        lampara: () => g(AMB, h('path', { d: 'M20 30 a12 12 0 1 1 24 0 c0 6 -5 8 -5 14 H25 c0 -6 -5 -8 -5 -14 Z' }), h('path', { d: 'M26 50 H38 M28 56 H36' }), h('path', { d: 'M32 4 V0 M12 12 L9 9 M52 12 L55 9', style: A('c9blink 1s steps(2) infinite') })),
        pasos: () => g(TEAL, ...[0, 1, 2, 3].map(i => h('path', { key: i, d: 'M10 ' + (14 + i * 12) + ' H' + (30 + (i % 2) * 20), style: i === 1 ? { stroke: AMB } : {} })), h('path', { d: 'M4 26 l4 -2 v4 z', fill: AMB, stroke: AMB }))
      };
      return h('svg', { viewBox: '0 0 64 64', style: st }, (m[k] || m.caja)());
    }
    const ILUS = { 'Tipos de datos': 'caja', 'Variable o constante': 'candado', 'Actualizar una variable': 'contador', 'Operadores aritméticos': 'barras', 'Operadores relacionales': 'balanza', 'Errores comunes': 'lupa', 'Operadores lógicos': 'puertas', 'Seguir las variables': 'pasos' };
    function Placa({ pins, w }) {
      const PX = n => n[0] === 'A' ? { x: 168 + Number(n.slice(1)) * 18, y: 196, top: false } : { x: 290 - (Number(n.slice(1)) - 2) * 18, y: 70, top: true };
      return h('svg', { viewBox: '0 0 360 270', style: { width: '100%', maxWidth: w || 380, height: 'auto', display: 'block' } },
        h('rect', { x: 30, y: 58, width: 300, height: 150, rx: 12, fill: '#0b4f6c', stroke: '#5fd0e8', strokeWidth: 2, style: NE('#5fd0e8', 6) }),
        h('rect', { x: 18, y: 92, width: 34, height: 30, rx: 3, fill: '#9aa5ab' }), h('rect', { x: 18, y: 150, width: 26, height: 30, rx: 3, fill: '#222' }),
        h('rect', { x: 150, y: 120, width: 120, height: 30, rx: 3, fill: '#15191d', stroke: '#3a4b55' }), h('text', { x: 210, y: 140, textAnchor: 'middle', fontSize: 11, fill: '#9fb0ba', fontFamily: 'monospace' }, 'ATmega328P'),
        h('text', { x: 92, y: 140, textAnchor: 'middle', fontSize: 15, fontWeight: 700, fill: '#e8f1f2', fontFamily: 'sans-serif' }, 'ARDUINO'), h('text', { x: 92, y: 156, textAnchor: 'middle', fontSize: 11, fill: '#9fd8cf', fontFamily: 'monospace' }, 'UNO'),
        ...[...Array(12)].map((_, i) => h('rect', { key: 'd' + i, x: 286 - i * 18, y: 64, width: 8, height: 10, fill: '#111', stroke: '#555' })), ...[...Array(12)].map((_, i) => h('text', { key: 'dt' + i, x: 290 - i * 18, y: 88, textAnchor: 'middle', fontSize: 8, fill: '#cfe', fontFamily: 'monospace' }, String(i + 2))),
        ...[...Array(6)].map((_, i) => h('rect', { key: 'a' + i, x: 164 + i * 18, y: 192, width: 8, height: 10, fill: '#111', stroke: '#555' })), ...[...Array(6)].map((_, i) => h('text', { key: 'at' + i, x: 168 + i * 18, y: 186, textAnchor: 'middle', fontSize: 8, fill: '#cfe', fontFamily: 'monospace' }, 'A' + i)),
        h('circle', { cx: 300, cy: 100, r: 4, fill: (pins || []).some(p => p.on) ? '#7fe0a0' : '#2a4a3a', style: (pins || []).some(p => p.on) ? NE('#7fe0a0', 5) : {} }), h('text', { x: 300, y: 116, textAnchor: 'middle', fontSize: 7, fill: '#cfe', fontFamily: 'monospace' }, 'L'),
        ...(pins || []).map((p, i) => { const q = PX(p.pin), ey = q.top ? 22 : 248, ex = q.top ? 40 + i * 120 : 60 + i * 130, c = p.col || TEAL;
          return h('g', { key: 'w' + i }, h('path', { d: 'M' + (q.x) + ' ' + (q.top ? 64 : 202) + ' V' + (q.top ? 44 : 222) + ' H' + (ex + 40) + ' V' + ey, fill: 'none', stroke: p.on ? c : '#41525c', strokeWidth: 3, style: p.on ? Object.assign({ strokeDasharray: '6 5', animation: 'c9flow .6s linear infinite' }, NE(c, 4)) : {} }),
            h('rect', { x: ex, y: q.top ? 2 : 238, width: 80, height: 28, rx: 6, fill: '#0a1016', stroke: p.on ? c : '#41525c', strokeWidth: 2, style: p.on ? NE(c, 5) : {} }), h('text', { x: ex + 40, y: q.top ? 20 : 256, textAnchor: 'middle', fontSize: 10, fontWeight: 700, fill: p.on ? c : '#9fb0ba', fontFamily: 'monospace' }, p.name)); }));
    }
    function Serial({ lines, tit }) {
      return D({ background: '#04080b', border: '1px solid ' + TEAL, borderRadius: 8, boxShadow: GLOW(TEAL), display: 'flex', flexDirection: 'column', minWidth: 0 },
        D({ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid ' + LINE, fontFamily: MONO, fontSize: 12, color: MUTE, letterSpacing: '.08em' }, h('span', null, tit || 'MONITOR SERIAL'), h('span', null, '9600 baud')),
        D({ fontFamily: MONO, fontSize: 'clamp(13px,1.05vw,16px)', color: OKC, padding: '8px 12px', minHeight: 116, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2, textShadow: '0 0 6px rgba(127,224,160,.5)' },
          ...(lines || []).slice(-6).map((l, i, a) => D({ key: i + l, opacity: 0.45 + 0.55 * (i + 1) / a.length, whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'ellipsis' }, '> ' + l)), (lines || []).length ? null : D({ color: MUTE }, '> esperando datos…')));
    }
    function useTick(ms) { const [t, setT] = useState(0); useEffect(() => { const i = setInterval(() => setT(x => x + 1), ms); return () => clearInterval(i); }, []); return t; }
    function Aula({ on, temp }) {
      const t = useTick(70), a = on ? t * 26 : 0, calor = temp >= 28, col = temp >= 30 ? RED : temp >= 25 ? AMB : BLUE, fy = Math.max(6, Math.min(80, (temp - 10) * 2.7));
      const alumno = (x, k) => { const ab = calor && !on, sw = ab ? Math.sin(t / 2 + k) * 18 : 0;
        return h('g', { key: x }, h('rect', { x: x - 16, y: 150, width: 32, height: 26, rx: 4, fill: '#3a5160' }), h('circle', { cx: x, cy: 136, r: 11, fill: '#d9b48f' }), h('rect', { x: x - 13, y: 147, width: 26, height: 18, rx: 6, fill: ['#6ea8ff', '#ff8fd0', '#3fd0b8'][k] }),
          ab ? h('g', { transform: 'translate(' + (x + 16) + ',134) rotate(' + sw + ')' }, h('path', { d: 'M0 0 L14 -10 L16 6 Z', fill: '#f0a726' })) : null, ab ? h('circle', { cx: x - 8, cy: 126 + (t % 10), r: 2.4, fill: '#8fd3ff' }) : null); };
      return h('svg', { viewBox: '0 0 320 190', style: { width: '100%', maxWidth: 360, height: 'auto', display: 'block' } },
        h('rect', { width: 320, height: 190, fill: calor && !on ? '#2a1a14' : '#101b24' }), h('rect', { x: 0, y: 176, width: 320, height: 14, fill: '#26343e' }), h('rect', { x: 18, y: 18, width: 110, height: 60, rx: 3, fill: '#0d2a22', stroke: '#2f6b4d', strokeWidth: 3 }), h('text', { x: 73, y: 52, textAnchor: 'middle', fontSize: 13, fill: '#bfe8d0', fontFamily: 'monospace' }, 'if (t > LIMITE)'),
        h('g', { transform: 'translate(220,52)' }, h('circle', { r: 36, fill: 'none', stroke: on ? TEAL : '#41525c', strokeWidth: 3, style: on ? NE(TEAL, 6) : {} }), h('g', { transform: 'rotate(' + a + ')' }, ...[0, 120, 240].map(r => h('ellipse', { key: r, cx: 0, cy: -17, rx: 8, ry: 17, fill: on ? '#5fd0e8' : '#55636c', transform: 'rotate(' + r + ')' }))), h('circle', { r: 5, fill: '#e8f1f2' })),
        on ? h('path', { d: 'M196 96 Q220 ' + (110 + (t % 6)) + ' 244 96', stroke: '#8fe3ff', strokeWidth: 2, fill: 'none', opacity: 0.6 }) : null,
        h('rect', { x: 284, y: 20, width: 14, height: 90, rx: 7, fill: '#0a1016', stroke: col, strokeWidth: 2, style: NE(col, 4) }), h('rect', { x: 287, y: 106 - fy, width: 8, height: fy, rx: 4, fill: col }), h('circle', { cx: 291, cy: 116, r: 9, fill: col, style: NE(col, 6) }), h('text', { x: 291, y: 14, textAnchor: 'middle', fontSize: 12, fontWeight: 700, fill: col, fontFamily: 'monospace' }, temp + '°C'),
        alumno(60, 0), alumno(130, 1), alumno(200, 2));
    }
    function Pasillo({ on, luz, mov }) {
      const t = useTick(60), noche = luz < 300, px = mov ? 40 + ((t * 3) % 240) : 250;
      const cielo = noche ? '#070d1c' : luz < 600 ? '#4a3a52' : '#6aa8d8';
      return h('svg', { viewBox: '0 0 320 190', style: { width: '100%', maxWidth: 360, height: 'auto', display: 'block' } },
        h('rect', { width: 320, height: 190, fill: noche ? '#0b1218' : '#2a3a46' }), h('rect', { x: 230, y: 20, width: 70, height: 60, fill: cielo, stroke: '#41525c', strokeWidth: 3 }), noche ? h('circle', { cx: 278, cy: 40, r: 8, fill: '#e8f1f2' }) : h('circle', { cx: 278, cy: 40, r: 10, fill: '#ffd84a' }),
        h('path', { d: 'M0 150 L320 150 L320 190 L0 190 Z', fill: '#1a252d' }), ...[30, 110, 190].map(x => h('rect', { key: x, x, y: 70, width: 34, height: 80, fill: '#24323c', stroke: '#3a5160', strokeWidth: 2 })), ...[30, 110, 190].map(x => h('text', { key: 't' + x, x: x + 17, y: 64, textAnchor: 'middle', fontSize: 9, fill: '#9fb0ba', fontFamily: 'monospace' }, x === 30 ? 'LAB' : x === 110 ? '9NO' : '10MO')),
        on ? h('polygon', { points: '150,22 230,150 70,150', fill: 'rgba(255,214,102,.22)' }) : null, h('rect', { x: 130, y: 8, width: 40, height: 10, rx: 3, fill: '#41525c' }), h('ellipse', { cx: 150, cy: 22, rx: 18, ry: 6, fill: on ? '#ffe27a' : '#55636c', style: on ? NE('#ffd166', 10) : {} }),
        h('rect', { x: 8, y: 30, width: 14, height: 10, rx: 2, fill: mov ? '#ff7b72' : '#41525c', style: mov ? NE('#ff7b72', 5) : {} }), h('text', { x: 15, y: 54, textAnchor: 'middle', fontSize: 8, fill: '#9fb0ba', fontFamily: 'monospace' }, 'PIR'),
        mov ? h('g', { transform: 'translate(' + px + ',0)' }, h('circle', { cx: 0, cy: 104, r: 8, fill: on || !noche ? '#d9b48f' : '#3a4048' }), h('rect', { x: -7, y: 112, width: 14, height: 22, rx: 5, fill: on || !noche ? '#6ea8ff' : '#2a3442' }), h('path', { d: 'M-4 134 L' + (-6 + Math.sin(t / 2) * 5) + ' 150 M4 134 L' + (6 - Math.sin(t / 2) * 5) + ' 150', stroke: on || !noche ? '#e8f1f2' : '#3a4048', strokeWidth: 3 })) : null,
        !on && noche ? h('rect', { width: 320, height: 190, fill: 'rgba(0,0,0,.35)' }) : null);
    }
    const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g' };
    function Siete({ n, col }) {
      const s = String(n == null ? '--' : n).padStart(2, ' ').slice(-3), c = col || '#ff5d5d', W = 38;
      const seg = (k, x) => { const P = { a: [x + 6, 4, 26, 6], b: [x + 32, 8, 6, 26], c: [x + 32, 40, 6, 26], d: [x + 6, 66, 26, 6], e: [x, 40, 6, 26], f: [x, 8, 6, 26], g: [x + 6, 35, 26, 6] }[k]; return P; };
      return h('svg', { viewBox: '0 0 ' + (s.length * W + 8) + ' 76', style: { width: s.length * 54, height: 'auto', display: 'block', background: '#0a0505', borderRadius: 6, padding: 6 } }, ...s.split('').map((ch, i) => 'abcdefg'.split('').map(k => { const r = seg(k, 6 + i * W), lit = (SEG[ch] || '').includes(k); return h('rect', { key: i + k, x: r[0], y: r[1], width: r[2], height: r[3], rx: 2, fill: lit ? c : '#2a1414', style: lit ? NE(c, 4) : {} }); })));
    }
    function Barras({ a, b, op }) {
      if (op === '/' || op === '%') { const q = Math.trunc(a / b), r = a % b, show = Math.min(q, 12);
        return D({ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }, D({ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' },
          ...[...Array(show)].map((_, i) => D({ key: i, flex: '0 0 auto', width: Math.max(16, b / a * 260), height: 30, borderRadius: 4, background: op === '/' ? 'rgba(240,167,38,.25)' : '#1b2a33', border: '2px solid ' + (op === '/' ? AMB : '#41525c'), boxShadow: op === '/' ? GLOW(AMB) : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, color: INK }, String(b))),
          q > show ? D({ fontFamily: MONO, color: MUTE }, '…') : null, r ? D({ width: Math.max(12, r / a * 260), height: 30, borderRadius: 4, background: op === '%' ? 'rgba(255,123,114,.28)' : '#1b2a33', border: '2px dashed ' + (op === '%' ? RED : '#41525c'), boxShadow: op === '%' ? GLOW(RED) : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, color: INK }, String(r)) : null),
          T(op === '/' ? 'Caben ' + q + ' grupos completos de ' + b + ' → ' + a + ' / ' + b + ' = ' + q : 'Sobran ' + r + ' después de armar ' + q + ' grupos de ' + b + ' → ' + a + ' % ' + b + ' = ' + r, { fontSize: 16, color: op === '/' ? AMB : RED, fontWeight: 600 })); }
      const mx = Math.max(a + b, a, 1), bar = (v, c, lab, dash) => D({ width: Math.max(4, v / mx * 100) + '%', height: 26, borderRadius: 4, background: c + '33', border: '2px ' + (dash ? 'dashed ' : 'solid ') + c, display: 'flex', alignItems: 'center', paddingLeft: 8, fontFamily: MONO, fontSize: 12, color: INK, boxShadow: GLOW(c) }, lab);
      if (op === '*') { const r = Math.min(a, 12), c = Math.min(b, 12); return D({ display: 'flex', flexDirection: 'column', gap: 8 }, D({ display: 'grid', gridTemplateColumns: 'repeat(' + c + ',14px)', gap: 3 }, ...[...Array(r * c)].map((_, i) => D({ key: i, width: 14, height: 14, borderRadius: 3, background: TEAL, boxShadow: '0 0 6px ' + TEAL }))), T((a > 12 || b > 12 ? 'Vista parcial · ' : '') + a + ' filas × ' + b + ' columnas = ' + a * b, { fontSize: 16, color: TEAL, fontWeight: 600 })); }
      if (op === '+') return D({ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }, D({ display: 'flex', gap: 0, width: '100%' }, bar(a, BLUE, String(a)), bar(b, TEAL, String(b))), T(a + ' + ' + b + ' = ' + (a + b), { fontSize: 16, color: TEAL, fontWeight: 600 }));
      return D({ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }, D({ display: 'flex', width: '100%' }, bar(Math.max(0, a - b), BLUE, String(Math.max(0, a - b))), bar(Math.min(a, b), RED, '−' + b, true)), T(a + ' − ' + b + ' = ' + (a - b), { fontSize: 16, color: BLUE, fontWeight: 600 }));
    }
    function correrProg(lines) { const v = {}, ty = {}, out = [];
      lines.forEach(l => { const m = l.replace(/;.*$/, '').match(/^\s*(?:(const\s+)?(int|bool|float)\s+)?(\w+)\s*=\s*(.+)$/); if (!m) { out.push(Object.assign({}, v)); return; }
        if (m[2]) ty[m[3]] = m[2]; const ex = m[4].replace(/\b[a-zA-Z_]\w*\b/g, w => (w in v ? '(' + v[w] + ')' : w === 'true' || w === 'false' ? w : w));
        let r; try { r = Function('return (' + ex + ')')(); } catch (e) { r = '?'; } if (ty[m[3]] === 'int' && typeof r === 'number') r = Math.trunc(r); if (ty[m[3]] === 'bool') r = !!r; v[m[3]] = r; out.push(Object.assign({}, v)); });
      return out; }
    function Paso({ code }) {
      const tr = correrProg(code), [i, setI] = useState(-1), v = i >= 0 ? tr[i] : {};
      return D({ display: 'flex', flexDirection: 'column', gap: 10 }, Code(code, { hl: i }), Row({}, Btn(i < code.length - 1 ? '▶ Siguiente línea' : '✓ Fin', () => setI(Math.min(code.length - 1, i + 1)), { bg: TEAL, dis: i >= code.length - 1, fs: 15, pad: '8px 14px' }), Btn('Reiniciar', () => setI(-1), { bg: CARD, c: INK, fs: 15, pad: '8px 14px' })),
        Row({ gap: 12 }, ...Object.keys(v).map(k => h(Caja, { key: k, tipo: typeof v[k] === 'boolean' ? 'bool' : 'int', nombre: k, valor: String(v[k]), flash: true }))));
    }
    const S = [];
    S.push({ id: 'portada', t: 'Propósito', r: p => Grid(420,
      D({ display: 'flex', flexDirection: 'column', gap: 22 }, K('Robótica · 9no EGB · Unidad 1'), H1('La memoria del Arduino: variables y operadores'), T('Un sistema automático necesita recordar datos (la temperatura, cuántas personas entraron) y hacer cálculos y comparaciones con ellos. Hoy aprenderemos cómo lo hace.'), p.codigo ? Card({ background: '#0e2a26', color: '#fff', borderColor: TEAL }, K('Código de la sesión', TEAL), D({ fontFamily: HEAD, fontSize: 'clamp(40px,5vw,80px)', color: TEAL, letterSpacing: '.08em', textShadow: '0 0 24px rgba(63,208,184,.5)' }, p.codigo)) : null),
      Card({ gap: 16 }, K('Hoy aprenderemos a…', TEAL), T(['Usar ', B('variables, constantes y tipos de datos'), ' y aplicar ', B('operadores aritméticos, relacionales y lógicos'), ' para que un sistema tome decisiones.']), K('Sabremos que lo logramos si…', TEAL),
        ...['Elegimos el tipo de dato correcto para cada información.', 'Distinguimos una variable de una constante.', 'Calculamos y comparamos con operadores, y la simulación funciona.'].map((x, i) => D({ display: 'flex', gap: 12, borderTop: '2px solid ' + LINE, paddingTop: 12 }, D({ fontFamily: HEAD, fontSize: 22, color: TEAL }, String(i + 1)), T(x))), Say(p, 'Hoy aprenderemos a usar variables, constantes y tipos de datos, y a aplicar operadores para que un sistema tome decisiones.'))) });
    S.push({ id: 'acuerdos', t: 'Acuerdos y roles', r: p => D({ display: 'flex', flexDirection: 'column', gap: 22 }, H1('Cómo trabajamos hoy'),
      Grid(260, ...[['Mano arriba', 'Cuando el docente levanta la mano, silencio y manos fuera del teclado.'], ['Respeto', 'Escuchamos la idea del otro antes de decidir. Equivocarse es parte de programar.'], ['Cuidado', 'Computadoras, mouse y sillas quedan como los encontramos.']].map(([a, b]) => Card({}, H2(a), T(b)))),
      Card({ borderColor: TEAL }, K('Roles en la pareja · cambian en cada reto', TEAL), Grid(300, D({ display: 'flex', flexDirection: 'column', gap: 6 }, H2('Programador/a'), T('Maneja el mouse y arma la solución.')), D({ display: 'flex', flexDirection: 'column', gap: 6 }, H2('Revisor/a'), T('Lee la teoría y el enunciado, y revisa que la simulación funcione.'))))) });
    S.push({ id: 'motiv', t: 'Motivación', r: p => Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 18 }, K('Piensen un momento'), H1('¿Cómo sabe tu celular cuántos pasos caminaste hoy?'), T('Cada paso suma 1 a un número que el celular guarda en su memoria. A ese número con nombre lo llamamos variable. Sin variables, ninguna máquina podría recordar nada.')),
      Vivo(p, 'motiv', '¿Cuál de estos datos cambia mientras usas una app?', ['El nombre de la app', 'Tus pasos del día', 'El número de días de una semana', 'La marca del celular'], 1)) });
    function Memoria(p) {
      const [t, setT] = useState(24), [n, setN] = useState(0), [msg, setMsg] = useState(''), [fl, setFl] = useState('');
      const flash = k => { setFl(k); setTimeout(() => setFl(''), 350); };
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción · variables y constantes'), H1('Una variable es una caja con nombre'), T(['La caja tiene un ', B('tipo'), ' (qué guarda), un ', B('nombre'), ' y un ', B('valor'), '. Una ', B('constante'), ' es una caja con candado: su valor no cambia.']),
        Code(['const int LIMITE = 30;   // constante: no cambia', 'int temperatura = ' + t + ';  // variable: cambia', 'int visitantes = ' + n + ';', 'visitantes = visitantes + 1;']),
        Say(p, 'Una variable es una caja con nombre. Tiene un tipo, un nombre y un valor. Una constante es una caja con candado: su valor no cambia.')),
        Card({ gap: 18, alignItems: 'center' }, K('Prueben: cambien los valores'), Row({ justifyContent: 'center', gap: 22 }, h(Caja, { tipo: 'int', nombre: 'LIMITE', valor: 30, cte: true, flash: fl === 'L' }), h(Caja, { tipo: 'int', nombre: 'temperatura', valor: t, flash: fl === 't' }), h(Caja, { tipo: 'int', nombre: 'visitantes', valor: n, flash: fl === 'n' })),
          D({ width: '100%' }, Slider('Sensor de temperatura', t, 10, 40, v => { setT(v); flash('t'); }, ' °C')),
          Row({}, Btn('+ Entra una persona', () => { setN(n + 1); flash('n'); }, { bg: TEAL }), Btn('Intentar cambiar LIMITE', () => { setMsg('Error: LIMITE es una constante. El programa no la puede cambiar mientras funciona.'); flash('L'); }, { bg: CARD, c: RED, bd: RED }), Btn('Reiniciar', () => { setN(0); setMsg(''); }, { bg: CARD, c: INK })),
          msg ? T(msg, { color: RED, fontWeight: 600 }) : null, Row({ justifyContent: 'center', gap: 16, width: '100%' }, h(Siete, { n, col: TEAL }), D({ flex: 1, minWidth: 220 }, Serial({ lines: ['LIMITE = 30', 'temperatura = ' + t + ' C', 'visitantes = ' + n].concat(msg ? ['error: assignment of read-only variable LIMITE'] : []) })))));
    }
    S.push({ id: 'memoria', t: 'Variables y constantes', r: p => h(Memoria, p) });
    const TIPOS = [['int', 'Números enteros', '32 estudiantes · pin 13 · 2026', BLUE], ['float', 'Números con decimales', '23.5 °C · 1.75 m', TEAL], ['bool', 'Verdadero o falso', '¿puerta abierta? true', AMB], ['char', 'Una sola letra', "paralelo 'B'", RED], ['String', 'Texto', '"Bienvenidos"', INK]];
    S.push({ id: 'tipos', t: 'Tipos de datos', r: p => D({ display: 'flex', flexDirection: 'column', gap: 18 }, K('Construcción · tipos de datos'), H1('Cada caja guarda un tipo de dato'), Say(p, 'Cada caja guarda un tipo de dato. int para enteros, float para decimales, bool para verdadero o falso, char para una letra y String para texto.'),
      Grid(200, ...TIPOS.map(([k, d, e, c]) => Card({ borderColor: c, gap: 6 }, D({ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: c }, k), T(d, { fontWeight: 700 }), T(e, { color: MUTE, fontSize: 16 })))),
      Vivo(p, 'tipos', '¿Qué tipo usarían para guardar la temperatura 23.5 °C?', ['int', 'float', 'bool', 'char'], 1)) });
    function Calc(p) {
      const [a, setA] = useState(150), [b, setB] = useState(60), [op, setOp] = useState('/');
      const r = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? Math.trunc(a / b) : a % b;
      const ej = { '+': 'Sumar los estudiantes de dos paralelos.', '-': 'Cuántos asientos quedan libres.', '*': 'Área del aula: largo × ancho.', '/': 'Con int, la división quita los decimales: 150 / 60 = 2 minutos completos.', '%': 'El resto de la división: 150 % 60 = 30 segundos que sobran.' }[op];
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción · operadores aritméticos'), H1('El Arduino también calcula'), T(['Operadores: ', B('+  −  *  /  %'), '. El % da el ', B('resto'), ' de una división. Y con int, la división ', B('quita los decimales'), '.']),
        Code(['int a = ' + a + ';', 'int b = ' + b + ';', 'int r = a ' + op + ' b;   // r = ' + r]), Card({ borderColor: TEAL, gap: 4 }, K('Ejemplo real', TEAL), T(ej)), Say(p, 'El Arduino calcula con más, menos, por, dividido y módulo. El módulo da el resto. Con enteros, la división quita los decimales.')),
        Card({ gap: 16 }, K('Prueben la calculadora'), Slider('a', a, 0, 200, setA), Slider('b', b, 1, 100, setB), Row({}, ...['+', '-', '*', '/', '%'].map(o => Chip(o, op === o, () => setOp(o), TEAL))),
          D({ fontFamily: HEAD, fontSize: 'clamp(30px,3.6vw,58px)', textAlign: 'center', padding: 10, border: '2px solid ' + AMB, borderRadius: 10, boxShadow: GLOW(AMB), color: AMB, textShadow: '0 0 16px ' + AMB + '88' }, a + ' ' + op + ' ' + b + ' = ' + r), h(Barras, { a, b, op })));
    }
    S.push({ id: 'arit', t: 'Operadores aritméticos', r: p => h(Calc, p) });
    function Relac(p) {
      const [t, setT] = useState(26), [op, setOp] = useState('>'), L = 28;
      const r = op === '>' ? t > L : op === '<' ? t < L : op === '>=' ? t >= L : op === '<=' ? t <= L : op === '==' ? t === L : t !== L;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción · operadores relacionales'), H1('Comparar para decidir'), T(['Un operador relacional compara dos valores y responde ', B('true'), ' (verdadero) o ', B('false'), ' (falso). Es la pregunta del rombo del diagrama de flujo.']),
        Code(['const int LIMITE = 28;', 'int temperatura = ' + t + ';', 'if (temperatura ' + op + ' LIMITE) {', '  encender(VENTILADOR);', '}']), Row({}, ...['>', '<', '>=', '<=', '==', '!='].map(o => Chip(o, op === o, () => setOp(o), BLUE))),
        T(['¡Ojo! ', B('='), ' guarda un valor; ', B('=='), ' compara.'], { color: RED }), Say(p, 'Un operador relacional compara dos valores y responde verdadero o falso. Ojo: un igual guarda un valor, doble igual compara.')),
        Card({ gap: 14, alignItems: 'center' }, K('Aula del 3.er piso'), h(Aula, { on: r, temp: t }), D({ width: '100%' }, Slider('Temperatura del aula', t, 15, 38, setT, ' °C')),
          D({ fontFamily: HEAD, fontSize: 'clamp(22px,2.2vw,36px)', color: r ? OKC : RED }, t + ' ' + op + ' 28 → ' + (r ? 'true' : 'false')), h(Placa, { pins: [{ pin: 'A0', on: true, name: 'TEMP ' + t, col: BLUE }, { pin: 'D9', on: r, name: 'VENTILADOR', col: TEAL }], w: 340 })));
    }
    S.push({ id: 'relac', t: 'Operadores relacionales', r: p => h(Relac, p) });
    function Logic(p) {
      const [luz, setLuz] = useState(200), [mov, setMov] = useState(true), [op, setOp] = useState('&&');
      const c1 = luz < 300, c2 = mov, r = op === '&&' ? c1 && c2 : c1 || c2;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción · operadores lógicos'), H1('Unir dos condiciones'), T([B('&&'), ' (Y): las dos deben cumplirse. ', B('||'), ' (O): basta con una. ', B('!'), ' (NO): invierte la respuesta.']),
        Code(['if (luz < 300 ' + op + ' movimiento == HIGH) {', '  encender(LAMPARA);', '}']), Row({}, Chip('&&  (Y)', op === '&&', () => setOp('&&'), AMB), Chip('||  (O)', op === '||', () => setOp('||'), AMB)),
        Card({ gap: 6 }, T('luz < 300  →  ' + c1), T('movimiento  →  ' + c2), T(B('resultado  →  ' + r))), Say(p, 'Y: las dos condiciones deben cumplirse. O: basta con una. NO: invierte la respuesta.')),
        Card({ gap: 14, alignItems: 'center' }, K('Pasillo del colegio'), h(Pasillo, { on: r, luz, mov }), D({ width: '100%' }, Slider('Sensor de luz (0 noche · 1023 día)', luz, 0, 1023, setLuz)), Row({}, Chip(mov ? 'Hay movimiento' : 'Sin movimiento', mov, () => setMov(!mov), TEAL)),
          T(op === '||' && r && !(c1 && c2) ? 'Con || la lámpara se enciende de día o sin nadie: ¡desperdicia energía!' : op === '&&' && r ? 'Solo se enciende de noche y cuando alguien pasa. ¡Ahorro de energía!' : '', { color: MUTE, fontSize: 16 }), h(Placa, { pins: [{ pin: 'A0', on: true, name: 'LDR ' + luz, col: AMB }, { pin: 'D2', on: mov, name: 'PIR', col: RED }, { pin: 'D13', on: r, name: 'LAMPARA', col: '#ffd166' }], w: 340 })));
    }
    S.push({ id: 'logic', t: 'Operadores lógicos', r: p => h(Logic, p) });
    function Rompe(p) {
      const [eq, setEq] = useState(true), [t, setT] = useState(24), tt = eq ? t : 30, on = eq ? t === 30 : true;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Rompe el código', RED), H1('Un solo símbolo lo cambia todo'), T('Cambien == por = y observen qué pasa con el ventilador y con el monitor serial.'),
        Code(['int temperatura = leerSensor();', 'if (temperatura ' + (eq ? '==' : '=') + ' 30) {', '  encender(VENTILADOR);', '}', 'Serial.println(temperatura);'], { hl: 1 }),
        Row({}, Chip('==  comparar', eq, () => setEq(true), OKC), Chip('=  guardar', !eq, () => setEq(false), RED)),
        T(eq ? 'Con == solo compara: el ventilador se enciende únicamente cuando el sensor marca 30 °C.' : 'Con = se GUARDA 30 en temperatura: se pierde el dato del sensor y el ventilador queda siempre encendido.', { color: eq ? OKC : RED, fontWeight: 600 }), Say(p, 'Un solo símbolo lo cambia todo. Doble igual compara. Un igual guarda el valor y se pierde el dato del sensor.')),
        Card({ gap: 12, alignItems: 'center', borderColor: eq ? TEAL : RED }, h(Aula, { on, temp: tt }), D({ width: '100%' }, Slider('Temperatura real del sensor', t, 15, 38, setT, ' °C')), D({ width: '100%' }, Serial({ lines: ['sensor: ' + t + ' C', 'temperatura = ' + tt, on ? 'VENTILADOR: ON' : 'VENTILADOR: OFF'] }))));
    }
    S.push({ id: 'rompe', t: 'Rompe el código', r: p => h(Rompe, p) });
    function Traza(p) {
      const prog = [['int puntos = 10;', { puntos: 10 }], ['int bonus = 5;', { puntos: 10, bonus: 5 }], ['puntos = puntos + bonus;', { puntos: 15, bonus: 5 }], ['bonus = puntos % 4;', { puntos: 15, bonus: 3 }], ['bool gana = puntos > 12;', { puntos: 15, bonus: 3, gana: 'true' }]];
      const [i, setI] = useState(-1), v = i >= 0 ? prog[i][1] : {};
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Ejercicio resuelto · paso a paso'), H1('Seguir las variables como el Arduino'), T('El Arduino ejecuta una línea a la vez, de arriba hacia abajo. Después de cada línea, revisamos qué valor tiene cada caja.'), Code(prog.map(x => x[0]), { hl: i }),
        Row({}, Btn(i < prog.length - 1 ? '▶ Siguiente línea' : '✓ Terminado', () => setI(Math.min(prog.length - 1, i + 1)), { bg: TEAL, dis: i >= prog.length - 1 }), Btn('Reiniciar', () => setI(-1), { bg: CARD, c: INK }))),
        Card({ gap: 16, alignItems: 'center' }, K(i < 0 ? 'Pulsen «Siguiente línea»' : 'Después de la línea ' + (i + 1)), Row({ justifyContent: 'center', gap: 18 }, ...['puntos', 'bonus', 'gana'].filter(k => v[k] != null).map(k => h(Caja, { key: k, tipo: k === 'gana' ? 'bool' : 'int', nombre: k, valor: v[k], flash: true }))),
          i === 3 ? T('15 % 4 = 3, porque 15 = 4 × 3 + 3. El resto es 3.', { color: TEAL, fontWeight: 600 }) : null, i === 4 ? T('15 > 12 es verdadero: gana = true.', { color: TEAL, fontWeight: 600 }) : null));
    }
    S.push({ id: 'resuelto', t: 'Ejercicio resuelto', r: p => h(Traza, p) });
    S.push({ id: 'previa', t: 'Comprobación', r: p => Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Antes de los retos'), H1('¿Qué valor queda en x?'), Code(['int x = 17;', 'x = x / 5;'])),
      Vivo(p, 'previa', 'Después de la línea 2, x vale…', ['3.4', '3', '2', '85'], 1)) });
    function Relampago(p) {
      const [s, setS] = useState(30); useEffect(() => { const i = setInterval(() => setS(x => Math.max(0, x - 1)), 1000); return () => clearInterval(i); }, []);
      const c = s > 10 ? AMB : RED;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Reto relámpago · 30 segundos', AMB), H1('¿Suena la alarma del laboratorio?'), Code(['int luz = 120;', 'bool puertaAbierta = false;', 'if (luz < 300 || puertaAbierta) {', '  sonar(ALARMA);', '}']),
        D({ fontFamily: HEAD, fontSize: 'clamp(48px,6vw,96px)', color: c, textShadow: '0 0 26px ' + c, lineHeight: 1 }, s ? s + ' s' : '¡Tiempo!')),
        Vivo(p, 'relampago', 'La alarma…', ['Suena', 'No suena'], 0));
    }
    S.push({ id: 'relampago', t: 'Reto relámpago', r: p => h(Relampago, p) });
    S.push({ id: 'retos', t: 'Modo reto', r: p => D({ display: 'flex', flexDirection: 'column', gap: 20 }, K('Ahora ustedes'), H1('Modo reto: 8 retos, completen 6'), T('Cada reto empieza con una teoría corta y un ejemplo real. Pueden elegir el orden. Si se traban, salgan y prueben otro. La pista resta 1 punto; la teoría no resta nada.'),
      Grid(240, ...[['Nivel 1', 'Tipos de datos · Variable o constante · Contador de visitantes'], ['Nivel 2', 'Calcular con operadores · Ventilador del aula · Detective de errores'], ['Nivel 3', 'Lámpara inteligente · ¿Qué valor queda?']].map(([a, b]) => Card({}, H2(a), T(b))))) });

    // ---------- RETOS ----------
    function Reto(p, body, nombre, enun, teo) { return D({ display: 'flex', flexDirection: 'column', gap: 16 }, Row({ justifyContent: 'space-between' }, K('Reto · ' + nombre, TEAL), K('Intentos ' + (p.intentos || 0), MUTE)), H1(enun.t, { fontSize: 'clamp(26px,2.8vw,46px)' }), T(enun.d), Say(p, enun.t + '. ' + enun.d), teo ? h(TeoBox, { p, a: teo }) : null, body); }
    function TeoBox({ p, a }) { return TeoToggle(p, a); }
    const ayuda = (p, txt) => p.verPista ? Card({ borderColor: AMB, background: 'rgba(240,167,38,.12)' }, K('Pista', AMB), T(txt)) : Btn('Ver una pista (−1 punto)', p.pedirPista, { bg: CARD, c: AMB, bd: AMB });
    const DATOS = [['La temperatura del aula: 23.5 °C', 'float'], ['El número de estudiantes: 32', 'int'], ['¿La puerta está abierta?', 'bool'], ["La letra del paralelo: 'B'", 'char'], ['El mensaje de la pantalla: "Bienvenidos"', 'String'], ['El pin del LED: 13', 'int'], ['La estatura: 1.62 m', 'float'], ['¿Hay movimiento en el pasillo?', 'bool']];
    function RTipos(p) {
      const items = p.adaptado ? DATOS.filter(x => x[1] === 'int' || x[1] === 'bool') : DATOS, opts = p.adaptado ? ['int', 'bool'] : ['int', 'float', 'bool', 'char', 'String'];
      const COL = { int: BLUE, float: TEAL, bool: AMB, char: RED, String: '#ff8fd0' };
      const [r, setR] = useState({}), [sel, setSel] = useState(null), [over, setOver] = useState(null), listo = items.every((_, i) => r[i]);
      const poner = (i, o) => { setR(Object.assign({}, r, { [i]: o })); setSel(null); };
      const ficha = i => h('div', { key: 'f' + i, draggable: true, onDragStart: e => { try { e.dataTransfer.setData('text/plain', String(i)); } catch (x) {} setSel(i); }, onClick: e => { e.stopPropagation(); setSel(sel === i ? null : i); }, style: { padding: '10px 14px', borderRadius: 8, background: sel === i ? '#4a3d12' : '#0a1016', border: '2px solid ' + (sel === i ? AMB : r[i] ? COL[r[i]] : LINE), color: INK, fontWeight: 600, fontSize: 'clamp(14px,1.15vw,18px)', cursor: 'grab', boxShadow: r[i] ? GLOW(COL[r[i]]) : 'none', userSelect: 'none' } }, items[i][0]);
      const libres = items.map((_, i) => i).filter(i => !r[i]);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, T('Arrastren cada dato a su caja. También pueden tocar el dato y luego tocar la caja.', { color: MUTE, fontSize: 16 }),
        Card({ gap: 10 }, K('Datos sin ubicar · ' + libres.length), Row({}, ...libres.map(ficha), libres.length ? null : T('¡Todos ubicados! Ahora comprueben.', { color: OKC, fontWeight: 600 }))),
        Grid(200, ...opts.map(o => h('div', { key: o, onDragOver: e => { e.preventDefault(); if (over !== o) setOver(o); }, onDragLeave: () => setOver(null), onDrop: e => { e.preventDefault(); setOver(null); let v = ''; try { v = e.dataTransfer.getData('text/plain'); } catch (x) {} const i = v === '' ? sel : Number(v); if (i != null && !isNaN(i)) poner(i, o); }, onClick: () => { if (sel != null) poner(sel, o); },
          style: { minHeight: 150, borderRadius: 12, border: '2px ' + (over === o ? 'solid ' : 'dashed ') + COL[o], background: over === o ? COL[o] + '22' : '#0d1820', boxShadow: GLOW(COL[o]), padding: 12, display: 'flex', flexDirection: 'column', gap: 8, cursor: sel != null ? 'pointer' : 'default' } },
          D({ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: COL[o], textShadow: '0 0 10px ' + COL[o] }, o), ...items.map((_, i) => i).filter(i => r[i] === o).map(ficha)))),
        Row({}, Btn('Comprobar', () => { const mal = items.filter((x, i) => r[i] !== x[1]); p.check(!mal.length, !mal.length ? '¡Todos correctos! Elegir bien el tipo ahorra memoria y evita errores.' : 'Revisen: «' + mal[0][0] + '». ' + (mal[0][1] === 'float' ? 'Tiene decimales.' : mal[0][1] === 'bool' ? 'Solo puede ser sí o no.' : mal[0][1] === 'char' ? 'Es una sola letra.' : mal[0][1] === 'String' ? 'Es un texto.' : 'Es un número entero.'), 'tipos'); }, { dis: !listo, bg: TEAL }), Btn('Reiniciar', () => { setR({}); setSel(null); }, { bg: CARD, c: INK }), ayuda(p, 'Si tiene punto decimal: float. Si es sí o no: bool. Si es una sola letra: char. Si es un texto: String.'))),
        'Tipos de datos', { t: '¿En qué caja va cada dato?', d: 'Arrastren cada información del sistema del colegio a la caja del tipo de dato correcto.' }, ['Tipos de datos', ['int guarda enteros, float guarda decimales.', 'bool guarda true o false.', "char guarda una letra entre comillas simples ('B'); String, un texto entre comillas dobles."], 'El celular guarda tu nivel de batería como int (85 %) y si está cargando como bool (true).']);
    }
    const VC = [['El límite de temperatura del colegio: 28 °C', 'c'], ['La temperatura que mide el sensor', 'v'], ['El pin donde está conectado el LED', 'c'], ['Cuántas personas entraron al laboratorio', 'v'], ['El tiempo que pasó desde que se encendió', 'v'], ['La cantidad de computadoras del laboratorio: 20', 'c']];
    function RConst(p) {
      const items = p.adaptado ? VC.slice(0, 4) : VC, [r, setR] = useState({}), listo = items.every((_, i) => r[i]);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, Grid(300, ...items.map(([t], i) => Card({ gap: 10 }, T(t, { fontWeight: 700 }), Row({}, Chip('Variable', r[i] === 'v', () => setR(Object.assign({}, r, { [i]: 'v' })), BLUE), Chip('Constante (const)', r[i] === 'c', () => setR(Object.assign({}, r, { [i]: 'c' })), RED))))),
        Row({}, Btn('Comprobar', () => { const mal = items.filter((x, i) => r[i] !== x[1]); p.check(!mal.length, !mal.length ? 'Correcto: lo que el sistema mide o cuenta cambia; lo que el programador fija no cambia.' : '«' + mal[0][0] + '»: ' + (mal[0][1] === 'c' ? 'mientras el sistema funciona, este valor no cambia: es constante.' : 'este valor cambia mientras el sistema funciona: es variable.'), 'const'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Pregúntense: mientras el sistema funciona, ¿este valor puede cambiar solo?'))),
        'Variable o constante', { t: '¿Cambia o no cambia?', d: 'Decidan si cada dato debe ser una variable o una constante.' }, ['Variable o constante', ['Una variable cambia mientras el programa funciona.', 'Una constante (const) se fija una vez y el programa no la puede cambiar.', 'Usar const evita que un error cambie un valor importante.'], 'El precio de un producto en la tienda del colegio es fijo (constante); lo que vendieron hoy cambia (variable).']);
    }
    function RContador(p) {
      const meta = p.adaptado ? 3 : 7, [ini, setIni] = useState(''), [inc, setInc] = useState(''), [n, setN] = useState(null), [log, setLog] = useState([]), [vis, setVis] = useState(0), tmr = useRef(null);
      useEffect(() => () => clearTimeout(tmr.current), []);
      const correr = () => { let v = ini === '0' ? 0 : ini === '1' ? 1 : 10, l = []; for (let k = 0; k < meta; k++) { v = inc === '+1' ? v + 1 : inc === '=1' ? 1 : inc === '-1' ? v - 1 : v + 2; l.push(v); } setN(v); setLog(l); setVis(0); clearTimeout(tmr.current); let q = 0; const st = () => { q++; setVis(q); if (q < l.length) tmr.current = setTimeout(st, 420); }; tmr.current = setTimeout(st, 300);
        const ok = ini === '0' && inc === '+1'; p.check(ok, ok ? 'Entraron ' + meta + ' personas y el contador marca ' + meta + '. visitantes = visitantes + 1 suma uno al valor que ya tenía.' : ini !== '0' ? 'El contador empezó en ' + (ini === '1' ? 1 : 10) + ', no en 0. Antes de que entre nadie, debe valer 0.' : inc === '=1' ? 'visitantes = 1 borra el valor anterior: el contador siempre muestra 1.' : 'Ese cambio no cuenta de uno en uno.', 'contador'); };
      return Reto(p, Grid(300, Card({ gap: 12 }, K('Completen el programa'), Code(['int visitantes = ' + (ini || '?') + ';', 'void loop() {', '  if (sensorPuerta == HIGH) {', '    visitantes = ' + (inc === '+1' ? 'visitantes + 1' : inc === '-1' ? 'visitantes - 1' : inc === '=1' ? '1' : inc === '+2' ? 'visitantes + 2' : '?') + ';', '  }', '}']),
        K('Valor inicial'), Row({}, ...['0', '1', '10'].map(o => Chip(o, ini === o, () => setIni(o), BLUE))), K('Cuando entra alguien'), Row({}, ...[['+1', 'visitantes + 1'], ['=1', '1'], ['-1', 'visitantes - 1'], ['+2', 'visitantes + 2']].map(([k, t]) => Chip(t, inc === k, () => setInc(k), BLUE))),
        Row({}, Btn('▶ Simular ' + meta + ' personas', correr, { dis: !ini || !inc, bg: TEAL })), ayuda(p, 'Al inicio no ha entrado nadie. Y cada persona debe sumar uno a lo que ya había.')),
        Card({ gap: 12, alignItems: 'center' }, K('Puerta del laboratorio · sensor y pantalla'), D({ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }, h('div', { key: 'b' + vis, style: { width: 90, height: 120, border: '3px solid ' + LINE, borderRadius: 6, position: 'relative', background: '#0a1016' } }, D({ position: 'absolute', left: 0, right: 0, top: 58, height: 3, background: RED, boxShadow: '0 0 10px ' + RED, animation: vis ? 'c9blink .4s steps(2) 2' : 'none' }), D({ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 11, color: MUTE }, 'LAB')), h(Siete, { n: vis ? log[vis - 1] : (ini ? Number(ini) : null), col: '#ff5d5d' })), D({ width: '100%' }, Serial({ lines: log.slice(0, vis).map((v, i) => 'persona ' + (i + 1) + ' -> visitantes = ' + v) })))),
        'Contador', { t: 'Contador de visitantes del laboratorio', d: 'Programen el contador para que cuente bien a las ' + meta + ' personas que entran.' }, ['Actualizar una variable', ['Una variable se puede usar para calcular su propio valor nuevo.', 'visitantes = visitantes + 1 significa: toma lo que hay, súmale 1 y guárdalo otra vez.', 'Un contador siempre empieza en 0.'], 'Los torniquetes del estadio cuentan a cada persona que entra de esta manera.']);
    }
    const ARIT = [['El riego dura 150 segundos. ¿Cuántos minutos completos son?', 150, 60, 2, '/'], ['¿Cuántos segundos sobran después de esos minutos?', 150, 60, 30, '%'], ['El aula mide 8 m de largo y 6 m de ancho. ¿Cuál es su área?', 8, 6, 48, '*'], ['Hay 30 asientos y 24 estudiantes. ¿Cuántos asientos quedan libres?', 30, 24, 6, '-'], ['Un paralelo tiene 28 estudiantes y otro 27. ¿Cuántos son en total?', 28, 27, 55, '+'], ['El LED parpadea 3 veces por segundo durante 20 segundos. ¿Cuántos parpadeos?', 3, 20, 60, '*']];
    const calc = (a, b, o) => o === '+' ? a + b : o === '-' ? a - b : o === '*' ? a * b : o === '/' ? Math.trunc(a / b) : o === '%' ? a % b : null;
    function RArit(p) {
      const items = p.adaptado ? ARIT.filter(x => x[4] === '+' || x[4] === '-' || x[4] === '*').slice(0, 3) : ARIT.slice(0, 5), [r, setR] = useState({}), listo = items.every((_, i) => r[i]);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, Grid(320, ...items.map(([t, a, b, res], i) => { const v = r[i] ? calc(a, b, r[i]) : null; return Card({ gap: 10, borderColor: v == null ? INK : v === res ? OKC : RED }, T(t, { fontWeight: 700 }), Row({}, ...['+', '-', '*', '/', '%'].map(o => Chip(o, r[i] === o, () => setR(Object.assign({}, r, { [i]: o })), TEAL))),
        Code(['int r = ' + a + ' ' + (r[i] || '?') + ' ' + b + ';   // r = ' + (v == null ? '?' : v)]), r[i] ? h(Barras, { a, b, op: r[i] }) : null, v != null ? T(v === res ? '✓ Da ' + res + ', ¡tiene sentido!' : '✗ Da ' + v + '. ¿Tiene sentido para el problema?', { color: v === res ? OKC : RED, fontWeight: 600 }) : null); })),
        Row({}, Btn('Comprobar', () => { const mal = items.filter((x, i) => r[i] !== x[4]); p.check(!mal.length, !mal.length ? '¡Perfecto! Elegir el operador correcto es traducir el problema a código.' : 'Revisen: «' + mal[0][0] + '». El resultado debería ser ' + mal[0][3] + '.', 'arit'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Para los minutos completos se divide (/). Para lo que sobra se usa el resto (%).'))),
        'Operadores', { t: 'Calcular con operadores', d: 'Elijan el operador que resuelve cada problema. El resultado aparece en vivo.' }, ['Operadores aritméticos', ['+ suma, − resta, * multiplica, / divide, % da el resto.', 'Con int, 7 / 2 da 3: se pierden los decimales.', '7 % 2 da 1, porque 7 = 2 × 3 + 1.'], 'Un reloj digital usa / y % para pasar de segundos a minutos y segundos.']);
    }
    function RVent(p) {
      const [op, setOp] = useState(p.adaptado ? '>' : ''), [um, setUm] = useState(p.adaptado ? 28 : 20), [t, setT] = useState(24), [run, setRun] = useState(false), [sl, setSl] = useState([]);
      const cond = v => op === '>' ? v > um : op === '<' ? v < um : op === '==' ? v === um : false;
      const probar = () => { const casos = [[22, false], [26, false], [29, true], [34, true]]; setRun(true); setSl([]); let i = 0;
        const anim = () => { if (i < casos.length) { const cv = casos[i][0]; setT(cv); setSl(x => x.concat(['temperatura = ' + cv + ' -> ' + (cond(cv) ? 'VENTILADOR ON' : 'VENTILADOR OFF')])); i++; setTimeout(anim, 700); } else { setRun(false); const mal = casos.filter(([v, e]) => cond(v) !== e);
          p.check(!mal.length, !mal.length ? 'El ventilador se enciende a 29 °C y 34 °C, y se queda apagado a 22 °C y 26 °C.' : op === '<' ? 'Con < el ventilador se enciende cuando hace frío. ¿Qué comparación necesitan?' : op === '==' ? 'Con == solo se enciende a una temperatura exacta. Con calor de 34 °C quedaría apagado.' : 'El umbral no está bien: con ' + mal[0][0] + ' °C el ventilador ' + (mal[0][1] ? 'debería encenderse.' : 'no debería encenderse.'), 'vent'); } };
        anim(); };
      return Reto(p, Grid(300, Card({ gap: 12 }, K('Programen el ventilador'), Code(['const int LIMITE = ' + um + ';', 'if (temperatura ' + (op || '?') + ' LIMITE) {', '  encender(VENTILADOR);', '} else {', '  apagar(VENTILADOR);', '}']), K('Operador'), Row({}, ...['>', '<', '=='].map(o => Chip(o, op === o, () => !run && setOp(o), BLUE))), Slider('LIMITE', um, 15, 38, v => !run && setUm(v), ' °C'),
        Btn(run ? 'Probando…' : '▶ Probar con 4 temperaturas', probar, { dis: !op || run, bg: TEAL }), ayuda(p, 'Debe encenderse cuando la temperatura es MAYOR que el límite. El límite debe estar entre 26 °C y 28 °C.')),
        Card({ gap: 12, alignItems: 'center' }, K('Simulación · aula del 3.er piso'), h(Aula, { on: op ? cond(t) : false, temp: t }), D({ width: '100%' }, Slider('Mover la temperatura a mano', t, 15, 38, v => !run && setT(v), ' °C')), T(op ? t + ' ' + op + ' ' + um + ' → ' + cond(t) : 'Elijan un operador.', { fontFamily: MONO, fontWeight: 700 }), D({ width: '100%' }, Serial({ lines: sl })))),
        'Relacionales', { t: 'Ventilador automático del aula', d: 'Debe encenderse cuando hace calor (29 °C o más) y apagarse cuando está fresco (26 °C o menos).' }, ['Operadores relacionales', ['>, <, >=, <=, == y != comparan dos valores.', 'El resultado es true o false: decide si se ejecuta el bloque del if.', '¡No confundan = (guardar) con == (comparar)!'], 'El aire acondicionado de un bus usa un termostato que compara la temperatura con un límite.']);
    }
    const BUGS = [[['float temperatura = 23.5;', 'if (temperatura = 30) {', '  encender(VENTILADOR);', '}'], 1, 'En la línea 2 se usa = (guardar) en vez de == (comparar).'], [['const int LIMITE = 28;', 'void loop() {', '  LIMITE = 35;', '}'], 2, 'La línea 3 intenta cambiar una constante: eso da error.'], [['int temperatura = 23.5;', 'Serial.println(temperatura);'], 0, 'La línea 1 guarda un decimal en un int: se pierde el .5 y se muestra 23. Debe ser float.'], [['int visitantes = 0;', 'visitantes = visitantes + 1', 'Serial.println(visitantes);'], 1, 'A la línea 2 le falta el punto y coma (;).']];
    function RBug(p) {
      const items = p.adaptado ? BUGS.slice(1, 3) : BUGS, [r, setR] = useState({}), listo = items.every((_, i) => r[i] != null);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, Grid(320, ...items.map(([code], i) => Card({ gap: 10 }, K('Programa ' + (i + 1) + ' · toquen la línea con error'), ...code.map((l, k) => h('button', { key: k, onClick: () => setR(Object.assign({}, r, { [i]: k })), style: { textAlign: 'left', fontFamily: MONO, fontSize: 'clamp(14px,1.15vw,18px)', padding: '8px 12px', background: r[i] === k ? '#4a3d12' : '#0a1016', color: '#e8f1f2', border: '2px solid ' + (r[i] === k ? AMB : '#10161c'), cursor: 'pointer', whiteSpace: 'pre' } }, (k + 1) + '  ' + l))))),
        Row({}, Btn('Comprobar', () => { const mal = items.findIndex((x, i) => r[i] !== x[1]); p.check(mal < 0, mal < 0 ? '¡Excelentes detectives! Estos son los errores más comunes al programar.' : 'Revisen el programa ' + (mal + 1) + '. ' + (p.verPista ? items[mal][2] : 'Lean cada línea con calma.'), 'bug'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Busquen: un = que debería ser ==, una constante que se cambia, un decimal en un int y un ; que falta.'))),
        'Depurar', { t: 'Detective de errores', d: 'Cada programa tiene una línea con error. Encuéntrenla.' }, ['Errores comunes', ['= guarda un valor; == compara.', 'Una const no se puede cambiar.', 'Un int no guarda decimales.', 'Cada instrucción termina en ;'], 'Los programadores profesionales pasan mucho tiempo depurando: buscar errores es parte del trabajo.']);
    }
    function RLamp(p) {
      const [c1, setC1] = useState(''), [op, setOp] = useState(p.adaptado ? '&&' : ''), [luz, setLuz] = useState(700), [mov, setMov] = useState(false), [run, setRun] = useState(false), [sl, setSl] = useState([]);
      const ev = (L, M) => { const a = c1 === '<' ? L < 300 : c1 === '>' ? L > 300 : false; return op === '&&' ? a && M : op === '||' ? a || M : false; };
      const probar = () => { const casos = [[800, true, false], [150, true, true], [150, false, false], [800, false, false]]; setRun(true); setSl([]); let i = 0;
        const anim = () => { if (i < casos.length) { const L = casos[i][0], M = casos[i][1]; setLuz(L); setMov(M); setSl(x => x.concat(['luz=' + L + ' mov=' + (M ? 'HIGH' : 'LOW') + ' -> ' + (ev(L, M) ? 'LAMPARA ON' : 'LAMPARA OFF')])); i++; setTimeout(anim, 800); } else { setRun(false); const mal = casos.filter(([L, M, e]) => ev(L, M) !== e);
          p.check(!mal.length, !mal.length ? 'Solo se enciende de noche Y con alguien pasando. Así el colegio ahorra energía.' : c1 === '>' ? 'Con luz > 300 la lámpara funciona de día. ¿Cuándo hay poca luz?' : op === '||' ? 'Con || se enciende de día si alguien pasa, o de noche sin nadie: desperdicia energía.' : 'Revisen la condición.', 'lamp'); } };
        anim(); };
      return Reto(p, Grid(300, Card({ gap: 12 }, K('Armen la condición'), Code(['if (luz ' + (c1 || '?') + ' 300 ' + (op || '??') + ' movimiento == HIGH) {', '  encender(LAMPARA);', '}']), K('Luz'), Row({}, Chip('luz < 300 (poca luz)', c1 === '<', () => !run && setC1('<'), BLUE), Chip('luz > 300 (mucha luz)', c1 === '>', () => !run && setC1('>'), BLUE)),
        K('Unir con'), Row({}, Chip('&&  (Y)', op === '&&', () => !run && setOp('&&'), AMB), Chip('||  (O)', op === '||', () => !run && setOp('||'), AMB)), Btn(run ? 'Probando…' : '▶ Probar 4 situaciones', probar, { dis: !c1 || !op || run, bg: TEAL }), ayuda(p, 'Se debe cumplir que esté oscuro Y que haya movimiento, las dos a la vez.')),
        Card({ gap: 12, alignItems: 'center' }, K('Pasillo del colegio'), h(Pasillo, { on: c1 && op ? ev(luz, mov) : false, luz, mov }), D({ width: '100%' }, Slider('Luz', luz, 0, 1023, v => !run && setLuz(v))), Chip(mov ? 'Hay movimiento' : 'Sin movimiento', mov, () => !run && setMov(!mov), TEAL), D({ width: '100%' }, Serial({ lines: sl })))),
        'Lógicos', { t: 'Lámpara inteligente del pasillo', d: 'Debe encenderse solo cuando está oscuro y alguien pasa por el pasillo.' }, ['Operadores lógicos', ['&& (Y): verdadero solo si las dos condiciones son verdaderas.', '|| (O): verdadero si al menos una es verdadera.', '! (NO): cambia true por false y al revés.'], 'Las luces de los baños de un centro comercial se encienden solo si hay alguien y está oscuro.']);
    }
    const PRED = [[['int a = 7;', 'int b = 2;', 'int c = a / b;'], 'c', 3], [['int x = 20;', 'x = x % 6;'], 'x', 2], [['int n = 4;', 'n = n * 3;', 'n = n - 5;'], 'n', 7], [['int t = 31;', 'bool calor = t > 30 && t < 40;'], 'calor', 'true']];
    function RPred(p) {
      const items = p.adaptado ? PRED.slice(2, 3).concat([PRED[0]]) : PRED, [r, setR] = useState({}), listo = items.every((_, i) => (r[i] || '').trim() !== '');
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, Grid(300, ...items.map(([code, v], i) => Card({ gap: 10 }, Code(code), Row({}, T('¿Cuánto vale ' + v + ' al final?', { fontWeight: 700 }), h('input', { value: r[i] || '', onChange: e => setR(Object.assign({}, r, { [i]: e.target.value })), placeholder: v === 'calor' ? 'true / false' : 'número', style: { fontFamily: MONO, fontSize: 20, width: 130, padding: '8px 10px', border: '2px solid ' + TEAL, background: '#070d12', color: INK } }))))),
        Row({}, Btn('Comprobar', () => { const mal = items.findIndex((x, i) => String(x[2]) !== (r[i] || '').trim().toLowerCase()); p.check(mal < 0, mal < 0 ? '¡Exacto! Pueden pensar como el Arduino: línea por línea.' : 'Revisen el programa ' + (mal + 1) + '. Escriban el valor de cada variable después de cada línea.', 'pred'); }, { dis: !listo, bg: TEAL }), ayuda(p, '7 / 2 con int pierde los decimales. 20 % 6 es lo que sobra al repartir 20 en grupos de 6.')), p.verPista ? Card({ gap: 10, borderColor: TEAL }, K('Ejecución paso a paso · programa 1', TEAL), h(Paso, { code: items[0][0] })) : null),
        'Traza', { t: '¿Qué valor queda?', d: 'Sigan cada programa línea por línea, como lo haría el Arduino.' }, ['Seguir las variables', ['El programa se ejecuta de arriba hacia abajo.', 'Después de cada línea, anoten el valor de cada caja.', 'Recuerden: con int no hay decimales, y % es el resto.'], 'Antes de cargar un programa al robot, los equipos de competencia lo «ejecutan en papel» para encontrar errores.']);
    }
    const RETOS = [
      { id: 'tipos', n: 'Tipos de datos', ic: h(Icon, { k: 'caja', s: 44 }), C: RTipos, ad: true, nivel: 1 },
      { id: 'const', n: 'Variable o constante', ic: h(Icon, { k: 'candado', s: 44 }), C: RConst, ad: true, nivel: 1 },
      { id: 'contador', n: 'Contador de visitantes', ic: h(Icon, { k: 'contador', s: 44 }), C: RContador, ad: true, nivel: 1 },
      { id: 'arit', n: 'Calcular con operadores', ic: h(Icon, { k: 'barras', s: 44 }), C: RArit, ad: true, nivel: 2 },
      { id: 'vent', n: 'Ventilador del aula', ic: h(Icon, { k: 'termo', s: 44 }), C: RVent, ad: false, nivel: 2 },
      { id: 'bug', n: 'Detective de errores', ic: h(Icon, { k: 'lupa', s: 44 }), C: RBug, ad: false, nivel: 2 },
      { id: 'lamp', n: 'Lámpara inteligente', ic: h(Icon, { k: 'lampara', s: 44 }), C: RLamp, ad: false, nivel: 3 },
      { id: 'pred', n: '¿Qué valor queda?', ic: h(Icon, { k: 'pasos', s: 44 }), C: RPred, ad: false, nivel: 3 }];
    const META = { q: '¿Qué fue lo más difícil hoy?', o: ['Elegir el tipo de dato', 'La división y el resto (/ y %)', 'Comparar con > < ==', 'Unir condiciones con && y ||', 'Nada, fue fácil'] };
    make.c = { S, RETOS, META, Flujo, curso: '9no', titulo: 'Variables y operadores' };
    return make.c;
  }
  window.CLASE9 = { make };
})();

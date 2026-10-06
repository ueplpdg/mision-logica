// Clase interactiva · 8vo EGB · Unidad 1 · Estructura de un programa Arduino
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
    // ===== 8vo · Estructura de un programa Arduino: setup(), loop() y comentarios =====
    Object.assign(ILUS, { 'Estructura de un programa': 'pasos', 'Partes de un programa': 'caja', 'Orden de las instrucciones': 'contador', 'La función delay()': 'barras', 'Programar un semáforo': 'lampara', 'Errores de sintaxis': 'lupa', 'Del diagrama al código': 'puertas', 'Predecir el comportamiento': 'pasos' });
    function useBlink(on, off, run) { const [s, setS] = useState(false); useEffect(() => { if (!run) { setS(false); return; } let st = true, t; const go = () => { setS(st); t = setTimeout(() => { st = !st; go(); }, st ? on : off); }; go(); return () => clearTimeout(t); }, [on, off, run]); return s; }
    function Led({ on, col, lab }) { const c = col || '#ff5d5d';
      return D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, h('svg', { viewBox: '0 0 60 92', style: { width: 76, height: 'auto', display: 'block', overflow: 'visible' } },
        h('path', { d: 'M12 40 a18 18 0 0 1 36 0 V58 H12 Z', fill: on ? c : '#3a2424', stroke: on ? c : '#5a3a3a', strokeWidth: 2, style: on ? { filter: 'drop-shadow(0 0 16px ' + c + ')' } : {} }), h('rect', { x: 8, y: 58, width: 44, height: 6, rx: 2, fill: '#9aa5ab' }), h('rect', { x: 20, y: 64, width: 3, height: 26, fill: '#9aa5ab' }), h('rect', { x: 37, y: 64, width: 3, height: 20, fill: '#9aa5ab' })), lab ? K(lab, on ? c : MUTE) : null); }
    const Consola = (lines, ok) => D({ background: '#0a0505', border: '1px solid ' + (ok ? OKC : RED), borderRadius: 8, boxShadow: GLOW(ok ? OKC : RED), fontFamily: MONO, fontSize: 'clamp(13px,1.05vw,16px)', padding: '10px 14px', color: ok ? OKC : '#ff9a90', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }, D({ color: MUTE, fontSize: 12, letterSpacing: '.08em' }, 'CONSOLA DEL COMPILADOR'), ...lines.map((l, i) => D({ key: i, whiteSpace: 'pre-wrap' }, l)));
    const BLINK = ['// Parpadeo del LED del pin 13', 'void setup() {', '  pinMode(13, OUTPUT);   // configurar', '}', 'void loop() {', '  digitalWrite(13, HIGH); // encender', '  delay(1000);            // esperar 1 s', '  digitalWrite(13, LOW);  // apagar', '  delay(1000);            // esperar 1 s', '}'];
    const S = [];
    S.push({ id: 'portada', t: 'Propósito', r: p => Grid(420,
      D({ display: 'flex', flexDirection: 'column', gap: 22 }, K('Robótica · 8vo EGB · Unidad 1'), H1('Del diagrama al código: mi primer programa Arduino'), T('Ya sabemos dibujar algoritmos con diagramas de flujo. Hoy aprenderemos a escribirlos en el idioma que entiende el Arduino.'), p.codigo ? Card({ background: '#0e2a26', color: '#fff', borderColor: TEAL }, K('Código de la sesión', TEAL), D({ fontFamily: HEAD, fontSize: 'clamp(40px,5vw,80px)', color: TEAL, letterSpacing: '.08em', textShadow: '0 0 24px rgba(63,208,184,.5)' }, p.codigo)) : null),
      Card({ gap: 16 }, K('Hoy aprenderemos a…', TEAL), T(['Reconocer la ', B('estructura de un programa Arduino'), ' (setup, loop y comentarios) y modificarlo para controlar un LED.']), K('Sabremos que lo logramos si…', TEAL),
        ...['Ubicamos cada instrucción en setup() o en loop().', 'Explicamos para qué sirven los comentarios.', 'Cambiamos el tiempo del delay y predecimos qué hará el LED.'].map((x, i) => D({ display: 'flex', gap: 12, borderTop: '2px solid ' + LINE, paddingTop: 12 }, D({ fontFamily: HEAD, fontSize: 22, color: TEAL }, String(i + 1)), T(x))), Say(p, 'Hoy aprenderemos a reconocer la estructura de un programa Arduino: setup, loop y comentarios, y a modificarlo para controlar un LED.'))) });
    S.push({ id: 'acuerdos', t: 'Acuerdos y roles', r: p => D({ display: 'flex', flexDirection: 'column', gap: 22 }, H1('Cómo trabajamos hoy'),
      Grid(260, ...[['Mano arriba', 'Cuando el docente levanta la mano, silencio y manos fuera del teclado.'], ['Respeto', 'Escuchamos la idea del otro antes de decidir. Equivocarse es parte de programar.'], ['Cuidado', 'Computadoras, mouse y sillas quedan como los encontramos.']].map(([a, b]) => Card({}, H2(a), T(b)))),
      Card({ borderColor: TEAL }, K('Roles en la pareja · cambian en cada reto', TEAL), Grid(300, D({ display: 'flex', flexDirection: 'column', gap: 6 }, H2('Programador/a'), T('Maneja el mouse y arma la solución.')), D({ display: 'flex', flexDirection: 'column', gap: 6 }, H2('Revisor/a'), T('Lee la teoría y el enunciado, y revisa que la simulación funcione.'))))) });
    S.push({ id: 'motiv', t: 'Motivación', r: p => Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 18 }, K('Piensen un momento'), H1('¿Qué tienen en común un semáforo, un microondas y un robot?'), T('Todos siguen un programa: una lista de instrucciones que alguien escribió. El Arduino es el cerebro de nuestros proyectos, y hoy le daremos sus primeras instrucciones.')),
      Vivo(p, 'motiv', '¿Quién decide cuándo cambia el semáforo de la entrada?', ['El semáforo decide solo', 'Un programa que escribió una persona', 'La electricidad', 'Los carros que pasan'], 1)) });
    const PARTES = [['usb', 'Puerto USB', 'Por aquí se carga el programa desde la computadora. También le da energía a la placa.'], ['chip', 'Microcontrolador', 'Es el cerebro: guarda el programa y lo ejecuta, una instrucción tras otra, muy rápido.'], ['dig', 'Pines digitales (0 a 13)', 'Encienden o apagan cosas: LED, zumbador, motor. Solo tienen dos estados: HIGH (encendido) o LOW (apagado).'], ['ana', 'Pines analógicos (A0 a A5)', 'Leen sensores que dan muchos valores, como la luz o la temperatura.'], ['led', 'LED integrado del pin 13', 'Un LED pequeño que ya viene conectado al pin 13. ¡Ideal para la primera prueba!']];
    function Conoce(p) {
      const [sel, setSel] = useState('chip'), [on, setOn] = useState(false), P = PARTES.find(x => x[0] === sel);
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción · la placa'), H1('Conozcan al Arduino UNO'), T('Toquen cada parte para saber para qué sirve.'), Row({}, ...PARTES.map(([k, n]) => Chip(n, sel === k, () => setSel(k), BLUE))),
        Card({ borderColor: BLUE, gap: 8 }, H2(P[1]), T(P[2])), Say(p, P[1] + '. ' + P[2])),
        Card({ gap: 14, alignItems: 'center' }, K('Prueben: enciendan el pin 13'), h(Placa, { pins: [{ pin: 'D13', on, name: on ? 'LED: HIGH' : 'LED: LOW', col: '#ff5d5d' }], w: 380 }), Row({ justifyContent: 'center' }, h(Led, { on, lab: on ? 'HIGH · encendido' : 'LOW · apagado' }), Btn(on ? 'digitalWrite(13, LOW)' : 'digitalWrite(13, HIGH)', () => setOn(!on), { bg: on ? RED : OKC, head: false }))));
    }
    S.push({ id: 'placa', t: 'La placa Arduino', r: p => h(Conoce, p) });
    const PASOS_D = [['oval', 'INICIO', 1, 'INICIO del diagrama = void setup() {. Lo que está en setup se ejecuta una sola vez.'], ['rect', 'Configurar el pin 13 como salida', 2, 'Configurar = pinMode(13, OUTPUT). Le dice al Arduino que el pin 13 va a encender algo.'], ['rect', 'Encender el LED', 5, 'Encender = digitalWrite(13, HIGH). HIGH significa encendido.'], ['rect', 'Esperar 1 segundo', 6, 'Esperar = delay(1000). El tiempo se escribe en milisegundos: 1000 ms = 1 s.'], ['rect', 'Apagar el LED', 7, 'Apagar = digitalWrite(13, LOW). LOW significa apagado.'], ['rect', 'Esperar 1 segundo', 8, 'Otra espera de 1000 ms, para que se vea apagado.'], ['oval', 'Volver a «Encender»', 9, 'La flecha que regresa es la llave } de loop(): al llegar al final, loop() vuelve a empezar.']];
    function Traduce(p) {
      const [sel, setSel] = useState(0), P = PASOS_D[sel];
      return Grid(360, D({ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }, K('Diagrama de flujo · toquen cada paso'), ...PASOS_D.map(([f, t], i) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 360 },
        h('button', { onClick: () => setSel(i), style: { width: '100%', padding: '10px 14px', borderRadius: f === 'oval' ? 999 : 6, border: '2px solid ' + (sel === i ? AMB : i < 2 ? BLUE : TEAL), background: sel === i ? 'rgba(240,167,38,.18)' : CARD, color: INK, fontWeight: 700, fontSize: 'clamp(14px,1.15vw,18px)', cursor: 'pointer', boxShadow: sel === i ? GLOW(AMB) : 'none' } }, t), i < PASOS_D.length - 1 ? D({ width: 2, height: 12, background: LINE }) : null))),
        D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Construcción · del diagrama al código'), H1('Cada paso del diagrama es una línea de código'), Code(BLINK, { hl: P[2] }), Card({ borderColor: AMB, gap: 6 }, K(P[2] <= 3 ? 'setup() · una sola vez' : 'loop() · se repite siempre', AMB), T(P[3])), Say(p, P[3])));
    }
    S.push({ id: 'traduce', t: 'Del diagrama al código', r: p => h(Traduce, p) });
    function Ejecuta(p) {
      const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9], [run, setRun] = useState(false), [ln, setLn] = useState(-1), [v, setV] = useState(0), [led, setLed] = useState(false), [vel, setVel] = useState(500), [log, setLog] = useState([]), k = useRef(-1), vu = useRef(0);
      useEffect(() => { if (!run) return; const t = setInterval(() => { k.current++; if (k.current >= ALL.length) { k.current = 4; vu.current++; setV(vu.current); setLog(l => l.concat(['loop() vuelta ' + (vu.current + 1)])); } const n = ALL[k.current]; setLn(n); if (n === 5) setLed(true); if (n === 7) setLed(false); if (n === 3) setLog(l => l.concat(['setup() terminado: se ejecutó 1 sola vez'])); if (n === 4 && vu.current === 0) setLog(l => l.concat(['loop() vuelta 1'])); }, vel); return () => clearInterval(t); }, [run, vel]);
      const reset = () => { setRun(false); k.current = -1; vu.current = 0; setLn(-1); setV(0); setLed(false); setLog([]); };
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Construcción · setup() y loop()'), H1('Así piensa el Arduino'), T(['Enciendan el Arduino y miren la línea iluminada: ', B('setup()'), ' pasa una sola vez y ', B('loop()'), ' se repite para siempre.']), Code(BLINK, { hl: ln }),
        Row({}, Btn(run ? '■ Pausar' : '▶ Encender el Arduino', () => setRun(!run), { bg: run ? AMB : TEAL }), Btn('Reiniciar', reset, { bg: CARD, c: INK })), Slider('Velocidad (ms por línea, para verlo despacio)', vel, 150, 1200, setVel, ' ms'), Say(p, 'setup se ejecuta una sola vez al encender. loop se repite para siempre.')),
        Card({ gap: 14, alignItems: 'center' }, Row({ justifyContent: 'center', gap: 20 }, h(Led, { on: led, lab: 'pin 13' }), D({ display: 'flex', flexDirection: 'column', gap: 8 }, Card({ borderColor: BLUE, padding: '10px 14px', gap: 2 }, K('setup()', BLUE), D({ fontFamily: HEAD, fontSize: 28, color: BLUE }, ln >= 1 ? '1 vez' : '0 veces')), Card({ borderColor: TEAL, padding: '10px 14px', gap: 2 }, K('loop()', TEAL), D({ fontFamily: HEAD, fontSize: 28, color: TEAL }, (ln >= 4 ? v + 1 : 0) + ' vueltas')))), D({ width: '100%' }, Serial({ lines: log }))));
    }
    S.push({ id: 'ejecuta', t: 'setup() y loop()', r: p => h(Ejecuta, p) });
    function Delay(p) {
      const [on, setOn] = useState(1000), [off, setOff] = useState(1000), [run, setRun] = useState(true), l = useBlink(on, off, run), pps = Math.round(10000 / (on + off)) / 10;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Construcción · la función delay()'), H1('delay() es el reloj del programa'), T(['delay(1000) hace esperar ', B('1000 milisegundos = 1 segundo'), '. Cambien los tiempos y miren el LED.']),
        Code(['void loop() {', '  digitalWrite(13, HIGH);', '  delay(' + on + ');', '  digitalWrite(13, LOW);', '  delay(' + off + ');', '}']), Slider('Tiempo encendido', on, 100, 2000, setOn, ' ms'), Slider('Tiempo apagado', off, 100, 2000, setOff, ' ms'), Say(p, 'delay hace esperar al Arduino. El tiempo está en milisegundos: mil milisegundos son un segundo.')),
        Card({ gap: 14, alignItems: 'center', borderColor: '#ff5d5d' }, h(Led, { on: l, lab: l ? 'encendido' : 'apagado' }), D({ fontFamily: HEAD, fontSize: 'clamp(26px,2.6vw,42px)', color: AMB, textShadow: '0 0 16px ' + AMB + '88' }, pps + ' parpadeos por segundo'), T('Una vuelta del loop dura ' + on + ' + ' + off + ' = ' + (on + off) + ' ms.', { color: MUTE }), Row({}, Chip('Ejemplo: luz de alarma (rápido)', on === 150 && off === 150, () => { setOn(150); setOff(150); }, RED), Chip('Ejemplo: faro (destello corto)', on === 200 && off === 1800, () => { setOn(200); setOff(1800); }, AMB)), Btn(run ? '■ Detener' : '▶ Simular', () => setRun(!run), { bg: CARD, c: INK })));
    }
    S.push({ id: 'delay', t: 'La función delay()', r: p => h(Delay, p) });
    function Coment(p) {
      const [ver, setVer] = useState(true), sin = BLINK.filter(l => !/^\s*\/\//.test(l)).map(l => l.split('//')[0].replace(/\s+$/, ''));
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Construcción · comentarios'), H1('Comentarios: notas para las personas'), T(['Todo lo que va después de ', B('//'), ' es un comentario. El Arduino lo ', B('ignora'), '; sirve para que cualquiera entienda el programa.']), Row({}, Chip('Con comentarios', ver, () => setVer(true), OKC), Chip('Sin comentarios', !ver, () => setVer(false), RED)), Code(ver ? BLINK : sin),
        T(ver ? 'Se entiende qué hace cada línea, incluso meses después.' : 'Funciona igual, pero ¿lo entendería un compañero que nunca lo vio?', { color: ver ? OKC : RED, fontWeight: 600 }), Say(p, 'Todo lo que va después de dos barras es un comentario. El Arduino lo ignora. Sirve para que las personas entiendan el programa.')),
        Vivo(p, 'coment', '¿Qué hace el Arduino con la línea  // encender el LED ?', ['La ejecuta y enciende el LED', 'La ignora: es solo para las personas', 'La muestra en la pantalla', 'Da un error'], 1));
    }
    S.push({ id: 'coment', t: 'Comentarios', r: p => h(Coment, p) });
    const ERRS = [['ok', 'Programa correcto', BLINK.slice(4, 10).map(l => l.split('//')[0].replace(/\s+$/, '')), ['Compilando…', 'Compilación terminada.', 'Programa subido a la placa ✓'], -1], ['pc', 'Quitar un punto y coma', ['void loop() {', '  digitalWrite(13, HIGH)', '  delay(1000);', '  digitalWrite(13, LOW);', '  delay(1000);', '}'], ["error: expected ';' before 'delay'", 'Revisen el final de la línea 2.'], 1], ['ll', 'Quitar la llave final', ['void loop() {', '  digitalWrite(13, HIGH);', '  delay(1000);', '  digitalWrite(13, LOW);', '  delay(1000);'], ["error: expected '}' at end of input", 'Todo bloque que se abre con { se cierra con }.'], 4], ['may', 'Escribir en minúsculas', ['void loop() {', '  digitalwrite(13, HIGH);', '  delay(1000);', '  digitalWrite(13, LOW);', '  delay(1000);', '}'], ["error: 'digitalwrite' was not declared in this scope", 'Arduino distingue mayúsculas: es digitalWrite.'], 1]];
    function Sintaxis(p) {
      const [e, setE] = useState('ok'), E = ERRS.find(x => x[0] === e), l = useBlink(500, 500, e === 'ok');
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Rompe el código', RED), H1('Las reglas de escritura'), T(['Cada instrucción termina en ', B(';'), ', cada bloque va entre ', B('{ }'), ' y las mayúsculas importan. Rompan el programa a propósito y miren qué dice el compilador.']), Row({}, ...ERRS.map(([k, t]) => Chip(t, e === k, () => setE(k), k === 'ok' ? OKC : RED))), Code(E[2], { hl: E[4] })),
        Card({ gap: 14, alignItems: 'center', borderColor: e === 'ok' ? OKC : RED }, h(Led, { on: l, lab: e === 'ok' ? 'funcionando' : 'sin programa' }), D({ width: '100%' }, Consola(E[3], e === 'ok')), T(e === 'ok' ? 'Sin errores, el programa se sube y el LED parpadea.' : 'Con un solo error, el programa NO se sube: el LED no hace nada.', { color: e === 'ok' ? OKC : RED, fontWeight: 600 })));
    }
    S.push({ id: 'sintaxis', t: 'Reglas de escritura', r: p => h(Sintaxis, p) });
    const SEMC = ['// Semáforo de la entrada del colegio', 'void setup() {', '  pinMode(12, OUTPUT); // verde', '  pinMode(11, OUTPUT); // amarillo', '  pinMode(10, OUTPUT); // rojo', '}', 'void loop() {', '  digitalWrite(12, HIGH); delay(5000); digitalWrite(12, LOW);', '  digitalWrite(11, HIGH); delay(2000); digitalWrite(11, LOW);', '  digitalWrite(10, HIGH); delay(5000); digitalWrite(10, LOW);', '}'];
    const SEMX = ['Un comentario dice qué hace el programa.', 'Empieza setup(): se ejecuta una vez.', 'El pin 12 será la luz verde.', 'El pin 11 será la luz amarilla.', 'El pin 10 será la luz roja.', 'Termina setup().', 'Empieza loop(): esto se repite siempre.', 'Verde encendido 5 segundos y se apaga.', 'Amarillo 2 segundos: avisa que viene el rojo.', 'Rojo 5 segundos.', 'Fin del loop: vuelve a la luz verde.'];
    function Resuelto(p) {
      const [i, setI] = useState(-1), luz = i === 7 ? 0 : i === 8 ? 1 : i === 9 ? 2 : -1;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Ejercicio resuelto · paso a paso'), H1('El semáforo de la entrada'), Code(SEMC, { hl: i }), Row({}, Btn(i < 0 ? '▶ Empezar' : '▶ Siguiente línea', () => setI(i >= 10 ? 7 : i + 1), { bg: TEAL }), Btn('Reiniciar', () => setI(-1), { bg: CARD, c: INK }))),
        Card({ gap: 14, alignItems: 'center' }, h(Semaforo, { luz }), Card({ borderColor: AMB, gap: 4, width: '100%' }, K(i < 0 ? 'Pulsen «Empezar»' : 'Línea ' + (i + 1), AMB), T(i < 0 ? 'Vamos a leer el programa como lo haría el Arduino.' : SEMX[i])), i >= 10 ? T('Después de la línea 11, el Arduino vuelve a la línea 8: ¡el semáforo nunca se detiene!', { color: TEAL, fontWeight: 600 }) : null));
    }
    S.push({ id: 'resuelto', t: 'Ejercicio resuelto', r: p => h(Resuelto, p) });
    function Relampago(p) {
      const [s, setS] = useState(30); useEffect(() => { const i = setInterval(() => setS(x => Math.max(0, x - 1)), 1000); return () => clearInterval(i); }, []);
      const c = s > 10 ? AMB : RED;
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Reto relámpago · 30 segundos', AMB), H1('¿Cuántas veces se enciende el LED en 10 segundos?'), Code(['void loop() {', '  digitalWrite(13, HIGH);', '  delay(500);', '  digitalWrite(13, LOW);', '  delay(500);', '}']),
        D({ fontFamily: HEAD, fontSize: 'clamp(48px,6vw,96px)', color: c, textShadow: '0 0 26px ' + c, lineHeight: 1 }, s ? s + ' s' : '¡Tiempo!')),
        Vivo(p, 'relampago', 'En 10 segundos el LED se enciende…', ['5 veces', '10 veces', '20 veces', '1 vez'], 1));
    }
    S.push({ id: 'relampago', t: 'Reto relámpago', r: p => h(Relampago, p) });
    S.push({ id: 'retos', t: 'Modo reto', r: p => D({ display: 'flex', flexDirection: 'column', gap: 20 }, K('Ahora ustedes'), H1('Modo reto: 8 retos, completen 6'), T('Cada reto empieza con una teoría corta y un ejemplo real. Pueden elegir el orden. Si se traban, salgan y prueben otro. La pista resta 1 punto; la teoría no resta nada.'),
      Grid(240, ...[['Nivel 1', '¿setup o loop? · Partes del programa · Ordena el programa'], ['Nivel 2', 'Ajusta el delay · Programa el semáforo · Detective de sintaxis'], ['Nivel 3', 'Del diagrama al código · ¿Qué hará el LED?']].map(([a, b]) => Card({}, H2(a), T(b))))) });

    // ---------- RETOS ----------
    function Reto(p, body, nombre, enun, teo) { return D({ display: 'flex', flexDirection: 'column', gap: 16 }, Row({ justifyContent: 'space-between' }, K('Reto · ' + nombre, TEAL), K('Intentos ' + (p.intentos || 0), MUTE)), H1(enun.t, { fontSize: 'clamp(26px,2.8vw,46px)' }), T(enun.d), Say(p, enun.t + '. ' + enun.d), teo ? h(TeoBox, { p, a: teo }) : null, body); }
    function TeoBox({ p, a }) { return TeoToggle(p, a); }
    const ayuda = (p, txt) => p.verPista ? Card({ borderColor: AMB, background: 'rgba(240,167,38,.12)' }, K('Pista', AMB), T(txt)) : Btn('Ver una pista (−1 punto)', p.pedirPista, { bg: CARD, c: AMB, bd: AMB });
    const DONDE = [['pinMode(13, OUTPUT);', 's'], ['digitalWrite(13, HIGH);', 'l'], ['Serial.begin(9600);', 's'], ['delay(500);', 'l'], ['pinMode(BOTON, INPUT);', 's'], ['digitalWrite(13, LOW);', 'l'], ['estado = digitalRead(BOTON);', 'l'], ['pinMode(ZUMBADOR, OUTPUT);', 's']];
    function RDonde(p) {
      const items = p.adaptado ? DONDE.slice(0, 4) : DONDE, BIN = [['s', 'setup()', 'se ejecuta 1 vez', BLUE], ['l', 'loop()', 'se repite siempre', TEAL]];
      const [r, setR] = useState({}), [sel, setSel] = useState(null), [over, setOver] = useState(null), listo = items.every((_, i) => r[i]);
      const poner = (i, o) => { setR(Object.assign({}, r, { [i]: o })); setSel(null); };
      const ficha = i => h('div', { key: 'f' + i, draggable: true, onDragStart: e => { try { e.dataTransfer.setData('text/plain', String(i)); } catch (x) {} setSel(i); }, onClick: e => { e.stopPropagation(); setSel(sel === i ? null : i); }, style: { padding: '10px 14px', borderRadius: 8, fontFamily: MONO, background: sel === i ? '#4a3d12' : '#0a1016', border: '2px solid ' + (sel === i ? AMB : r[i] === 's' ? BLUE : r[i] === 'l' ? TEAL : LINE), color: INK, fontWeight: 600, fontSize: 'clamp(14px,1.15vw,18px)', cursor: 'grab', userSelect: 'none' } }, items[i][0]);
      const libres = items.map((_, i) => i).filter(i => !r[i]);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, T('Arrastren cada instrucción a su bloque. También pueden tocar la instrucción y luego tocar el bloque.', { color: MUTE, fontSize: 16 }),
        Card({ gap: 10 }, K('Instrucciones sin ubicar · ' + libres.length), Row({}, ...libres.map(ficha), libres.length ? null : T('¡Todas ubicadas! Ahora comprueben.', { color: OKC, fontWeight: 600 }))),
        Grid(280, ...BIN.map(([o, n, d, c]) => h('div', { key: o, onDragOver: e => { e.preventDefault(); if (over !== o) setOver(o); }, onDragLeave: () => setOver(null), onDrop: e => { e.preventDefault(); setOver(null); let v = ''; try { v = e.dataTransfer.getData('text/plain'); } catch (x) {} const i = v === '' ? sel : Number(v); if (i != null && !isNaN(i)) poner(i, o); }, onClick: () => { if (sel != null) poner(sel, o); },
          style: { minHeight: 170, borderRadius: 12, border: '2px ' + (over === o ? 'solid ' : 'dashed ') + c, background: over === o ? c + '22' : '#0d1820', boxShadow: GLOW(c), padding: 14, display: 'flex', flexDirection: 'column', gap: 8, cursor: sel != null ? 'pointer' : 'default' } },
          D({ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: c, textShadow: '0 0 10px ' + c }, 'void ' + n + ' {'), K(d, MUTE), ...items.map((_, i) => i).filter(i => r[i] === o).map(ficha), D({ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: c }, '}')))),
        Row({}, Btn('Comprobar', () => { const mal = items.filter((x, i) => r[i] !== x[1]); p.check(!mal.length, !mal.length ? '¡Perfecto! Configurar va una vez en setup(); encender, apagar, esperar y leer se repiten en loop().' : '«' + mal[0][0] + '» ' + (mal[0][1] === 's' ? 'configura un pin o la comunicación: basta hacerlo una sola vez, en setup().' : 'es parte del comportamiento que se repite: va en loop().'), 'donde'); }, { dis: !listo, bg: TEAL }), Btn('Reiniciar', () => { setR({}); setSel(null); }, { bg: CARD, c: INK }), ayuda(p, 'pinMode y Serial.begin configuran: van en setup(). digitalWrite, delay y digitalRead van en loop().'))),
        '¿setup o loop?', { t: '¿En qué bloque va cada instrucción?', d: 'Ubiquen cada instrucción en setup() o en loop().' }, ['Estructura de un programa', ['setup() se ejecuta una sola vez, al encender: ahí se configura.', 'loop() se repite para siempre: ahí va el comportamiento.', 'Todo lo de cada bloque va entre llaves { }.'], 'Al encender el celular, carga su configuración una vez (setup) y después revisa las notificaciones todo el tiempo (loop).']);
    }
    const PARTS = [[0, '// Enciende el LED del laboratorio', 'Comentario'], [1, 'void setup() {', 'Inicio de setup()'], [2, '  pinMode(13, OUTPUT);', 'Configuración'], [4, 'void loop() {', 'Inicio de loop()'], [5, '  digitalWrite(13, HIGH);', 'Instrucción que se repite'], [6, '}', 'Cierre de un bloque']];
    function RPartes(p) {
      const items = p.adaptado ? PARTS.filter((_, i) => i !== 2 && i !== 5) : PARTS, opts = p.adaptado ? ['Comentario', 'Inicio de setup()', 'Inicio de loop()', 'Instrucción que se repite'] : ['Comentario', 'Inicio de setup()', 'Configuración', 'Inicio de loop()', 'Instrucción que se repite', 'Cierre de un bloque'];
      const [r, setR] = useState({}), listo = items.every((_, i) => r[i]);
      const code = ['// Enciende el LED del laboratorio', 'void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {', '  digitalWrite(13, HIGH);', '}'];
      return Reto(p, Grid(320, Card({ gap: 10 }, K('El programa completo'), Code(code)), D({ display: 'flex', flexDirection: 'column', gap: 12 }, ...items.map(([ln, t], i) => Card({ gap: 8, borderColor: r[i] ? BLUE : LINE }, D({ fontFamily: MONO, fontSize: 'clamp(14px,1.2vw,18px)', color: /\/\//.test(t) ? OKC : INK, whiteSpace: 'pre' }, 'Línea ' + (ln + 1) + ':  ' + t.trim()), Row({}, ...opts.map(o => Chip(o, r[i] === o, () => setR(Object.assign({}, r, { [i]: o })), BLUE))))),
        Row({}, Btn('Comprobar', () => { const mal = items.filter((x, i) => r[i] !== x[2]); p.check(!mal.length, !mal.length ? '¡Muy bien! Ya pueden leer cualquier programa Arduino por partes.' : 'Revisen la línea «' + mal[0][1].trim() + '»: es ' + mal[0][2].toLowerCase() + '.', 'partes'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Lo que empieza con // es comentario. void setup() { y void loop() { abren bloques; } los cierra. pinMode configura.')))),
        'Partes del programa', { t: '¿Qué es cada línea?', d: 'Nombren cada parte del programa.' }, ['Partes de un programa', ['// inicia un comentario.', 'void setup() { y void loop() { abren los dos bloques obligatorios.', 'Las instrucciones terminan en ; y los bloques se cierran con }.'], 'Como una receta: el título (comentario), los preparativos (setup) y los pasos que se repiten (loop).']);
    }
    const ORD = ['void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {', '  digitalWrite(13, HIGH);', '  delay(1000);', '  digitalWrite(13, LOW);', '  delay(1000);', '}'];
    function ROrdena(p) {
      const base = p.adaptado ? ORD.slice(4, 8) : ORD, [mez] = useState(() => { let m; do { m = base.map((t, i) => i).sort(() => Math.random() - 0.5); } while (m.every((v, i) => v === i)); return m; });
      const [seq, setSeq] = useState([]), [ok, setOk] = useState(false), l = useBlink(600, 600, ok), usado = seq.map(i => i);
      const comprobar = () => { const t = seq.map(i => base[i]), bad = t.findIndex((x, k) => x !== base[k]);
        if (bad < 0) { setOk(true); p.check(true, '¡El programa funciona! Primero se configura en setup() y luego se repite encender, esperar, apagar y esperar.', 'orden'); return; }
        const exp = base[bad].trim(); p.check(false, 'La línea ' + (bad + 1) + ' no va ahí. ' + (/setup/.test(exp) ? 'Todo programa empieza con void setup() {.' : /pinMode/.test(exp) ? 'pinMode configura: va dentro de setup().' : /loop/.test(exp) ? 'Después de cerrar setup() viene void loop() {.' : exp === '}' ? 'Hay que cerrar el bloque con } en ese lugar.' : /HIGH/.test(exp) ? 'Primero se enciende (HIGH) y luego se espera.' : /LOW/.test(exp) ? 'Después de esperar encendido, se apaga (LOW).' : 'Después de cada cambio del LED hay una espera.'), 'orden'); };
      return Reto(p, Grid(320, Card({ gap: 10 }, K('Toquen las líneas en orden'), ...mez.map(i => h('button', { key: i, disabled: usado.includes(i), onClick: () => setSeq(seq.concat([i])), style: { textAlign: 'left', fontFamily: MONO, fontSize: 'clamp(14px,1.15vw,18px)', padding: '8px 12px', borderRadius: 6, background: usado.includes(i) ? '#1b2a33' : '#0a1016', color: usado.includes(i) ? MUTE : INK, border: '2px solid ' + (usado.includes(i) ? LINE : BLUE), cursor: usado.includes(i) ? 'default' : 'pointer', whiteSpace: 'pre' } }, base[i])),
        Row({}, Btn('Comprobar', comprobar, { dis: seq.length < base.length, bg: TEAL }), Btn('Quitar la última', () => { setSeq(seq.slice(0, -1)); setOk(false); }, { bg: CARD, c: INK, dis: !seq.length }), ayuda(p, p.adaptado ? 'Encender → esperar → apagar → esperar.' : 'setup() con pinMode adentro, se cierra, y luego loop() con encender, esperar, apagar, esperar.'))),
        Card({ gap: 10, alignItems: 'center' }, K('Su programa'), p.adaptado ? Code(['void setup() {', '  pinMode(13, OUTPUT);', '}', 'void loop() {'].concat(seq.map(i => base[i])).concat(['}'])) : Code(seq.length ? seq.map(i => base[i]) : ['// toquen las líneas para armarlo']), h(Led, { on: l, lab: ok ? '¡funciona!' : 'esperando el programa' }))),
        'Ordenar', { t: 'Ordena el programa del LED', d: 'Armen el programa que hace parpadear el LED cada segundo.' }, ['Orden de las instrucciones', ['El Arduino ejecuta de arriba hacia abajo, una línea a la vez.', 'Primero va setup() y después loop().', 'Si el orden cambia, el comportamiento cambia.'], 'En una receta no se puede hornear antes de mezclar: el orden importa.']);
    }
    function RTiempos(p) {
      const meta = p.adaptado ? { t: 'El LED debe parpadear 1 vez por segundo, igual tiempo encendido y apagado.', on: 500, off: 500 } : { t: 'La luz de la alarma debe parpadear 2 veces por segundo, igual tiempo encendido y apagado.', on: 250, off: 250 };
      const [on, setOn] = useState(1000), [off, setOff] = useState(1000), l = useBlink(on, off, true), pps = Math.round(10000 / (on + off)) / 10;
      return Reto(p, Grid(320, Card({ gap: 12 }, Code(['void loop() {', '  digitalWrite(LUZ, HIGH);', '  delay(' + on + ');', '  digitalWrite(LUZ, LOW);', '  delay(' + off + ');', '}']), Slider('delay encendido', on, 50, 1500, setOn, ' ms'), Slider('delay apagado', off, 50, 1500, setOff, ' ms'),
        Btn('Comprobar', () => { const ok = on === meta.on && off === meta.off; p.check(ok, ok ? 'Exacto: ' + on + ' + ' + off + ' = ' + (on + off) + ' ms por parpadeo → ' + pps + ' por segundo.' : on !== off ? 'El tiempo encendido y apagado deben ser iguales.' : 'Ahora hace ' + pps + ' parpadeos por segundo. Un segundo tiene 1000 ms: ¿cuánto debe durar cada parpadeo?', 'tiempos'); }, { bg: TEAL }), ayuda(p, 'Un segundo = 1000 ms. Si debe parpadear ' + (p.adaptado ? '1 vez' : '2 veces') + ', cada parpadeo dura ' + (meta.on * 2) + ' ms, repartidos en encendido y apagado.')),
        Card({ gap: 12, alignItems: 'center', borderColor: '#ff5d5d' }, K('Luz de la alarma del laboratorio'), h(Led, { on: l }), D({ fontFamily: HEAD, fontSize: 'clamp(24px,2.4vw,38px)', color: AMB, textShadow: '0 0 14px ' + AMB + '88' }, pps + ' por segundo'))),
        'Tiempos', { t: 'Ajusta el delay', d: meta.t }, ['La función delay()', ['delay(n) detiene el programa n milisegundos.', '1000 ms = 1 segundo; 500 ms = medio segundo.', 'Un parpadeo completo = tiempo encendido + tiempo apagado.'], 'Las luces de emergencia de una ambulancia parpadean rápido para llamar la atención; un faro lo hace lento.']);
    }
    function RSema(p) {
      const COLS = [['V', 'Verde', 12], ['A', 'Amarillo', 11], ['R', 'Rojo', 10]], [c, setC] = useState(['', '', '']), [s, setS] = useState([5, 5, 5]), [luz, setLuz] = useState(-1), [run, setRun] = useState(false), tm = useRef(null);
      useEffect(() => () => clearTimeout(tm.current), []);
      const probar = () => { if (c.some(x => !x)) return; setRun(true); let i = 0, n = 0; const step = () => { if (n >= 6) { setLuz(-1); setRun(false); fin(); return; } setLuz({ V: 0, A: 1, R: 2 }[c[i]]); tm.current = setTimeout(() => { i = (i + 1) % 3; n++; step(); }, s[i] * 220); }; step(); };
      const fin = () => { const ok = c.join('') === 'VAR' && s[0] === 5 && s[1] === 2 && s[2] === 5; p.check(ok, ok ? 'Verde 5 s → amarillo 2 s → rojo 5 s, y vuelve a empezar gracias a loop().' : c.join('') !== 'VAR' ? 'El orden no es seguro: después del verde viene el amarillo, que avisa antes del rojo.' : 'Revisen los tiempos: verde 5 s, amarillo 2 s y rojo 5 s.', 'sema'); };
      return Reto(p, Grid(320, Card({ gap: 12 }, ...[0, 1, 2].map(i => D({ display: 'flex', flexDirection: 'column', gap: 6, borderTop: i ? '1px solid ' + LINE : 'none', paddingTop: i ? 10 : 0 }, K('Paso ' + (i + 1)), Row({}, ...COLS.map(([k, n]) => Chip(n, c[i] === k, () => { if (!run) { const x = c.slice(); x[i] = k; setC(x); } }, k === 'V' ? OKC : k === 'A' ? AMB : RED)), Sel2(String(s[i]), [['1', '1 s'], ['2', '2 s'], ['5', '5 s']], v => { if (!run) { const x = s.slice(); x[i] = Number(v); setS(x); } })))),
        Btn(run ? 'Funcionando…' : '▶ Subir y probar', probar, { dis: run || c.some(x => !x), bg: TEAL }), ayuda(p, 'Verde, amarillo y rojo. El amarillo es el más corto: 2 segundos.')),
        Card({ gap: 12, alignItems: 'center' }, h(Semaforo, { luz }), Code(['void loop() {'].concat([0, 1, 2].map(i => { const C = COLS.find(x => x[0] === c[i]); return C ? '  digitalWrite(' + C[2] + ', HIGH); delay(' + s[i] * 1000 + '); digitalWrite(' + C[2] + ', LOW);' : '  // paso ' + (i + 1) + ' sin elegir'; })).concat(['}'])))),
        'Semáforo', { t: 'Programa el semáforo de la entrada', d: 'Elijan el color y el tiempo de cada paso. Debe ser seguro para los estudiantes que cruzan.' }, ['Programar un semáforo', ['Cada luz es un LED en su propio pin.', 'Encender (HIGH), esperar (delay) y apagar (LOW), luz por luz.', 'loop() hace que el ciclo nunca termine.'], 'Los semáforos reales también tienen un microcontrolador con un programa parecido.']);
    }
    function Sel2(val, opts, set) { return h('select', { value: val, onChange: e => set(e.target.value), style: { fontFamily: MONO, fontSize: 16, padding: '6px 10px', background: '#0a1016', color: INK, border: '2px solid ' + LINE, borderRadius: 6 } }, ...opts.map(([v, t]) => h('option', { key: v, value: v }, t))); }
    const SINT = [[['void setup() {', '  pinMode(13, OUTPUT)', '}'], 1, "error: expected ';' before '}'", 'Falta el ; al final de pinMode.'], [['void loop() {', '  digitalwrite(13, HIGH);', '  delay(500);', '}'], 1, "error: 'digitalwrite' was not declared", 'Es digitalWrite, con W mayúscula.'], [['void setup {', '  pinMode(13, OUTPUT);', '}'], 0, "error: variable or field 'setup' declared void", 'Faltan los paréntesis: void setup() {'], [['void loop() {', '  digitalWrite(13, HIGH);', '  dalay(500);', '}'], 2, "error: 'dalay' was not declared", 'delay está mal escrito.']];
    function RSint(p) {
      const items = p.adaptado ? SINT.slice(0, 2) : SINT, [r, setR] = useState({}), [ver, setVer] = useState(false), listo = items.every((_, i) => r[i] != null);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, Grid(320, ...items.map(([code, bad, err, ex], i) => Card({ gap: 8 }, K('Programa ' + (i + 1) + ' · toquen la línea con error'), ...code.map((l, k) => h('button', { key: k, onClick: () => setR(Object.assign({}, r, { [i]: k })), style: { textAlign: 'left', fontFamily: MONO, fontSize: 'clamp(14px,1.15vw,18px)', padding: '8px 12px', borderRadius: 6, background: r[i] === k ? '#4a3d12' : '#0a1016', color: INK, border: '2px solid ' + (r[i] === k ? AMB : '#0a1016'), cursor: 'pointer', whiteSpace: 'pre' } }, (k + 1) + '  ' + l)), ver ? Consola([err, '→ ' + ex], false) : null))),
        Row({}, Btn('Comprobar', () => { const mal = items.findIndex((x, i) => r[i] !== x[1]); setVer(true); p.check(mal < 0, mal < 0 ? '¡Excelentes detectives! Lean los mensajes del compilador: siempre dicen dónde buscar.' : 'Revisen el programa ' + (mal + 1) + '. Lean el mensaje de la consola.', 'sint'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Busquen: un ; que falta, una mayúscula, unos paréntesis y una palabra mal escrita.'))),
        'Sintaxis', { t: 'Detective de sintaxis', d: 'Cada programa tiene una línea con un error de escritura. Encuéntrenla.' }, ['Errores de sintaxis', ['Cada instrucción termina en ;', 'Las mayúsculas importan: digitalWrite ≠ digitalwrite.', 'setup y loop llevan ( ) y { }.'], 'Igual que una palabra mal escrita en un mensaje: el Arduino no adivina lo que quisimos decir.']);
    }
    const DIAG = [['oval', 'INICIO', ['void loop() {', 'void setup() {', 'delay(1000);'], 1], ['rect', 'Configurar el zumbador (pin 8) como salida', ['pinMode(8, INPUT);', 'digitalWrite(8, OUTPUT);', 'pinMode(8, OUTPUT);'], 2], ['rect', 'Encender el zumbador', ['digitalWrite(8, HIGH);', 'digitalWrite(8, LOW);', 'pinMode(8, HIGH);'], 0], ['rect', 'Esperar 3 segundos', ['delay(3);', 'delay(300);', 'delay(3000);'], 2], ['rect', 'Apagar el zumbador', ['digitalWrite(8, HIGH);', 'digitalWrite(8, LOW);', 'delay(0);'], 1], ['rect', 'Esperar 1 segundo', ['delay(1000);', 'delay(1);', 'delay(100);'], 0], ['oval', 'Repetir para siempre', ['Escribir FIN', 'Todo esto va dentro de setup()', 'Los pasos 3 a 6 van dentro de loop()'], 2]];
    function RDiag(p) {
      const [r, setR] = useState({}), [ok, setOk] = useState(false), l = useBlink(900, 300, ok), listo = DIAG.every((_, i) => r[i] != null);
      return Reto(p, Grid(320, D({ display: 'flex', flexDirection: 'column', gap: 10 }, ...DIAG.map(([f, t, o], i) => Card({ gap: 8, borderColor: r[i] != null ? TEAL : LINE }, D({ alignSelf: 'flex-start', padding: '6px 14px', borderRadius: f === 'oval' ? 999 : 6, border: '2px solid ' + BLUE, fontWeight: 700 }, (i + 1) + '. ' + t), Row({}, ...o.map((x, k) => Chip(x, r[i] === k, () => setR(Object.assign({}, r, { [i]: k })), TEAL))))),
        Row({}, Btn('Comprobar', () => { const mal = DIAG.findIndex((x, i) => r[i] !== x[3]); if (mal < 0) setOk(true); p.check(mal < 0, mal < 0 ? '¡El código hace exactamente lo que dice el diagrama! El recreo ya tiene su alarma.' : 'Revisen el paso ' + (mal + 1) + ': «' + DIAG[mal][1] + '».', 'diag'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Configurar = pinMode(…, OUTPUT). Encender = HIGH. 3 segundos = 3000 ms. Lo que se repite va en loop().'))),
        Card({ gap: 12, alignItems: 'center' }, K('Alarma del recreo'), h(Led, { on: l, col: AMB, lab: l ? '¡BIIIP!' : 'silencio' }), Code(ok ? ['void setup() {', '  pinMode(8, OUTPUT);', '}', 'void loop() {', '  digitalWrite(8, HIGH);', '  delay(3000);', '  digitalWrite(8, LOW);', '  delay(1000);', '}'] : ['// completen el diagrama…']))),
        'Diagrama → código', { t: 'Del diagrama al código', d: 'Elijan la instrucción que corresponde a cada paso del diagrama de la alarma del recreo.' }, ['Del diagrama al código', ['Óvalo de INICIO → void setup() {', 'Rectángulo de acción → una instrucción (pinMode, digitalWrite, delay).', 'La flecha que regresa → loop().'], 'Los programadores profesionales dibujan el diagrama antes de escribir el código: es su plano.']);
    }
    const PRED = [[['void loop() {', '  digitalWrite(13, HIGH);', '  delay(1000);', '  digitalWrite(13, LOW);', '  delay(1000);', '}'], 0, [1000, 1000]], [['void setup() {', '  pinMode(13, OUTPUT);', '  digitalWrite(13, HIGH);', '}', 'void loop() {', '}'], 1, [1, 0]], [['void loop() {', '  digitalWrite(13, HIGH);', '  digitalWrite(13, LOW);', '}'], 2, [40, 40]], [['void loop() {', '  digitalWrite(13, HIGH);', '  delay(200);', '  digitalWrite(13, LOW);', '  delay(1800);', '}'], 3, [200, 1800]]];
    const POPT = ['Parpadea cada segundo', 'Queda encendido siempre', 'Parpadea tan rápido que no se ve', 'Destello corto cada 2 segundos'];
    function PredCard({ code, i, val, set, sim }) { const l = useBlink(sim[0], sim[1] || 1, val != null && sim[1] !== 0); return Card({ gap: 8 }, Code(code), Row({}, ...POPT.map((o, k) => Chip(o, val === k, () => set(k), BLUE))), val != null ? Row({ gap: 10 }, h(Led, { on: sim[1] === 0 ? true : sim[0] < 50 ? true : l }), T('Simulación del programa ' + (i + 1), { color: MUTE, fontSize: 15 })) : null); }
    function RPred(p) {
      const items = p.adaptado ? [PRED[0], PRED[1]] : PRED, [r, setR] = useState({}), listo = items.every((_, i) => r[i] != null);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 14 }, Grid(320, ...items.map(([code, a, sim], i) => h(PredCard, { key: i, code, i, sim, val: r[i], set: k => setR(Object.assign({}, r, { [i]: k })) }))),
        Row({}, Btn('Comprobar', () => { const mal = items.findIndex((x, i) => r[i] !== x[1]); p.check(mal < 0, mal < 0 ? '¡Exacto! Saben leer un programa y predecir lo que hará antes de subirlo.' : 'Revisen el programa ' + (mal + 1) + '. ' + ['Hay 1000 ms encendido y 1000 ms apagado.', 'Se enciende en setup() (una vez) y loop() está vacío.', 'Sin delay(), el cambio es tan rápido que el ojo no lo ve.', '200 ms encendido y 1800 ms apagado: un destello corto.'][items[mal][1]], 'pred'); }, { dis: !listo, bg: TEAL }), ayuda(p, 'Sumen los delay de cada vuelta. Si no hay delay, todo pasa en microsegundos. Si loop() está vacío, nada cambia.'))),
        'Predecir', { t: '¿Qué hará el LED?', d: 'Lean cada programa y predigan qué hace el LED. Después miren la simulación.' }, ['Predecir el comportamiento', ['Lean línea por línea, como el Arduino.', 'Sumen los tiempos de delay para saber cuánto dura cada vuelta.', 'Lo que está en setup() pasa una sola vez.'], 'Antes de subir un programa al robot, los equipos de competencia lo «leen en voz alta» para predecir errores.']);
    }
    const RETOS = [
      { id: 'donde', n: '¿setup o loop?', ic: h(Icon, { k: 'pasos', s: 44 }), C: RDonde, ad: true, nivel: 1 },
      { id: 'partes', n: 'Partes del programa', ic: h(Icon, { k: 'caja', s: 44 }), C: RPartes, ad: true, nivel: 1 },
      { id: 'orden', n: 'Ordena el programa', ic: h(Icon, { k: 'contador', s: 44 }), C: ROrdena, ad: true, nivel: 1 },
      { id: 'tiempos', n: 'Ajusta el delay', ic: h(Icon, { k: 'barras', s: 44 }), C: RTiempos, ad: true, nivel: 2 },
      { id: 'sema', n: 'Programa el semáforo', ic: h(Icon, { k: 'lampara', s: 44 }), C: RSema, ad: false, nivel: 2 },
      { id: 'sint', n: 'Detective de sintaxis', ic: h(Icon, { k: 'lupa', s: 44 }), C: RSint, ad: false, nivel: 2 },
      { id: 'diag', n: 'Del diagrama al código', ic: h(Icon, { k: 'puertas', s: 44 }), C: RDiag, ad: false, nivel: 3 },
      { id: 'pred', n: '¿Qué hará el LED?', ic: h(Icon, { k: 'termo', s: 44 }), C: RPred, ad: false, nivel: 3 }];
    const META = { q: '¿Qué fue lo más difícil hoy?', o: ['Saber qué va en setup y qué en loop', 'Calcular los tiempos del delay', 'Encontrar errores de escritura', 'Pasar del diagrama al código', 'Nada, fue fácil'] };
    make.c = { S, RETOS, META, Flujo, curso: '8vo', titulo: 'Del diagrama al código' };
    return make.c;
  }
  window.CLASE8 = { make };
})();

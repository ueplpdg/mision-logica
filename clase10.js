// Clase interactiva · 10mo EGB · Unidad 1 · Diseño de la solución tecnológica
(function () {
  let INK, PAPER, MUTE, LINE, TEAL, AMB, RED, BLUE, OKC, CARD, SINK, DARK, SUNK, SELB, OFF, DIS, DIST, FT, F1, F2, CLARO;
  const TEMAS = { claro: { INK: '#14181c', PAPER: '#f4f6f7', MUTE: '#4a5760', LINE: '#c3ced4', TEAL: '#0b7d6e', AMB: '#a86200', RED: '#c23b30', BLUE: '#2456b8', OKC: '#1d7a44', CARD: '#ffffff', SINK: '#14181c', DARK: '#ffffff', SUNK: '#eef2f4', SELB: '#ffe7a3', OFF: '#e1e7ea', DIS: '#d5dde1', DIST: '#6f7c84', FT: 'clamp(19px,1.7vw,30px)', F1: 'clamp(34px,4.2vw,76px)', F2: 'clamp(23px,2.3vw,40px)' },
    oscuro: { INK: '#e8f1f2', PAPER: '#0b1218', MUTE: '#9fb0ba', LINE: '#2c3e4a', TEAL: '#3fd0b8', AMB: '#f0a726', RED: '#ff7b72', BLUE: '#6ea8ff', OKC: '#7fe0a0', CARD: '#13202a', SINK: '#14181c', DARK: '#06121a', SUNK: SUNK, SELB: SELB, OFF: OFF, DIS: DIS, DIST: DIST, FT: 'clamp(17px,1.5vw,24px)', F1: 'clamp(30px,3.6vw,64px)', F2: 'clamp(21px,2vw,34px)' } };
  function TEMA(t) { const x = TEMAS[t] || TEMAS.claro; ({ INK, PAPER, MUTE, LINE, TEAL, AMB, RED, BLUE, OKC, CARD, SINK, DARK, SUNK, SELB, OFF, DIS, DIST, FT, F1, F2 } = x); CLARO = t !== 'oscuro'; }
  const HEAD = "'Archivo Black',sans-serif", MONO = "'IBM Plex Mono',monospace";

  function make(React) {
    const tm = window.__claseTema || 'claro'; if (make.c && make.t === tm) return make.c; make.t = tm; TEMA(tm);
    const { useState, useEffect, useRef } = React, h = React.createElement;
    const D = (st, ...ch) => h('div', { style: st }, ...ch);
    const T = (t, st) => h('div', { style: Object.assign({ fontSize: FT, lineHeight: 1.45, color: INK, textWrap: 'pretty' }, st || {}) }, t);
    const H1 = (t, st) => h('div', { style: Object.assign({ textShadow: CLARO ? 'none' : '0 0 22px rgba(63,208,184,.22)', fontFamily: HEAD, fontSize: F1, lineHeight: 1.04, color: INK, letterSpacing: '-.01em', textWrap: 'balance' }, st || {}) }, t);
    const H2 = (t, st) => h('div', { style: Object.assign({ fontFamily: HEAD, fontSize: F2, lineHeight: 1.1, color: INK }, st || {}) }, t);
    const K = (t, c) => h('div', { style: { fontFamily: MONO, fontSize: 'clamp(12px,.95vw,16px)', letterSpacing: '.14em', fontWeight: 600, color: c || MUTE, textTransform: 'uppercase' } }, t);
    const B = t => h('b', null, t);
    const Card = (st, ...ch) => D(Object.assign({ background: CARD, border: '2px solid ' + LINE, borderRadius: 10, padding: 'clamp(14px,1.4vw,24px)', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }, st || {}, st && st.borderColor ? { boxShadow: GLOW(st.borderColor) } : {}), ...ch);
    const Btn = (t, onClick, o) => { o = o || {}; return h('button', { onClick, disabled: o.dis, style: { fontFamily: o.head === false ? 'inherit' : HEAD, fontSize: o.fs || 'clamp(15px,1.25vw,20px)', padding: o.pad || '12px 20px', background: o.dis ? DIS : o.bg || INK, color: o.dis ? DIST : o.c || DARK, border: '2px solid ' + (o.dis ? DIS : o.bd || o.bg || INK), boxShadow: o.dis || o.bg === CARD ? 'none' : '0 0 18px ' + (o.bg || INK) + '33', cursor: o.dis ? 'default' : 'pointer', textAlign: 'left', lineHeight: 1.2 } }, t); };
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
    const TeoToggle = (p, args) => { const [v, setV] = useState(!p.intentos && !p.experto); return v ? D({ display: 'flex', flexDirection: 'column', gap: 8 }, Teo(p, ...args), Btn('Ocultar teoría', () => setV(false), { bg: CARD, c: BLUE, bd: BLUE, fs: 15, pad: '8px 14px' })) : Btn('Ver la teoría (no resta puntos)', () => setV(true), { bg: CARD, c: BLUE, bd: BLUE, fs: 15, pad: '8px 14px' }); };
    function Caja({ tipo, nombre, valor, cte, flash }) {
      return D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 120 },
        D({ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: cte ? RED : BLUE, letterSpacing: '.08em' }, (cte ? 'const ' : '') + tipo),
        D({ width: 130, height: 86, border: '3px solid ' + (cte ? RED : BLUE), borderRadius: 8, color: INK, background: flash ? SELB : SUNK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 30, position: 'relative', transition: 'background .3s' }, String(valor), cte ? D({ position: 'absolute', right: 6, top: 4, fontFamily: MONO, fontSize: 11, color: RED, fontWeight: 700 }, 'FIJA') : null),
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
    const GLOW = c => CLARO ? '0 2px 0 ' + c + '66' : '0 0 0 1px ' + c + '44, 0 0 24px ' + c + '30';
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
          ...[...Array(show)].map((_, i) => D({ key: i, flex: '0 0 auto', width: Math.max(16, b / a * 260), height: 30, borderRadius: 4, background: op === '/' ? 'rgba(240,167,38,.25)' : OFF, border: '2px solid ' + (op === '/' ? AMB : '#41525c'), boxShadow: op === '/' ? GLOW(AMB) : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, color: INK }, String(b))),
          q > show ? D({ fontFamily: MONO, color: MUTE }, '…') : null, r ? D({ width: Math.max(12, r / a * 260), height: 30, borderRadius: 4, background: op === '%' ? 'rgba(255,123,114,.28)' : OFF, border: '2px dashed ' + (op === '%' ? RED : '#41525c'), boxShadow: op === '%' ? GLOW(RED) : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 12, color: INK }, String(r)) : null),
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
      D({ display: 'flex', flexDirection: 'column', gap: 22 }, K('Robótica · 10mo EGB · Unidad 1'), H1('Pensar como ingenieros: planificar un sistema automático'), T('Hoy no vamos a construir todavía: vamos a aprender a planificar. Un ingeniero primero entiende el problema, elige las piezas y diseña el algoritmo.'), p.codigo ? Card({ background: INK, color: '#fff', borderColor: INK }, K('Código de la sesión', '#fff'), D({ fontFamily: HEAD, fontSize: 'clamp(40px,5vw,80px)', color: '#fff', letterSpacing: '.08em' }, p.codigo)) : null),
      Card({ gap: 16 }, K('Hoy aprenderemos a…', TEAL), T(['Aplicar el ', B('proceso de diseño en ingeniería'), ' para planificar un sistema con Arduino que resuelva una necesidad del colegio.']), K('Sabremos que lo logramos si…', TEAL),
        ...['Separamos un sistema en entrada, proceso y salida.', 'Elegimos sensores y actuadores adecuados y sabemos si su señal es digital o analógica.', 'Diseñamos un diagrama de flujo que funcione en la simulación.'].map((x, i) => D({ display: 'flex', gap: 12, borderTop: '2px solid ' + LINE, paddingTop: 12 }, D({ fontFamily: HEAD, fontSize: 22, color: TEAL }, String(i + 1)), T(x))), Say(p, 'Hoy aprenderemos a aplicar el proceso de diseño en ingeniería para planificar un sistema con Arduino. Lo lograremos si separamos un sistema en entrada, proceso y salida, elegimos sensores y actuadores, y diseñamos un diagrama de flujo que funcione.'))) });
    S.push({ id: 'acuerdos', t: 'Acuerdos y roles', r: p => D({ display: 'flex', flexDirection: 'column', gap: 22 }, H1('Cómo trabajamos hoy'),
      Grid(260, ...[['Mano arriba', 'Cuando el docente levanta la mano, silencio y manos fuera del teclado.'], ['Respeto', 'Escuchamos la idea del otro antes de decidir. Equivocarse es parte de diseñar.'], ['Cuidado', 'Computadoras, mouse y sillas quedan como los encontramos.']].map(([a, b]) => Card({}, H2(a), T(b)))),
      Card({ borderColor: TEAL }, K('Roles en la pareja · cambian en cada reto', TEAL), Grid(300, D({ display: 'flex', flexDirection: 'column', gap: 6 }, H2('Ingeniero/a de diseño'), T('Maneja el mouse y arma el sistema.')), D({ display: 'flex', flexDirection: 'column', gap: 6 }, H2('Ingeniero/a de pruebas'), T('Lee las instrucciones, revisa la simulación y dice si funciona.'))))) });
    const PROBS = [['🪴', 'La planta del patio se seca los fines de semana.'], ['💡', 'Las luces del laboratorio quedan encendidas en la noche.'], ['🚪', 'La puerta del laboratorio queda abierta.'], ['🌡️', 'En las aulas del 3.er piso hace mucho calor.'], ['🗑️', 'Nadie sabe cuándo está lleno el basurero.'], ['🔔', 'En el comedor hay tanto ruido que no se escucha.']];
    S.push({ id: 'motiv', t: 'Motivación', r: p => D({ display: 'flex', flexDirection: 'column', gap: 20 }, K('Un día en el colegio'), H1('¿Qué problema del colegio resolverían con un sistema automático?'),
      Vivo(p, 'motiv', 'Elijan el problema que más les gustaría resolver', PROBS.map(x => x[0] + '  ' + x[1]), null)) });
    S.push({ id: 'previos', t: 'Saberes previos', r: p => Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 18 }, K('Lo que ya sabemos'), H1('¿Se acuerdan de los diagramas de flujo?'), T('En el taller anterior armaron diagramas para el colegio. Hoy los usamos como plano del sistema.'),
      D({ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }, ...[['ini', 'A'], ['proc', 'B'], ['dec', 'C'], ['io', 'D']].map(([t, l]) => D({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, Flujo({ nodos: [{ t, txt: t === 'dec' ? '¿ ?' : '      ', si: {}, no: {} }].map(x => t === 'dec' ? { t, txt: '¿ ?', si: { t: 'proc', txt: '…' }, no: { t: 'proc', txt: '…' } } : x), compact: true }), D({ fontFamily: HEAD, fontSize: 24 }, l))))),
      Vivo(p, 'previos', '¿Qué símbolo se usa para tomar una decisión?', ['A · óvalo', 'B · rectángulo', 'C · rombo', 'D · paralelogramo'], 2)) });
    const CICLO = ['Identificar el problema', 'Investigar soluciones', 'Diseñar el algoritmo', 'Planificar componentes', 'Construir y probar'];
    function Ciclo(p) {
      const [orden] = useState(() => [3, 0, 4, 2, 1]), [elegido, setE] = useState([]);
      const listo = elegido.length === 5, ok = listo && elegido.every((v, i) => v === i);
      useEffect(() => { if (listo && !p.docente) p.onResp('ciclo', elegido.join(''), ok); }, [listo]);
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción'), H1('El proceso de diseño en ingeniería'), T('Toquen las etapas en el orden en que las haría un equipo de ingenieros.'), Say(p, 'Toquen las etapas en el orden en que las haría un equipo de ingenieros.'),
        Row({}, ...orden.map(i => Chip(CICLO[i], elegido.includes(i), () => { if (!elegido.includes(i) && !listo) setE(elegido.concat([i])); }, TEAL))), Row({}, Btn('Reiniciar', () => setE([]), { bg: '#fff', c: INK }))),
        Card({}, K('Su orden'), ...[0, 1, 2, 3, 4].map(k => D({ display: 'flex', gap: 12, alignItems: 'center', borderTop: k ? '2px solid ' + LINE : 'none', paddingTop: k ? 10 : 0 }, D({ fontFamily: HEAD, fontSize: 24, width: 28, color: TEAL }, String(k + 1)), T(elegido[k] != null ? CICLO[elegido[k]] : '…', { color: elegido[k] != null ? (listo ? (elegido[k] === k ? OKC : RED) : INK) : MUTE, fontWeight: 600 }))),
          listo ? Fb(ok, ok ? 'Primero entendemos el problema, luego investigamos, diseñamos el algoritmo, planificamos las piezas y al final construimos y probamos. Hoy trabajamos las etapas 1 a 4.' : 'Piensen: ¿se puede elegir piezas sin saber qué problema resolvemos? ¿Se puede probar algo que no se ha diseñado? Reinicien e intenten otra vez.') : null));
    }
    S.push({ id: 'ciclo', t: 'Proceso de diseño', r: p => h(Ciclo, p) });
    const COMP = [['Sensor de humedad del suelo', 'E', '🌱'], ['Sensor de luz (LDR)', 'E', '☀️'], ['Sensor ultrasónico', 'E', '📡'], ['Sensor PIR de movimiento', 'E', '🚶'], ['Pulsador', 'E', '🔘'], ['Sensor de temperatura', 'E', '🌡️'], ['Arduino UNO', 'P', '🧠'], ['Bomba de agua', 'S', '💧'], ['Servomotor', 'S', '⚙️'], ['LED / lámpara', 'S', '💡'], ['Zumbador', 'S', '🔔'], ['Pantalla LCD', 'S', '🖥️'], ['Ventilador', 'S', '🌀']];
    const EPS_N = { E: 'Entrada', P: 'Proceso', S: 'Salida' }, EPS_C = { E: BLUE, P: AMB, S: TEAL };
    function Clasif(p) {
      const [sel, setSel] = useState(null), [pos, setPos] = useState({});
      const list = p.lista || COMP, hechos = Object.keys(pos).length, bien = Object.keys(pos).filter(k => list[k][1] === pos[k]).length;
      const poner = b => { if (sel == null) return; const n = Object.assign({}, pos, { [sel]: b }); setPos(n); setSel(null); if (Object.keys(n).length === list.length && p.onDone) p.onDone(Object.keys(n).filter(k => list[k][1] === n[k]).length, list.length); };
      return D({ display: 'flex', flexDirection: 'column', gap: 14 },
        Row({}, ...list.map((c, i) => pos[i] == null ? Chip(c[2] + '  ' + c[0], sel === i, () => setSel(i), INK) : null)),
        sel != null ? T(['¿Dónde va ', B(list[sel][0]), '? Toquen la caja.'], { color: BLUE }) : hechos < list.length ? T('Toquen un componente y después la caja donde va.', { color: MUTE }) : null,
        Grid(220, ...(p.soloES ? ['E', 'S'] : ['E', 'P', 'S']).map(b => h('div', { key: b, onClick: () => poner(b), style: { border: '3px solid ' + EPS_C[b], background: sel != null ? '#fff' : '#fbfaf6', padding: 14, minHeight: 120, cursor: sel != null ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', gap: 8 } },
          D({ fontFamily: HEAD, fontSize: 'clamp(18px,1.6vw,26px)', color: EPS_C[b] }, EPS_N[b]), T(b === 'E' ? 'Lee datos del entorno' : b === 'P' ? 'Decide con el algoritmo' : 'Actúa sobre el mundo', { fontSize: 15, color: MUTE }),
          ...Object.keys(pos).filter(k => pos[k] === b).map(k => D({ key: k, fontWeight: 600, fontSize: 'clamp(14px,1.15vw,18px)', color: hechos === list.length ? (list[k][1] === b ? OKC : RED) : INK }, list[k][2] + ' ' + list[k][0] + (hechos === list.length && list[k][1] !== b ? ' → ' + EPS_N[list[k][1]] : '')))))),
        hechos === list.length ? Row({}, Fb(bien === list.length, bien + ' de ' + list.length + ' bien ubicados. Los sensores leen (entrada), el Arduino decide (proceso) y los actuadores hacen algo (salida).'), Btn('Intentar otra vez', () => setPos({}), { bg: '#fff', c: INK })) : null);
    }
    S.push({ id: 'eps', t: 'Entrada · proceso · salida', r: p => D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Construcción'), H1('Todo sistema tiene entrada, proceso y salida'), Say(p, 'Todo sistema automático tiene entrada, proceso y salida. Los sensores son la entrada, el Arduino es el proceso y los actuadores son la salida.'),
      h(Clasif, Object.assign({}, p, { onDone: (b, n) => { if (!p.docente) p.onResp('eps', b + '/' + n, b === n); } }))) });
    function Senales(p) {
      const [btn, setBtn] = useState(0), [ldr, setLdr] = useState(520), [hist, setHist] = useState(() => Array(30).fill(0).map((_, i) => ({ d: 0, a: 520 })));
      useEffect(() => { const t = setInterval(() => setHist(hh => hh.slice(1).concat([{ d: btnR.current, a: ldrR.current }])), 250); return () => clearInterval(t); }, []);
      const btnR = useRef(0), ldrR = useRef(520); btnR.current = btn; ldrR.current = ldr;
      const graf = (k, max, col) => h('svg', { viewBox: '0 0 300 80', style: { width: '100%', height: 'auto', background: '#fff', border: '2px solid ' + INK } }, h('polyline', { points: hist.map((v, i) => (i * 10) + ',' + (74 - v[k] / max * 66)).join(' '), fill: 'none', stroke: col, strokeWidth: 3, strokeLinejoin: k === 'd' ? 'miter' : 'round' }));
      return Grid(380, D({ display: 'flex', flexDirection: 'column', gap: 14 }, K('Construcción'), H1('Señal digital o analógica'), T(['Una señal ', B('digital'), ' tiene solo dos valores: 0 o 1 (apagado o encendido). Una señal ', B('analógica'), ' puede tomar muchos valores: en Arduino, de 0 a 1023.']),
        Card({ gap: 10 }, Row({ justifyContent: 'space-between' }, H2('Pulsador · digital'), D({ fontFamily: HEAD, fontSize: 30, color: BLUE }, String(btn))), h('button', { onMouseDown: () => setBtn(1), onMouseUp: () => setBtn(0), onMouseLeave: () => setBtn(0), onTouchStart: () => setBtn(1), onTouchEnd: () => setBtn(0), style: { fontFamily: HEAD, fontSize: 18, padding: '14px', background: btn ? BLUE : '#fff', color: btn ? '#fff' : INK, border: '3px solid ' + BLUE, cursor: 'pointer' } }, 'Mantener presionado'), graf('d', 1, BLUE)),
        Card({ gap: 10 }, Row({ justifyContent: 'space-between' }, H2('Sensor de luz · analógica'), D({ fontFamily: HEAD, fontSize: 30, color: AMB }, String(ldr))), Slider('Cantidad de luz', ldr, 0, 1023, setLdr), graf('a', 1023, AMB))),
        Vivo(p, 'senal', 'El sensor de humedad del suelo mide de 0 % a 100 %. Su señal es…', ['Digital (solo seco o mojado)', 'Analógica (muchos valores)'], 1));
    }
    S.push({ id: 'senal', t: 'Señales', r: p => h(Senales, p) });
    function Resuelto(p) {
      const [hum, setHum] = useState(55), [um, setUm] = useState(30), [paso, setPaso] = useState(4);
      const riega = hum < um, nodos = [{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: 'Leer humedad (A0)' }, { t: 'dec', txt: '¿humedad < ' + um + ' %?', si: { t: 'proc', txt: 'Encender bomba' }, no: { t: 'proc', txt: 'Apagar bomba' } }]; nodos.loop = 'volver a «Leer humedad»';
      const pasos = [['1 · Problema', 'La planta del patio se seca cuando nadie la riega.'], ['2 · Entrada', 'Sensor de humedad del suelo: señal analógica (0–100 %).'], ['3 · Salida', 'Bomba de agua: se enciende o se apaga.'], ['4 · Algoritmo', 'Si la humedad baja del umbral, regar; si no, no regar. Y repetir siempre.']];
      return D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Ejercicio resuelto · paso a paso'), H1('Riego automático de la planta del patio'),
        Row({}, ...pasos.map((x, i) => Chip(x[0], i < paso, () => setPaso(i + 1), TEAL))),
        Grid(300, Card({}, ...pasos.slice(0, paso).map(x => D({ display: 'flex', flexDirection: 'column', gap: 2 }, K(x[0], TEAL), T(x[1])))),
          Card({ alignItems: 'center' }, K('Diagrama'), h(Flujo, { nodos, activo: paso >= 4 ? (riega ? '2s' : '2n') : null })),
          Card({ gap: 14 }, K('Simulación'), h(Planta, { hum, bomba: riega }), Slider('Humedad del suelo', hum, 0, 100, setHum, ' %'), Slider('Umbral (cuándo regar)', um, 5, 95, setUm, ' %'),
            T(riega ? 'Humedad ' + hum + ' % < ' + um + ' %: la bomba riega.' : 'Humedad ' + hum + ' % ≥ ' + um + ' %: la bomba está apagada.', { fontWeight: 600, color: riega ? BLUE : MUTE }))));
    }
    S.push({ id: 'resuelto', t: 'Ejercicio resuelto', r: p => h(Resuelto, p) });
    function Guiada(p) {
      const [ent, setEnt] = useState(''), [cond, setCond] = useState(''), [si, setSi] = useState(''), [luz, setLuz] = useState(700), [res, setRes] = useState(null);
      const eval1 = l => { const c = cond === '<' ? l < 300 : cond === '>' ? l > 300 : false; return ent === 'ldr' ? (c ? si === 'on' : si === 'off') : false; };
      const on = eval1(luz), probar = () => { const casos = [[100, true], [250, true], [800, false]], ok = ent === 'ldr' && casos.every(([l, e]) => eval1(l) === e); setRes(ok); if (!p.docente) p.onResp('guiada', ent + cond + si, ok); };
      const nodos = [{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: ent === 'ldr' ? 'Leer luz (LDR)' : ent === 'pir' ? 'Leer movimiento (PIR)' : ent === 'us' ? 'Leer distancia' : 'Leer ¿?' }, { t: 'dec', txt: cond ? '¿luz ' + cond + ' 300?' : '¿ ?', si: { t: 'proc', txt: si === 'on' ? 'Encender lámpara' : si === 'off' ? 'Apagar lámpara' : '¿ ?' }, no: { t: 'proc', txt: si === 'on' ? 'Apagar lámpara' : si === 'off' ? 'Encender lámpara' : '¿ ?' } }]; nodos.loop = 'repetir';
      return D({ display: 'flex', flexDirection: 'column', gap: 16 }, K('Práctica guiada · en parejas'), H1('La luz del pasillo debe encenderse sola al anochecer'), Say(p, 'La luz del pasillo debe encenderse sola al anochecer. Elijan la entrada, la condición y la acción. Muevan la luz del día y prueben.'),
        Grid(300, Card({ gap: 12 }, K('1 · Entrada'), Row({}, Chip('Sensor de luz', ent === 'ldr', () => setEnt('ldr')), Chip('Sensor PIR', ent === 'pir', () => setEnt('pir')), Chip('Ultrasónico', ent === 'us', () => setEnt('us'))),
          K('2 · Condición'), Row({}, Chip('luz < 300 (poca luz)', cond === '<', () => setCond('<')), Chip('luz > 300 (mucha luz)', cond === '>', () => setCond('>'))),
          K('3 · Si se cumple…'), Row({}, Chip('Encender lámpara', si === 'on', () => setSi('on')), Chip('Apagar lámpara', si === 'off', () => setSi('off'))),
          Btn('Probar en 3 momentos del día', probar, { dis: !ent || !cond || !si, bg: TEAL }), res != null ? Fb(res, res ? 'Con poca luz (100 y 250) se enciende y con mucha luz (800) se apaga. ¡Ese es el comportamiento esperado!' : ent !== 'ldr' ? 'Para saber si anocheció, el sistema tiene que medir la luz. ¿Qué sensor mide la luz?' : 'Revisen la condición y la acción: al anochecer hay POCA luz, y en ese caso la lámpara debe ENCENDERSE.') : null),
          Card({ alignItems: 'center' }, K('Diagrama que están armando'), h(Flujo, { nodos, activo: ent && cond && si ? (cond === '<' ? (luz < 300 ? '2s' : '2n') : (luz > 300 ? '2s' : '2n')) : null })),
          Card({ gap: 12 }, K('Simulación'), h(Lampara, { on, luz }), Slider('Luz del día (LDR)', luz, 0, 1023, setLuz))));
    }
    S.push({ id: 'guiada', t: 'Práctica guiada', r: p => h(Guiada, p) });
    S.push({ id: 'aretos', t: 'Modo reto', r: p => D({ display: 'flex', flexDirection: 'column', gap: 20 }, K('Ahora ustedes'), H1('Modo reto: diseñen sistemas que funcionen'),
      Grid(280, ...[['Elijan', 'Hay 8 retos. Pueden empezar por el que quieran. La nota sale de los 6 mejores; los demás son extra.'], ['Prueben', 'Cada sistema tiene simulación: si el diagrama está mal, lo verán fallar.'], ['Mejoren', 'Cada error trae una pista. Pedir la solución resta puntos, pero se aprende igual.'], ['Roten', 'En cada reto cambien de rol: diseño y pruebas.']].map(([a, b]) => Card({}, H2(a), T(b)))),
      p.docente ? T('Cuando estén listos, presione «Iniciar retos» en la barra de abajo.', { color: MUTE }) : T('Esperen a que el docente abra los retos.', { color: MUTE })) });

    // ================= RETOS =================
    function Reto(p, body, nombre, enun) { return D({ display: 'flex', flexDirection: 'column', gap: 16 }, Row({ justifyContent: 'space-between' }, K('Reto · ' + nombre, TEAL), K('Intentos ' + (p.intentos || 0), MUTE)), H1(enun.t, { fontSize: 'clamp(26px,2.8vw,46px)' }), T(enun.d), Say(p, enun.t + '. ' + enun.d), body); }
    const ayuda = (p, txt) => p.sinAyuda ? null : p.verPista ? Card({ borderColor: AMB, background: '#fff6e3' }, K('Pista', AMB), T(txt)) : Btn('Ver una pista (−1 punto)', p.pedirPista, { bg: '#fff', c: AMB, bd: AMB });

    function REps(p) {
      const lista = p.adaptado ? [COMP[0], COMP[1], COMP[7], COMP[9]] : COMP.filter((_, i) => i !== 6).slice(0).sort((a, b) => (a[0].length * 7 + p.seed) % 11 - (b[0].length * 7 + p.seed) % 11).slice(0, 8).concat([COMP[6]]);
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 12 }, h(Clasif, { lista, soloES: p.adaptado, onDone: (b, n) => p.check(b === n, b === n ? 'Todos bien ubicados.' : 'Hay ' + (n - b) + ' mal ubicados. Recuerden: ¿lee, decide o actúa?', 'eps') }), ayuda(p, 'Si el componente MIDE algo (luz, humedad, distancia), es entrada. Si HACE algo (suena, se mueve, alumbra, bombea), es salida.')), 'Clasificar',
        { t: 'Clasifiquen los componentes del kit', d: p.adaptado ? 'Toquen cada dibujo y pónganlo en Entrada (mide) o en Salida (hace).' : 'Ubiquen cada componente en entrada, proceso o salida.' });
    }
    const BLOQ = [['V', 'Verde 5 s'], ['A', 'Amarillo 2 s'], ['R', 'Rojo 5 s'], ['L', 'Volver al inicio'], ['F', 'FIN'], ['S', 'Leer sensor']];
    function RSemaforo(p) {
      const n = p.adaptado ? 3 : 4, [sl, setSl] = useState(() => p.adaptado ? [null, null, null] : [null, null, null, null]), [luz, setLuz] = useState(-1), [run, setRun] = useState(false), tm = useRef(null);
      useEffect(() => () => clearTimeout(tm.current), []);
      const ejecutar = () => {
        if (sl.some(x => !x)) return; const seq = p.adaptado ? sl.concat(['L']) : sl; setRun(true); let i = 0, vueltas = 0;
        const paso = () => { if (i >= seq.length) { setLuz(-1); setRun(false); fin(seq, false); return; } const b = seq[i];
          if (b === 'L') { vueltas++; if (vueltas >= 2) { setLuz(-1); setRun(false); fin(seq, true); return; } i = 0; tm.current = setTimeout(paso, 150); return; }
          if (b === 'F') { setLuz(-1); setRun(false); fin(seq, false); return; }
          setLuz({ V: 0, A: 1, R: 2 }[b] != null ? { V: 0, A: 1, R: 2 }[b] : -1); i++; tm.current = setTimeout(paso, b === 'A' ? 500 : 900); };
        paso();
      };
      const fin = (seq, bucle) => { const core = seq.filter(x => x !== 'L').join(''), ok = bucle && core === 'VAR';
        p.check(ok, ok ? 'Verde → amarillo → rojo, y vuelve a empezar. Un semáforo es un ciclo infinito, como loop().' : !bucle ? 'El semáforo se detuvo: un semáforo nunca termina. ¿Qué bloque hace que vuelva a empezar?' : core.includes('S') ? 'Este semáforo no usa sensores: funciona solo con tiempos.' : 'El orden de las luces no es seguro: después del verde debe venir el amarillo, para avisar antes del rojo.', !bucle ? 'sinbucle' : 'orden'); };
      const pal = p.adaptado ? BLOQ.slice(0, 3) : BLOQ;
      return Reto(p, Grid(300, Card({ gap: 12 }, K('Bloques'), Row({}, ...pal.map(([k, t]) => Chip(t, false, () => { const i = sl.indexOf(null); if (i >= 0 && !run) { const ns = sl.slice(); ns[i] = k; setSl(ns); } }, k === 'V' ? OKC : k === 'A' ? AMB : k === 'R' ? RED : INK))),
        K('Su diagrama (toquen un paso para quitarlo)'), ...sl.map((x, i) => h('div', { key: i, onClick: () => { if (!run) { const ns = sl.slice(); ns[i] = null; setSl(ns); } }, style: { border: '2px dashed ' + (x ? INK : LINE), padding: '10px 14px', fontWeight: 600, fontSize: 'clamp(15px,1.25vw,19px)', cursor: 'pointer', background: '#fff' } }, (i + 1) + '. ' + (x ? BLOQ.find(b => b[0] === x)[1] : '…'))),
        p.adaptado ? D({ border: '2px solid ' + INK, padding: '10px 14px', fontWeight: 600 }, '4. Volver al inicio ↺') : null,
        Row({}, Btn(run ? 'Ejecutando…' : '▶ Ejecutar', ejecutar, { dis: run || sl.some(x => !x), bg: TEAL }), Btn('Borrar', () => !run && setSl(sl.map(() => null)), { bg: '#fff', c: INK })), ayuda(p, 'El orden real es verde, amarillo y rojo. Y al final, en lugar de terminar, el diagrama debe volver al inicio.')),
        Card({ alignItems: 'center', gap: 14 }, K('Simulación del semáforo de la entrada'), h(Semaforo, { luz }), T(run ? 'Funcionando según su diagrama…' : 'Ejecuten para ver cómo funciona.', { color: MUTE, fontSize: 16 }))), 'Semáforo', { t: 'El semáforo de la entrada del colegio', d: p.adaptado ? 'Pongan las tres luces en orden. El semáforo vuelve a empezar solo.' : 'Armen el diagrama en ' + n + ' pasos. Debe funcionar siempre, sin detenerse.' });
    }
    function RRiego(p) {
      const [sen, setSen] = useState(p.adaptado ? 'hum' : ''), [op, setOp] = useState(p.adaptado ? '<' : ''), [um, setUm] = useState(p.adaptado ? 30 : 60), [acc, setAcc] = useState(''), [hum, setHum] = useState(50), [caso, setCaso] = useState(null);
      const decide = v => { const c = op === '<' ? v < um : op === '>' ? v > um : false; return acc === 'on' ? c : acc === 'off' ? !c : false; };
      const probar = () => { const casos = [[15, true], [28, true], [50, false], [85, false]], fallos = casos.filter(([v, e]) => sen !== 'hum' || decide(v) !== e);
        let i = 0; const anim = () => { if (i < casos.length) { setCaso(casos[i]); setHum(casos[i][0]); i++; setTimeout(anim, 650); } else { setCaso(null);
          const ok = !fallos.length; p.check(ok, ok ? 'Riega cuando la tierra está seca (15 % y 28 %) y no riega cuando está húmeda (50 % y 85 %).' : sen !== 'hum' ? 'Para saber si la tierra está seca hay que medir la humedad del suelo.' : op === '>' ? 'Con «>» la bomba riega cuando la tierra ya está húmeda: la planta se ahoga. ¿Qué comparación necesitan?' : (um < 29 || um > 49) ? 'El umbral no está bien: con ' + um + ' % la planta ' + (um < 29 ? 'se seca antes de recibir agua.' : 'recibe agua aunque ya esté húmeda.') + ' Prueben entre 30 % y 45 %.' : 'Revisen qué hace la bomba cuando la condición se cumple.', sen !== 'hum' ? 'sensor' : op === '>' ? 'operador' : (um < 29 || um > 49) ? 'umbral' : 'accion'); } };
        anim(); };
      const nodos = [{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: sen === 'hum' ? 'Leer humedad' : sen === 'ldr' ? 'Leer luz' : sen === 'pir' ? 'Leer movimiento' : 'Leer ¿?' }, { t: 'dec', txt: op ? '¿humedad ' + op + ' ' + um + ' %?' : '¿ ?', si: { t: 'proc', txt: acc === 'on' ? 'Encender bomba' : acc === 'off' ? 'Apagar bomba' : '¿ ?' }, no: { t: 'proc', txt: acc === 'on' ? 'Apagar bomba' : acc === 'off' ? 'Encender bomba' : '¿ ?' } }]; nodos.loop = 'repetir';
      const bomba = sen === 'hum' && op && acc ? decide(hum) : false;
      return Reto(p, Grid(300, Card({ gap: 12 }, !p.adaptado ? K('Entrada') : null, !p.adaptado ? Row({}, Chip('🌱 Humedad del suelo', sen === 'hum', () => setSen('hum')), Chip('☀️ Luz', sen === 'ldr', () => setSen('ldr')), Chip('🚶 Movimiento', sen === 'pir', () => setSen('pir'))) : null,
        !p.adaptado ? K('Comparación') : null, !p.adaptado ? Row({}, Chip('humedad <', op === '<', () => setOp('<')), Chip('humedad >', op === '>', () => setOp('>'))) : null, !p.adaptado ? Slider('Umbral', um, 0, 100, setUm, ' %') : null,
        K(p.adaptado ? 'Si la tierra está seca (menos de 30 %)…' : 'Si se cumple…'), Row({}, Chip('💧 Encender bomba', acc === 'on', () => setAcc('on')), Chip('✋ Apagar bomba', acc === 'off', () => setAcc('off'))),
        Btn(caso ? 'Probando…' : 'Probar con 4 tipos de tierra', probar, { dis: !!caso || !sen || !op || !acc, bg: TEAL }), ayuda(p, 'La tierra seca tiene POCA humedad. Entonces la bomba debe encenderse cuando la humedad sea MENOR que el umbral. Un buen umbral está entre 30 % y 45 %.')),
        Card({ alignItems: 'center' }, K('Diagrama'), h(Flujo, { nodos, activo: sen && op && acc ? (bomba === (acc === 'on') ? '2s' : '2n') : null, compact: true })),
        Card({ gap: 10 }, K(caso ? 'Probando: tierra al ' + caso[0] + ' %' : 'Simulación'), h(Planta, { hum, bomba }), Slider('Humedad', hum, 0, 100, v => !caso && setHum(v), ' %'))), 'Riego', { t: 'Riego automático de la planta', d: p.adaptado ? 'Elijan qué hace la bomba cuando la tierra está seca.' : 'Configuren el sistema: debe regar solo cuando la tierra esté seca.' });
    }
    function RPuerta(p) {
      const [dmax, setD] = useState(150), [abre, setAbre] = useState(0), [cierra, setCierra] = useState(90), [dist, setDist] = useState(200), [run, setRun] = useState(false);
      const ang = d => d < dmax ? abre : cierra;
      const probar = () => { setRun(true); const pts = [200, 140, 90, 40, 10, 60, 180]; let i = 0; const f = () => { if (i < pts.length) { setDist(pts[i++]); setTimeout(f, 450); } else { setRun(false);
        const okA = abre >= 80 && cierra <= 10, okD = dmax >= 30 && dmax <= 100, ok = okA && okD;
        p.check(ok, ok ? 'La puerta se abre cuando alguien está a menos de ' + dmax + ' cm y se cierra cuando se aleja.' : !okA ? 'Revisen los ángulos: abierto es 90° y cerrado es 0°. Ahora la puerta ' + (abre < 80 ? 'no se abre del todo' : 'no se cierra') + '.' : dmax > 100 ? 'Con ' + dmax + ' cm la puerta se abre con cualquiera que pase por el pasillo. Acerquen el umbral.' : 'Con ' + dmax + ' cm hay que pegarse a la puerta para que abra. Alejen un poco el umbral.', !okA ? 'angulos' : 'umbral'); } }; f(); };
      return Reto(p, Grid(300, Card({ gap: 12 }, Slider('Abrir si la distancia es menor que', dmax, 5, 200, setD, ' cm'), Slider('Ángulo del servo para ABRIR', abre, 0, 180, setAbre, '°'), Slider('Ángulo del servo para CERRAR', cierra, 0, 180, setCierra, '°'),
        Btn(run ? 'Probando…' : '▶ Simular una persona que llega y se va', probar, { dis: run, bg: TEAL }), ayuda(p, 'Un servo abierto suele estar en 90° y cerrado en 0°. La distancia para abrir debe ser cercana: entre 30 y 100 cm.')),
        Card({ alignItems: 'center' }, K('Diagrama'), h(Flujo, { nodos: Object.assign([{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: 'Medir distancia (ultrasónico)' }, { t: 'dec', txt: '¿distancia < ' + dmax + ' cm?', si: { t: 'proc', txt: 'Servo a ' + abre + '°' }, no: { t: 'proc', txt: 'Servo a ' + cierra + '°' } }], { loop: 'repetir' }), activo: dist < dmax ? '2s' : '2n', compact: true })),
        Card({ gap: 10 }, K('Simulación'), h(Puerta, { dist, ang: ang(dist) }), Slider('Distancia de la persona', dist, 0, 200, v => !run && setDist(v), ' cm'))), 'Puerta', { t: 'Puerta automática del laboratorio', d: 'Ajusten el sensor ultrasónico y el servomotor para que la puerta abra cuando alguien se acerque.' });
    }
    function RAlarma(p) {
      const [op, setOp] = useState(''), [noche, setNoche] = useState(true), [mov, setMov] = useState(false), [tabla, setTabla] = useState(null);
      const suena = (n, m) => op === 'Y' ? n && m : op === 'O' ? n || m : false;
      const probar = () => { const c = [[false, false], [false, true], [true, false], [true, true]].map(([n, m]) => ({ n, m, s: suena(n, m), e: n && m })); setTabla(c); const ok = c.every(x => x.s === x.e);
        p.check(ok, ok ? 'Solo suena de noche Y con movimiento. De día hay estudiantes: no debe sonar.' : 'Con «O» la alarma suena de día cada vez que alguien entra a clase. Revisen la tabla: ¿en qué caso SÍ debe sonar?', 'operador'); };
      return Reto(p, Grid(300, Card({ gap: 12 }, K('La alarma suena si…'), Row({}, Chip('es de noche  Y  hay movimiento', op === 'Y', () => setOp('Y')), Chip('es de noche  O  hay movimiento', op === 'O', () => setOp('O'))),
        Row({}, Chip(noche ? '🌙 Noche' : '☀️ Día', true, () => setNoche(!noche), noche ? '#1e2a40' : AMB), Chip(mov ? '🚶 Hay movimiento' : 'Sin movimiento', mov, () => setMov(!mov), RED)),
        Btn('Probar los 4 casos', probar, { dis: !op, bg: TEAL }), ayuda(p, 'Piensen en un martes a las 10 de la mañana: hay movimiento en el laboratorio porque hay clase. ¿Debería sonar?'),
        tabla ? h('table', { style: { borderCollapse: 'collapse', fontSize: 16, width: '100%' } }, h('tbody', null, h('tr', null, ...['Momento', 'Movimiento', 'Su alarma', 'Debería'].map(x => h('th', { key: x, style: { textAlign: 'left', borderBottom: '2px solid ' + INK, padding: 6 } }, x))),
          ...tabla.map((x, i) => h('tr', { key: i, style: { background: x.s === x.e ? '#e6f4ea' : '#fbe9e7' } }, h('td', { style: { padding: 6 } }, x.n ? 'Noche' : 'Día'), h('td', { style: { padding: 6 } }, x.m ? 'Sí' : 'No'), h('td', { style: { padding: 6, fontWeight: 700 } }, x.s ? 'Suena' : 'Silencio'), h('td', { style: { padding: 6 } }, x.e ? 'Suena' : 'Silencio'))))) : null),
        Card({ alignItems: 'center' }, K('Diagrama'), h(Flujo, { nodos: Object.assign([{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: 'Leer luz y PIR' }, { t: 'dec', txt: op ? '¿noche ' + op + ' movimiento?' : '¿ ?', si: { t: 'proc', txt: 'Sonar zumbador' }, no: { t: 'proc', txt: 'Silencio' } }], { loop: 'repetir' }), activo: op ? (suena(noche, mov) ? '2s' : '2n') : null, compact: true })),
        Card({ gap: 10 }, K('Simulación'), h(Alarma, { on: suena(noche, mov), noche, mov }))), 'Alarma', { t: 'Alarma nocturna del laboratorio', d: 'Usa dos sensores: luz (para saber si es de noche) y PIR (movimiento). Elijan cómo se combinan.' });
    }
    const SENS = [['Pulsador', 'D'], ['Sensor de luz (LDR)', 'A'], ['Sensor PIR de movimiento', 'D'], ['Sensor de humedad del suelo', 'A'], ['Sensor de temperatura', 'A'], ['Interruptor de fin de carrera', 'D'], ['Potenciómetro', 'A'], ['Sensor de lluvia (sí / no)', 'D']];
    function RSenal(p) {
      const [r, setR] = useState({}), [listo, setListo] = useState(false), n = Object.keys(r).length;
      const ver = () => { const b = SENS.filter((s, i) => r[i] === s[1]).length; setListo(true); p.check(b === SENS.length, b === SENS.length ? 'Digital: solo dos estados. Analógica: un rango de valores.' : b + ' de ' + SENS.length + '. Pregúntense: ¿puede dar «un poquito»? Si sí, es analógica.', 'senal'); };
      return Reto(p, D({ display: 'flex', flexDirection: 'column', gap: 12 }, Grid(260, ...SENS.map((s, i) => Card({ gap: 8, borderColor: listo ? (r[i] === s[1] ? OKC : RED) : INK }, T(s[0], { fontWeight: 700 }), Row({}, Chip('Digital', r[i] === 'D', () => { setListo(false); setR(Object.assign({}, r, { [i]: 'D' })); }, BLUE), Chip('Analógica', r[i] === 'A', () => { setListo(false); setR(Object.assign({}, r, { [i]: 'A' })); }, AMB))))),
        Row({}, Btn('Comprobar', ver, { dis: n < SENS.length, bg: TEAL }), ayuda(p, 'Si el sensor solo dice «sí o no» (presionado, hay movimiento, llueve) es digital. Si mide «cuánto» (luz, humedad, temperatura, giro) es analógico.'))), 'Señales', { t: 'Digital o analógica', d: 'Clasifiquen la señal que entrega cada sensor.' });
    }
    function RDepura(p) {
      const [sel, setSel] = useState(null), [hum, setHum] = useState(20);
      const nodos = [{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: 'Leer humedad' }, { t: 'dec', txt: '¿humedad < 35 %?', si: { t: 'proc', txt: 'Apagar bomba' }, no: { t: 'proc', txt: 'Encender bomba' } }]; nodos.loop = 'repetir';
      const opts = [['ini', 'El INICIO'], ['leer', 'Leer humedad'], ['cond', 'La condición ¿humedad < 35 %?'], ['ramas', 'Las acciones del Sí y del No están intercambiadas']];
      return Reto(p, Grid(300, Card({ gap: 12 }, T('Este sistema de riego hace lo contrario de lo que debe. Muevan la humedad y observen. ¿Dónde está el error?'), ...opts.map(([k, t]) => Chip(t, sel === k, () => setSel(k))),
        Btn('Comprobar', () => p.check(sel === 'ramas', sel === 'ramas' ? 'Exacto: cuando la tierra está seca (Sí) debe ENCENDER la bomba. Las ramas estaban al revés.' : 'Esa parte está bien. Observen qué hace la bomba cuando la tierra está seca.', 'depura'), { dis: !sel, bg: TEAL }), ayuda(p, 'Pongan la humedad en 10 %: la tierra está muy seca. ¿La bomba riega?')),
        Card({ alignItems: 'center' }, K('Diagrama con error'), h(Flujo, { nodos, activo: hum < 35 ? '2s' : '2n', compact: true })),
        Card({ gap: 10 }, K('Simulación'), h(Planta, { hum, bomba: !(hum < 35) }), Slider('Humedad', hum, 0, 100, setHum, ' %'))), 'Depurar', { t: 'Encuentren el error del diagrama', d: 'Un equipo de otro curso diseñó este riego, pero algo falla.' });
    }
    const NEC = [['planta', '🪴 La planta del patio se seca', ['hum'], ['bomba']], ['luces', '💡 Luces del laboratorio encendidas de noche', ['pir', 'ldr'], ['led']], ['puerta', '🚪 La puerta del laboratorio queda abierta', ['us', 'fin'], ['servo', 'buzz']], ['calor', '🌡️ Calor en las aulas', ['temp'], ['vent', 'lcd']], ['basura', '🗑️ Basurero lleno', ['us'], ['led', 'lcd', 'buzz']], ['ruido', '🔔 Ruido en el comedor', ['mic'], ['led', 'lcd']], ['otra', '✏️ Otra idea (la escribimos)', null, null]];
    const ENT = [['hum', 'Sensor de humedad'], ['ldr', 'Sensor de luz (LDR)'], ['pir', 'Sensor PIR'], ['us', 'Ultrasónico'], ['temp', 'Sensor de temperatura'], ['mic', 'Sensor de sonido'], ['fin', 'Fin de carrera / pulsador']];
    const SAL = [['bomba', 'Bomba de agua'], ['led', 'LED / lámpara'], ['servo', 'Servomotor'], ['buzz', 'Zumbador'], ['vent', 'Ventilador'], ['lcd', 'Pantalla LCD']];
    function RProyecto(p) {
      const [nec, setNec] = useState(''), [otra, setOtra] = useState(''), [e, setE] = useState(''), [s, setS] = useState(''), [cond, setCond] = useState(''), [si, setSi] = useState(''), [no, setNo] = useState(''), [por, setPor] = useState('');
      const N = NEC.find(x => x[0] === nec), en = (ENT.find(x => x[0] === e) || [])[1] || '¿entrada?', sa = (SAL.find(x => x[0] === s) || [])[1] || '¿salida?';
      const nodos = [{ t: 'ini', txt: 'INICIO' }, { t: 'io', txt: 'Leer ' + en }, { t: 'dec', txt: cond ? '¿' + cond + '?' : '¿condición?', si: { t: 'proc', txt: si || '¿acción Sí?' }, no: { t: 'proc', txt: no || '¿acción No?' } }]; nodos.loop = 'repetir';
      const enviar = () => {
        const falt = []; if (!nec || (nec === 'otra' && otra.trim().length < 8)) falt.push('la necesidad'); if (!e) falt.push('la entrada'); if (!s) falt.push('la salida'); if (cond.trim().length < 3) falt.push('la condición'); if (!si.trim() || !no.trim()) falt.push('las acciones Sí y No'); if (!p.adaptado && por.trim().length < 12) falt.push('por qué resuelve el problema');
        if (falt.length) { p.check(false, 'Falta completar: ' + falt.join(', ') + '.', 'incompleto'); return; }
        if (N && N[2] && !N[2].includes(e)) { p.check(false, 'Para «' + N[1].slice(3) + '», ¿el ' + en.toLowerCase() + ' mide lo que importa? Piensen qué hay que medir.', 'entrada'); return; }
        if (N && N[3] && !N[3].includes(s)) { p.check(false, '¿La ' + sa.toLowerCase() + ' resuelve «' + N[1].slice(3) + '»? Piensen qué debe pasar en el mundo real.', 'salida'); return; }
        p.check(true, 'Plan completo: necesidad, entrada, salida y algoritmo coherentes. ¡Este puede ser su proyecto del trimestre!', 'ok', { necesidad: nec === 'otra' ? otra : N[1].slice(3), entrada: en, salida: sa, condicion: cond, si, no, porque: por });
      };
      const opts = (arr, v, set) => Row({}, ...arr.map(([k, t]) => Chip(t, v === k, () => set(k))));
      return Reto(p, Grid(320, Card({ gap: 12 }, K('1 · Necesidad del colegio'), opts(NEC.map(x => [x[0], x[1]]), nec, setNec), nec === 'otra' ? h('input', { value: otra, onChange: ev => setOtra(ev.target.value), placeholder: 'Escriban su idea del taller', style: { fontSize: 18, padding: 10, border: '2px solid ' + INK } }) : null,
        K('2 · Entrada (sensor)'), opts(ENT, e, setE), K('3 · Salida (actuador)'), opts(SAL, s, setS)),
        Card({ gap: 12 }, K('4 · Algoritmo'), h('input', { value: cond, onChange: ev => setCond(ev.target.value), placeholder: 'Condición: ej. temperatura > 28', style: { fontSize: 18, padding: 10, border: '2px solid ' + INK } }), h('input', { value: si, onChange: ev => setSi(ev.target.value), placeholder: 'Si se cumple: ej. encender ventilador', style: { fontSize: 18, padding: 10, border: '2px solid ' + OKC } }), h('input', { value: no, onChange: ev => setNo(ev.target.value), placeholder: 'Si no: ej. apagar ventilador', style: { fontSize: 18, padding: 10, border: '2px solid ' + RED } }),
          !p.adaptado ? h('textarea', { value: por, onChange: ev => setPor(ev.target.value), rows: 3, placeholder: '¿Por qué su sistema resuelve el problema?', style: { fontSize: 17, padding: 10, border: '2px solid ' + INK, fontFamily: 'inherit', resize: 'vertical' } }) : null,
          Btn('Enviar el plan al docente', enviar, { bg: TEAL }), ayuda(p, 'Una buena condición compara lo que mide el sensor con un número: «humedad < 30», «distancia < 50», «temperatura > 28».')),
        Card({ alignItems: 'center' }, K('Su diagrama se arma solo'), h(Flujo, { nodos, compact: true }))), 'Smart Campus', { t: 'Planifiquen su propio sistema', d: 'Elijan una necesidad del colegio (o la idea de su taller) y diseñen el plan completo.' });
    }
    const RETOS = [
      { id: 'eps', n: 'Clasificar componentes', ic: '🧩', C: REps, ad: true, nivel: 1 },
      { id: 'senal', n: 'Digital o analógica', ic: '📶', C: RSenal, ad: false, nivel: 1 },
      { id: 'semaforo', n: 'Semáforo de la entrada', ic: '🚦', C: RSemaforo, ad: true, nivel: 1 },
      { id: 'riego', n: 'Riego automático', ic: '🪴', C: RRiego, ad: true, nivel: 2 },
      { id: 'depura', n: 'Encontrar el error', ic: '🔎', C: RDepura, ad: false, nivel: 2 },
      { id: 'puerta', n: 'Puerta automática', ic: '🚪', C: RPuerta, ad: false, nivel: 2 },
      { id: 'alarma', n: 'Alarma nocturna', ic: '🔔', C: RAlarma, ad: false, nivel: 3 },
      { id: 'proyecto', n: 'Mi sistema Smart Campus', ic: '🏫', C: RProyecto, ad: true, nivel: 3 }];
    const META = { q: '¿Qué fue lo más difícil de planificar hoy?', o: ['Elegir el sensor correcto', 'La condición del rombo', 'Saber si era digital o analógica', 'Ordenar los pasos del diagrama', 'Nada, fue fácil'] };
    // ===== Extras 10mo =====
    const X = {
      eps: { ej: { t: 'Así se clasifica un componente', pasos: ['Pregunta: ¿mide algo del entorno o hace algo en el mundo?', 'El sensor de humedad MIDE → entrada.', 'El Arduino recibe el dato y DECIDE → proceso.', 'La bomba de agua ACTÚA → salida.'] }, mini: ['Un servomotor es…', ['Entrada', 'Proceso', 'Salida'], 2, 'El servo recibe una orden y se mueve: salida.'], pistas: ['¿Mide o actúa?', 'Sensores y pulsadores miden: entradas. Motores, luces y sonidos actúan: salidas.', 'Entradas: todos los sensores y el pulsador. Proceso: Arduino. Salidas: bomba, servo, LED, zumbador, LCD, ventilador.'] },
      senal: { ej: { t: 'Así se distingue digital de analógica', pasos: ['Digital: solo dos valores, como un interruptor (0 o 1).', 'Un pulsador: presionado o no → digital.', 'Analógica: muchos valores, de 0 a 1023.', 'La luz puede ser poca, media o mucha → analógica.'] }, mini: ['Un sensor de temperatura da…', ['Solo 0 o 1', 'Muchos valores'], 1, 'La temperatura puede tomar muchos valores: analógica.'], pistas: ['¿Solo sí/no o muchos valores?', 'Pulsador, PIR, fin de carrera: sí/no.', 'Digitales: pulsador, PIR, fin de carrera, lluvia. Analógicas: luz, humedad, temperatura, potenciómetro.'] },
      semaforo: { ej: { t: 'Así se ordena un ciclo', pasos: ['Verde: los carros pasan.', 'Amarillo: aviso corto.', 'Rojo: los estudiantes cruzan.', 'Y vuelve al inicio: nunca termina.'] }, mini: ['Un semáforo, al terminar el rojo…', ['Se apaga', 'Vuelve al verde', 'Escribe FIN'], 1, 'Un ciclo se repite: vuelve al inicio.'], pistas: ['Piensen en la calle del colegio.', 'Verde, amarillo, rojo y volver.', 'Verde 5 s → Amarillo 2 s → Rojo 5 s → Volver al inicio.'] },
      riego: { ej: { t: 'Así se diseña una decisión', pasos: ['Entrada: leer la humedad del suelo.', 'Pregunta (rombo): ¿humedad < 35 %?', 'Sí → la tierra está seca → encender la bomba.', 'No → apagar la bomba. Volver a leer.'] }, mini: ['Si la tierra está seca, la bomba…', ['Se enciende', 'Se apaga'], 0, 'Tierra seca → hay que regar.'], pistas: ['¿Qué hay que medir?', 'La pregunta compara la humedad con un límite bajo.', 'Humedad < 35 % → Sí: encender bomba · No: apagar bomba.'] },
      depura: { ej: { t: 'Así se busca un error en un diagrama', pasos: ['Sigan el diagrama con un caso: tierra seca.', '¿Qué hace el diagrama? ¿Lo que debería?', 'Si hace lo contrario, las ramas Sí / No están invertidas.', 'Corregir y volver a probar con otro caso.'] }, mini: ['Probar un diagrama con un caso real sirve para…', ['Decorarlo', 'Encontrar errores', 'Hacerlo más largo'], 1, 'Se recorre con un ejemplo para ver si funciona.'], pistas: ['Recorran el diagrama con la tierra seca.', 'Fíjense qué pasa en la rama del Sí.', 'Las ramas estaban invertidas: con humedad baja (Sí) se ENCIENDE la bomba.'] },
      puerta: { ej: { t: 'Así se elige un umbral', pasos: ['Sensor: ultrasónico, mide la distancia.', '¿Cuándo abrir? Cuando alguien está cerca.', 'Umbral razonable: menos de 50 cm.', 'Sí → servo a 90° (abrir). No → servo a 0° (cerrar).'] }, mini: ['Para «alguien está cerca» se usa…', ['distancia < 50', 'distancia > 50', 'distancia == 0'], 0, 'Cerca = distancia menor que el umbral.'], pistas: ['¿La puerta abre con distancia grande o pequeña?', 'Cerca es menor que un límite de unos 50 cm.', 'distancia < 50 → servo 90° · si no → servo 0°.'] },
      alarma: { ej: { t: 'Así se combinan dos condiciones', pasos: ['Necesidad: avisar si alguien entra al laboratorio de noche.', 'Condición 1: es de noche (luz baja).', 'Condición 2: hay movimiento (PIR).', 'Las dos a la vez → Y.'] }, mini: ['Con Y, la alarma suena si…', ['Se cumple una', 'Se cumplen las dos', 'No se cumple ninguna'], 1, 'Y exige las dos condiciones.'], pistas: ['¿Debe sonar de día?', 'Necesita noche Y movimiento.', 'Se usa Y: suena solo si es de noche Y hay movimiento.'] },
      proyecto: { ej: { t: 'Así se planifica un sistema', pasos: ['Necesidad: «en el aula hace mucho calor».', 'Entrada: sensor de temperatura.', 'Decisión: ¿temperatura > 28 °C?', 'Salida: Sí → encender ventilador · No → apagarlo.'] }, mini: ['¿Qué se define primero al planificar?', ['El color de la caja', 'La necesidad o problema', 'El precio'], 1, 'Todo empieza por el problema que queremos resolver.'], pistas: ['Escriban el problema en una oración.', '¿Qué hay que medir? ¿Qué debe pasar en cada caso?', 'Necesidad → sensor → condición → acción Sí / acción No.'] }
    };
    RETOS.forEach(r => Object.assign(r, X[r.id] || {}));
    const JG = window.CLASE_JUEGOS ? window.CLASE_JUEGOS.make(React, { D, T, K, B, Card, Btn, Row, Code, Grid, H1, MONO, HEAD, c: { INK, MUTE, LINE, TEAL, AMB, RED, BLUE, OKC, CARD, SUNK, OFF } }) : null;
    if (JG) RETOS.push(
      { id: 'j_carrera', n: 'Carrera del algoritmo', ic: h(Icon, { k: 'contador', s: 44 }), ad: true, nivel: 'JUEGO', juego: true, pistas: ['Todo empieza en INICIO.', 'Primero se lee el sensor, luego se pregunta.', 'INICIO → leer → ¿? → Sí/No → volver.'], C: p => h(JG.Carrera, Object.assign({ data: { tit: 'Carrera del algoritmo', txt: 'Ordenen los pasos del riego automático antes de que se acabe el tiempo.', lineas: ['INICIO', 'Leer la humedad del suelo', '¿Humedad < 35 %?', 'Sí → encender la bomba', 'No → apagar la bomba', 'Esperar 10 minutos', 'Volver a leer la humedad'], corto: ['Leer la humedad del suelo', '¿Humedad < 35 %?', 'Sí → encender la bomba', 'No → apagar la bomba'], ok: 'Entrada → decisión → salida → repetir.' } }, p)) },
      { id: 'j_bug', n: 'Atrapa el error de diseño', ic: h(Icon, { k: 'lupa', s: 44 }), ad: true, nivel: 'JUEGO', juego: true, pistas: ['Revisen si la entrada mide lo que importa.', '¿La acción resuelve el problema?', 'Errores: sensores que no miden lo necesario y acciones al revés.'], C: p => h(JG.Bug, Object.assign({ data: { tit: 'Atrapa el error de diseño', txt: 'Caen decisiones de diseño. Toquen SOLO las que están mal pensadas.', ejemplo: 'Ejemplo de error: «Riego: medir la luz para saber si la tierra está seca».', lineas: [['Riego: sensor de humedad → bomba', false], ['Puerta: ultrasónico → servo', false], ['Pasillo: LDR + PIR → lámpara', false], ['Aula: temperatura → ventilador', false], ['Alarma: PIR → zumbador', false], ['Riego: sensor de luz → bomba', true, 'la luz no dice si la tierra está seca'], ['Si la tierra está seca → apagar bomba', true, 'acción invertida: hay que encenderla'], ['Puerta: abrir si distancia > 2 m', true, 'debe abrir cuando alguien está CERCA'], ['Ventilador: encender si temp < 15 °C', true, 'con frío no se necesita ventilador'], ['Alarma: suena si es de día O hay movimiento', true, 'debe ser de noche Y con movimiento']], ok: 'Un buen diseño mide lo que importa y actúa con sentido.' } }, p)) },
      { id: 'j_simon', n: 'Simón del semáforo', ic: h(Icon, { k: 'lampara', s: 44 }), ad: true, nivel: 'JUEGO', juego: true, pistas: ['Digan los colores en voz alta.', 'Cada luz es un paso del diagrama.', 'Elijan el diagrama con el mismo orden.'], C: p => h(JG.Simon, Object.assign({ data: { tit: 'Simón del semáforo', txt: 'Memoricen la secuencia de luces, repítanla y luego elijan el diagrama que la produce.', pads: [{ t: 'ROJO', c: '#ff5d5d' }, { t: 'AMARILLO', c: '#ffd166' }, { t: 'VERDE', c: '#3fd07a' }, { t: 'PEATÓN', c: '#4d9bff' }], programa: s => ['INICIO'].concat(s.map(v => '→ Encender ' + ['rojo', 'amarillo', 'verde', 'luz de peatón'][v])).concat(['→ Volver al inicio']) } }, p)) },
      { id: 'j_circuito', n: 'Conecta el sistema', ic: h(Icon, { k: 'puertas', s: 44 }), ad: true, nivel: 'JUEGO', juego: true, izq: 'Componentes', pistas: ['Cada componente tiene un papel: entrada, proceso o salida.', 'Los sensores son entradas; motores, bombas y luces son salidas.', 'Humedad→Entrada, Arduino→Proceso, Bomba→Salida, Ultrasónico→Entrada, Servo→Salida.'], C: p => h(JG.Circuito, Object.assign({ data: { tit: 'Conecta cada componente con su papel', txt: 'Toquen un componente y luego su papel en el sistema.', der: 'Papel en el sistema', pares: [['Sensor de humedad', 'ENTRADA · mide la tierra', 'Mide algo del entorno: es entrada.'], ['Arduino UNO', 'PROCESO · decide', 'El Arduino ejecuta el algoritmo.'], ['Bomba de agua', 'SALIDA · riega', 'Actúa en el mundo: salida.'], ['Sensor ultrasónico', 'ENTRADA · mide distancia', 'Mide la distancia: entrada.'], ['Servomotor', 'SALIDA · mueve la puerta', 'Se mueve: salida.']], corto: 3, ok: '¡Sistema completo: entrada, proceso y salida!' } }, p)) }
    );
    const GLOS = [['Sistema', 'Conjunto de partes que trabajan juntas para resolver una necesidad.', 'Riego automático del patio.', 'caja'], ['Entrada', 'Lo que recibe datos del entorno: sensores y pulsadores.', 'Sensor de humedad.', 'termo'], ['Proceso', 'Lo que decide: el Arduino ejecuta el algoritmo.', 'Arduino UNO.', 'pasos'], ['Salida', 'Lo que actúa en el mundo.', 'Bomba, servo, LED, zumbador.', 'lampara'], ['Sensor', 'Componente que mide algo: luz, distancia, humedad.', 'LDR, ultrasónico, PIR.', 'termo'], ['Actuador', 'Componente que hace algo: se mueve, suena, se enciende.', 'Servomotor.', 'puertas'], ['Digital', 'Solo dos valores: 0 o 1.', 'Pulsador.', 'barras'], ['Analógico', 'Muchos valores: de 0 a 1023.', 'Sensor de luz.', 'barras'], ['Umbral', 'Valor límite con el que se compara.', 'Humedad < 35 %.', 'balanza'], ['Diagrama de flujo', 'Dibujo del algoritmo con óvalos, rectángulos y rombos.', 'INICIO → leer → ¿? → acción.', 'pasos']];
    const TICKET = [['Un sensor de humedad es…', ['Entrada', 'Proceso', 'Salida'], 0], ['El pulsador da una señal…', ['Digital', 'Analógica'], 0], ['En un riego, si la tierra está seca…', ['Se apaga la bomba', 'Se enciende la bomba', 'No pasa nada'], 1]];
    const ESTR = ['Recorrimos el diagrama con un ejemplo', 'Usamos el ejemplo resuelto', 'Probamos con la simulación y corregimos', 'Nos explicamos entre los dos', 'Pedimos pistas'];
    const LOGROS = [['Identifico entradas, proceso y salidas de un sistema.', ['eps', 'j_circuito']], ['Distingo señales digitales y analógicas.', ['senal']], ['Diseño decisiones con sensores y umbrales.', ['riego', 'puerta', 'alarma', 'j_bug']], ['Ordeno, pruebo y corrijo un algoritmo.', ['semaforo', 'depura', 'j_carrera', 'j_simon']], ['Planifico un sistema para mi colegio.', ['proyecto']]];
    make.c = { S, RETOS, META, Flujo, GLOS, TICKET, ESTR, LOGROS, Icon, curso: '10mo', titulo: 'Pensar como ingenieros' };
    return make.c;
  }
  window.CLASE10 = { make };
})();

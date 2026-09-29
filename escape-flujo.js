// Retos de diagramas de flujo para "Escape del Laboratorio" (proyectos DIY del colegio).
(function () {
  const F = {};
  const num = (n, u, min, max, paso) => ({ n, u, min, max, paso });
  F.PA = [
    { id: 'riego', nombre: 'Riego automático de la maceta', set: 'Configurar la bomba como salida', leer: 'Leer el sensor de humedad', v: num('Humedad', '%', 0, 100, 1), op: '<', k: 30, si: 'Encender la bomba', no: 'Apagar la bomba', spec: 'La bomba debe encenderse cuando la humedad sea menor que 30 %.' },
    { id: 'basurero', nombre: 'Basurero con tapa automática', set: 'Configurar el servo de la tapa', leer: 'Leer el sensor de distancia', v: num('Distancia', 'cm', 2, 60, 1), op: '<', k: 15, si: 'Abrir la tapa', no: 'Cerrar la tapa', spec: 'La tapa debe abrirse cuando la mano esté a menos de 15 cm.' },
    { id: 'ventilador', nombre: 'Ventilador inteligente del aula', set: 'Configurar el ventilador como salida', leer: 'Leer el sensor de temperatura', v: num('Temperatura', '°C', 15, 38, 1), op: '>', k: 28, si: 'Encender el ventilador', no: 'Apagar el ventilador', spec: 'El ventilador debe encenderse cuando la temperatura sea mayor que 28 °C.' },
    { id: 'alumbrado', nombre: 'Alumbrado del patio', set: 'Configurar las lámparas como salida', leer: 'Leer el sensor de luz (LDR)', v: num('Luz', 'lux', 0, 1000, 10), op: '<', k: 200, si: 'Encender las lámparas', no: 'Apagar las lámparas', spec: 'Las lámparas deben encenderse cuando la luz baje de 200 lux.' },
    { id: 'pasillo', nombre: 'Luz del pasillo con sensor', set: 'Configurar la luz del pasillo', leer: 'Leer el sensor de movimiento', v: { n: 'Movimiento', bool: true }, cond: '¿Hay movimiento?', si: 'Encender la luz', no: 'Apagar la luz' },
    { id: 'huella', nombre: 'Acceso al laboratorio con huella', set: 'Configurar la cerradura eléctrica', leer: 'Leer la huella', v: { n: 'Huella registrada', bool: true }, cond: '¿La huella está registrada?', si: 'Abrir la puerta', no: 'Sonar el buzzer' }
  ];
  F.PB = [
    { id: 'tanque', nombre: 'Riego con control de tanque', set: 'Configurar la bomba y la alarma', leer: 'Leer el tanque y la humedad', v1: { n: 'Tanque con agua', bool: true }, c1: '¿El tanque tiene agua?', n1: 'Encender la alarma de tanque vacío', v2: num('Humedad', '%', 0, 100, 1), op: '<', k: 30, s2: 'Encender la bomba', n2: 'Apagar la bomba' },
    { id: 'alarma', nombre: 'Alarma del laboratorio', set: 'Configurar la sirena y los LED', leer: 'Leer el interruptor y el sensor PIR', v1: { n: 'Alarma activada', bool: true }, c1: '¿La alarma está activada?', n1: 'Encender el LED verde', v2: { n: 'Movimiento', bool: true }, c2: '¿Hay movimiento?', s2: 'Sonar la sirena', n2: 'Encender el LED rojo' },
    { id: 'horario', nombre: 'Acceso con huella y horario', set: 'Configurar la cerradura y la pantalla', leer: 'Leer la huella y la hora', v1: { n: 'Huella registrada', bool: true }, c1: '¿La huella está registrada?', n1: 'Sonar el buzzer', v2: num('Hora', 'h', 6, 20, 1), op: '<', k: 14, s2: 'Abrir la puerta', n2: 'Mostrar «Fuera de horario»' },
    { id: 'aula', nombre: 'Aula que ahorra energía', set: 'Configurar el ventilador y las luces', leer: 'Leer el sensor PIR y la temperatura', v1: { n: 'Hay estudiantes', bool: true }, c1: '¿Hay estudiantes en el aula?', n1: 'Apagar todo el aula', v2: num('Temperatura', '°C', 15, 38, 1), op: '>', k: 28, s2: 'Encender el ventilador', n2: 'Apagar el ventilador' }
  ];
  const OPTXT = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' };
  F.condTxt = (v, op, k) => '¿' + v.n + ' ' + OPTXT[op] + ' ' + k + ' ' + v.u + '?';
  F.cmp = (op, a, b) => op === '<' ? a < b : op === '>' ? a > b : op === '<=' ? a <= b : a >= b;
  F.lect = (v, x) => v.n + ': ' + (v.bool ? (x ? 'SÍ' : 'NO') : x + ' ' + v.u);

  // ---- diagrama ----
  F.diag = function (p) {
    if (p.v1) {
      const c2 = p.c2 || F.condTxt(p.v2, p.op, p.k);
      return { B: true, orden: ['ini', 'set', 'leer', 'd1', 'n1', 'd2', 's2', 'n2'],
        n: { ini: ['oval', 'Inicio'], set: ['rect', p.set], leer: ['io', p.leer], d1: ['dec', p.c1], n1: ['rect', p.n1], d2: ['dec', c2], s2: ['rect', p.s2], n2: ['rect', p.n2] },
        pos: { ini: [0, 0], set: [0, 1], leer: [0, 2], d1: [0, 3.15], n1: [2.5, 3.15], d2: [0, 4.5], s2: [0, 5.75], n2: [1.3, 4.5] }, LY: 6.55,
        e: [['ini', 'set'], ['set', 'leer'], ['leer', 'd1'], ['d1', 'd2', 'Sí'], ['d1', 'n1', 'No'], ['d2', 's2', 'Sí'], ['d2', 'n2', 'No'], ['n1', 'L'], ['s2', 'L'], ['n2', 'L']], W: 800, H: 640 };
    }
    const c = p.cond || F.condTxt(p.v, p.op, p.k);
    return { B: false, orden: ['ini', 'set', 'leer', 'dec', 'si', 'no'],
      n: { ini: ['oval', 'Inicio'], set: ['rect', p.set], leer: ['io', p.leer], dec: ['dec', c], si: ['rect', p.si], no: ['rect', p.no] },
      pos: { ini: [0, 0], set: [0, 1], leer: [0, 2], dec: [0, 3.15], si: [0, 4.4], no: [1.35, 3.15] }, LY: 5.2,
      e: [['ini', 'set'], ['set', 'leer'], ['leer', 'dec'], ['dec', 'si', 'Sí'], ['dec', 'no', 'No'], ['si', 'L'], ['no', 'L']], W: 570, H: 520 };
  };
  F.run = function (p, r) {
    if (p.v1) { const a = !!r[0]; if (!a) return { path: ['leer', 'd1', 'n1'], act: 'n1' }; const b = p.v2.bool ? !!r[1] : F.cmp(p.op, r[1], p.k); return { path: ['leer', 'd1', 'd2', b ? 's2' : 'n2'], act: b ? 's2' : 'n2' }; }
    const b = p.v.bool ? !!r[0] : F.cmp(p.op, r[0], p.k); return { path: ['leer', 'dec', b ? 'si' : 'no'], act: b ? 'si' : 'no' };
  };
  const X = x => 200 + x * 190, Y = y => 44 + y * 86, HW = s => s === 'dec' ? 100 : 90, HH = s => s === 'dec' ? 38 : 26;
  // opt: { shape:{id}, txt:{id}, blank:{id}, hl:{id:color}, sel:id, bad:{id}, sinFlecha:{id}, invertir:{id}, onNode(id) }
  F.svg = function (R, d, opt) {
    opt = opt || {}; const E = R.createElement, kids = [], ST = '#e8f4f8';
    const shp = id => (opt.shape && opt.shape[id]) || d.n[id][0];
    const txt = id => opt.blank && opt.blank[id] ? '' : (opt.txt && opt.txt[id] != null ? opt.txt[id] : d.n[id][1]);
    const P = id => [X(d.pos[id][0]), Y(d.pos[id][1])];
    const line = (pts, arrow, k, col) => kids.push(E('polyline', { key: k, points: pts.map(q => q.join(',')).join(' '), fill: 'none', stroke: col || '#9fb6c0', strokeWidth: 2.5, markerEnd: arrow ? 'url(#fl-ar)' : undefined }));
    const lab = (x, y, t, k) => kids.push(E('text', { key: k, x, y, fill: t === 'Sí' ? '#7fe0a0' : '#ff9b93', fontSize: 15, fontWeight: 700, fontFamily: 'IBM Plex Sans, sans-serif' }, t));
    let loopX = [];
    d.e.forEach(([a, b, l], i) => {
      if (opt.sinFlecha && opt.sinFlecha[a] && (b === 'L' || opt.sinFlecha[a] === b)) return;
      const [ax, ay] = P(a), sa = d.n[a][0];
      if (b === 'L') { line([[ax, ay + HH(sa)], [ax, Y(d.LY)]], false, 'e' + i); loopX.push(ax); return; }
      const [bx, by] = P(b), sb = d.n[b][0], lt = l && opt.invertir && opt.invertir[a] ? (l === 'Sí' ? 'No' : 'Sí') : l;
      if (ax === bx) { line([[ax, ay + HH(sa)], [bx, by - HH(sb) - 2]], true, 'e' + i); if (lt) lab(ax + 8, ay + HH(sa) + 18, lt, 'l' + i); }
      else { line([[ax + HW(sa), ay], [bx - HW(sb) - 2, by]], true, 'e' + i); if (lt) lab(ax + HW(sa) + 8, ay - 8, lt, 'l' + i); }
    });
    if (loopX.length) { const mx = Math.max.apply(null, loopX), [lx, ly] = P('leer'); line([[mx, Y(d.LY)], [36, Y(d.LY)], [36, ly], [lx - HW('io') - 2, ly]], true, 'loop'); }
    d.orden.forEach(id => {
      const [x, y] = P(id), s = shp(id), w = HW(s), h = HH(s), sel = opt.sel === id, hl = opt.hl && opt.hl[id], bad = opt.bad && opt.bad[id];
      const fill = hl || (sel ? 'rgba(95,208,232,.18)' : '#0f1b26'), stroke = bad ? '#ff7b72' : sel ? '#5fd0e8' : hl ? '#ffffff' : ST, sw = sel || bad ? 4 : 2.5;
      const cp = { fill, stroke, strokeWidth: sw, strokeDasharray: s === '?' ? '7 6' : undefined };
      let el;
      if (s === 'oval') el = E('rect', Object.assign({ x: x - w, y: y - h, width: w * 2, height: h * 2, rx: h }, cp));
      else if (s === 'io') el = E('polygon', Object.assign({ points: [[x - w + 16, y - h], [x + w, y - h], [x + w - 16, y + h], [x - w, y + h]].map(q => q.join(',')).join(' ') }, cp));
      else if (s === 'dec') el = E('polygon', Object.assign({ points: [[x, y - h], [x + w, y], [x, y + h], [x - w, y]].map(q => q.join(',')).join(' ') }, cp));
      else el = E('rect', Object.assign({ x: x - w, y: y - h, width: w * 2, height: h * 2, rx: 3 }, cp));
      const t = txt(id), fo = E('foreignObject', { x: x - w + (s === 'dec' ? 18 : 6), y: y - h, width: (w - (s === 'dec' ? 18 : 6)) * 2, height: h * 2 },
        E('div', { style: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: hl ? '#081018' : '#e8f4f8', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: s === 'dec' ? 12.5 : 13.5, fontWeight: 600, lineHeight: 1.15 } }, t || (s === '?' ? '?' : '…')));
      kids.push(E('g', { key: 'n' + id, style: { cursor: opt.onNode ? 'pointer' : 'default' }, onClick: opt.onNode ? () => opt.onNode(id) : undefined }, el, fo));
    });
    return E('svg', { viewBox: '0 0 ' + d.W + ' ' + d.H, style: { width: '100%', maxWidth: d.W + 'px', height: 'auto', display: 'block' } },
      E('defs', { key: 'defs' }, E('marker', { id: 'fl-ar', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, E('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#9fb6c0' }))), kids);
  };

  // ---- lecturas ----
  const valor = (v, h) => v.bool ? h.int(0, 1) === 1 : v.min + h.int(0, Math.round((v.max - v.min) / v.paso)) * v.paso;
  const lecturas = (p, h, n, borde) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      if (p.v1) { const a = i === 0 ? true : h.int(0, 3) > 0; let b = valor(p.v2, h); if (borde && i === 1 && !p.v2.bool) b = p.k; out.push([a, b]); }
      else { let a = valor(p.v, h); if (borde && i === 1 && !p.v.bool) a = p.k; out.push([a]); }
    }
    return out;
  };
  F.lectTxt = (p, r) => p.v1 ? F.lect(p.v1, r[0]) + ' · ' + F.lect(p.v2, r[1]) : F.lect(p.v, r[0]);
  const otro = (lista, p, h) => h.pick(lista.filter(q => q.id !== p.id));

  // 1. Arma el diagrama
  F.FORMAS = [['oval', 'Inicio / fin'], ['rect', 'Proceso'], ['io', 'Entrada / lectura'], ['dec', 'Decisión']];
  F.genArmar = function (tier, h) {
    const p = tier < 3 ? h.pick(F.PA) : h.pick(F.PB), d = F.diag(p);
    const slots = tier === 1 ? ['leer', d.B ? 'd1' : 'dec', d.B ? 'd2' : 'si', d.B ? 's2' : 'no'] : d.orden.filter(x => x !== 'ini');
    const q = otro(tier < 3 ? F.PA : F.PB, p, h), dis = tier < 3 ? [q.leer, q.si, q.no] : [q.leer, q.s2, q.n1];
    const bank = h.shuffle(slots.map(id => d.n[id][1]).concat(dis.slice(0, tier === 1 ? 2 : 3)));
    return { p, d, slots, bank, formas: tier > 1 };
  };
  // 2. Sigue el diagrama
  F.genSigue = function (tier, h) {
    const p = tier === 1 ? h.pick(F.PA) : h.pick(F.PB), d = F.diag(p), n = tier === 3 ? 3 : 1;
    const lec = lecturas(p, h, n, tier === 3), ops = d.B ? ['n1', 's2', 'n2'] : ['si', 'no'];
    return { p, d, lec, ops, sol: lec.map(r => F.run(p, r).act) };
  };
  // 3. Encuentra el error
  F.TIPOS = ['Figura equivocada', 'Texto equivocado', 'Sí y No invertidos', 'Falta una flecha'];
  F.genError = function (tier, h) {
    const p = tier < 3 ? h.pick(F.PA) : h.pick(F.PB), d = F.diag(p), dec = d.B ? 'd1' : 'dec', dec2 = d.B ? 'd2' : 'dec';
    const pool = tier === 1 ? ['forma', 'texto', 'inicio'] : ['forma', 'texto', 'inicio', 'rama', 'flecha'];
    const tipos = h.shuffle(pool).slice(0, tier === 3 ? 2 : 1), opt = { shape: {}, txt: {}, invertir: {}, sinFlecha: {} }, sol = {}, q = otro(tier < 3 ? F.PA : F.PB, p, h);
    tipos.forEach(t => {
      if (t === 'forma') { const c0 = ['set', 'leer', dec].filter(x => sol[x] == null); if (!c0.length) return; const id = h.pick(c0); opt.shape[id] = id === dec ? 'rect' : id === 'leer' ? 'dec' : 'oval'; sol[id] = 0; }
      if (t === 'texto') { if (sol.leer != null) return; opt.txt.leer = q.leer; sol.leer = 1; }
      if (t === 'inicio') { opt.txt.ini = 'Fin'; sol.ini = 1; }
      if (t === 'rama') { const id = sol[dec] == null ? dec : dec2; if (sol[id] != null) return; opt.invertir[id] = 1; sol[id] = 2; }
      if (t === 'flecha') { const c = ['set', d.B ? 's2' : 'si'].filter(x => sol[x] == null); const id = h.pick(c); opt.sinFlecha[id] = d.e.find(e => e[0] === id)[1]; sol[id] = 3; }
    });
    while (Object.keys(sol).length < tipos.length) { if (sol.ini == null) { opt.txt.ini = 'Fin'; sol.ini = 1; } else if (sol[dec] == null) { opt.invertir[dec] = 1; sol[dec] = 2; } else break; }
    return { p, d, opt, sol, n: Object.keys(sol).length };
  };
  // 4. Ordena los pasos
  F.PROC = [
    { t: 'Lavarse las manos', s: ['Abrir la llave', 'Mojar las manos', 'Poner jabón', 'Frotar las manos 20 segundos', 'Enjuagar las manos', 'Cerrar la llave', 'Secar las manos'] },
    { t: 'Préstamo de un libro en la biblioteca', s: ['Buscar el libro en el catálogo', 'Ir al estante indicado', 'Tomar el libro', 'Presentar el carné en el mostrador', 'Registrar el préstamo', 'Llevar el libro al aula', 'Devolver el libro en la fecha indicada'] },
    { t: 'Simulacro de evacuación', s: ['Escuchar la alarma', 'Dejar lo que se está haciendo', 'Formar una fila detrás del docente', 'Caminar sin correr por la ruta de evacuación', 'Llegar al punto de encuentro', 'Pasar lista'] },
    { t: 'Regar la maceta a mano', s: ['Tomar la regadera', 'Llenar la regadera con agua', 'Caminar hasta la maceta', 'Regar la tierra despacio', 'Volver con la regadera vacía', 'Guardar la regadera'] }
  ];
  F.genOrden = function (tier, h) {
    const n = tier === 1 ? 5 : tier === 2 ? 6 : 7, pr = h.pick(F.PROC.filter(x => x.s.length >= n));
    let s = pr.s.slice(); while (s.length > n) s.splice(h.int(1, s.length - 2), 1);
    let ord; do { ord = h.shuffle([...s.keys()]); } while (ord.every((v, i) => v === i));
    return { titulo: pr.t, pasos: s, ord };
  };
  // 5. Completa la decisión
  const NUM = () => F.PA.filter(p => !p.v.bool);
  F.genDecision = function (tier, h) {
    const p = h.pick(NUM()), v = p.v, d = F.diag(p), inv = { '<': '>=', '>': '<=' }[p.op], q = otro(NUM(), p, h);
    const tests = [p.k - 10 * v.paso, p.k - v.paso, p.k, p.k + v.paso, p.k + 10 * v.paso].map(x => Math.max(v.min, Math.min(v.max, x)));
    let conds;
    if (tier === 1) conds = [[p.op, p.k], [p.op === '<' ? '>' : '<', p.k], ['otra']];
    else conds = [[p.op, p.k], [inv, p.k], [p.op === '<' ? '>' : '<', p.k], [p.op, p.k + 10 * v.paso]];
    conds = h.shuffle(conds).map(c => c[0] === 'otra' ? { t: F.condTxt(q.v, q.op, q.k), f: () => false, otra: true } : { t: F.condTxt(v, c[0], c[1]), op: c[0], k: c[1] });
    return { p, d, tests, conds, libre: tier === 3, swap: tier > 1 };
  };
  // 6. Diagrama -> aparato
  F.genAparato = function (tier, h) {
    const p = tier < 3 ? h.pick(tier === 2 ? NUM() : F.PA) : h.pick(F.PB), d = F.diag(p), q = otro(tier < 3 ? F.PA : F.PB, p, h);
    const slots = d.B ? ['n1', 's2', 'n2'] : ['si', 'no'];
    const pal = h.shuffle(slots.map(id => d.n[id][1]).concat([q.v1 ? q.s2 : q.si, 'Esperar 1 segundo']));
    let conds = null;
    if (tier === 2) conds = h.shuffle([[p.op, p.k], [p.op === '<' ? '>' : '<', p.k], [p.op, p.k * 2]]).map(c => ({ t: F.condTxt(p.v, c[0], c[1]), op: c[0], k: c[1] }));
    return { p, d, slots, pal, conds, lec: lecturas(p, h, tier === 1 ? 5 : 6, tier > 1) };
  };
  window.ESC_FLUJO = F;
})();

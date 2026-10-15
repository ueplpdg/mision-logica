// Escape del Laboratorio · red en tiempo real (Firebase Realtime Database): presencia, chat filtrado y controles del docente.
(function () {
  const MALAS = ['puta', 'puto', 'mierda', 'verga', 'pendejo', 'pendeja', 'cabron', 'cabrón', 'chucha', 'carajo', 'maricon', 'maricón', 'marica', 'huevon', 'huevón', 'gil', 'idiota', 'estupido', 'estúpido', 'imbecil', 'imbécil', 'perra', 'zorra', 'culo', 'coño', 'joder', 'malparido', 'hdp', 'ctm', 'ptm', 'vrg', 'mrd', 'tonto', 'tonta', 'feo', 'fea', 'gordo', 'gorda', 'burro', 'burra', 'retrasado', 'mongol', 'fuck', 'shit', 'bitch'];
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[@4]/g, 'a').replace(/3/g, 'e').replace(/[1!]/g, 'i').replace(/0/g, 'o').replace(/\$/g, 's');
  const MN = MALAS.map(norm);
  function filtrar(txt) { let bad = false; const out = String(txt).split(/(\s+)/).map(w => { const n = norm(w).replace(/[^a-zñ]/g, ''); if (n && MN.some(b => n === b || (b.length > 3 && n.includes(b)))) { bad = true; return '*'.repeat(Math.max(3, w.length)); } return w; }).join(''); return { txt: out, bad }; }
  const cargar = src => new Promise((ok, no) => { if (document.querySelector('script[src="' + src + '"]')) { const t = setInterval(() => { if (window.firebase && (src.includes('app') || (window.firebase.database))) { clearInterval(t); ok(); } }, 50); setTimeout(() => { clearInterval(t); ok(); }, 6000); return; } const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  async function db(cfg) {
    await cargar('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
    await cargar('https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js');
    const app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(cfg);
    return app.database();
  }
  const salaId = (curso, par, fecha) => (String(curso || 'curso') + '_' + String(par || 'A') + '_' + (fecha || new Date().toISOString().slice(0, 10))).replace(/[.#$\[\]\/\s]/g, '');
  async function conectar(cfg, sala, yo, on) {
    const D = await db(cfg), R = D.ref('salas/' + sala), me = R.child('jug/' + yo.id);
    me.onDisconnect().remove(); me.set(Object.assign({ t: Date.now() }, yo.info));
    const otros = {}; R.child('jug').on('value', s => { const v = s.val() || {}; Object.keys(otros).forEach(k => delete otros[k]); Object.keys(v).forEach(k => { if (k !== yo.id) otros[k] = v[k]; }); on.jug && on.jug(otros); });
    R.child('chat').limitToLast(40).on('value', s => { const v = s.val() || {}; on.chat && on.chat(Object.keys(v).map(k => v[k]).sort((a, b) => a.t - b.t)); });
    R.child('ctl').on('value', s => { on.ctl && on.ctl(s.val() || {}); });
    R.child('duelos').on('value', s => { const v = s.val() || {}; on.duelos && on.duelos(Object.keys(v).map(k => Object.assign({ id: k }, v[k])).filter(d => d.a === yo.id || d.b === yo.id)); });
    let last = 0;
    return {
      sala, otros,
      mover(info) { const n = Date.now(); if (n - last < 200) return; last = n; me.update(Object.assign({ t: n }, info)); },
      enviar(txt, de, mudo) { txt = String(txt || '').trim().slice(0, 140); if (!txt) return { ok: false }; if (mudo) return { ok: false, msg: 'El docente silenció a su pareja.' }; const f = filtrar(txt);
        R.child('chatlog').push({ de, id: yo.id, txt, bad: f.bad, t: Date.now() }); R.child('chat').push({ de, id: yo.id, txt: f.txt, bad: f.bad, t: Date.now() }); return { ok: true, bad: f.bad }; },
      retar(b, an, bn, juego) { const j = juego || 'ttt'; return R.child('duelos').push({ a: yo.id, an, b, bn, juego: j, est: 'pend', tab: j === 'nim' ? '3,5,7' : '.........', turno: 'a', t: Date.now() }); },
      jugarNim(id, hi, k, rol) { R.child('duelos/' + id).transaction(d => { if (!d || d.est !== 'juego' || d.turno !== rol) return; const m = String(d.tab).split(',').map(Number); if (!(m[hi] >= k)) return; m[hi] -= k; d.tab = m.join(','); if (m.every(x => x === 0)) { d.est = 'fin'; d.gan = rol; } else d.turno = rol === 'a' ? 'b' : 'a'; d.t = Date.now(); return d; }); },
      responder(id, si) { R.child('duelos/' + id).update({ est: si ? 'juego' : 'rech', t: Date.now() }); },
      jugar(id, i, rol) { R.child('duelos/' + id).transaction(d => { if (!d || d.est !== 'juego' || d.turno !== rol || d.tab[i] !== '.') return; const t = d.tab.split(''); t[i] = rol === 'a' ? 'X' : 'O'; d.tab = t.join('');
          const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], w = L.find(([x, y, z]) => t[x] !== '.' && t[x] === t[y] && t[x] === t[z]);
          if (w) { d.est = 'fin'; d.gan = t[w[0]] === 'X' ? 'a' : 'b'; } else if (!t.includes('.')) { d.est = 'fin'; d.gan = 'e'; } else d.turno = rol === 'a' ? 'b' : 'a'; d.t = Date.now(); return d; }); },
      cerrarDuelo(id) { R.child('duelos/' + id + '/visto_' + yo.id).set(true); },
      salir() { me.remove(); ['jug', 'chat', 'ctl', 'duelos'].forEach(k => R.child(k).off()); }
    };
  }
  async function monitor(cfg, sala, on) {
    const D = await db(cfg), R = D.ref('salas/' + sala);
    R.child('jug').on('value', s => on.jug && on.jug(s.val() || {}));
    R.child('chatlog').limitToLast(200).on('value', s => { const v = s.val() || {}; on.log && on.log(Object.keys(v).map(k => v[k]).sort((a, b) => a.t - b.t)); });
    R.child('ctl').on('value', s => on.ctl && on.ctl(s.val() || {}));
    R.child('duelos').on('value', s => { const v = s.val() || {}; on.duelos && on.duelos(Object.keys(v).map(k => Object.assign({ id: k }, v[k]))); });
    return { set: (k, v) => R.child('ctl/' + k).set(v), mute: (id, v) => R.child('ctl/mute/' + id).set(v || null), borrarChat: () => { R.child('chat').remove(); }, salir: () => R.off() };
  }
  window.ESC_RED = { conectar, monitor, filtrar, salaId };
})();

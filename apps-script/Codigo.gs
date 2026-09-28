/**
 * MISIÓN LÓGICA — servidor en Google Apps Script
 * Robótica · U. E. P. La Providencia
 *
 * 1. Cambia la clave de abajo.
 * 2. Ejecuta una vez la función "instalar" (menú ▶ Ejecutar) y acepta los permisos.
 * 3. Implementar → Nueva implementación → Aplicación web
 *    Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario
 * 4. Copia la URL (termina en /exec) y pégala en config.js.
 */

// ========= CONFIGURA AQUÍ =========
const CLAVE_DOCENTE = 'cambia-esta-clave';
// ==================================

const CURSOS = ['8vo', '9no', '10mo', '3BGU'];
const HOJA_VIVO = 'En vivo';
const HOJA_NOTAS = 'Notas';
const GRACIA_MIN = 15;

function instalar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojas = {};
  hojas[HOJA_VIVO] = ['clave', 'sesion', 'curso', 'paralelo', 'pareja', 'nivel', 'niveles', 'puntos', 'bonus', 'nota', 'salidas', 'estado', 'actualizado'];
  hojas[HOJA_NOTAS] = ['fecha', 'curso', 'paralelo', 'sesion', 'integrante 1', 'integrante 2', 'nota', 'puntos', 'bonus', 'salidas', 'estado', 'duración (min)', 'insignias', 'detalle por nivel'];
  Object.keys(hojas).forEach(function (n) {
    let h = ss.getSheetByName(n);
    if (!h) h = ss.insertSheet(n);
    h.getRange(1, 1, 1, hojas[n].length).setValues([hojas[n]]).setFontWeight('bold');
    h.setFrozenRows(1);
  });
}

function doGet(e) { return responder(manejar((e && e.parameter) || {})); }
function doPost(e) {
  let p = {};
  try { p = JSON.parse(e.postData.contents); } catch (x) {}
  return responder(manejar(p));
}
function responder(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function props() { return PropertiesService.getScriptProperties(); }
function leerSesion(curso) { const t = props().getProperty('ses_' + curso); return t ? JSON.parse(t) : null; }
function guardarSesion(curso, s) { props().setProperty('ses_' + curso, JSON.stringify(s)); }
function vigente(s) { return !!(s && s.abierta && Date.now() < s.hasta); }
function aceptaEnvios(s) {
  if (!s) return false;
  if (vigente(s)) return true;
  const fin = s.cerradaEn || s.hasta;
  return Date.now() < fin + GRACIA_MIN * 60000;
}
function norm(t) { return String(t || '').trim().toLowerCase().replace(/\s+/g, ' '); }
function esDocente(p) { return String(p.clave || '') === CLAVE_DOCENTE; }

function manejar(p) {
  try {
    const cursoOk = CURSOS.indexOf(p.curso) >= 0;
    switch (p.accion) {
      case 'estado': {
        if (!cursoOk) return { ok: false, error: 'curso' };
        const s = leerSesion(p.curso);
        if (!vigente(s)) return { ok: true, abierta: false };
        if (String(p.codigo) !== String(s.codigo)) return { ok: true, abierta: true, valido: false };
        const f = buscar(s.id + '|' + norm(p.pareja));
        const ya = f && (f.estado === 'terminado' || f.estado === 'cerrado');
        return { ok: true, abierta: true, valido: true, sesionId: s.id, paralelo: s.paralelo, hasta: s.hasta, yaEntregado: !!ya };
      }
      case 'abrir': {
        if (!esDocente(p)) return { ok: false, error: 'clave' };
        if (!cursoOk) return { ok: false, error: 'curso' };
        const min = Math.max(1, Math.min(240, Number(p.minutos) || 80));
        const s = { abierta: true, codigo: String(1000 + Math.floor(Math.random() * 9000)), id: Utilities.getUuid().slice(0, 8), paralelo: String(p.paralelo || '').toUpperCase(), hasta: Date.now() + min * 60000, abiertaEn: Date.now() };
        guardarSesion(p.curso, s);
        return { ok: true, sesion: s };
      }
      case 'cerrar': {
        if (!esDocente(p)) return { ok: false, error: 'clave' };
        const s = leerSesion(p.curso);
        if (s) { s.abierta = false; s.cerradaEn = Date.now(); guardarSesion(p.curso, s); }
        return { ok: true };
      }
      case 'sesiones': {
        if (!esDocente(p)) return { ok: false, error: 'clave' };
        const o = {};
        CURSOS.forEach(function (c) { const s = leerSesion(c); o[c] = s ? { abierta: vigente(s), codigo: s.codigo, paralelo: s.paralelo, hasta: s.hasta, id: s.id } : { abierta: false }; });
        return { ok: true, sesiones: o };
      }
      case 'envivo': {
        if (!esDocente(p)) return { ok: false, error: 'clave' };
        const s = leerSesion(p.curso);
        if (!s) return { ok: true, filas: [] };
        return { ok: true, filas: filasDeSesion(s.id) };
      }
      case 'notas': {
        if (!esDocente(p)) return { ok: false, error: 'clave' };
        const h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_NOTAS);
        if (!h || h.getLastRow() < 2) return { ok: true, filas: [] };
        const filas = h.getRange(2, 1, h.getLastRow() - 1, 14).getValues()
          .filter(function (r) { return !p.curso || r[1] === p.curso; })
          .map(function (r) { return { fecha: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), curso: r[1], paralelo: r[2], sesionId: r[3], a: r[4], b: r[5], nota: r[6], puntos: r[7], bonus: r[8], salidas: r[9], estado: r[10], duracionMin: r[11], insignias: r[12], detalle: r[13] }; });
        return { ok: true, filas: filas };
      }
      case 'progreso':
      case 'entregar': {
        if (!cursoOk) return { ok: false, error: 'curso' };
        const s = leerSesion(p.curso);
        if (!s || s.id !== p.sesionId || !aceptaEnvios(s)) return { ok: false, error: 'sesion' };
        const lock = LockService.getScriptLock();
        lock.waitLock(10000);
        try {
          const clave = s.id + '|' + norm(p.pareja);
          const previa = buscar(clave);
          if (previa && (previa.estado === 'terminado' || previa.estado === 'cerrado')) return { ok: true, duplicado: true };
          const estado = p.accion === 'entregar' ? (p.estado === 'cerrado' ? 'cerrado' : 'terminado') : String(p.estado || 'jugando');
          escribirVivo(clave, s.id, p, estado);
          if (p.accion === 'entregar') {
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_NOTAS).appendRow([
              new Date(), p.curso, s.paralelo || p.paralelo, s.id, p.a, p.b, Number(p.nota) || 0, Number(p.puntos) || 0,
              Number(p.bonus) || 0, Number(p.salidas) || 0, estado, Number(p.duracionMin) || 0, p.insignias || '', p.detalle || ''
            ]);
          }
        } finally { lock.releaseLock(); }
        return { ok: true };
      }
    }
    return { ok: false, error: 'accion' };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function hojaVivo() { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_VIVO); }
function buscar(clave) {
  const h = hojaVivo(); if (!h || h.getLastRow() < 2) return null;
  const c = h.getRange(2, 1, h.getLastRow() - 1, 1).createTextFinder(clave).matchEntireCell(true).findNext();
  if (!c) return null;
  const v = h.getRange(c.getRow(), 1, 1, 13).getValues()[0];
  return { fila: c.getRow(), estado: v[11] };
}
function escribirVivo(clave, sesion, p, estado) {
  const h = hojaVivo();
  const fila = [clave, sesion, p.curso, p.paralelo || '', p.pareja || '', Number(p.nivel) || 0, Number(p.niveles) || 0, Number(p.puntos) || 0, Number(p.bonus) || 0, Number(p.nota) || 0, Number(p.salidas) || 0, estado, new Date()];
  const f = buscar(clave);
  if (f) h.getRange(f.fila, 1, 1, fila.length).setValues([fila]);
  else h.appendRow(fila);
}
function filasDeSesion(id) {
  const h = hojaVivo(); if (!h || h.getLastRow() < 2) return [];
  return h.getRange(2, 1, h.getLastRow() - 1, 13).getValues()
    .filter(function (r) { return r[1] === id; })
    .map(function (r) { return { pareja: r[4], paralelo: r[3], nivel: r[5], niveles: r[6], puntos: r[7], bonus: r[8], nota: r[9], salidas: r[10], estado: r[11] }; });
}

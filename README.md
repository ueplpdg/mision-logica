# Misión Lógica — actividad en computadora

Robótica · U. E. P. La Providencia · 8vo, 9no y 3ro BGU · en parejas · 80 minutos.

Actividad interactiva que se califica sola y envía la nota a una hoja de Google Sheets del docente.
La actividad solo se abre cuando el docente la habilita desde su panel con un código de 4 números.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La actividad de los estudiantes |
| `escape.html` | **Escape del Laboratorio** (3ro BGU): juego 3D para dos jugadores en un teclado |
| `docente.html` | Panel docente: abrir/cerrar, código de clase, seguimiento en vivo y ranking para la TEROS |
| `banco-ejercicios.js` | Todos los ejercicios de los tres cursos (se pueden editar) |
| `config.js` | Aquí va la URL del servidor. Vacía = modo demostración |
| `apps-script/Codigo.gs` | Código del servidor para Google Apps Script |
| `support.js` | Soporte de la página. No editar |

## Puesta en marcha (una sola vez, unos 20 minutos)

### 1. La hoja de notas
1. Entra a [sheets.new](https://sheets.new) con tu cuenta de Google y nómbrala «Misión Lógica — Notas».
2. Menú **Extensiones → Apps Script**.
3. Borra lo que aparece y pega todo el contenido de `apps-script/Codigo.gs`.
4. En la línea `const CLAVE_DOCENTE = 'cambia-esta-clave';` pon tu propia clave.
5. Guarda (ícono de disquete).
6. Arriba, elige la función **instalar** y pulsa **▶ Ejecutar**. Google pedirá permisos:
   *Revisar permisos → tu cuenta → Configuración avanzada → Ir a (no seguro) → Permitir*.
   Es normal: el script es tuyo. Se crean las pestañas «En vivo» y «Notas».

### 2. Publicar el servidor
1. En Apps Script: **Implementar → Nueva implementación**.
2. Tipo (engranaje): **Aplicación web**.
3. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
4. **Implementar** y copia la URL que termina en `/exec`.

> Si más adelante cambias el código, usa **Implementar → Administrar implementaciones → editar (lápiz) → Versión: nueva**. Así la URL no cambia.

### 3. Subir la app a GitHub
1. Crea un repositorio nuevo, por ejemplo `mision-logica`, y sube el contenido de esta carpeta a la raíz.
2. Abre `config.js` en GitHub (lápiz para editar) y pega la URL entre las comillas:
   `scriptUrl: 'https://script.google.com/macros/s/……/exec'`
3. **Settings → Pages → Source: main / root → Save**. En un minuto queda publicada en
   `https://<usuario>.github.io/mision-logica/`.

### 4. Prueba antes de la clase
1. En tu computadora abre `…/mision-logica/docente.html`, entra con tu clave, elige un curso y **Abrir**.
2. En otra pestaña abre `…/mision-logica/` y entra con el código que te muestra el panel.
3. Juega un nivel y revisa que en el panel aparezca la pareja y en la hoja la pestaña «En vivo».
4. Cierra la actividad desde el panel.

## En cada clase
1. Enciende las computadoras del laboratorio y abre en cada una la dirección de la app. Déjala en la pantalla de ingreso.
2. En tu computadora abre `docente.html`, elige curso, escribe el paralelo y **Abrir**.
3. Proyecta el código en la TEROS. Las parejas lo escriben y entran.
4. Pestaña **En vivo**: ves en qué nivel va cada pareja y quién salió de la actividad.
5. Al final, pestaña **Ranking (TEROS)** para proyectar el podio.
6. **Cerrar la actividad**. Las notas quedan en la pestaña «Notas» de tu hoja.

## Cómo se califica
- 4 niveles + reto contrarreloj. Cada nivel: ejemplo resuelto → ejercicios de dificultad creciente
  (Guiado, Guiado, Solo, Experto).
- Primer intento: puntos completos. Segundo intento: la mitad. En el reto no hay segundo intento.
- Extras: racha de 3 aciertos (+3), nivel dentro del tiempo objetivo (+4), segundos sobrantes en el reto,
  comodines sin usar (+3 cada uno).
- Nota = (puntos + extras) ÷ puntos posibles × 10, con tope 10.
- Cada pareja recibe variantes distintas (números, orden de opciones) según sus nombres.

## Sistema cerrado: qué hace y qué no
- Pantalla completa; bloquea copiar, pegar, seleccionar, clic derecho y atajos de teclado.
- Detecta cuando salen (otra pestaña, otra ventana, Esc, recargar): bloquea la pantalla, lo registra,
  quita un comodín (o 5 puntos) y a la **tercera salida cierra el intento** con la nota que tenían.
- Si cierran o recargan el navegador, el progreso se recupera en la misma computadora y cuenta como salida.
- **No puede** impedir el uso del celular ni Alt+Tab: ningún navegador lo permite. Para un bloqueo total
  del sistema operativo está **Safe Exam Browser** (gratuito, safeexambrowser.org): se instala en las PCs
  y se configura para abrir solo la dirección de la app.

## Editar los ejercicios
Todo está en `banco-ejercicios.js`. En preguntas de opción múltiple la **correcta va siempre primera**:
la app baraja las opciones. Las funciones con `h.int(...)` generan números distintos para cada pareja.

## Modo demostración
Con `config.js` vacío, la app funciona sin servidor: el código es **1234** y las notas quedan solo en
ese navegador. Sirve para probar y para mostrar la actividad antes de configurarla.

## Escape del Laboratorio (10mo EGB y 3ro BGU)
Juego 3D para dos jugadores en una computadora: **J1 con W A S D**, **J2 con las flechas**.
Cruzan el patio del colegio, entran juntos al laboratorio y reactivan 4 terminales parándose
los dos sobre sus placas. Cada terminal tiene 3 rondas adaptativas (acierto → sube de nivel,
fallo → baja): Cerradura de reglas (series), Sala de interrogatorio (leales y saboteadores),
Terminal Mastermind (código) y Torre de energía (planificación). Batería + puntos; nota sobre 10.
Usa el mismo servidor y el mismo panel docente (curso **3BGU**). Necesita internet: el motor 3D
se descarga al abrir la página.

### Novedades
- Sirve para **10mo EGB** y **3ro BGU**: se elige el curso al entrar. 10mo empieza cada terminal en nivel 1; 3ro BGU, en nivel 2.
- Quinta terminal: **Panel de compuertas** (AND, OR, XOR, NAND, NOR) con tabla de verdad y prueba de todas las filas a la vez.
- Botón **ENTREGAR** en la partida: si no alcanzan a terminar, la nota se calcula con lo que llevan.
- Nota = puntos obtenidos sobre el máximo del curso (9,5) + batería restante (hasta 0,5).

### Ver y descargar las notas
- Las notas llegan solas a la hoja de Google (pestaña **Notas**). Desde ahí: Archivo → Descargar → Excel.
- O desde el **panel docente** (`docente.html`): botón **Descargar notas de este curso (Excel)**.
- **Importante:** si ya tenías el servidor publicado, vuelve a pegar `apps-script/Codigo.gs` (ahora incluye 10mo y la descarga de notas) y usa *Implementar → Administrar implementaciones → editar → Versión: nueva*. La URL no cambia.

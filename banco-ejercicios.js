// Banco de ejercicios de "Misión Lógica". Cada nivel: ejemplo resuelto + ejercicios.
// En mc la opción correcta va siempre PRIMERA: el motor las baraja.
(function () {
  const N = {
    o: t => ({ k: 'o', t }),
    r: t => (typeof t === 'number' ? { k: 'r', s: t } : { k: 'r', t }),
    p: t => (typeof t === 'number' ? { k: 'p', s: t } : { k: 'p', t }),
    d: (t, no, nota) => Object.assign(typeof t === 'number' ? { k: 'd', s: t } : { k: 'd', t }, no ? { no, nota } : {}),
    l: t => ({ k: 'l', t }),
    nr: t => (typeof t === 'number' ? { k: 'r', s: t } : { k: 'r', t }),
    np: t => (typeof t === 'number' ? { k: 'p', s: t } : { k: 'p', t })
  };

  const D = {
    luz: () => [N.o('INICIO'), N.p('Leer el sensor de luz'), N.d('¿está oscuro?', N.nr('Dejar la luz apagada'), '→ FIN'), N.r('Prender la luz'), N.o('FIN')],
    huella: () => [N.o('INICIO'), N.p('Leer la huella'), N.d('¿huella registrada?', N.np('Mostrar «acceso negado»'), '→ FIN'), N.r('Abrir la puerta'), N.o('FIN')],
    tacho: () => [N.o('INICIO'), N.p('Medir qué tan lleno está (%)'), N.d('¿más de 80 %?', N.nr('No hacer nada'), '→ FIN'), N.p('Avisar al conserje'), N.o('FIN')],
    timbre: () => [N.o('INICIO'), N.p('Leer la hora del reloj'), N.d('¿son las 10:00?', N.nr('No sonar'), '→ FIN'), N.r('Sonar el timbre 5 s'), N.o('FIN')],
    riego: () => [N.o('INICIO'), N.p('Leer la humedad de la tierra'), N.d('¿la tierra está seca?', N.nr('No regar'), '→ FIN'), N.r('Regar 5 segundos'), N.o('FIN')],
    macetas: (n, s) => [N.o('INICIO'), N.r('Poner 0 en MACETAS'), N.d('¿MACETAS menor a ' + n + '?', N.np('Mostrar «listo»'), '→ FIN'), N.r('Regar ' + s + ' segundos'), N.r('Aumentar MACETAS en 1'), N.l('regresa al rombo')]
  };

  const FIGURAS = [
    ['Leer la huella del estudiante', 'p'], ['¿el tacho está lleno?', 'd'], ['Encender el ventilador', 'r'],
    ['Mostrar «acceso negado»', 'p'], ['INICIO', 'o'], ['Regar 5 segundos', 'r'], ['¿son las 10:00?', 'd'],
    ['Leer la temperatura del aula', 'p'], ['Sonar el timbre', 'r'], ['¿la tierra está seca?', 'd'],
    ['FIN', 'o'], ['Medir la distancia con el sensor', 'p'], ['Aumentar CONTADOR en 1', 'r'], ['¿MACETAS menor a 3?', 'd']
  ];
  const expFig = { o: 'Óvalo: marca dónde empieza o termina.', r: 'Rectángulo: es una acción que el sistema hace.', p: 'Paralelogramo: es un dato que entra (leer un sensor) o sale (mostrar un aviso).', d: 'Rombo: es una pregunta de SÍ o NO.' };
  const figuraPool = FIGURAS.map(([t, k]) => () => ({ tipo: 'figura', enunciado: '¿Qué figura le corresponde a este paso?', destacado: t, correcta: k, pista: 'Pregúntate: ¿empieza o termina? ¿hace algo? ¿entra o sale un dato? ¿pregunta algo?', explicacion: expFig[k] }));

  const C8 = {
    nombre: 'Octavo EGB',
    niveles: [
      {
        nombre: 'Las cuatro figuras', tag: 'Guiado', objetivo: 300,
        ejemplo: {
          titulo: 'Así se arma un diagrama', problema: 'La luz del pasillo queda prendida todo el día. Queremos que un sensor decida cuándo prenderla.', nodos: D.luz(),
          pasos: [
            { t: 'Todo diagrama empieza con un óvalo: INICIO.', ver: 1 },
            { t: 'Primero se consigue el dato. Leer un sensor es un dato que ENTRA: va en un paralelogramo.', ver: 2 },
            { t: 'Con el dato se hace una pregunta de SÍ o NO: va en un rombo. El rombo siempre tiene dos salidas.', ver: 3 },
            { t: 'Si la respuesta es SÍ, se prende la luz. Una acción va en un rectángulo.', ver: 4 },
            { t: 'Los dos caminos terminan en el mismo FIN. ¡Listo! Ahora te toca a ti.', ver: 5 }
          ]
        },
        ejercicios: [
          { pool: figuraPool, toma: 4 },
          { tipo: 'mc', enunciado: '¿Cuántas salidas tiene siempre un rombo?', opciones: ['Dos: SÍ y NO', 'Una', 'Tres', 'Las que se necesiten'], pista: 'Piensa en las respuestas posibles a una pregunta de sí o no.', explicacion: 'El rombo pregunta algo de SÍ o NO, por eso tiene exactamente dos salidas.' }
        ]
      },
      {
        nombre: 'Seguir el camino', tag: 'Guiado', objetivo: 360,
        ejemplo: {
          titulo: 'La prueba de escritorio', problema: 'El timbre del recreo debe sonar solo a las 10:00. Probemos el diagrama con un dato real.', nodos: D.timbre(),
          pasos: [
            { t: 'Probar un diagrama es recorrerlo con un dato inventado. Probemos con la hora 09:45.', ver: 2 },
            { t: 'El rombo pregunta «¿son las 10:00?». Con 09:45 la respuesta es NO.', ver: 3 },
            { t: 'Con NO se sigue la flecha del costado: no suena, y llega a FIN.', ver: 3 },
            { t: 'Ahora con 10:00: la respuesta es SÍ, se baja y suena el timbre 5 segundos.', ver: 5 }
          ]
        },
        ejercicios: [
          h => { const c = h.pick([['hay sol', 'La luz queda apagada'], ['está oscuro', 'La luz se prende'], ['es de noche', 'La luz se prende'], ['entra luz por la ventana', 'La luz queda apagada']]); const otras = ['La luz se prende', 'La luz queda apagada'].filter(x => x !== c[1]); return { tipo: 'mc', enunciado: 'El sensor dice que ' + c[0] + '. ¿Qué pasa?', nodos: D.luz(), opciones: [c[1], otras[0], 'La luz parpadea', 'El diagrama se queda en el rombo'], pista: 'Responde la pregunta del rombo con ese dato y sigue la flecha.', explicacion: 'Con ese dato el rombo responde ' + (c[1] === 'La luz se prende' ? 'SÍ' : 'NO') + ' y se sigue esa flecha.' }; },
          h => { const v = h.pick([h.int(40, 79), h.int(81, 99), 80]); const ok = v > 80 ? 'Avisa al conserje' : 'No hace nada'; return { tipo: 'mc', enunciado: 'El sensor mide que el tacho está al ' + v + ' %. ¿Qué hace el sistema?', nodos: D.tacho(), opciones: [ok, ok === 'No hace nada' ? 'Avisa al conserje' : 'No hace nada', 'Vacía el tacho', 'Vuelve a medir'], pista: 'Ojo con la palabra «más de».', explicacion: v === 80 ? '80 no es «más de 80»: la respuesta es NO.' : 'El rombo responde ' + (v > 80 ? 'SÍ' : 'NO') + ' con ' + v + ' %.' }; },
          { tipo: 'orden', enunciado: 'Ordena los pasos del timbre del recreo. Toca en orden, del primero al último.', pasos: ['INICIO', 'Leer la hora del reloj', '¿son las 10:00?', 'Sonar el timbre 5 segundos', 'FIN'], pista: 'Antes de preguntar la hora, hay que leerla.', explicacion: 'INICIO → leer la hora → preguntar → sonar → FIN.' },
          { tipo: 'mc', enunciado: '¿Qué hace la puerta si la huella NO está registrada?', nodos: D.huella(), opciones: ['Muestra «acceso negado»', 'Se abre', 'Vuelve a leer la huella sin avisar', 'Se apaga el sistema'], pista: 'Busca la flecha NO del rombo.', explicacion: 'La salida NO lleva a «Mostrar acceso negado».' }
        ]
      },
      {
        nombre: 'Completar el diagrama', tag: 'Solo', objetivo: 480,
        ejemplo: {
          titulo: 'Estrategia para completar', problema: 'Riego de la maceta del aula: se mide la tierra y se riega solo si está seca.', nodos: D.riego(),
          pasos: [
            { t: '1. Ubica los óvalos: siempre arriba INICIO y abajo FIN.', ver: 1 },
            { t: '2. Busca el dato que entra: casi siempre va justo después de INICIO, en paralelogramo.', ver: 2 },
            { t: '3. La pregunta va en el rombo.', ver: 3 },
            { t: '4. Lo que pasa con SÍ va abajo; lo que pasa con NO va al costado.', ver: 5 }
          ]
        },
        ejercicios: [
          { tipo: 'completar', enunciado: 'Acceso al laboratorio con huella. Toca un texto y luego la figura donde va.', nodos: [N.o('INICIO'), N.p(0), N.d(1, N.np(3), '→ FIN'), N.r(2), N.o('FIN')], solucion: ['Leer la huella', '¿huella registrada?', 'Abrir la puerta', 'Mostrar «acceso negado»'], pista: 'Hay dos paralelogramos: uno lee la huella y otro muestra un aviso.', explicacion: 'Leer la huella → ¿registrada? → SÍ abre la puerta, NO muestra «acceso negado».' },
          { tipo: 'completar', enunciado: 'Ventilador automático del aula.', nodos: [N.o('INICIO'), N.p(0), N.d(1, N.nr(3), '→ FIN'), N.r(2), N.o('FIN')], solucion: ['Leer la temperatura', '¿más de 26 °C?', 'Prender el ventilador', 'Dejarlo apagado'], pista: 'Si hace calor (SÍ), se prende.', explicacion: 'Leer la temperatura → ¿más de 26 °C? → SÍ prende, NO lo deja apagado.' },
          { tipo: 'completar', enunciado: 'Aviso de tacho lleno.', nodos: [N.o('INICIO'), N.p(0), N.d(1, N.nr(3), '→ FIN'), N.p(2), N.o('FIN')], solucion: ['Medir qué tan lleno está', '¿más de 80 %?', 'Avisar al conserje', 'No hacer nada'], pista: 'Avisar es un dato que SALE: va en paralelogramo.', explicacion: 'Medir → ¿más de 80 %? → SÍ avisa, NO no hace nada.' },
          { tipo: 'orden', enunciado: 'Ordena los pasos del riego automático.', pasos: ['INICIO', 'Leer la humedad de la tierra', '¿la tierra está seca?', 'Regar 5 segundos', 'FIN'], pista: 'Dato → pregunta → acción.', explicacion: 'Primero se mide, luego se pregunta y recién ahí se riega.' }
        ]
      },
      {
        nombre: 'Encontrar el error', tag: 'Experto', objetivo: 420,
        ejemplo: {
          titulo: 'Los cuatro errores típicos', problema: 'Un diagrama puede verse bien y estar mal. Estos son los errores que más aparecen:',
          pasos: [
            { t: '1. Figura equivocada: un dato que entra dibujado como rectángulo.' },
            { t: '2. Rombo con una sola salida: le falta el camino NO.' },
            { t: '3. Orden cambiado: preguntar antes de leer el dato.' },
            { t: '4. SÍ y NO cambiados: el sistema hace justo lo contrario.' }
          ]
        },
        ejercicios: [
          { tipo: 'mc', enunciado: '¿Qué está mal en este diagrama?', nodos: [N.o('INICIO'), N.r('Leer la temperatura'), N.d('¿más de 26 °C?', N.nr('Dejarlo apagado'), '→ FIN'), N.r('Prender el ventilador'), N.o('FIN')], opciones: ['«Leer la temperatura» debería ser un paralelogramo', 'Falta un rombo', 'Sobra el FIN', 'Nada, está bien'], pista: 'Mira la forma de cada figura.', explicacion: 'Leer un sensor es un dato que entra: paralelogramo, no rectángulo.' },
          { tipo: 'mc', enunciado: '¿Qué está mal en este diagrama?', nodos: [N.o('INICIO'), N.p('Leer la humedad'), N.d('¿la tierra está seca?'), N.r('Regar 5 segundos'), N.o('FIN')], opciones: ['El rombo no tiene salida NO', 'Regar debería ser un rombo', 'Falta leer la hora', 'Nada, está bien'], pista: 'Cuenta las salidas del rombo.', explicacion: 'Si la tierra está húmeda, el diagrama no dice qué hacer: falta la salida NO.' },
          { tipo: 'mc', enunciado: '¿Qué está mal en este diagrama?', nodos: [N.o('INICIO'), N.d('¿está oscuro?', N.nr('Dejar la luz apagada'), '→ FIN'), N.p('Leer el sensor de luz'), N.r('Prender la luz'), N.o('FIN')], opciones: ['Pregunta antes de leer el sensor', 'Falta un segundo rombo', 'La luz debería ser un óvalo', 'Nada, está bien'], pista: '¿Con qué dato responde el rombo?', explicacion: 'El rombo no puede saber si está oscuro si todavía no se leyó el sensor.' },
          { tipo: 'mc', enunciado: '¿Qué está mal en este diagrama?', nodos: [N.o('INICIO'), N.p('Leer la huella'), N.d('¿huella registrada?', N.nr('Abrir la puerta'), '→ FIN'), N.p('Mostrar «acceso negado»'), N.o('FIN')], opciones: ['SÍ y NO están cambiados: abre a los desconocidos', 'Falta leer la hora', 'La huella debería ir en un rombo', 'Nada, está bien'], pista: 'Sigue el camino de alguien que SÍ está registrado.', explicacion: 'Con SÍ muestra «acceso negado» y con NO abre: hace exactamente lo contrario.' }
        ]
      }
    ],
    reto: {
      segundos: 40,
      ejercicios: [
        { pool: figuraPool, toma: 3 },
        h => { const v = h.int(60, 99); return { tipo: 'mc', enunciado: 'Tacho al ' + v + ' %, regla «más de 80 % → avisar». ¿Avisa?', opciones: [v > 80 ? 'Sí' : 'No', v > 80 ? 'No' : 'Sí'], explicacion: v + (v > 80 ? ' es más de 80.' : ' no es más de 80.') }; },
        { tipo: 'mc', enunciado: 'Un rombo sin salida NO…', opciones: ['está incompleto', 'es correcto si la respuesta casi siempre es SÍ', 'se convierte en rectángulo', 'termina el diagrama'], explicacion: 'Todo rombo necesita sus dos salidas.' },
        { tipo: 'mc', enunciado: '«Mostrar el mensaje en la pantalla» va en…', opciones: ['un paralelogramo', 'un rectángulo', 'un rombo', 'un óvalo'], explicacion: 'Mostrar es un dato que sale: paralelogramo.' }
      ]
    }
  };

  const C9 = {
    nombre: 'Noveno EGB',
    niveles: [
      {
        nombre: 'Repaso y bucles', tag: 'Guiado', objetivo: 300,
        ejemplo: {
          titulo: 'Un bucle con contador', problema: 'El aula tiene 3 macetas. El sistema las riega una por una y avisa al terminar.', nodos: D.macetas(3, 4),
          pasos: [
            { t: 'La caja MACETAS cuenta cuántas van regadas. Empieza en 0, FUERA del bucle.', ver: 2 },
            { t: 'El rombo pregunta si faltan macetas. Con 0, la respuesta es SÍ.', ver: 3 },
            { t: 'Se riega y se aumenta el contador en 1: ahora MACETAS vale 1.', ver: 5 },
            { t: 'La flecha regresa al rombo: así se forma el bucle. Se repite con 1 y con 2.', ver: 6 },
            { t: 'Cuando MACETAS llega a 3, el rombo responde NO: se muestra «listo» y termina.', ver: 6 }
          ]
        },
        ejercicios: [
          { pool: figuraPool, toma: 2 },
          { tipo: 'mc', enunciado: '¿Qué convierte un diagrama en un bucle?', opciones: ['Una flecha que regresa a un rombo anterior', 'Tener dos FIN', 'Usar dos rectángulos seguidos', 'Empezar con un rombo'], pista: 'Piensa en algo que se repite.', explicacion: 'El bucle aparece cuando una flecha vuelve atrás, a una pregunta que decide si seguir.' },
          { tipo: 'mc', enunciado: 'Para contar cuántas veces pasa algo se usa…', opciones: ['una caja contador que aumenta en 1', 'un óvalo extra', 'un paralelogramo por cada vez', 'un rombo sin salida NO'], pista: 'Como MACETAS en el ejemplo.', explicacion: 'Un contador empieza en 0 y aumenta en 1 en cada vuelta.' }
        ]
      },
      {
        nombre: 'Prueba de escritorio', tag: 'Guiado', objetivo: 480,
        ejemplo: {
          titulo: 'Seguir un bucle con una tabla', problema: 'Para no perderse en un bucle, se anota cada vuelta en una tabla.',
          pasos: [
            { t: 'Vuelta 1: MACETAS = 0 → ¿0 menor a 3? SÍ → riega → MACETAS = 1.' },
            { t: 'Vuelta 2: MACETAS = 1 → SÍ → riega → MACETAS = 2.' },
            { t: 'Vuelta 3: MACETAS = 2 → SÍ → riega → MACETAS = 3.' },
            { t: 'Se pregunta otra vez: ¿3 menor a 3? NO → sale. Se preguntó 4 veces y se regó 3.' }
          ]
        },
        ejercicios: [
          h => { const n = h.int(3, 6), s = h.int(3, 6); return { tipo: 'num', enunciado: 'Hay ' + n + ' macetas y se riega ' + s + ' segundos cada una. ¿Cuántos segundos riega en total?', nodos: D.macetas(n, s), respuesta: n * s, unidad: 's', pista: 'Cuenta cuántas vueltas da el bucle.', explicacion: n + ' vueltas × ' + s + ' s = ' + (n * s) + ' s.' }; },
          h => { const n = h.int(3, 7); return { tipo: 'num', enunciado: 'Con ' + n + ' macetas, ¿cuántas veces se hace la pregunta del rombo?', nodos: D.macetas(n, 4), respuesta: n + 1, pista: 'No olvides la última vez, la que responde NO.', explicacion: n + ' veces responde SÍ y 1 vez NO: ' + (n + 1) + ' en total.' }; },
          h => { const pos = h.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, h.int(2, 4)).sort((a, b) => a - b); return { tipo: 'num', enunciado: 'La alarma del laboratorio revisa el sensor PIR 8 veces. Detecta movimiento en las revisiones ' + pos.join(', ') + '. Cada detección suma 1 a ALARMAS (empieza en 0). ¿Cuánto vale ALARMAS al final?', respuesta: pos.length, pista: 'Solo suma cuando detecta.', explicacion: 'Suma 1 en cada detección: ' + pos.length + '.' }; },
          { tipo: 'mc', enunciado: 'Si se borra «Aumentar MACETAS en 1», ¿qué pasa?', nodos: D.macetas(3, 4), opciones: ['Riega para siempre: el rombo siempre responde SÍ', 'Riega una sola vez', 'No riega ninguna', 'Muestra «listo» de inmediato'], pista: 'Si MACETAS no cambia, ¿cambia la respuesta del rombo?', explicacion: 'MACETAS se queda en 0 y el rombo siempre dice SÍ: bucle infinito.' }
        ]
      },
      {
        nombre: 'Rangos y bordes', tag: 'Solo', objetivo: 420,
        ejemplo: {
          titulo: 'Los bordes deciden', problema: 'Ventilador: menos de 20 °C apagado · de 20 a 25 °C baja · 26 °C o más alta.',
          pasos: [
            { t: 'Tres respuestas necesitan DOS rombos: cada rombo divide en dos.' },
            { t: 'Rombo 1: ¿26 o más? SÍ → alta. NO → al rombo 2.' },
            { t: 'Rombo 2: ¿20 o más? SÍ → baja. NO → apagado.' },
            { t: 'Siempre prueba los bordes: 20, 25 y 26. Ahí están los errores.' }
          ]
        },
        ejercicios: [
          h => { const t = h.pick([h.int(14, 19), 20, h.int(21, 24), 25, 26, h.int(27, 33)]); const ok = t < 20 ? 'Apagado' : t <= 25 ? 'Velocidad baja' : 'Velocidad alta'; return { tipo: 'mc', enunciado: 'Regla: menos de 20 °C apagado · de 20 a 25 °C baja · 26 °C o más alta. El sensor marca ' + t + ' °C.', opciones: [ok].concat(['Apagado', 'Velocidad baja', 'Velocidad alta'].filter(x => x !== ok)), pista: 'Fíjate si el número está justo en un borde.', explicacion: t + ' °C → ' + ok.toLowerCase() + '.' }; },
          h => { const d = h.pick([h.int(110, 200), 100, h.int(40, 90), 30, h.int(5, 29)]); const ok = d > 100 ? 'Pitido lento' : d >= 30 ? 'Pitido rápido' : 'Pitido continuo'; return { tipo: 'mc', enunciado: 'Sensor de parqueo: más de 100 cm lento · de 30 a 100 cm rápido · menos de 30 cm continuo. Distancia: ' + d + ' cm.', opciones: [ok].concat(['Pitido lento', 'Pitido rápido', 'Pitido continuo'].filter(x => x !== ok)), pista: '100 y 30 están dentro del rango «de 30 a 100».', explicacion: d + ' cm → ' + ok.toLowerCase() + '.' }; },
          { tipo: 'mc', enunciado: 'Una pareja puso el rombo «¿mayor a 26?» → alta. ¿Qué hace con exactamente 26 °C?', opciones: ['Pone velocidad baja, y debería ser alta', 'Pone velocidad alta, está bien', 'Se apaga', 'Se queda en el rombo'], pista: '¿26 es mayor a 26?', explicacion: '26 no es mayor a 26: la regla pedía «26 o más».' },
          { tipo: 'num', enunciado: '¿Cuántos rombos hacen falta para un ventilador con 4 estados (apagado, baja, media, alta)?', respuesta: 3, pista: 'Con 2 rombos salían 3 estados.', explicacion: 'Cada rombo agrega una salida: 3 rombos → 4 estados.' }
        ]
      },
      {
        nombre: 'Dos decisiones', tag: 'Experto', objetivo: 540,
        ejemplo: {
          titulo: 'Dos preguntas seguidas', problema: 'La puerta del laboratorio abre solo con huella registrada Y en horario de clases.',
          pasos: [
            { t: 'Primero la pregunta que más descarta: ¿huella registrada? Si NO, se niega el acceso.' },
            { t: 'Solo si es SÍ se lee la hora y se hace la segunda pregunta.' },
            { t: 'Hay DOS caminos que llevan a «acceso negado» y solo UNO que abre.' },
            { t: 'Eso es un «Y»: tienen que cumplirse las dos cosas.' }
          ]
        },
        ejercicios: [
          { tipo: 'completar', enunciado: 'Acceso con huella y horario. Completa el diagrama.', nodos: [N.o('INICIO'), N.p(0), N.d(1, N.np('Mostrar «acceso negado»'), '→ FIN'), N.p(2), N.d(3, N.np('Mostrar «acceso negado»'), '→ FIN'), N.r(4), N.o('FIN')], solucion: ['Leer la huella', '¿huella registrada?', 'Leer la hora', '¿entre 07:00 y 14:00?', 'Abrir la puerta'], pista: 'Cada rombo va justo después del dato que necesita.', explicacion: 'Huella → ¿registrada? → hora → ¿en horario? → abrir.' },
          { tipo: 'mc', enunciado: 'La puerta abre si la huella está registrada ___ la hora está en horario.', opciones: ['Y', 'O', 'NI', 'PERO NO'], pista: '¿Basta con una sola condición?', explicacion: 'Tienen que cumplirse las dos: Y.' },
          h => { const hu = h.pick([true, false]), ho = h.pick([true, false]); const ok = hu && ho ? 'Se abre' : 'Muestra «acceso negado»'; return { tipo: 'mc', enunciado: 'Huella ' + (hu ? 'registrada' : 'NO registrada') + ', hora ' + (ho ? '09:30' : '16:10') + '. ¿Qué hace la puerta?', opciones: [ok, ok === 'Se abre' ? 'Muestra «acceso negado»' : 'Se abre', 'Pide la huella otra vez', 'Suena la alarma'], pista: 'El horario es de 07:00 a 14:00.', explicacion: hu && ho ? 'Se cumplen las dos condiciones.' : 'Falla al menos una condición.' }; },
          { tipo: 'mc', enunciado: 'Una pareja puso «Poner 0 en MACETAS» DENTRO del bucle. ¿Qué pasa?', opciones: ['Nunca llega a 3: bucle infinito', 'Riega el doble', 'Funciona igual', 'Riega una sola maceta y termina'], pista: '¿Qué valor tiene MACETAS al volver al rombo?', explicacion: 'En cada vuelta se vuelve a 0 y nunca llega a 3.' }
        ]
      }
    ],
    reto: {
      segundos: 45,
      ejercicios: [
        { pool: figuraPool, toma: 2 },
        h => { const n = h.int(2, 5), s = h.int(2, 5); return { tipo: 'num', enunciado: n + ' macetas × ' + s + ' segundos cada una. ¿Segundos totales?', respuesta: n * s, explicacion: n + ' × ' + s + ' = ' + n * s }; },
        h => { const t = h.pick([19, 20, 25, 26]); const ok = t < 20 ? 'Apagado' : t <= 25 ? 'Baja' : 'Alta'; return { tipo: 'mc', enunciado: 'Ventilador (menos de 20 apagado · 20–25 baja · 26+ alta): ' + t + ' °C', opciones: [ok].concat(['Apagado', 'Baja', 'Alta'].filter(x => x !== ok)), explicacion: t + ' → ' + ok }; },
        { tipo: 'mc', enunciado: '«Suena si hay movimiento O la puerta está abierta». Hay movimiento y la puerta está cerrada. ¿Suena?', opciones: ['Sí', 'No'], explicacion: 'Con O basta una condición.' },
        { tipo: 'mc', enunciado: 'Un contador debe ponerse en 0…', opciones: ['antes del bucle', 'dentro del bucle', 'después del FIN', 'en el rombo'], explicacion: 'Fuera y antes del bucle.' }
      ]
    }
  };

  const NOMBRES = ['Ana', 'Beto', 'Carla', 'Dani', 'Elena', 'Fabián'];
  const FLECHAS = ['↑', '→', '↓', '←'];
  const C3 = {
    nombre: 'Tercero BGU',
    niveles: [
      {
        nombre: 'Razonamiento numérico', tag: 'Guiado', objetivo: 540,
        ejemplo: {
          titulo: 'Escribir debajo, nunca adivinar', problema: 'Serie: 3 · 6 · 11 · 18 · 27 · ?',
          pasos: [
            { t: 'Escribe las diferencias debajo: +3, +5, +7, +9.' },
            { t: 'Las diferencias son impares seguidos: la siguiente es +11.' },
            { t: '27 + 11 = 38.' },
            { t: 'Si las diferencias no dicen nada, cambia de recurso: mira salteado, o mira cocientes.' }
          ]
        },
        ejercicios: [
          h => { let a = h.int(2, 7), d = h.int(2, 4); const t = [a]; for (let i = 0; i < 5; i++) { a += d; d += 2; t.push(a); } return { tipo: 'num', enunciado: 'Serie: ' + t.slice(0, 5).join(' · ') + ' · ?', respuesta: t[5], pista: 'Escribe las diferencias debajo.', explicacion: 'Las diferencias crecen de 2 en 2: el siguiente es ' + t[5] + '.' }; },
          h => { const a = h.int(2, 4), b = h.int(5, 7), t = []; for (let i = 0; i < 4; i++) { t.push(a * Math.pow(2, i)); t.push(b * Math.pow(2, i)); } return { tipo: 'num', enunciado: 'Serie: ' + t.slice(0, 7).join(' · ') + ' · ?', respuesta: t[7], pista: 'Mira salteado: posiciones pares e impares.', explicacion: 'Son dos series que se duplican. La octava es ' + t[7] + '.' }; },
          h => { const p = h.pick([100, 200, 250, 400]), d1 = h.pick([10, 20, 25]), d2 = h.pick([10, 20]); const f = Math.round(p * (1 - d1 / 100) * (1 - d2 / 100) * 100) / 100; return { tipo: 'num', enunciado: 'Un kit Arduino cuesta $' + p + '. Tiene ' + d1 + ' % de descuento y, sobre ese precio, ' + d2 + ' % adicional. ¿Cuánto se paga?', respuesta: f, tol: 0.01, unidad: '$', pista: 'El segundo descuento se calcula sobre el precio ya rebajado.', explicacion: p + ' × ' + (1 - d1 / 100) + ' × ' + (1 - d2 / 100) + ' = ' + f + '. Los descuentos no se suman.' }; },
          h => { let n; let need; do { n = [h.int(6, 9), h.int(6, 9), h.int(6, 9), h.int(6, 9)]; need = 8 * 5 - n.reduce((x, y) => x + y, 0); } while (need < 5 || need > 10); return { tipo: 'num', enunciado: 'Notas: ' + n.join(', ') + '. ¿Qué nota necesita en la quinta para tener promedio 8?', respuesta: need, pista: 'Trabaja con sumas: 8 × 5 = 40.', explicacion: '40 − ' + n.reduce((x, y) => x + y, 0) + ' = ' + need + '.' }; }
        ]
      },
      {
        nombre: 'Razonamiento lógico', tag: 'Guiado', objetivo: 480,
        ejemplo: {
          titulo: 'Lo que se puede asegurar', problema: 'Todos los robots del laboratorio tienen batería. Ares tiene batería. ¿Ares es un robot del laboratorio?',
          pasos: [
            { t: 'Dibuja dos círculos: «robots del laboratorio» DENTRO de «cosas con batería».' },
            { t: 'Ares está en el círculo grande, pero puede estar fuera del pequeño: un celular también tiene batería.' },
            { t: 'Conclusión: NO se puede asegurar. Es la trampa más común.' }
          ]
        },
        ejercicios: [
          { tipo: 'mc', enunciado: 'Todos los robots del laboratorio tienen batería. Ares es un robot del laboratorio. Entonces…', opciones: ['Ares tiene batería', 'Ares no tiene batería', 'No se puede saber', 'Todas las baterías son de robots'], pista: 'Ares está dentro del círculo pequeño.', explicacion: 'Si está dentro de «robots del laboratorio», está dentro de «tienen batería».' },
          { tipo: 'mc', enunciado: 'Todos los que ganaron la feria usaron Arduino. Mateo usó Arduino. Entonces…', opciones: ['No se puede asegurar que Mateo haya ganado', 'Mateo ganó la feria', 'Mateo no ganó', 'Solo ganan los que usan Arduino y Mateo'], pista: 'Es la trampa del ejemplo.', explicacion: 'Muchos usaron Arduino sin ganar.' },
          h => { const n = h.shuffle(NOMBRES).slice(0, 4); return { tipo: 'mc', enunciado: n[0] + ' es mayor que ' + n[1] + '. ' + n[1] + ' es mayor que ' + n[2] + '. ' + n[3] + ' es menor que ' + n[2] + '. ¿Quién es el menor?', opciones: [n[3], n[2], n[1], n[0]], pista: 'Ordénalos en una línea.', explicacion: n[0] + ' > ' + n[1] + ' > ' + n[2] + ' > ' + n[3] + '.' }; },
          { tipo: 'mc', enunciado: 'Si llueve, el sensor de lluvia se activa. Hoy el sensor NO se activó. Entonces…', opciones: ['No llovió (si el sensor funciona)', 'Llovió', 'El sensor está dañado', 'No se puede saber nada'], pista: 'Si hubiera llovido, ¿qué habría pasado?', explicacion: 'Si lloviera se habría activado; como no se activó, no llovió.' }
        ]
      },
      {
        nombre: 'Razonamiento verbal', tag: 'Solo', objetivo: 360,
        ejemplo: {
          titulo: 'Analogías: la relación primero', problema: 'Sensor es a medir como motor es a…',
          pasos: [
            { t: 'Antes de mirar opciones, di la relación en voz alta: «un sensor sirve para medir».' },
            { t: 'Aplica la misma frase: «un motor sirve para…» mover.' },
            { t: 'Si dos opciones encajan, la relación era muy general: hazla más precisa.' }
          ]
        },
        ejercicios: [
          { tipo: 'mc', enunciado: 'Diagrama de flujo es a programa como plano es a…', opciones: ['edificio', 'arquitecto', 'papel', 'regla'], pista: 'El diagrama se hace antes del programa.', explicacion: 'El plano se dibuja antes de construir el edificio.' },
          { tipo: 'mc', enunciado: '¿Cuál NO pertenece al grupo? LED · buzzer · motor · sensor de luz', opciones: ['sensor de luz', 'LED', 'buzzer', 'motor'], pista: '¿Cuál recibe información en vez de producir algo?', explicacion: 'Los otros tres son salidas; el sensor es una entrada.' },
          { tipo: 'mc', enunciado: 'El robot no avanzó ___ la batería estaba descargada.', opciones: ['porque', 'aunque', 'sin embargo', 'por lo tanto'], pista: 'La batería es la causa.', explicacion: '«Porque» introduce la causa.' },
          { tipo: 'mc', enunciado: 'Contador es a sumar como condición es a…', opciones: ['decidir', 'repetir', 'mostrar', 'terminar'], pista: '¿Para qué sirve una condición en el rombo?', explicacion: 'La condición sirve para decidir el camino.' }
        ]
      },
      {
        nombre: 'Razonamiento abstracto', tag: 'Experto', objetivo: 480,
        ejemplo: {
          titulo: 'Buscar qué cambia', problema: '↑ · → · ↓ · ?',
          pasos: [
            { t: 'Compara cada figura con la anterior: ¿qué cambió?' },
            { t: 'La flecha gira un cuarto de vuelta a la derecha cada vez.' },
            { t: 'La siguiente es ←. Si cambian dos cosas a la vez, analiza una por una.' }
          ]
        },
        ejercicios: [
          h => { const s = h.int(0, 3), dir = h.pick([1, 3]); const t = [0, 1, 2, 3, 4].map(i => FLECHAS[(s + dir * i) % 4]); return { tipo: 'mc', enunciado: '¿Qué sigue?  ' + t.slice(0, 4).join('  ') + '  ?', opciones: [t[4]].concat(FLECHAS.filter(x => x !== t[4])), pista: 'Cuenta cuánto gira cada vez.', explicacion: 'Gira un cuarto de vuelta ' + (dir === 1 ? 'a la derecha' : 'a la izquierda') + '.' }; },
          { tipo: 'mc', enunciado: '¿Qué sigue?  ■ · ■● · ■●▲ · ■●▲■ · ?', opciones: ['■●▲■●', '■●▲■■', '■●▲▲●', '●▲■●▲'], pista: 'Cada paso agrega una figura, siempre en el mismo ciclo.', explicacion: 'El ciclo ■●▲ se repite y se agrega una cada vez.' },
          h => { const k = h.int(2, 5); const t = [0, 1, 2, 3, 4].map(i => (k + i) * (k + i)); return { tipo: 'num', enunciado: 'Serie: ' + t.slice(0, 4).join(' · ') + ' · ?', respuesta: t[4], pista: 'Prueba con números al cuadrado.', explicacion: (k + 4) + '² = ' + t[4] + '.' }; },
          h => { const a = h.int(2, 4), b = h.int(5, 8); return { tipo: 'num', enunciado: 'Tabla: (2, 3 → 6) · (4, 5 → 20) · (' + a + ', ' + b + ' → ?)', respuesta: a * b, pista: '¿Qué operación convierte 2 y 3 en 6, y 4 y 5 en 20?', explicacion: a + ' × ' + b + ' = ' + a * b + '.' }; },
          { tipo: 'num', enunciado: 'Si ◆ = 3 y ◆ + ◆ + ● = 10, ¿cuánto vale ●?', respuesta: 4, pista: 'Reemplaza ◆ por 3.', explicacion: '3 + 3 + ● = 10 → ● = 4.' }
        ]
      }
    ],
    reto: {
      segundos: 50,
      ejercicios: [
        h => { let a = h.int(1, 5), d = h.int(1, 3); const t = [a]; for (let i = 0; i < 4; i++) { a += d; d += 1; t.push(a); } return { tipo: 'num', enunciado: t.slice(0, 4).join(' · ') + ' · ?', respuesta: t[4], explicacion: 'Diferencias que crecen de 1 en 1.' }; },
        { tipo: 'mc', enunciado: 'Dos descuentos de 10 % seguidos equivalen a…', opciones: ['19 %', '20 %', '21 %', '10 %'], explicacion: '0,9 × 0,9 = 0,81 → 19 %.' },
        { tipo: 'mc', enunciado: 'Ningún sensor es un motor. Algunos componentes son sensores. Entonces…', opciones: ['Algunos componentes no son motores', 'Ningún componente es motor', 'Todos los componentes son sensores', 'Algunos motores son sensores'], explicacion: 'Los componentes que son sensores no son motores.' },
        { tipo: 'mc', enunciado: 'Entrada es a sensor como salida es a…', opciones: ['actuador', 'cable', 'programa', 'batería'], explicacion: 'Un actuador (LED, motor) es una salida.' },
        h => { const b = h.int(2, 6); return { tipo: 'num', enunciado: 'Si ▲ = ' + b + ' y ▲ × ▲ − ● = ' + (b * b - 3) + ', ¿● = ?', respuesta: 3, explicacion: b * b + ' − ● = ' + (b * b - 3) + ' → ● = 3.' }; }
      ]
    }
  };

  const CURSOS = { '8vo': C8, '9no': C9, '3BGU': C3 };

  function rng(seed) {
    let s = seed >>> 0 || 1;
    return function () { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function helpers(r) {
    const int = (a, b) => a + Math.floor(r() * (b - a + 1));
    const pick = a => a[Math.floor(r() * a.length)];
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; };
    return { int, pick, shuffle };
  }
  function normalizar(e, h, pts) {
    const x = Object.assign({ pts }, e);
    if (x.tipo === 'mc') x.opciones = h.shuffle(e.opciones.map((t, i) => ({ t, ok: i === 0 })));
    if (x.tipo === 'orden') x.items = h.shuffle(e.pasos.map((t, i) => ({ t, i })));
    if (x.tipo === 'completar') x.banco = h.shuffle(e.solucion.slice());
    return x;
  }
  function expandir(lista, h, pts) {
    const out = [];
    lista.forEach(e => {
      if (e.pool) h.shuffle(e.pool).slice(0, e.toma).forEach(f => out.push(normalizar(typeof f === 'function' ? f(h) : f, h, pts)));
      else out.push(normalizar(typeof e === 'function' ? e(h) : e, h, pts));
    });
    return out;
  }
  function construir(curso, seed) {
    const c = CURSOS[curso]; const h = helpers(rng(seed));
    const niveles = c.niveles.map((n, i) => ({ nombre: n.nombre, tag: n.tag, objetivo: n.objetivo, ejemplo: n.ejemplo, ejercicios: expandir(n.ejercicios, h, 10 + i * 2) }));
    niveles.push({ nombre: 'Reto contrarreloj', tag: 'Reto', reto: true, segundos: c.reto.segundos, objetivo: 0,
      ejemplo: { titulo: 'Reto final contrarreloj', problema: 'Preguntas rápidas de todo lo visto. Cada una tiene ' + c.reto.segundos + ' segundos.', pasos: [{ t: 'Sin segundo intento: la primera respuesta es la que vale.' }, { t: 'Los segundos que sobren suman puntos extra.' }, { t: 'Puedes usar el comodín de tiempo extra una sola vez.' }] },
      ejercicios: expandir(c.reto.ejercicios, h, 8) });
    return { nombre: c.nombre, niveles };
  }
  window.MISION_BANCO = { construir, cursos: Object.keys(CURSOS) };
})();

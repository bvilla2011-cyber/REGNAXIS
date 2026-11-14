# REGNAXIS · Documento de diseño del juego

Versión 0.1 · 14 de noviembre de 2026

## 1. Visión

REGNAXIS es un juego de gran estrategia geopolítica en tiempo real para móvil y escritorio. El jugador gobierna cualquier país sobre un mapa mundial continuo: administra población y economía, investiga, negocia tratados, despliega fuerzas terrestres y navales y altera fronteras orgánicas.

La partida debe ser profunda sin esconder sus reglas. Todo valor calculado ofrece un desglose; la IA comunica sus motivos; el jugador puede pausar, inspeccionar, editar, repetir y exportar el mundo según el modo.

### Pilares

1. **Fronteras vivas:** la conquista ocurre punto a punto, no por provincias rígidas.
2. **Poder con coste:** ejército, bienestar e investigación compiten por la misma capacidad económica.
3. **Diplomacia con memoria:** los países actúan por intereses, compromisos y reputación.
4. **Simulación explicable:** fórmulas, modificadores y decisiones están visibles.
5. **Control táctil preciso:** todas las órdenes se pueden dar con un dedo y deshacer cuando proceda.
6. **Mundo del jugador:** editor, scripts, escenarios, repeticiones y formatos exportables.

## 2. Alcance y modos

### Dominación casual

Gana el primer país que controla más del 50 % del PIB mundial. Se permite pausar, guardar y cargar. La IA reconoce amenazas entre sí, pero aplica una tolerancia mayor al jugador.

`progreso = PIB_controlado / PIB_mundial`

La victoria se comprueba al cierre de cada día simulado y exige mantener el umbral durante 7 días para evitar victorias por cambios instantáneos.

### Dominación hardcore

El índice de victoria combina economía, población, ejército y territorio habitable:

`IV = 0,50·cuotaPIB + 0,20·cuotaPoblación + 0,20·cuotaPoderMilitar + 0,10·cuotaTerritorio`

Gana quien mantenga `IV > 0,50` durante 14 días. La IA reacciona a todos los candidatos, las ayudas visuales son limitadas y las reglas de pausa/guardado se parametrizan por escenario.

### Personalizado

Todos los países, datos, reglas, recursos, banderas, tropas, investigaciones, ideologías, IA y condiciones de victoria se pueden editar antes o durante la partida. Admite cambio de país y exportación de escenario.

### Dios

El usuario no controla un país. Observa, acelera, interviene mediante herramientas del editor o deja que la IA simule el mundo.

### Blitz

Escala temporal y productiva acelerada, límite de tiempo, países asignables al azar y alianzas defensivas desactivadas.

### Battle Royale

Todos compiten; la zona jugable puede contraerse por eventos configurables. La puntuación combina posición final, poder máximo, conquistas y supervivencia.

### Guerra Mundial

Países agrupados en coaliciones. Las aportaciones se agregan para la victoria, la relación interna queda fijada y no se permite fuego amigo. Incluye chat de coalición opcional.

### Escenarios incluidos

1914, 1939, 1962, 1990 y actualidad. Cada escenario tiene fronteras, líderes, gobiernos, economía, población, ejércitos, tecnologías, tratados y eventos propios. Los valores históricos se identifican como estimaciones cuando no haya una fuente comparable.

## 3. Tiempo, determinismo y escalas

- Paso de simulación: 1 hora de juego, procesada en lotes de hasta 24 pasos.
- Economía, demografía e investigación: cierre diario; agregación mensual para gráficas.
- Combate y movimiento: subpasos deterministas de 15 minutos cuando hay contacto.
- Semilla: `scenarioSeed + commandSequence`; ninguna regla depende del reloj real.
- Velocidades: pausa, 1×, 2×, 4×, 8× y máxima segura.
- El render funciona a 60 FPS y nunca altera resultados.

Todos los parámetros viven en archivos de reglas versionados. Un escenario guarda la versión y una copia de cualquier valor modificado.

## 4. Mundo continuo

### Representación

La costa y fronteras iniciales proceden de polígonos simplificados. La simulación usa una malla irregular de **células estratégicas** y **puntos de valor**:

- célula: propietario, controlador, terreno, elevación, clima, accesibilidad y vecinos;
- punto: población, producción, recurso, infraestructura, puerto, ciudad o instalación;
- frontera: aristas entre controladores distintos;
- mar: zonas conectadas, rutas, estrechos y puertos.

Las células no se presentan como provincias. El render interpola sus límites para formar fronteras orgánicas.

### Índice espacial y niveles de detalle

- Quadtree para selección, unidades y puntos.
- Geometría simplificada por zoom.
- Etiquetas agrupadas y prioridad estable.
- Solo se actualizan chunks visibles o modificados.
- La cámara es independiente del worker de simulación.

### Valor territorial

`valorCelda = población·vp + PIBlocal·vg + recursos·vr + infraestructura·vi + valorEstratégico`

Los pesos son configurables. El valor guía anexión automática, defensa, paz e IA.

## 5. Anexión, ocupación y resistencia

Una fuerza ocupa desde su posición hacia células adyacentes alcanzables. La velocidad diaria:

`velAnexión = base · movilidad · suministro · moral · superioridad^0,35 · terreno · resistencia^-1`

- `superioridad = clamp(poderAtacante/poderDefensor, 0,25, 4)`.
- Terreno, ríos, clima, fortificaciones y costa modifican el avance.
- Los puntos de población y recursos cambian de controlador cuando la ola de ocupación los alcanza.
- La soberanía legal puede permanecer en el país anterior hasta un tratado o asimilación.

### Milicia y resistencia

`resistencia = poblaciónOcupada · identidad · (1-legitimidad) · (1-servicios) · apoyoExterior`

La resistencia genera sabotaje, información defectuosa, desgaste y milicias. Cae con tiempo, seguridad, autonomía, bienestar y asimilación; aumenta con represión, hambre y derrotas del ocupante.

### Órdenes

- Mover a punto o ruta.
- Atacar país limítrofe, accesible por mar o área dibujada.
- Defender área: interceptar hostiles, rebeliones y desembarcos.
- Anexión automática: elegir la siguiente célula por valor/riesgo.
- Línea o polígono de cordón: distribuir guarnición por prioridad.
- Detener, reagrupar, dividir y fusionar.
- Deshacer última anexión en modos que lo permitan, mediante comando inverso.

La guerra se declara cuando una fuerza intenta cruzar control soberano hostil. Antes de confirmar se muestran tratados, aliados, reputación, fuerzas estimadas y consecuencias.

## 6. Fuerzas terrestres

### Tipos base

Infantería, motorizada, mecanizada, blindada, artillería, defensa aérea, fuerzas especiales, logística, reservistas y paramilitares. Los escenarios pueden añadir o reemplazar tipos.

Cada escuadra tiene personal, material, ataque, defensa, movilidad, alcance, detección, ocultación, consumo, experiencia, moral, preparación y mantenimiento.

### Reclutamiento y entrenamiento

`coste = costeBase · índicePrecios · escalaRenta · escasezMaterial · urgencia · modificadores`

El tooltip muestra cada factor. La cola entrena en paralelo hasta:

`capacidad = base + poblaciónReclutable·c1 + infraestructuraMilitar·c2 + paramilitares·c3`

Los reservistas cuestan menos y solo operan en territorio propio o aliado defensivo. Los paramilitares ayudan a seguridad y capacidad, pero reducen estabilidad si superan límites legales.

### Deterioro y mantenimiento

`deterioroDiario = baseEdad + uso + clima + déficitMantenimiento - financiaciónExtra`

El mantenimiento mínimo cubre salarios y repuestos. Un déficit envejece material, reduce preparación y provoca deserción. Un excedente limitado recupera preparación y puede aumentar poder, con rendimientos decrecientes.

### Suministro

Cada fuerza consume alimento, combustible, munición y repuestos. La red busca una ruta de menor coste a capitales logísticas, depósitos o puertos.

`suministro = min(capacidadRuta/demanda, inventario/demanda, 1)`

Por debajo de 0,7 cae movilidad; bajo 0,4 cae combate; bajo 0,2 aumenta desgaste. Cercos interrumpen rutas terrestres, pero pueden mantenerse por aire o mar.

### Moral

La moral sube con victorias, conquista valiosa, descanso, pago y líder competente. Baja con pérdidas, retirada, territorio perdido, falta de suministro y ataque nuclear.

`moralNueva = clamp(moral + eventos - fatiga + recuperación, 0, 100)`

## 7. Combate

El poder efectivo de una fuerza:

`PE = poderBase · preparación · moral · experiencia · suministro · doctrina · terreno · mando`

Las bajas por subpaso usan una función de Lanchester suavizada:

`bajasA = k · PE_B^0,85 / (PE_A^0,35 + defensaA) · azarDeterminista`

El azar permanece entre 0,9 y 1,1 y se registra. El combate produce retirada cuando moral, suministro o pérdidas cruzan umbrales. El jugador recibe un informe con todos los factores.

## 8. Marina

### Clases

- Destructor: escolta, detección y antisubmarino.
- Crucero: combate general y apoyo costero.
- Acorazado: bombardeo y superioridad de superficie; caro y detectable.
- Portaaviones: alcance aéreo, reconocimiento y apoyo.
- Submarino: ocultación, interdicción y ataque a convoyes.

Transportes y convoyes son capacidad logística, no una clase de combate independiente.

### Sistemas

- Flotas, patrullas, escolta, interdicción y retirada.
- Detección probabilística basada en sensores, clima, firma y cobertura aérea.
- Desembarco condicionado por transporte, puerto, costa, superioridad y suministro.
- Bloqueo reduce comercio, suministro y acceso portuario.
- Estrechos controlados por costas, minas, fortalezas y tratado de paso.
- Apoyo costero con alcance y penalización por defensas.

## 9. Economía y demografía

### Producto interior bruto

El PIB nacional suma producción local controlada y ajustada por ocupación:

`PIB = Σ(producciónPunto · infraestructura · estabilidad · accesoMercado · daño)`

`PIBmañana = PIB · (1 + crecimientoAnual/365) + cambiosTerritoriales`

### Crecimiento

`g = potencialDesarrollo + productividad + comercio + estabilidad - presiónFiscal - inflaciónAlta - guerra - saturación`

Los países cercanos a la renta media mundial tienen mayor convergencia. Países ricos dependen más de investigación y productividad. Recesiones globales alteran demanda y comercio.

### Presupuesto

Ingresos: impuestos, recursos, comercio, empresas públicas, tributos y ayuda. Gastos: administración, deuda, investigación, ejército, bienestar, proyectos y transferencias.

`saldo = ingresos - gastos`

Déficits se financian con deuda o emisión. La deuda aumenta intereses; la emisión eleva inflación y deprecia el tipo de cambio. No existe un límite duro, pero una espiral fiscal reduce crecimiento y valor real del presupuesto.

### Inflación

`inflación = base + brechaDemanda·a + emisión·b + shockImportación - productividad·c`

La política económica controla impuestos, interés, apertura, regulación y emisión. Toda acción muestra efectos inmediatos y previsión con incertidumbre.

### Bienestar, población y migración

`poblaciónNueva = población + nacimientos - muertes + inmigración - emigración`

Nacimientos y mortalidad dependen de renta, bienestar, salud, guerra y densidad. Migración depende de renta relativa, gasto social, seguridad, libertad, cultura, fronteras y capacidad habitable. El exceso de densidad reduce crecimiento demográfico.

## 10. Investigación

### Producción de puntos

`RPdía = financiación^0,65 · población^0,25 · eficienciaRenta · estabilidad · modificadores`

`eficienciaRenta = clamp(0,45 + 0,55·sqrt(PIBpc/mediaMundial), 0,35, 1,35)`

La raíz y límites evitan que países ricos o pobres queden fuera de escala.

### Árbol

Ramas en columnas con proyectos y pares excluyentes. Invertir en un lado consume el límite compartido del par. Proyectos avanzados exigen inversión acumulada mínima en su rama.

Tipos:

- Permanente: pago único y bonificación fija.
- Continua: consume RP diarios y escala con asignación.
- De área: el jugador pinta una región; más RP amplía radio e intensidad.
- Por lotes: proyecto final repetible con coste creciente.
- Prestigio: reinicia parte del progreso opcionalmente a cambio de modificadores persistentes del perfil o escenario, nunca de pago real.

Ramas iniciales: industria, informática, energía, sociedad, doctrina terrestre, naval, aeroespacial, inteligencia y nuclear.

## 11. Diplomacia

### Relación y estado

Cada par mantiene relación de 0 a 100, confianza, miedo, dependencia, agravios, tratados e intereses. Por defecto, menos de 25 implica guerra y más de 75 permite alianza, aunque escenarios pueden modificar umbrales.

`relaciónObjetivo = afinidad + confianza + comercio + amenazaComún - agravios - rivalidad`

La relación converge gradualmente. La interfaz explica cada sumando.

### Posición internacional

Empieza en 100 y cae por invasión, nuclear, ruptura de tregua, anexión no reconocida o abandono de aliados. Se recupera con tiempo, ayuda, defensa de tratados, mediación y liberación.

`costeDiplomático = costeBase · (1 + (100-posición)/100) · dificultadObjetivo`

### Tratados

Alianza, tregua, no agresión, comercio, paso militar, defensa mutua, garantía, vasallaje, protectorado, sanción, embargo y paz negociada. Cada acuerdo define duración, cláusulas, coste, condiciones de salida y penalización por ruptura.

Las ofertas pueden incluir dinero, territorio dibujado, reparaciones, recursos, acceso, desmilitarización, liberación de países y reconocimiento de soberanía.

### Aceptación de IA

`utilidad = beneficio + amenazaEvitada + afinidad + confianza - coste - riesgo - agravio`

La IA acepta si la utilidad supera un umbral ajustado por personalidad y dificultad. Nunca se muestra una probabilidad falsa: se muestra la evaluación cualitativa y los factores conocidos.

## 12. Gobiernos, ideologías y líderes

Una ideología combina dos ejes graduables y un efecto final. El gobierno añade reglas de mandato, sucesión, participación, estabilidad y libertad política.

Los líderes tienen nombre, retrato SVG por capas, edad, experiencia, habilidad natural, rasgos positivos y negativos, legitimidad y mandato. Los retratos no imitan personas reales salvo datos históricos de dominio permitido.

Sucesión por elección, herencia, designación, muerte, dimisión o golpe. Los golpes comparan legitimidad, estabilidad, élites, ejército y apoyo exterior. Una transición violenta puede dividir fuerzas y territorio.

## 13. Rebeliones, eventos y nuclear

### Rebelión

`riesgo = ocupación + identidad + miseria + represión + influenciaExterior - bienestar - autonomía - seguridad`

Antes del estallido existen señales y respuestas políticas. El tamaño rebelde depende de población y acceso a arsenales, nunca aparece como poder arbitrario.

### Eventos

Terremotos, sequías, inundaciones, epidemias, descubrimientos, crisis financieras y migraciones. La frecuencia, severidad y regiones válidas son configurables; cada evento usa una semilla registrada.

### Armas nucleares

Exigen investigación, material, instalación y vector. Efectos: bajas, daño productivo, contaminación, moral, posición internacional y escalada. La IA calcula represalia según doctrina, capacidad sobreviviente, detección y alianzas. El juego advierte claramente antes de lanzar.

## 14. IA explicable

La IA usa planificación por utilidad con objetivos: supervivencia, crecimiento, seguridad, prestigio, ideología y victoria. Cada país evalúa economía, tratados, fuerzas, logística y amenazas a intervalos escalonados.

Estados principales: estabilizar, reconstruir, disuadir, aliar, comerciar, prepararse, expandirse, defender y negociar paz.

Antes de una guerra puede emitir reclamaciones, ultimátum, movilización o advertencia. El panel de inteligencia muestra razones conocidas y grado de certeza.

Dificultad modifica profundidad de planificación, errores y reacción; no crea recursos secretos salvo que el escenario lo declare. Todos los multiplicadores son configurables.

## 15. Editor y scripts

### Editor táctil

Capas: costa, elevación, terreno, clima, población, PIB, recursos, infraestructura, países, reclamaciones, tratados, unidades y eventos. Herramientas: pincel, borrador, relleno, lazo, línea, polígono, suavizado, sello, cuentagotas, transformar y deshacer/rehacer.

Se pueden crear países, banderas, líderes, gobiernos, recursos, tropas, tecnologías y condiciones de victoria. El editor funciona durante una partida personalizada.

### Scripts

Modelo declarativo sin `eval`:

- disparadores: fecha, intervalo, control territorial, variable, tratado, batalla, economía o interacción;
- condiciones: comparaciones, pertenencia, relaciones, áreas y operadores lógicos;
- acciones: evento, variable, recursos, relación, tratado, unidad, frontera, UI, victoria y audio.

Los scripts tienen límites de instrucciones, memoria y frecuencia. El formato JSON se valida contra esquema y versión.

### Galería

Importación y exportación local siempre disponibles. La galería online es opcional, con metadatos, versión, miniatura, autor, dependencias y moderación.

## 16. Guardado, carga y repetición

### Formato

- Cabecera: versión, escenario, reglas, semilla y hashes.
- Instantánea completa al inicio y cada 30 días configurables.
- Instantánea incremental diaria de componentes modificados.
- Registro de comandos y eventos con secuencia y checksum.
- Puntos clave manuales y automáticos: guerras, tratados, cambios de líder y victoria.

Para saltar al día D se carga la instantánea más próxima anterior y se aplican eventos posteriores. Las miniaturas y gráficas se guardan aparte para que el menú no abra toda la simulación.

### Repetición

Línea temporal con reproducción, pausa, velocidades, salto, marcadores, cámaras guardadas y capas. Puede bifurcarse en una nueva partida si las reglas lo permiten.

### Compatibilidad

Migradores transforman formatos antiguos sin modificar el original. Un guardado corrupto conserva las instantáneas válidas y ofrece recuperación.

## 17. Multijugador

### Modos

- Contra IA.
- Pasar y jugar local con ocultación entre turnos de órdenes cuando el modo lo requiera.
- Online con salas públicas o privadas, código y contraseña opcional.

### Modelo de red

La simulación es lockstep determinista. El anfitrión lógico ordena comandos; clientes verifican hashes. Ante divergencia se envía una instantánea de reparación. La cámara y UI son locales.

Una interfaz `NetworkProvider` permite Appwrite, WebRTC u otro backend. El repositorio solo incluye `config.example.js`; claves públicas de cliente se configuran al desplegar y nunca se incluyen secretos administrativos.

Reconexión por token temporal, espectador, expulsión del anfitrión, latencia visible y guardado de sala. Contraseñas se derivan en servidor y no se almacenan en claro.

## 18. Interfaz y dirección artística

Toda la interfaz se dibuja dentro del juego. El HTML solo monta el canvas y metadatos PWA.

### Escenas

Boot, carga, menú cinemático, selección de país, partida, militar, diplomacia, economía, investigación, ranking, gráficas, editor, repeticiones, perfil/logros, ajustes y tutorial.

### Lenguaje UniFormer

Paneles biselados, metal oscuro, hologramas, ruido, gradientes, neón, partículas y polígonos facetados. La densidad visual conserva jerarquía: datos críticos grandes, secundarios agrupados y detalle bajo demanda.

Tokens: color de fondo, superficie, borde, acento, peligro, éxito, texto, brillo, radio, bisel, sombra, ruido, espacio y tipografía. El logo se carga desde `assets/uniformer-logo.png`; si falta, se usa un marcador SVG original.

### Controles

- Móvil: arrastrar, pellizcar, toque, pulsación larga, doble toque y barra inferior.
- Escritorio: ratón, rueda, WASD/flechas, teclas rápidas y selección múltiple.
- Captura de puntero impide que un toque de UI alcance el mapa.
- Objetivos táctiles mínimos de 48 px.
- Sonidos de interfaz sintetizados con WebAudio y vibración configurable.

### Accesibilidad y calidad

Paletas para deuteranopia, protanopia y tritanopia; contraste alto; texto 80–160 %; reducción de movimiento; subtítulos y señales redundantes. Calidad Alta/Media/Baja cambia partículas, sombras, animación oceánica, LOD y resolución interna, no información jugable.

## 19. Noticias, estadísticas y perfil

Ticker y periódico explican guerras, tratados, elecciones, golpes, crisis, proyectos y récords. Las noticias se generan desde plantillas localizadas y datos de eventos.

Gráficas: PIB, población, inflación, presupuesto, investigación, ejército, bajas, territorio, relaciones y posición internacional. Rankings por victoria y cada métrica.

Logros locales, clasificaciones online opcionales y perfil con emblema, marco, color, historial y estadísticas. Ninguna recompensa altera el equilibrio.

## 20. Misiones y contenido continuo

Las misiones diarias se generan offline desde fecha y semilla, sin obligación de conexión ni rachas punitivas. Eventos y escenarios se distribuyen como paquetes firmados y versionados. Todo contenido jugable permanece exportable.

## 21. Arquitectura técnica prevista

```text
src/
  core/    bucle, escenas, entrada, cámara, audio, persistencia
  sim/     ECS, tiempo, mapa, economía, combate, diplomacia
  ai/      percepción, utilidad, planes y explicación
  ui/      componentes Pixi, temas, paneles, iconos y gráficas
  editor/  herramientas, comandos, validación y scripts
  net/     proveedor abstracto, lockstep, salas y resincro
  i18n/    catálogo, formatos y fuentes
  data/    esquemas, reglas, escenarios y cargadores
docs/
tests/
```

- Componentes puros y datos serializables dentro de la simulación.
- Mensajes versionados entre hilo principal y worker.
- Sin acceso a DOM desde lógica de juego.
- IndexedDB para guardados; Cache Storage para paquetes.
- Service Worker para offline.
- Carga inicial comprimida objetivo menor de 5 MB.

## 22. Verificación prevista

La fase de código incluirá pruebas de simulación sin interfaz solicitadas para:

- victoria casual y hardcore;
- anexión, resistencia y deshacer;
- relaciones, alianzas, treguas y ruptura;
- presupuesto, inflación, crecimiento y población;
- determinismo entre ejecuciones;
- instantánea más eventos igual a simulación continua;
- hash y resincro de red.

También se medirán 60 FPS de cámara en un móvil de gama media, tiempo de entrada menor de 50 ms y carga de una partida larga en menos de 2 segundos cuando exista una instantánea cercana.

## 23. Parámetros iniciales

| Parámetro | Valor inicial | Configurable |
|---|---:|:---:|
| Umbral PIB casual | 50 % | Sí |
| Días para confirmar victoria casual | 7 | Sí |
| Umbral índice hardcore | 50 % | Sí |
| Días para confirmar victoria hardcore | 14 | Sí |
| Alianza desde relación | 75 | Sí |
| Guerra bajo relación | 25 | Sí |
| Paso económico | 1 día | Sí |
| Paso de movimiento | 1 hora | Sí |
| Subpaso de combate | 15 minutos | Sí |
| Instantánea completa | 30 días | Sí |
| Instantánea incremental | 1 día | Sí |
| Objetivo táctil | 48 px | Sí |
| Límite de calidad de azar en combate | ±10 % | Sí |

Los números constituyen el punto de partida original de REGNAXIS. Se equilibrarán con telemetría local voluntaria de pruebas; el juego publicado no incorpora rastreo.

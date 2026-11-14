# Análisis de reseñas y respuesta de diseño

Fecha de consulta: 14 de noviembre de 2026.

## Método

Se revisaron las fichas públicas de Dummynation en App Store de España, Irlanda, Reino Unido, Estados Unidos y otros escaparates regionales, junto con su historial de versiones y guía oficial. Apple muestra subconjuntos distintos según país y dispositivo; por ello la frecuencia es cualitativa y no pretende ser un censo estadístico de todas las reseñas existentes.

Escala usada:

- **Muy alta:** aparece de forma reiterada en varios países o agrupa numerosas quejas equivalentes.
- **Alta:** aparece varias veces o afecta de manera grave a sesiones normales.
- **Media:** solicitud recurrente, pero menos universal.
- **Baja:** petición concreta con valor claro para el diseño.

## Hallazgos

| Petición o queja | Frecuencia | Cómo se resuelve en REGNAXIS |
|---|---:|---|
| Cargar una partida obliga a reproducir toda la simulación y tarda demasiado | Muy alta | Instantánea completa periódica, instantáneas incrementales, registro determinista de eventos y puntos clave. El jugador salta a cualquier momento cargando la instantánea anterior y reproduciendo solo el tramo final. |
| Congelaciones, lag tardío y pérdida del control de zoom o desplazamiento | Muy alta | PixiJS sobre WebGL/WebGPU, simulación en Web Worker, paso fijo, índice espacial, geometría por niveles de detalle, selección mediante quadtree y presupuestos estrictos de CPU/GPU. |
| La aplicación no abre, muestra pantalla negra o deja audio reproduciéndose | Alta | Máquina de estados de arranque recuperable, watchdog del worker, contexto gráfico recreable, carga por manifiesto, audio suspendido en `visibilitychange/pagehide` y guardado de emergencia. |
| Anuncios al comenzar, guardar o cargar; compras para funciones | Alta | Cero anuncios, compras y rastreo. Todas las funciones forman parte del juego. |
| El modo individual requiere conexión | Alta | PWA instalable y completamente offline después de la primera carga. Solo salas, galería y clasificaciones necesitan red. |
| Faltan armadas, submarinos, transporte marítimo y bombardeo costero | Alta | Cinco clases navales, convoyes, desembarcos, bloqueo, detección submarina, apoyo costero, control de estrechos y logística marítima. |
| Diplomacia superficial: comprar aliados, relaciones que caen sin explicación | Muy alta | Relación explicada por factores visibles; tratados negociables; memoria diplomática; intereses de IA; avisos de deterioro; desglose del coste y probabilidad de aceptación. |
| Los aliados no ayudan o atacan sin una razón legible | Alta | Obligaciones de defensa, llamadas a las armas, objetivos coordinados, reputación por cumplir pactos y panel de razones de IA antes de romper o declarar una guerra. |
| Faltan paz negociada, reparto de territorio, reparaciones y fin de guerras estancadas | Muy alta | Conferencia de paz con cesión de áreas dibujadas, retirada, reparaciones, desmilitarización, reconocimiento, liberación, vasallaje y garantía. |
| Faltan pactos de no agresión, comercio, paso militar, defensa y sanciones | Alta | Catálogo de tratados bilateral y multilateral con duración, coste, condiciones, ruptura y consecuencias internacionales. |
| Faltan protectorados o estados títere que puedan rebelarse | Alta | Vasallaje y protectorado con autonomía, tributo, acceso militar, obligaciones bélicas, lealtad y guerra de independencia. |
| Declaraciones de guerra accidentales y tratados olvidados | Media | Confirmación contextual que muestra aliados, treguas, coste diplomático, balance estimado y consecuencias antes de ejecutar la orden. |
| Enclaves, fronteras feas y dificultad para dibujar una paz | Alta | Editor vectorial táctil, polígonos con ajuste a costa/frontera, validación de continuidad, intercambio territorial y función de limpiar enclaves. |
| Es difícil crear cordones, cercos y guarniciones | Media | Herramienta de línea o polígono; asignación automática de unidades; densidad, prioridad y reglas de enfrentamiento configurables. |
| Falta estrategia histórica y el juego se vuelve repetitivo | Muy alta | Escenarios 1914, 1939, 1962, 1990 y actualidad; misiones diarias offline; biblioteca de eventos; logros y editor completo. |
| El creador de mapas es limitado o incómodo en móvil | Alta | Editor propio dentro del canvas, pinceles táctiles, deshacer/rehacer, capas, simetría, selección por lazo, plantillas transformables, importación, exportación y galería. |
| La IA ataca al jugador con sesgo o sin advertencia | Alta | IA basada en utilidad sin bonificación oculta contra humanos, dificultad configurable y panel que muestra amenazas, reclamaciones, preparación y cuenta atrás diplomática. |
| Países pequeños parecen inviables y los costes cambian sin explicación | Alta | Curvas configurables y tooltips con fórmula, factores y previsión. Modificadores de dificultad visibles; estrategias asimétricas para países pequeños. |
| Combates aparentemente imposibles o poco comprensibles | Alta | Previsión con intervalos, terreno, moral, suministro, doctrina, inteligencia incompleta y registro posterior de bajas y tiradas deterministas. |
| Rebeliones arbitrarias o excesivas | Media | Riesgo calculado con estabilidad, identidad, ocupación, servicios y represión; avisos graduales, controles de dificultad y opciones no militares. |
| Faltan líderes personales, sucesión, elecciones y golpes | Media | Nombre, retrato SVG generado por piezas, edad, rasgos, mandato, legitimidad, sucesión, elecciones, muerte y golpe de Estado. |
| El terreno apenas importa y las islas pequeñas son difíciles de conquistar | Media | Elevación, clima, pasos, costas y estrechos; montañas con coste o bloqueo configurable; puertos y desembarcos seleccionables con tolerancia táctil. |
| Se solicita mayor calidad visual sin perder rendimiento | Media | Tres perfiles gráficos; efectos escalables; geometría y partículas adaptativas; modo ahorro; objetivo visual idéntico en composición con menos efectos en calidad baja. |
| Botones transparentes, pequeños o que activan el país situado debajo | Alta | Captura exclusiva de puntero por la UI, zonas táctiles mínimas de 48 px, fondo legible, bloqueo de eventos al mapa, escalado de texto y modo de alto contraste. |
| Fallos de selección en multijugador personalizado | Media | Autoridad de turno explícita, predicción local solo para cámara, validación de comandos, resincro por hash e indicadores de conexión. |
| Salas solo para amigos | Media | Salas privadas con código, contraseña opcional, lista de jugadores, espectador y reconexión. |
| Contenido inapropiado en chat | Baja, grave | Salas privadas por defecto, chat desactivable, bloqueo, denuncia y filtros; ningún chat público es necesario para jugar. |
| Falta español y otros idiomas | Alta | Español e inglés desde el primer build; cadenas con ICU, plurales, formatos regionales y fuentes preparadas para más alfabetos. |
| Accesibilidad insuficiente | Media | Paletas para daltonismo, contraste, escalado de texto, reducción de movimiento, vibración configurable, controles táctiles editables y navegación por teclado. |
| Tamaño de descarga elevado | Media | Arranque inferior a 5 MB comprimidos; mapas, escenarios y música como paquetes opcionales cacheados; SVG y audio sintetizado. |
| Faltan estadísticas, gráficas y explicaciones históricas | Media | Gráficas en vivo, libro mayor por país, historial de fronteras, repetición, noticias, comparador y exportación de estadísticas. |
| Se pide deshacer la última anexión o edición | Baja | Historial de comandos reversible en editor y botón de deshacer la última anexión cuando las reglas del modo lo permitan. |

## Prioridad de producto

Las mejoras no se dejan para un parche posterior. La arquitectura se diseña desde el inicio alrededor de cuatro compromisos:

1. **Respuesta inmediata:** cámara y UI nunca esperan a la simulación.
2. **Causas visibles:** cualquier coste, guerra, rebelión o decisión de IA puede explicarse desde el juego.
3. **Propiedad del jugador:** partidas, escenarios y repeticiones se exportan en formatos versionados.
4. **Juego completo:** ninguna mecánica depende de anuncios, pagos o conexión permanente.

## Fuentes consultadas

- App Store España: ficha, reseñas e historial de versiones.
- App Store Irlanda: quejas de carga y rendimiento.
- App Store Reino Unido: diplomacia, IA, rendimiento, guardado, vasallaje y paz.
- App Store Estados Unidos y escaparates regionales: marina, terreno, calidad gráfica y editor.
- Guía oficial de Dummynation: controles y descripción pública de sus sistemas.

Este documento resume ideas y problemas expresados públicamente. No reproduce recursos, código ni textos del juego de referencia.

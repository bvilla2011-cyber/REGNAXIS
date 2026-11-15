# Análisis de reseñas · REGNAXIS

Fuentes consultadas: [App Store US](https://apps.apple.com/us/app/dummynation/id6444295551?see-all=reviews), [ficha y notas de versión](https://apps.apple.com/us/app/dummynation/id6444295551) y [guía oficial](https://dummynation.ahfgames.com/guide/). La tienda no expone todas las reseñas históricas mediante la consulta disponible. Frecuencia cualitativa: recurrente, varias, aislada o lista base del encargo; no representa un recuento estadístico.

| Petición o queja | Frecuencia observada | Solución prevista en REGNAXIS |
|---|---|---|
| Carga lenta de partidas y repeticiones | Lista base | Instantáneas cada 30 días, registro de eventos y salto al punto más cercano. |
| Tirones al mover o ampliar el mapa móvil | Lista base | Render PixiJS, worker de simulación, índice espacial y niveles gráficos. |
| Anuncios, compras y seguimiento | Lista base | Juego gratuito sin anuncios, compras ni analítica; PWA sin conexión. |
| Marina y desembarcos | Lista base | Cinco clases de buque, rutas, combate, bloqueo y asaltos anfibios. |
| Pocos tratados y paz rígida | Lista base | Tratados comerciales, no agresión, paso, defensa, protectorados, sanciones y negociación territorial. |
| Líderes y gobiernos con más consecuencias | Varias / lista base | Rasgos, elecciones, sucesión y golpes configurables. |
| Cercos tediosos | Lista base | Líneas y polígonos táctiles, asignación automática de guarniciones. |
| Editor de mapas y escenarios | Lista base | Edición durante partida, importación/exportación y galería local. |
| Salas solo para amigos | Lista base | Código y contraseña con backend configurable, más modo local. |
| Contenido histórico y misiones | Lista base | Escenarios de 1914, 1939, 1962, 1990 y actualidad con datos y fuentes diferenciados. |
| IA opaca y costes de reclutamiento variables | Lista base | Diario de decisiones y desglose exacto de factores de coste. |
| Partidos, facciones y guerras civiles | Aislada en reseñas accesibles | Facciones internas, estabilidad y rebelión con reglas editables. |
| Fortificaciones defensivas | Aislada en reseñas accesibles | Infraestructura defensiva por coordenadas y coste de mantenimiento. |
| Herramientas de epidemias en sandbox | Aislada en reseñas accesibles | Evento opcional de salud pública en el editor de scripts, sin contenido gráfico. |
| ES/EN, accesibilidad y tamaño inicial | Lista base | Catálogo i18n, filtros de color, escala tipográfica y paquete inicial inferior a 5 MB. |

Las notas de versión recientes mencionan gráficas, edición de investigación y scripts; se consideran referencia de cobertura funcional, no fuente de textos ni fórmulas.

## Revisión de noviembre de 2026

Se volvió a consultar la guía oficial y las fichas regionales de App Store. GB y US muestran reseñas y notas; ES muestra comentarios de errores y actualización de armamento; IE devolvió 429. El wiki no permitió acceso automatizado. La tienda expone una selección, no la totalidad histórica de reseñas: no es posible afirmar un recuento exhaustivo.

| Petición o queja | Frecuencia verificable | Cómo se resuelve |
|---|---|---|
| Guerras de IA aparentemente arbitrarias | Usuario actual; categoría recurrente en análisis previo | Umbral de utilidad, relaciones, defensa del objetivo, avisos y razones de decisión. |
| Países aliados y miembros de UE enfrentados sin coste | Usuario actual | Afinidad de bloque, pactos iniciales, condena conjunta y defensa colectiva configurable. |
| Comercio poco visible | Usuario actual | Rutas con origen/destino, ingreso diario, coste de apertura y bloqueo por guerra. |
| Zoom y arrastre atraviesan el límite del mapa | Usuario actual | Zoom acotado y cámara confinada a superficie cartográfica. |
| HUD poco legible | Usuario actual | Jerarquía, saldo, velocidad, fecha y noticias con mayor contraste. |
| Pantalla negra/audio tras cerrar en iPhone | Reseña ES accesible | Reanudación segura del bucle y suspensión de audio con `visibilitychange`. |
| Datos de armamento desactualizados | Reseña ES accesible | Parámetros visibles y editables; no presentar cifras sintéticas como reales. |

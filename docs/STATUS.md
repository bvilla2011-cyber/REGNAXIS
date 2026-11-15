# Estado de REGNAXIS

| Fase | Estado | Evidencia |
|---|---|---|
| 0 · Limpieza | Completada | Commit `chore: wipe repository`; respaldo del commit anterior en la rama remota `backup-before-world-dominion` y etiqueta git local homónima. |
| 1 · Investigación | Completada (alcance accesible) | GDD, análisis de reseñas y atribuciones nuevos; la tienda no permite garantizar lectura de todas las reseñas históricas. |
| 2 · Núcleo | En curso | Simulación original de puntos, anexión, ejército, economía, defensa con desgaste y victoria; mapamundi Natural Earth 1:50m con 240 entidades jugables, fronteras y rutas abstractas para islas. Faltan datos económicos oficiales, ocupación puntual real y ejecución en worker. |
| 3 · Diplomacia e IA | En curso | Relaciones, tratados, guerra, paz, investigación y CPU que recluta/expande con razones; falta estrategia profunda y equilibrio. |
| 4 · Interfaz | En curso | Identidad violeta/cian, apertura UniFormer, menú sobre mapa, tarjetas Casual/Hardcore, selección alfabética, cámara regional, HUD flotante, insignias SVG/canvas originales, frente animado, paneles Militar/Economía/Diplomacia/Investigación/Ranking, ajustes y créditos dentro del Canvas. Faltan accesibilidad y escenas completas. |
| 5 · Modos y editor | Pendiente | Escenarios, scripts, guardados. |
| 6 · Marina | Pendiente | Flotas y mejoras. |
| 7 · Multijugador | Pendiente | Local y salas. |
| 8 · Publicación | Pendiente | Tests, accesibilidad, PWA y Pages. |

La etiqueta aún no está publicada en GitHub porque el conector no expone creación de tags y la CLI no tiene credenciales; la rama de respaldo remota sí conserva el commit exacto. No se marcará una fase completa sin prueba de sus entregables.

## Ampliación solicitada el 15 de noviembre de 2026

Fase 0: auditoría realizada en `docs/AUDIT.md`. Respaldo: etiqueta local y rama remota `backup-before-dummynation-upgrade` en `21c6d201`.
Fase 1: fuentes consultadas de nuevo; acceso parcial a App Store, wiki bloqueado, reglas de equilibrio y peticiones incorporadas al GDD y análisis.
Fase 2: entrenamiento diario, mantenimiento, comercio bilateral y cámara acotada añadidos; mapas de puntos internos y datos macro oficiales continúan pendientes.
Fase 3: bloque UE, reacción defensiva, criterios de guerra de IA y árbol ampliado de investigación con asignación diaria; pruebas de estos comportamientos añadidas.
Fase 4: HUD jerarquizado, fecha, alertas, páginas de unidades/tratados/investigación dentro de Canvas. La accesibilidad y algunas pantallas siguen pendientes.
Fase 6: cinco clases navales, movimiento por rutas costeras, bloqueo de comercio y desembarco basado en anexión; IA naval y estrechos precisos aún pendientes.
Fase 5: editor táctil de puntos y control, escenario JSON validado, scripts de lista blanca y repetición por hitos. Faltan polígonos editables, galería persistente y salto exacto entre instantáneas.
Fase 7: pasar y jugar local y transporte abstracto; salas online con código/contraseña pendientes de backend y configuración. La conexión Appwrite disponible no tiene proyecto REGNAXIS y el conector no crea proyectos nuevos en esta sesión.
Fase 8: PWA y workflow manual de artefactos añadidos, tests de simulación y build local. APK y Electron aún no verificados en Actions. No se marcará la equivalencia completa como terminada.

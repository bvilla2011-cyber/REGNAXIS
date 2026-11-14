# Estado de REGNAXIS

Actualizado: 14 de noviembre de 2026.

## Fases

| Fase | Estado | Entregables |
|---|---|---|
| 0 · Preparación | Completada | Repositorio nuevo, vacío y verificado; no requería limpieza ni respaldo |
| 1 · Investigación y GDD | Completada | Análisis de reseñas, GDD, fuentes y licencias |
| 2 · Núcleo | Completada (base funcional) | Mapa de células y puntos, índice espacial, worker, reloj, simulación determinista, economía, ejércitos, anexión y pruebas |
| 3 · Diplomacia, investigación e IA | Completada (base funcional) | Relaciones, tratados y paz, investigación con proyectos emparejados, planificador determinista con razones |
| 4 · Interfaz completa | En curso | Prototipo Canvas/WebGL: arranque, menú, selección, mapa, HUD, paneles básicos, ajustes, ES/EN y controles táctiles; faltan editor visual, gráficas y paneles profundos |
| 5 · Modos, editor, repeticiones y scripts | Pendiente | Modos, escenarios, editor y guardado por instantáneas |
| 6 · Marina y mejoras de reseñas | Pendiente | Flotas, desembarcos, estrechos y accesibilidad |
| 7 · Multijugador | Pendiente | Pasar y jugar, capa de red y salas privadas |
| 8 · Pulido y publicación | Pendiente | Verificación, PWA, GitHub Pages y documentación final |

## Decisiones cerradas

- Nombre: **REGNAXIS**.
- Motor: **PixiJS 8**.
- Lenguaje: JavaScript con módulos ES.
- Renderizado: Canvas/WebGL/WebGPU mediante PixiJS; ningún menú HTML.
- Simulación: determinista, paso fijo, ejecutada en Web Worker.
- Persistencia: IndexedDB con instantáneas incrementales y registro de eventos.
- Backend previsto: Appwrite Cloud detrás de una interfaz de red intercambiable.
- Monetización: ninguna; cero anuncios, compras y rastreo.

## Próximo punto de control

El prototipo de fase 4 compila con Vite y conecta la simulación en Web Worker con PixiJS. La siguiente acción es completar paneles funcionales, tutorial, gráficas, editor visual y pulido táctil; después se pasa a la fase 5. El mapa global de datos abiertos, gobiernos completos, marina y escenarios históricos siguen pendientes. La base funcional aún usa un mundo de prueba ficticio.

# Estado de REGNAXIS

Actualizado: 14 de noviembre de 2026.

## Fases

| Fase | Estado | Entregables |
|---|---|---|
| 0 · Preparación | Completada | Repositorio nuevo, vacío y verificado; no requería limpieza ni respaldo |
| 1 · Investigación y GDD | Completada | Análisis de reseñas, GDD, fuentes y licencias |
| 2 · Núcleo | Completada (base funcional) | Mapa de células y puntos, índice espacial, worker, reloj, simulación determinista, economía, ejércitos, anexión y pruebas |
| 3 · Diplomacia, investigación e IA | Pendiente | Tratados, árbol tecnológico e IA explicable |
| 4 · Interfaz completa | Pendiente | Escenas Canvas/WebGL, HUD y dirección artística UniFormer |
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

La próxima acción es la fase 3: diplomacia, investigación e IA. El mapa global de datos abiertos y la representación visual siguen pendientes de integración; la fase 2 entrega una base funcional comprobable con un mundo de prueba ficticio.

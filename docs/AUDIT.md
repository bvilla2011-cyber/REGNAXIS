# Auditoría de la base de REGNAXIS

Estado inicial: commit `21c6d201`, respaldado por etiqueta git local `backup-before-dummynation-upgrade` y rama remota con el mismo nombre. Ningún archivo existente se elimina, renombra ni mueve.

| Sistema | Estado previo | Reutilización y brecha |
|---|---|---|
| Canvas y escenas | Menú, selección, partida, ajustes y paneles dibujados en Canvas | Conservar; ampliar HUD y escenas. |
| Mapa | Natural Earth 1:50m, 240 entidades, etiquetas y cámara | Conservar geometría; limitar cámara y añadir selección espacial. |
| Mundo | Una célula y punto sintético por país | Conservar formato; faltan puntos localizados y fronteras de ocupación internas. |
| Ejército | Cinco clases, reclutar, dividir, defender, atacar, anexar y deshacer | Añadir entrenamiento, mantenimiento, suministro, marina y órdenes tácticas. |
| Economía | PIB, población, inflación y presupuesto básico | Añadir comercio, migración, políticas y datos contrastados. |
| Diplomacia | Relaciones genéricas, diez tratados, guerra y paz | Inicializar afinidades regionales, defensa colectiva, caducidad, negociación. |
| Investigación | Cuatro proyectos instantáneos | Añadir árbol, costes y especializaciones configurables. |
| IA | Plan semanal basado en PIB de frontera | Inhibir guerras irracionales, explicar decisiones y respetar pactos/bloques. |
| Persistencia | Un guardado en localStorage | Instantáneas y repeticiones; faltan ranuras y sincronización. |
| Modos/editor/red | Dominación y observador básicos | Editor, escenarios, scripts, local y online no implementados. |
| Publicación | GitHub Pages desde archivos fuente; 9 tests | Conservar Pages; añadir PWA y workflows sin borrar configuración. |

Los archivos revisados incluyen todos los módulos en `src`, tests, scripts, assets, README, GDD, créditos, index y paquete. El objetivo completo requiere iteraciones posteriores: la auditoría no convierte propuestas del GDD en funcionalidades existentes.

# REGNAXIS

Gran estrategia geopolítica original de UniFormer Studio. Estado: prototipo técnico; aún no representa el producto completo descrito en [GDD](docs/GDD.md). Todo el HUD y los menús se dibujan en Canvas. El mapa procede de Natural Earth 1:50m y ofrece 240 países y territorios seleccionables, más la Antártida como referencia visual.

```sh
npm install
npm test
npm run dev
npm run build
npm run build:world # Regenera el atlas local desde world-atlas
```

La pantalla pública prevista es [GitHub Pages](https://bvilla2011-cyber.github.io/REGNAXIS/). Sin anuncios, compras ni seguimiento.

En el menú elige Dominación y la dificultad, luego un país de la lista alfabética o del mapa. En partida, la cámara se centra en tu nación; toca un país para inspeccionarlo y tu insignia para seleccionar un ejército. Arrastra y pellizca el mapa. El HUD abre centros Militar, Economía, Diplomacia, Investigación y Ranking. Las órdenes se ejecutan en días simulados: una invasión muestra un frente que avanza y se desgasta ante defensores. Pausa, guardado y carga funcionan en el dispositivo. El teclado permite escribir las primeras letras del país, usar flechas e Intro en la selección; Espacio pausa, 1–3 cambian velocidad y F centra la cámara.

Los valores de PIB y población son **provisionales y sintéticos**; no representan cifras oficiales del Banco Mundial ni datos de 2026. Las islas sin frontera terrestre tienen rutas marítimas abstractas en este prototipo. Los menús y controles observados en el vídeo aportado solo informan el flujo; la identidad, el diseño y los elementos gráficos son propios.

El motor usa Canvas 2D propio con un mapa precalculado para mantener el renderizado ligero. La arquitectura modular separa la simulación de la presentación.

## Actualización geopolítica de noviembre de 2026

El simulador conserva la arquitectura Canvas existente. Las relaciones de la UE empiezan con afinidad y defensa mutua; una agresión provoca condena y una respuesta de sus socios. La IA exige tensión, fuerza y utilidad antes de abrir un frente. Los tratados comerciales abren rutas bilaterales que aportan ingresos y se suspenden durante guerra, embargo o bloqueo naval.

Los cuatro puntos localizados de cada país transfieren PIB y población durante una ocupación. Hay entrenamiento paralelo por días, desgaste y mantenimiento de unidades, nueve proyectos de investigación por ramas con asignación diaria, ideologías y gobiernos iniciales, estabilidad, rebeliones, sucesiones electorales, ataques nucleares y represalias. La marina dispone de cinco clases y operaciones de navegación, bloqueo y desembarco por rutas abstractas. Las posiciones y datos económicos siguen siendo aproximaciones sintéticas.

**Editor:** desde el menú o pausa; selecciona país y ajusta puntos/ocupación, copia o pega escenarios JSON con los botones. Permite programar un evento sencillo con acciones permitidas. **Repeticiones:** consulta y carga instantáneas cada 30 días de la sesión activa. **Local:** añade otro jugador desde el editor seleccionando su país y usa «Pasar turno local» desde pausa. Las escenas y controles se dibujan en Canvas. Aumentar zoom y arrastrar respeta límites del mapa. Ajustes permite calidad, contraste, tamaño de letra e idioma básico; la traducción al inglés todavía no cubre todos los textos.

La PWA usa `manifest.webmanifest` y `sw.js`; visita una vez con conexión para instalarla. `npm run build` genera el paquete web en `dist/` y una precarga sin conexión. El workflow manual `Package REGNAXIS apps` está preparado para generar artefactos Linux y APK debug en Actions; todavía no se ha ejecutado en GitHub y esos artefactos no se ofrecen como compilaciones verificadas.

El multijugador online requiere un backend con autoridad de sala y validación de comandos. `src/net/local.js` define la interfaz de transporte y `config.example.js` los identificadores públicos previstos. **No copies claves secretas al cliente**. No hay salas online operativas en esta versión; crear `config.js` por sí solo no activa el servidor.

### Verificación y límites

`npm test` cubre economía, anexión, UE, comercio, IA, investigación, entrenamiento, marina, editor, scripts, repeticiones y turnos locales. La cartografía Natural Earth y los indicadores sintéticos se distinguen en pantalla. No se han importado cifras oficiales 2026 ni escenarios históricos con fronteras contrastadas. La ocupación cambia puntos dentro de cada país, pero el contorno visual sigue basado en países; los cercos poligonales, worker de simulación, salas privadas y equivalencia mecánica completa permanecen pendientes.

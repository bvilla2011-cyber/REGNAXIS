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

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

Al iniciar, elige un país de la lista alfabética o tócalo en el mapa; usa los botones para recorrer la lista, la rueda para desplazarte y acercar el mapa, y arrastra o pellizca con los dedos. El teclado permite escribir las primeras letras del país, usar flechas y confirmar con Intro. La partida se inicia con el ejército y la economía del país elegido. Los valores de PIB y población son **provisionales y sintéticos**; no representan cifras oficiales del Banco Mundial ni datos de 2026. Las islas sin frontera terrestre tienen rutas marítimas abstractas en este prototipo.

El motor usa Canvas 2D propio con un mapa precalculado para mantener el renderizado ligero. La arquitectura modular separa la simulación de la presentación.

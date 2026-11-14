# REGNAXIS

Gran estrategia geopolítica original de UniFormer Studio. Estado: prototipo técnico; aún no representa el producto completo descrito en [GDD](docs/GDD.md). Todo el HUD y los menús se dibujan en Canvas. La versión inicial usa dos países ficticios y tres zonas de prueba.

```sh
npm install
npm test
npm run dev
npm run build
```

La pantalla pública prevista es [GitHub Pages](https://bvilla2011-cyber.github.io/REGNAXIS/). Sin anuncios, compras ni seguimiento.

El motor del prototipo es Canvas 2D propio, porque permite comenzar con un paquete muy ligero y conservar el control total de la interfaz. La arquitectura modular separa la simulación de la presentación.

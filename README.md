# REGNAXIS

**REGNAXIS** es un juego de gran estrategia geopolítica en tiempo real de UniFormer Studio. El jugador dirige cualquier país, gestiona su economía, investigación, diplomacia y fuerzas armadas, y compite por controlar la mayor parte del poder económico mundial.

El proyecto se construye desde cero con código, interfaz, iconos y sonido originales. Su referencia de diseño es el género de estrategia geopolítica; no incorpora código, textos, arte, música ni marcas de otros juegos.

## Estado

El proyecto está en preproducción. Consulta [docs/STATUS.md](docs/STATUS.md) para ver el avance por fases y [docs/GDD.md](docs/GDD.md) para la especificación del juego.

## Principios

- Juego JavaScript con toda la interfaz dentro de Canvas/WebGL.
- Diseño móvil primero, orientación horizontal y objetivo de 60 FPS.
- Funciona sin conexión como PWA; sin anuncios, compras ni rastreo.
- Español e inglés desde la primera versión.
- Simulación determinista y configurable, separada del renderizado.
- Datos abiertos con atribuciones en [CREDITS.md](CREDITS.md).

## Tecnología prevista

Se utilizará **PixiJS 8** porque ofrece renderizado WebGL/WebGPU ligero, control total de una interfaz dibujada dentro del juego y menos estructura impuesta que un motor centrado en escenas arcade.

## Licencia

Código y recursos propios: todos los derechos reservados por UniFormer Studio mientras se decide la licencia pública definitiva. Las fuentes de datos mantienen sus licencias originales.

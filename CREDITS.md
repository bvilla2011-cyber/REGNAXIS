# Créditos, datos y licencias

Este archivo se actualizará cada vez que se añada una dependencia o conjunto de datos. Una mención aquí no significa que el recurso ya esté incluido en el build actual.

## Juego

- Nombre: REGNAXIS.
- Diseño, programación, interfaz, iconos, audio y recursos originales: UniFormer Studio.
- El proyecto estudia reglas públicas y opiniones de jugadores del género de gran estrategia, pero no incorpora código, textos, imágenes, audio, logotipos ni otros recursos de juegos existentes.

## Motor y dependencias previstas

| Recurso | Uso | Licencia | Fuente |
|---|---|---|---|
| PixiJS 8 | Renderizado Canvas/WebGL/WebGPU | MIT | https://pixijs.com/ |
| flag-icons | Base opcional de banderas contemporáneas | MIT | https://github.com/lipis/flag-icons |

La lista definitiva se generará desde el archivo de bloqueo de dependencias antes de cada publicación.

## Cartografía

### Natural Earth

- Uso previsto: costas, fronteras iniciales, lagos y elementos físicos.
- Sitio: https://www.naturalearthdata.com/
- Licencia: dominio público conforme a la política de Natural Earth.
- Transformaciones previstas: simplificación por nivel de detalle, reparación topológica, proyección y conversión a malla estratégica propia.

La interfaz y las fronteras dinámicas renderizadas por REGNAXIS son originales; Natural Earth solo proporciona la geometría geográfica de referencia.

## Economía

### World Bank Open Data

- Uso previsto: PIB, PIB per cápita, población y otros indicadores comparables.
- API: https://api.worldbank.org/
- Catálogo: https://data.worldbank.org/
- Licencia general: Creative Commons Attribution 4.0 International, salvo los conjuntos que indiquen una licencia distinta.
- Atribución: “World Bank Open Data”, con indicador, año de observación y fecha de descarga.

Antes de importar un indicador se verificará su campo de licencia. No se redistribuirán conjuntos marcados con restricciones incompatibles.

### Fondo Monetario Internacional · World Economic Outlook

- Uso previsto: estimaciones macroeconómicas para 2026 cuando falten observaciones consolidadas.
- Fuente: https://www.imf.org/en/Publications/WEO/weo-database/
- Condición: los datos solo se integrarán después de revisar los términos de la edición concreta. Cada registro conservará edición, indicador, condición de estimación y fecha de descarga.

Los datos del FMI no se mezclarán de forma que oculte si un valor es una estimación. Si los términos de redistribución no permiten incluirlos en el juego, se usarán únicamente para contraste y se publicará una estimación propia basada en fuentes compatibles.

## Demografía

### Naciones Unidas · World Population Prospects

- Uso previsto: población y proyecciones demográficas por país.
- Fuente: https://population.un.org/wpp/
- Titular: United Nations, Department of Economic and Social Affairs, Population Division.
- Condición: se conservarán la edición, variante y año. Se incluirá la atribución exigida por los términos de la edición descargada.

### United Nations Data

- Fuente general: https://data.un.org/
- Uso condicionado a la licencia y atribución publicada por cada base enlazada.

## Banderas y símbolos

Se preferirán banderas gubernamentales o de dominio público. Cuando se utilice `flag-icons`, se conservará su aviso MIT. Los emblemas ficticios, ideologías, recursos, tratados, unidades y retratos serán SVG originales de UniFormer Studio.

## Audio

Los sonidos de interfaz y efectos abstractos se sintetizarán durante la ejecución con WebAudio a partir de parámetros propios. No se usarán grabaciones, música ni efectos procedentes de otros juegos.

## Datos históricos

Los escenarios de 1914, 1939, 1962 y 1990 combinarán fuentes históricas abiertas. Cada paquete tendrá un archivo `sources.json` con:

- título y autor de la fuente;
- URL y fecha de consulta;
- licencia o estado de dominio público;
- campos derivados;
- transformaciones y supuestos;
- nivel de confianza.

Una cifra reconstruida se marcará como estimación y no se atribuirá falsamente a una fuente.

## Marcas

REGNAXIS y UniFormer Studio son nombres del proyecto. Los nombres de terceros se mencionan únicamente para atribución. Steam, App Store, Google Play, Natural Earth, World Bank, IMF, United Nations, PixiJS y Appwrite pertenecen a sus respectivos titulares.

# REGNAXIS · documento de diseño 1.0

## Alcance y principios

Gran estrategia geopolítica en tiempo real con simulación determinista. Código, interfaz y audio originales. Las descripciones de la guía de referencia informan categorías de mecánicas, pero todas las fórmulas siguientes son propuestas propias y configurables. El juego usa días discretos de 24 pasos, semilla guardada y órdenes serializables; la presentación interpola a 60 FPS.

## Datos y mundo

Estado implementado en el prototipo: geometrías Admin 0 de Natural Earth 1:50m mediante `world-atlas` 2.0.2, 240 países y territorios jugables y Antártida no jugable; selección alfabética por nombres españoles. Cada país es todavía una célula de simulación y recibe un punto sintético. El PIB y la población se derivan provisionalmente del área cartográfica y una semilla por identificador; no son datos reales. Las islas sin vecinos terrestres reciben dos enlaces por proximidad como rutas marítimas abstractas. La siguiente iteración debe reemplazar estos valores por indicadores por año y descomponer cada país en puntos espaciales sin convertir la cartografía en provincias.

Geometría Natural Earth simplificada en polígonos, índice R-tree/quad-tree, puntos de recursos y población con coordenadas geográficas. Un punto pertenece al controlador de la superficie que contiene su posición. `PIB país = Σ(PIB punto × productividad × control)`; `población país = Σ población punto`. Conquista progresiva: cada célula espacial de ocupación acumula `progreso += tasaBase × poderAtacante / max(1,poderDefensor) × suministro × moral / (1+resistencia)`. Al completar 1, transfiere sus puntos, registra la acción reversible y genera resistencia. Milicia diaria `p = base × resistencia × poblaciónLocal / escala`, con semilla determinista.

## Victoria y modos

Casual: gana el primer país con participación estrictamente mayor que 50 % del PIB mundial durante `holdDays` configurables. Hardcore: `score = 0.5×PIB + 0.2×población + 0.2×poder militar + 0.1×territorio`; umbral y duración configurables, IA reacciona al líder. Clasificación muestra cada término y distancia al umbral. Dominación, Personalizado, Dios, Blitz sin alianzas y con reloj, Battle Royale, Guerra Mundial por coaliciones y escenarios históricos son reglas de modo separadas; no se alteran datos para simular una fecha histórica sin fuentes.

## Ejércitos y marina

Infantería, motorizada, mecanizada, blindados, artillería, antiaérea, especiales, logística, reservistas y paramilitares; los dos últimos solo defienden. Cotización `coste = base × clamp(√(rentaPerCápita/medianaMundial),0.6,1.8) × clamp(1+inflación,0.5,3)`. Mantenimiento por unidad y día; equipo `E' = clamp(E − desgasteAnual/365 − déficitMantenimiento×penalización,0,1)`; financiación militar lo frena. Entrenamiento paralelo `capacidad = base + floor(población / escalón) + bonificación paramilitar`. Moral sube en captura y baja en pérdida o ataque nuclear. Órdenes: mover, atacar, defender, automático, dividir, mantener y deshacer última anexión. Herramientas de línea/polígono asignan guarniciones por distancia y suministro.

Destructores, cruceros, acorazados, portaaviones y submarinos tienen coste, mantenimiento, alcance y potencia. Combate naval simultáneo: `daño = potencia × preparación × moral × ventajaClase × factorEstrecho`; desembarco exige costa adyacente y capacidad de transporte. Bloqueo de estrecho reduce suministro y comercio en rutas que lo atraviesan; se recalcula al perder control marítimo.

## Economía

Paso diario: `crecimiento = base + política + investigación − inflación×drag − gastoExcesivo×drag − dañoGuerra`; `PIB' = max(0,PIB×(1+crecimiento/365))`. Ingreso `PIB×tasaFiscal/365`; egresos investigación, ejército, social y deuda. Inflación `I' = clamp(I + déficit/PIB×sensibilidad − ajustePolítica,−0.05,1)`. Migración `ΔP = P×(crecimientoNatural + factorSocial×(social−promedioVecinos) − riesgoGuerra)/365`. Déficit persistente reduce productividad puntual; interfaz desglosa causas antes de cada cambio.

## Investigación

RP diario `= financiación × √población × √(PIB/población) × multiplicadorIdeología / escala`. Árbol con columnas emparejadas y exclusión en el nivel indicado; requisitos mínimos verificables. Tipos: desbloqueo de pago único, asignación continua por día, efecto de área `área = base×√(RP asignados)`, lote final y prestigio repetible. Toda rama, coste, requisito y exclusión está en datos editables.

## Diplomacia, política y eventos

Relación simétrica de 0 a 100 y confianza independiente; alianza posible al superar 75, salvo acuerdos negociados del editor. Coste diplomático `base×(1+(100−posiciónInternacional)/100)`. Acciones: alianza, tregua, no agresión, comercio, paso militar, defensa, vasallaje, protectorado, embargo, sanción y paz con reparaciones/territorios. Incumplimientos, guerra y ataque nuclear reducen posición. Gobierno, ideología, rasgos del líder y facciones modifican parámetros explícitos; sucesión por calendario, elecciones y golpes por estabilidad. Rebeliones se muestrean diariamente con semilla; eventos geográficos tienen región, duración, intensidad y mitigación. Ataque nuclear causa coste, destrucción puntual, moral negativa y respuesta diplomática/represalia de IA.

## IA

Cada país evalúa expansion, defensa, alianzas, treguas y reconstrucción. `utilidad = beneficioPIB + amenazaEvitada + afinidad − bajasEsperadas − costeDiplomático − déficit`; incertidumbre y agresividad son configurables. El diario explica las tres contribuciones principales y avisa antes de una guerra salvo ataques sorpresa permitidos por modo. Coaliciones comparten amenazas y ayuda militar.

## Editor, scripts, red y persistencia

Editor táctil de polígonos, países, banderas, recursos, tropas, gobiernos y reglas; valida fronteras y referencias antes de aplicar. Exporta JSON versionado sin código ejecutable. Scripts son datos con disparadores, condiciones y acciones de lista blanca; límite de operaciones por día para evitar bucles. Instantáneas cada 30 días y al evento clave, eventos posteriores reaplicables; salto usa la instantánea anterior, nunca reconstruye desde día cero. IndexedDB guarda partidas y galería local. Multijugador local por turnos y contra IA; online con servidor de salas privadas y contraseña, validación de comandos y autoridad del estado en backend, sin secretos en cliente.

## Interfaz y entrega

Canvas 2D propio se usa en el prototipo por el control directo de escenas y un atlas precalculado de bajo peso. Boot, Menú, Selección, Partida, Editor, Repeticiones y Ajustes; paneles biselados, rejilla, neón, iconos SVG originales y audio sintetizado WebAudio. ES/EN, escala tipográfica, paletas accesibles y controles táctiles. Calidad alta/media/baja. PWA sin anuncios ni seguimiento. Presupuesto inicial de transferencia menor que 5 MB. Tests de reglas y pruebas de carga verifican cada hito. Variables CSS definen paleta; `assets/uniformer-logo.png` es el logo proporcionado.

## Parámetros iniciales

| Parámetro | Valor | Unidad |
|---|---:|---|
| `victoryShare` | 0.5 | fracción, comparación estricta |
| `victoryHoldDays` | 7 | días |
| `hardcoreHoldDays` | 14 | días |
| `annexBase` | 0.22 | progreso/día |
| `militiaThreshold` | 0.6 | resistencia |
| `growthBase` | 0.024 | anual |
| `annualEquipmentDecay` | 0.04 | anual |
| `snapshotInterval` | 30 | días |

Las cifras son valores originales de equilibrio, no equivalencias verificadas del juego de referencia; se ajustarán con partidas y tests.

## Revisión de equilibrio 2026-11-15

La IA solo considera guerra si `relación < 42`, no existe tregua/no agresión/alianza/defensa/comercio, la utilidad territorial supera el umbral y su fuerza prevista es superior al riesgo. `utilidad = 0.035 × PIB objetivo + 0.12 × fuerza propia − 0.17 × defensa − 0.9 × relación − penalización bloque − riesgo tesoro`; una guerra no puede empezar sin orden explícita y se avisa al jugador en el diario. Todos los coeficientes son reglas originales configurables.

Bloque UE: los miembros de la lista editable empiezan con relación 84 y pacto defensivo. Agredir a un miembro reduce la relación entre el agresor y cada otro miembro en 35 y eleva su hostilidad; los miembros que aceptan defensa se incorporan a la guerra. La defensa colectiva se desactiva en escenarios personalizados y no modifica parejas ajenas al bloque. Los acuerdos de comercio no se activan durante guerra y un embargo los suspende.

Ruta comercial bilateral `ingreso diario = min(PIB_A, PIB_B) × tasaComercial / 365 × factorRelación × factorAcceso`; cada socio cobra una fracción y la ruta registra volumen, estado y motivo de suspensión. Apertura exige relación ≥ 45 y gasto del tesoro. Mantenimiento del ejército se paga por día: la falta de pago reduce equipo, moral y productividad; financiación militar reduce desgaste. Las colas de entrenamiento avanzan diariamente en paralelo hasta capacidad configurada. Hora simulada mostrada como fecha desde 2026-01-01, un día por paso; la velocidad del juego solo altera cuántos pasos se procesan por segundo, no las fórmulas.

La cámara está limitada en zoom y traslación para preservar cobertura del mapamundi sin dejar océano vacío ocupando la pantalla. En cada modo de calidad se evita repintar geometría fuera del área visible. El HUD usa un tiempo de simulación explícito y desglosa saldo y progreso. Las cifras sintéticas permanecen etiquetadas como tales hasta importación verificada de indicadores oficiales.

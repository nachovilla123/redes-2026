# Capítulo 17 — Fragmentación IPv4: cuando el paquete es demasiado grande

> **Pregunta clave:** ¿Qué pasa cuando un paquete IP es más grande que lo que puede transportar la red por la que tiene que pasar?

---

## El MTU: el límite de carga de cada tramo

Cada tecnología de red tiene un límite máximo de cuántos bytes puede transportar en una sola trama. Este límite se llama **MTU (Maximum Transmission Unit)**.

| Tecnología | MTU típico |
|---|---|
| Ethernet | 1500 bytes |
| WiFi (802.11) | 2304 bytes |
| PPP (WAN) | 576 - 1500 bytes |

**Analogía:** Imaginá que tenés que enviar un mueble de mudanza. Algunas rutas tienen túneles más angostos que otros. Si el mueble no entra en el túnel, tenés dos opciones: no mandarlo (drop) o desarmarlo en partes que sí entren.

IPv4 elige la segunda opción: **fragmentar**.

---

## ¿Cuándo se fragmenta?

Un router fragmenta un paquete IP cuando:
- El paquete es **más grande que el MTU del siguiente enlace**, Y
- El bit **DF (Don't Fragment) no está activado**

Si DF está activado y el paquete es muy grande → el router **descarta el paquete** y manda un mensaje ICMP de error al origen ("necesito fragmentar pero no puedo").

---

## Los campos clave del header IPv4

Para manejar la fragmentación, el header IPv4 tiene tres campos específicos:

### Identification (ID) — 16 bits
Un número que identifica a qué datagrama original pertenece este fragmento. Todos los fragmentos del mismo datagrama tienen el **mismo ID**.

### Flags — 3 bits
Solo 2 de los 3 bits se usan:
- **Bit 1 — DF (Don't Fragment):** `1` = no fragmentar, `0` = se puede fragmentar
- **Bit 2 — MF (More Fragments):** `1` = hay más fragmentos después de este, `0` = este es el último fragmento

### Fragment Offset — 13 bits
Indica la posición de este fragmento dentro del datagrama original, **en unidades de 8 bytes**.

Ejemplo: offset = 185 → este fragmento empieza en el byte 185 × 8 = 1480 del datagrama original.

---

## Cómo calcular la fragmentación — paso a paso

### Ejemplo del final de Cicerchia

**Escenario:**
- PC1 → R1: MTU = 1500 bytes
- R1 → R2: MTU = 620 bytes
- El datagrama tiene: 20 bytes IP + 8 bytes UDP + 1472 bytes de datos = **1500 bytes totales**

---

### Paso 1: ¿Se fragmenta en el enlace PC1→R1?

El datagrama tiene 1500 bytes. El MTU es 1500 bytes. **1500 ≤ 1500 → NO se fragmenta.**

El datagrama llega entero a R1.

---

### Paso 2: ¿Se fragmenta en el enlace R1→R2?

MTU del siguiente enlace: 620 bytes. El datagrama tiene 1500 bytes. **1500 > 620 → SÍ se fragmenta.**

**Cuántos datos caben por fragmento:**
- El header IP ocupa siempre 20 bytes
- Datos disponibles por fragmento: 620 − 20 = **600 bytes**
- Pero el offset se mide en unidades de 8 bytes → los datos deben ser múltiplo de 8
- 600 bytes ÷ 8 = 75 → 75 × 8 = **600 bytes** ✓ (ya es múltiplo de 8)

**Los datos a fragmentar:** 8 bytes UDP + 1472 bytes de datos = **1480 bytes**
(el header IP de 20 bytes no se fragmenta, va en cada fragmento)

**Fragmento 1:**
- Datos: bytes 0 a 599 → 600 bytes de payload
- Header IP: 20 bytes
- Total: 620 bytes ✓
- MF = 1 (hay más)
- Offset = 0 / 8 = **0**

**Fragmento 2:**
- Datos: bytes 600 a 1199 → 600 bytes de payload
- Header IP: 20 bytes
- Total: 620 bytes ✓
- MF = 1 (hay más)
- Offset = 600 / 8 = **75**

**Fragmento 3:**
- Datos: bytes 1200 a 1479 → 280 bytes de payload
- Header IP: 20 bytes
- Total: 300 bytes ✓
- MF = **0** (último fragmento)
- Offset = 1200 / 8 = **150**

---

### Tabla resumen del ejemplo

| Fragmento | Tamaño total | Payload | MF | Offset |
|---|---|---|---|---|
| 1 | 620 bytes | 600 bytes | 1 | 0 |
| 2 | 620 bytes | 600 bytes | 1 | 75 |
| 3 | 300 bytes | 280 bytes | 0 | 150 |

---

## ¿Quién reensambla?

**Solo el destino final** reensambla los fragmentos — no los routers intermedios.

Por eso si un fragmento se pierde en el camino, **todo el datagrama se descarta** y hay que reenviar desde el origen (lo maneja TCP o la aplicación).

---

## ¿Qué protocolo fragmenta sin garantizar entrega?

El final de Cicerchia pregunta esto: **IP (capa de red)** fragmenta sin garantizar entrega. La confiabilidad la agrega **TCP (capa de transporte)** con sus ACKs, retransmisiones y control de flujo.

**UDP** también usa IP sin fragmentación garantizada y directamente no garantiza nada — es la aplicación la que debe manejarlo si le importa.

---

## Resumen para el parcial

- **MTU**: máximo de bytes que puede transportar un enlace (Ethernet = 1500 bytes)
- **Fragmentación**: ocurre cuando el paquete > MTU del siguiente enlace y DF = 0
- **Campos clave**: ID (identifica el datagrama), MF (hay más fragmentos), Fragment Offset (posición en unidades de 8 bytes)
- **Cálculo**: payload por fragmento = MTU − 20, redondeado hacia abajo al múltiplo de 8
- **Solo el destino final** reensambla
- **IP fragmenta sin garantizar entrega** → la confiabilidad la da TCP encima

---

*Capítulo anterior → [16 - Routing](16-routing-encaminamiento.md)*
*Siguiente capítulo → [18 - VLSM: ejercicios resueltos](18-vlsm-ejercicios.md)*

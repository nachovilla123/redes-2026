# Capítulo 14 — WiFi: cómo se habla sin cables (IEEE 802.11)

> **Pregunta clave:** ¿Por qué WiFi no puede usar el mismo mecanismo que Ethernet para evitar colisiones? ¿Cómo lo resuelve?

---

## El problema de fondo: no podés escuchar mientras hablás

En Ethernet con cable (CSMA/CD), si dos dispositivos mandan al mismo tiempo, **detectan la colisión** mientras ocurre. Es como dos personas en una habitación: si hablan al mismo tiempo, se escuchan mutuamente y paran.

En WiFi esto **no funciona**. Un dispositivo que está transmitiendo no puede escuchar al mismo tiempo porque su propia señal ahoga cualquier señal entrante. Es como intentar escuchar un susurro mientras vos estás gritando.

Por eso WiFi no usa **detección** de colisiones (CD) sino **evitación** de colisiones (CA).

**CSMA/CD** → Carrier Sense Multiple Access / **Collision Detection** → Ethernet  
**CSMA/CA** → Carrier Sense Multiple Access / **Collision Avoidance** → WiFi

---

## CSMA/CA: el protocolo de WiFi

### La analogía: una reunión con moderador invisible

En una reunión presencial (Ethernet con cable), todos se escuchan y si dos hablan juntos, se dan cuenta y paran. En una videollamada con mala conexión (WiFi), no sabés si alguien más está hablando hasta que ya es tarde. Por eso la gente aprende a **esperar antes de hablar**.

CSMA/CA funciona así:

1. **Escuchá el canal** (Carrier Sense): ¿hay alguien transmitiendo?
2. Si está **ocupado** → esperá a que se libere + un tiempo aleatorio extra
3. Si está **libre** → esperá un intervalo de tiempo fijo (DIFS) + tiempo aleatorio (backoff)
4. Recién entonces **transmitís**
5. El receptor manda un **ACK** confirmando que recibió bien
6. Si no llega el ACK → asumir colisión → esperar más tiempo aleatorio → reintentar

El tiempo de espera aleatorio (backoff) es la clave: si todos esperan distintos tiempos, es muy difícil que dos choquen exactamente igual.

---

## El Problema del Nodo Oculto

### La analogía: dos personas que no se ven pero hablan con el mismo receptor

Imaginá tres personas: Ana, Bob y el recepcionista Carlos. Ana y Bob están en salas distintas y **no se escuchan entre sí**, pero ambos pueden hablar con Carlos.

Ana escucha el canal → está libre → empieza a hablar con Carlos.  
Bob también escucha → también está libre (no escucha a Ana) → empieza a hablar con Carlos.

Carlos recibe dos voces al mismo tiempo → colisión. Ni Ana ni Bob lo sabían.

En WiFi pasa exactamente esto: dos dispositivos que no se "ven" entre sí, pero ambos alcanzan al mismo Access Point. Como no se detectan mutuamente, no saben que están colisionando.

**Este es el Problema del Nodo Oculto.**

### La solución: RTS/CTS

**RTS** = Request To Send (petición para enviar)  
**CTS** = Clear To Send (permiso para enviar)

El protocolo funciona así:

1. Ana quiere mandar datos → envía un **RTS** al Access Point: "quiero transmitir X bytes"
2. El Access Point responde con un **CTS** que **todos en el área escuchan**: "Ana tiene el canal por X tiempo"
3. Bob escucha el CTS → sabe que el canal está ocupado → espera
4. Ana transmite sin interferencia
5. El Access Point manda un ACK final

Con RTS/CTS, la "reserva" del canal la anuncia el Access Point (que sí llega a todos), no el cliente que nadie más escucha.

**Costo de RTS/CTS:** agrega overhead (tramas extra). Para tramas pequeñas no vale la pena. Por eso tiene un **umbral**: solo se usa RTS/CTS para tramas más grandes que cierto tamaño.

---

## ¿WiFi garantiza la entrega?

**No.** IEEE 802.11 opera en la capa 2 (enlace de datos). Usa ACK a nivel de capa 2 para confirmar cada trama, pero esto no garantiza entrega extremo a extremo. Si la trama llega al Access Point pero se pierde después, la capa 2 no lo sabe.

La entrega confiable extremo a extremo la garantiza **TCP** en la capa de transporte.

| | Ethernet (802.3) | WiFi (802.11) |
|---|---|---|
| Medio | Cable (guiado) | Aire (no guiado) |
| Detección de colisiones | Sí (CSMA/CD) | No |
| Evitación de colisiones | No | Sí (CSMA/CA) |
| ACK de capa 2 | No | Sí |
| Nodo oculto | No aplica | Problema real → RTS/CTS |
| Entrega garantizada | No (capa 2) | No (capa 2) |

---

## Resumen para el parcial

- WiFi usa **CSMA/CA** (no CSMA/CD) porque no puede detectar colisiones mientras transmite
- El **problema del nodo oculto** ocurre cuando dos nodos no se ven entre sí pero compiten por el mismo AP
- **RTS/CTS** resuelve el nodo oculto: el AP anuncia quién tiene el canal para que todos lo sepan
- WiFi **NO garantiza entrega confiable** — eso lo hace TCP en capas superiores

---

*Capítulo anterior → [13 - ACL](13-acl.md)*
*Siguiente capítulo → [15 - ARQ y Ventanas Deslizantes](15-arq-ventanas-deslizantes.md)*

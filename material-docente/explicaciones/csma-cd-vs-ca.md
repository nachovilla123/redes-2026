# CSMA/CD vs CSMA/CA

**CSMA** significa lo mismo en los dos: *Carrier Sense Multiple Access* — antes de transmitir, escuchás si el canal está libre.

La diferencia está en la segunda parte.

---

## CD — Collision Detection (Ethernet, cableado)

Podés transmitir y escuchar al mismo tiempo porque el cable es físico. Si dos nodos transmiten a la vez, las señales eléctricas se superponen y ambos lo detectan mientras están transmitiendo.

**Flujo:**
1. Escuchás el cable — ¿libre? Transmitís
2. Mientras transmitís, seguís escuchando
3. Si detectás colisión → parás, mandás señal de jam, esperás tiempo aleatorio (backoff exponencial) y reintentás

---

## CA — Collision Avoidance (WiFi 802.11)

En WiFi **no podés** transmitir y recibir al mismo tiempo con la misma antena. Si colisionás, no te enterás. Por eso no podés detectar — tenés que **evitar antes de que pase**.

**Flujo:**
1. Escuchás el canal — ¿libre? Esperás un tiempo fijo (DIFS) más un backoff aleatorio
2. Si sigue libre después de ese tiempo → transmitís
3. El receptor manda un **ACK** para confirmar
4. Si no llega ACK → asumís colisión y reintentás

El backoff aleatorio hace que dos nodos que quieran transmitir al mismo tiempo probablemente elijan tiempos distintos, evitando la colisión.

---

## La diferencia en una línea

> **CD** detecta la colisión mientras pasa. **CA** trata de que no pase.

---

## Por qué WiFi no puede usar CD

Una antena WiFi no puede transmitir y recibir simultáneamente en la misma frecuencia. Es una limitación física del hardware de radio. En Ethernet el cable conduce electricidad en ambas direcciones al mismo tiempo, por eso sí funciona CD.

---

## RTS/CTS — la extensión de CSMA/CA para el nodo oculto

Ver: `csma-rts-cts.md`

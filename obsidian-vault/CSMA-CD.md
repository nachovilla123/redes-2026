---
tags: [capa-2, ethernet, colision]
---

# CSMA/CD — Carrier Sense Multiple Access / Collision Detection

Mecanismo de acceso al medio que usa [[Ethernet]] en redes con medio compartido (hubs). Hoy prácticamente no se usa porque los [[Switch|switches]] eliminaron las colisiones dándole a cada dispositivo su propio canal.

## Cómo funciona

1. **Carrier Sense**: escuchás el cable antes de transmitir
2. Si está libre → transmitís
3. Mientras transmitís, seguís escuchando (**Collision Detection**)
4. Si detectás una [[Colisión]] → parás, enviás señal de **jam** (para que todos se enteren)
5. Esperás un tiempo aleatorio (**backoff exponencial**) y reintentás

## Por qué funciona en Ethernet y no en WiFi

En cable podés transmitir y escuchar al mismo tiempo (son señales eléctricas en el mismo conductor). En [[WiFi 802.11]] una antena no puede hacer las dos cosas simultáneamente → usa [[CSMA-CA]] en su lugar.

## Longitud mínima de trama Ethernet

La trama mínima es 64 bytes. Razón: la trama debe durar en el medio al menos el tiempo de propagación de ida y vuelta (round-trip), para que el emisor la esté enviando todavía cuando detecte la colisión.

## Relacionado
- [[CSMA-CA]] — versión para WiFi que evita en lugar de detectar
- [[Colisión]] — qué es y por qué ocurre
- [[Ethernet]] — protocolo que usa CSMA/CD
- [[Switch]] — dispositivo que eliminó la necesidad de CSMA/CD
- [[Hub]] — dispositivo donde CSMA/CD sí era necesario
- [[Half-Duplex vs Full-Duplex]]

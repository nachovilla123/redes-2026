---
tags: [capa-2, wifi, colision]
---

# CSMA/CA — Carrier Sense Multiple Access / Collision Avoidance

Mecanismo de acceso al medio que usa [[WiFi 802.11]]. A diferencia de [[CSMA-CD]], no detecta colisiones — las evita antes de que ocurran, porque una antena no puede transmitir y recibir al mismo tiempo.

## Cómo funciona

1. **Carrier Sense**: escuchás el canal antes de transmitir
2. Si está libre → esperás un tiempo fijo (**DIFS**) más un **backoff aleatorio**
3. Si sigue libre → transmitís
4. El receptor manda un **ACK** para confirmar recepción
5. Si no llega ACK → asumís colisión, aumentás el backoff y reintentás

## Por qué backoff aleatorio

Si dos nodos quieren transmitir al mismo tiempo, el aleatorio hace que probablemente elijan tiempos de espera distintos → uno transmite, el otro espera → no colisionan.

## Limitación: el nodo oculto

CSMA/CA no resuelve el caso donde dos nodos no se ven entre sí pero ambos comunican con el mismo [[Access Point]]. Para eso existe [[RTS-CTS]].

## CD vs CA en una línea

> **CD** detecta la colisión mientras pasa. **CA** trata de que no pase.

## Relacionado
- [[CSMA-CD]] — versión para Ethernet que detecta en lugar de evitar
- [[WiFi 802.11]] — protocolo que usa CSMA/CA
- [[Colisión]] — qué es y por qué ocurre
- [[RTS-CTS]] — extensión para el problema del nodo oculto
- [[NAV]] — temporizador virtual usado en CSMA/CA
- [[Nodo Oculto]] — limitación que CSMA/CA no resuelve sola
- [[Half-Duplex vs Full-Duplex]] — por qué WiFi es half-duplex

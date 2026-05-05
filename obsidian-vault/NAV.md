---
tags: [wifi, csma-ca]
---

# NAV — Network Allocation Vector

Temporizador virtual que mantiene cada nodo en una red [[WiFi 802.11]]. Permite reservar el canal sin escuchar físicamente.

## Cómo funciona

Cuando un nodo recibe una trama con un campo **Duración**, actualiza su NAV:

> "El canal estará ocupado X microsegundos. No transmito hasta que expire."

Así C puede saber que el canal está ocupado aunque no oiga la transmisión de A directamente.

## Quién actualiza el NAV

- Al recibir un **RTS**: el nodo anota la duración total del intercambio
- Al recibir un **CTS**: todos los nodos en rango del [[Access Point]] actualizan su NAV

## Para qué sirve

Es el mecanismo que hace que [[RTS-CTS]] funcione para resolver el [[Nodo Oculto]]. Sin NAV, C no sabría que no puede transmitir.

## Relacionado
- [[RTS-CTS]] — el mecanismo que dispara la actualización del NAV
- [[CSMA-CA]] — contexto donde vive el NAV
- [[Nodo Oculto]] — el problema que el NAV ayuda a resolver

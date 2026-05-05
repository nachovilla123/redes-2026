---
tags: [capa-2, wifi, colision]
---

# RTS/CTS — Request To Send / Clear To Send

Extensión de [[CSMA-CA]] que resuelve el [[Nodo Oculto|problema del nodo oculto]] en [[WiFi 802.11]]. En lugar de transmitir directamente, el nodo primero pide permiso al [[Access Point]].

## Flujo

```
A                    AP                    C
|── RTS ────────────>|                     |
|   "quiero transmitir X µs"               |
|                    |── CTS ─────────────>|
|                    |   "canal libre"      |
|                    |   (lo oye TODOS)     |
|                    |                     |
|                    |          C actualiza [[NAV]]
|                    |          C no transmite
|── datos ──────────>|                     |
|<── ACK ────────────|                     |
```

## Por qué resuelve el nodo oculto

El CTS lo emite el AP en broadcast. Lo reciben **todos** los nodos en rango del AP, incluyendo C que no ve a A. C actualiza su [[NAV]] y no transmite durante ese tiempo.

## [[NAV]] — Network Allocation Vector

Cada nodo mantiene un temporizador virtual. El campo **duración** en el RTS y el CTS le dice a todos cuánto tiempo estará ocupado el canal. El nodo no transmite durante ese tiempo aunque no escuche tráfico físico.

## Relacionado
- [[CSMA-CA]] — mecanismo base sobre el que opera RTS/CTS
- [[Nodo Oculto]] — el problema que RTS/CTS resuelve
- [[NAV]] — temporizador que hace funcionar la reserva virtual
- [[Access Point]] — intermediario que emite el CTS
- [[WiFi 802.11]] — estándar que define RTS/CTS

# RTS/CTS — Solución al problema del nodo oculto

## El problema del nodo oculto

CSMA/CA funciona bien si todos los nodos se escuchan entre sí. Pero en WiFi el rango de radio es limitado:

```
    A ----ve----> AP <----ve---- C
    A  no ve  C
```

A escucha el canal, lo nota libre (no oye a C) y empieza a transmitir.
C hace lo mismo al mismo tiempo.
El AP recibe las dos señales superpuestas → colisión.
Ni A ni C se enteran.

---

## La solución: pedir permiso antes de transmitir

```
1. A  →  RTS (Request To Send)  →  AP
         "quiero transmitir, voy a necesitar X microsegundos"

2. AP →  CTS (Clear To Send)    →  BROADCAST
         "canal libre, A puede transmitir"
         (lo escuchan TODOS, incluyendo C)

3. C recibe el CTS → anota en su NAV: "canal ocupado X microsegundos, no transmito"

4. A  →  datos                  →  AP   (sin colisión)

5. AP →  ACK                    →  A
```

## NAV — Network Allocation Vector

Temporizador virtual que cada nodo mantiene. Cuando recibe un RTS o CTS con un campo de duración, anota "el canal está ocupado hasta T" y no transmite aunque no oiga tráfico físicamente. Es una reserva virtual del canal.

---

## En una línea

> RTS/CTS hace que el AP avise a *todos* los vecinos que el canal está reservado, resolviendo el problema de los nodos que no se ven entre sí.

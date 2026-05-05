---
tags: [wifi, problema]
---

# Nodo Oculto

Problema en redes [[WiFi 802.11]] donde dos nodos no se ven entre sí pero ambos se comunican con el mismo [[Access Point]]. [[CSMA-CA]] no lo resuelve porque cada nodo cree que el canal está libre.

## El problema

```
A ──ve──> AP <──ve── C
A  NO ve  C
```

1. A escucha el canal → libre → transmite
2. C escucha el canal → libre (no oye a A) → transmite
3. Las señales llegan juntas al AP → [[Colisión]]
4. Ni A ni C se enteran

## Solución

[[RTS-CTS]]: el AP emite un CTS en broadcast que todos escuchan, incluyendo C.

## Relacionado
- [[RTS-CTS]] — la solución
- [[CSMA-CA]] — por qué no alcanza sola
- [[NAV]] — cómo C sabe que no puede transmitir
- [[Nodo Expuesto]] — el problema opuesto
- [[Access Point]] — el intermediario en el centro
- [[Colisión]] — lo que produce el nodo oculto

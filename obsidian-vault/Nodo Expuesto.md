---
tags: [wifi, problema]
---

# Nodo Expuesto

Problema opuesto al [[Nodo Oculto]]. Un nodo escucha una transmisión y se queda callado innecesariamente, aunque podría transmitir a otro destino sin interferir.

## El problema

```
A <── B ──────> AP1       AP2 <── C
```

B transmite a AP1. C escucha a B (están en rango) y cree que el canal está ocupado. Pero C podría transmitir a AP2 sin interferir con la comunicación B→AP1 porque AP2 está fuera de rango de B.

Resultado: C espera innecesariamente → subutilización del canal.

## Diferencia con el nodo oculto

| | [[Nodo Oculto]] | Nodo Expuesto |
|---|---|---|
| Problema | Colisión por transmitir cuando no debería | Silencio innecesario cuando sí podría transmitir |
| Resultado | Colisión en el AP | Subutilización del canal |
| Solución | [[RTS-CTS]] | No hay solución estándar simple |

## Relacionado
- [[Nodo Oculto]] — el problema opuesto
- [[CSMA-CA]] — mecanismo que produce el nodo expuesto
- [[WiFi 802.11]] — contexto donde ocurre

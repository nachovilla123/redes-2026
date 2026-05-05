---
tags: [capa-4, transporte]
---

# UDP — User Datagram Protocol

Protocolo de transporte **sin conexión** y **sin garantías**. Más rápido que [[TCP]] porque no tiene overhead de confirmaciones.

## Características

- Sin conexión (no hay [[Three-Way Handshake]])
- No confiable: no hay ACK, no hay retransmisión
- No garantiza orden de llegada
- Checksum opcional en IPv4, obligatorio en IPv6
- Soporta unicast, multicast y broadcast (TCP solo unicast)

## Cabecera UDP (8 bytes fijos)

```
[ Source Port | Destination Port ]
[ Length      | Checksum         ]
```

Mucho más chica que la de [[TCP]] (20 bytes mínimo).

## Checksum con pseudo-header

Para calcular el checksum, UDP arma un pseudo-header con:
- IP origen, IP destino, protocolo (17), longitud UDP

Así detecta si el paquete llegó a la IP correcta.

## ¿Cuándo usar UDP?

| Caso | Por qué UDP |
|---|---|
| [[DNS]] | Pregunta/respuesta chica, si se pierde se reintenta |
| Streaming de video | Un frame perdido no vale la pena retransmitir |
| Videollamadas (WebRTC) | Latencia importa más que perfección |
| Juegos online | Posición de jugadores debe ser inmediata |
| Logs / métricas (StatsD) | Alto volumen, pérdidas aceptables |

## Relacionado
- [[TCP]] — alternativa confiable
- [[Puertos]] — igual que TCP, identifica servicios
- [[IP]] — protocolo de red que usa UDP por debajo

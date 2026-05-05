---
tags: [capa-4, tcp, conexion]
---

# Cierre de conexión TCP

[[TCP]] es **full-duplex**: cada dirección de la conexión se cierra de forma independiente. Por eso el cierre necesita **4 segmentos** (vs 3 del [[Three-Way Handshake]]).

## Los 4 pasos

```
Cliente                    Servidor
   |                           |
   |── FIN ───────────────────>|   "yo terminé de enviar"
   |                           |
   |<─ ACK ─────────────────── |   "ok, recibí tu FIN"
   |                           |
   |<─ FIN ─────────────────── |   "yo también terminé"
   |                           |
   |── ACK ───────────────────>|   "conexión cerrada"
```

## Half-close

Entre el ACK del servidor y su propio FIN, el servidor **puede seguir enviando datos**. El cliente cerró su lado (no envía más) pero sigue recibiendo. Esto se llama **half-close**.

Es útil, por ejemplo, en transferencias donde el cliente termina de pedir pero el servidor aún está enviando la respuesta.

## RST — cierre abrupto

Si en lugar de FIN se usa RST (Reset), la conexión se corta inmediatamente sin esperar confirmación. Causas:
- Conexión a un puerto que no existe
- Abortar una conexión activa
- Respuesta a un paquete de una conexión ya cerrada

## Relacionado
- [[TCP]] — protocolo que usa este mecanismo
- [[Three-Way Handshake]] — apertura de la conexión

---
tags: [capa-4, tcp, conexion]
---

# Three-Way Handshake

Mecanismo de [[TCP]] para establecer una conexión antes de enviar datos. Son 3 segmentos porque ambos extremos deben sincronizar sus números de secuencia.

## Los 3 pasos

```
Cliente                    Servidor
   |                           |
   |── SYN (seq=x) ──────────>|    "quiero conectarme"
   |                           |
   |<─ SYN+ACK (seq=y,ack=x+1)|    "ok, yo también"
   |                           |
   |── ACK (ack=y+1) ─────────>|    "entendido, empezamos"
   |                           |
   |====== CONEXIÓN ACTIVA =====|
```

## Por qué 3 y no 2

Con 2 mensajes (SYN + SYN-ACK) el servidor no sabe si el cliente recibió su SYN-ACK. El tercer ACK confirma que ambos están listos y tienen los números de secuencia del otro.

## ¿Qué pasa si se pierde el SYN?

El cliente espera un timeout y reintenta (típicamente 3-5 veces con backoff exponencial). Si nunca llega SYN-ACK, la conexión no se establece.

## Relacionado
- [[TCP]] — protocolo que usa este mecanismo
- [[Cierre de conexión TCP]] — el proceso inverso (4 segmentos)
- [[Puertos]] — el SYN va dirigido a un puerto específico del servidor

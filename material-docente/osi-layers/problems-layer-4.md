# Capa 4 — Transporte (Transport Layer)

## ¿Qué resuelve?

Comunicación extremo a extremo entre aplicaciones (no entre redes ni dispositivos físicos).
Define cómo se segmentan los datos, cómo se garantiza la entrega, y cómo se identifican
las aplicaciones dentro de un mismo host.

**Protocolos:** TCP, UDP
**No hay un dispositivo específico de red acá — vive en el sistema operativo de cada host.**

---

## Conceptos clave

**Puerto:** número de 16 bits que identifica una aplicación dentro de un host.
La IP te lleva al host, el puerto te lleva al proceso.
- Tu server Node.js en `:3000` → puerto 3000
- Postgres → 5432, Redis → 6379, HTTP → 80, HTTPS → 443

**TCP (Transmission Control Protocol):**
- Orientado a conexión: handshake antes de enviar datos (SYN → SYN-ACK → ACK)
- Garantiza orden y entrega completa
- Tiene control de flujo y congestión
- Costo: latencia extra por el handshake y los ACKs

**UDP (User Datagram Protocol):**
- Sin conexión, sin garantías
- "Disparar y olvidar"
- Más rápido, menor latencia
- Usado en: streaming de video, juegos online, DNS, VoIP, QUIC/HTTP3

**Socket:** combinación de IP + Puerto. Identifica unívocamente una conexión:
`(192.168.1.5:54321) ↔ (93.184.216.34:443)`

---

## Analogía

TCP es como un correo certificado con confirmación de recibo. Sabés que llegó, en orden.
UDP es como gritar en una habitación. Llegó o no, no sabés. Pero es inmediato.

Cuando streameas Netflix, preferís perder un frame que pausar el video esperando el reenvío.
Cuando hacés un pago, preferís TCP: cada byte debe llegar.

---

## Problemas reales de Capa 4

### 1. Puerto cerrado o no escuchando
- **Síntoma:** "Connection refused" al intentar conectarte a un servicio
- **Causa:** el proceso no está corriendo, escucha en otro puerto, o escucha solo en localhost
- **Diagnóstico:**
  ```bash
  ss -tlnp | grep 3000       # Ver qué está escuchando en el puerto 3000
  netstat -tlnp              # Alternativa
  # Si ves 127.0.0.1:3000 → solo acepta conexiones locales
  # Si ves 0.0.0.0:3000 → acepta de cualquier IP
  ```
- **Fix:** cambiar el bind address de tu servidor (`0.0.0.0` vs `127.0.0.1`)

### 2. Firewall bloqueando el puerto (iptables / security groups)
- **Síntoma:** el servicio está corriendo y escuchando, pero no llegás desde afuera
- **Causa:** el sistema operativo o el firewall de red bloquea el puerto
- **Diagnóstico:**
  ```bash
  # Ver reglas de firewall local
  iptables -L -n -v
  # Probar desde afuera
  nc -zv 192.168.1.5 3000    # netcat: intenta conectar al puerto
  telnet 192.168.1.5 3000    # alternativa
  ```
- **Fix:** abrir el puerto en el firewall / security group de tu cloud provider

### 3. Too many open connections / connection pool exhausted
- **Síntoma:** tu app empieza a fallar con "too many connections" o "connection pool timeout"
- **Causa:** abrís conexiones TCP pero no las cerrás, o el pool está mal dimensionado
- **Diagnóstico:**
  ```bash
  ss -s                      # Resumen de sockets
  ss -tn | grep ESTABLISHED | wc -l   # Contar conexiones establecidas
  ```
- **Fix:** usar connection pooling correctamente (PgBouncer para Postgres), cerrar conexiones, aumentar `max_connections`

### 4. TIME_WAIT acumulado
- **Síntoma:** el servidor tiene miles de conexiones en estado TIME_WAIT
- **Causa:** TCP mantiene un socket en TIME_WAIT por 60s después de cerrar para evitar
  que paquetes viejos contaminen nuevas conexiones. En servidores con alta concurrencia se acumula.
- **Diagnóstico:**
  ```bash
  ss -tan | grep TIME-WAIT | wc -l
  ```
- **Fix:** habilitar `SO_REUSEADDR`, ajustar `net.ipv4.tcp_tw_reuse`, usar keepalive

### 5. TCP SYN flood (ataque DDoS)
- **Síntoma:** el servidor deja de aceptar nuevas conexiones legítimas
- **Causa:** un atacante envía miles de SYN sin completar el handshake (nunca manda el ACK).
  La tabla de conexiones half-open del servidor se llena.
- **Diagnóstico:**
  ```bash
  ss -tan | grep SYN_RECV | wc -l   # Muchos SYN_RECV = posible ataque
  ```
- **Fix:** SYN cookies (el kernel no reserva estado hasta el ACK), rate limiting, firewall

### 6. Connection timeout vs Connection refused
- **Síntoma:** la conexión falla, pero de manera distinta
- **Diferencia crítica para debugging:**
  - **Connection refused:** el host llegó, el puerto está cerrado. Respuesta inmediata.
  - **Connection timeout:** los paquetes no llegan al destino (firewall silencioso, routing). Espera hasta el timeout.
- **Diagnóstico:** si tardó exactamente 30s (o lo que sea el timeout) → es un problema de red (L3) o firewall silencioso.
  Si fue instantáneo → el host llegó pero el puerto no está abierto.

### 7. UDP packet loss en streaming / gaming
- **Síntoma:** video pixelado, lag en juegos, voz cortada en VoIP
- **Causa:** pérdida de paquetes UDP en la red. Como UDP no retransmite, los datos simplemente se pierden.
- **Diagnóstico:**
  ```bash
  mtr --udp 8.8.8.8          # Ver pérdida de paquetes UDP por hop
  ```
- **Fix:** mejorar la calidad de la red (L1/L2/L3), usar codecs con corrección de errores (FEC)

### 8. Ephemeral port exhaustion
- **Síntoma:** el servidor no puede abrir nuevas conexiones salientes aunque haya sockets disponibles
- **Causa:** el OS asigna puertos efímeros (32768-60999) para conexiones salientes.
  Si abrís miles de conexiones por segundo al mismo destino IP:puerto, se agotan.
- **Diagnóstico:**
  ```bash
  cat /proc/sys/net/ipv4/ip_local_port_range
  ss -tan | grep ESTABLISHED | wc -l
  ```
- **Fix:** ampliar el rango de puertos efímeros, usar múltiples IPs origen, connection pooling

---

## Estados TCP que tenés que conocer

```
SYN_SENT    → tu app mandó SYN, esperando SYN-ACK (conectando)
SYN_RECV    → recibiste SYN, mandaste SYN-ACK, esperando ACK
ESTABLISHED → conexión activa
TIME_WAIT   → conexión cerrada, esperando 60s por paquetes viejos
CLOSE_WAIT  → el remoto cerró la conexión pero vos no (bug en tu código)
FIN_WAIT    → vos cerraste, esperando que el remoto confirme
```

`CLOSE_WAIT` acumulado → casi siempre es un bug en tu aplicación: recibiste FIN del servidor pero tu código nunca cerró el socket.

---

## Herramientas de diagnóstico L4

```bash
ss -tlnp                   # Puertos en escucha con proceso
ss -tan                    # Todas las conexiones TCP con estado
nc -zv host puerto         # Probar si un puerto está abierto
tcpdump -i eth0 tcp port 3000  # Capturar tráfico en un puerto
```

---

## Clave para recordar

> "Error de capa 4" = llegás al host pero no al servicio.
> Preguntá: ¿el proceso está corriendo? ¿En qué IP está escuchando? ¿Hay firewall bloqueando el puerto?

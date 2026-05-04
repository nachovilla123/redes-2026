# TCP/IP explicado desde cero

## Por qué se llama TCP/IP

Son **dos protocolos distintos que trabajan en capas distintas**. Ninguno de los dos puede hacer todo solo.

- **IP** (capa de red): sabe mover un paquete de una máquina a otra, saltando por routers. No garantiza nada. Si el paquete se pierde, IP no se entera y no lo reenvía.
- **TCP** (capa de transporte): construye encima de IP una comunicación confiable. Numera los datos, pide confirmaciones, retransmite si algo se pierde.

Se llaman juntos "TCP/IP" porque TCP necesita a IP para mover datos entre máquinas, e IP solo no alcanza para aplicaciones que necesitan confiabilidad.

---

## Analogía: el correo y vos coordinando

Querés mandar un libro de 300 páginas a un amigo en otra ciudad. El correo solo acepta sobres de 100 páginas máximo.

**IP es el correo.** Él recibe tu sobre y lo lleva. Pero si se pierde en el camino, no te avisa y no lo reenvía. Hace lo mejor que puede (*best-effort*), sin garantías.

**TCP sos vos coordinando con tu amigo.** Antes de mandar nada, lo llamás y acuerdan un código:

1. *"Te voy a mandar el libro en 3 sobres numerados."* (handshake)
2. Enviás sobre #1. Tu amigo recibe y te manda un mensaje: *"recibí el #1, mandame el #2"* (ACK).
3. Si en X minutos no recibís confirmación del sobre #2, lo reenviás (retransmisión).
4. Cuando terminaste, le avisás: *"ya mandé todo"* (FIN). Él confirma y cierra su lado también.

TCP garantiza que los 3 sobres lleguen, en orden, sin importar cuántas veces IP los pierda en el camino.

---

## Ejemplo real: tu browser pide google.com

Escribís `https://www.google.com` y apretás Enter.

### Paso 0 — DNS resuelve el nombre
Tu PC pregunta al servidor DNS: *"¿cuál es la IP de google.com?"*
Respuesta: `142.250.200.46` (ejemplo).

### Paso 1 — TCP establece la conexión (3-way handshake)
Antes de pedir la página, TCP "llama" al servidor:

```
Tu PC  →  SYN                    →  Google:443
Tu PC  ←  SYN + ACK              ←  Google:443
Tu PC  →  ACK                    →  Google:443
```

Ahora hay una conexión activa entre `tu_IP:52341` y `142.250.200.46:443`.

*¿Por qué puerto 443?* Es el puerto donde vive el servicio HTTPS por convención. El 52341 lo eligió tu sistema operativo al azar para identificar esta sesión.

### Paso 2 — IP lleva cada segmento TCP

Cada segmento TCP que sale de tu PC lleva encima una cabecera IP:

```
[ IP: src=tu_IP  dst=142.250.200.46  TTL=64 ]
[ TCP: src_port=52341  dst_port=443  seq=1  ACK ]
[ HTTP: GET / HTTP/1.1  Host: www.google.com ]
```

Los routers en el camino leen solo la cabecera IP para decidir el próximo salto. No ven puertos, no saben si es HTTPS o SSH.

### Paso 3 — El servidor responde con la página

Google envía el HTML dividido en múltiples segmentos TCP (porque es grande). Cada uno llega numerado. Tu TCP los reordena y cuando están todos, se los entrega a tu browser. Si falta alguno, TCP lo pide de nuevo automáticamente.

### Paso 4 — Cierre de la conexión (4 segmentos)

Cuando terminó la transferencia, cada lado cierra su dirección por separado:

```
Browser  →  FIN  →  Google     (yo terminé de enviar)
Browser  ←  ACK  ←  Google     (ok, recibí tu FIN)
Browser  ←  FIN  ←  Google     (yo también terminé)
Browser  →  ACK  →  Google     (ok, conexión cerrada)
```

Son 4 segmentos porque TCP es full-duplex: cada dirección se cierra de forma independiente. Esto se llama **half-close**: Google podría seguir enviando datos aunque vos ya hayas cerrado tu lado.

---

## UDP: el hermano rápido sin garantías

UDP también viaja sobre IP, pero no hace ninguna de las cosas que hace TCP.

| | TCP | UDP |
|---|---|---|
| Conexión previa | Sí (handshake) | No |
| Garantía de entrega | Sí (ACK + retransmisión) | No |
| Orden garantizado | Sí | No |
| Velocidad | Más lento (espera confirmaciones) | Más rápido |

**Analogía UDP:** mandar postales. Las tirás al buzón sin saber si llegaron. Si se pierde una, ni te enterás ni se reenvía.

**¿Para qué sirve entonces?** Para casos donde la velocidad importa más que la perfección:
- **DNS**: una pregunta, una respuesta. Si se pierde, la app pregunta de nuevo.
- **Streaming de video**: si se pierde un cuadro, no querés esperar la retransmisión — querés el siguiente cuadro ya.
- **Videollamadas**: un paquete perdido es una pequeña distorsión, no un problema crítico.

---

## Responsabilidades en una línea

| Protocolo | Responsabilidad |
|---|---|
| **IP** | Llevar un paquete de una IP a otra, sin garantías |
| **TCP** | Garantizar que todos los datos lleguen completos y en orden |
| **UDP** | Enviar rápido, sin garantías, sin conexión |

---

## El flujo de datos: de arriba hacia abajo

```
Aplicación (browser)
    ↓  "GET / HTTP/1.1"
TCP — agrega puertos, número de secuencia, window
    ↓
IP  — agrega IP origen, IP destino, TTL
    ↓
Ethernet/WiFi — agrega MACs del próximo salto
    ↓
Bits por el cable o el aire
```

Cada router en el camino lee la cabecera IP, decide el próximo salto, reemplaza las MACs y reenvía. El destino va desencapsulando al revés hasta que la aplicación recibe los datos.

---

## Las 4 capas del modelo TCP/IP

```
┌─────────────────────────────────────────────────┐
│  APLICACIÓN                                     │
│  HTTP, DNS, FTP, SMTP...                        │
│  "qué quiero hacer"                             │
├─────────────────────────────────────────────────┤
│  TRANSPORTE                                     │
│  TCP / UDP                                      │
│  "cómo llegan los datos de proceso a proceso"  │
├─────────────────────────────────────────────────┤
│  RED (Internet)                                 │
│  IP                                             │
│  "cómo llega un paquete de red a red"          │
├─────────────────────────────────────────────────┤
│  ACCESO A LA RED                                │
│  Ethernet, WiFi...                              │
│  "cómo llega una trama de nodo a nodo"         │
└─────────────────────────────────────────────────┘
```

**Tres cosas clave que se preguntan en parciales:**
- Las **MACs** (capa acceso) cambian en cada salto
- Las **IPs** (capa red) no cambian en todo el camino (salvo NAT)
- Los **puertos** (capa transporte) solo los lee el destino final

---

## Cómo sabe un router qué hacer con un paquete

El router tiene una **tabla de ruteo**: una lista de "si el destino empieza con X, mandalo por esta interfaz hacia este next-hop".

```
Red destino     Máscara           Next-hop        Interfaz
192.168.1.0    255.255.255.0    —               eth0  (conectada directa)
10.0.0.0       255.0.0.0        192.168.1.1     eth1
0.0.0.0        0.0.0.0          200.1.1.1       eth2  (default route)
```

Cuando llega un paquete, el router:
1. Lee la IP destino de la cabecera IP
2. La compara contra cada entrada buscando la más específica (**longest prefix match**)
3. Reenvía por la interfaz correspondiente, reemplazando las MACs de origen y destino

**¿Cómo se llena esa tabla?**
- **Rutas directamente conectadas**: automático, si una interfaz tiene IP `192.168.1.1/24` ya sabe que esa red es suya
- **Rutas estáticas**: un admin las escribe a mano
- **Protocolos de ruteo dinámico**: los routers se hablan entre ellos y aprenden rutas solos — RIP, OSPF, BGP, EIGRP

---

## ¿En qué lenguaje está programado un router?

| Parte | Qué hace | Cómo está hecho |
|---|---|---|
| **Plano de datos** (forwarding) | Reenviar paquetes a alta velocidad | Hardware dedicado: ASICs/FPGAs. No es software, es silicio diseñado para hacer una sola cosa rapidísimo |
| **Plano de control** (routing) | Calcular tablas, hablar con otros routers | Software, mayormente **C y C++** (Cisco IOS está en C) |
| **Plano de gestión** (CLI/web) | Que vos lo puedas configurar | C, Python, a veces hasta web en JS |

La separación entre plano de datos (hardware) y plano de control (software) es lo que permite que un router reenvíe millones de paquetes por segundo sin que el CPU se muera calculando rutas al mismo tiempo.

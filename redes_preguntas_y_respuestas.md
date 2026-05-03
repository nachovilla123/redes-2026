# Redes de Información — Preguntas y Respuestas

---

## REDES LAN — Ethernet y MAC

### ¿Qué es una colisión? ¿Cómo se resuelve?

Una **colisión** ocurre en redes con medio compartido (como Ethernet con hub o bus) cuando dos o más nodos transmiten simultáneamente, haciendo que las señales se superpongan y corrompan los datos. Se resuelve mediante **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection):
1. Cada nodo escucha el medio antes de transmitir.
2. Si detecta colisión durante la transmisión, envía una señal de "jam".
3. Espera un tiempo aleatorio (algoritmo de backoff exponencial) y reintenta.

---

### ¿En qué difieren los formatos de trama Ethernet y 802.3? ¿Cómo determina el receptor si es una u otra?

| Campo | Ethernet II (DIX) | 802.3 (IEEE) |
|---|---|---|
| Destino | 6 bytes | 6 bytes |
| Origen | 6 bytes | 6 bytes |
| Tipo/Longitud | **Tipo** (≥ 1536 = 0x0600) | **Longitud** (≤ 1500) |
| Datos | 46–1500 bytes | LLC + datos |
| FCS | 4 bytes | 4 bytes |

**Determinación:** El receptor examina el campo de 2 bytes después de las direcciones MAC:
- Si el valor es **≥ 0x0600 (1536)** → es Ethernet II → el valor indica el protocolo de capa superior (0x0800 = IP, 0x0806 = ARP).
- Si el valor es **≤ 1500** → es 802.3 → indica la longitud del campo de datos; para saber a qué capa superior entregar el PDU, se examina la **cabecera LLC**, específicamente el campo **DSAP** (Destination Service Access Point).

---

### ¿Cómo está compuesta una dirección MAC? ¿Cuál es la dirección de broadcast?

Una dirección MAC tiene **6 bytes (48 bits)** en notación hexadecimal (ej: `AA:BB:CC:DD:EE:FF`):

- **OUI** (Organizationally Unique Identifier): primeros 3 bytes — identifican al fabricante, asignados por la IEEE.
- **NIC** (Network Interface Controller): últimos 3 bytes — identifican la placa específica, asignados por el fabricante.

Bits especiales del primer byte:
- Bit 0 (LSB): **I/G** — 0 = Individual (unicast), 1 = Grupo (multicast/broadcast).
- Bit 1: **U/L** — 0 = Universal (IEEE), 1 = Local (administrada localmente).

**Dirección de broadcast:** `FF:FF:FF:FF:FF:FF` (todos los bits en 1) — es recibida por todos los nodos del segmento.

---

### ¿Qué campos posee la etiqueta 802.1Q?

El protocolo **802.1Q** (VLAN tagging) inserta una etiqueta de **4 bytes** en la trama Ethernet entre el campo Origen y el campo Tipo/Longitud:

- **TPID** (Tag Protocol Identifier): 2 bytes → valor fijo `0x8100`, indica que la trama está taggeada.
- **TCI** (Tag Control Information): 2 bytes, dividido en:
  - **PCP** (Priority Code Point): 3 bits → prioridad 802.1p (0-7).
  - **DEI** (Drop Eligible Indicator): 1 bit → indica si puede descartarse en caso de congestión.
  - **VID** (VLAN Identifier): 12 bits → identifica la VLAN (0-4095, valores 0 y 4095 reservados → hasta 4094 VLANs).

**Funcionalidad:** permite segmentar lógicamente una LAN en múltiples redes virtuales sobre la misma infraestructura física.

---

### ¿Cuál es la longitud mínima de una trama 802.3? ¿Con qué objetivo?

La longitud mínima es **64 bytes** (sin contar preámbulo ni SFD).
- Cabeceras (dest + orig + tipo/long): 14 bytes
- FCS: 4 bytes
- Datos mínimos: **46 bytes**

**Objetivo:** garantizar que una trama en tránsito aún esté siendo transmitida cuando el emisor detecte una colisión. Con cables de hasta 2500 m y velocidad a 10 Mbps, el tiempo de propagación de ida y vuelta (512 bit-times = 51.2 µs) obliga a que la trama dure al menos ese tiempo en el medio para que CSMA/CD funcione correctamente.

---

### ¿En qué puerto entregará el switch una trama con dirección destino desconocida?

El switch realiza **flooding**: reenvía la trama por **todos los puertos activos excepto el puerto de origen**. Esto ocurre porque la dirección MAC destino no está en la tabla CAM (tabla de direcciones MAC). Cuando el destino responda, el switch aprenderá su MAC y puerto, y en adelante hará forwarding directo.

---

### ¿Cómo realiza Ethernet el control de errores?

Ethernet usa **FCS** (Frame Check Sequence) de **4 bytes** al final de la trama, calculado con **CRC-32** (Cyclic Redundancy Check) sobre todos los campos de la trama. El receptor recalcula el CRC sobre los datos recibidos y lo compara con el FCS; si no coinciden, la trama se **descarta silenciosamente** (sin retransmisión — Ethernet no garantiza entrega, eso es responsabilidad de capas superiores como TCP).

---

## SPANNING TREE

### ¿Cómo está compuesto el BridgeID? ¿Para qué se utiliza?

El **BridgeID** tiene **8 bytes**:
- **Bridge Priority**: 2 bytes (en realidad 4 bits de prioridad + 12 bits de VLAN ID en 802.1t). El valor por defecto es 32768.
- **MAC Address**: 6 bytes — dirección MAC del switch.

**Uso:** se utiliza para elegir el **Root Bridge** (puente raíz) del árbol spanning tree. El switch con el **BridgeID más bajo** es elegido Root Bridge (se compara primero la prioridad; en caso de empate, gana el menor MAC).

---

### ¿Cómo se realiza la elección del Root Bridge?

1. Al inicio, cada switch se cree Root Bridge y envía **BPDUs** (Bridge Protocol Data Units) anunciando su propio BridgeID.
2. Los switches comparan los BPDUs recibidos con el suyo: si reciben uno con BridgeID menor, actualizan su Root Bridge y reenvían la BPDU con ese BridgeID.
3. El proceso converge y el switch con el **menor BridgeID** (menor prioridad; en empate, menor MAC) queda como Root Bridge.
4. Todos los puertos del Root Bridge quedan en estado **Forwarding (Designated Ports)**.

---

### ¿Qué producirá la introducción de un switch con Bridge Priority más alto y MAC Address más bajo?

- **Bridge Priority más alto** significa un número mayor (ej: 49152 vs 32768 del actual Root) → **no ganará** la elección de Root Bridge por prioridad.
- Aunque tenga MAC más bajo, la prioridad se evalúa primero.
- **Resultado:** el nuevo switch NO se convierte en Root Bridge. El Root Bridge actual se mantiene. El nuevo switch participará en STP pero quedará como non-root.

> Nota: si la prioridad fuera **más baja** (menor número), sí desplazaría al Root Bridge actual.

---

## WIRELESS LAN

### ¿En qué consiste el problema del nodo oculto? ¿Cómo se resuelve?

El **nodo oculto** ocurre cuando dos estaciones (A y C) no se "ven" entre sí (están fuera del rango de detección mutua) pero ambas se comunican con un punto en común (B, el AP). Cuando A transmite, C no detecta la señal de A y puede transmitir simultáneamente, causando colisión en B.

**Solución:** mecanismo **RTS/CTS** (Request To Send / Clear To Send) del modo **DCF** de 802.11:
1. A envía un RTS al AP indicando la duración de la transmisión.
2. El AP responde con un CTS (escuchado por todos, incluyendo C).
3. C actualiza su **NAV** (Network Allocation Vector) y se abstiene de transmitir durante ese tiempo.

---

### ¿En qué se diferencian los modos DCF y PCF?

| | DCF | PCF |
|---|---|---|
| Tipo | Distribuido (contención) | Centralizado (sin contención) |
| Mecanismo | CSMA/CA + backoff aleatorio | El AP hace polling a cada estación |
| Control | Cada estación decide cuándo transmitir | El AP (Point Coordinator) controla el turno |
| Latencia | Variable | Determinista |
| Uso | Datos best-effort | Aplicaciones con requisitos de tiempo real |

---

### ¿Qué es el NAV y qué función cumple?

El **NAV** (Network Allocation Vector) es un **temporizador virtual** que mantiene cada estación. Su valor indica cuánto tiempo el medio estará ocupado, basado en el campo **Duración** de las tramas recibidas. Durante ese tiempo, la estación no intenta transmitir (sin necesidad de escuchar el canal físicamente). Forma parte del mecanismo de **CSMA/CA virtual** para evitar colisiones.

---

### ¿Qué función cumple el campo "duración" en la trama 802.11?

Indica el **tiempo en microsegundos** que el medio será ocupado por la transmisión actual (incluyendo ACK y espaciados SIFS). Todas las estaciones que reciben la trama actualizan su NAV con ese valor, reservando el canal y evitando colisiones.

---

### ¿Cuántas direcciones MAC contiene la cabecera 802.11? ¿Qué dispositivos identifican?

La cabecera 802.11 contiene **hasta 4 direcciones MAC** de 6 bytes cada una:

| Campo | Identifica |
|---|---|
| Address 1 | Receptor inmediato (RA) |
| Address 2 | Transmisor inmediato (TA) |
| Address 3 | Destino final o fuente original |
| Address 4 | Solo en modo WDS (puente entre APs) |

En infraestructura típica (cliente ↔ AP ↔ red): A1 = AP (receptor), A2 = cliente (transmisor), A3 = destino en la red cableada.

---

### ¿En qué bandas de frecuencia opera Wireless LAN y qué características tienen?

| Norma | Banda | Velocidad máx. | Características |
|---|---|---|---|
| 802.11b | 2.4 GHz | 11 Mbps | Mayor alcance, más interferencia (microondas, BT) |
| 802.11g | 2.4 GHz | 54 Mbps | Compatible con b |
| 802.11a | 5 GHz | 54 Mbps | Menos interferencia, menor alcance |
| 802.11n | 2.4 / 5 GHz | 600 Mbps | MIMO, canales de 40 MHz |
| 802.11ac | 5 GHz | varios Gbps | MU-MIMO, canales hasta 160 MHz |

- **2.4 GHz:** mayor alcance, mejor penetración de paredes, pero más interferencia y solo 3 canales no solapados.
- **5 GHz:** menor alcance, menos interferencia, más canales disponibles, mayor velocidad.

---

### ¿Cómo opera un AP en modo PCF?

En modo PCF, el AP actúa como **Point Coordinator**:
1. Durante el **CFP** (Contention-Free Period), el AP envía una trama **Beacon** con el bit PCF activado.
2. El AP realiza **polling** a cada estación registrada en la lista de sondeo.
3. Cada estación solo transmite cuando el AP le da permiso (mediante trama CF-Poll).
4. El AP puede combinar datos + CF-Poll en una misma trama.
5. Al finalizar el CFP, el AP envía CF-End y comienza el período de contención (DCF).

---

## TCP/IP — IP y Direccionamiento

### Modelo OSI: capas y diferencia con DARPA/TCP/IP

**Modelo OSI** (7 capas):
1. Física
2. Enlace de Datos
3. Red
4. Transporte
5. Sesión
6. Presentación
7. Aplicación

**Modelo TCP/IP** (DARPA, 4 capas):
1. Acceso a la red (= Física + Enlace)
2. Internet (= Red)
3. Transporte
4. Aplicación (= Sesión + Presentación + Aplicación)

**Diferencias clave:**
- OSI tiene 7 capas, TCP/IP tiene 4.
- OSI es un modelo teórico/referencia; TCP/IP es el modelo implementado en Internet.
- OSI separa Sesión y Presentación; TCP/IP las fusiona en Aplicación.

**Control de errores:** se realiza en la capa de **Enlace de Datos** (FCS/CRC) y en la capa de **Transporte** (checksum en TCP/UDP; retransmisión en TCP).

---

### Flags en la cabecera IPv4 y su uso

El campo **Flags** ocupa **3 bits**:

| Bit | Nombre | Función |
|---|---|---|
| 0 | Reservado | Siempre 0 |
| 1 | **DF** (Don't Fragment) | Si = 1, el datagrama NO puede ser fragmentado. Si el router necesita fragmentar, descarta y envía ICMP "Fragmentation Needed". |
| 2 | **MF** (More Fragments) | Si = 1, hay más fragmentos por venir. Si = 0, es el último (o único) fragmento. |

---

### ¿Qué campos de la cabecera IPv4 intervienen en el mecanismo de fragmentación?

- **Identification** (16 bits): identifica a qué datagrama original pertenece cada fragmento.
- **Flags** (3 bits): bits DF y MF.
- **Fragment Offset** (13 bits): indica la posición del fragmento dentro del datagrama original, en unidades de 8 bytes.
- **Total Length** (16 bits): longitud total de cada fragmento.

**¿Quién fragmenta? ¿Quién reensambla?**
- **Fragmenta:** cualquier **router** en el camino (cuando el datagrama supera el MTU del enlace saliente).
- **Reensambla:** el **host destino** final (los routers intermedios no reensamblan).

---

### Direcciones clase A, B, C y D

| Clase | Rango primer octeto | Máscara natural | Redes | Hosts/red |
|---|---|---|---|---|
| A | 1–126 | /8 (255.0.0.0) | 126 | 16.777.214 |
| B | 128–191 | /16 (255.255.0.0) | 16.384 | 65.534 |
| C | 192–223 | /24 (255.255.255.0) | 2.097.152 | 254 |
| D | 224–239 | — | — | Multicast |

- **Clase A:** 126 redes (la 127 es loopback). Cada red tiene 2²⁴ − 2 = **16.777.214 hosts**.
- **Clase B:** 2¹⁴ = **16.384 redes**. Cada red tiene 2¹⁶ − 2 = **65.534 hosts**.
- **Clase D (224–239):** son **multicast**, no tienen hosts/redes en el sentido clásico. Se usan para enviar a grupos de hosts (streaming, protocolos como OSPF). Hay 2²⁸ = **268.435.456** direcciones multicast.

---

### ¿Cuántas subredes se obtienen al aplicar una máscara de 13 bits a una red Clase A? ¿Nueva máscara?

- Red Clase A: máscara natural `/8`
- Se toman 13 bits adicionales para subred: `/8 + 13 = /21`
- **Nueva máscara:** `/21` → `255.255.248.0`
- **Número de subredes:** 2¹³ = **8192 subredes**
- Hosts por subred: 2¹¹ − 2 = 2046 hosts

---

### ¿Puede 172.16.255.3 ser dirección de broadcast? ¿De qué red?

Sí puede serlo. La dirección de broadcast de la red **172.16.255.0/30** es **172.16.255.3**:
- Red: 172.16.255.0
- Hosts válidos: 172.16.255.1 y 172.16.255.2
- Broadcast: **172.16.255.3**

Con máscara natural de Clase B (`/16`), el broadcast de 172.16.0.0/16 sería 172.16.255.255, por lo que .3 no es broadcast de la red natural, pero sí de la subred /30 mencionada.

---

### Subnetting: 192.254.8.0/24 en 29 subredes — ¿es 192.254.8.31 host válido?

- Necesitamos ≥ 29 subredes → 2⁵ = 32 ≥ 29 → **5 bits para subred**
- Nueva máscara: /24 + 5 = **/29** → 255.255.255.248
- Hosts por subred: 2³ − 2 = **6 hosts**
- Incremento de subred: cada 8 direcciones

Subredes: .0/29, .8/29, .16/29, .24/29, .32/29, ...

Para la subred **192.254.8.24/29**:
- Red: 192.254.8.24
- Hosts: .25 a .30
- Broadcast: **192.254.8.31**

**Conclusión: 192.254.8.31 NO es una dirección de host válida** — es la dirección de **broadcast** de la subred **192.254.8.24/29**.

---

### Subnetting VLSM: 172.16.0.0/23 para 3 redes (129, 58 y 10 hosts)

El rango 172.16.0.0/23 contiene 2⁹ = 512 direcciones (172.16.0.0 – 172.16.1.255).

Se asignan de mayor a menor:

**Red 1 — 129 hosts** → necesita 2⁸ = 256 direcciones → **/24**
- Red: **172.16.0.0/24** (255.255.255.0)
- Hosts válidos: .0.1 a .0.254 | Broadcast: .0.255

**Red 2 — 58 hosts** → necesita 2⁶ = 64 direcciones → **/26**
- Red: **172.16.1.0/26** (255.255.255.192)
- Hosts válidos: .1.1 a .1.62 | Broadcast: .1.63

**Red 3 — 10 hosts** → necesita 2⁴ = 16 direcciones → **/28**
- Red: **172.16.1.64/28** (255.255.255.240)
- Hosts válidos: .1.65 a .1.78 | Broadcast: .1.79

---

### ARP: ¿Qué mensajes intervienen? ¿A quién van dirigidos?

El protocolo **ARP** (Address Resolution Protocol) resuelve direcciones IP → MAC:

| Mensaje | Origen | Destino | Contenido |
|---|---|---|---|
| **ARP Request** | Host que busca | **Broadcast** (`FF:FF:FF:FF:FF:FF`) | "¿Quién tiene la IP X? Dígaselo a Y" |
| **ARP Reply** | Host dueño de la IP | **Unicast** (al que preguntó) | "La IP X la tengo yo, mi MAC es Z" |

El resultado se almacena en la **tabla ARP** (caché) del host solicitante.

---

### ¿Qué es un ARP gratuito (Gratuitous ARP)?

Es un **ARP Request** que un host envía con su **propia dirección IP como dirección destino** (IP origen = IP destino = propia IP del host). Se envía en **broadcast**.

**Usos:**
- Detectar si hay otra máquina con la misma IP (conflicto de IP) — si alguien responde, hay duplicado.
- Actualizar la caché ARP de los demás nodos al cambiar la MAC (ej: failover, cambio de placa).
- Anunciar su presencia en la red al iniciar.

---

### Default Gateway y Default Route

- **Default Gateway:** es la dirección IP del **router** al que un host envía todos los datagramas cuyo destino no está en su red local. Es la "puerta de salida" de la red.
- **Default Route:** es la entrada en la **tabla de ruteo** del router (o host) que indica adónde enviar los paquetes cuando ninguna otra ruta más específica coincide. Se representa como `0.0.0.0/0`.
- **Relación:** el Default Gateway configurado en un host equivale a la Default Route en su tabla de ruteo. El router que actúa como Default Gateway tiene su propia Default Route hacia el ISP/Internet.

---

### Direcciones privadas (RFC 1918)

Son rangos de direcciones IP reservadas para uso **interno** (no enrutables en Internet):

| Clase | Rango | Prefijo |
|---|---|---|
| A | 10.0.0.0 – 10.255.255.255 | /8 |
| B | 172.16.0.0 – 172.31.255.255 | /12 |
| C | 192.168.0.0 – 192.168.255.255 | /16 |

Para salir a Internet desde una red privada se requiere **NAT** (Network Address Translation).

---

### ICMP "Destino Inalcanzable": ¿qué lo provoca? ¿Quién lo genera?

**Genera:** el **router** que no puede entregar el datagrama (o el host destino en algunos casos).

**Situaciones que lo provocan:**
- El router no tiene ruta hacia el destino (y no tiene default route).
- El protocolo de capa superior no está disponible en el destino.
- El puerto UDP destino no existe.
- El datagrama tiene DF=1 pero debe fragmentarse para continuar.

El mensaje ICMP Destination Unreachable se envía al **host origen** del datagrama.

---

### Tabla de ruteo: ¿qué elementos contiene?

Cada entrada en una tabla de ruteo incluye:
- **Red destino** (dirección de red)
- **Máscara / prefijo**
- **Next-hop** (IP del próximo router) o interfaz de salida
- **Métrica** (costo de la ruta)
- **Tipo de ruta** (directamente conectada, estática, dinámica y por qué protocolo: RIP, OSPF, BGP…)

---

### DNS: ¿Qué es una consulta iterativa?

En una **consulta iterativa**, el servidor DNS consultado **no resuelve completamente** la pregunta, sino que devuelve la **referencia al próximo servidor DNS** que puede saber más (por ejemplo, el servidor del TLD). El **cliente** (o resolver) es quien debe hacer las sucesivas consultas por su cuenta, siguiendo las referencias hasta obtener la respuesta final.

Se opone a la **consulta recursiva**, donde el servidor asume la responsabilidad de resolver completamente y devuelve la respuesta final al cliente.

---

### DHCP: ¿Cuántas veces y con qué frecuencia intenta renovar?

El cliente DHCP intenta renovar la concesión (lease) de forma progresiva:

1. Al **50% del tiempo de lease** (T1): intenta renovar con el mismo servidor DHCP mediante **unicast** (mensaje DHCPREQUEST).
2. Al **87.5% del tiempo de lease** (T2): si no obtuvo renovación, intenta con cualquier servidor DHCP mediante **broadcast**.
3. Al **100% del tiempo**: si aún no renovó, debe abandonar la dirección IP y comenzar el proceso DORA desde cero (DISCOVER → OFFER → REQUEST → ACK).

---

## CAPTURA WIRESHARK — Análisis

La captura muestra:

| N° | Origen | Destino | Protocolo | Tipo |
|---|---|---|---|---|
| 1 | 52.123.136.129 | 192.168.0.208 | TCP | Unicast |
| 2 | 192.168.0.208 | 239.255.255.250 | SSDP | Multicast |
| 3 | Sagemcom (MAC) | Broadcast (MAC) | ARP | Broadcast L2 |
| 4 | 192.168.0.208 | 239.255.255.250 | SSDP | Multicast |
| 5 | 192.168.0.1 | 192.168.0.255 | UDP | Broadcast |
| 6 | Sagemcom (MAC) | Broadcast (MAC) | ARP | Broadcast L2 |
| 7 | 192.168.0.208 | 163.116.225.35 | DTLSv1.2 | Unicast |

### a. ¿En qué segmento de red se realizó la captura?

Red: **192.168.0.0/24** (255.255.255.0) — los hosts locales tienen IPs .208, .1, y el router aparece como Sagemcom.

### b. ¿Cuántos datagramas IP son Unicast, Broadcast y Multicast?

- **Unicast:** 2 (paquetes 1 y 7)
- **Broadcast:** 1 (paquete 5 → destino 192.168.0.255)
- **Multicast:** 2 (paquetes 2 y 4 → destino 239.255.255.250)
- Los paquetes 3 y 6 son ARP (no son datagramas IP, son de capa 2)

### c. ¿Cuáles ingresan/egresan hacia/desde el exterior?

- **Paquete 1 (ingresa):** origen 52.123.136.129 → IP pública, no pertenece a 192.168.0.0/24 → proviene del exterior/Internet.
- **Paquete 7 (egresa):** destino 163.116.225.35 → IP pública, no pertenece a la red local → sale hacia Internet.
- El resto (2, 3, 4, 5, 6) son tráfico **local**: multicast de descubrimiento SSDP (UPnP), broadcast de ARP y UDP → permanecen dentro del segmento.

---

## CUESTIONARIO N° 2 — IP, TCP, UDP, IPv6

### 1. ¿Cuál es la finalidad del campo VERSION en los datagramas IP?

Indica la versión del protocolo IP utilizada (**4** para IPv4, **6** para IPv6). Permite al receptor saber cómo interpretar el resto del datagrama, ya que los formatos de cabecera difieren entre versiones.

---

### 2. ¿Por qué el tamaño máximo del datagrama IP es 64 KB?

El campo **Total Length** de la cabecera IPv4 tiene **16 bits**, por lo que el valor máximo es 2¹⁶ − 1 = **65.535 bytes ≈ 64 KB**. Es un límite arquitectónico del protocolo.

---

### 3. ¿Cuál es la finalidad del campo TTL?

**TTL** (Time To Live) es un contador de **saltos** (no de tiempo, a pesar del nombre). Cada router que procesa el datagrama decrementa el TTL en 1. Si llega a 0, el router **descarta** el datagrama y envía un **ICMP Time Exceeded** al origen. Su propósito es evitar que los datagramas circulen indefinidamente por la red en caso de bucles de ruteo.

---

### 4. ¿Cómo opera la fragmentación en los datagramas IP?

Cuando un datagrama debe atravesar un enlace cuyo **MTU** (Maximum Transmission Unit) es menor que el tamaño del datagrama:
1. El **router** divide el datagrama en fragmentos, cada uno ≤ MTU.
2. Cada fragmento lleva la misma **Identification** que el original.
3. El **Fragment Offset** indica la posición del fragmento (en unidades de 8 bytes).
4. El bit **MF=1** en todos los fragmentos excepto el último.
5. El **host destino** reensambla los fragmentos usando el Identification y Fragment Offset.
6. Si falta algún fragmento, el datagrama completo se descarta.

---

### 5. ¿Cómo se realiza el control de flujo en IP, UDP y TCP?

- **IP:** **no tiene** control de flujo. Es un protocolo best-effort sin garantías.
- **UDP:** **no tiene** control de flujo. Es un protocolo no orientado a conexión.
- **TCP:** implementa control de flujo mediante **ventana deslizante** (campo Window en el segmento TCP). El receptor anuncia cuántos bytes puede recibir en su buffer; el emisor no puede enviar más datos de los que la ventana permite.

---

### 6. ¿Cómo se controlan los errores en TCP y UDP?

- **UDP:** usa un **checksum de 16 bits** (opcional en IPv4, obligatorio en IPv6) sobre la cabecera y datos. Si detecta error, **descarta** el segmento silenciosamente (sin retransmisión).
- **TCP:** usa **checksum de 16 bits** (obligatorio). Además, implementa **retransmisión**: cada segmento tiene un número de secuencia; el receptor envía ACK; si el emisor no recibe ACK antes del timeout, **retransmite**.

---

### 7. ¿Qué funciones cumplen los bits FIN, ACK y SYN?

| Flag | Función |
|---|---|
| **SYN** (Synchronize) | Inicia una conexión TCP; se usa en el handshake de 3 vías para sincronizar números de secuencia. |
| **ACK** (Acknowledgment) | Indica que el campo Acknowledgment Number es válido y confirma la recepción de datos. |
| **FIN** (Finish) | Solicita el cierre de la conexión en un sentido (cada dirección se cierra independientemente). |

---

### 8. ¿Cómo evita TCP la fragmentación de datagramas IP?

Durante el handshake, cada extremo anuncia su **MSS** (Maximum Segment Size): el tamaño máximo de datos TCP que puede recibir en un segmento. El MSS se calcula como `MTU − 20 bytes IP − 20 bytes TCP`. TCP divide los datos en segmentos que no superen el MSS mínimo acordado, de modo que el datagrama IP resultante no exceda el MTU y no necesite fragmentarse.

---

### 9. Intercambio inicial de tres segmentos TCP (Three-Way Handshake)

```
Cliente                          Servidor
  |                                  |
  |----SYN (seq=x) ----------------->|   Cliente solicita conexión
  |                                  |
  |<---SYN+ACK (seq=y, ack=x+1) ----|   Servidor acepta y sincroniza
  |                                  |
  |----ACK (seq=x+1, ack=y+1) ------>|   Cliente confirma
  |                                  |
  |         Conexión establecida     |
```

1. **SYN:** el cliente elige un número de secuencia inicial aleatorio `x` y envía SYN.
2. **SYN+ACK:** el servidor elige su secuencia inicial `y`, confirma el SYN del cliente (ack=x+1) y envía su propio SYN.
3. **ACK:** el cliente confirma el SYN del servidor (ack=y+1). La conexión queda establecida.

---

### 10. ¿Por qué el tráfico UDP no es confiable?

UDP no tiene:
- **Confirmación de entrega** (no hay ACK).
- **Retransmisión** ante pérdida de paquetes.
- **Control de orden** (los datagramas pueden llegar desordenados).
- **Control de flujo** ni **control de congestión**.

Si un segmento UDP se pierde, se corrompe o llega fuera de orden, **no hay mecanismo para detectarlo ni corregirlo a nivel de transporte**. La fiabilidad, si se necesita, debe implementarla la aplicación.

---

### 11. ¿Cuál es el único campo igual en IPv4 e IPv6? ¿Qué finalidad tiene?

El campo **VERSION** (4 bits) es el único que existe en ambas versiones y ocupa la misma posición (primeros 4 bits). Su finalidad es indicar qué versión del protocolo se está usando (4 o 6) para que el receptor sepa cómo parsear el resto de la cabecera.

---

### 12. ¿Cuáles son las direcciones IPv4 locales? ¿Qué función cumplen?

- **127.0.0.0/8** (loopback): la más conocida es `127.0.0.1`. Permite que un host se comunique consigo mismo sin usar la red física. Se usa para pruebas y comunicación entre procesos locales.
- **169.254.0.0/16** (APIPA): asignada automáticamente cuando un host no obtiene IP de un servidor DHCP. Permite comunicación local en la misma red (link-local), pero no es enrutable hacia Internet.

---

### 13. Ejemplos de IPv4 con clase A, B y C

| Clase | Ejemplo | Máscara natural | Redes | Hosts/red |
|---|---|---|---|---|
| A | 10.0.0.1 | /8 (255.0.0.0) | 126 | 16.777.214 |
| B | 172.20.0.1 | /16 (255.255.0.0) | 16.384 | 65.534 |
| C | 192.168.1.1 | /24 (255.255.255.0) | 2.097.152 | 254 |

---

### 14. Ejemplo de dirección IPv4 sin clase — primera y última dirección

**Ejemplo:** `192.168.10.100/27`

- Máscara: 255.255.255.224
- Bloque de 32 direcciones; múltiplo de 32 ≤ 100 → 96
- **Primera dirección (red):** 192.168.10.96
- **Última dirección (broadcast):** 192.168.10.127
- Hosts válidos: .97 a .126

---

### 15. ¿Cómo se abrevia una dirección IPv6? Tres ejemplos

**Reglas:**
1. Omitir los **ceros a la izquierda** en cada grupo de 16 bits.
2. Un único grupo consecutivo de grupos de todo ceros se puede reemplazar por **`::`** (solo una vez).

**Ejemplos:**

```
2001:0db8:0000:0000:0000:0000:0000:0001  →  2001:db8::1

fe80:0000:0000:0000:0200:f8ff:fe21:67cf  →  fe80::200:f8ff:fe21:67cf

0000:0000:0000:0000:0000:0000:0000:0001  →  ::1   (loopback)
```

---

### 16. Tipos de direcciones en IPv6

| Tipo | Rango | Descripción |
|---|---|---|
| **Unicast Global** | `2000::/3` | Equivalente a IP pública IPv4. Enrutable en Internet. |
| **Unicast Link-Local** | `fe80::/10` | Solo válida en el enlace local. Asignada automáticamente. No enrutable. |
| **Unicast Unique Local** | `fc00::/7` | Equivalente a IP privada IPv4. Enrutable dentro del sistema autónomo, no en Internet. |
| **Multicast** | `ff00::/8` | Envío a un grupo de interfaces. Reemplaza al broadcast de IPv4. |
| **Anycast** | — | Una dirección asignada a múltiples interfaces; el paquete llega al más cercano según ruteo. |

> IPv6 **no tiene broadcast**; usa multicast en su lugar.

---

### 17. ¿Cómo se forma la dirección Link-Local a partir de la MAC?

Se usa el proceso **EUI-64**:

1. Tomar la MAC de 48 bits: `AA:BB:CC:DD:EE:FF`
2. Dividir en dos mitades e insertar `FF:FE` en el medio: `AA:BB:CC:FF:FE:DD:EE:FF`
3. Invertir el **bit U/L** (bit 7 del primer byte): si era 0 → poner 1 (y viceversa).
4. Resultado en notación IPv6: `AABB:CCFF:FEDD:EEFF`
5. Agregar el prefijo Link-Local: **`fe80::`** + EUI-64

**Ejemplo:**
```
MAC:        00:1A:2B:3C:4D:5E
EUI-64:     021A:2BFF:FE3C:4D5E
Link-Local: fe80::21a:2bff:fe3c:4d5e
```
*(se invirtió el bit U/L: 00 → 02)*

---

### 18. ¿Qué tipo de direcciones circulan dentro del sistema autónomo pero no en Internet?

- **IPv4:** las **direcciones privadas** (RFC 1918): `10.0.0.0/8`, `172.16.0.0/12` y `192.168.0.0/16`.
- **IPv6:** las **Unique Local Addresses** (ULA), rango `fc00::/7` (en la práctica `fd00::/8`). Son enrutables dentro de una organización/sistema autónomo pero los routers de Internet no las propagan.
- También las **Link-Local** (`fe80::/10`) que solo existen dentro del mismo enlace (no son enrutadas ni siquiera dentro del sistema autónomo).

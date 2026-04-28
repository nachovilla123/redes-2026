# DHCP y DNS — Cómo funciona la infraestructura de red hoy

> Tema de parcial. Cobertura profunda: protocolo, mensajes, proceso paso a paso, casos borde y detalles que se preguntan en examen.

---

# PARTE 1 — DHCP (Dynamic Host Configuration Protocol)

## Analogía: el hotel y la recepción

Llegás a un hotel. No traés habitación asignada — le pedís a la recepción que te dé una. La recepcionista te asigna la habitación 304, te dice que podés usarla hasta el domingo, y te da el mapa del hotel (puerta de salida = default gateway) y la guía telefónica interna (DNS).

Eso es DHCP:
- **Vos** = dispositivo nuevo en la red
- **Recepción** = servidor DHCP
- **Habitación 304** = dirección IP asignada
- **"Hasta el domingo"** = lease time (tiempo de préstamo)
- **Mapa + guía** = configuración de red (gateway, DNS, máscara)

Cuando te vas del hotel, la habitación queda libre para otro huésped.

---

## ¿Qué configura DHCP?

Un servidor DHCP entrega al cliente, como mínimo:
- **Dirección IP** (la que el dispositivo va a usar)
- **Máscara de subred** (qué parte de la IP es red y cuál es host)
- **Default gateway** (la IP del router para salir a internet)
- **Servidor DNS** (a quién preguntarle nombres de dominio)
- **Lease time** (por cuánto tiempo es válida esa configuración)

Opcionalmente también puede entregar: servidor NTP, nombre de dominio, servidor WINS, opciones personalizadas (vendor-specific), etc.

---

## El proceso DORA — los 4 mensajes fundamentales

```
Cliente                          Servidor DHCP
   |                                   |
   |----(1) DHCPDISCOVER ------------->|   Broadcast: "¿hay algún servidor DHCP?"
   |                                   |
   |<---(2) DHCPOFFER -----------------| Unicast/Broadcast: "te ofrezco 192.168.1.10"
   |                                   |
   |----(3) DHCPREQUEST -------------->|   Broadcast: "acepto la oferta de 192.168.1.10"
   |                                   |
   |<---(4) DHCPACK ------------------|   "Confirmado, es tuya hasta las 12:00"
   |                                   |
```

### Detalle de cada mensaje

#### (1) DHCPDISCOVER
- El cliente **no tiene IP todavía**, así que usa:
  - IP origen: `0.0.0.0`
  - IP destino: `255.255.255.255` (broadcast)
  - Puerto origen: UDP 68 (cliente)
  - Puerto destino: UDP 67 (servidor)
- Incluye su **MAC address** como identificador
- Puede incluir el último IP que usó (campo `requested IP`)

#### (2) DHCPOFFER
- El servidor **reserva temporalmente** la IP que va a ofrecer
- Responde con la IP propuesta, máscara, gateway, DNS, lease time
- Si hay **varios servidores DHCP** en la red, el cliente puede recibir varias ofertas
- El cliente toma **la primera que llega** (generalmente)

#### (3) DHCPREQUEST
- El cliente acepta **una oferta** (y así implícitamente rechaza las demás)
- Se envía como **broadcast** para que todos los servidores sepan cuál fue elegido (los no elegidos liberan su reserva)
- Incluye el `server identifier` del servidor seleccionado

#### (4) DHCPACK
- El servidor confirma la asignación y entrega todos los parámetros de configuración
- El cliente recién ahora **configura su interfaz** con esos datos
- Si hubo algún problema (IP ya tomada, por ejemplo), el servidor envía **DHCPNAK** (negative acknowledgment)

> Mnemotecnia: **D.O.R.A** — Discover, Offer, Request, Acknowledge

---

## El Lease Time y la renovación

El lease time es el tiempo por el que el cliente "posee" la IP. No es permanente porque:
- Los dispositivos entran y salen de la red constantemente
- El pool de IPs es finito

### Tiempos de renovación

```
0%                   50%        87.5%      100%
|---------------------|-----------|---------| lease vence
                      |           |
                   T1: intenta  T2: intenta
                   renovar con  con broadcast
                   el mismo     (cualquier servidor)
                   servidor
```

- **T1 = 50% del lease**: el cliente envía **DHCPREQUEST unicast** al servidor original para renovar
- **T2 = 87.5% del lease**: si no renovó en T1, envía **DHCPREQUEST broadcast** a cualquier servidor
- **100% del lease**: si no renovó, el cliente **pierde la IP** y debe empezar el proceso DORA de nuevo

---

## DHCP Release y Decline

- **DHCPRELEASE**: el cliente avisa al servidor que ya no necesita la IP (ej: cuando apagás el equipo ordenadamente). El servidor la marca como disponible.
- **DHCPDECLINE**: el cliente detectó que la IP ofrecida **ya está en uso** (por ARP probe) y la rechaza. El servidor la marca como conflictiva.

---

## DHCP Relay Agent

**Problema:** DHCPDISCOVER es broadcast. Los broadcasts **no atraviesan routers**.

**Solución:** el DHCP Relay Agent (también llamado DHCP Helper).

```
[Red 192.168.1.0/24]          [Router/Relay]          [Servidor DHCP: 10.0.0.1]
       Cliente
       0.0.0.0
         |
         |--broadcast DISCOVER-->|
                                 | (recibe el broadcast)
                                 | agrega campo giaddr = 192.168.1.1
                                 |--unicast DISCOVER-->  10.0.0.1
                                                              |
                                 |<--unicast OFFER -----     |
         |<--broadcast OFFER ----|
```

- El relay recibe el broadcast, le agrega el campo `giaddr` (gateway IP address = su propia IP en esa subred) y lo reenvía como unicast al servidor DHCP.
- El servidor sabe en qué subred está el cliente por el `giaddr` y ofrece una IP del pool correspondiente.
- Configuración en router Cisco: `ip helper-address <IP del servidor DHCP>`

---

## DHCP en IPv6 — DHCPv6

En IPv6, DHCP funciona diferente porque existe **SLAAC (Stateless Address Autoconfiguration)**: los routers anuncian el prefijo de red via **Router Advertisement (RA)**, y los dispositivos generan su propia dirección combinando ese prefijo con su MAC (EUI-64) o un valor aleatorio.

**DHCPv6 se usa para:**
- Entregar información que SLAAC no puede (como servidores DNS — aunque RFC 8106 lo agrega a RA)
- Asignación con estado (stateful) cuando se necesita control centralizado
- Delegación de prefijos (DHCPv6-PD) — routers de borde reciben bloques de IPs para repartir

**Modos:**
- **Stateless DHCPv6**: solo entrega opciones (DNS, NTP), la IP la genera SLAAC
- **Stateful DHCPv6**: entrega IP + opciones, como DHCPv4

---

## Tabla resumen DHCP

| Concepto | Detalle |
|---|---|
| Protocolo de transporte | UDP |
| Puerto cliente | 68 |
| Puerto servidor | 67 |
| Proceso de asignación | DORA (Discover → Offer → Request → Ack) |
| Renovación T1 | 50% del lease, unicast al servidor |
| Renovación T2 | 87.5% del lease, broadcast |
| Broadcast no cruza routers | Se resuelve con DHCP Relay Agent |
| IPv6 | DHCPv6 + SLAAC |

---

---

# PARTE 2 — DNS (Domain Name System)

## Analogía: la agenda telefónica distribuida

Querés llamar a "pizzeria-de-la-esquina.com". No sabés su número. Lo que hacés:

1. Le preguntás a tu **contacto de confianza** (resolver local / DNS recursivo de tu ISP).
2. Ese contacto no lo sabe, pero sabe a quién preguntarle.
3. Pregunta al **directorio central del mundo** (root server): "¿quién sabe de `.com`?".
4. El directorio le dice "preguntale a fulano" (servidor TLD de `.com`).
5. Le pregunta a fulano: "¿quién sabe de `pizzeria-de-la-esquina.com`?".
6. Fulano dice "preguntale a mengano" (servidor autoritativo del dominio).
7. Mengano tiene la respuesta: "el número es 93.184.216.34".
8. Tu contacto de confianza te dice el número **y lo anota en su agenda** por si alguien más lo pide pronto (caché).

La próxima vez que alguien pregunta por el mismo número, tu contacto ya lo sabe sin tener que hacer todo el recorrido.

---

## La jerarquía DNS

```
                        . (root)
                       / \
                    .com  .ar  .org  .net  .edu ...  (TLD)
                    /
             google.com
             amazon.com
             /
      mail.google.com
      www.google.com
      api.google.com
```

### Los actores

| Actor | Rol | Ejemplo |
|---|---|---|
| **Root servers** | Conocen los servidores de cada TLD | 13 grupos (a.root-servers.net … m.root-servers.net) |
| **TLD servers** | Conocen los nameservers de cada dominio bajo ese TLD | Verisign maneja `.com` |
| **Authoritative nameserver** | Tiene la respuesta final para un dominio | ns1.google.com para google.com |
| **Recursive resolver** | Hace todo el trabajo por el cliente | DNS del ISP, 8.8.8.8 (Google), 1.1.1.1 (Cloudflare) |
| **Stub resolver** | El cliente (tu PC) — solo pregunta, no itera | Sistema operativo |

> Los 13 root servers no son 13 máquinas — son 13 **direcciones IP anycast** detrás de las cuales hay cientos de servidores físicos en todo el mundo.

---

## Resolución DNS paso a paso — resolución iterativa

```
[Tu PC]         [Resolver]        [Root]       [TLD .com]     [Autoritativo]
   |                |                |               |                |
   |--¿www.google.com?->             |               |                |
   |                |--¿www.google.com?->            |                |
   |                |                |<--preguntale a .com TLD        |
   |                |--¿www.google.com?---------->   |                |
   |                |                |   <--preguntale a ns1.google.com
   |                |--¿www.google.com?-------------------------->    |
   |                |                |               |    <-- 142.250.80.4
   |<-- 142.250.80.4-|
   |    (+ TTL)      |  (guarda en caché)
```

**Resolución iterativa**: el resolver le pregunta a cada servidor, que le responde "no sé, pero preguntale a tal". El resolver hace el trabajo.

**Resolución recursiva**: el servidor al que le preguntás hace todo el trabajo él solo y te da la respuesta final. Los root servers no lo soportan (sería demasiada carga).

---

## Tipos de registros DNS

### A y AAAA — Dirección IP

```
www.google.com.    300    IN    A       142.250.80.4
www.google.com.    300    IN    AAAA    2607:f8b0:4004:c08::6a
```
- **A**: mapea nombre → IPv4
- **AAAA** (quad-A): mapea nombre → IPv6

### CNAME — Alias

```
blog.empresa.com.    3600    IN    CNAME    empresa.com.
```
- El nombre es un alias de otro nombre (no de una IP directamente)
- El resolver sigue resolviendo hasta encontrar un registro A/AAAA
- **No se puede usar CNAME en el apex del dominio** (ej: `empresa.com.` no puede ser CNAME)

### MX — Mail Exchange

```
empresa.com.    3600    IN    MX    10    mail1.empresa.com.
empresa.com.    3600    IN    MX    20    mail2.empresa.com.
```
- Indica a qué servidor SMTP enviar el correo de ese dominio
- El número es la **prioridad** (menor = preferido)

### NS — Name Server

```
empresa.com.    86400    IN    NS    ns1.empresa.com.
empresa.com.    86400    IN    NS    ns2.empresa.com.
```
- Indica qué servidores son autoritativos para ese dominio
- Son los que tienen la verdad final

### SOA — Start of Authority

```
empresa.com.    86400    IN    SOA    ns1.empresa.com. admin.empresa.com. (
                                        2026041401   ; serial
                                        3600         ; refresh
                                        900          ; retry
                                        604800       ; expire
                                        300 )        ; minimum TTL
```
- Hay **uno por zona**
- Contiene: servidor primario, email del admin, número de serie (para detectar cambios), tiempos de sincronización entre servidores

### PTR — Reverse DNS

```
4.80.250.142.in-addr.arpa.    300    IN    PTR    www.google.com.
```
- Mapea IP → nombre (resolución inversa)
- Se usa para verificar identidad, logs, antispam
- La IP se escribe **al revés** en el dominio `in-addr.arpa`

### TXT — Texto libre

```
empresa.com.    3600    IN    TXT    "v=spf1 include:_spf.google.com ~all"
```
- Texto arbitrario, usado para:
  - **SPF** (autorización de servidores de correo)
  - **DKIM** (firma de correo)
  - **DMARC** (política de autenticación de correo)
  - Verificación de propiedad de dominio (Google, AWS, etc.)

### SRV — Service

```
_http._tcp.empresa.com.    3600    IN    SRV    10    5    80    www.empresa.com.
```
- Indica la ubicación de un servicio específico
- Campos: prioridad, peso, puerto, host destino

---

## TTL y Caché

El **TTL (Time To Live)** es el tiempo en segundos que un resolver puede guardar en caché esa respuesta antes de volver a consultarla.

```
www.google.com.    300    IN    A    142.250.80.4
                   ^^^
                   TTL = 300 segundos = 5 minutos
```

**Implicaciones:**
- TTL alto (ej: 86400 = 1 día): menos carga en el servidor, pero los cambios tardan en propagarse
- TTL bajo (ej: 60 = 1 min): cambios rápidos, pero más consultas al servidor autoritativo

**Propagación de DNS:** cuando cambiás un registro, los resolvers que ya lo tienen en caché siguen usando el valor viejo hasta que venza el TTL. Por eso se dice que "un cambio de DNS tarda hasta 24/48hs en propagarse".

---

## Zonas y transferencia de zona

Una **zona DNS** es una porción del árbol de nombres que administra un servidor autoritativo.

- **Servidor primario**: tiene la copia de escritura de la zona
- **Servidor secundario**: tiene copias de solo lectura, sincronizadas desde el primario

**Transferencia de zona (AXFR/IXFR):**
- **AXFR**: transferencia completa de toda la zona
- **IXFR**: transferencia incremental (solo los cambios desde el último serial del SOA)
- El secundario detecta cambios comparando el **número de serie del SOA**

---

## DNS recursivo vs. autoritativo

| | Recursivo (resolver) | Autoritativo |
|---|---|---|
| Función | Busca la respuesta por vos | Tiene la respuesta final |
| Tiene caché | Sí | No (o limitada) |
| Conoce toda la zona | No | Sí |
| Ejemplos | 8.8.8.8, 1.1.1.1, DNS del ISP | ns1.google.com, Route 53 |

---

## DNS moderno — seguridad y privacidad

### DNSSEC (DNS Security Extensions)
- Las respuestas DNS pueden ser falsificadas (cache poisoning / ataque Kaminsky)
- DNSSEC firma criptográficamente las respuestas con claves públicas/privadas
- El resolver puede verificar que la respuesta viene del servidor correcto y no fue alterada
- Usa registros adicionales: **RRSIG** (firma), **DNSKEY** (clave pública), **DS** (hash de la clave del hijo), **NSEC/NSEC3** (prueba de inexistencia)

### DNS over HTTPS (DoH) — RFC 8484
- Las consultas DNS viajan dentro de HTTPS (puerto 443)
- El ISP o actores en el camino no pueden ver qué dominios consultás
- Usado por browsers (Firefox, Chrome) y sistemas operativos modernos

### DNS over TLS (DoT) — RFC 7858
- Las consultas DNS viajan encriptadas con TLS (puerto 853)
- Similar a DoH pero en capa de transporte, más fácil de filtrar/controlar por la red

### DNS sobre QUIC (DoQ) — RFC 9250
- DNS encriptado usando QUIC como transporte (más nuevo, menor latencia)

---

## Casos especiales importantes

### Split DNS (DNS dividido)
- La empresa tiene un dominio interno y uno externo con el mismo nombre
- Desde adentro: `vpn.empresa.com` → IP privada
- Desde afuera: `vpn.empresa.com` → IP pública
- Se implementa con vistas (views) en el servidor DNS

### DNS negativo (NXDOMAIN)
- Si un dominio no existe, el servidor responde **NXDOMAIN** (Non-Existent Domain)
- Esta respuesta también se cachea, con el TTL del registro SOA (campo minimum)

### Glue records
- Si el nameserver de `empresa.com` es `ns1.empresa.com`, hay una dependencia circular
- ¿Cómo resolvés `ns1.empresa.com` sin saber el servidor de `empresa.com`?
- Solución: el TLD guarda un **glue record** (registro A del nameserver junto con la delegación NS)

---

## Flujo completo integrado: DHCP + DNS

```
PC se conecta a la red
        |
        v
[1] DHCP DORA
    → Obtiene: IP, máscara, gateway, servidor DNS

        |
        v
[2] Usuario escribe "www.google.com" en el navegador

        |
        v
[3] Stub resolver del OS consulta al servidor DNS
    (el que le dio DHCP en el paso 1)

        |
        v
[4] Resolver hace resolución iterativa:
    Root → TLD → Autoritativo → respuesta

        |
        v
[5] OS recibe la IP → navegador abre conexión TCP al servidor
```

---

## Resumen de puertos y protocolos

| Protocolo | Puerto | Transporte |
|---|---|---|
| DNS clásico | 53 | UDP (consultas normales) / TCP (respuestas grandes, transferencias de zona) |
| DoT | 853 | TCP + TLS |
| DoH | 443 | TCP + TLS (HTTP/2) |
| DoQ | 853 | QUIC |
| DHCP cliente | 68 | UDP |
| DHCP servidor | 67 | UDP |
| DHCPv6 cliente | 546 | UDP |
| DHCPv6 servidor | 547 | UDP |

---

## Preguntas típicas de parcial

**¿Por qué DHCP usa broadcast y no unicast al inicio?**
Porque el cliente no conoce la IP del servidor DHCP, ni tiene IP propia todavía. Broadcast es el único mecanismo disponible.

**¿Por qué el DHCPREQUEST (paso 3) también es broadcast si el cliente ya sabe la IP del servidor?**
Para informar a todos los servidores DHCP de la red cuál oferta fue aceptada, de modo que los demás liberen sus reservas.

**¿Qué pasa si vencen T1 y T2 y el cliente no renueva?**
El cliente pierde la IP y debe iniciar DORA desde cero. Mientras tanto no tiene conectividad de red (pierde la IP configurada).

**¿Cuántos root servers hay?**
13 direcciones IP (de a.root-servers.net a m.root-servers.net), pero detrás de cada una hay cientos de servidores físicos usando anycast.

**¿Un CNAME puede apuntar a otro CNAME?**
Sí, pero genera una cadena de resoluciones. No recomendado por performance. El resolver sigue la cadena hasta encontrar un A/AAAA.

**¿Qué es un registro SOA y para qué sirve el número de serie?**
El SOA es el registro de autoridad de la zona. El número de serie se incrementa cada vez que hay cambios. Los servidores secundarios lo comparan con el suyo para saber si necesitan transferir la zona.

**¿Diferencia entre resolución iterativa y recursiva?**
- Iterativa: el resolver pregunta a cada servidor, que responde con una referencia al siguiente. El resolver hace el trabajo.
- Recursiva: el servidor hace todo el trabajo y devuelve la respuesta final. Los root servers no lo aceptan para no sobrecargarse.

**¿Qué problema resuelve DNSSEC?**
El envenenamiento de caché (cache poisoning): un atacante no puede inyectar respuestas falsas porque las respuestas están firmadas criptográficamente.

---

## Fuentes y estándares relevantes

- RFC 2131 — DHCP para IPv4
- RFC 3315 — DHCPv6
- RFC 1034 / 1035 — DNS (especificación original)
- RFC 4034 — DNSSEC
- RFC 7858 — DNS over TLS
- RFC 8484 — DNS over HTTPS
- RFC 9250 — DNS over QUIC

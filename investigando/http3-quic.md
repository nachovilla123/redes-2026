# HTTP/3 y QUIC — Por qué reinventaron TCP en capa de aplicación

---

## El problema: TCP tiene un defecto de diseño para la web moderna

TCP fue diseñado en 1974. Funciona muy bien para transferir un archivo de corrido, pero la web moderna no es eso — es decenas de recursos pequeños (HTML, CSS, JS, imágenes, APIs) pedidos casi al mismo tiempo.

### El problema central: Head-of-Line Blocking en TCP

TCP garantiza que los bytes lleguen **en orden**. Si el paquete número 5 se pierde en el camino, TCP para todo y espera que se reenvíe, aunque los paquetes 6, 7, 8 ya llegaron.

```
Paquetes enviados:  [1][2][3][4][X][6][7][8]
                                  ^
                              se perdió

TCP: "no entrego nada hasta que llegue el 5"
     [1][2][3][4] ... esperando ... [5][6][7][8]
```

En HTTP/2, metieron múltiples streams (requests) dentro de **una sola conexión TCP**. Parecía buena idea — pero si se pierde un paquete TCP, **todos los streams se frenan**, aunque pertenezcan a requests completamente independientes.

```
HTTP/2 sobre TCP:

Stream A (imagen):  [A1][A2][A3][ X ][A5]  ← paquete perdido
Stream B (JSON):    [B1][B2][B3][B4][B5]   ← no tiene nada que ver

TCP bloquea TODO hasta recuperar el paquete de Stream A,
aunque Stream B ya tiene todos sus datos.
```

Esto se llama **TCP Head-of-Line Blocking** y es inherente al diseño de TCP — no se puede arreglar sin cambiar TCP.

### El otro problema: la latencia del handshake

Cada conexión TCP nueva necesita 1 round-trip (SYN/SYN-ACK/ACK) antes de poder enviar datos.
Si encima es HTTPS, el TLS handshake agrega otro round-trip.

```
TCP:   cliente → SYN → servidor → SYN-ACK → cliente → ACK        (1 RTT)
TLS:   cliente → ClientHello → servidor → ... → Finished          (1 RTT más)
HTTP:  recién acá se manda la primera request                      (1 RTT más)

Total: 3 RTTs antes de ver el primer byte de respuesta
```

En una red con 50ms de latencia, eso son 150ms solo para empezar.

---

## La solución de Google: inventar QUIC (2012–2018)

Google tenía el problema encima — Chrome haciendo miles de millones de requests por día. En 2012 empezaron a experimentar con un protocolo nuevo llamado **QUIC** (Quick UDP Internet Connections), corriendo sobre **UDP**.

La idea: si TCP no se puede cambiar (está en el kernel del OS, en millones de routers y firewalls), **hagamos TCP mejor pero en capa de aplicación**, donde podemos actualizarlo como si fuera software normal.

En 2021 la IETF estandarizó QUIC (RFC 9000) y HTTP/3 (RFC 9114).

---

## ¿Por qué UDP como base?

UDP no garantiza nada: no hay orden, no hay retransmisión, no hay control de flujo. Es solo "tirá este paquete y rezá".

Eso es **exactamente lo que querían**: una base mínima sobre la cual construir su propia confiabilidad, diseñada específicamente para los problemas de la web moderna.

```
TCP (kernel del OS):
  confiabilidad + orden + control de flujo + congestión
  [no se puede modificar sin actualizar millones de sistemas]

QUIC (capa de aplicación, sobre UDP):
  confiabilidad + orden POR STREAM + control de flujo + congestión + TLS integrado
  [se actualiza como cualquier librería de software]
```

---

## Qué hace QUIC que TCP no puede

### 1. Streams independientes sin head-of-line blocking

QUIC tiene el concepto de **streams** nativo. Cada stream es una secuencia ordenada de bytes independiente. Si se pierde un paquete de un stream, **solo ese stream espera** — los demás siguen.

```
QUIC sobre UDP:

Stream A (imagen):  [A1][A2][A3][ X ][A5]  ← paquete perdido, Stream A espera
Stream B (JSON):    [B1][B2][B3][B4][B5]   ← sigue llegando sin problema

TCP hubiera frenado todo. QUIC no.
```

### 2. TLS 1.3 integrado — no es opcional

En TCP+TLS, son dos protocolos separados que se apilan. En QUIC, TLS 1.3 está **dentro del protocolo**. El handshake de conexión y el handshake de seguridad ocurren al mismo tiempo.

```
TCP + TLS:
  [TCP handshake: 1 RTT] + [TLS handshake: 1 RTT] = 2 RTTs antes de datos

QUIC:
  [QUIC+TLS handshake combinado: 1 RTT] = 1 RTT antes de datos
```

### 3. 0-RTT en reconexiones

Si el cliente ya habló con ese servidor antes, QUIC puede enviar datos **en el primer paquete**, sin esperar ningún round-trip.

```
Primera conexión:  1 RTT para handshake
Reconexión:        0 RTT — datos en el primer paquete
```

Esto es posible porque QUIC guarda un "session ticket" de la conexión anterior con las claves negociadas.

### 4. Connection migration

En TCP, una conexión se identifica por `(IP origen, puerto origen, IP destino, puerto destino)`. Si tu IP cambia (pasás de WiFi a 4G en el celular), la conexión muere.

En QUIC, cada conexión tiene un **Connection ID** propio. Si tu IP cambia, la conexión sobrevive porque el servidor te reconoce por el ID, no por la IP.

```
TCP:  WiFi → 4G = conexión muerta, hay que reconectar
QUIC: WiFi → 4G = misma conexión, sigue sin interrumpción
```

---

## Cómo se relacionan HTTP/3, QUIC y UDP

```
HTTP/3      ← define el formato de mensajes (igual concepto que HTTP/1.1 y HTTP/2)
   │
QUIC        ← transporte confiable, multiplexado, encriptado
   │
UDP         ← solo "tirá este datagrama a esta IP:puerto"
   │
IP          ← routing
   │
Ethernet    ← físico
```

HTTP/3 no es tan diferente de HTTP/2 en su semántica — los métodos, headers y status codes son los mismos. La diferencia está en el transporte.

---

## Por qué cuesta tanto adoptar QUIC

### Problema 1: los firewalls bloquean UDP
Muchas redes corporativas y firewalls bloquean todo UDP excepto DNS (puerto 53). QUIC usa UDP 443, y muchos routers viejos lo descartan.

Los browsers tienen fallback: si QUIC falla, vuelven a HTTP/2 sobre TCP automáticamente.

### Problema 2: el procesamiento de UDP es menos eficiente en kernels viejos
TCP tiene décadas de optimizaciones en el kernel. UDP genérico, no. QUIC implementado en userspace no aprovecha esas optimizaciones, lo que puede consumir más CPU.

### Problema 3: los middleboxes
Routers, proxies y equipos de red intermedios asumen TCP. Algunos modifican o inspeccionan paquetes TCP de maneras que rompen QUIC.

---

## Estado de adopción en 2026

- **Google** (Search, YouTube, Gmail): HTTP/3 desde 2020
- **Meta** (Facebook, Instagram): QUIC propio desde 2017
- **Cloudflare**: HTTP/3 habilitado por defecto en todos los dominios
- **Chrome, Firefox, Safari**: soporte completo
- **~30% del tráfico web** ya usa HTTP/3

---

## Resumen comparativo

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Año | 1997 | 2015 | 2022 |
| Transporte | TCP | TCP | QUIC (UDP) |
| Multiplexing | No (1 req/conn) | Sí, pero con HOL blocking | Sí, sin HOL blocking |
| TLS | Opcional (HTTPS) | Opcional (en práctica obligatorio) | Obligatorio, integrado |
| Handshake | 2 RTTs (TCP+TLS) | 2 RTTs (TCP+TLS) | 1 RTT (o 0-RTT) |
| Connection migration | No | No | Sí |
| Headers | Texto plano | Comprimidos (HPACK) | Comprimidos (QPACK) |

---

## Pregunta de parcial

**¿Por qué QUIC corre sobre UDP si necesita confiabilidad?**
Porque TCP está en el kernel del OS y no se puede modificar sin actualizar millones de sistemas. Al correr sobre UDP, QUIC implementa su propia confiabilidad en capa de aplicación, donde puede ser actualizado como software normal. Esto le permite diseñar streams independientes que evitan el head-of-line blocking que TCP no puede resolver.

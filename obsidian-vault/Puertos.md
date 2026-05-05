---
tags: [capa-4, tcp, udp]
---

# Puertos

Números de 16 bits (0–65535) que identifican **servicios** dentro de una máquina. Una IP identifica la máquina; el puerto identifica el programa que debe atender el mensaje.

Una conexión [[TCP]] o [[UDP]] se identifica por 4 valores: IP origen, puerto origen, IP destino, puerto destino.

## Categorías

| Rango | Tipo | Quién los usa |
|---|---|---|
| 0 – 1023 | Conocidos (well-known) | Servidores estándar (asignados por IANA) |
| 1024 – 49151 | Registrados | Aplicaciones registradas ante IANA |
| 49152 – 65535 | Efímeros / privados | Clientes (asignados dinámicamente por el SO) |

## Puertos conocidos comunes

| Puerto | Protocolo | Servicio |
|---|---|---|
| 20/21 | TCP | FTP |
| 22 | TCP | SSH |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | [[DNS]] |
| 67/68 | UDP | [[DHCP]] |
| 80 | TCP | [[HTTP]] |
| 443 | TCP | HTTPS / [[TLS]] |

## Ejemplo

Cuando escribís `https://google.com`, tu browser conecta a `IP_de_Google:443`. Tu SO elige un puerto efímero (ej: 52341) para identificar esa sesión. La conversación queda identificada como `tu_IP:52341 ↔ google_IP:443`.

## Relacionado
- [[TCP]] — usa puertos para conexiones orientadas a conexión
- [[UDP]] — también usa puertos pero sin conexión
- [[DNS]] — puerto 53
- [[DHCP]] — puertos 67/68
- [[HTTP]] — puerto 80/443

# Simuladores interactivos de redes

Hub de simuladores en HTML/JS puro para entender visualmente los temas del libro de analogías. Cada archivo es independiente — abrilo en el navegador y experimentá.

## Cómo usarlo

Abrí `index.html` en cualquier navegador moderno (Chrome, Firefox, Safari). No requiere servidor ni dependencias.

```bash
open index.html       # macOS
xdg-open index.html   # Linux
```

## Simuladores disponibles

Cada simulador arranca con una sección de **documentación** explicando el concepto, y un botón **▶ Ver animación** que despliega la parte interactiva.

### Fundamentos

| Cap. | Tema | Archivo |
|---|---|---|
| 01 | Modelo de comunicaciones | `01-modelo-comunicaciones.html` |
| 02 | Tipos de redes (LAN/MAN/WAN/GAN) | `02-tipos-redes.html` |
| 03 | Conmutación: circuitos vs paquetes | `03-conmutacion.html` |
| 04 | Protocolos (sintaxis, semántica, temporización) | `04-protocolos.html` |
| 05 | Arquitectura en capas y PDUs | `05-arquitectura-capas.html` |

### Modelos OSI y TCP/IP

| Cap. | Tema | Archivo |
|---|---|---|
| 06 | Modelo OSI — encapsulamiento de las 7 capas | `06-osi.html` |
| 07 | TCP/IP — handshake, TCP vs UDP, puertos | `07-tcp-ip.html` |

### Direccionamiento y switching

| Cap. | Tema | Archivo |
|---|---|---|
| 09 | Switch y VLANs (802.1Q) | `09-vlan.html` |
| 10 | IP, subredes y CIDR | `10-subredes.html` |
| 11 | NAT / PAT | `11-nat.html` |

### Transporte y routing

| Cap. | Tema | Archivo |
|---|---|---|
| 15 | ARQ y ventanas deslizantes | `15-arq.html` |
| 16 | Routing — tablas, RIP/OSPF/BGP | `16-routing.html` |
| 17 | Fragmentación IPv4 | `17-fragmentacion.html` |

### Servicios

| Tema | Archivo |
|---|---|
| DNS y DHCP — DORA + resolución recursiva | `dns-dhcp.html` |

## Estructura

Cada simulador es un archivo HTML único con todo su CSS y JS embebido — sin build, sin dependencias, sin frameworks. Pesan entre 11–20 KB cada uno.

# Simuladores interactivos de redes

Hub de simuladores en HTML/JS puro para entender visualmente los temas del libro de analogías. Cada archivo es independiente — abrilo en el navegador y experimentá.

## Cómo usarlo

Abrí `index.html` en cualquier navegador moderno (Chrome, Firefox, Safari). No requiere servidor ni dependencias.

```bash
open index.html       # macOS
xdg-open index.html   # Linux
```

## Simuladores disponibles

| Cap. | Tema | Archivo | Qué se puede hacer |
|---|---|---|---|
| 06 | Modelo OSI | `06-osi.html` | Ver el encapsulamiento de las 7 capas en modo enviar y recibir |
| 07 | TCP/IP | `07-tcp-ip.html` | 3-way handshake animado, comparativa TCP vs UDP con pérdida, puertos |
| 09 | Switch y VLANs | `09-vlan.html` | Asignar VLANs, mandar broadcasts, ver tag 802.1Q en el trunk |
| 10 | Subredes / CIDR | `10-subredes.html` | Calculadora visual de bits, máscara, broadcast |
| 11 | NAT / PAT | `11-nat.html` | Tabla NAT en vivo traduciendo conexiones salientes |
| 15 | ARQ / ventanas | `15-arq.html` | Stop-and-Wait vs Go-Back-N vs Selective Repeat con pérdidas |
| 16 | Routing | `16-routing.html` | Tablas de rutas por router, trazado de rutas, comparativa RIP/OSPF/BGP |
| 17 | Fragmentación IPv4 | `17-fragmentacion.html` | Cálculo de ID, MF, Fragment Offset según MTU |
| —  | DNS y DHCP | `dns-dhcp.html` | DORA del DHCP + resolución DNS recursiva paso a paso |

## Estructura

Cada simulador es un archivo HTML único con todo su CSS y JS embebido — sin build, sin dependencias, sin frameworks. Pesan entre 11–20 KB cada uno.

---
tags: [capa-2, wifi]
---

# WiFi — IEEE 802.11

Estándar de red inalámbrica de la capa de enlace. Usa el aire como medio compartido, lo que introduce problemas que el cable no tiene.

## Por qué el aire es problemático

Las ondas de radio se expanden en todas direcciones. Cualquiera en rango puede recibir tu señal. Dos nodos pueden no verse entre sí pero compartir el mismo [[Access Point]] → [[Nodo Oculto]].

## Mecanismo de acceso al medio

Usa [[CSMA-CA]] (no puede usar [[CSMA-CD]] porque es [[Half-Duplex vs Full-Duplex|half-duplex]]).
Para el nodo oculto: [[RTS-CTS]] + [[NAV]].

## Bandas y normas

| Norma | Banda | Velocidad máx |
|---|---|---|
| 802.11b | 2.4 GHz | 11 Mbps |
| 802.11g | 2.4 GHz | 54 Mbps |
| 802.11a | 5 GHz | 54 Mbps |
| 802.11n | 2.4/5 GHz | 600 Mbps (MIMO) |
| 802.11ac | 5 GHz | varios Gbps (MU-MIMO) |
| 802.11ax (WiFi 6) | 2.4/5/6 GHz | ~9.6 Gbps |

## Modos de coordinación

- **DCF** (Distributed Coordination Function): distribuido, con contención, usa CSMA/CA. Para datos best-effort.
- **PCF** (Point Coordination Function): centralizado, el AP hace polling. Sin contención, latencia determinista. Para tiempo real.

## Trama 802.11 — 4 direcciones MAC

A diferencia de Ethernet (2 MACs), 802.11 tiene hasta 4:
- Address 1: receptor inmediato
- Address 2: transmisor inmediato
- Address 3: destino final o fuente original
- Address 4: solo en modo WDS (bridge entre APs)

## Relacionado
- [[CSMA-CA]] — mecanismo de acceso al medio
- [[RTS-CTS]] — extensión para nodo oculto
- [[Access Point]] — infraestructura central de WiFi
- [[Nodo Oculto]] — problema específico de WiFi
- [[Half-Duplex vs Full-Duplex]] — por qué WiFi es half-duplex

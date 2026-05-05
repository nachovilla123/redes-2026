---
tags: [arquitectura, fundamentos]
---

# Modelo TCP/IP (DARPA)

El modelo práctico que usa Internet. Tiene 4 capas, a diferencia del [[Modelo OSI]] que tiene 7.

## Las 4 capas

| Capa | Nombre | Protocolos |
|---|---|---|
| 4 | Aplicación | [[HTTP]], [[DNS]], [[DHCP]], FTP |
| 3 | Transporte | [[TCP]], [[UDP]] |
| 2 | Internet (Red) | [[IP]], [[ICMP]], [[ARP]] |
| 1 | Acceso a la red | [[Ethernet]], [[WiFi 802.11]] |

## Encapsulamiento

Cada capa agrega su cabecera al dato que baja de arriba:

```
Aplicación → datos
Transporte → [TCP/UDP header | datos]
Red        → [IP header | TCP/UDP header | datos]
Enlace     → [MAC header | IP header | TCP/UDP | datos | FCS]
```

## Lo que cambia en cada salto

- Las **MACs** cambian en cada salto (capa enlace)
- Las **IPs** no cambian en todo el camino (salvo [[NAT]])
- Los **puertos** solo los lee el destino final

## Relacionado
- [[TCP]] — protocolo confiable de transporte
- [[UDP]] — protocolo rápido sin garantías
- [[IP]] — direccionamiento y ruteo
- [[Modelo OSI]] — modelo teórico de 7 capas

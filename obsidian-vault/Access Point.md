---
tags: [wifi, capa-2]
---

# Access Point (AP)

Dispositivo que hace de puente entre el mundo [[WiFi 802.11]] y el mundo cableado ([[Ethernet]]). Conecta dispositivos inalámbricos a una red LAN.

## Función

```
Laptop  ──radio──> [AP] ──cable──> Router ──> Internet
Celular ──radio──> [AP]
```

Administra:
- El canal inalámbrico (quién puede transmitir, cuándo)
- Seguridad (WPA2/AES, ocultar SSID)
- DHCP (puede distribuir IPs si está en modo router)

## Modos de operación

| Modo | Función |
|---|---|
| **Bridge (Capa 2)** | Conecta segmentos de la misma red IP. Todos los dispositivos quedan en la misma red. |
| **Router (Capa 3)** | Conecta redes IP distintas. El puerto WAN va a una red diferente. |

## Rol en RTS/CTS

El AP es el intermediario que emite el **CTS** en broadcast, permitiendo que nodos que no se ven entre sí ([[Nodo Oculto]]) se coordinen. Ver [[RTS-CTS]].

## Relacionado
- [[WiFi 802.11]] — estándar que define cómo opera el AP
- [[CSMA-CA]] — mecanismo de acceso al medio en WiFi
- [[RTS-CTS]] — cómo el AP coordina el canal
- [[Nodo Oculto]] — problema que el AP ayuda a resolver
- [[Ethernet]] — red cableada a la que el AP se conecta

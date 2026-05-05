---
tags: [capa-2, ethernet, wifi, fundamentos]
---

# Colisión

Evento físico que ocurre cuando dos dispositivos transmiten señales en el mismo medio al mismo tiempo. Las señales se superponen y el resultado es ruido incomprensible para el receptor.

## Qué es y qué no es

**Es** una colisión: dos PCs en la misma red WiFi transmiten al mismo tiempo → sus ondas de radio se superponen en el [[Access Point]].

**No es** una colisión: una PC pide Instagram y otra pide Facebook. Eso es tráfico normal — cada paquete tiene su propia IP destino y el router los encamina sin problema.

## Analogía

Dos personas hablando al mismo tiempo en la misma habitación. No importa de qué habla cada una — el que escucha no entiende ninguna de las dos.

## Dónde ocurren

| Medio | ¿Colisiones? | Mecanismo |
|---|---|---|
| Hub Ethernet | Sí | [[CSMA-CD]] para detectarlas |
| Switch Ethernet | No | Cada puerto es un dominio de colisión separado |
| [[WiFi 802.11]] | Posibles | [[CSMA-CA]] para evitarlas |

## Relacionado
- [[CSMA-CD]] — detección de colisiones en Ethernet
- [[CSMA-CA]] — evitar colisiones en WiFi
- [[Nodo Oculto]] — colisión que CSMA/CA no puede evitar
- [[Switch]] — elimina colisiones en Ethernet
- [[Hub]] — donde las colisiones sí ocurren

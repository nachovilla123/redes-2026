---
tags: [capa-2, fundamentos]
---

# Half-Duplex vs Full-Duplex

## Half-Duplex

Solo se puede enviar **o** recibir en un momento dado, no ambos simultáneamente.

Ejemplos:
- [[WiFi 802.11]] — una antena no puede transmitir y recibir en la misma frecuencia al mismo tiempo
- Ethernet con [[Hub]] — todos comparten el mismo medio

## Full-Duplex

Se puede enviar **y** recibir al mismo tiempo.

Ejemplos:
- Ethernet con [[Switch]] — cada dispositivo tiene su cable dedicado con pares separados para TX y RX
- [[TCP]] — la conexión es full-duplex (por eso el cierre necesita [[Cierre de conexión TCP|4 segmentos]])

## Por qué WiFi es half-duplex

Una antena no puede transmitir y recibir en la misma frecuencia simultáneamente. Al transmitir, tu propia señal es millones de veces más fuerte que cualquier señal entrante. Para full-duplex se necesitarían dos antenas en frecuencias distintas con aislamiento de señal (MIMO full-duplex — existe pero es experimental).

## Impacto en colisiones

Half-duplex → medio compartido → posibles [[Colisión|colisiones]] → necesitás [[CSMA-CD]] o [[CSMA-CA]].

Full-duplex con switch → sin medio compartido → sin colisiones → sin CSMA/CD necesario.

## Relacionado
- [[WiFi 802.11]] — half-duplex por limitación de hardware
- [[Switch]] — permite full-duplex en Ethernet
- [[CSMA-CD]] — necesario en half-duplex Ethernet
- [[CSMA-CA]] — necesario en half-duplex WiFi
- [[Cierre de conexión TCP]] — TCP es full-duplex, por eso 4 segmentos

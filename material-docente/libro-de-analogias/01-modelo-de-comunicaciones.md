# Capítulo 01 — El Modelo de Comunicaciones

> **Pregunta clave:** ¿Qué pasa desde que alguien genera información hasta que otra persona la recibe?

---

## La analogía: enviar una carta al exterior

Imaginate que querés mandarle una carta a un amigo en Japón.

1. Vos escribís la carta — **(Fuente)**: generás los datos
2. La llevás a Correo Argentino, que la mete en un sobre, le pone franqueo, la codifica para el sistema postal — **(Transmisor)**: convierte los datos en algo que puede viajar
3. Viaja en avión, barco, camiones — **(Sistema de Transmisión)**: el camino físico
4. Correo japonés la recibe, la saca del sobre, la lleva a la puerta de tu amigo — **(Receptor)**: la convierte de vuelta en algo legible
5. Tu amigo la lee — **(Destino)**: consume los datos

Eso es exactamente el **Modelo de Comunicaciones**. Siempre hay estos cinco componentes.

---

## Aplicado a redes

Cuando mandás un mensaje por WhatsApp:

| Componente | WhatsApp |
|---|---|
| Fuente | Vos escribiendo el texto |
| Transmisor | Tu teléfono convirtiendo el texto en señales WiFi o datos móviles |
| Sistema de transmisión | Cables, antenas, routers entre vos y el destinatario |
| Receptor | El teléfono del otro convirtiendo señales de vuelta a texto |
| Destino | Tu amigo leyendo el mensaje |

---

## Las tareas que pasan en el camino

La carta no solo "viaja". Correo Argentino hace un montón de cosas que ni notás:

- Le pone un **número de seguimiento** → **Direccionamiento** (¿a dónde va exactamente?)
- Verifica que la dirección exista → **Detección de errores**
- La agrupa con otras cartas que van al mismo destino → **Ruteo**
- Detecta si llegó mojada o rota → **Control de errores**
- Avisa si el destino no existe → **Gestión de la red**

En redes pasa exactamente lo mismo, solo que automatizado y a millones de mensajes por segundo.

---

## Para recordar

> El modelo de comunicaciones es universal. Aplica a una llamada telefónica, un email, un stream de Netflix, un mensaje de WhatsApp o una señal de radio. Siempre hay una fuente, algo que transmite, un camino, algo que recibe, y un destino.

---

*Siguiente capítulo → [02 - Tipos de Redes](02-tipos-de-redes.md)*

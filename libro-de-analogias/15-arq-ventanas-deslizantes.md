# Capítulo 15 — ARQ y Ventanas Deslizantes

> **Pregunta clave:** ¿Cómo manda datos una red eficientemente sin perder nada, sabiendo que algunos paquetes pueden llegar tarde o nunca?

---

## El problema: mandar y esperar es lento

El ARQ básico (capítulo 08) funciona así: mandás un paquete, esperás el ACK, recién entonces mandás el siguiente.

**Analogía:** Mandar cartas por correo y esperar la respuesta antes de escribir la siguiente. Si el correo tarda 5 días en cada sentido, escribís una carta por semana aunque podrías escribir 10.

Esto se llama **Stop-and-Wait** y es ineficiente. El canal está vacío la mayor parte del tiempo esperando ACKs.

### El concepto de ventana

La solución es mandar **varios paquetes antes de esperar confirmación**. La cantidad máxima de paquetes que podés tener "en vuelo" (enviados pero no confirmados) se llama **ventana**.

**Analogía:** En lugar de mandar una carta y esperar respuesta, mandás 5 cartas seguidas. Cuando llegue la respuesta de la primera, mandás la sexta, etc. La "ventana" es cuántas cartas podés tener sin respuesta al mismo tiempo.

La ventana **se desliza** a medida que llegan los ACKs — por eso el nombre **ventana deslizante**.

---

## Go-Back-N (Vuelta-a-N)

### Cómo funciona

- El transmisor puede mandar hasta **N paquetes** sin esperar ACK
- Si uno de ellos tiene error o se pierde → el receptor **descarta todos los siguientes** y pide reenvío desde el paquete con error
- El transmisor **vuelve al paquete problemático y reenvía todo desde ahí** (de ahí el nombre "vuelve a N")

### Analogía: la cinta transportadora

Imaginá una cinta transportadora en una fábrica. Los paquetes van saliendo uno a uno. El inspector al final revisa cada uno en orden.

- Si el paquete 3 está dañado, el inspector para la cinta, tira los paquetes 3, 4 y 5 (aunque 4 y 5 estaban bien), y pide que los manden de nuevo desde el 3.
- El transmisor retrocede y vuelve a mandar 3, 4, 5.

### Ventaja y desventaja

- **Ventaja:** el receptor es simple, solo necesita guardar el orden
- **Desventaja:** desperdicio — se reenvían paquetes que llegaron bien

---

## Selective Repeat (Repetición Selectiva)

### Cómo funciona

- El transmisor puede mandar hasta **N paquetes** sin esperar ACK (igual que Go-Back-N)
- Si uno tiene error → el receptor lo descarta **pero guarda los siguientes** aunque hayan llegado después
- El transmisor solo reenvía **el paquete específico que falló**, no los siguientes
- Cuando llega el paquete faltante, el receptor reordena todo y entrega la secuencia completa

### Analogía: el rompecabezas

Pediste un rompecabezas de 100 piezas enviado en 10 sobres. El sobre 3 se perdió. En vez de tirar los sobres 4 al 10 (que llegaron bien), los guardás. Pedís solo que te reenvíen el sobre 3. Cuando llega, armás el rompecabezas completo.

### Ventaja y desventaja

- **Ventaja:** mucho más eficiente, no reenvía lo que ya llegó bien
- **Desventaja:** el receptor necesita más memoria y lógica para guardar y reordenar paquetes

---

## Comparación directa

| | Stop-and-Wait | Go-Back-N | Selective Repeat |
|---|---|---|---|
| Paquetes en vuelo | 1 | Hasta N | Hasta N |
| Si hay error | Reenvía 1 | Reenvía desde el error | Reenvía solo el fallido |
| Complejidad receptor | Mínima | Baja | Alta (necesita buffer) |
| Eficiencia | Muy baja | Media | Alta |

---

## ¿Dónde se usa en la práctica?

**TCP** usa un mecanismo similar a Selective Repeat. El receptor puede confirmar paquetes fuera de orden con **SACK (Selective ACK)** y el transmisor solo reenvía lo que falta.

**En capas bajas (enlace de datos):** Go-Back-N es más común porque el receptor es más simple y los errores de capa 2 son menos frecuentes.

---

## El número de secuencia y el tamaño de la ventana

Para que funcione, cada paquete lleva un **número de secuencia**. Hay un límite: si los números de secuencia son de N bits, hay 2^N valores posibles.

- **Go-Back-N**: la ventana puede ser de hasta **2^N − 1** paquetes (se reserva un valor para evitar confusión entre ventanas)
- **Selective Repeat**: la ventana puede ser de hasta **2^(N−1)** paquetes (se reserva la mitad para evitar confusión entre ventanas nuevas y reenvíos)

---

## Resumen para el parcial

- **Stop-and-Wait**: manda 1, espera ACK. Simple pero ineficiente.
- **Go-Back-N**: manda varios, si hay error retrocede y reenvía todo desde ahí. Receptor simple.
- **Selective Repeat**: manda varios, si hay error reenvía solo ese. Receptor complejo pero más eficiente.
- TCP usa un mecanismo tipo Selective Repeat con SACK.
- La ventana deslizante se mueve a medida que llegan los ACKs.

---

*Capítulo anterior → [14 - WiFi](14-wifi-ieee80211.md)*
*Siguiente capítulo → [16 - Routing y Encaminamiento](16-routing-encaminamiento.md)*

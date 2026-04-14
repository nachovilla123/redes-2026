# Capítulo 03 — Conmutación de Circuitos vs Conmutación de Paquetes

> **Pregunta clave:** ¿Cómo viajan los datos por una red grande? ¿Hay dos formas distintas?

---

## La analogía central: reservar mesa vs pedir delivery

### Conmutación de Circuitos = Reservar una mesa en un restaurante

Llamás al restaurante, reservás una mesa para las 9pm. A las 9 llegás y la mesa es tuya por 2 horas. Nadie más puede sentarse ahí aunque vos estés esperando el postre y la mesa esté vacía 15 minutos.

El mozo está asignado a vos toda la noche. Si no pedís nada durante 10 minutos, él igual está parado esperándote.

**Traducido a redes:**
- Antes de hablar, se establece un **camino dedicado** entre vos y el destino
- Ese camino es **tuyo exclusivamente** durante toda la comunicación
- Aunque no estés enviando datos (silencio en una llamada), el canal sigue reservado para vos
- Cuando terminás, el camino se libera

**Ejemplo técnico:** La red telefónica clásica (PSTN). Cuando llamabas de Buenos Aires a Córdoba, se encadenaban cables físicos desde vos hasta el otro. Ese "tubo" era solo tuyo durante la llamada.

**Ventaja:** calidad garantizada, sin interrupciones, sin variación en el tiempo de llegada.
**Desventaja:** desperdicio enorme. Si en una llamada de 10 minutos hacés silencio 3 minutos, esos 3 minutos de capacidad de red se desperdician.

---

### Conmutación de Paquetes = Pedir delivery por Rappi

Querés pedir sushi, pizza y helado. Los tres vienen de lugares distintos:
- El sushi sale primero pero el repartidor toma una ruta larga → llega tercero
- La pizza sale segunda y el repartidor va directo → llega primera
- El helado llega segundo

Cuando llegaron los tres, armás la cena. No importó el orden de llegada, el resultado final está completo.

**Traducido a redes:**
- Los datos se dividen en **paquetes pequeños**
- Cada paquete viaja de forma **independiente**, por el camino que tenga disponible
- Pueden llegar en **distinto orden** y por **distintas rutas**
- El receptor los **reensambla** en el orden correcto usando los números de secuencia

**Ejemplo técnico:** Internet funciona 100% así. Cuando bajás un video de YouTube, no viene en un stream continuo reservado solo para vos. Viene en miles de paquetes que comparten la red con los paquetes de millones de otras personas.

**Ventaja:** uso eficiente de la red. Cuando no mandás datos, el canal lo usa otro.
**Desventaja:** el tiempo de llegada puede variar (jitter), y si hay mucho tráfico puede haber demoras.

---

## Comparación directa

| | Circuitos | Paquetes |
|---|---|---|
| Camino | Dedicado y reservado | Compartido y dinámico |
| Recursos | Reservados siempre | Usados solo cuando hay datos |
| Orden de llegada | Garantizado | Puede variar |
| Calidad | Garantizada | Variable |
| Eficiencia | Baja (desperdicio en silencio) | Alta |
| Ejemplo real | Llamada telefónica clásica | Internet, WhatsApp, Netflix |

---

## ¿Por qué ganó la conmutación de paquetes?

Porque internet tiene miles de millones de usuarios. Si cada uno reservara un circuito cada vez que quiere ver un video, la red colapsa. Con paquetes, la misma infraestructura puede servir a millones al mismo tiempo, porque en cualquier instante la mayoría no está enviando datos activamente.

---

*Capítulo anterior → [02 - Tipos de Redes](02-tipos-de-redes.md)*
*Siguiente capítulo → [04 - Protocolos](04-protocolos.md)*

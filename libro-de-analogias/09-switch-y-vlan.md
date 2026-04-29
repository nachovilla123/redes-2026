# Capítulo 09 — Switch y VLAN

> **Pregunta clave:** ¿Qué es un switch, cómo aprende dónde está cada dispositivo, y qué son las VLANs?

---

## Hub vs Switch: megáfono vs teléfono interno

### Hub (el viejo) = Megáfono en una oficina

El gerente quiere decirle algo a Juan. Agarra el megáfono y grita. Todos en la oficina lo escuchan: María, Pedro, Ana, Carlos y Juan. Solo Juan le responde, pero **todos se enteraron** de la conversación. Si dos personas agarran el megáfono al mismo tiempo, los mensajes se mezclan → **colisión**.

Con un Hub, todos los dispositivos conectados **comparten el mismo medio**. Cualquier dato que envía una computadora lo reciben todas las demás. Si dos mandan al mismo tiempo, colisionan y ambos mensajes se corrompen. Todos forman un único **dominio de colisión**.

### Switch (el moderno) = Teléfono interno

Querés hablarle a Juan. Marcás el interno de Juan. Solo Juan escucha. El resto sigue trabajando sin enterarse. No hay posibilidad de colisión porque cada "línea" es independiente.

Con un Switch, **cada puerto es un dominio de colisión separado**. Los datos van solo al destino correcto. El resto no los ve. La red es mucho más eficiente.

---

## La Tabla CAM: la agenda del switch

¿Cómo sabe el switch a qué puerto mandar cada trama? Lo **aprende**.

### El proceso de aprendizaje

1. La computadora A (conectada al puerto 1) manda una trama con destino B
2. El switch recibe la trama por el puerto 1 y ve que el origen es A → anota: **"A está en el puerto 1"**
3. No sabe dónde está B → manda la trama por **todos los puertos activos** (menos por donde llegó) — esto se llama **flooding**
4. B responde por el puerto 3 → el switch anota: **"B está en el puerto 3"**
5. La próxima vez que alguien quiera hablarle a B, el switch manda directo al puerto 3

**Analogía:** El portero de un edificio que va aprendiendo a qué piso va cada persona. El primer día no sabe nada y lleva a todos al ascensor para que se anuncien solos. Con el tiempo aprende: "la señora de anteojos va al 5°, el joven con mochila va al 2°". Después los manda directo sin preguntar.

### La tabla CAM en la práctica

La tabla tiene una entrada por cada dirección MAC conocida:

```
Dirección MAC         Puerto
00:1A:2B:3C:4D:5E     1
AA:BB:CC:DD:EE:FF     3
11:22:33:44:55:66     2
```

**Tiempo de vida:** las entradas se borran después de unos minutos de inactividad (típicamente 5 minutos). Si una computadora se mueve de puerto, la tabla se actualiza sola cuando vuelve a transmitir.

### Broadcast: el único que va a todos

Cuando llega una trama con destino **FF:FF:FF:FF:FF:FF** (broadcast), el switch **siempre** la manda por todos los puertos. No hay forma de evitarlo en la misma red. (Para eso están las VLANs, que veremos enseguida.)

---

## Tipos de switch según cómo procesan

| Modo | Cómo funciona | Ventaja | Desventaja |
|---|---|---|---|
| **Store and Forward** | Recibe la trama completa, verifica CRC, luego envía | No reenvía tramas con errores | Un poco más lento |
| **Cut-Through** | Lee solo la MAC destino y ya empieza a enviar | Muy rápido | Puede reenviar tramas corruptas |
| **Fragment Free** | Lee los primeros 64 bytes (zona donde ocurren colisiones) y envía | Equilibrio entre los dos | — |

**Analogía para Store and Forward:** Leer la carta completa antes de reenviarla para asegurarte de que llegó legible.
**Analogía para Cut-Through:** Ver solo el destinatario del sobre y ya tirarlo al cajón, sin abrirlo.

---

## VLAN: la red dentro de la red

### El problema sin VLANs

Una empresa tiene 3 departamentos: Contabilidad, RRHH y Sistemas. Todos conectados al mismo switch. En esta red:
- El broadcast de Contabilidad lo recibe toda la empresa
- RRHH puede ver el tráfico de Contabilidad (problema de seguridad)
- Si hay un problema en un departamento, afecta a todos

### La solución: VLAN

Una **VLAN (Virtual LAN)** divide un switch físico en múltiples redes lógicas separadas. Aunque todos estén en el mismo hardware, cada VLAN es un mundo aparte: los broadcasts no se cruzan, el tráfico está aislado.

**Analogía perfecta:** Un edificio de oficinas de planta abierta con mamparas virtuales. El edificio es el mismo, el switch es el mismo, pero las "salas" están lógicamente separadas. Alguien en Contabilidad no puede ver ni escuchar lo que pasa en RRHH.

### Formas de asignar VLANs

**Por puerto** (la más común):
```
Puertos 1-4  →  VLAN 10 (Contabilidad)
Puertos 5-8  →  VLAN 20 (RRHH)
Puertos 9-12 →  VLAN 30 (Sistemas)
```
Cualquier dispositivo que conectes al puerto 5 automáticamente queda en la VLAN 20.

**Por dirección MAC:**
La VLAN se asigna según la MAC del dispositivo. Si la computadora de Juan (MAC `AA:BB:CC`) siempre va a la VLAN 10, va a esa VLAN sin importar a qué puerto la conectes.

**Por dirección IP:**
La VLAN se asigna según la IP. Más flexible pero más complejo de gestionar.

**Por protocolo:**
Todo el tráfico IP va a una VLAN, todo el tráfico IPX va a otra. Útil en entornos mixtos.

---

## Trunk: el corredor entre edificios

Si tenés dos switches y querés que la VLAN 10 exista en ambos (por ejemplo, Contabilidad está en dos pisos distintos), necesitás un **enlace troncal (trunk)**.

Un trunk es un cable que **transporta múltiples VLANs al mismo tiempo**, con cada trama etiquetada para indicar a qué VLAN pertenece.

**Protocolo IEEE 802.1Q:** agrega 4 bytes extra a cada trama Ethernet con:
- **VLAN ID**: número de VLAN (0 a 4095)
- **Prioridad**: para calidad de servicio
- **CFI**: formato de la dirección MAC

**Analogía:** En lugar de tener un pasillo separado para cada departamento entre los dos edificios, hay un único corredor ancho (trunk) por donde van personas de todos los departamentos. Cada persona lleva un badge de color (la etiqueta 802.1Q) que indica a qué departamento pertenece.

---

## STP: evitar que los paquetes circulen para siempre

Si conectás tres switches en triángulo (para tener redundancia), los broadcasts empiezan a circular en bucle: van del switch A al B, del B al C, del C al A, y así hasta el infinito. La red colapsa.

**El Spanning Tree Protocol (STP)** detecta estos bucles y **bloquea estratégicamente** algunos enlaces, dejando solo un árbol sin ciclos. Si cae el enlace activo, STP reactiva el bloqueado automáticamente.

**Analogía:** Un agente de tránsito en una rotonda con tres entradas. Cierra una entrada para evitar que los autos den vueltas infinitas. Si la ruta principal se corta, abre la entrada que estaba cerrada.

---

## Características avanzadas del switch

**Storm Control:** Si un dispositivo infectado empieza a mandar broadcast masivo (tormenta de broadcast), el switch detecta la velocidad anormal y descarta el exceso, protegiendo la red.

**Port Security:** El switch solo acepta MACs autorizadas en cada puerto. Si conectás un dispositivo no autorizado, el puerto se bloquea automáticamente. Útil para evitar que alguien conecte un dispositivo desconocido.

**Port Mirroring:** Copiás todo el tráfico de un puerto a otro puerto "espejo" donde tenés un analizador de red. Permite monitorear tráfico sin interrumpir la operación. Como tener una cámara oculta en la conversación.

**PoE (Power over Ethernet):** El cable de red lleva datos Y corriente eléctrica al mismo tiempo. Sirve para alimentar cámaras IP, teléfonos VoIP y access points WiFi sin necesitar un tomacorriente cerca.

---

*Capítulo anterior → [08 - Control de Flujo y Errores](08-control-flujo-y-errores.md)*
*Siguiente capítulo → [10 - Direccionamiento IP](10-direccionamiento-ip.md)*

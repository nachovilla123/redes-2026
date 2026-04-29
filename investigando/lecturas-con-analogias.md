# Lecturas de Redes de Información — Con Analogías de la Vida Real

> Lecturas pensadas para arrancar de cero. Cada tema tiene una analogía central que lo explica, y luego el concepto técnico. Leelas en orden: cada una construye sobre la anterior.

---

## Lectura 1 — El Modelo de Comunicaciones: ¿Cómo se manda un mensaje?

### La analogía: enviar una carta al exterior

Imaginate que querés mandarle una carta a un amigo en Japón.

Vos escribís la carta **(Fuente)** → se la das a correo Argentino que la mete en un sobre y la clasifica **(Transmisor)** → viaja en avión, barco, camiones **(Sistema de Transmisión)** → llega a correo japonés que la saca del sobre y la lleva a la puerta **(Receptor)** → tu amigo la lee **(Destino)**.

Eso es exactamente el **Modelo de Comunicaciones**. Siempre hay:
- Alguien que genera información
- Alguien/algo que la convierte en algo que puede viajar
- Un camino por donde viaja
- Alguien que la recibe y la convierte de vuelta
- El destinatario final

### Aplicado a redes

Cuando mandás un mensaje por WhatsApp:
- Tu teléfono genera el texto **(Fuente)**
- Lo convierte en señales eléctricas o WiFi **(Transmisor)**
- Viaja por cables, antenas, routers **(Sistema de Transmisión)**
- El teléfono del otro lo convierte de señal a texto **(Receptor)**
- Tu amigo lee el mensaje **(Destino)**

### Las tareas que pasan en el camino

La carta no solo "viaja". Correo argentino hace muchas cosas: le pone un número de seguimiento, verifica que la dirección exista, la agrupa con otras cartas que van al mismo destino, detecta si llegó rota. En redes pasa lo mismo: **direccionamiento** (¿a dónde va?), **detección de errores** (¿llegó bien?), **control de flujo** (¿no te mando demasiado rápido?), **seguridad** (¿quién puede leerla?).

---

## Lectura 2 — Tipos de Redes: LAN, MAN, WAN, GAN

### La analogía: los sistemas de transporte por distancia

Pensá en los sistemas de transporte según el alcance:

| Sistema | Analogía | Red |
|---|---|---|
| Pasillo de tu casa | Hablar a gritos con alguien en la cocina | **LAN** |
| Colectivo de la ciudad | Moverse por Buenos Aires | **MAN** |
| Avión o tren de larga distancia | Viajar entre provincias o países | **WAN** |
| Sistema de transporte global | Combinar todos los anteriores para ir de Argentina a Japón | **GAN / Internet** |

### LAN — Red de Área Local

Es la red de tu casa, tu oficina, tu facultad. Todo en el mismo edificio o campus.

**Ejemplo real:** Cuando tu compu y la Smart TV están en la misma red WiFi de tu casa, forman una LAN. Son tuyas, son rápidas, nadie de afuera puede entrar.

Característica clave: velocidades altas (porque las distancias son cortas) y la misma organización es dueña de todo.

### MAN — Red de Área Metropolitana

Una ciudad entera. Por ejemplo, la red de cámaras de tráfico de Buenos Aires, o el sistema de internet de una empresa que tiene sucursales en distintos barrios.

**Ejemplo real:** Cablevision/Fibertel conecta miles de hogares en Buenos Aires en una MAN. Ellos son los dueños de los cables por las calles.

### WAN — Red de Área Amplia

Conecta ciudades, provincias, países. No es de una sola organización: usa cables de otras empresas, satélites, fibra óptica submarina.

**Ejemplo real:** Cuando accedés a Google (servidores en Estados Unidos), tu paquete atraviesa una WAN. Viaja por cables de fibra óptica que cruzan el Atlántico.

Dos formas de funcionar:
- **Conmutación de circuitos**: reservás el camino completo antes de hablar (como una llamada telefónica clásica — el canal es tuyo todo el tiempo)
- **Conmutación de paquetes**: mandás datos en sobrecitos (paquetes) que van cada uno por donde pueden, como si mandaras 10 cartas y cada una fuera por rutas distintas pero al final llegaran todas

### GAN — Red de Área Global

Es internet (con minúscula): la red de redes. La **Internet** (con mayúscula) es UNA red global específica, la que todos usamos. Una "internet" puede ser cualquier conjunto de redes interconectadas.

---

## Lectura 3 — Conmutación de Circuitos vs Conmutación de Paquetes

### La analogía: reservar una mesa vs pedir delivery

**Conmutación de circuitos = Reservar una mesa en un restaurante exclusivo**

Llamás, reservás, y la mesa es tuya por 2 horas. Nadie más la puede usar aunque vos estés esperando el postre y la mesa esté vacía 10 minutos. El mozo está asignado a vos todo ese tiempo.

Ventaja: garantía de que el recurso está disponible.
Desventaja: desperdicio cuando no lo usás.

**Ejemplo técnico:** La red telefónica clásica. Cuando llamabas, se establecía un circuito físico dedicado entre vos y la otra persona. Mientras hablabas (o hacías silencio), ese camino era solo tuyo.

---

**Conmutación de paquetes = Pedir delivery por Rappi**

Dividís tu pedido en ítems (paquetes). Cada ítem puede venir en un bolso diferente, por un camino diferente, en orden diferente. Al final todo llega y lo armás en tu mesa.

Ventaja: la "ruta" (el repartidor) es compartida por todos, se usa eficientemente.
Desventaja: si hay mucho tráfico, puede llegar tarde o en desorden.

**Ejemplo técnico:** Internet funciona así. Cuando bajás una película, no viene en un flujo continuo reservado solo para vos. Viene en miles de paquetes que viajan por distintos routers y se reensamblan en tu computadora.

---

## Lectura 4 — Protocolos: las reglas del juego

### La analogía: hablar por teléfono en otro idioma

Imaginate que llamás a alguien en China. Si no tienen un idioma en común, no se entienden nada aunque la llamada funcione perfectamente. Los **protocolos** son ese idioma común: reglas que ambos lados acordaron seguir.

Un protocolo define tres cosas:
- **Sintaxis**: la forma de los mensajes (el "formato" — como las reglas gramaticales de un idioma)
- **Semántica**: el significado de cada parte del mensaje (qué significa cada palabra)
- **Temporización**: cuándo habla cada uno (como los turnos en una conversación)

### Ejemplo de la vida real

Cuando dos personas se dan la mano al saludarse, siguen un protocolo:
1. Extendés la mano derecha
2. El otro la toma
3. Apretás con cierta fuerza
4. Sacudís 2-3 veces
5. Soltás

Si alguien te da la mano izquierda, o no suelta, o la sacude 20 veces, el protocolo se rompe. En redes pasa igual: si un protocolo dice "mandá el tamaño del mensaje primero y después el contenido", y vos mandás al revés, el receptor no entiende nada.

### Tipos de protocolos

**Asincrónico**: Como los mensajes de WhatsApp. Cada mensaje tiene una marca de inicio (notificación) y fin (leído). No importa cuándo lo mandaste, el otro lo procesa cuando puede.

**Sincrónico**: Como una videollamada. Ambos tienen que estar conectados al mismo tiempo, a la misma velocidad. Si uno va más lento que el otro, hay problemas.

### Características clave de los protocolos

- **Control de errores**: Como cuando Correo Argentino te avisa que el paquete se dañó. En redes se pide retransmisión automática.
- **Control de flujo**: Como cuando le decís a alguien "¡pará, que no te entiendo, hablás muy rápido!". La red le dice al transmisor que frene si el receptor no da abasto.
- **Fragmentación**: Como cortar un libro enorme en capítulos para mandarlo por partes. Los datos grandes se dividen en tramas pequeñas.
- **Secuenciamiento**: Numerás cada capítulo para poder reordenarlos cuando lleguen.

---

## Lectura 5 — Arquitectura de Protocolos en Capas: el modelo de la empresa de logística

### La analogía: enviar un paquete con FedEx

Cuando una empresa usa FedEx para mandar un paquete, hay capas de responsabilidad:

1. **Vos (el cliente/Aplicación)**: decidís qué mandar y ponés el contenido en una caja
2. **Empleado de FedEx (Transporte)**: se encarga de que llegue, tiene un número de seguimiento, garantiza la entrega
3. **Avión/Camión (Red/Acceso)**: se encarga de mover físicamente el paquete de A a B

Cada capa no sabe ni le importa qué hay dentro. FedEx no lee lo que mandás. El camión no sabe si es FedEx o DHL. La pista de aterrizaje no sabe si el avión lleva encomiendas o pasajeros. **Cada capa habla solo con su par en el otro extremo**.

### El modelo de 3 capas simplificado

```
Tu compu (X)                    Compu remota (Y)
┌─────────────────┐             ┌─────────────────┐
│   Aplicación    │ ←─ acuerdo ─→│   Aplicación    │
├─────────────────┤             ├─────────────────┤
│   Transporte    │ ←─ acuerdo ─→│   Transporte    │
├─────────────────┤             ├─────────────────┤
│ Acceso a la red │ ← cables → │ Acceso a la red │
└─────────────────┘             └─────────────────┘
```

- **Capa de Aplicación**: lo que el usuario ve y usa (email, web, transferencia de archivos)
- **Capa de Transporte**: garantiza que los datos lleguen correctamente, en orden, sin pérdidas
- **Capa de Acceso a la Red**: se encarga del movimiento físico por la red concreta (LAN, WAN, etc.)

### PDU — La caja con etiquetas

Cuando los datos pasan por cada capa, cada una les agrega una "etiqueta" (encabezamiento) con información necesaria para que su par en el otro lado entienda qué hacer.

**Analogía**: Es como las etiquetas apiladas en una caja de FedEx:
- La etiqueta más externa dice la dirección de envío **(capa de Red)**
- Adentro hay una etiqueta de seguimiento FedEx **(capa de Transporte)**
- Adentro está el contenido real con una nota del remitente **(capa de Aplicación)**

En el destino, se van sacando etiquetas de afuera hacia adentro.

---

## Lectura 6 — El Modelo OSI: el estándar de 7 capas

### La analogía: el proceso de mandar dinero al exterior por una entidad financiera

Hay 7 departamentos que intervienen:

| Capa | Nombre | Qué hace | Analogía del banco |
|---|---|---|---|
| 7 | Aplicación | Interfaz con el usuario | El cajero que te atiende |
| 6 | Presentación | Formato, compresión, encriptación | El que convierte los pesos a dólares |
| 5 | Sesión | Abre y cierra la "sesión" de comunicación | El que abre y cierra tu turno |
| 4 | Transporte | Entrega confiable, sin errores, en orden | El que garantiza que el dinero llega exacto |
| 3 | Red | Enrutamiento por nodos intermedios | El que decide qué banco intermediario usar |
| 2 | Enlace de datos | Transferencia confiable entre dos puntos directos | El mensajero entre bancos adyacentes |
| 1 | Física | Los cables, señales eléctricas | El auto del mensajero y las rutas físicas |

### Las capas más importantes en detalle

**Capa Física (1)**: Son los cables, las señales, los voltajes. No entiende nada de datos, solo mueve bits. Es el cable de red, el WiFi, la fibra óptica. Un repetidor trabaja solo en esta capa — amplifica la señal sin entender nada de lo que contiene.

**Enlace de Datos (2)**: Asegura que dos dispositivos *directamente conectados* puedan intercambiar datos sin errores. Aquí viven las **direcciones MAC**. Es como el contrato entre dos vecinos directos: "te mando esto y me avisás si llegó".

**Red (3)**: Se encarga de llevar datos a través de múltiples saltos (routers). Aquí viven las **direcciones IP**. No necesita saber la tecnología de las capas debajo (puede ser WiFi, cable, fibra — no importa).

**Transporte (4)**: El que garantiza que los datos lleguen completos, en orden y sin duplicados. Aquí viven los **puertos**. TCP es el protocolo estrella de esta capa.

**Aplicación (7)**: Lo que el usuario usa. HTTP (web), SMTP (email), FTP (archivos).

### ¿Por qué OSI si todos usan TCP/IP?

OSI es el "modelo teórico" — como el Código Civil: define cómo *deberían* funcionar las cosas. TCP/IP es lo que *realmente* se usa, como el derecho consuetudinario que la gente practica. OSI sirve para entender conceptos; TCP/IP sirve para conectarte a internet.

---

## Lectura 7 — TCP/IP: el modelo real de Internet

### La analogía: el sistema postal moderno vs el código postal ideal

El correo ideal (OSI) tiene 7 departamentos perfectamente separados. El correo real (TCP/IP) tiene 4-5 etapas que funcionan y que todos usan.

### Las capas de TCP/IP

```
┌──────────────────────────────────────┐
│         APLICACIÓN                   │  ← HTTP, FTP, SMTP, DNS
├──────────────────────────────────────┤
│         TRANSPORTE (TCP / UDP)       │  ← Ports, confiabilidad
├──────────────────────────────────────┤
│         INTERNET (IP)                │  ← Direcciones IP, ruteo
├──────────────────────────────────────┤
│         ACCESO A LA RED              │  ← Ethernet, WiFi, MAC
├──────────────────────────────────────┤
│         FÍSICA                       │  ← Cables, señales
└──────────────────────────────────────┘
```

### TCP vs UDP — ¿Con o sin acuse de recibo?

**TCP (con acuse de recibo) = Correo certificado**

Mandás la carta, y el cartero te vuelve a tu casa a decirte "llegó, te firmo el acuse". Si no recibís el acuse en X tiempo, el cartero va de vuelta. Garantiza que llegó todo, en orden, sin duplicados.

**Costo**: más lento por la ida y vuelta de confirmaciones.
**Cuándo usarlo**: cuando los datos no pueden faltar. Bajar un archivo, cargar una página web, mandar un email.

---

**UDP (sin acuse de recibo) = Folleto publicitario en el buzón**

Lo tirás y listo. No sabés si alguien lo leyó. No hay confirmación.

**Ventaja**: velocísimo.
**Cuándo usarlo**: cuando la velocidad importa más que la perfección. Videollamadas, streaming de video en vivo, juegos online. Si un frame de video llega tarde o se pierde, preferís saltarlo que esperar — el usuario lo nota menos que un pausón.

### Puertos — Las puertas del edificio

La dirección IP identifica el edificio (la computadora). El **puerto** identifica el departamento (la aplicación).

- IP: `192.168.1.10` → es el edificio
- Puerto 80: la puerta del departamento web (HTTP)
- Puerto 443: la puerta del departamento web seguro (HTTPS)
- Puerto 25: la puerta del correo (SMTP)

Cuando abrís Chrome y Netflix al mismo tiempo, ambos usan la misma IP pero puertos diferentes. El sistema operativo sabe a cuál app mandarle cada paquete por el número de puerto.

### La encapsulación — Las muñecas rusas

Cuando mandás datos por internet, cada capa envuelve los datos en una capa más:

```
[Datos de usuario]
  → TCP agrega cabecera: [TCP header | Datos]        ← Segmento
    → IP agrega cabecera: [IP header | TCP | Datos]  ← Datagrama
      → Ethernet: [MAC header | IP | TCP | Datos]    ← Trama (Frame)
```

En el destino se van "desenvolviendo" de afuera hacia adentro, como abrir muñecas rusas.

---

## Lectura 8 — Control de Flujo y Control de Errores

### Control de Flujo: el que habla rápido y el que escribe lento

Imaginá que le dictás una carta a alguien que escribe a mano. Si hablás demasiado rápido, el otro no puede seguirte y se pierde información.

El **control de flujo** es exactamente eso: el receptor le dice al transmisor "pará un poco, no puedo procesar tan rápido". Previene que el buffer (el cuaderno del que escribe) se llene y pierda datos.

**Ejemplo real**: Cuando descargás un archivo muy grande y tu conexión es lenta, el servidor reduce la velocidad de envío porque tu dispositivo le está avisando "tengo el buffer casi lleno".

### Control de Errores: los datos corruptos

Imaginate que mandás por WhatsApp "Nos vemos a las 7" y por ruido en la red llega "Nos vemos a las 1". El mensaje cambió en el camino.

**Detección de errores**: Hay formas matemáticas de saber si los datos cambiaron:

**Paridad** (el método simple): Antes de mandar 8 bits, contás cuántos "1" hay y agregás un bit extra para que la cantidad total de "1" sea siempre par. Si en el destino la cantidad es impar, saben que algo cambió.

**CRC (Cyclic Redundancy Check)** (el método moderno): Es una operación matemática más sofisticada. El transmisor calcula un número a partir de los datos y lo manda al final. El receptor hace el mismo cálculo: si no da lo mismo, hubo un error.

**Corrección de errores**: Una vez detectado el error, se puede:
- Pedir retransmisión automática (**ARQ - Automatic Repeat reQuest**)
- Enviar un ACK (acknowledgement = "recibí bien") o NACK ("recibí mal, mandalo de nuevo")

### Fragmentación: el libro por entregas

Un archivo de 10 GB no puede viajar junto. Se corta en miles de trozos pequeños (tramas). Ventajas:
- Si un trozo tiene error, solo retransmitís ese trozo, no el archivo entero
- El receptor puede detectar errores más rápido (no espera a recibir el archivo completo)
- Ningún dispositivo ocupa el canal por demasiado tiempo

---

## Lectura 9 — Switch y VLAN: el tráfico inteligente

### La analogía: Hub = megáfono. Switch = susurro dirigido.

**Hub (el viejo)** = Megáfono en una oficina

Cuando alguien quiere hablarle a Juan, grita con el megáfono. Todos lo escuchan: María, Pedro, Ana y Juan. Solo Juan responde, pero todos se enteraron. Todos "colisionan" en el mismo espacio de sonido.

**Switch (el moderno)** = Sistema de teléfonos internos

Cuando querés hablarle a Juan, marcás su interno. Solo Juan escucha. El resto sigue con su trabajo. No hay colisión.

### La Tabla CAM: la agenda del switch

El switch aprende quién está en cada puerto "escuchando" de dónde vienen los mensajes. Si le llega una trama de la computadora A por el puerto 1, anota: "A está en puerto 1".

**Analogía**: es como el portero del edificio que va aprendiendo a qué piso va cada uno: "la señora de anteojos siempre sube al 5°". Después, cuando llega un paquete para ella, no pregunta a todos los pisos, va directo al 5°.

Si llega una trama para alguien que no conoce todavía, el switch la manda por **todos los puertos** menos por donde llegó (broadcast de descubrimiento). Es como gritar "¿alguien sabe dónde vive Juan?" en el edificio.

### Dominio de colisión vs Dominio de broadcast

**Dominio de colisión**: el grupo de dispositivos que pueden "chocar" entre sí. Con switch, **cada puerto es un dominio de colisión separado** — nadie choca con nadie.

**Dominio de broadcast**: el grupo de dispositivos que recibe cuando alguien grita "¡para todos!". El switch pasa los broadcast a todos. El router los detiene.

### Tipos de switch según cómo procesan

- **Store and Forward**: Lee la trama completa, verifica que no tenga errores, *después* la envía. Más seguro, un poco más lento. (Como leer una carta completa antes de reenviarla)
- **Cut-Through**: Lee solo la dirección destino y ya la empieza a enviar. Más rápido, puede reenviar tramas con errores. (Como ver el sobre y ya poner la carta en el cajón del destinatario)
- **Fragment Free**: Lee los primeros 64 bytes (donde ocurren la mayoría de los errores por colisión) y después envía. Equilibrio entre los dos. 

### VLAN: separar la red sin separar los cables

Imaginate una empresa con 3 departamentos: Contabilidad, RRHH y Sistemas. Todos conectados al mismo switch físico. Pero no querés que Contabilidad vea el tráfico de RRHH.

**Sin VLAN**: todos están en la misma red, todo el mundo puede ver el broadcast de todos.

**Con VLAN**: le decís al switch "los puertos 1-4 son VLAN 1 (Contabilidad), los puertos 5-8 son VLAN 2 (RRHH)". Ahora son redes lógicamente separadas aunque estén en el mismo switch físico.

**Analogía**: Es como dividir una oficina abierta con mamparas virtuales. El edificio es el mismo, el switch es el mismo, pero las "salas" son separadas.

Las VLANs se pueden crear por:
- **Puerto**: "los puertos 1, 2, 3 son VLAN 10"
- **Dirección MAC**: "este dispositivo específico siempre va a VLAN 20"
- **Dirección IP**: "los que tengan esta IP van a VLAN 30"

### Trunk: el corredor entre edificios

Si tenés dos switches y querés que la VLAN 10 exista en los dos, necesitás un enlace **trunk**: un cable especial que lleva **todas las VLANs etiquetadas**. El protocolo **IEEE 802.1Q** agrega una etiqueta a cada trama con el ID de VLAN, para que el switch del otro lado sepa a qué VLAN pertenece.

### STP: evitar los loops de tráfico

Si conectás tres switches en triángulo, los broadcasts circulan para siempre (un paquete rebota de switch en switch indefinidamente). El **Spanning Tree Protocol (STP)** detecta los loops y bloquea estratégicamente algunos enlaces, dejando solo un camino activo entre cualquier par de puntos.

**Analogía**: Es como el tráfico de una ciudad. Si hay un semáforo roto y dos rutas forman un círculo, los autos darían vueltas para siempre. STP actúa como un agente de tránsito que cierra una de las rutas para evitar el caos.

---

## Lectura 10 — Direcciones IP: el sistema postal de internet

### La analogía: dirección postal en dos partes

Una dirección postal tiene dos partes:
- **Calle y número** (la red): te dice el barrio/zona
- **Departamento** (el host): te dice quién exactamente dentro de esa zona

Una dirección IP funciona igual:
- **Prefijo (network)**: identifica la red
- **Sufijo (host)**: identifica el dispositivo dentro de esa red

### El formato IP

Una dirección IP v4 son 32 bits escritos como 4 números separados por puntos:
`192.168.1.100`

Cada número va de 0 a 255. Son 4 octetos (4 × 8 bits = 32 bits).

### Las clases de IP (el sistema antiguo)

| Clase | Rango | Para qué | Ejemplo |
|---|---|---|---|
| A | 1.x.x.x a 126.x.x.x | Redes enormes (16 millones de hosts) | Grandes corporaciones, ISPs |
| B | 128.x.x.x a 191.x.x.x | Redes medianas (65.000 hosts) | Universidades, empresas grandes |
| C | 192.x.x.x a 223.x.x.x | Redes pequeñas (254 hosts) | Empresas pequeñas, hogares |
| D | 224.x.x.x a 239.x.x.x | Multicast | Streaming de video a grupos |
| E | 240.x.x.x a 255.x.x.x | Experimental | Reservado |

### Subredes: dividir el barrio

Tenés una dirección Clase C: `200.10.10.0` — puede tener hasta 254 hosts. Pero vos tenés 3 departamentos que no deben "verse" entre sí. Querés dividirla en 3 subredes.

La **máscara de subred** es la herramienta. Te dice qué parte de la dirección es la red y qué parte es el host:
- `255.255.255.0` → los primeros 24 bits son red, los últimos 8 son host
- `255.255.255.192` → los primeros 26 bits son red, los últimos 6 son host

**Analogía**: Es como dividir un edificio de 100 departamentos en 4 pisos de 25 departamentos. El edificio sigue siendo el mismo, pero ahora tenés 4 zonas separadas con su propio acceso.

### CIDR: el sistema moderno

En lugar de `200.10.10.0` con máscara `255.255.255.0`, se escribe directamente: `200.10.10.0/24`

El `/24` significa "los primeros 24 bits son la red". Simple y compacto.

`192.168.1.0/26` significa que los primeros 26 bits son red → quedan 6 bits para hosts → 2⁶ = 64 direcciones posibles (62 usables, restando red y broadcast).

### Direcciones privadas: el barrio cerrado

Algunas IP nunca salen a internet. Son para uso interno:

| Rango | Para qué |
|---|---|
| `10.0.0.0/8` | Redes empresariales grandes |
| `172.16.0.0/12` | Redes empresariales medianas |
| `192.168.0.0/16` | Hogares y pequeñas empresas (tu router WiFi usa esto) |

Tu router de casa tiene una IP pública (la que ve internet) y distribuye IPs privadas `192.168.x.x` a tus dispositivos.

---

## Lectura 11 — NAT: el portero del edificio

### La analogía: una empresa con una sola línea telefónica

Una empresa tiene 50 empleados pero una sola línea telefónica pública. Cuando llaman desde afuera, la recepcionista atiende y transfiere. Cuando alguien de adentro llama, la recepcionista gestiona la llamada con el número externo. Nadie de afuera sabe cuántos empleados hay ni sus extensiones internas.

Eso es **NAT (Network Address Translation)**:

- Tu router tiene **1 IP pública** (la que ve internet)
- Tus dispositivos tienen **IPs privadas** (192.168.x.x)
- Cuando tu compu hace una solicitud a Google, el router cambia la dirección privada por la pública y anota en una tabla "esto fue de la compu A"
- Cuando Google responde, el router mira la tabla y manda la respuesta a la compu A

**PAT (Port Address Translation)**: Múltiples dispositivos usan la misma IP pública diferenciándose por el puerto. Tu compu usa el puerto 50000, tu celu el 50001. El router sabe a quién mandar cada respuesta.

### Ventajas y desventajas de NAT

Ventajas:
- Ahorra direcciones IP públicas (hay pocas disponibles)
- Seguridad: desde afuera no pueden iniciar conexiones directamente a tus dispositivos

Desventajas:
- Complica aplicaciones que necesitan saber la IP real (videollamadas, torrents, servidores)
- Agrega procesamiento en el router

---

## Lectura 12 — VPN: el túnel secreto

### La analogía: el tubo de vacío del banco

En algunas películas los bancos tienen un tubo de vacío para mandar documentos entre sucursales. Los documentos viajan dentro de un tubo sellado por la red pública de calles, pero nadie puede abrirlo ni ver qué hay adentro.

Una **VPN (Virtual Private Network)** hace lo mismo con datos:
- Tomás tus datos
- Los encriptás (nadie puede leerlos si los intercepta)
- Los enviás por internet (la "calle pública")
- Solo el receptor con la clave puede abrirlos

**Ejemplo real**: Un empleado trabajando desde casa necesita acceder a los sistemas internos de la empresa. Con VPN, su compu "parece" estar dentro de la red de la empresa, aunque físicamente esté en su departamento. Toda la comunicación va encriptada por internet.

Protocolos usados: **PPTP** y **L2TP** son los más comunes para crear estos túneles.

---

## Lectura 13 — ACL: el portero con lista

### La analogía: el portero de un boliche con lista VIP

En la puerta hay un portero con una lista. Las reglas son:
1. Si tu nombre está en la lista negra → no entrás (DENY)
2. Si tenés invitación VIP → entrás (PERMIT)
3. Si no estás en ninguna lista → depende de la política default

Eso es una **ACL (Access Control List)**: reglas en el router que deciden qué paquetes pasan y cuáles se bloquean.

Una ACL estándar tiene el formato:
```
access-list 5 deny 172.22.5.2 0.0.0.0    ← bloqueá esta IP específica
access-list 5 deny 172.22.5.3 0.0.0.0    ← bloqueá esta IP específica  
access-list 5 permit any                  ← dejá pasar el resto
```

### Wildcard: la máscara inversa

La **wildcard** es lo opuesto a la máscara de subred:
- `0` en un bit → ese bit **debe coincidir** exactamente
- `1` en un bit → ese bit **no importa** (ignoralo)

Ejemplo:
- IP: `172.16.10.0` con Wildcard `0.0.0.255`
- Significa: los primeros 3 octetos deben ser exactamente `172.16.10`, el último no importa
- Resultado: cualquier IP entre `172.16.10.0` y `172.16.10.255` coincide

**Analogía**: Es como decirle al portero "dejá entrar a cualquier persona cuyo apellido sea García, sin importar el nombre". El apellido debe coincidir exactamente, el nombre no importa.

---

## Resumen Final: el recorrido completo de un mensaje

Cuando escribís `google.com` en el navegador, esto pasa:

1. **Aplicación**: Chrome arma la solicitud HTTP
2. **Transporte (TCP)**: divide la solicitud, le asigna puerto 80 (destino) y un puerto aleatorio tuyo (origen), numera los fragmentos
3. **Internet (IP)**: agrega tu IP y la IP de Google, decide la ruta por los routers
4. **Acceso a la red**: convierte en trama Ethernet con direcciones MAC para el primer salto (tu router)
5. **Física**: convierte en señal WiFi/cable y sale por el aire o el cable

En cada router del camino, se "desenvuelve" hasta la capa IP, se decide hacia dónde mandar, y se "envuelve" de nuevo para el siguiente tramo.

En el servidor de Google, todo se desenvuelve hacia arriba hasta que el servidor web lee la solicitud y arma la respuesta, que recorre el camino inverso hasta tu pantalla.

---

*Lecturas generadas a partir del material docente de Redes de Información UTN-FRBA — Unidades 1 y 5.*

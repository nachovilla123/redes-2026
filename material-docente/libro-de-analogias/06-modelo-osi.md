# Capítulo 06 — El Modelo OSI: las 7 capas

> **Pregunta clave:** ¿Qué hace cada capa del modelo OSI y para qué sirve entenderlo?

---

## La analogía: mandar dinero al exterior por un banco

Cuando transferís dinero a otro país, hay 7 departamentos del banco que intervienen. Ninguno hace el trabajo del otro, y si uno falla, la cadena se rompe.

| Capa | Nombre | Trabajo en el banco | Trabajo en redes |
|---|---|---|---|
| 7 | Aplicación | El cajero que te atiende y entiende lo que pedís | Interfaz con el usuario (HTTP, email, FTP) |
| 6 | Presentación | El que convierte los pesos a dólares (formato) | Formato, compresión, encriptación de datos |
| 5 | Sesión | El que abre tu turno y lo cierra al final | Controla el diálogo: abre y cierra la sesión |
| 4 | Transporte | El que garantiza que el monto llegue exacto | Entrega confiable, en orden, sin pérdidas |
| 3 | Red | El que decide qué banco intermediario usar | Ruteo a través de múltiples nodos/routers |
| 2 | Enlace de datos | El mensajero entre dos bancos adyacentes | Transferencia confiable entre dos puntos directos |
| 1 | Física | El auto del mensajero y las rutas físicas | Cables, señales eléctricas, bits en el medio |

---

## Capa por capa en detalle

### Capa 1 — Física
Se ocupa de los **bits crudos**: voltajes, frecuencias, duraciones de señal. No sabe qué significan los bits, solo los mueve.

**Analogía:** El cable de red, el aire por donde viaja el WiFi, la fibra óptica. Es el "camino". Un **repetidor** trabaja solo en esta capa: amplifica la señal sin entender nada de lo que contiene.

**Lo que define:** voltajes, velocidades, tipos de conector, modulación de la señal.

---

### Capa 2 — Enlace de Datos
Se ocupa de que **dos dispositivos directamente conectados** intercambien datos sin errores. Detecta y corrige errores entre un punto y el siguiente.

Aquí viven las **direcciones MAC**: identificadores únicos de cada tarjeta de red, grabados en el hardware. Son como el número de serie de tu placa de red.

**Analogía:** El contrato entre dos vecinos que comparten una pared: "si te mando algo y no llegó bien, te lo mando de nuevo. Si llegó, me avisás".

**Dispositivos de esta capa:** Switch, Bridge (puente).

---

### Capa 3 — Red
Se ocupa de llevar datos **a través de múltiples saltos** (nodo a nodo) hasta el destino final. No necesita conocer la tecnología de abajo (no sabe ni le importa si es WiFi, cable o fibra).

Aquí viven las **direcciones IP**: identificadores lógicos asignados por software, que identifican una computadora en la red global.

**Analogía:** El GPS que te dice "girá a la derecha en 200m, luego tomá la autopista". No sabe en qué auto vas, solo conoce las rutas.

**Dispositivos de esta capa:** Router.

---

### Capa 4 — Transporte
Se ocupa de que **los datos lleguen completos, en orden, sin duplicados y sin pérdidas** entre los dos sistemas finales (origen y destino final, no los nodos del medio).

Aquí viven los **puertos** (TCP/IP) o SAPs (OSI).

**Analogía:** El servicio de mensajería certificada. Garantiza que el paquete llegó, que llegó completo, y que llegó al destinatario correcto. Si algo falla, lo vuelve a mandar.

Características que garantiza:
- Datos libres de errores
- Datos en secuencia correcta
- Sin pérdidas
- Sin duplicados
- Calidad de servicio (QoS)

---

### Capa 5 — Sesión
Controla el **diálogo entre aplicaciones**: quién habla primero, cómo se turnan, cómo se recupera la sesión si se cae la conexión.

**Analogía:** El protocolo de una reunión formal. Alguien abre la reunión, se definen los turnos para hablar, si alguien se desconecta se puede retomar desde donde estaba, y alguien cierra la reunión formalmente.

---

### Capa 6 — Presentación
Se ocupa del **formato de los datos**: los traduce a un formato que la aplicación entienda, independientemente del sistema operativo o hardware.

También hace **compresión** (para mandar menos datos) y **encriptación** (para que nadie pueda leerlos en el camino).

**Analogía:** El intérprete en una negociación internacional. Convierte el idioma del emisor al del receptor. También puede "hablar en código" si la negociación es confidencial.

---

### Capa 7 — Aplicación
La que **el usuario toca directamente**. Provee los servicios de red a las aplicaciones: email, transferencia de archivos, navegación web.

**Analogía:** El cajero del banco: es la única capa con la que el cliente interactúa directamente. Detrás hay 6 departamentos trabajando, pero el cliente solo ve al cajero.

Ejemplos: HTTP (web), SMTP (email), FTP (archivos), DNS (nombres de dominio).

---

## OSI vs TCP/IP: el modelo teórico vs el real

OSI se diseñó en los años 80 como el estándar universal. TCP/IP ya existía y funcionaba. Al final ganó TCP/IP porque ya estaba implementado y usándose masivamente.

**Analogía:** OSI es como el sistema métrico decimal: perfectamente diseñado, lógico, ideal. TCP/IP es como las medidas en pulgadas: no es el más elegante, pero ya lo usa todo el mundo y cambiarlo sería un caos.

OSI sirve hoy como **modelo conceptual** para entender y enseñar redes. TCP/IP es lo que realmente corre en internet.

---

## Para recordar: el mnemónico de las capas

De abajo hacia arriba (1 al 7):

**F**ísica → **E**nlace → **R**ed → **T**ransporte → **S**esión → **P**resentación → **A**plicación

**"Fui En el Router, Tomé Sopa Por Ahí"**

---

*Capítulo anterior → [05 - Arquitectura en Capas](05-arquitectura-en-capas.md)*
*Siguiente capítulo → [07 - TCP/IP](07-tcp-ip.md)*

# Capítulo 08 — Control de Flujo, Errores y Fragmentación

> **Pregunta clave:** ¿Cómo evita la red que los datos se pierdan, se corrompan o saturen al receptor?

---

## Control de Flujo: "pará que no llego"

### La analogía: dictar una carta a alguien que escribe a mano

Sos abogado y le dictás una carta a tu secretaria. Si hablás muy rápido, ella se pierde y empieza a saltear palabras. Necesitás adaptarte a su velocidad de escritura.

En redes pasa exactamente eso. El **transmisor** puede ser más rápido que el **receptor**. Si el transmisor satura el buffer (la memoria temporal) del receptor, los datos que no entran se descartan y se pierden.

**Control de flujo** = mecanismo por el cual el receptor le dice al transmisor "bajá la velocidad" o "podés mandar más".

**Ejemplo real:** Cuando descargás un archivo muy grande con una conexión lenta, el servidor de origen detecta que tu dispositivo no puede recibir tan rápido y reduce el ritmo de envío automáticamente. Sin control de flujo, los paquetes que no caben en tu buffer simplemente desaparecen y hay que reenviarlos, desperdiciando todo.

### Dos tiempos que importan

- **Tiempo de transmisión**: cuánto tarda en "emitir" todos los bits al medio (como cuánto tardás en hablar todas las palabras)
- **Tiempo de propagación**: cuánto tarda un bit en recorrer físicamente el cable de A a B (como el tiempo que tarda el sonido de tu voz en llegar al oído del otro)

Ambos suman al tiempo total. En conexiones largas (como un satélite), el tiempo de propagación puede ser enorme aunque la velocidad de transmisión sea alta.

---

## Detección de Errores: ¿llegó bien?

En el camino, los bits pueden corromperse. Una señal eléctrica puede verse afectada por interferencia, temperatura, distancia. Un `1` puede convertirse en `0` sin que nadie lo note... a menos que haya un mecanismo para detectarlo.

### Paridad: el método simple

Antes de mandar 8 bits, contás cuántos `1` hay. Agregás un bit extra (bit de paridad) para que el total de `1` sea siempre **par** (paridad par) o siempre **impar** (paridad impar).

**Ejemplo:**
- Datos: `1010110` → tiene cuatro `1` (par)
- Con paridad par, el bit de paridad es `0` → se manda `10101100`
- El receptor cuenta los `1`: si sale impar, sabe que algo cambió en el camino

**Limitación importante:** si exactamente 2 bits se corrompieron al mismo tiempo, la paridad sigue siendo "correcta" y el error no se detecta. Por eso la paridad simple solo sirve para errores aislados.

### CRC: el método moderno y confiable

**CRC (Cyclic Redundancy Check)** es mucho más robusto. Funciona así:

1. El transmisor toma el bloque de datos y hace una **operación matemática** (división modular) usando un número predefinido como divisor
2. El **resto** de esa división (unos pocos bits) se agrega al final de la trama
3. El receptor hace la misma operación con los datos recibidos (incluyendo el CRC)
4. Si el resultado es cero → no hubo errores. Si no es cero → algo cambió en el camino

**Analogía:** Es como un número de control en un código de barras. Si escaneás mal el código, el número de control no coincide y el sistema sabe que hay un error de lectura, sin necesidad de comparar con el original.

CRC detecta ráfagas de errores de hasta N bits (según el tamaño del CRC elegido). Es el método usado en Ethernet, WiFi, USB, y prácticamente toda comunicación digital moderna.

---

## Control de Errores: ¿qué hacemos si hay un error?

Detectar el error es solo el primer paso. Después hay que **hacer algo**:

### ARQ — Automatic Repeat reQuest (Pedido Automático de Repetición)

El mecanismo más común. Funciona así:

- El receptor envía un **ACK** (Acknowledgement = "recibí bien, podés mandar el siguiente")
- Si hay error, envía un **NACK** (Negative ACK = "recibí mal, mandalo de nuevo")
- Si el transmisor no recibe ningún ACK en un tiempo determinado (timeout), asume que se perdió y **reenvía automáticamente**

**Analogía:** Mandar un mensaje importante por WhatsApp y esperar el doble tilde azul. Si después de un rato sigue con un solo tilde, lo volvés a mandar.

---

## Fragmentación: el libro en capítulos

Un archivo de 2 GB no puede viajar junto. Hay límites físicos en cuánto puede cargar cada "camión" de la red (el **MTU** — Maximum Transmission Unit). En Ethernet, una trama puede llevar como máximo 1500 bytes de datos.

La solución es **fragmentar**: cortar los datos en trozos pequeños (tramas/paquetes) y mandarlos por separado.

**Ventajas:**

1. **Si hay un error, solo reenvías el fragmento dañado**, no el archivo entero. Si mandastes un libro de 500 páginas todo junto y se dañó la página 347, tenés que mandar las 500 de nuevo. Si las mandaste en grupos de 10 páginas, solo reenviás el grupo de la 340 a la 350.

2. **Detectás errores más rápido**: no esperás a recibir el archivo completo para verificar el CRC. Lo verificás fragmento por fragmento.

3. **Ningún dispositivo acapara el canal** por demasiado tiempo: otros paquetes de otros usuarios pueden intercalarse entre los fragmentos.

### El número de secuencia

Cada fragmento lleva un número de orden para que el receptor pueda **rearmarlo en el orden correcto**, aunque lleguen en desorden.

**Analogía:** Mandar un libro en sobres, y en cada sobre escribís "Capítulo 3 de 20". Aunque lleguen en desorden, el lector sabe cómo reordenarlos.

---

## Resumen: los tres problemas y sus soluciones

| Problema | Causa | Solución |
|---|---|---|
| El receptor no da abasto | El transmisor manda muy rápido | Control de flujo (el receptor avisa cuándo parar) |
| Los datos llegan corruptos | Interferencia, ruido en el cable | Detección de errores (paridad, CRC) |
| Los datos corruptos no se corrigen solos | Alguien tiene que pedir el reenvío | Control de errores (ARQ, ACK/NACK) |
| Los datos son muy grandes para viajar juntos | Límites físicos de la red | Fragmentación + número de secuencia |

---

*Capítulo anterior → [07 - TCP/IP](07-tcp-ip.md)*
*Siguiente capítulo → [09 - Switch y VLAN](09-switch-y-vlan.md)*

# Capítulo 04 — Protocolos: las reglas del juego

> **Pregunta clave:** ¿Cómo saben dos computadoras "hablar el mismo idioma"?

---

## La analogía: el apretón de manos

Cuando dos personas se saludan en Argentina, siguen un protocolo sin darse cuenta:

1. Extendés la mano derecha
2. El otro la toma
3. Apretás con cierta fuerza (ni floja ni exagerada)
4. Sacudís 2-3 veces
5. Soltás

Si alguien te da la mano izquierda, o no suelta, o la sacude 20 veces, el "protocolo" se rompe y la situación se vuelve incómoda. En redes pasa exactamente lo mismo: si una computadora no sigue las reglas acordadas, la otra no entiende nada.

Un **protocolo** es un conjunto de reglas que dos partes acuerdan seguir para comunicarse correctamente.

---

## Los tres elementos de cualquier protocolo

### 1. Sintaxis — La forma
Define cómo se ve el mensaje: su estructura, sus campos, el orden de los bytes.

**Analogía:** En el correo postal, el sobre tiene que tener el remitente arriba a la izquierda, el destinatario al centro, y el sello arriba a la derecha. Si ponés el sello en el medio, el sistema falla.

### 2. Semántica — El significado
Define qué significa cada parte del mensaje.

**Analogía:** En un formulario bancario, el campo "sucursal" significa algo específico. Si escribís tu nombre ahí, la forma es correcta pero la semántica está mal.

### 3. Temporización — El cuándo
Define los turnos: quién habla primero, cuánto espera antes de reenviar, qué pasa si no llega respuesta.

**Analogía:** En una conversación de radio (walkie-talkie), decís "cambio" para indicar que terminaste de hablar. Si los dos hablan a la vez, nadie entiende nada.

---

## Protocolos asincrónicos vs sincrónicos

### Asincrónico = WhatsApp
Cada mensaje tiene una marca de inicio (la notificación) y una marca de fin (el "✓" de enviado). No importa cuándo lo mandaste: el otro lo procesa cuando puede. No hay un "ritmo" común entre los dos.

Cada carácter viaja con un **bit de arranque** (aviso de que empieza) y un **bit de parada** (aviso de que terminó). El receptor espera esas señales.

### Sincrónico = Videollamada
Ambos tienen que estar conectados al mismo tiempo, a la misma velocidad. Hay un "reloj" compartido que sincroniza el envío. Es más eficiente (no necesita el bit de arranque/parada en cada carácter) pero requiere que ambos estén en sintonía.

---

## Características clave de los protocolos

### Control de errores
El transmisor agrega información extra para que el receptor pueda detectar si algo se corrompió en el camino.

**Analogía:** Como cuando dictás un número de teléfono y el otro repite "1-5-4-3, ¿correcto?" para verificar.

### Control de flujo
Si el transmisor manda más rápido de lo que el receptor puede procesar, el receptor le dice "pará un poco".

**Analogía:** Dictarle a alguien que escribe a mano. Si hablás muy rápido, te dice "esperate que no llego".

### Control de secuencia
Los mensajes se numeran para que el receptor pueda reordenarlos si llegan en distinto orden.

**Analogía:** Si mandás un libro en capítulos por correo, ponés "Capítulo 1/10", "Capítulo 2/10", etc. Aunque lleguen en desorden, el lector sabe cómo rearmarlo.

### Fragmentación
Los datos grandes se cortan en trozos pequeños (tramas) para viajar.

**Analogía:** No podés mandar un mueble armado por correo. Lo desarmás, mandás las partes, y el otro lo rearma.

### Transparencia
Si dentro de los datos hay un patrón que parece una señal de control, hay que marcarlo para que no se confunda con una instrucción real.

**Analogía:** Si en el texto de tu carta escribís "FIN" (que es la señal de fin de carta), tenés que aclarar que esa palabra es parte del contenido, no la señal real de fin.

---

## Para recordar

> Un protocolo no es magia. Es simplemente un contrato: "yo te mando los datos en este formato, con este orden, y vos respondés de esta manera". Cualquier cosa que usás en internet (HTTP, TCP, IP, WiFi) es un protocolo, es decir, un conjunto de reglas que alguien documentó y todos acordaron seguir.

---

*Capítulo anterior → [03 - Conmutación de Circuitos vs Paquetes](03-conmutacion-circuitos-vs-paquetes.md)*
*Siguiente capítulo → [05 - Arquitectura en Capas](05-arquitectura-en-capas.md)*

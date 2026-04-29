# Capítulo 07 — TCP/IP: el modelo real de Internet

> **Pregunta clave:** ¿Cómo funciona el modelo que realmente usa Internet? ¿Qué diferencia hay entre TCP y UDP?

---

## Las capas de TCP/IP

TCP/IP no es un modelo oficial diseñado en papel — es el modelo que emergió de la práctica real. Tiene 4 o 5 capas según cómo se cuente:

```
┌─────────────────────────────────┐
│          APLICACIÓN             │  HTTP, FTP, SMTP, DNS, SSH...
├─────────────────────────────────┤
│     TRANSPORTE (TCP / UDP)      │  Puertos, confiabilidad
├─────────────────────────────────┤
│       INTERNET (IP)             │  Direcciones IP, ruteo
├─────────────────────────────────┤
│      ACCESO A LA RED            │  Ethernet, WiFi, MAC
├─────────────────────────────────┤
│           FÍSICA                │  Cables, señales, bits
└─────────────────────────────────┘
```

---

## TCP vs UDP: con o sin acuse de recibo

### TCP — Transmission Control Protocol = Correo certificado con firma

Mandás la carta. El cartero te trae de vuelta el acuse firmado por el destinatario. Si en X tiempo no llega el acuse, el cartero va de nuevo. Si el paquete se dañó en el camino, se manda otro.

**Garantías de TCP:**
- Los datos llegaron ✓
- Llegaron en el orden correcto ✓
- No llegaron duplicados ✓
- No falta nada ✓

**Costo:** más lento, porque hay un "ida y vuelta" de confirmación por cada bloque de datos.

**Cuándo usar TCP:** cuando los datos no pueden faltar ni corromperse.
- Cargar una página web (si falta un byte del HTML, la página se rompe)
- Descargar un archivo (si falta un fragmento, el archivo está corrupto)
- Mandar un email (no querés que llegue a medias)

---

### UDP — User Datagram Protocol = Folleto publicitario en el buzón

Lo tirás al buzón y listo. No sabés si alguien lo leyó. No hay confirmación. Si se pierde, no te enterás.

**Características de UDP:**
- Sin garantía de entrega
- Sin garantía de orden
- Sin garantía de no-duplicación
- Cabecera mínima (muy liviano)

**Ventaja:** es extremadamente rápido porque no espera confirmaciones.

**Cuándo usar UDP:** cuando la velocidad importa más que la perfección.
- **Videollamada**: si un frame de video llega tarde, preferís saltarlo que pausar la llamada 2 segundos esperando que se reenvíe. El usuario nota menos un frame perdido que un corte.
- **Streaming en vivo**: mismo razonamiento — el presente importa más que recuperar el pasado.
- **Juegos online**: la posición del personaje hace 200ms no importa, importa la de ahora.
- **DNS**: una consulta pequeña que esperás respuesta inmediata — si no responde, preguntás de nuevo.

---

## Los Puertos: las puertas del edificio

La dirección IP identifica **el edificio** (la computadora). El **puerto** identifica **el departamento** (la aplicación dentro de esa computadora).

```
IP: 192.168.1.10  →  es el edificio
Puerto 80          →  la puerta del depto. web (HTTP)
Puerto 443         →  la puerta del depto. web seguro (HTTPS)
Puerto 25          →  la puerta del depto. de correo (SMTP)
Puerto 22          →  la puerta del depto. de acceso remoto (SSH)
```

**Ejemplo real:** Tu computadora abre Chrome y Spotify al mismo tiempo. Ambas usan la misma dirección IP. Pero Chrome usa el puerto 443 para hablar con Google, y Spotify usa el puerto 4070 para hablar con sus servidores. El sistema operativo sabe a qué aplicación mandar cada paquete que llega porque cada respuesta viene con el número de puerto.

Puertos del 0 al 1023 son **bien conocidos** (reservados para servicios estándar).
Puertos del 1024 al 65535 los asigna el sistema operativo a tus aplicaciones dinámicamente.

---

## La Encapsulación: las muñecas rusas

Cuando mandás datos, cada capa los envuelve en una "capa" más de información. Al llegar, cada capa quita su envoltura.

**Enviando** (de arriba hacia abajo):
```
[Datos de usuario]
    → TCP agrega su cabecera:
[TCP header | Datos]                    ← Segmento TCP

    → IP agrega su cabecera:
[IP header | TCP header | Datos]        ← Datagrama IP

    → Ethernet agrega su cabecera y cola:
[MAC dst | MAC src | IP | TCP | Datos | CRC]  ← Trama Ethernet
```

**Recibiendo** (de abajo hacia arriba):
- Ethernet quita su cabecera, pasa el resto a IP
- IP quita su cabecera, pasa el resto a TCP
- TCP quita su cabecera, pasa los datos a la Aplicación
- La Aplicación lee el contenido real

**Analogía:** Abrir una muñeca rusa. Cada capa es una muñeca. La aplicación es la muñeca más pequeña de adentro.

---

## IP: el servicio de reparto sin garantías

El **Internet Protocol (IP)** se encarga del ruteo: saber por dónde mandar cada paquete. Pero IP **no garantiza nada**:

- Un paquete puede perderse
- Puede llegar duplicado
- Puede llegar en distinto orden
- Puede llegar tarde

Eso está bien porque TCP (la capa de arriba) se encarga de las garantías. IP solo hace un trabajo: intentar que el paquete llegue al destino, eligiendo la ruta disponible.

**Analogía:** IP es el repartidor que hace lo que puede. TCP es el sistema de seguimiento que verifica que llegó y pide reenvío si no llegó.

---

## El recorrido completo de un paquete

Escribís `google.com` en el navegador. Esto es lo que pasa:

1. **DNS** (Aplicación): traduce `google.com` a una dirección IP (ej: `142.250.80.46`)
2. **HTTP** (Aplicación): arma la solicitud "dame la página principal"
3. **TCP** (Transporte): divide la solicitud, agrega puerto destino (443) y puerto origen tuyo (ej: 52341), numera los fragmentos
4. **IP** (Internet): agrega tu IP y la IP de Google, decide que el primer salto es tu router
5. **Ethernet** (Acceso a la red): agrega la MAC de tu router como destino, la MAC de tu PC como origen
6. **Física**: convierte en señal WiFi y sale al aire

En tu router: se quita la envoltura Ethernet, IP decide el siguiente salto, se vuelve a envolver con nueva cabecera Ethernet para el próximo tramo. Esto se repite en cada router del camino.

En Google: se quitan todas las capas, el servidor lee la solicitud HTTP y arma la respuesta, que viaja de vuelta el mismo proceso.

---

*Capítulo anterior → [06 - Modelo OSI](06-modelo-osi.md)*
*Siguiente capítulo → [08 - Control de Flujo y Errores](08-control-flujo-y-errores.md)*

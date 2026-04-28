# TLS, JWT y conexiones TCP — Tres conceptos en profundidad

---

# PARTE 1 — Cómo cifra TLS

## El problema: dos tipos de criptografía

Antes de entender TLS, hay que entender que existen dos familias de cifrado completamente distintas.

### Cifrado simétrico
Una sola clave sirve para cifrar Y descifrar. Es muy rápido.

```
Mensaje: "hola"
Clave:   "secreto123"

cifrar("hola", "secreto123")   → "x7$kQ"
descifrar("x7$kQ", "secreto123") → "hola"
```

**Problema**: si querés hablar con alguien que no conocés, ¿cómo le mandás la clave sin que otros la intercepten?

### Cifrado asimétrico (clave pública/privada)
Dos claves matemáticamente relacionadas: lo que cifra una, solo lo puede descifrar la otra.

```
Clave pública:  la repartís libremente, todo el mundo la puede tener
Clave privada:  solo la tenés vos, nunca sale de tu máquina

cifrar(mensaje, clave_pública)    → solo lo puede descifrar la clave_privada
firmar(mensaje, clave_privada)    → cualquiera puede verificar con la clave_pública
```

**Problema**: es 1000x más lento que el simétrico. No sirve para cifrar toda la comunicación.

### La solución de TLS: usar los dos

TLS usa asimétrico **solo para el handshake** (para ponerse de acuerdo en una clave compartida de forma segura), y después simétrico para todo el resto de la comunicación.

---

## El handshake de TLS 1.3 en detalle

### Paso 1 — ClientHello

El cliente manda:
- Las versiones de TLS que soporta
- Los **cipher suites** que soporta (combinaciones de algoritmos)
- Un número aleatorio (`random_C`)
- Su **clave pública efímera** (generada para esta sesión, usando Diffie-Hellman)

### Paso 2 — ServerHello + Certificado

El servidor responde con:
- La versión y cipher suite elegidos
- Un número aleatorio (`random_S`)
- Su **clave pública efímera** (también Diffie-Hellman)
- Su **certificado TLS** (contiene su clave pública permanente y está firmado por una CA)

### Paso 3 — Intercambio de claves con Diffie-Hellman

Acá ocurre la magia. Diffie-Hellman permite que dos partes lleguen al **mismo número secreto** sin que nadie más pueda calcularlo, aunque hayan visto toda la conversación.

**Analogía con colores de pintura:**

```
1. Todos acuerdan un color base público: amarillo

2. Cliente elige un color secreto: rojo
   Mezcla: amarillo + rojo = naranja  → manda naranja al servidor

3. Servidor elige un color secreto: azul
   Mezcla: amarillo + azul = verde    → manda verde al cliente

4. Cliente recibe verde + tiene su rojo secreto:
   verde + rojo = marrón oscuro  ← color compartido

5. Servidor recibe naranja + tiene su azul secreto:
   naranja + azul = marrón oscuro  ← mismo color compartido

Un espía vio: amarillo, naranja, verde — no puede calcular marrón oscuro
sin conocer rojo o azul (los secretos nunca viajaron).
```

En la realidad, en vez de colores se usan operaciones matemáticas sobre curvas elípticas (ECDH) que son fáciles en una dirección e imposibles de revertir.

### Paso 4 — Derivación de la session key

Con el secreto compartido obtenido por Diffie-Hellman + `random_C` + `random_S`, ambos lados derivan de forma independiente las mismas **session keys** (claves simétricas).

```
session_key = KDF(secreto_DH, random_C, random_S)

KDF = Key Derivation Function (HKDF en TLS 1.3)
```

### Paso 5 — Finished

Cada lado envía un mensaje "Finished" cifrado con la session key. Si el otro puede descifrarlo correctamente, se confirma que ambos derivaron la misma clave y que nadie alteró el handshake.

A partir de acá, **todo viaja cifrado con AES** (simétrico, rapidísimo).

---

## ¿Cómo verifica el cliente que el servidor es real?

El servidor manda su certificado TLS. El cliente verifica:

1. **Firma de la CA**: el certificado fue firmado por una CA de confianza (cuya clave pública está preinstalada en el OS). El cliente verifica la firma criptográficamente.
2. **Nombre del dominio**: el CN (Common Name) o SAN (Subject Alternative Name) del certificado coincide con el dominio al que se conectó.
3. **Fecha de vigencia**: el certificado no venció.
4. **Revocación**: el certificado no fue revocado (OCSP).

Si algo falla → el browser bloquea la conexión y muestra el warning rojo.

---

## Perfect Forward Secrecy (PFS)

En TLS 1.3, las claves Diffie-Hellman son **efímeras** — generadas solo para esa sesión y descartadas después.

Consecuencia: si alguien graba todo el tráfico cifrado hoy, y en el futuro obtiene la clave privada del servidor, **no puede descifrar el tráfico anterior** porque las claves de sesión ya no existen.

TLS 1.2 sin PFS era vulnerable: con la clave privada del servidor podías descifrar todo el tráfico pasado.

---

## Resumen del cifrado en TLS

```
Handshake:
  Clave pública del certificado → verifica identidad del servidor
  Diffie-Hellman efímero → deriva secreto compartido sin exponerlo

Comunicación:
  AES-256-GCM (simétrico) → cifra todos los datos
  HMAC / AEAD → verifica integridad (nadie alteró los datos)
```

---

---

# PARTE 2 — JWT (JSON Web Token) vs Cookies de sesión

## El problema: HTTP es stateless

El servidor no recuerda quién sos entre una request y la siguiente. Necesitás algún mecanismo para decirle "soy Nacho, ya me autentiqué".

Hay dos enfoques principales: **sesiones con cookies** y **JWT**.

---

## Enfoque 1 — Sesión del lado del servidor (cookies)

```
1. Usuario hace login → servidor verifica contraseña
2. Servidor crea una sesión en memoria/base de datos:
   sessions["abc123"] = { userId: 42, nombre: "Nacho", expira: ... }
3. Servidor responde:
   Set-Cookie: session_id=abc123; HttpOnly; Secure
4. El browser guarda la cookie automáticamente
5. En cada request siguiente:
   Cookie: session_id=abc123
6. El servidor busca "abc123" en su tabla de sesiones → sabe quién sos
```

**El estado vive en el servidor.** La cookie es solo un identificador opaco.

---

## Enfoque 2 — JWT (stateless)

```
1. Usuario hace login → servidor verifica contraseña
2. Servidor crea un JWT con los datos del usuario y lo firma:
   token = base64(header) + "." + base64(payload) + "." + firma
3. Servidor responde con el token (en el body o en una cookie)
4. El cliente guarda el token (localStorage o cookie)
5. En cada request siguiente:
   Authorization: Bearer eyJhbGci...
6. El servidor verifica la firma del token → sabe quién sos
   (sin consultar ninguna base de datos)
```

**El estado vive en el token.** El servidor no guarda nada.

---

## Estructura de un JWT

Un JWT son tres partes en base64 separadas por puntos:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJ1c2VySWQiOjQyLCJub21icmUiOiJOYWNobyIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzEzMDk4MDAwLCJleHAiOjE3MTMxMDE2MDB9
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Header (algoritmo y tipo)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (los datos — llamados "claims")
```json
{
  "userId": 42,
  "nombre": "Nacho",
  "rol": "admin",
  "iat": 1713098000,   ← issued at (cuándo se emitió, Unix timestamp)
  "exp": 1713101600    ← expiration (cuándo vence)
}
```

> El payload **no está cifrado** — solo codificado en base64. Cualquiera puede decodificarlo y leer el contenido. Nunca guardes datos sensibles (contraseñas, tarjetas) en un JWT.

### Signature (firma)
```
HMACSHA256(
  base64url(header) + "." + base64url(payload),
  secreto_del_servidor
)
```

La firma es lo que hace al token seguro. Si alguien modifica el payload (ej: cambia `"rol": "admin"` por `"rol": "superadmin"`), la firma ya no coincide y el servidor lo rechaza.

---

## Cómo el servidor verifica un JWT

```
1. Recibe: eyJhbGci...eyJ1c2Vy...SflKxw
2. Separa en header + payload + firma
3. Recalcula: HMACSHA256(header + "." + payload, secreto_propio)
4. Compara con la firma recibida
   - Coinciden → token válido, puede confiar en el payload
   - No coinciden → token alterado o falsificado → rechazar
5. Verifica que "exp" no haya vencido
```

El servidor **nunca necesita consultar una base de datos** para verificar un JWT. Solo necesita su secreto (o clave pública si usa RS256).

---

## JWT con RS256 — clave pública/privada

En vez de un secreto compartido (HS256), se puede firmar con clave privada y verificar con clave pública (RS256 o ES256).

```
Servidor de autenticación:  firma el JWT con su clave privada
Cualquier servidor backend: verifica con la clave pública (que puede ser pública)
```

Esto permite que múltiples servidores distintos verifiquen tokens sin compartir ningún secreto.

---

## JWT vs Cookies — comparación

| | Cookies de sesión | JWT |
|---|---|---|
| Estado en el servidor | Sí (tabla de sesiones) | No |
| Puede revocar el token | Sí (borrar la sesión) | Difícil (necesita blacklist) |
| Escala horizontal | Requiere sesión compartida (Redis) | Fácil, cualquier servidor verifica |
| Tamaño | Pequeño (solo el ID) | Más grande (lleva datos) |
| Seguridad por defecto | HttpOnly cookie evita XSS | En localStorage es vulnerable a XSS |
| Expiración | El servidor controla | Definida en el token, difícil de cambiar |

### El problema de revocación en JWT

Si un usuario cierra sesión o le robaron el token, **no podés invalidar un JWT** antes de que venza — el servidor no tiene estado para recordar que ese token ya no sirve.

Soluciones:
- Usar **access tokens de vida corta** (5–15 minutos) + **refresh tokens** de vida larga
- Mantener una **blacklist** de tokens revocados (pero eso ya agrega estado al servidor)
- Al cambiar contraseña, rotar el secreto de firma (invalida todos los tokens)

---

## El flujo completo con refresh tokens

```
1. Login → servidor devuelve:
   - access_token (JWT, vive 15 min) → para autenticar requests
   - refresh_token (opaco, vive 7 días) → guardado en cookie HttpOnly

2. Cliente usa access_token en cada request:
   Authorization: Bearer <access_token>

3. access_token vence → cliente manda refresh_token al endpoint /auth/refresh

4. Servidor verifica refresh_token en la base de datos →
   devuelve nuevo access_token (y opcionalmente nuevo refresh_token)

5. Si el usuario hace logout → servidor invalida el refresh_token en la DB
```

---

---

# PARTE 3 — ¿Quedan "conectados" cliente y servidor en HTTP?

## La confusión: conexión TCP vs request HTTP

Son dos cosas distintas:

- **Conexión TCP**: el canal de comunicación. Como un tubo entre dos puntos.
- **Request HTTP**: un mensaje que viaja por ese tubo.

El tubo puede existir aunque no estén pasando mensajes en este momento.

---

## HTTP/1.0 — una conexión por request (1996)

En HTTP/1.0, el comportamiento era:

```
1. Cliente abre conexión TCP
2. Envía request
3. Servidor responde
4. Conexión TCP se cierra

Para la siguiente request: volver al paso 1
```

Esto era terriblemente ineficiente — el TCP handshake (y TLS handshake) se repetía para cada recurso.

---

## HTTP/1.1 — Keep-Alive: conexiones persistentes (1997)

HTTP/1.1 introdujo **keep-alive** como comportamiento por defecto:

```
1. Cliente abre conexión TCP (y TLS)
2. Envía request 1
3. Servidor responde
4. [conexión sigue abierta]
5. Envía request 2 por la misma conexión
6. Servidor responde
7. [sigue abierta...]
8. Después de inactividad → alguno de los dos cierra con FIN
```

Headers relacionados:
```
Connection: keep-alive          ← mantener abierta (default en HTTP/1.1)
Keep-Alive: timeout=60, max=100 ← cerrar si no hay actividad en 60s, máximo 100 requests
Connection: close               ← cerrar después de esta response
```

### ¿Están "escuchándose mutuamente"?

No exactamente. La conexión TCP está **abierta pero idle** — los buffers están listos, los sockets existen, pero no se están enviando datos. Es como dejar el teléfono en silencio sin colgar.

El OS mantiene el estado de la conexión (tabla de sockets) y las dos partes tienen sus sockets abiertos, pero no hay CPU ni red consumida mientras no hay datos.

---

## HTTP/1.1 — Pipelining (raramente usado)

Permite enviar múltiples requests sin esperar las responses:

```
Cliente: [GET /a] [GET /b] [GET /c] →→→ Servidor
Cliente:            ←←← [resp /a] [resp /b] [resp /c]
```

Problema: el servidor **debe responder en orden** → si `/a` tarda, bloquea a `/b` y `/c` aunque ya estén listas. Head-of-line blocking de nuevo. Nunca se adoptó ampliamente.

---

## HTTP/2 — Multiplexing real

HTTP/2 soluciona el problema con **streams**:

```
Conexión TCP única
├── Stream 1: GET /api/usuarios  ←→  response JSON
├── Stream 3: GET /styles.css    ←→  response CSS
├── Stream 5: GET /logo.png      ←→  response imagen
└── Stream 7: POST /api/evento   ←→  response 201
```

Cada stream tiene su ID. Los frames de distintos streams se intercalan libremente. Las responses pueden llegar en cualquier orden.

Una sola conexión TCP, todo el tiempo abierta, manejando todo el tráfico al servidor.

---

## ¿Qué pasa con los timeouts?

Las conexiones no se quedan abiertas para siempre. Varios timeouts la cierran:

```
Cliente                    Servidor
   |                           |
   |   ... 60s sin actividad ...|
   |                           |
   |<-------- FIN -------------|   servidor inicia cierre
   |---------- FIN-ACK ------->|
   |---------- FIN ----------->|
   |<--------- FIN-ACK --------|
                               conexión cerrada
```

- **Servidor**: cierra conexiones idle para liberar recursos (nginx: `keepalive_timeout 65`)
- **Cliente**: el browser tiene su propio timeout
- **Proxies/balanceadores**: tienen sus propios timeouts (a veces más cortos)

---

## El TCP 4-way handshake de cierre

Abrir una conexión TCP requiere 3 mensajes (SYN/SYN-ACK/ACK).
Cerrarla requiere 4 (porque cada lado cierra su mitad independientemente):

```
Cliente                    Servidor
   |------- FIN ----------->|   "yo terminé de enviar"
   |<------ ACK ------------|   "ok, recibí tu FIN"
   |                           [servidor puede seguir enviando]
   |<------ FIN ------------|   "yo también terminé"
   |------- ACK ----------->|   "ok"

Estado: TIME_WAIT en el cliente (~60-240s antes de liberar el puerto)
```

---

## Resumen: el ciclo de vida de una conexión HTTP

```
[TCP SYN/SYN-ACK/ACK]     ← se abre el canal
       │
[TLS Handshake]            ← se negocia encriptación (si es HTTPS)
       │
[HTTP Request 1]           ← primer mensaje
[HTTP Response 1]
       │
[HTTP Request 2]           ← reutiliza la misma conexión (keep-alive)
[HTTP Response 2]
       │
   ... idle ...             ← conexión abierta, nadie envía nada
       │
[TCP FIN/ACK/FIN/ACK]     ← se cierra el canal (timeout o cierre explícito)
```

---

## Preguntas típicas de parcial

**¿TLS cifra con clave pública o privada?**
El handshake usa Diffie-Hellman (asimétrico) para acordar un secreto compartido. La comunicación real usa AES (simétrico) con las session keys derivadas de ese secreto.

**¿El payload de un JWT es secreto?**
No. Está codificado en base64, no cifrado. Cualquiera puede decodificarlo y leer el contenido. La seguridad del JWT está en la firma, no en el ocultamiento del payload.

**¿Cómo sabe el servidor que un JWT no fue alterado?**
Recalcula la firma con su secreto y la compara con la que viene en el token. Si alguien modificó el payload, la firma no coincide.

**¿Por qué es difícil revocar un JWT?**
Porque el servidor es stateless — no guarda ningún registro de tokens emitidos. No tiene a qué consultar para saber si un token sigue siendo válido. La solución más común es usar tokens de corta duración (15 min) más refresh tokens.

**¿HTTP es stateful o stateless?**
Stateless — cada request es independiente. El servidor no recuerda requests anteriores. Las cookies/JWT son mecanismos construidos encima de HTTP para simular estado.

**¿Qué diferencia hay entre una conexión TCP y una request HTTP?**
La conexión TCP es el canal (tubo persistente). Una request HTTP es un mensaje que viaja por ese canal. Muchas requests pueden viajar por la misma conexión TCP (keep-alive).

**¿Qué es Perfect Forward Secrecy?**
Es la propiedad de que si alguien captura el tráfico cifrado hoy y obtiene la clave privada del servidor en el futuro, no puede descifrar el tráfico pasado. Se logra usando claves Diffie-Hellman efímeras que se descartan al terminar cada sesión.

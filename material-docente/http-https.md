# HTTP y HTTPS — Cómo funciona una request de punta a punta

---

## Analogía: el mozo y la cocina

Entrás a un restaurante. Le decís al mozo: "quiero una milanesa". El mozo va a la cocina, pide la milanesa, la cocina la prepara, el mozo la trae a tu mesa.

- **Vos** = el browser o el código JS que hace `fetch()`
- **El mozo** = el protocolo HTTP (el mensajero)
- **La cocina** = el servidor que procesa la request
- **La milanesa** = la respuesta (JSON, HTML, imagen, etc.)
- **El idioma que usan vos y el mozo** = el formato del mensaje HTTP

HTTP define exactamente cómo se formula el pedido y cómo llega la respuesta. Sin ese idioma común, nadie se entiende.

---

## ¿Dónde "vive" HTTP?

HTTP es un protocolo de **capa de aplicación**. Corre encima de TCP (o QUIC en HTTP/3).

```
┌──────────────────────┐
│   Tu aplicación      │  ← acá escribís fetch(), axios, curl
├──────────────────────┤
│   HTTP               │  ← define el formato del mensaje
├──────────────────────┤
│   TLS (si es HTTPS)  │  ← encripta el mensaje
├──────────────────────┤
│   TCP                │  ← entrega confiable de bytes
├──────────────────────┤
│   IP                 │  ← routing entre redes
├──────────────────────┤
│   Ethernet / WiFi    │  ← transmisión física
└──────────────────────┘
```

HTTP no sabe nada de cables, IPs ni rutas. Solo define cómo escribir el mensaje. Las capas de abajo se encargan del resto.

---

## Estructura de una HTTP Request

Una request HTTP es texto plano con un formato específico:

```
GET /api/usuarios/42 HTTP/1.1\r\n
Host: api.ejemplo.com\r\n
Accept: application/json\r\n
Authorization: Bearer eyJhbGci...\r\n
\r\n
```

Tiene tres partes:

### 1. Request line
```
GET /api/usuarios/42 HTTP/1.1
^    ^                ^
|    |                versión del protocolo
|    path del recurso
método HTTP
```

### 2. Headers
Pares `clave: valor`, uno por línea. Terminan con una línea en blanco (`\r\n\r\n`).

Headers comunes:
| Header | Para qué sirve |
|---|---|
| `Host` | Obligatorio en HTTP/1.1 — indica el servidor destino |
| `Content-Type` | Tipo de dato en el body (`application/json`, `text/html`) |
| `Content-Length` | Tamaño del body en bytes |
| `Authorization` | Token o credenciales |
| `Accept` | Qué formatos acepta el cliente como respuesta |
| `Cookie` | Cookies enviadas al servidor |
| `User-Agent` | Identificación del cliente (browser, versión, OS) |

### 3. Body (opcional)
Solo en POST, PUT, PATCH. Contiene los datos enviados.

```
POST /api/usuarios HTTP/1.1
Host: api.ejemplo.com
Content-Type: application/json
Content-Length: 42

{"nombre": "Nacho", "email": "nacho@mail.com"}
```

---

## Estructura de una HTTP Response

```
HTTP/1.1 200 OK\r\n
Content-Type: application/json\r\n
Content-Length: 87\r\n
Cache-Control: max-age=3600\r\n
\r\n
{"id": 42, "nombre": "Nacho", "email": "nacho@mail.com", "rol": "admin"}
```

### Status codes — los más importantes

| Código | Significado |
|---|---|
| 200 OK | Todo bien, respuesta en el body |
| 201 Created | Recurso creado exitosamente |
| 204 No Content | Todo bien, sin body de respuesta |
| 301 Moved Permanently | El recurso se movió para siempre (redirect) |
| 302 Found | Redirect temporal |
| 400 Bad Request | La request está mal formada |
| 401 Unauthorized | No autenticado (falta token/credenciales) |
| 403 Forbidden | Autenticado pero sin permiso |
| 404 Not Found | El recurso no existe |
| 409 Conflict | Conflicto de estado (ej: email ya registrado) |
| 422 Unprocessable Entity | Datos válidos pero semánticamente incorrectos |
| 429 Too Many Requests | Rate limiting |
| 500 Internal Server Error | El servidor explotó |
| 502 Bad Gateway | El proxy no pudo contactar al backend |
| 503 Service Unavailable | Servidor caído o sobrecargado |

---

## Los métodos HTTP

| Método | Semántica | Tiene body |
|---|---|---|
| GET | Obtener un recurso | No |
| POST | Crear un recurso | Sí |
| PUT | Reemplazar un recurso completo | Sí |
| PATCH | Modificar parte de un recurso | Sí |
| DELETE | Eliminar un recurso | Opcional |
| HEAD | Igual que GET pero sin body en la respuesta | No |
| OPTIONS | Preguntar qué métodos acepta el servidor | No |

**Idempotencia**: GET, PUT, DELETE son idempotentes — hacer la misma operación N veces tiene el mismo resultado que hacerla una. POST no es idempotente — si lo mandás dos veces, crea dos recursos.

---

## HTTP/1.1 vs HTTP/2 vs HTTP/3

### HTTP/1.1 (1997)
- Una request por conexión TCP a la vez (en la práctica, los browsers abren ~6 conexiones paralelas al mismo host)
- Headers en texto plano, sin comprimir
- Problema: **head-of-line blocking** — si una respuesta tarda, bloquea las siguientes

### HTTP/2 (2015)
- **Multiplexing**: múltiples requests y responses simultáneas sobre **una sola conexión TCP**
- Headers comprimidos (HPACK)
- **Server push**: el servidor puede enviar recursos sin que el cliente los pida
- Binario en lugar de texto plano

```
HTTP/1.1:   [req1]--[resp1]--[req2]--[resp2]   (secuencial)

HTTP/2:     [req1][req2][req3]                  (simultáneas)
            [resp2][resp1][resp3]               (en cualquier orden)
```

### HTTP/3 (2022)
- Reemplaza TCP por **QUIC** (UDP + confiabilidad en capa de aplicación)
- Elimina el head-of-line blocking a nivel de transporte (en TCP si se pierde un paquete, bloquea todo)
- Conexiones más rápidas (0-RTT en reconexiones)

---

## HTTPS — HTTP con TLS

### ¿Qué agrega HTTPS?

HTTP puro envía todo en texto plano. Cualquiera en el camino (ISP, router de café, etc.) puede leer o modificar el contenido.

HTTPS = HTTP + **TLS (Transport Layer Security)**

TLS provee:
- **Confidencialidad**: el contenido está encriptado
- **Integridad**: nadie puede modificar los datos en tránsito sin que se detecte
- **Autenticación**: el cliente puede verificar que está hablando con el servidor real (no un impostor)

### El TLS Handshake (cómo se establece la conexión segura)

Antes de enviar la primera request HTTP, cliente y servidor negocian las claves de encriptación:

```
Cliente                                    Servidor
   |                                           |
   |------ ClientHello ----------------------->|
   |       (versiones TLS soportadas,          |
   |        cipher suites, random_C)           |
   |                                           |
   |<----- ServerHello ------------------------|
   |       (versión elegida, cipher elegido,   |
   |        random_S, certificado)             |
   |                                           |
   | [cliente verifica el certificado]         |
   |                                           |
   |------ ClientKeyExchange ----------------->|
   |       (pre-master secret, encriptado      |
   |        con la clave pública del cert.)    |
   |                                           |
   | [ambos derivan la session key usando      |
   |  random_C + random_S + pre-master secret] |
   |                                           |
   |------ Finished (encriptado) ------------->|
   |<----- Finished (encriptado) -------------|
   |                                           |
   |===== HTTP encriptado ===================|
```

En TLS 1.3 (el actual) este proceso es más corto — solo 1 round-trip.

### El certificado TLS — ¿cómo sé que es el servidor real?

El servidor presenta un **certificado digital** que contiene:
- Su nombre de dominio (`api.ejemplo.com`)
- Su clave pública
- Quién lo firmó (la **Certificate Authority — CA**)
- Fecha de vencimiento

El cliente confía en el certificado porque fue firmado por una CA de confianza (DigiCert, Let's Encrypt, etc.) cuyas claves públicas vienen preinstaladas en el sistema operativo y el browser.

```
CA raíz (confiada por el OS)
   └── CA intermedia
          └── certificado de api.ejemplo.com  ← el servidor presenta esto
```

Si el dominio no coincide, el certificado venció, o la CA no es de confianza → el browser muestra el warning rojo "Tu conexión no es privada".

---

## El viaje completo de un `fetch()` en JavaScript

```js
const response = await fetch("https://api.ejemplo.com/usuarios/42");
const data = await response.json();
```

### Paso 1 — Parseo de la URL

El browser descompone `https://api.ejemplo.com/usuarios/42`:
- Esquema: `https` → usar TLS, puerto 443
- Host: `api.ejemplo.com`
- Path: `/usuarios/42`

### Paso 2 — Resolución DNS

El OS consulta al resolver DNS para obtener la IP de `api.ejemplo.com`.

```
OS → resolver DNS → ... → 93.184.216.34
```

Si la respuesta está en caché (TTL no venció), se saltea la consulta.

### Paso 3 — TCP Handshake (3-way handshake)

Se establece la conexión TCP al servidor en el puerto 443.

```
Cliente                 Servidor
   |------- SYN --------->|
   |<------ SYN-ACK ------|
   |------- ACK --------->|
   (conexión TCP establecida)
```

### Paso 4 — TLS Handshake

Encima de la conexión TCP, se negocia TLS (ver sección anterior).

```
Cliente                 Servidor
   |--- ClientHello ----->|
   |<-- ServerHello ------|
   |<-- Certificado ------|
   |--- KeyExchange ----->|
   |--- Finished -------->|
   |<-- Finished ---------|
   (canal encriptado listo)
```

### Paso 5 — HTTP Request

Ahora sí se envía la request HTTP, encriptada dentro del canal TLS:

```
GET /usuarios/42 HTTP/1.1
Host: api.ejemplo.com
Accept: application/json
```

### Paso 6 — El servidor procesa la request

En el servidor pasa algo así (pseudocódigo):
```
1. TCP recibe los bytes encriptados
2. TLS los desencripta
3. HTTP parsea la request → método GET, path /usuarios/42
4. El framework (Express, FastAPI, etc.) busca el handler registrado para GET /usuarios/:id
5. El handler consulta la base de datos: SELECT * FROM usuarios WHERE id = 42
6. Construye la response: status 200, body JSON
7. HTTP serializa la response en texto
8. TLS la encripta
9. TCP la envía
```

### Paso 7 — HTTP Response

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 87

{"id": 42, "nombre": "Nacho", "email": "nacho@mail.com"}
```

### Paso 8 — El browser recibe y parsea

El JS recibe la response. `response.json()` parsea el body de texto a objeto JavaScript.

### Diagrama completo

```
fetch("https://api.ejemplo.com/usuarios/42")

[JS]
  │
  ▼
[DNS] api.ejemplo.com → 93.184.216.34
  │
  ▼
[TCP] SYN → SYN-ACK → ACK  (puerto 443)
  │
  ▼
[TLS] Handshake → canal encriptado
  │
  ▼
[HTTP] GET /usuarios/42 → encriptado → viaja por internet
  │
  ▼
[Servidor] desencripta → procesa → responde
  │
  ▼
[HTTP] 200 OK + JSON → encriptado → viaja de vuelta
  │
  ▼
[JS] response.json() → objeto JavaScript
```

---

## CORS — por qué tu fetch a veces falla

Cuando un JS en `frontend.com` hace fetch a `api.otro-dominio.com`, el browser aplica la **Same-Origin Policy**: por defecto, bloquea respuestas de dominios distintos.

**CORS (Cross-Origin Resource Sharing)** es el mecanismo para permitirlo:

1. El browser envía primero una **preflight request** (OPTIONS) preguntando si el origen tiene permiso
2. El servidor responde con headers indicando qué está permitido
3. Si está permitido, el browser envía la request real

```
Browser → OPTIONS /api/usuarios HTTP/1.1
          Origin: https://frontend.com

Servidor → 200 OK
           Access-Control-Allow-Origin: https://frontend.com
           Access-Control-Allow-Methods: GET, POST

Browser → GET /api/usuarios HTTP/1.1   ← ahora sí
```

Si el servidor no incluye los headers `Access-Control-Allow-Origin`, el browser bloquea la respuesta aunque el servidor la mandó. El error aparece en la consola del browser, no en el servidor.

> CORS es una restricción del **browser**. curl, Postman, el servidor backend — ninguno la aplica. Solo los browsers.

---

## Cookies y sesiones sobre HTTP

HTTP es **stateless** — cada request es independiente, el servidor no recuerda la anterior.

Para mantener sesión se usan **cookies**: el servidor envía `Set-Cookie` en la response, y el browser lo manda automáticamente en todas las requests siguientes al mismo dominio.

```
Response del login:
Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict

Requests siguientes:
Cookie: session_id=abc123
```

Atributos importantes:
- **HttpOnly**: la cookie no es accesible desde JS (protección contra XSS)
- **Secure**: solo se envía por HTTPS
- **SameSite**: controla si se envía en requests cross-site (protección contra CSRF)

---

## HTTP Caching

Las responses pueden incluir headers que indican al cliente (o a proxies intermedios) cuánto tiempo guardar el resultado:

```
Cache-Control: max-age=3600          → cachear por 1 hora
Cache-Control: no-cache              → siempre verificar con el servidor
Cache-Control: no-store              → nunca cachear
ETag: "abc123"                       → identificador de versión del recurso
Last-Modified: Mon, 14 Apr 2026 ...  → cuándo se modificó por última vez
```

Si la respuesta está cacheada y no venció, el browser ni siquiera hace la request al servidor — responde desde el caché local.

---

## Resumen: qué pasa exactamente cuando hacés fetch()

| Paso | Qué ocurre | Protocolo |
|---|---|---|
| 1 | Parseo de URL | — |
| 2 | Resolución del nombre a IP | DNS (UDP 53) |
| 3 | Establecer conexión confiable | TCP (SYN/SYN-ACK/ACK) |
| 4 | Negociar encriptación | TLS Handshake |
| 5 | Enviar la request | HTTP (texto encriptado) |
| 6 | Servidor procesa | Lógica de aplicación |
| 7 | Recibir la response | HTTP (texto encriptado) |
| 8 | Parsear el body | JS / browser |

---

## Preguntas típicas de parcial

**¿Qué diferencia hay entre HTTP y HTTPS?**
HTTPS es HTTP encriptado con TLS. Agrega confidencialidad, integridad y autenticación del servidor.

**¿Quién hace el TLS handshake — el browser o el servidor?**
Ambos. El cliente inicia con ClientHello y el servidor responde. Los dos participan en la negociación.

**¿Por qué CORS solo lo aplica el browser?**
La Same-Origin Policy es una restricción de seguridad del browser para proteger al usuario. Herramientas sin browser (curl, Postman, backends) no la implementan.

**¿Qué es un certificado TLS y quién lo firma?**
Es un documento digital que contiene la clave pública del servidor y el dominio, firmado por una CA de confianza. La firma permite verificar que el servidor es quien dice ser.

**¿Por qué HTTP es stateless y cómo se soluciona?**
Cada request es independiente — el servidor no guarda memoria de requests anteriores. Se resuelve con cookies, tokens (JWT en header Authorization), o sesiones del lado del servidor.

**¿Qué ventaja tiene HTTP/2 sobre HTTP/1.1?**
Multiplexing: múltiples requests simultáneas sobre una sola conexión TCP, headers comprimidos y menor latencia.

**¿Qué método HTTP es idempotente?**
GET, PUT, DELETE. POST no lo es (cada llamada puede crear un nuevo recurso).

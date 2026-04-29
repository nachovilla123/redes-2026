# Capa 6 — Presentación (Presentation Layer)

## ¿Qué resuelve?

Traduce los datos entre el formato que entiende la aplicación y el formato
que viaja por la red. Se encarga de:

1. **Serialización/Deserialización:** convertir estructuras de datos a bytes y viceversa
2. **Cifrado/Descifrado:** TLS/SSL vive conceptualmente acá
3. **Compresión/Descompresión:** gzip, brotli

**En la práctica TCP/IP:** al igual que L5, está absorbida en la capa de aplicación.
Pero los conceptos son muy concretos y los usás todos los días.

---

## Cómo lo vivís como dev

```javascript
// Serialización (L6): convertir objeto JS → bytes para enviar
JSON.stringify({ user: "nacho", age: 25 })

// Deserialización (L6): convertir bytes recibidos → objeto JS
JSON.parse(responseBody)

// Cifrado (L6): TLS maneja esto transparentemente
// cuando usás https:// el OS/browser cifra antes de enviar

// Compresión (L6): gzip en HTTP
// Content-Encoding: gzip
// el servidor comprime, el cliente descomprime
```

---

## Analogía

Sos español y tu colega es japonés. L5 establece que van a tener una conversación.
L6 es el traductor: convierte lo que decís a un idioma común que ambos entienden.
Si el traductor falla (formatos incompatibles), la conversación existe pero nadie entiende nada.

---

## Problemas reales de Capa 6

### 1. Serialización incompatible entre servicios
- **Síntoma:** un microservicio recibe datos de otro y falla al parsearlos
- **Causa:** un servicio serializa con Protocol Buffers v2 y el otro espera v3,
  o uno usa `snake_case` y el otro `camelCase` en JSON
- **Ejemplo real:**
  ```
  Service A envía: {"user_id": 123}
  Service B espera: {"userId": 123}
  Resultado: userId es undefined, el request falla silenciosamente
  ```
- **Fix:** esquemas compartidos (Protobuf `.proto`, Avro schema, OpenAPI spec), tests de contrato

### 2. Encoding de caracteres incorrecto (UTF-8 vs Latin-1)
- **Síntoma:** caracteres especiales se muestran como `Ã©` en lugar de `é`, o `?` en lugar de `ñ`
- **Causa:** el texto fue codificado en Latin-1 pero se interpretó como UTF-8 (o viceversa)
- **Diagnóstico:** buscar el header `Content-Type: text/html; charset=utf-8` o su ausencia
- **Fix:**
  ```bash
  # Detectar encoding
  file -i archivo.txt
  # Convertir
  iconv -f latin1 -t utf-8 entrada.txt > salida.txt
  ```
  En la app: siempre especificar charset explícitamente en Content-Type

### 3. TLS handshake failure
- **Síntoma:** "SSL handshake failed", "certificate verify failed", "SSL_ERROR_RX_RECORD_TOO_LONG"
- **Causa:**
  - Certificado expirado
  - Certificado de una CA no confiable (self-signed sin importar)
  - Versión de TLS incompatible (cliente requiere TLS 1.3, servidor solo soporta 1.1)
  - SNI mal configurado (el servidor no sabe qué certificado presentar)
- **Diagnóstico:**
  ```bash
  openssl s_client -connect ejemplo.com:443
  # Muestra el certificado, la versión de TLS negociada, y errores
  
  curl -v https://ejemplo.com 2>&1 | grep -i ssl
  ```
- **Fix según causa:**
  - Renovar certificado (Let's Encrypt lo hace automático)
  - Agregar la CA al trust store
  - Actualizar la versión de TLS soportada
  - Configurar SNI correctamente

### 4. Certificado expirado en producción
- **Síntoma:** el sitio deja de funcionar para todos los usuarios al mismo tiempo, errores de SSL
- **Causa:** el certificado TLS expiró y nadie lo renovó
- **Prevención:**
  - Let's Encrypt con auto-renovación (certbot)
  - Alertas cuando quedan 30/14/7 días para expirar
  - Monitorear: `openssl s_client -connect host:443 | openssl x509 -noout -dates`

### 5. Compresión mal negociada
- **Síntoma:** respuestas HTTP llegan como caracteres ilegibles, o el cuerpo está vacío
- **Causa:** el servidor comprimió con gzip pero el cliente no avisó que acepta gzip,
  o el cliente descomprime algo que no estaba comprimido
- **Diagnóstico:**
  ```bash
  curl -v -H "Accept-Encoding: gzip" https://api.ejemplo.com/data
  # Ver Content-Encoding en la respuesta
  ```
- **Fix:** asegurarse de enviar `Accept-Encoding: gzip` y manejar el `Content-Encoding` de la respuesta

### 6. Datos binarios interpretados como texto (o viceversa)
- **Síntoma:** archivos descargados están corruptos (imágenes que no abren, PDFs dañados)
- **Causa:** una imagen se transfirió como `text/plain` y el servidor convirtió los bytes de `\r\n` a `\n`
  (transformación de line endings en modo texto)
- **Fix:** usar `Content-Type: application/octet-stream` o el MIME type correcto para binarios

### 7. Formato de fecha incompatible entre sistemas
- **Síntoma:** errores de parseo de fechas, o fechas incorrectas al cruzar sistemas
- **Causa:** un sistema serializa `2026-04-28T15:00:00` (ISO 8601 UTC) y el otro interpreta
  como hora local, o uno usa timestamp en segundos y el otro en milisegundos
- **Fix:** siempre usar ISO 8601 con timezone explícito, documentar la unidad de timestamps

### 8. JSON con números grandes (integer overflow)
- **Síntoma:** IDs que llegan truncados o incorrectos en el frontend JavaScript
- **Causa:** JavaScript no puede representar enteros mayores a `2^53 - 1` (Number.MAX_SAFE_INTEGER).
  Un `bigint` de 64 bits de un backend Go/Java pierde precisión al parsearse como `Number` en JS
- **Ejemplo real:** Twitter tuvo este bug con sus IDs de tweets
- **Fix:** serializar IDs grandes como strings en JSON: `{"id": "1234567890123456789"}`

---

## TLS en detalle (porque es fundamental)

```
Cliente                         Servidor
  │                                │
  │── ClientHello ────────────────>│  "Soporto TLS 1.3, estos cipher suites"
  │<─ ServerHello ─────────────────│  "Usemos TLS 1.3 + AES-256-GCM"
  │<─ Certificate ─────────────────│  "Mi certificado (firmado por Let's Encrypt)"
  │   [Cliente verifica la firma]  │
  │── Finished ───────────────────>│  "OK, derivemos las claves"
  │<─ Finished ─────────────────── │
  │                                │
  │═══ Datos cifrados ════════════>│  A partir de acá todo va cifrado
```

Si cualquier paso falla → "TLS handshake failed". El error específico te dice cuál paso.

---

## Clave para recordar

> "Error de capa 6" = los datos llegaron pero no se pueden interpretar.
> JSON que no parsea, certificado expirado, encoding incorrecto, compresión mal negociada.
> Son errores que ocurren en tu aplicación, no en la red.

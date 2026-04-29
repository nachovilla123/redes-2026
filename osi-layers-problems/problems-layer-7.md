# Capa 7 — Aplicación (Application Layer)

## ¿Qué resuelve?

Es la capa donde viven los protocolos que usan directamente las aplicaciones para
comunicarse entre sí. Define el lenguaje de la conversación: qué significa un GET,
cómo funciona un query DNS, cómo se autentican dos sistemas.

**Protocolos:** HTTP/1.1, HTTP/2, HTTP/3, DNS, SMTP, FTP, WebSocket, gRPC, MQTT

---

## Es tu capa

Como dev backend/frontend, el 95% de lo que hacés vive acá.
Cada endpoint que definís, cada header que mandás, cada status code que retornás.

---

## Problemas reales de Capa 7

### 1. DNS failure — el clásico "works on my machine"
- **Síntoma:** la URL no resuelve, "Name or service not known", timeout al conectar
- **Causa:** el servidor DNS no responde, el registro no existe, o el TTL cacheó una IP vieja
- **Diagnóstico:**
  ```bash
  dig ejemplo.com                    # Hacer una query DNS manual
  dig @8.8.8.8 ejemplo.com          # Usar Google DNS en lugar del default
  nslookup ejemplo.com               # Alternativa
  # Si dig responde pero la app no → el resolver que usa la app es distinto
  ```
- **Fix:**
  - Si el registro DNS está mal: corregirlo y esperar el TTL
  - Si hay caché vieja: `nscd -i hosts` o forzar TTL bajo antes de migrar
  - En Docker/Kubernetes: el DNS interno del cluster puede tener problemas propios

### 2. DNS propagation lag después de migrar
- **Síntoma:** para algunos usuarios el sitio va a la IP nueva, para otros a la vieja
- **Causa:** los registros DNS tienen un TTL (Time To Live). Hasta que expira, los resolvers
  cachean la IP vieja. TTLs altos = propagación lenta.
- **Fix:**
  - Bajar el TTL a 60s con 24h de anticipación a la migración
  - Mantener el servidor viejo activo durante el tiempo del TTL viejo
  - Después de migrar, volver a subir el TTL

### 3. HTTP 5xx — errores del servidor
```
500 Internal Server Error   → excepción no manejada, bug en el código
502 Bad Gateway             → el proxy/load balancer no pudo conectar al backend
503 Service Unavailable     → el servidor está caído o sobrecargado
504 Gateway Timeout         → el backend respondió más lento que el timeout del proxy
```
- **Diagnóstico del 502/504:**
  ```bash
  # ¿El backend está corriendo?
  ss -tlnp | grep 3000
  # ¿El load balancer puede conectarse?
  curl -v http://backend-interno:3000/health
  ```

### 4. HTTP 4xx — errores del cliente
```
400 Bad Request             → payload malformado, parámetros incorrectos
401 Unauthorized            → no estás autenticado (falta el token)
403 Forbidden               → estás autenticado pero no tenés permiso
404 Not Found               → la ruta no existe
405 Method Not Allowed      → mandaste POST donde solo acepta GET
409 Conflict                → conflicto de estado (ej: ya existe el recurso)
422 Unprocessable Entity    → sintaxis correcta pero semántica inválida
429 Too Many Requests       → rate limiting
```

### 5. CORS (Cross-Origin Resource Sharing)
- **Síntoma:** el request funciona con curl/Postman pero falla en el browser con "CORS error"
- **Causa:** el browser bloquea requests entre orígenes distintos a menos que el servidor
  explícitamente lo permita con headers CORS
- **Diagnóstico:** ver en DevTools → Network → el request fallido → Response headers:
  ```
  Access-Control-Allow-Origin: *   (o el origen específico)
  ```
  Si este header no está → CORS error
- **Fix en el servidor:**
  ```javascript
  // Express
  app.use(cors({ origin: 'https://mi-frontend.com' }))
  
  // Headers manuales
  res.setHeader('Access-Control-Allow-Origin', 'https://mi-frontend.com')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  ```
- **Importante:** CORS es una política del browser, no de la red. Un curl no la aplica.

### 6. Rate limiting y throttling
- **Síntoma:** después de N requests, la API responde 429 Too Many Requests
- **Causa:** el servidor tiene un límite de requests por tiempo (rate limit)
- **Diagnóstico:** ver headers de respuesta:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1714320000
  Retry-After: 60
  ```
- **Fix en el cliente:** exponential backoff con jitter, respetar el `Retry-After`
- **Fix en el servidor:** implementar rate limiting con Redis (sliding window o token bucket)

### 7. Timeout mal configurado en cadena de servicios
- **Síntoma:** el usuario recibe un timeout del API gateway después de 30s, pero el backend
  sigue procesando durante 5 minutos más (trabajo perdido)
- **Causa:** los timeouts no están coordinados en la cadena: client → LB → API GW → service → DB
- **Fix:** los timeouts deben ser progresivamente más cortos de cliente a servidor:
  ```
  Cliente: 35s
  Load Balancer: 32s
  API Gateway: 30s
  Microservicio: 25s
  DB query: 20s
  ```
  Si el servicio hace trabajo largo, usar procesamiento asíncrono (queue) en lugar de request síncrono

### 8. WebSocket connection drops
- **Síntoma:** la conexión WebSocket se cae cada X minutos
- **Causa:** proxies, load balancers o firewalls cierran conexiones TCP ociosas.
  El WebSocket no manda datos entre mensajes y parece "idle".
- **Fix:**
  - Implementar ping/pong periódico (heartbeat): el cliente manda ping cada 30s
  - Configurar el proxy para no cerrar WebSockets (`proxy_read_timeout` en Nginx)
  - Implementar reconexión automática en el cliente

### 9. HTTP/2 multiplexing mal usado
- **Síntoma:** performance inesperadamente mala en HTTP/2 con muchos requests
- **Causa:** HTTP/2 multiplexa múltiples requests en una sola conexión TCP.
  Si hay head-of-line blocking (un stream lento bloquea los demás), o si el servidor
  tiene un límite bajo de streams concurrentes, se pierde el beneficio
- **Diagnóstico:**
  ```bash
  curl -v --http2 https://api.ejemplo.com/resource 2>&1 | grep "< HTTP"
  ```
- **Fix:** HTTP/3 (QUIC) soluciona el HoL blocking; ajustar `MAX_CONCURRENT_STREAMS`

### 10. gRPC deadline exceeded
- **Síntoma:** el cliente gRPC recibe `DEADLINE_EXCEEDED` aunque el servidor procesó la request
- **Causa:** el cliente fijó un deadline (timeout) que expiró antes de recibir la respuesta.
  A diferencia de HTTP, gRPC cancela el trabajo en el servidor cuando el cliente cancela.
- **Fix:**
  - Aumentar el deadline en el cliente
  - Optimizar el servidor para responder más rápido
  - Para trabajo largo: usar server streaming o una queue

### 11. SMTP y problemas de email
- **Síntoma:** los emails de tu app van a spam, o directamente no llegan
- **Causa:**
  - No tenés SPF, DKIM, o DMARC configurados en tu dominio
  - Tu IP de envío está en una blacklist
  - El contenido del email parece spam
- **Diagnóstico:**
  ```bash
  # Verificar registros DNS de email
  dig TXT ejemplo.com | grep spf
  dig TXT mail._domainkey.ejemplo.com  # DKIM
  dig TXT _dmarc.ejemplo.com           # DMARC
  ```
- **Fix:** configurar SPF, DKIM, DMARC. Usar un relay de email confiable (SendGrid, SES).

### 12. API versioning roto
- **Síntoma:** clientes que usaban `/v1/users` empiezan a fallar después de un deploy
- **Causa:** se modificó o eliminó un endpoint sin mantener la versión anterior
- **Fix:** nunca romper contratos existentes sin un período de deprecación,
  usar versionado en la URL (`/v2/`) o en headers (`API-Version: 2`)

---

## Herramientas de diagnóstico L7

```bash
curl -v https://api.ejemplo.com/endpoint      # Ver headers y respuesta completa
curl -I https://ejemplo.com                   # Solo headers
dig ejemplo.com                               # DNS lookup
http https://api.ejemplo.com/data             # HTTPie, más legible que curl
```

```javascript
// En el browser
fetch('/api/data')
  .then(r => { console.log(r.status, r.headers) })
```

---

## Mapa de status codes para debugging rápido

```
2xx → éxito
3xx → redirección (301 permanente, 302 temporal, 304 not modified/caché)
4xx → error del cliente (tu request está mal)
5xx → error del servidor (el backend falló)

El número exacto importa:
401 → autenticarte primero
403 → ya estás autenticado, pero no tenés permiso
404 → la URL no existe (¿typo? ¿ruta no registrada?)
429 → bajá el ritmo de requests
502 → el backend está caído
504 → el backend está vivo pero muy lento
```

---

## Clave para recordar

> L7 es donde vivís como dev. Cuando algo falla y ya confirmaste que la red funciona,
> el problema está en el protocolo: DNS, headers, status codes, timeouts, autenticación.
> `curl -v` es tu primer paso de diagnóstico siempre.

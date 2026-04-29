# Capa 5 — Sesión (Session Layer)

## ¿Qué resuelve?

Gestiona el ciclo de vida de una "conversación" entre dos aplicaciones:
establecer la sesión, mantenerla activa, y cerrarla ordenadamente.
También maneja la sincronización y el restablecimiento si se interrumpe.

**Protocolos:** NetBIOS, RPC, SQL sessions, NFS, SMB
**En la práctica:** en TCP/IP esta capa está "fusionada" con la capa de aplicación.
Cuando hablamos de "sesión" en web dev, generalmente nos referimos a sesiones HTTP o de autenticación —
que conceptualmente viven acá aunque técnicamente estén en L7.

---

## Cómo lo vivís como dev

Esta capa es la menos visible en la práctica moderna. TCP/IP la absorbió.
Pero los conceptos de sesión los usás todo el tiempo:

- **HTTP Session** (`req.session`, cookies de sesión)
- **Database connection** (una conexión Postgres es una sesión)
- **WebSocket** (una sesión persistente bidireccional)
- **SSH** (una sesión de terminal remota)
- **RPC calls** (gRPC mantiene una sesión HTTP/2 subyacente)

La diferencia con L4: TCP garantiza que los bytes lleguen.
L5 garantiza que la *conversación* tenga sentido de inicio a fin.

---

## Analogía

Es como una llamada telefónica. L4 es la línea telefónica (que los bits lleguen).
L5 es el protocolo social de la llamada: "Hola, soy X. Quiero hablar de Y. Chau."
Si la llamada se corta, L5 define si se puede reconectar y retomar desde donde estaba.

---

## Problemas reales de Capa 5

### 1. Session hijacking
- **Síntoma:** un usuario autenticado ve datos de otro usuario, o su sesión "roba" un atacante
- **Causa:** el session token es predecible o fue robado (XSS, sniffing en HTTP no cifrado)
- **Diagnóstico:** revisar logs de acceso con el mismo session ID desde IPs distintas
- **Fix:**
  - Tokens de sesión aleatorios criptográficamente seguros
  - Flag `HttpOnly` y `Secure` en cookies
  - Usar HTTPS siempre
  - Rotar el session ID después del login

### 2. Session fixation
- **Síntoma:** un atacante puede autenticarse con el session ID de la víctima
- **Causa:** la app no rota el session ID después de un login exitoso
- **Fix:** siempre generar un nuevo session ID después de autenticar al usuario

### 3. Session timeout mal configurado
- **Síntoma:** usuarios pierden su sesión demasiado pronto, o las sesiones nunca expiran (riesgo)
- **Causa:** timeout muy corto (UX mala) o sesiones sin expiración (seguridad mala)
- **Fix:**
  - Timeout de inactividad razonable (15-30 min para datos sensibles)
  - Expiración absoluta independiente del uso (ej: 8 horas máximo)
  - Renovación del timeout con actividad del usuario

### 4. Conexión a base de datos que se cae (idle session timeout)
- **Síntoma:** la primera query después de un período de inactividad falla con "connection closed"
- **Causa:** el servidor de DB (o un firewall en el medio) cierra conexiones TCP ociosas.
  Tu connection pool tiene handles a conexiones muertas.
- **Diagnóstico:**
  ```bash
  # En Postgres: ver conexiones y su estado
  SELECT pid, state, query, now() - state_change AS duration
  FROM pg_stat_activity;
  ```
- **Fix:**
  - Configurar keepalive en la conexión TCP
  - Usar `pool_ping` o `testOnBorrow` en el connection pool
  - Ajustar `idle_timeout` del pool para ser menor al timeout del servidor

### 5. Half-open sessions (conexiones zombie)
- **Síntoma:** el servidor cree que tiene conexiones activas con clientes que ya se fueron
- **Causa:** el cliente se desconectó abruptamente (crash, corte de red) sin mandar FIN.
  El servidor no lo sabe.
- **Fix:**
  - TCP keepalive: el OS envía pings periódicos para detectar conexiones muertas
  - Application-level heartbeat: mensajes periódicos (WebSocket ping/pong, gRPC keepalive)

### 6. Race condition en sesiones concurrentes
- **Síntoma:** datos corruptos cuando el mismo usuario abre múltiples tabs o hace requests paralelos
- **Causa:** dos requests leen y modifican la sesión al mismo tiempo sin locking
- **Fix:** usar sesiones atómicas (Redis con transacciones), o diseñar para que la sesión
  no tenga estado mutable que genere conflictos

### 7. SMB/NetBIOS session issues (entornos Windows/corporativos)
- **Síntoma:** "No se puede acceder a la carpeta compartida" en una red Windows
- **Causa:** sesión SMB rechazada por credenciales, versión de protocolo incompatible, o firewall bloqueando puerto 445
- **Diagnóstico:**
  ```bash
  smbclient -L //servidor -U usuario   # Listar shares
  ```
- **Fix:** verificar credenciales, habilitar la versión correcta de SMB (evitar SMBv1)

---

## Clave para recordar

> En TCP/IP moderno, L5 es casi invisible. Pero cuando tu sesión de base de datos
> muere silenciosamente, o cuando un session token es vulnerable, estás en territorio de Capa 5.
> 
> Regla de oro: **siempre rotar el session ID después del login.**

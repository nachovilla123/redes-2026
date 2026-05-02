import type { Flashcard } from "./clase1";

export const TOPIC7 = {
  title: "HTTP, HTTPS, TLS, JWT y Puertos",
  subtitle: "Unidad 4 · Clase 1",
  source: "HTTP/1.1, HTTP/2, HTTP/3, TLS, JWT, Puertos TCP/UDP",
};

export const flashcardsClase7: Flashcard[] = [
  // HTTP
  {
    id: 601,
    front: "¿Cuál es la estructura de una HTTP Request?",
    back: "Tiene tres partes:\n\n1. Request line:\n   GET /api/usuarios/42 HTTP/1.1\n   [método] [path] [versión]\n\n2. Headers: pares clave:valor, terminan con línea en blanco (\\r\\n\\r\\n)\n   Host: api.ejemplo.com (obligatorio en HTTP/1.1)\n   Content-Type: application/json\n   Authorization: Bearer <token>\n\n3. Body (opcional): solo en POST, PUT, PATCH\n   {\"nombre\": \"Nacho\"}\n\nLa línea en blanco entre headers y body es obligatoria.",
    tag: "HTTP",
    simulator: { animationId: "http-request", label: "HTTP Request/Response" },
  },
  {
    id: 602,
    front: "¿Cuáles son los métodos HTTP y qué es la idempotencia?",
    back: "| Método | Semántica | Tiene body |\n|---|---|---|\n| GET | Obtener | No |\n| POST | Crear | Sí |\n| PUT | Reemplazar completo | Sí |\n| PATCH | Modificar parte | Sí |\n| DELETE | Eliminar | Opcional |\n| HEAD | Como GET sin body | No |\n| OPTIONS | Qué métodos acepta | No |\n\nIdempotencia: una operación es idempotente si hacerla N veces tiene el mismo resultado que hacerla una sola vez.\n\nIdempotentes: GET, PUT, DELETE\nNO idempotente: POST (cada llamada puede crear un nuevo recurso)",
    tag: "HTTP",
  },
  {
    id: 603,
    front: "¿Qué significan los códigos de estado HTTP más importantes?",
    back: "2xx — Éxito:\n• 200 OK: todo bien\n• 201 Created: recurso creado\n• 204 No Content: bien, sin body\n\n3xx — Redirección:\n• 301 Moved Permanently: redirect permanente\n• 302 Found: redirect temporal\n\n4xx — Error del cliente:\n• 400 Bad Request: request mal formada\n• 401 Unauthorized: no autenticado\n• 403 Forbidden: autenticado pero sin permiso\n• 404 Not Found: recurso no existe\n• 429 Too Many Requests: rate limiting\n\n5xx — Error del servidor:\n• 500 Internal Server Error\n• 502 Bad Gateway\n• 503 Service Unavailable",
    tag: "HTTP",
  },
  {
    id: 604,
    front: "¿Cuáles son las diferencias entre HTTP/1.1, HTTP/2 y HTTP/3?",
    back: "HTTP/1.1 (1997):\n• Una request a la vez por conexión TCP\n• Headers en texto plano sin comprimir\n• Head-of-line blocking: si una respuesta tarda, bloquea las siguientes\n\nHTTP/2 (2015):\n• Multiplexing: múltiples requests simultáneas sobre UNA sola conexión TCP\n• Headers comprimidos (HPACK)\n• Binario en lugar de texto plano\n• Server push\n\nHTTP/3 (2022):\n• Reemplaza TCP por QUIC (UDP + confiabilidad en capa de aplicación)\n• Elimina el head-of-line blocking a nivel de transporte\n• Conexiones más rápidas (0-RTT en reconexiones)",
    tag: "HTTP",
  },
  {
    id: 605,
    front: "¿Qué pasa exactamente cuando hacés fetch('https://api.ejemplo.com/usuarios/42')?",
    back: "Paso 1: Parseo de URL → esquema https (puerto 443), host, path\n\nPaso 2: DNS → consulta al resolver para obtener la IP del host\n\nPaso 3: TCP 3-way handshake → SYN → SYN-ACK → ACK (al puerto 443)\n\nPaso 4: TLS Handshake → negociación de claves, verificación del certificado\n\nPaso 5: HTTP Request → GET /usuarios/42 HTTP/1.1 (encriptado dentro del canal TLS)\n\nPaso 6: Servidor procesa → busca en base de datos, construye respuesta\n\nPaso 7: HTTP Response → 200 OK + JSON (encriptado de vuelta)\n\nPaso 8: Browser parsea → response.json() → objeto JavaScript",
    tag: "HTTP",
  },
  // TLS
  {
    id: 606,
    front: "¿Qué agrega HTTPS sobre HTTP y cómo funciona el TLS Handshake?",
    back: "HTTPS = HTTP + TLS. Agrega:\n• Confidencialidad: contenido encriptado\n• Integridad: nadie puede modificar datos en tránsito sin que se detecte\n• Autenticación: el cliente verifica que habla con el servidor real\n\nTLS Handshake (simplificado):\n1. ClientHello: versiones TLS soportadas, cipher suites, clave DH efímera, random_C\n2. ServerHello + Certificado: versión/cipher elegidos, clave DH efímera, certificado, random_S\n3. Intercambio Diffie-Hellman → ambos derivan el mismo secreto compartido sin que viaje por la red\n4. Derivación de session keys: KDF(secreto_DH, random_C, random_S)\n5. Finished cifrado: confirma que ambos tienen las mismas claves\n\nDesde aquí: todo el HTTP viaja cifrado con AES (simétrico, rápido).",
    tag: "TLS",
    simulator: { animationId: "tls-handshake", label: "TLS Handshake paso a paso" },
  },
  {
    id: 607,
    front: "¿Por qué TLS usa tanto criptografía asimétrica como simétrica?",
    back: "Criptografía simétrica (ej: AES):\n• Una clave para cifrar y descifrar\n• Muy rápida\n• Problema: ¿cómo compartir la clave con alguien desconocido sin que la intercepten?\n\nCriptografía asimétrica (ej: RSA, ECDH):\n• Clave pública (la podés repartir) + clave privada (nunca sale)\n• Permite compartir secretos de forma segura\n• Problema: 1000x más lenta que la simétrica\n\nSolución de TLS: usa asimétrica SOLO para el handshake (para acordar una clave compartida de forma segura), y después simétrica para toda la comunicación real.",
    tag: "TLS",
  },
  {
    id: 608,
    front: "¿Qué es Perfect Forward Secrecy (PFS) y por qué importa?",
    back: "PFS: propiedad de que si alguien captura el tráfico cifrado hoy y en el futuro obtiene la clave privada del servidor, NO puede descifrar el tráfico pasado.\n\nCómo se logra en TLS 1.3: las claves Diffie-Hellman son EFÍMERAS — generadas solo para esa sesión y descartadas al terminar.\n\nSin PFS (TLS 1.2 sin DH efímero): con la clave privada del servidor podías descifrar TODO el tráfico histórico que hayas grabado.\n\nCon PFS: cada sesión tiene sus propias claves que ya no existen → el tráfico pasado es irrecuperable.",
    tag: "TLS",
  },
  // JWT
  {
    id: 609,
    front: "¿Qué es un JWT y cuál es su estructura?",
    back: "JWT (JSON Web Token): mecanismo stateless de autenticación. Tres partes en base64 separadas por puntos:\n\nHeader.Payload.Signature\n\nHeader: algoritmo y tipo\n{\"alg\": \"HS256\", \"typ\": \"JWT\"}\n\nPayload (claims — los datos):\n{\"userId\": 42, \"rol\": \"admin\", \"exp\": 1713101600}\n\nSignature:\nHMACSHA256(base64(header) + '.' + base64(payload), secreto)\n\nIMPORTANTE: el payload NO está cifrado — solo codificado en base64. Cualquiera puede leerlo. Nunca guardes contraseñas ni datos sensibles en un JWT.",
    tag: "JWT",
  },
  {
    id: 610,
    front: "¿Cómo verifica el servidor un JWT? ¿Por qué es difícil revocarlo?",
    back: "Verificación:\n1. Separa header + payload + firma\n2. Recalcula: HMACSHA256(header + '.' + payload, secreto_propio)\n3. Compara con la firma recibida → si no coinciden, rechaza\n4. Verifica que 'exp' no haya vencido\n\nEl servidor NO necesita consultar una base de datos — solo necesita su secreto.\n\nProblema de revocación: el servidor es stateless — no guarda registro de tokens emitidos. No puede invalidar un JWT antes de que venza.\n\nSoluciones:\n• Access tokens de vida corta (15 min) + refresh tokens de vida larga\n• Blacklist de tokens revocados (pero agrega estado)\n• Al cambiar contraseña, rotar el secreto de firma",
    tag: "JWT",
  },
  {
    id: 611,
    front: "JWT vs Cookies de sesión — ¿cuándo usar cada uno?",
    back: "| | Cookies de sesión | JWT |\n|---|---|---|\n| Estado en servidor | Sí (tabla de sesiones) | No |\n| Puede revocar | Sí (borrar la sesión) | Difícil |\n| Escala horizontal | Requiere Redis compartido | Fácil, cualquier servidor verifica |\n| Tamaño | Pequeño (solo el ID) | Más grande (lleva datos) |\n| Seguridad vs XSS | HttpOnly cookie es más segura | En localStorage es vulnerable |\n\nUsar cookies cuando: necesitás revocar sesiones fácilmente, app tradicional, un solo servidor.\nUsar JWT cuando: microservicios, múltiples backends, arquitectura distribuida.",
    tag: "JWT",
  },
  // Puertos
  {
    id: 612,
    front: "¿Qué son los puertos y por qué existen?",
    back: "Son 100% lógicos: un número de 16 bits en el header TCP o UDP.\n\nExisten para que el sistema operativo sepa a qué proceso entregarle cada paquete cuando múltiples aplicaciones comparten la misma IP.\n\n2^16 = 65536 valores → puertos del 0 al 65535\n\nTres rangos:\n• 0 – 1023: Well-known (privilegiados): servicios estándar, requieren root\n• 1024 – 49151: Registered: aplicaciones registradas en IANA (MySQL: 3306, PostgreSQL: 5432)\n• 49152 – 65535: Dynamic / Ephemeral: el OS los asigna automáticamente a conexiones salientes",
    tag: "Puertos",
  },
  {
    id: 613,
    front: "Puertos bien conocidos que hay que saber",
    back: "| Puerto | Protocolo | Servicio |\n|---|---|---|\n| 20/21 | TCP | FTP |\n| 22 | TCP | SSH |\n| 25 | TCP | SMTP |\n| 53 | UDP/TCP | DNS |\n| 67/68 | UDP | DHCP (servidor/cliente) |\n| 80 | TCP | HTTP |\n| 443 | TCP | HTTPS |\n| 853 | TCP | DNS over TLS (DoT) |\n| 3306 | TCP | MySQL |\n| 5432 | TCP | PostgreSQL |\n\nLos puertos well-known son convenciones, no obligaciones. Un servidor web puede correr en cualquier puerto, pero el cliente necesita saberlo.",
    tag: "Puertos",
  },
  {
    id: 614,
    front: "¿Qué son las conexiones persistentes (keep-alive) en HTTP?",
    back: "HTTP/1.0: una conexión TCP por request — el TCP handshake (y TLS) se repetía para cada recurso. Muy ineficiente.\n\nHTTP/1.1 introdujo keep-alive como comportamiento por defecto:\n• Se abre una conexión TCP una sola vez\n• Múltiples requests y responses viajan por esa misma conexión\n• La conexión permanece abierta (idle) hasta que alguno la cierra por timeout\n\n¿Están 'escuchándose mutuamente'? No exactamente — la conexión TCP está abierta pero sin datos. Como dejar el teléfono sin colgar.\n\nHTTP/2 lo lleva más lejos: una sola conexión para TODOS los recursos con multiplexing real.",
    tag: "HTTP",
  },
];

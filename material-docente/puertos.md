# Puertos — Qué son, cómo funcionan y por qué existen

---

## ¿Es físico o lógico?

**100% lógico.** No existe ningún componente de hardware llamado "puerto 80". Es un número en un campo de 16 bits dentro del header TCP o UDP. Nada más.

---

## ¿Por qué existen los puertos? (el problema real)

Tu PC tiene **una sola dirección IP**, pero al mismo tiempo tenés abierto:
- Chrome descargando una página
- Spotify sonando
- WhatsApp Web recibiendo mensajes
- Una sesión SSH a un servidor

Todo llega por la misma placa de red, a la misma IP. ¿Cómo sabe el sistema operativo a qué programa entregarle cada paquete?

**Con el puerto.** El SO usa la combinación `IP + puerto` para saber a quién le pertenece cada paquete.

```
Paquete llega a 192.168.1.5:443  →  OS lo entrega a Chrome
Paquete llega a 192.168.1.5:22   →  OS lo entrega al cliente SSH
Paquete llega a 192.168.1.5:4070 →  OS lo entrega a Spotify
```

Esto se llama **multiplexing** — muchos flujos de datos compartiendo una sola interfaz de red.

---

## El socket: la unidad real de comunicación

Una conexión no se identifica solo con un puerto. Se identifica con un **socket**, que es la combinación de 5 elementos:

```
protocolo | IP origen | puerto origen | IP destino | puerto destino
  TCP      192.168.1.5    54231        93.184.216.34      443
```

Ese quinteto identifica **una conexión única**. Por eso el mismo servidor en el puerto 443 puede atender miles de conexiones simultáneas — cada una tiene un puerto origen distinto en el cliente.

---

## ¿Por qué están limitados a 65535?

El campo "puerto" en el header TCP/UDP ocupa **16 bits**.

```
2^16 = 65536 valores posibles → puertos del 0 al 65535
```

Es una decisión de diseño del protocolo (RFC 793, año 1981). No hay razón técnica profunda más allá de eso — eligieron 16 bits y así quedó.

---

## Los tres rangos de puertos

| Rango | Nombre | Quién los usa |
|---|---|---|
| 0 – 1023 | Well-known (privilegiados) | Servicios estándar. Requieren root/admin para usarse |
| 1024 – 49151 | Registered | Aplicaciones registradas en IANA (Postgres: 5432, MySQL: 3306) |
| 49152 – 65535 | Dynamic / Ephemeral | El OS los asigna automáticamente a conexiones salientes |

**Puertos comunes que hay que saber:**

| Puerto | Protocolo | Servicio |
|---|---|---|
| 20/21 | TCP | FTP |
| 22 | TCP | SSH |
| 25 | TCP | SMTP |
| 53 | UDP/TCP | DNS |
| 67/68 | UDP | DHCP |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |

---

## ¿Cómo "escucha" un puerto? ¿Quién lo prende?

Un proceso de software hace una llamada al sistema operativo (syscall). El flujo es:

```
1. socket()    → el proceso pide al OS crear un socket
2. bind()      → el proceso dice "quiero el puerto 80"
3. listen()    → el proceso dice "estoy listo para recibir conexiones"
4. accept()    → bloquea el proceso esperando que llegue alguien
                 cuando llega una conexión, accept() despierta
                 y devuelve un nuevo socket para esa conexión específica
```

El OS mantiene una tabla de "quién tiene qué puerto". Si otro proceso intenta hacer `bind()` al mismo puerto, el OS lo rechaza con error `address already in use`.

Podés ver esa tabla con:
```bash
ss -tlnp        # Linux/Mac — puertos TCP en LISTEN
netstat -an     # alternativa clásica
lsof -i :80     # qué proceso usa el puerto 80
```

---

## ¿Están "codeados"? ¿Pueden cambiar?

Los puertos well-known son **convenciones**, no obligaciones técnicas. Podés correr tu servidor web en el puerto 9000 perfectamente — el problema es que el cliente necesita saberlo.

Cuando escribís `google.com` en el browser, el browser asume el puerto 443 (HTTPS) por convención. Si Google corriera su servidor en el 9000, tendrías que escribir `google.com:9000`.

---

## ¿Por qué se hacen proxies de puertos (port forwarding)?

Tres razones principales:

### 1. NAT — tu router tiene una sola IP pública
```
Internet → 200.45.1.10:80 → [Router NAT] → 192.168.1.5:80
```
Desde afuera solo existe la IP pública del router. El port forwarding le dice al router: "todo lo que llegue al puerto 80, mandalo a la PC interna 192.168.1.5:80".

### 2. Seguridad / firewall
Un proxy escucha en un puerto, inspecciona el tráfico, y lo reenvía. Permite filtrar, loguear o modificar tráfico antes de que llegue al destino real.

### 3. Túneles SSH
```bash
ssh -L 5432:db-interna:5432 usuario@servidor-bastión
```
Esto hace que el puerto 5432 de tu máquina local, al conectarse, viaje encriptado por SSH y salga en el servidor remoto apuntando a `db-interna:5432`. Útil para acceder a servicios que no están expuestos públicamente.

---

## ¿Cómo se "ocupa" un puerto y cuándo se libera?

En TCP, una conexión pasa por estados. Los más importantes:

```
LISTEN      → el servidor espera conexiones
ESTABLISHED → hay una conexión activa
TIME_WAIT   → la conexión cerró, pero el OS espera 2×MSL
              (entre 60s y 4 min) antes de liberar el puerto
              ephemeral del cliente
CLOSE_WAIT  → el otro lado cerró, pero este proceso no todavía
```

**TIME_WAIT** es importante: si un servidor hace muchas conexiones cortas (ej: un servicio REST muy cargado), puede quedarse sin puertos efímeros disponibles porque están todos en TIME_WAIT. Esto causa el error `cannot assign requested address`.

---

## Resumen de una oración por pregunta

- **¿Físico o lógico?** Lógico — es un número en el header TCP/UDP.
- **¿Por qué existen?** Para que el OS sepa a qué proceso entregarle cada paquete.
- **¿Por qué 65535?** El campo mide 16 bits → 2¹⁶ valores.
- **¿Están codeados?** Son convenciones. Cualquier servicio puede usar cualquier puerto.
- **¿Cómo escuchan?** Un proceso hace `bind()` + `listen()` y el OS le reserva el puerto.
- **¿Por qué proxies?** NAT, seguridad, túneles, redirección de tráfico.

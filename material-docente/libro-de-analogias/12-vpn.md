# Capítulo 12 — VPN: el túnel secreto

> **Pregunta clave:** ¿Cómo se puede comunicar de forma privada y segura a través de una red pública como internet?

---

## El problema que resuelve VPN

Internet es una red pública. Cualquier dato que viaja por ella puede, en teoría, ser interceptado en alguno de los muchos routers intermedios que toca.

Para una empresa, esto es un problema serio: los empleados que trabajan desde casa necesitan acceder a sistemas internos (servidores, bases de datos, archivos), pero esos sistemas están en la red privada de la empresa, no en internet.

¿Cómo conectar la red del empleado en casa con la red interna de la empresa, pasando por internet, de forma segura?

**Respuesta: VPN (Virtual Private Network).**

---

## La analogía: el tubo de vacío del banco

En algunas películas de bancos se ven esos tubos neumáticos que mandan documentos entre sucursales: ponés el documento en una cápsula sellada, la mandás por el tubo, y llega al otro lado intacta y privada.

El tubo pasa por lugares públicos (pasillos, calles), pero nadie puede abrirlo ni ver qué hay adentro.

Una **VPN** hace lo mismo con datos digitales:
1. Tomás tus datos
2. Los **encriptás** (nadie puede leerlos aunque los intercepte)
3. Los mandás por internet (la "calle pública")
4. Solo el receptor que tiene la **clave** puede desencriptarlos y leerlos

El "tubo" es virtual (no es un cable físico dedicado), pero el efecto es el mismo: privacidad sobre una red pública.

---

## Cómo funciona una VPN en la práctica

**Escenario:** Un empleado trabaja desde casa y necesita acceder al servidor interno de la empresa.

**Sin VPN:**
```
Casa (192.168.1.10) → Internet → ??? → Servidor interno empresa
                                  ↑
                         (el servidor no es accesible desde internet,
                          y aunque lo fuera, cualquiera podría interceptar)
```

**Con VPN:**
```
Casa → [Encriptación] → Túnel VPN por Internet → [Desencriptación] → Red interna empresa
                              ↑
                    (paquetes ilegibles para cualquier interceptor)
```

El cliente VPN en la computadora del empleado:
1. Encripta cada paquete antes de mandarlo
2. Lo envuelve en un nuevo paquete con destino el **servidor VPN de la empresa** (la entrada del túnel)
3. El servidor VPN de la empresa recibe el paquete, lo desencripta, y lo inyecta en la red interna como si hubiera venido de adentro

Desde la perspectiva del servidor interno, el empleado "está" en la red de la empresa, aunque físicamente esté en su casa en otro barrio.

---

## Protocolo: el tipo de "tubo"

Hay distintos protocolos que definen cómo se crea y protege el túnel:

### PPTP — Point to Point Tunneling Protocol
- Desarrollado por Microsoft
- Fácil de configurar
- Considerado **menos seguro** hoy en día (la encriptación puede ser débil)
- Casi no se usa en entornos serios

### L2TP — Layer 2 Tunneling Protocol
- Desarrollado por el IETF combinando PPTP y otro protocolo
- **Por sí solo no encripta** → generalmente se combina con IPSec para agregar encriptación
- L2TP/IPSec es una combinación muy usada y considerada segura

### IPSec
- El estándar más robusto para VPNs corporativas
- Opera en capa 3 (IP)
- Autentica y encripta cada paquete IP

---

## Casos de uso comunes

**Empleado trabajando desde casa:**
El más típico. La VPN hace que la computadora del empleado "pertenezca" a la red de la empresa, con acceso a todos sus recursos internos.

**Privacidad en WiFi público:**
Si usás el WiFi de un café o aeropuerto, cualquiera en la misma red puede intentar interceptar tu tráfico. Con una VPN, aunque intercepten los paquetes, solo ven datos encriptados ilegibles.

**Acceder a contenido con restricción geográfica:**
Si conectás a un servidor VPN en Estados Unidos, tu tráfico "parece" venir de allá. Los servicios que detectan tu ubicación por IP ven una IP estadounidense.

**Conectar dos oficinas de la misma empresa:**
La empresa tiene oficinas en Buenos Aires y Córdoba. Ambas tienen su propia red interna. Una VPN **site-to-site** las conecta como si fueran una sola red, aunque el tráfico entre ellas viaje por internet encriptado.

---

## Para recordar

> Una VPN no hace que internet sea más rápida ni más confiable. Lo que hace es agregar una capa de **privacidad y autenticación** sobre una red que por defecto no tiene ninguna. El "virtual" de Virtual Private Network significa que la privacidad es simulada por software sobre una infraestructura física compartida, no que haya cables dedicados físicamente.

---

*Capítulo anterior → [11 - NAT](11-nat.md)*
*Siguiente capítulo → [13 - ACL](13-acl.md)*

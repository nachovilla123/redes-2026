# Capítulo 11 — NAT: el portero del edificio

> **Pregunta clave:** ¿Cómo pueden miles de dispositivos de una casa u oficina salir a internet con una sola IP pública?

---

## El problema que resuelve NAT

En el mundo hay ~8.000 millones de personas. IPv4 solo permite ~4.300 millones de direcciones distintas. Matemáticamente, no alcanza para darle una IP pública a cada dispositivo.

Solución práctica: que muchos dispositivos **compartan una sola IP pública**, gracias a **NAT (Network Address Translation)**.

---

## La analogía: la empresa con una sola línea externa

Una empresa tiene 200 empleados pero una **sola línea telefónica pública** (el número que aparece en la guía). Cuando alguien de afuera llama, la recepcionista atiende y transfiere al interno correcto. Cuando un empleado llama hacia afuera, la recepcionista gestiona la llamada saliente usando la línea externa.

Nadie de afuera sabe cuántos empleados hay, ni cuáles son sus extensiones internas.

**Eso es exactamente NAT:**
- Tu router tiene **1 IP pública** (la que el ISP te asignó, la que ve internet)
- Tus dispositivos tienen **IPs privadas** (192.168.x.x — la que no sale a internet)
- El router es la recepcionista: gestiona todas las conexiones entrantes y salientes

---

## Cómo funciona paso a paso

**Tu PC (192.168.1.10) quiere acceder a Google (142.250.80.46):**

1. Tu PC genera un paquete:
   ```
   Origen: 192.168.1.10 : puerto 52341
   Destino: 142.250.80.46 : puerto 443
   ```

2. El paquete llega al router. El router **reemplaza** la IP privada por la IP pública y anota en su tabla NAT:
   ```
   Tabla NAT:
   192.168.1.10:52341  →  181.12.45.67:52341
   ```
   El paquete sale a internet como:
   ```
   Origen: 181.12.45.67 : puerto 52341
   Destino: 142.250.80.46 : puerto 443
   ```

3. Google responde al origen visible (la IP pública):
   ```
   Origen: 142.250.80.46 : puerto 443
   Destino: 181.12.45.67 : puerto 52341
   ```

4. El router recibe la respuesta, mira su tabla NAT, ve que el puerto 52341 corresponde a `192.168.1.10`, y **redirige** la respuesta a tu PC.

Tu PC recibe la respuesta. Todo transparente para vos.

---

## PAT: cuando varios dispositivos usan la misma IP pública

**PAT (Port Address Translation)** es la versión de NAT donde múltiples dispositivos comparten no solo la IP pública sino también los puertos para diferenciarse:

```
Tabla NAT con PAT:
Tu PC    192.168.1.10:52341  →  181.12.45.67:52341
Tu celu  192.168.1.20:49201  →  181.12.45.67:49201
Tu tele  192.168.1.30:58102  →  181.12.45.67:58102
```

Los tres dispositivos usan la misma IP pública (`181.12.45.67`) pero cada uno tiene un **puerto diferente** como identificador. El router sabe a quién mandarle cada respuesta mirando el número de puerto.

**Analogía:** Es como si la empresa tiene una sola línea externa pero un sistema que diferencia a cada empleado por el número de extensión que usan al llamar hacia afuera.

---

## Tipos de NAT

| Tipo | Cómo funciona | Cuándo se usa |
|---|---|---|
| **Estático** | Una IP privada siempre se mapea a la misma IP pública | Servidores internos que deben ser accesibles desde internet |
| **Dinámico** | Las IPs privadas se mapean a un pool de IPs públicas según disponibilidad | Empresas con varias IPs públicas |
| **PAT / Sobrecarga** | Muchas IPs privadas comparten una sola IP pública usando puertos | Hogares y PyMEs (el más común) |

---

## Ventajas y desventajas

### Ventajas

- **Ahorro de IPs públicas**: miles de dispositivos con una sola IP pública
- **Seguridad implícita**: desde internet no pueden iniciar conexiones directamente a tus dispositivos privados. El router solo reenvía respuestas a conexiones que vos iniciaste.
- **Flexibilidad interna**: podés reorganizar tu red privada sin que internet se entere

### Desventajas

- **Complica aplicaciones P2P**: en videollamadas, torrents o juegos online, a veces el otro lado necesita iniciar la conexión hacia vos → NAT lo bloquea (hay técnicas como "NAT traversal" para resolverlo)
- **Más procesamiento en el router**: el router tiene que leer y modificar cada paquete
- **Dificulta el debugging de red**: desde afuera, todos los dispositivos de la empresa "parecen" tener la misma IP

---

## Para recordar

> NAT es la razón por la que Internet todavía funciona con IPv4 a pesar de que las IPs se "acabaron" hace años. Sin NAT, cada dispositivo nuevo necesitaría su propia IP pública y el sistema colapsaría. IPv6 (con 340 undecillones de direcciones) busca hacer NAT innecesario, pero mientras eso pasa, NAT es lo que mantiene la red funcionando.

---

*Capítulo anterior → [10 - Direccionamiento IP](10-direccionamiento-ip.md)*
*Siguiente capítulo → [12 - VPN](12-vpn.md)*

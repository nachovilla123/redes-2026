# Capítulo 02 — Tipos de Redes: LAN, MAN, WAN, GAN

> **Pregunta clave:** ¿Cómo se clasifican las redes según su tamaño geográfico?

---

## La analogía: los sistemas de transporte por distancia

Pensá en los medios de transporte según hasta dónde llegan:

| Transporte | Alcance | Red equivalente |
|---|---|---|
| Caminar por tu casa | Tu propio edificio | **LAN** |
| Colectivo de la ciudad | Buenos Aires entera | **MAN** |
| Avión o tren de larga distancia | Entre provincias y países | **WAN** |
| Sistema de transporte global combinado | Cualquier lugar del planeta | **GAN / Internet** |

---

## LAN — Local Area Network (Red de Área Local)

**Alcance:** un edificio o campus pequeño.
**Dueño:** generalmente una sola organización.
**Velocidad:** muy alta (porque las distancias son cortas).

**Ejemplo real:** La red WiFi de tu casa conecta tu notebook, tu teléfono y la Smart TV. Todas forman una LAN. Son tuyas, las controlás vos, y nadie de afuera puede entrar directamente.

**Otro ejemplo:** La red de computadoras de una aula en la UTN. Todos los equipos están en la misma LAN, comparten recursos (impresoras, archivos del servidor) y van muy rápido entre sí.

La LAN puede ser:
- **Con cable** (Ethernet): más rápida y estable
- **Inalámbrica** (WiFi): más cómoda, permite moverse

---

## MAN — Metropolitan Area Network (Red de Área Metropolitana)

**Alcance:** una ciudad.
**Dueño:** puede ser privado o público.
**Velocidad:** alta.

**Ejemplo real:** La red de Fibertel/Telecentro que conecta miles de hogares en Buenos Aires. Los cables pasan por las calles, las cañerías, los postes — eso es una MAN. Ellos son los dueños de la infraestructura de la ciudad.

**Otro ejemplo:** El sistema de cámaras de tráfico de la Ciudad de Buenos Aires, todas conectadas a un centro de monitoreo central.

---

## WAN — Wide Area Network (Red de Área Amplia)

**Alcance:** países o continentes.
**Dueño:** usa infraestructura compartida entre múltiples organizaciones.
**Velocidad:** más variable (depende del proveedor y la distancia).

**Ejemplo real:** Cuando accedés a un servidor de Amazon en Estados Unidos, tu paquete de datos atraviesa una WAN. Viaja por cables de fibra óptica submarinos que cruzan el Atlántico — cables que son de empresas específicas y que alquilan capacidad a todos.

La WAN tiene dos formas de transportar datos:

### Conmutación de Circuitos (WAN vieja)
Reservás un camino completo antes de hablar, como una llamada telefónica clásica. El canal es tuyo mientras dura la llamada, aunque no estés diciendo nada.

### Conmutación de Paquetes (WAN moderna)
Los datos van en sobrecitos (paquetes) que viajan por donde pueden, compartiendo el camino con datos de todos. Es como el correo: muchas cartas de distintos remitentes viajan juntas en el mismo camión.

---

## GAN — Global Area Network (Red de Área Global)

**Alcance:** ilimitado, el planeta entero.

Una GAN es una red compuesta de distintas redes interconectadas. La conocemos como **internet** (con minúscula — es el concepto genérico).

**Ojo con la diferencia:**
- **internet** (minúscula): cualquier conjunto de redes interconectadas. Una empresa puede tener su propia "internet" privada.
- **Internet** (mayúscula): la red global específica que todos usamos. Es una GAN particular, la más grande del mundo.

---

## Resumen visual

```
Tu cuarto  →  LAN  →  MAN  →  WAN  →  GAN (Internet)
  (WiFi)      (edificio)  (ciudad)  (país/mundo)  (todo)
```

Cada red más grande "envuelve" a las más chicas. Tu LAN se conecta a una MAN (el cable de tu ISP), que se conecta a una WAN (la red troncal del ISP), que forma parte de Internet (la GAN).

---

*Capítulo anterior → [01 - Modelo de Comunicaciones](01-modelo-de-comunicaciones.md)*
*Siguiente capítulo → [03 - Conmutación de Circuitos vs Paquetes](03-conmutacion-circuitos-vs-paquetes.md)*

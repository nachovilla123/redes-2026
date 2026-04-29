# Capítulo 10 — Direccionamiento IP, Subredes y CIDR

> **Pregunta clave:** ¿Cómo se identifican los dispositivos en internet? ¿Cómo se divide una red en partes más pequeñas?

---

## La analogía central: la dirección postal en dos partes

Una dirección postal tiene estructura jerárquica:
- **"Av. Corrientes 1234, CABA"** → identifica el edificio (la red)
- **"Dpto 5B"** → identifica quién dentro del edificio (el host)

Una dirección IP funciona igual:
- **Prefijo (network)**: identifica la red — como el barrio y la calle
- **Sufijo (host)**: identifica el dispositivo dentro de esa red — como el departamento

Sin las dos partes, el cartero (el router) no sabe a dónde llevar el dato.

---

## El formato IPv4

Una dirección IPv4 son **32 bits** escritos como 4 números decimales separados por puntos:

```
192  .  168  .   1   .  100
 ↑        ↑       ↑       ↑
8 bits  8 bits  8 bits  8 bits   =  32 bits totales
(0-255) (0-255) (0-255) (0-255)
```

`192.168.1.100` es la forma humana de leer `11000000.10101000.00000001.01100100`.

---

## Las Clases de IP (el sistema histórico)

Cuando se diseñó IP, se dividieron las direcciones en clases según el tamaño de la organización:

| Clase | Primer octeto | Rango | Redes posibles | Hosts por red |
|---|---|---|---|---|
| **A** | Empieza con 0 | 1.x.x.x — 126.x.x.x | 126 redes | 16.777.214 hosts |
| **B** | Empieza con 10 | 128.x.x.x — 191.x.x.x | 16.384 redes | 65.534 hosts |
| **C** | Empieza con 110 | 192.x.x.x — 223.x.x.x | 2.097.152 redes | 254 hosts |
| **D** | Empieza con 1110 | 224.x.x.x — 239.x.x.x | Multicast | — |
| **E** | Empieza con 1111 | 240.x.x.x — 255.x.x.x | Experimental | — |

**Analogía de las clases:**
- **Clase A**: como una megaempresa con un edificio de 16 millones de departamentos. Pocas empresas en el mundo tienen tanta gente.
- **Clase B**: como una empresa grande con 65.000 empleados.
- **Clase C**: como una PyME con hasta 254 personas.

**El problema del sistema de clases:** Era muy rígido. Si necesitabas 300 hosts, te daban una Clase B (65.000 hosts) y desperdiciabas 64.700 direcciones. Por eso se inventaron las subredes y CIDR.

---

## La Máscara de Subred

La máscara le dice al router qué parte de la IP es la **red** y qué parte es el **host**.

- Bits en `1` en la máscara → esa parte de la IP es la red
- Bits en `0` en la máscara → esa parte de la IP es el host

**Máscaras naturales (por clase):**
```
Clase A: 255.0.0.0     →  /8   (8 bits de red, 24 bits de host)
Clase B: 255.255.0.0   →  /16  (16 bits de red, 16 bits de host)
Clase C: 255.255.255.0 →  /24  (24 bits de red, 8 bits de host)
```

**Cómo usar la máscara:** hacés una operación AND entre la IP y la máscara para obtener la dirección de red.

```
IP:      192.168.1.100  →  11000000.10101000.00000001.01100100
Máscara: 255.255.255.0  →  11111111.11111111.11111111.00000000
AND:     192.168.1.0    →  11000000.10101000.00000001.00000000
                                                       ↑ dirección de red
```

---

## Subredes: dividir el barrio en manzanas

Tenés la red `200.10.10.0/24` (Clase C, 254 hosts posibles). Pero necesitás dividirla en 3 departamentos separados: Contabilidad (60 hosts), RRHH (60 hosts), Sistemas (60 hosts).

La solución: "robarle" bits al campo de host para crear sub-redes.

**Analogía:** Tenés un edificio con 254 departamentos todos en un único piso. Querés dividirlo en 4 pisos de ~60 departamentos cada uno. Agregás paredes divisorias (los bits extra de máscara).

Con máscara `/26` (255.255.255.192) tomás 2 bits del campo host:
- 2 bits extra de red → 2² = 4 subredes posibles
- Quedan 6 bits de host → 2⁶ = 64 direcciones por subred (62 utilizables, restando la de red y la de broadcast)

```
Subred 1: 200.10.10.0   — 200.10.10.63    (hosts: .1 a .62)
Subred 2: 200.10.10.64  — 200.10.10.127   (hosts: .65 a .126)
Subred 3: 200.10.10.128 — 200.10.10.191   (hosts: .129 a .190)
Subred 4: 200.10.10.192 — 200.10.10.255   (hosts: .193 a .254)
```

### Direcciones especiales de cada subred

En cada subred, dos direcciones están reservadas:
- **Primera dirección** (host = todos ceros): es la **dirección de red**. Identifica la subred, no se asigna a ningún host.
- **Última dirección** (host = todos unos): es la **dirección de broadcast**. Los paquetes mandados a esta dirección llegan a todos los hosts de la subred.

---

## CIDR: la notación moderna

En lugar de escribir la máscara como un número largo, se escribe directamente cuántos bits son de red:

```
192.168.1.0  con máscara 255.255.255.0   →   192.168.1.0/24
10.0.0.0     con máscara 255.0.0.0       →   10.0.0.0/8
192.168.1.0  con máscara 255.255.255.192 →   192.168.1.0/26
```

El número después de `/` es la cantidad de bits de red (la longitud del prefijo).

**CIDR (Classless Inter-Domain Routing)** va más allá: permite romper las fronteras de las clases y asignar bloques de cualquier tamaño. Si necesitás 500 hosts, podés tener una `/23` (510 hosts disponibles) en lugar de desperdiciar una Clase B entera.

### Cómo calcular un bloque CIDR

Ejemplo: `32.4.3.16/26`

1. La máscara `/26` en binario: `11111111.11111111.11111111.11000000`
2. IP en binario: `00100000.00000100.00000011.00010000`
3. AND con la máscara → primera dirección del bloque: `00100000.00000100.00000011.00000000` = `32.4.3.0`
4. Complemento de la máscara: `00000000.00000000.00000000.00111111`
5. OR con la primera dirección → última dirección: `32.4.3.63`
6. Número de direcciones: 2^(32-26) = 2^6 = 64

---

## Direcciones Privadas: el barrio cerrado

Estas rangos están reservados para uso interno. **Nunca deben aparecer en Internet**:

| Bloque | Rango | Uso típico |
|---|---|---|
| `10.0.0.0/8` | 10.0.0.0 — 10.255.255.255 | Redes empresariales grandes |
| `172.16.0.0/12` | 172.16.0.0 — 172.31.255.255 | Redes empresariales medianas |
| `192.168.0.0/16` | 192.168.0.0 — 192.168.255.255 | Hogares y PyMEs |

**Ejemplo real:** Tu router WiFi de casa tiene una IP pública (la que te da tu ISP, ej: `181.12.45.67`) y le asigna IPs privadas a tus dispositivos (`192.168.1.10`, `192.168.1.11`, etc.). Los dispositivos de tu vecino también tienen `192.168.1.x` — no hay conflicto porque nunca salen a internet con esas IPs directamente (el NAT lo resuelve, ver Capítulo 11).

---

## VLSM: máscaras de longitud variable

El problema de subnetting clásico: todas las subredes tienen el mismo tamaño. Pero ¿qué pasa si necesitás una subred de 100 hosts, otra de 20 y otra de 5?

**VLSM (Variable Length Subnet Mask)** permite asignar máscaras distintas a cada subred, optimizando el uso de direcciones:

- Subred grande (100 hosts) → `/25` (126 hosts disponibles)
- Subred mediana (20 hosts) → `/27` (30 hosts disponibles)
- Subred chica (5 hosts) → `/29` (6 hosts disponibles)

**Analogía:** En lugar de cortar el edificio en pisos iguales, hacés pisos de distintas alturas según la cantidad de gente que va en cada uno.

---

*Capítulo anterior → [09 - Switch y VLAN](09-switch-y-vlan.md)*
*Siguiente capítulo → [11 - NAT](11-nat.md)*

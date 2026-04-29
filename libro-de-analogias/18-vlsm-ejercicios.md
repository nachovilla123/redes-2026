# Capítulo 18 — VLSM: ejercicios resueltos paso a paso

> **Pregunta clave:** Tengo una red y necesito dividirla en subredes de distintos tamaños. ¿Cómo lo hago sin desperdiciar direcciones?

---

## Repaso rápido: ¿qué es VLSM?

VLSM (Variable Length Subnet Mask) = subnetting donde cada subred puede tener una máscara diferente.

**Regla de oro:** ordenar los requerimientos de **mayor a menor** cantidad de hosts y asignarlos en ese orden, empezando desde la primera dirección disponible.

---

## La fórmula base

Para una subred con **N hosts requeridos**:

1. Necesitás **N + 2** direcciones (N hosts + dirección de red + broadcast)
2. Buscás la potencia de 2 más chica que sea ≥ N + 2
3. Los bits de host = log₂(esa potencia) → la máscara = /32 − bits de host

| Hosts requeridos | N+2 | Potencia de 2 | Bits host | Máscara |
|---|---|---|---|---|
| 2 hosts | 4 | 4 = 2² | 2 | /30 |
| 6 hosts | 8 | 8 = 2³ | 3 | /29 |
| 14 hosts | 16 | 16 = 2⁴ | 4 | /28 |
| 28 hosts | 30 | 32 = 2⁵ | 5 | /27 |
| 62 hosts | 64 | 64 = 2⁶ | 6 | /26 |
| 126 hosts | 128 | 128 = 2⁷ | 7 | /25 |
| 254 hosts | 256 | 256 = 2⁸ | 8 | /24 |

---

## Ejercicio 1 — Del final de Cicerchia (cicerchia.pdf)

**Red base:** `172.16.32.0/24`

**Requerimientos:**
- A: 14 hosts (Sucursal A)
- B: 28 hosts (Sucursal B — debajo del router izquierdo)
- C: 2 hosts (enlace entre routers)
- D: 7 hosts (Sucursal D)
- E: 28 hosts (Sucursal E)

**Restricción:** reservar subred CERO y la subred de mayor ID para usos futuros.

---

### Paso 1: ordenar de mayor a menor

1. B: 28 hosts
2. E: 28 hosts
3. A: 14 hosts
4. D: 7 hosts
5. C: 2 hosts

---

### Paso 2: determinar la máscara de cada una

- B (28 hosts): 28+2=30 → necesito 32 → /27 (32 hosts, 30 usables)
- E (28 hosts): igual → /27
- A (14 hosts): 14+2=16 → /28 (16 hosts, 14 usables)
- D (7 hosts): 7+2=9 → necesito 16 → /28 (16 hosts, 14 usables)
- C (2 hosts): 2+2=4 → /30 (4 hosts, 2 usables)

---

### Paso 3: asignar desde la primera dirección disponible

La red base es `172.16.32.0/24` → las direcciones van de `172.16.32.0` a `172.16.32.255`.

**Restricción: reservar la subred CERO** → no usamos `172.16.32.0/27` (la primera).

La primera /27 disponible empieza en `172.16.32.32`.

**Subred B** → /27 (bloque de 32 direcciones):
- Red: `172.16.32.32/27`
- Rango hosts: `172.16.32.33` — `172.16.32.62`
- Broadcast: `172.16.32.63`

**Subred E** → /27 (siguiente bloque de 32):
- Red: `172.16.32.64/27`
- Rango hosts: `172.16.32.65` — `172.16.32.94`
- Broadcast: `172.16.32.95`

**Subred A** → /28 (bloque de 16):
- Red: `172.16.32.96/28`
- Rango hosts: `172.16.32.97` — `172.16.32.110`
- Broadcast: `172.16.32.111`

**Subred D** → /28 (siguiente bloque de 16):
- Red: `172.16.32.112/28`
- Rango hosts: `172.16.32.113` — `172.16.32.126`
- Broadcast: `172.16.32.127`

**Subred C** → /30 (bloque de 4):
- Red: `172.16.32.128/30`
- Rango hosts: `172.16.32.129` — `172.16.32.130`
- Broadcast: `172.16.32.131`

---

### Tabla final Ejercicio 1

| Subred | Dirección de red / máscara | Rango hosts asignables | Broadcast |
|---|---|---|---|
| B (28 hosts) | 172.16.32.32/27 | .33 — .62 | 172.16.32.63 |
| E (28 hosts) | 172.16.32.64/27 | .65 — .94 | 172.16.32.95 |
| A (14 hosts) | 172.16.32.96/28 | .97 — .110 | 172.16.32.111 |
| D (7 hosts) | 172.16.32.112/28 | .113 — .126 | 172.16.32.127 |
| C (2 hosts) | 172.16.32.128/30 | .129 — .130 | 172.16.32.131 |

---

## Ejercicio 2 — Del final 2022

**Red base:** `172.35.0.0/16`

**Requerimientos:**
- Subred 1: 2020 hosts
- Subred 2: 1010 hosts

**Restricción: la subred CERO es asignable** (no se reserva).

---

### Paso 1: ordenar y calcular máscaras

- Subred 1 (2020 hosts): 2020+2=2022 → siguiente potencia de 2 = 2048 = 2¹¹ → /21 (2046 usables)
- Subred 2 (1010 hosts): 1010+2=1012 → siguiente potencia de 2 = 1024 = 2¹⁰ → /22 (1022 usables)

---

### Paso 2: asignar desde el inicio (subred cero asignable)

**Subred 1 (2020 hosts)** → /21 (bloque de 2048):
- Red: `172.35.0.0/21`
- Rango hosts: `172.35.0.1` — `172.35.7.254`
- Broadcast: `172.35.7.255`

**Subred 2 (1010 hosts)** → /22 (bloque de 1024):
- Red: `172.35.8.0/22`
- Rango hosts: `172.35.8.1` — `172.35.11.254`
- Broadcast: `172.35.11.255`

---

### Tabla final Ejercicio 2

| Subred | Dirección de red / máscara | Rango hosts asignables | Broadcast |
|---|---|---|---|
| 1 (2020 hosts) | 172.35.0.0/21 | 172.35.0.1 — 172.35.7.254 | 172.35.7.255 |
| 2 (1010 hosts) | 172.35.8.0/22 | 172.35.8.1 — 172.35.11.254 | 172.35.11.255 |

---

## Cómo verificar que un rango es correcto

Para verificar que una subred está bien calculada:

1. **Dirección de red**: aplicar la máscara a cualquier IP del rango (AND bit a bit) → debe dar la dirección de red
2. **Broadcast**: complementar la máscara (todos los 0 pasan a 1) y hacer OR con la dirección de red
3. **Cantidad de hosts**: 2^(bits de host) − 2

**Ejemplo de verificación para 172.16.32.64/27:**
- Bloque: 2^5 = 32 → empieza en .64, termina en .64+32-1 = .95
- Hosts: 32 − 2 = 30 ✓

---

## Errores comunes a evitar

- **Olvidar la subred cero**: leer el enunciado con cuidado. A veces es asignable, a veces no.
- **No ordenar de mayor a menor**: si empezás con las chicas, las grandes no entran en el espacio que queda.
- **Confundir hosts requeridos con tamaño del bloque**: para 14 hosts necesitás bloque de 16 (no de 14).
- **Olvidar restar 2**: dirección de red y broadcast no son asignables a hosts.

---

*Capítulo anterior → [17 - Fragmentación IPv4](17-fragmentacion-ip.md)*

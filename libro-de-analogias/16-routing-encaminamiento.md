# Capítulo 16 — Routing: cómo los paquetes encuentran el camino

> **Pregunta clave:** Cuando un paquete sale de tu computadora hacia un servidor en otro país, ¿quién decide por dónde va? ¿Cómo se aprende esa información?

---

## La analogía: el sistema de GPS de la red

Un router es como un punto de navegación en una ruta. Cuando un paquete llega, el router mira la dirección destino y decide: "para llegar allá, te mando por esta salida".

Para poder tomar esa decisión, el router necesita un **mapa**: la **tabla de rutas**.

---

## La Tabla de Rutas

Es la lista que tiene cada router con las redes que conoce y cómo llegar a ellas.

Ejemplo de lo que muestra `show ip route` en un router Cisco:

```
C    10.0.0.0/24 is directly connected, FastEthernet0/0
S    192.168.1.0/24 [1/0] via 10.0.0.1
O    172.16.0.0/16 [110/20] via 10.0.0.1, Serial0/0/0
R    10.10.0.0/16 [120/1] via 10.0.0.2
```

Cada letra al inicio indica **cómo aprendió esa ruta**:
- `C` → **Connected**: red directamente conectada a una interfaz del router
- `S` → **Static**: configurada a mano por el administrador
- `O` → **OSPF**: aprendida dinámicamente por el protocolo OSPF
- `R` → **RIP**: aprendida dinámicamente por el protocolo RIP
- `D` → **EIGRP**, `B` → **BGP**, etc.

Los números entre corchetes `[110/20]` son la **distancia administrativa** / **métrica**:
- El primer número (110) = distancia administrativa: qué tan confiable es la fuente (menos = más confiable)
- El segundo número (20) = métrica: costo para llegar (menos = mejor camino)

---

## Tipos de Rutas

### Ruta Directamente Conectada (C)
El router tiene una interfaz en esa red. La aprende automáticamente cuando levantás la interfaz.

### Ruta Estática (S)
El administrador la configura a mano. Es simple y predecible, pero no se adapta automáticamente si algo falla.

**Cuándo usarla:** redes pequeñas, o para definir una ruta por defecto ("si no sé a dónde mandar esto, mandalo acá").

Ruta por defecto: `0.0.0.0/0` — coincide con cualquier destino. Es el "último recurso".

### Rutas Dinámicas
Los routers las aprenden solos intercambiando información entre ellos mediante **protocolos de routing**.

---

## Sistemas Autónomos (AS)

Internet no es una sola red gestionada por uno. Es una colección de redes independientes, cada una gestionada por una organización diferente (tu ISP, Google, Amazon, Telecom Argentina, etc.).

Cada una de esas redes independientes es un **Sistema Autónomo (AS)**, identificado por un número (ASN).

Por eso hay dos tipos de protocolos de routing:
- **IGP (Interior Gateway Protocol):** para rutear *dentro* de un AS → RIP, OSPF, EIGRP
- **EGP (Exterior Gateway Protocol):** para rutear *entre* AS → BGP

---

## RIP — Routing Information Protocol

**Tipo:** IGP, algoritmo de vector de distancia  
**Métrica:** cantidad de saltos (hops) — cada router que se atraviesa cuenta como 1  
**Límite:** máximo 15 saltos. Si un destino está a 16 hops → se considera inalcanzable  
**Actualización:** cada 30 segundos envía su tabla de rutas completa a los vecinos

**Analogía:** RIP es como preguntarle a tu vecino "¿cuántas cuadras tengo que caminar para llegar al centro?". Él te dice lo que sabe y vos sumás 1 por haber pasado por su casa.

**Problema:** converge lento. Si una ruta falla, puede tardar varios minutos en que todos los routers se enteren.

---

## OSPF — Open Shortest Path First

**Tipo:** IGP, algoritmo de estado de enlace (link-state)  
**Métrica:** costo (basado en el ancho de banda del enlace, menos costo = más rápido)  
**Límite:** no tiene límite de saltos  
**Funcionamiento:** cada router conoce la topología completa del AS y calcula el camino más corto con el algoritmo de Dijkstra

**Analogía:** OSPF es como tener el mapa completo de la ciudad en tu cabeza. Sabés exactamente qué calles hay y calculás vos mismo el mejor camino.

**Ventaja sobre RIP:** converge mucho más rápido, escala mejor, no tiene límite de saltos.  
**Distancia administrativa:** 110 (menor que RIP=120, por eso OSPF se prefiere sobre RIP si ambos están activos)

---

## BGP — Border Gateway Protocol

**Tipo:** EGP — el protocolo de routing de Internet  
**Usado entre:** sistemas autónomos (entre ISPs, entre empresas y sus ISPs)  
**Métrica:** no usa una métrica simple, considera políticas, relaciones comerciales, cantidad de AS que cruza (AS-PATH)

**Analogía:** Si RIP y OSPF son el GPS interno de una empresa para moverse entre sus oficinas, BGP es el sistema de acuerdos entre países para saber qué aviones pueden cruzar qué espacio aéreo y por dónde.

BGP no busca el camino más rápido — busca el camino más "conveniente" según políticas. Un ISP puede preferir mandar tráfico por una ruta más larga si tiene un acuerdo comercial con ese camino.

---

## Comparación de protocolos

| | RIP | OSPF | BGP |
|---|---|---|---|
| Tipo | IGP | IGP | EGP |
| Algoritmo | Vector de distancia | Estado de enlace | Path vector |
| Métrica | Hops (máx 15) | Costo (ancho de banda) | AS-PATH + políticas |
| Convergencia | Lenta | Rápida | Lenta pero estable |
| Escala | Redes pequeñas | Redes medianas/grandes | Internet (enorme) |
| Dist. administrativa | 120 | 110 | 20 (eBGP) / 200 (iBGP) |

---

## Cómo leer una tabla de rutas en el parcial

Ejemplo del final de Cicerchia:

```
C    10.0.0.0/24 is directly connected
D    10.3.0.0/90 via 10.2.0.2
D    10.4.0.0/90 via 10.2.0.2
```

Para determinar qué redes son **alcanzables** desde un router:
1. Las redes `C` (connected) siempre son alcanzables
2. Las redes aprendidas (`D`=EIGRP, `O`=OSPF, `R`=RIP, `S`=static) son alcanzables si el next-hop es alcanzable
3. Si una red **no aparece en la tabla** → no es alcanzable desde ese router

---

## Resumen para el parcial

- Los routers usan **tablas de rutas** para decidir por dónde mandar cada paquete
- Las rutas pueden ser: directamente conectadas (C), estáticas (S), o dinámicas (O, R, D, B)
- Un **Sistema Autónomo (AS)** es una red bajo un mismo control administrativo
- **RIP**: simple, vector de distancia, máx 15 hops, converge lento
- **OSPF**: link-state, usa Dijkstra, sin límite de saltos, converge rápido, el más común en empresas
- **BGP**: entre sistemas autónomos, es el protocolo de Internet, usa políticas

---

*Capítulo anterior → [15 - ARQ y Ventanas Deslizantes](15-arq-ventanas-deslizantes.md)*
*Siguiente capítulo → [17 - Fragmentación IPv4](17-fragmentacion-ip.md)*

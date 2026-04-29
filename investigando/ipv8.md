# IPv8 — Internet Protocol Version 8

> Draft IETF publicado el 14 de abril de 2026 por J. Thain (One Limited).
> Todavía **no es un estándar oficial**. Es una propuesta en etapa inicial.

---

## Analogía: el sistema de direcciones postales

Imaginá que el mundo es una ciudad enorme y cada dispositivo conectado a internet es una casa.

**IPv4** es como el sistema de direcciones antiguo: las calles tienen números del 1 al 255, los barrios también, y así sucesivamente. Alcanzaba para una ciudad chica, pero el mundo creció tanto que se están terminando las combinaciones posibles. Ya casi no quedan "números de casa" disponibles — ese es el problema del **agotamiento de IPv4**.

**IPv6** llegó como solución: en vez de números del 1 al 255, usó un sistema gigante con letras y números mezclados, capaz de generar direcciones prácticamente infinitas. El problema: cambiar todo el sistema de direcciones de golpe fue muy difícil. Muchas casas viejas no entienden el nuevo formato, y hoy (2026) todavía conviven ambos sistemas.

**IPv8** propone algo diferente: en vez de inventar un formato completamente nuevo (como hizo IPv6), dice "hagamos que las direcciones viejas de IPv4 sean un caso especial del nuevo sistema". Es como si el nuevo mapa de la ciudad simplemente *incluyera* al viejo como un barrio especial, sin demoler nada. Toda casa vieja sigue funcionando igual, y las nuevas casas tienen más espacio para crecer.

Además, IPv8 propone un "administrador central del barrio" (el Zone Server) que coordina seguridad, rutas y monitoreo desde un solo lugar, en vez de tener mil sistemas separados.

---

## Explicación técnica

### Contexto del problema

- **IPv4** usa direcciones de **32 bits** → ~4.300 millones de direcciones posibles. Ya están agotadas desde 2011 (IANA) y se usan técnicas como NAT para estirar el espacio.
- **IPv6** usa direcciones de **128 bits** → espacio virtualmente ilimitado. Pero la adopción fue lenta por falta de retrocompatibilidad directa con IPv4.

### Qué propone IPv8

#### 1. Direcciones de 64 bits
- Más grandes que IPv4 (32 bits), más compactas que IPv6 (128 bits).
- Estructuradas en dos campos: **prefijo de ruteo** (identifica la red) + **identificador de host** (identifica el dispositivo).

#### 2. IPv4 como subconjunto (retrocompatibilidad total)
```
Dirección IPv4:  192.168.1.1
Dirección IPv8:  0000:0000 :: 192.168.1.1
                 (prefijo = 0 → es una dirección IPv4 válida)
```
Ningún dispositivo, app o red necesita modificación para coexistir.

#### 3. Zone Server
Un sistema de gestión activo/activo que centraliza en una sola plataforma:
- Resolución de nombres (DNS)
- Asignación dinámica de direcciones (DHCP)
- Seguridad y autenticación
- Telemetría y monitoreo

Hoy estas funciones viven en sistemas separados, lo que genera complejidad operativa.

#### 4. Seguridad integrada desde el diseño
A diferencia de IPv4 (donde la seguridad fue un añadido posterior), IPv8 incluye un modelo de identidad unificado en la especificación base.

---

## Estado actual y recepción

| Aspecto | Detalle |
|---|---|
| Publicado | 14 de abril de 2026 |
| Tipo | Internet-Draft (draft-thain-ipv8-00) |
| Organismo | IETF (sin endoso oficial) |
| Vencimiento del draft | Octubre 2026 |
| Críticas | GPTZero marcó gran parte como generado por IA; comunidad técnica escéptica |

### ¿IPv4 e IPv6 quedan deprecados?

**No.** Un draft no depreca ningún estándar. IPv4 sigue dominando el tráfico global en 2026. IPv6 tiene adopción creciente (~45% del tráfico en Google). Para que IPv8 reemplace algo, necesitaría:
1. Ser aprobado como RFC por la IETF
2. Ser adoptado por fabricantes de hardware y sistemas operativos
3. Desplegarse gradualmente durante años o décadas

El proceso de IPv4 → IPv6 lleva más de 25 años y aún no terminó.

---

## Fuentes

- [IETF Draft — draft-thain-ipv8](https://datatracker.ietf.org/doc/draft-thain-ipv8/)
- [Voldeta — IETF Introduces IPv8 Draft](https://voldeta.com/en/ietf-introduces-a-draft-for-ipv8-a-real-alternative-to-ipv6/)
- [Cybernews — Tech pros slam IPv8 as AI slop](https://cybernews.com/tech/ipv8-proposal-slammed-by-tech-professionals/)
- [Sinologic — What is IPv8](https://www.sinologic.net/en/2026-04/what-is-ipv8-the-protocol-that-solves-ipv4-exhaustion-without-breaking-what-you-have.html)

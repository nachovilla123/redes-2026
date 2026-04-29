# Capítulo 13 — ACL: el portero con lista

> **Pregunta clave:** ¿Cómo controla un router qué tráfico puede pasar y cuál no?

---

## La analogía: el portero de un boliche con lista

En la puerta hay un portero con una lista. Tiene reglas claras y las aplica en orden:

1. Si tu nombre está en la **lista negra** → no entrás (DENY)
2. Si tenés **invitación VIP** → entrás sin problemas (PERMIT)
3. Si no aparecés en ninguna lista → depende de la **política por defecto** (generalmente: no entrás)

El portero revisa las reglas **de arriba hacia abajo** y aplica la **primera que coincide**. No sigue mirando el resto.

Eso es exactamente una **ACL (Access Control List)**: una lista de reglas en el router que decide, paquete por paquete, qué tráfico pasa y qué tráfico se descarta.

---

## ¿Dónde viven las ACLs?

Las ACLs se configuran en los **routers**, en sus interfaces. Pueden aplicarse:
- **Entrante (inbound)**: el router filtra los paquetes antes de procesarlos
- **Saliente (outbound)**: el router filtra los paquetes antes de enviarlos por esa interfaz

---

## La sintaxis básica

```
access-list NUMERO  permit/deny  IP_ORIGEN  WILDCARD
```

**Ejemplo real:**
```
access-list 5 deny   172.22.5.2  0.0.0.0
access-list 5 deny   172.22.5.3  0.0.0.0
access-list 5 permit any
```

Lo que hacen estas tres reglas en orden:
1. Si el paquete viene de `172.22.5.2` → descartalo
2. Si el paquete viene de `172.22.5.3` → descartalo
3. Cualquier otra IP → dejala pasar

El número `5` es el identificador de la ACL (ACLs estándar: números del 1 al 99).

---

## La Wildcard: la máscara inversa

La wildcard es el "cofactor" de la máscara de subred. Indica qué bits de la IP deben coincidir exactamente y cuáles pueden ser cualquier valor:

- **`0` en la wildcard** → ese bit **debe coincidir exactamente** con la IP especificada
- **`1` en la wildcard** → ese bit **no importa**, puede ser 0 o 1

**Analogía del portero:** Es como decirle "dejá pasar a cualquier persona cuyo apellido sea García, sin importar el nombre". El apellido debe coincidir (wildcard = 0), el nombre no importa (wildcard = 1).

---

## Ejemplos de Wildcards

### Ejemplo 1: una IP exacta
```
IP Origen:  195.34.5.12
Wildcard:   0.0.0.0
```
Los cuatro octetos tienen wildcard `0` → **todos deben coincidir exactamente**.
Solo `195.34.5.12` coincide. Ninguna otra IP.

Equivalente abreviado: `host 195.34.5.12`

---

### Ejemplo 2: una subred entera
```
IP Origen:  172.16.10.0
Wildcard:   0.0.0.255
```
Los primeros tres octetos tienen wildcard `0` → deben ser exactamente `172.16.10`
El último octeto tiene wildcard `255` (= `11111111` en binario) → **no importa**, puede ser cualquier valor

Resultado: coincide cualquier IP entre `172.16.10.0` y `172.16.10.255`

---

### Ejemplo 3: un rango más específico
```
IP Origen:  172.16.10.0
Wildcard:   0.0.31.255
```
Tercer octeto wildcard = `31` = `00011111` en binario

```
31 en binario:    0 0 0 1 1 1 1 1
                  ↑ ↑ ↑           ↑ ↑ ↑ ↑ ↑
               deben coincidir    no importa
```

El tercer octeto de la IP es `10` = `00001010` en binario.
Los 3 primeros bits (`000`) deben coincidir. Los últimos 5 bits no importan.

Resultado: coinciden IPs del `172.16.0.0` al `172.16.31.255`.

---

### Regla práctica para calcular la wildcard

```
Wildcard = 255.255.255.255 - Máscara de subred
```

Ejemplo: si la máscara es `255.255.255.0`:
```
255.255.255.255
- 255.255.255.0
= 0.0.0.255         ← wildcard
```

---

## Orden de las reglas: importa muchísimo

Las reglas se evalúan **de arriba hacia abajo**, y se aplica **la primera que coincide**.

**Ejemplo peligroso:**
```
access-list 10 permit any          ← regla 1: deja pasar todo
access-list 10 deny 10.0.0.5 0.0.0.0  ← regla 2: bloquea esta IP
```

¿Qué pasa con un paquete de `10.0.0.5`? La **regla 1** coincide primero (permit any) → el paquete pasa. La regla 2 nunca se evalúa.

**La versión correcta:**
```
access-list 10 deny 10.0.0.5 0.0.0.0   ← regla 1: bloquea esta IP
access-list 10 permit any               ← regla 2: deja pasar el resto
```

Ahora `10.0.0.5` coincide con la regla 1 → bloqueado. Cualquier otra IP no coincide con la regla 1 → se evalúa la regla 2 → pasa.

**Regla general:** las reglas más específicas siempre deben ir primero.

---

## La regla implícita final: "deny all"

Al final de toda ACL hay una regla invisible:
```
deny any
```

Si un paquete no coincidió con ninguna regla de la lista, **se descarta**. Por eso, si configurás una ACL y olvidás poner un `permit any` al final, terminás bloqueando todo el tráfico que no fue explícitamente permitido.

**Analogía:** Si el portero termina de revisar su lista y no encontró tu nombre en ningún lado, por defecto: no entrás.

---

## Para recordar

| Concepto | Analogía |
|---|---|
| ACL | Lista del portero |
| PERMIT | "Podés entrar" |
| DENY | "No podés entrar" |
| Wildcard `0` | El portero verifica ese dato exactamente |
| Wildcard `1` | Al portero no le importa ese dato |
| Orden de reglas | El portero aplica la primera regla que coincide y para |
| Deny implícito | Si no estás en ninguna lista, no entrás |

---

*Capítulo anterior → [12 - VPN](12-vpn.md)*
*Volver al índice → [00 - Índice](00-indice.md)*

---

> **Fin del libro.** Si llegaste hasta acá leyendo todo, tenés una base sólida para encarar los temas técnicos de la materia. El siguiente paso es practicar con ejercicios de subredes, configuración de switches y análisis de protocolos.

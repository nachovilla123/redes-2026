# Capa 3 — Red (Network Layer)

## ¿Qué resuelve?

Llevar paquetes de datos entre redes distintas. Define cómo encontrar el camino
desde un origen hasta un destino en internet o entre subredes.

**Protocolos:** IP (IPv4, IPv6), ICMP, OSPF, BGP
**Dispositivo que vive acá:** Router

---

## Conceptos clave

**IP Address:** identifica un host en la red. Ejemplo: `192.168.1.50` (privada), `200.45.123.10` (pública).

**Subred (subnet):** grupo de IPs que comparten un prefijo. `192.168.1.0/24` = las IPs .1 a .254.
La máscara `/24` significa "los primeros 24 bits son la red, el resto es el host".

**Default gateway:** el router al que mandás todo lo que no es de tu subred.
Es como la salida del barrio hacia el resto de la ciudad.

**Routing:** proceso por el que los routers deciden por dónde mandar cada paquete.
Cada router tiene una tabla de rutas. Mira la IP destino, encuentra la mejor ruta, y lo reenvía.

**TTL (Time To Live):** contador que se decrementa en cada router. Si llega a 0, el paquete se descarta.
Evita loops infinitos. Cuando ves "TTL expired", el paquete murió en el camino.

---

## Analogía

L2 es el cartero de tu barrio. L3 es el sistema de GPS y autopistas que conecta ciudades.
El router es el GPS: mira el destino (IP), decide la ruta, y te manda al siguiente punto.

---

## Problemas reales de Capa 3

### 1. Default gateway mal configurado o ausente
- **Síntoma:** llegás a máquinas de tu misma red pero no salís a internet ni a otras subredes
- **Causa:** no tenés configurado el gateway, o está mal
- **Diagnóstico:**
  ```bash
  ip route show              # Ver tabla de rutas
  route -n                   # Alternativa
  # Si no hay una línea "default via x.x.x.x" → no tenés gateway
  ```
- **Fix:** configurar el gateway correcto

### 2. IP duplicada en la red
- **Síntoma:** conexión intermitente, a veces funciona y a veces no
- **Causa:** dos dispositivos con la misma IP. Uno "gana" el ARP y el otro queda sin tráfico
- **Diagnóstico:**
  ```bash
  arping -D 192.168.1.50    # -D detecta duplicados, sale con código 1 si hay conflicto
  ```
- **Fix:** DHCP bien configurado, reservas de IP estática por MAC

### 3. Ruta incorrecta o faltante
- **Síntoma:** alcanzás algunas subredes pero no otras
- **Causa:** la tabla de rutas del router no tiene una ruta hacia esa subred
- **Diagnóstico:**
  ```bash
  traceroute 10.20.30.1     # Ver en qué router se pierde el paquete
  ip route get 10.20.30.1   # Ver qué ruta usaría para esa IP
  ```
- **Fix:** agregar la ruta estática o corregir el protocolo de routing dinámico (OSPF/BGP)

### 4. TTL expirado — routing loop
- **Síntoma:** `traceroute` muestra los mismos routers en loop, `ping` devuelve "TTL expired"
- **Causa:** dos routers se mandan el paquete mutuamente porque cada uno cree que el otro es el camino
- **Diagnóstico:**
  ```bash
  traceroute 8.8.8.8        # Ver si los hops se repiten
  ```
- **Fix:** corregir las tablas de rutas, configurar correctamente el protocolo de routing

### 5. Firewall de red bloqueando paquetes (ACL)
- **Síntoma:** un servicio es alcanzable desde algunas redes pero no desde otras
- **Causa:** una ACL (Access Control List) en el router o firewall bloquea el tráfico según IP origen/destino
- **Diagnóstico:**
  ```bash
  traceroute <destino>      # Ver hasta dónde llegan los paquetes
  # Si el traceroute para de responder en un router → ahí está el firewall
  ```
- **Fix:** revisar y modificar las ACLs del firewall/router

### 6. Fragmentación de IP
- **Síntoma:** transferencias pequeñas funcionan, las grandes fallan o se corrompen
- **Causa:** el MTU (tamaño máximo de paquete) varía en el camino y hay un router
  que no puede o no quiere fragmentar
- **Diagnóstico:**
  ```bash
  ping -M do -s 1472 192.168.1.1   # -M do = no fragmentar, -s = tamaño
  # Si falla con 1472 pero funciona con 1400 → problema de MTU en el camino
  ```
- **Fix:** ajustar el MTU en la interfaz, habilitar Path MTU Discovery

### 7. BGP route leak / blackhole (en producción a escala)
- **Síntoma:** una porción de internet deja de ser alcanzable globalmente durante minutos u horas
- **Causa:** un AS (Autonomous System) anuncia rutas incorrectas en BGP y el tráfico se redirige
  hacia él (donde se pierde)
- **Ejemplo real:** Facebook 2021 — anunciaron la retirada de sus rutas BGP por error,
  haciéndose inalcanzables globalmente durante 6 horas
- **Fix:** BGP route filtering, ROA/RPKI para validar rutas

### 8. ICMP bloqueado (y por qué importa)
- **Síntoma:** `ping` no funciona pero el servicio sí (o viceversa)
- **Causa:** un firewall bloquea ICMP
- **Consecuencia secundaria:** si se bloquea ICMP "Fragmentation Needed", Path MTU Discovery
  deja de funcionar y las conexiones TCP grandes se cuelgan
- **Fix:** nunca bloquear ICMP completamente, al menos permitir los tipos necesarios

### 9. NAT mal configurado
- **Síntoma:** máquinas internas no salen a internet, o un servicio interno no es accesible desde afuera
- **Causa:** NAT no está configurado o las reglas de port forwarding son incorrectas
- **Diagnóstico:**
  ```bash
  # Ver reglas de NAT en Linux
  iptables -t nat -L -n -v
  ```
- **Fix:** configurar correctamente MASQUERADE (NAT saliente) o DNAT (port forwarding entrante)

---

## Herramientas de diagnóstico L3

```bash
ping 8.8.8.8              # Verificar conectividad básica
traceroute 8.8.8.8        # Ver el camino hop por hop
ip route show             # Ver tabla de rutas local
ip route get 1.1.1.1      # Ver qué ruta se usaría para una IP
mtr 8.8.8.8               # ping + traceroute continuo, muestra pérdida por hop
```

---

## Clave para recordar

> "Error de capa 3" = llegás a tu red local pero no salís, o llegás a algunas redes y no a otras.
> `traceroute` es tu mejor amigo: te muestra exactamente en qué router se rompe el camino.

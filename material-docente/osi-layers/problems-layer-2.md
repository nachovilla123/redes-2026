# Capa 2 — Enlace de Datos (Data Link Layer)

## ¿Qué resuelve?

Comunicación confiable dentro de una red local (LAN). Define cómo los dispositivos
se identifican dentro de la misma red y cómo comparten el medio.

**Protocolos:** Ethernet, WiFi (802.11), ARP, VLANs (802.1Q)
**Dispositivo que vive acá:** Switch

---

## Conceptos clave

**MAC Address:** identificador único de 48 bits del hardware de red. Ejemplo: `a4:83:e7:12:ab:ff`
No cambia (en teoría). Es "local": solo tiene sentido dentro de la misma red.

**ARP (Address Resolution Protocol):** traduce IP → MAC.
Cuando querés mandar datos a `192.168.1.5`, tu sistema pregunta en broadcast:
"¿Quién tiene la IP 192.168.1.5? Decime tu MAC." El dueño responde.

**Frame Ethernet:** unidad de datos en L2. Contiene MAC origen, MAC destino, datos, y un checksum (FCS).

**Switch:** aprende qué MAC está en qué puerto y reenvía frames solo al puerto correcto.

---

## Analogía

Si L3 (IP) es el sistema postal con direcciones de ciudad, L2 es el cartero de tu barrio.
Solo conoce las casas de su cuadra (red local). Para salir del barrio, necesita al router (L3).

---

## Problemas reales de Capa 2

### 1. ARP Failure — la más común
- **Síntoma:** podés hacer ping a IPs fuera de tu red (usa el router), pero no a máquinas de la misma subred
- **Causa:** el switch no entrega el broadcast de ARP, o hay un firewall bloqueando ARP
- **Diagnóstico:**
  ```bash
  arp -a                    # Ver tabla ARP local
  arping 192.168.1.5        # Mandar ARP request directo
  tcpdump -i eth0 arp       # Capturar tráfico ARP
  ```
- **Fix:** revisar configuración de VLAN, verificar que no haya firewall bloqueando broadcasts

### 2. MAC Address Table llena (MAC flooding)
- **Síntoma:** el switch empieza a enviar frames a TODOS los puertos (como un hub), tráfico masivo
- **Causa natural:** red muy grande con muchos dispositivos
- **Causa maliciosa:** ataque de MAC flooding para forzar al switch a exponer tráfico
- **Diagnóstico:** ver contadores de la tabla MAC del switch
- **Fix:** port security, limitar MACs por puerto, VLANs para segmentar

### 3. VLAN mal configurada
- **Síntoma:** dos dispositivos en el mismo switch físico no se ven entre sí
- **Causa:** están en VLANs distintas sin routing entre ellas, o un puerto está en la VLAN incorrecta
- **Diagnóstico:**
  ```bash
  # En el switch (Cisco)
  show vlan brief
  show interfaces switchport
  ```
- **Fix:** mover el puerto a la VLAN correcta o configurar inter-VLAN routing

### 4. Spanning Tree Protocol (STP) bloqueando puertos
- **Síntoma:** un puerto del switch está "bloqueado", un segmento de red parece inalcanzable
- **Causa:** STP detectó un loop y bloqueó un enlace para prevenirlo (comportamiento correcto,
  pero puede ser inesperado)
- **Diagnóstico:**
  ```bash
  show spanning-tree        # Ver estado de STP
  ```
- **Fix:** revisar topología física, configurar port fast en puertos de acceso, revisar si hay loops no intencionales

### 5. Loop de red (broadcast storm)
- **Síntoma:** la red se vuelve inutilizable, CPU del switch al 100%, tráfico masivo
- **Causa:** dos cables conectando los mismos switches sin STP, creando un loop infinito de broadcasts
- **Diagnóstico:** ver el tráfico disparado en todos los puertos simultáneamente
- **Fix:** STP previene esto automáticamente; si STP está deshabilitado, desconectar el cable redundante

### 6. ARP Spoofing / ARP Poisoning (ataque)
- **Síntoma:** tráfico interceptado, man-in-the-middle, conexiones lentas o caídas
- **Causa:** un atacante responde a ARP requests con su propia MAC, redirigiendo el tráfico
- **Diagnóstico:**
  ```bash
  arp -a   # Ver si una IP tiene la MAC de otro dispositivo conocido
  # Herramienta: arpwatch detecta cambios en la tabla ARP
  ```
- **Fix:** Dynamic ARP Inspection en el switch, segmentación de red, VLANs

### 7. Duplex mismatch entre switch y dispositivo
- **Síntoma:** enlace funciona pero lento, con muchos errores y retransmisiones TCP
- **Causa:** el switch negoció full-duplex pero el dispositivo quedó en half-duplex
- **Diagnóstico:** ver errores de late collision en el switch
- **Fix:** forzar configuración manual de velocidad y duplex en ambos extremos

### 8. Trunk mal configurado (802.1Q)
- **Síntoma:** VLANs no pasan entre switches
- **Causa:** el enlace entre switches no está configurado como trunk, o la VLAN no está permitida en el trunk
- **Diagnóstico:**
  ```bash
  show interfaces trunk       # Ver VLANs permitidas en cada trunk
  ```
- **Fix:** configurar el puerto como trunk y permitir las VLANs necesarias

---

## Flujo de diagnóstico: "no llego a otra máquina de la misma red"

```
1. ¿Tienen IP en la misma subred?
   No → problema de configuración IP (L3)
   Sí → seguir

2. ¿Hay respuesta ARP?
   arping <ip-destino>
   No responde → problema L2 (ARP, VLAN, switch)
   Responde con MAC incorrecta → ARP Spoofing

3. ¿El switch tiene la MAC en su tabla?
   show mac address-table
   No está → el switch nunca vio esa MAC (VLAN incorrecta, puerto desconectado)

4. ¿El puerto del switch está en la VLAN correcta?
   show interfaces switchport
```

---

## Clave para recordar

> "Error de capa 2" = los dispositivos están físicamente conectados pero no se ven.
> Siempre preguntá: ¿ARP funciona? ¿Están en la misma VLAN?

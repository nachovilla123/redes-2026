---
tags: [ejercicios, parcial, lan, wlan]
---

# Ejercicios — Arquitecturas LAN/WLAN

Escenarios del docente. Cada uno trabaja conceptos de capas 2–4.

---

## Ejercicio 1 — Sala SOHO con nodo oculto

**Escenario:** Tres usuarios usan [[WiFi 802.11]]: Usuario A (notebook, sala de reuniones), Usuario B (celular, pasillo), Usuario C (PC fija, otra oficina). A y C no se ven entre sí pero ambos alcanzan al [[Access Point]] cerca de B. A quiere abrir un sitio web, C quiere imprimir por Wi-Fi.

**Preguntas que trabaja:**
- ¿Qué problema ocurre si A y C transmiten simultáneamente?
- ¿Qué mecanismo del estándar 802.11 lo resuelve?
- ¿Qué rol cumple B en este escenario?

**Análisis:**
- A y C son un caso de [[Nodo Oculto]]: no se ven, pero colisionan en el AP
- Solución: [[RTS-CTS]] + [[NAV]] — el AP emite CTS en broadcast, C no transmite
- B puede ser un [[Nodo Expuesto]]: oye las transmisiones de A o C y espera innecesariamente

---

## Ejercicio 2 — ICS con hubs y colisiones

**Escenario:** Sistema de control industrial (ICS) conectado mediante hubs Ethernet. PLCs, sensores y HMI sufren colisiones frecuentes que degradan la comunicación.

**Preguntas que trabaja:**
- ¿Por qué los hubs generan colisiones?
- ¿Qué solución propone TI?
- ¿Por qué es crítico en un entorno industrial?

**Análisis:**
- El [[Hub]] pone todos los dispositivos en el mismo dominio de [[Colisión]]
- Cada transmisión compite → [[CSMA-CD]] activo constantemente → backoff → latencia variable
- Solución: reemplazar hubs por [[Switch|switches]] → cada puerto es un dominio de colisión separado → [[Half-Duplex vs Full-Duplex|full-duplex]] → cero colisiones
- En ICS la latencia determinista es crítica (comandos a PLCs deben llegar en tiempo)

---

## Ejercicio 3 — Campus universitario con alta densidad

**Escenario:** Implementar WLAN en campus. Requisitos: alta densidad (estudiantes + IoT), gestión eficiente del espectro en múltiples edificios, seguridad robusta.

**Preguntas que trabaja:**
- ¿Qué norma [[WiFi 802.11]] es adecuada?
- ¿Cómo se gestiona el espectro?
- ¿Qué mecanismo de seguridad se usa para alta densidad?

**Análisis:**
- Alta densidad → WiFi 6 (802.11ax), múltiples APs por edificio
- Espectro: asignar canales no solapados a APs vecinos (3 canales en 2.4 GHz, muchos en 5 GHz)
- Seguridad: WPA2-Enterprise con 802.1X y servidor RADIUS — cada usuario se autentica con credenciales propias, no con clave compartida (WPA2-PSK no escala)

---

## Ejercicio 4 — Multinacional con videoconferencia, IoT y rastreo

**Escenario:** Sistema de videoconferencias en tiempo real global. Requisitos: QoS para audio/video, miles de dispositivos móviles, flota de vehículos con rastreo. Buenos Aires sufre caídas por tráfico broadcast.

**Preguntas que trabaja:**
- ¿TCP o [[UDP]] para videoconferencia? ¿Por qué?
- ¿Cómo se asignan IPs dinámicamente a miles de dispositivos?
- ¿Qué causa las caídas por broadcast?

**Análisis:**
- Videoconferencia → [[UDP]] (latencia importa más que confiabilidad; un frame perdido no se retransmite)
- QoS: marcar tráfico con DSCP para que routers prioricen audio/video sobre datos
- Miles de dispositivos → [[DHCP]] con leases cortos + [[VLAN|VLANs]] (IoT separado de usuarios)
- Caídas por broadcast → probable broadcast storm por loop capa 2 sin [[STP]] → ver Ejercicio 6

---

## Ejercicio 5 — Diseñador en Córdoba accede vía HTTPS a cadsrv.icsdesign.cordoba

**Escenario:** Acceso HTTPS a un servidor remoto por nombre. Intervienen mecanismos de capas 2 a 4 en el establecimiento inicial.

**Preguntas que trabaja:**
- ¿Qué protocolos intervienen antes de que llegue el primer byte de la página?
- ¿Qué cambia y qué no cambia en cada salto?

**Análisis — flujo completo:**
1. [[DNS]] resuelve `cadsrv.icsdesign.cordoba` → IP del servidor
2. [[ARP]] resuelve la IP del gateway → MAC del router local (capa 2)
3. [[TCP]] [[Three-Way Handshake]] hacia puerto 443
4. TLS handshake encima de TCP (negocia cifrado)
5. [[HTTP]] GET viaja cifrado
6. En cada salto de router: MACs se reemplazan (capa 2), IP no cambia (capa 3)

---

## Ejercicio 6 — Buenos Aires: caídas cada 2 horas por broadcast

**Escenario:** Sede Buenos Aires, switches antiguos. Tráfico broadcast aumenta bruscamente cada ~2 horas → switches no lo aíslan → caída total.

**Preguntas que trabaja:**
- ¿Qué fenómeno produce este patrón?
- ¿Por qué los switches no lo aíslan?
- ¿Cómo se soluciona?

**Análisis:**
- Broadcast storm: loop de capa 2 → una trama broadcast entra en bucle entre switches → se multiplica exponencialmente → satura todos los puertos
- Causa: [[STP]] deshabilitado o mal configurado en switches antiguos
- Solución: habilitar STP/RSTP correctamente + segmentar con [[VLAN|VLANs]] para acotar dominios de broadcast + reemplazar switches que no implementan bien STP

---

## Ejercicio 7 — Empresa de diseño industrial, dos sedes

**Escenario:** Empresa con sedes en Buenos Aires y Córdoba conectadas por WAN privada. Cada sede tiene LAN Giga [[Ethernet]] con [[Switch|switches]] y [[WiFi 802.11|WLAN WiFi 6]] para móviles. Tráfico: CAD, web, VoIP, impresión, bases de datos. BA tiene problemas de rendimiento en red cableada en estaciones CAD. Córdoba tiene interferencia WLAN durante cargas grandes. Se necesita mejorar rendimiento y reestructurar direccionamiento IP.

**Preguntas que trabaja:**
- ¿Qué causa el problema de rendimiento en las estaciones CAD de BA?
- ¿Por qué aparece interferencia en la WLAN de Córdoba durante cargas grandes?
- ¿Qué consideraciones hay para el direccionamiento IP con WAN privada?

**Análisis:**
- BA: switches de primera generación pueden tener duplex mismatch, buffers chicos, sin QoS. Las ráfagas de tráfico CAD saturan los puertos. Solución: switches Gigabit full-duplex, QoS para priorizar CAD, verificar autonegociación
- Córdoba: cargas grandes saturan el canal WiFi. Causas: canales solapados entre APs, [[Nodo Expuesto|nodo expuesto]], usuarios compitiendo. Solución: canales no solapados, redirigir tráfico pesado a 5 GHz o 6 GHz
- Direccionamiento: bloques RFC 1918 distintos por sede. [[VLSM]] para asignar subredes del tamaño justo por segmento (LAN, WLAN, servidores, VoIP, gestión)

---

## Ejercicio 8 — BA: broadcast storm con cableado estructurado

**Escenario:** Sede Buenos Aires con cableado estructurado y switches de primera generación. Caídas intermitentes cada dos horas: tráfico broadcast aumenta súbitamente y los switches no logran aislar el problema.

**Preguntas que trabaja:**
- ¿Por qué el cableado estructurado no evita el problema?
- ¿Qué diferencia hay entre un switch que "no logra aislar" y uno moderno con STP/RSTP?
- ¿Qué cambios concretos se proponen?

**Análisis:**
- El cableado estructurado garantiza calidad física pero no controla loops lógicos de capa 2. Un loop hace que las tramas broadcast circulen indefinidamente sin importar el cableado
- Switches de primera generación: sin [[STP]] o versión lenta (~50 segundos). Un switch moderno con RSTP bloquea el puerto del loop en ~1 segundo, antes de que el storm se expanda
- Tres acciones: (1) Habilitar/corregir [[STP]]/RSTP en todos los switches. (2) Segmentar con [[VLAN|VLANs]] — un storm en una VLAN no afecta las otras. (3) Reemplazar switches por modelos con RSTP y tabla CAM adecuada

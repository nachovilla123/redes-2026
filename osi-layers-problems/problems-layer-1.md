# Capa 1 — Física (Physical Layer)

## ¿Qué resuelve?

Transmitir bits (0s y 1s) de un dispositivo a otro a través de un medio físico.
No sabe qué significan esos bits. Solo los manda.

**Medios:** cable de cobre (Ethernet), fibra óptica, señal de radio (WiFi), señal de luz (infrarrojo).

---

## Analogía

Es el servicio de mensajería que lleva el sobre de A a B. No lee el contenido.
Si la camioneta se rompe (cable cortado), el sobre nunca llega sin importar qué diga adentro.

---

## En tu mundo como dev

Jamás tocás esta capa en código. Pero la sufrís cuando:
- El datacenter tiene un corte eléctrico
- Un cable se desconecta
- La señal WiFi es débil

---

## Problemas reales de Capa 1

### 1. Cable dañado o desconectado
- **Síntoma:** sin conectividad total, el adaptador de red no detecta enlace
- **Señal en el switch:** el LED del puerto está apagado o en rojo
- **Diagnóstico:** `ethtool eth0` → "Link detected: no"
- **Fix:** reemplazar cable o reconectar

### 2. Interferencia electromagnética (EMI)
- **Síntoma:** conexión inestable, pérdida de paquetes intermitente
- **Causa:** cables de red cerca de cables de corriente, motores, microondas
- **Diagnóstico:** `ping` muestra pérdida de paquetes irregular
- **Fix:** usar cables apantallados (STP) o alejar de fuentes de interferencia

### 3. Cable de baja calidad o categoría incorrecta
- **Síntoma:** velocidad limitada, errores de CRC en el switch
- **Causa:** usar Cat5 en un enlace Gigabit que requiere Cat6
- **Diagnóstico:** el switch negocia 100Mbps en lugar de 1Gbps
- **Fix:** reemplazar por cable de categoría correcta

### 4. Distancia excesiva
- **Síntoma:** pérdida de señal, errores de transmisión
- **Causa:** Ethernet tiene límite de 100m por segmento sin repetidor
- **Fix:** agregar un switch en el medio como repetidor, o usar fibra óptica

### 5. Señal WiFi débil o interferencia de canal
- **Síntoma:** conexión lenta, drops frecuentes, alta latencia variable
- **Causa:** muros, distancia, muchos routers usando el mismo canal (2.4 GHz)
- **Diagnóstico:** `iwconfig` / analizador WiFi → ver RSSI y canal
- **Fix:** cambiar a 5 GHz, cambiar canal, agregar access point

### 6. Fibra óptica dañada o sucia
- **Síntoma:** sin enlace o errores masivos en links de datacenter
- **Causa:** conector rayado, fibra doblada con radio menor al mínimo, suciedad en el conector
- **Diagnóstico:** OTDR (reflectómetro óptico) detecta el punto de ruptura
- **Fix:** limpiar conector con kit especializado o reemplazar fibra

### 7. Duplex mismatch
- **Síntoma:** conexión existe pero muy lenta, muchas colisiones
- **Causa:** un extremo negocia full-duplex y el otro half-duplex
- **Diagnóstico:** el switch muestra errores de colisión en ese puerto
- **Fix:** forzar el mismo modo en ambos extremos

---

## Comando de diagnóstico rápido

```bash
# Ver estado del adaptador de red
ethtool eth0

# Ver errores físicos del adaptador
ip -s link show eth0

# En switches: revisar contadores de errores por puerto
show interfaces counters errors  # Cisco IOS
```

---

## Clave para recordar

> Si el LED del puerto está apagado → empezá por acá.
> Capa 1 es el único lugar donde "apagar y prender" funciona de verdad.

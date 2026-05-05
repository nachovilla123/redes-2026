export type Ejercicio = {
  id: number;
  titulo: string;
  tag: string;
  escenario: string;
  preguntas: string[];
  analisis: string[];
};

export const TOPIC_EJERCICIOS = {
  title: "Ejercicios — LAN/WLAN",
  subtitle: "Escenarios del docente · Capas 2 a 4",
};

export const ejerciciosLANWLAN: Ejercicio[] = [
  {
    id: 1,
    titulo: "Sala SOHO — nodo oculto",
    tag: "WiFi / 802.11",
    escenario:
      "Tres usuarios usan 802.11: Usuario A (notebook, sala de reuniones), Usuario B (celular, pasillo), Usuario C (PC fija, otra oficina). A y C no se ven entre sí pero ambos alcanzan al AP cerca de B. A quiere abrir un sitio web, C quiere imprimir por Wi-Fi.",
    preguntas: [
      "¿Qué problema ocurre si A y C transmiten simultáneamente?",
      "¿Qué mecanismo del estándar 802.11 lo resuelve?",
      "¿Qué rol cumple B en este escenario?",
    ],
    analisis: [
      "A y C son un caso de nodo oculto: no se ven entre sí pero ambos alcanzan el AP. Si transmiten al mismo tiempo, sus señales colisionan en el AP y ninguno se entera.",
      "Solución: RTS/CTS. A envía RTS al AP. El AP responde con CTS en broadcast — lo escuchan todos, incluyendo C. C actualiza su NAV (temporizador virtual) y no transmite durante ese tiempo.",
      "B está en el pasillo y probablemente ve a ambos. Puede ser un nodo expuesto: oye las transmisiones de A o C y espera innecesariamente aunque podría transmitir a otro destino sin interferir.",
    ],
  },
  {
    id: 2,
    titulo: "ICS con hubs y colisiones",
    tag: "Ethernet / Hub",
    escenario:
      "Un sistema de control industrial (ICS) en planta está conectado mediante hubs Ethernet. Se detectan colisiones frecuentes que afectan la comunicación entre PLCs, sensores y HMI.",
    preguntas: [
      "¿Por qué los hubs generan colisiones frecuentes?",
      "¿Qué solución propone TI?",
      "¿Por qué es especialmente crítico en un entorno industrial?",
    ],
    analisis: [
      "El hub pone todos los dispositivos en el mismo dominio de colisión: cuando dos transmiten al mismo tiempo, CSMA/CD detecta la colisión, envía jam y aplica backoff exponencial. Con muchos dispositivos, esto ocurre constantemente.",
      "Reemplazar hubs por switches. Cada puerto del switch es un dominio de colisión separado, lo que permite full-duplex y elimina las colisiones por completo.",
      "En sistemas ICS los comandos a PLCs deben llegar con latencia determinista. Con colisiones y backoff aleatorio, los tiempos se vuelven impredecibles y pueden fallar controles en tiempo real.",
    ],
  },
  {
    id: 3,
    titulo: "Campus universitario — alta densidad",
    tag: "WiFi / Seguridad",
    escenario:
      "Un administrador debe implementar una LAN inalámbrica en un campus universitario con: alta densidad de usuarios simultáneos (estudiantes + IoT), gestión eficiente del espectro en múltiples edificios, y seguridad robusta en el acceso inalámbrico.",
    preguntas: [
      "¿Qué norma 802.11 es más adecuada para alta densidad?",
      "¿Cómo se gestiona el espectro entre edificios?",
      "¿Por qué WPA2-PSK no es adecuado para un campus? ¿Qué se usa en su lugar?",
    ],
    analisis: [
      "WiFi 6 (802.11ax): diseñado para alta densidad con OFDMA y MU-MIMO, permite atender múltiples clientes simultáneamente en el mismo canal.",
      "Planificación de canales: asignar canales no solapados a APs vecinos. En 2.4 GHz hay solo 3 canales no solapados (1, 6, 11); en 5 GHz hay muchos más. APs con alta densidad deben usar 5 GHz o 6 GHz.",
      "WPA2-PSK comparte una clave entre todos los usuarios — si se filtra, compromete toda la red. WPA2-Enterprise con 802.1X y servidor RADIUS autentica a cada usuario con sus propias credenciales, revocables individualmente.",
    ],
  },
  {
    id: 4,
    titulo: "Multinacional — videoconferencia, IoT y rastreo",
    tag: "TCP / UDP / DHCP",
    escenario:
      "Una empresa implementa videoconferencias en tiempo real globalmente. Requiere QoS para audio y video, gestión de miles de dispositivos móviles y vehículos con rastreo GPS. En Buenos Aires se observan caídas periódicas por incrementos abruptos de tráfico broadcast.",
    preguntas: [
      "¿TCP o UDP para videoconferencia? Justificá.",
      "¿Cómo se gestionan las IPs de miles de dispositivos móviles?",
      "¿Qué causa las caídas por broadcast en Buenos Aires?",
    ],
    analisis: [
      "UDP. En videoconferencia la latencia importa más que la confiabilidad: un frame perdido es preferible a esperar la retransmisión TCP que llegaría tarde y sería inútil. Se agrega QoS marcando el tráfico con DSCP para que los routers lo prioricen.",
      "DHCP con leases cortos para dispositivos móviles. VLANs para segmentar: IoT separado de usuarios, vehículos en su propio segmento. Esto reduce dominios de broadcast y facilita políticas de seguridad por grupo.",
      "Broadcast storm: probablemente un loop de capa 2 con STP deshabilitado o mal configurado en switches antiguos. Una trama broadcast entra en bucle y se multiplica exponencialmente hasta saturar todos los puertos.",
    ],
  },
  {
    id: 5,
    titulo: "HTTPS a servidor remoto — capas 2 a 4",
    tag: "Encapsulamiento",
    escenario:
      "Un diseñador en Córdoba accede vía HTTPS a un servidor en Buenos Aires usando el nombre cadsrv.icsdesign.cordoba. Durante el establecimiento inicial de la conexión, diversos mecanismos de las capas 2 a 4 intervienen.",
    preguntas: [
      "¿Qué protocolos intervienen antes de que llegue el primer byte de la página? Ordenalos.",
      "¿Qué cambia y qué no cambia en cada salto de router?",
    ],
    analisis: [
      "Orden: (1) DNS resuelve el nombre a IP. (2) ARP resuelve la IP del gateway a su MAC. (3) TCP three-way handshake hacia puerto 443. (4) TLS handshake negocia cifrado. (5) HTTP GET viaja cifrado. Recién en el paso 5 se transfiere contenido.",
      "En cada salto: las MACs de origen y destino se reemplazan (capa 2 — el router saca las MACs del salto anterior y pone las del siguiente). Las IPs de origen y destino NO cambian en todo el camino (capa 3). Los puertos y el contenido TCP/TLS tampoco cambian.",
    ],
  },
  {
    id: 6,
    titulo: "Buenos Aires — caídas por broadcast storm",
    tag: "STP / Switching",
    escenario:
      "En la sede Buenos Aires se usan switches de primera generación. Se detectan caídas periódicas cada ~2 horas: el tráfico broadcast aumenta súbitamente y los switches no logran aislar el problema.",
    preguntas: [
      "¿Qué fenómeno produce este patrón de caídas periódicas?",
      "¿Por qué los switches no lo aíslan?",
      "¿Cómo se soluciona?",
    ],
    analisis: [
      "Broadcast storm causado por un loop de capa 2. Una trama broadcast entra en bucle entre switches, se duplica en cada salto y en segundos satura todos los puertos. El patrón periódico puede indicar un evento recurrente que activa el loop (ej: reconexión de un cable o dispositivo que regenera el loop).",
      "STP (Spanning Tree Protocol) está deshabilitado o mal configurado en los switches antiguos. STP existe precisamente para detectar loops y bloquear los puertos que los causan. Sin STP, el loop no se rompe.",
      "Habilitar y corregir STP/RSTP. Segmentar con VLANs para acotar los dominios de broadcast. Reemplazar switches que no implementan bien STP. Para producción: RSTP (Rapid STP) converge en ~1 segundo vs ~50 segundos de STP clásico.",
    ],
  },
  {
    id: 7,
    titulo: "Tres switches en triángulo — la red deja de responder",
    tag: "STP / Switching",
    escenario:
      "Una empresa tiene 3 switches conectados entre sí formando un triángulo. Funciona bien durante semanas. Un día cambian un cable y a los pocos segundos la red entera deja de responder. El tráfico en todos los puertos llega al 100% y ningún dispositivo puede comunicarse.",
    preguntas: [
      "¿Cuántos caminos hay entre dos switches en un triángulo?",
      "¿Qué le pasa a una trama broadcast en esa topología?",
      "¿Qué protocolo existe para evitar este problema y cómo funciona?",
    ],
    analisis: [
      "En un triángulo hay 2 caminos entre cualquier par de switches. Eso crea un loop de capa 2.",
      "Una trama broadcast no tiene TTL (a diferencia de IP). Entra en el loop, rebota entre los tres switches duplicándose en cada vuelta y en segundos satura el 100% del tráfico de todos los puertos. Eso se llama broadcast storm.",
      "STP (Spanning Tree Protocol) detecta los loops y bloquea lógicamente uno de los cables del triángulo, dejando la topología como una línea sin loops. Si un cable falla, STP desbloquea el que tenía bloqueado. RSTP (Rapid STP) hace lo mismo pero converge en ~1 segundo en vez de ~50.",
    ],
  },
  {
    id: 8,
    titulo: "Empresa de diseño industrial — dos sedes",
    tag: "LAN / WLAN / WAN",
    escenario:
      "Una empresa de diseño industrial tiene dos sedes (Buenos Aires y Córdoba) conectadas por WAN privada. Cada sede tiene LAN Giga Ethernet con switches y WLAN WiFi 6 para usuarios móviles. El tráfico incluye CAD, web, VoIP, servidores de impresión y bases de datos. En BA hay problemas de rendimiento en la red cableada en estaciones CAD. En Córdoba hay interferencia WLAN durante cargas de archivos grandes. Se necesita proponer mejoras y reestructurar el direccionamiento IP.",
    preguntas: [
      "¿Qué puede causar el problema de rendimiento en las estaciones CAD de BA?",
      "¿Por qué aparece interferencia en la WLAN de Córdoba durante cargas grandes?",
      "¿Qué consideraciones hay para el direccionamiento IP en dos sedes con WAN privada?",
    ],
    analisis: [
      "Las estaciones CAD generan ráfagas de tráfico intenso. Con switches de primera generación puede haber congestión, buffers chicos y half-duplex negociado incorrectamente (duplex mismatch). Solución: switches Gigabit full-duplex, QoS para priorizar tráfico CAD, y verificar autonegociación.",
      "Las cargas grandes saturan el canal inalámbrico. Causas posibles: múltiples usuarios en el mismo canal, interferencia de APs vecinos en canales solapados, o nodo expuesto. Solución: canales no solapados, banda 5 GHz o 6 GHz para transferencias grandes, band steering.",
      "Con dos sedes y WAN privada se usan bloques RFC 1918 distintos por sede (ej: BA con 10.1.0.0/16, Córdoba con 10.2.0.0/16). VLSM permite asignar subredes del tamaño justo para LAN, WLAN, servidores, VoIP y gestión en cada sede.",
    ],
  },
  {
    id: 8,
    titulo: "PC2 espera aunque el servidor está libre — WiFi",
    tag: "WiFi / 802.11",
    escenario:
      "Dos PCs están en la misma red WiFi. PC1 transmite un archivo grande al servidor. PC2 quiere transmitir también al servidor pero espera y espera aunque el servidor tiene capacidad libre para recibir más tráfico.",
    preguntas: [
      "¿Por qué espera la PC2 si el servidor tiene capacidad?",
      "¿Es esto una colisión? ¿Hay algún daño?",
      "¿Cómo se llama este problema y tiene solución en 802.11?",
    ],
    analisis: [
      "PC2 aplica CSMA/CA: escucha el canal, detecta que PC1 está transmitiendo y espera. No sabe que su señal no interferiría con la transmisión de PC1 — solo sabe que el canal está ocupado.",
      "No es una colisión. No hay daño ni pérdida de datos. El único problema es desperdicio del canal: PC2 espera innecesariamente cuando podría estar transmitiendo.",
      "Se llama nodo expuesto. Es el problema opuesto al nodo oculto: en el nodo oculto dos nodos transmiten cuando no deberían; en el nodo expuesto un nodo no transmite cuando sí podría. No tiene solución estándar en 802.11 — es una limitación conocida del protocolo.",
    ],
  },
  {
    id: 9,
    titulo: "BA — broadcast storm con cableado estructurado",
    tag: "STP / Switching",
    escenario:
      "En la sede de Buenos Aires, aunque se utiliza cableado estructurado y switches de primera generación (antiguos), los equipos experimentan caídas intermitentes cada dos horas. Se detectó que el tráfico broadcast aumenta súbitamente antes de cada caída, y los switches no logran aislar el problema.",
    preguntas: [
      "¿Por qué el cableado estructurado no evita el problema?",
      "¿Qué diferencia hay entre un switch que 'no logra aislar' y uno moderno con STP/RSTP?",
      "¿Qué cambios concretos se proponen para corregirlo?",
    ],
    analisis: [
      "El cableado estructurado garantiza calidad física (categoría del cable, distancias, conectores) pero no controla los loops lógicos de capa 2. Un loop en la topología de switches hace que las tramas broadcast circulen indefinidamente sin importar qué tan buen cableado haya.",
      "Los switches de primera generación pueden no implementar STP o tener versiones lentas que tardan ~50 segundos en converger. Un switch moderno con RSTP converge en ~1 segundo y bloquea el puerto que genera el loop antes de que el broadcast storm se expanda.",
      "Tres acciones: (1) Habilitar y verificar STP/RSTP en todos los switches. (2) Segmentar con VLANs para reducir el dominio de broadcast — un storm en una VLAN no afecta las otras. (3) Reemplazar los switches de primera generación por modelos que soporten RSTP con capacidad de tabla CAM adecuada.",
    ],
  },
];

import type { Flashcard } from "./clase1";

export const TOPIC_PARCIAL_LAN = {
  title: "Parciales — LAN, STP y Wireless",
  subtitle: "Preguntas de parciales · Capa 2",
  source: "Banco de preguntas de parciales",
};

export const TOPIC_PARCIAL_IP = {
  title: "Parciales — IP y Direccionamiento",
  subtitle: "Preguntas de parciales · Capa 3",
  source: "Banco de preguntas de parciales",
};

export const TOPIC_PARCIAL_TRANSPORTE = {
  title: "Parciales — Transporte e IPv6",
  subtitle: "Preguntas de parciales · TCP/UDP/IPv6",
  source: "Banco de preguntas de parciales",
};

export const flashcardsParcialLAN: Flashcard[] = [
  {
    id: 3001,
    front: "¿Qué es una colisión? ¿Cómo se resuelve?",
    back: "Ocurre en medio compartido cuando dos nodos transmiten simultáneamente y las señales se superponen.\n\nSe resuelve con CSMA/CD:\n1. Escuchar el medio antes de transmitir.\n2. Si detecta colisión, enviar señal de jam.\n3. Esperar tiempo aleatorio (backoff exponencial) y reintentar.",
    tag: "Ethernet / CSMA",
  },
  {
    id: 3002,
    front: "¿En qué difieren los formatos de trama Ethernet II y 802.3? ¿Cómo determina el receptor cuál es?",
    back: "El campo de 2 bytes tras las MACs:\n• ≥ 0x0600 (1536) → Ethernet II: indica el protocolo superior (0x0800=IP, 0x0806=ARP).\n• ≤ 1500 → 802.3: indica la longitud de datos; el protocolo se determina por la cabecera LLC (campo DSAP).",
    tag: "Ethernet",
  },
  {
    id: 3003,
    front: "¿Cómo está compuesta una dirección MAC? ¿Cuál es la dirección de broadcast?",
    back: "6 bytes (48 bits) en hex:\n• OUI (3 bytes): fabricante, asignado por IEEE.\n• NIC (3 bytes): placa específica, asignado por fabricante.\n\nBits del primer byte:\n• Bit 0 (I/G): 0 = unicast, 1 = multicast/broadcast.\n• Bit 1 (U/L): 0 = universal, 1 = administrada localmente.\n\nBroadcast: FF:FF:FF:FF:FF:FF",
    tag: "MAC",
  },
  {
    id: 3004,
    front: "¿Qué campos posee la etiqueta 802.1Q?",
    back: "4 bytes insertados entre Origen y Tipo/Longitud:\n• TPID (2 bytes): valor fijo 0x8100 — indica trama taggeada.\n• TCI (2 bytes):\n  - PCP (3 bits): prioridad 802.1p (0-7).\n  - DEI (1 bit): indica si puede descartarse por congestión.\n  - VID (12 bits): ID de VLAN (0-4095; 0 y 4095 reservados → hasta 4094 VLANs).",
    tag: "VLAN / 802.1Q",
  },
  {
    id: 3005,
    front: "¿Cuál es la longitud mínima de una trama 802.3 y por qué?",
    back: "64 bytes (sin preámbulo ni SFD):\n• 14 bytes de cabeceras + 4 FCS + 46 bytes de datos mínimos.\n\nRazón: garantizar que la trama aún esté en el medio cuando el emisor detecte una colisión. Con cables de hasta 2500 m a 10 Mbps, el tiempo de propagación round-trip es 512 bit-times (51.2 µs), por lo que la trama debe durar al menos ese tiempo.",
    tag: "Ethernet",
  },
  {
    id: 3006,
    front: "¿En qué puerto entregará el switch una trama con dirección destino desconocida?",
    back: "Realiza flooding: reenvía la trama por todos los puertos activos excepto el puerto de origen.\n\nEstos ocurre porque la MAC destino no está en la tabla CAM. Cuando el destino responda, el switch aprende su MAC/puerto y en adelante hace forwarding directo.",
    tag: "Switch / CAM",
  },
  {
    id: 3007,
    front: "¿Cómo realiza Ethernet el control de errores?",
    back: "Usa FCS (Frame Check Sequence) de 4 bytes al final de la trama, calculado con CRC-32 sobre todos los campos.\n\nEl receptor recalcula el CRC; si no coincide, descarta la trama silenciosamente.\n\nEthernet no garantiza entrega — la retransmisión es responsabilidad de capas superiores (TCP).",
    tag: "Control de errores",
  },
  {
    id: 3008,
    front: "¿Cómo está compuesto el BridgeID y para qué se utiliza?",
    back: "8 bytes:\n• Bridge Priority (2 bytes): 4 bits de prioridad + 12 bits de VLAN ID. Valor por defecto: 32768.\n• MAC Address (6 bytes): dirección MAC del switch.\n\nUso: elegir el Root Bridge. El switch con el BridgeID más bajo gana (primero se compara prioridad; en empate, menor MAC).",
    tag: "STP / BridgeID",
  },
  {
    id: 3009,
    front: "¿Cómo se realiza la elección del Root Bridge?",
    back: "1. Al inicio cada switch se cree Root Bridge y envía BPDUs con su propio BridgeID.\n2. Al recibir una BPDU con BridgeID menor, el switch actualiza su Root Bridge y la reenvía.\n3. Converge: el switch con menor BridgeID (menor prioridad; en empate, menor MAC) queda como Root Bridge.\n4. Todos los puertos del Root Bridge quedan en estado Forwarding (Designated Ports).",
    tag: "STP",
  },
  {
    id: 3010,
    front: "¿Qué pasa si se introduce un switch con Bridge Priority más alto (número mayor) y MAC Address más bajo?",
    back: "No se convierte en Root Bridge.\n\nLa prioridad se evalúa primero: un número mayor significa prioridad más baja. El Root Bridge actual (con prioridad numéricamente menor) se mantiene.\n\nEl nuevo switch participa en STP pero queda como non-root.\n\nNota: si la prioridad fuera numéricamente menor, sí desplazaría al Root Bridge actual.",
    tag: "STP",
  },
  {
    id: 3011,
    front: "¿En qué consiste el problema del nodo oculto? ¿Cómo se resuelve?",
    back: "Ocurre cuando dos estaciones (A y C) no se ven entre sí pero ambas se comunican con el AP (B). A transmite, C no detecta la señal de A y transmite simultáneamente → colisión en B.\n\nSolución: RTS/CTS (modo DCF de 802.11):\n1. A envía RTS al AP indicando duración.\n2. AP responde con CTS (escuchado por todos, incluyendo C).\n3. C actualiza su NAV y no transmite durante ese tiempo.",
    tag: "Wireless / Nodo oculto",
  },
  {
    id: 3012,
    front: "¿En qué se diferencian los modos DCF y PCF en 802.11?",
    back: "DCF (Distributed Coordination Function):\n• Distribuido, con contención.\n• Mecanismo: CSMA/CA + backoff aleatorio.\n• Cada estación decide cuándo transmitir.\n• Latencia variable.\n• Uso: datos best-effort.\n\nPCF (Point Coordination Function):\n• Centralizado, sin contención.\n• El AP (Point Coordinator) hace polling.\n• Latencia determinista.\n• Uso: aplicaciones con requisitos de tiempo real.",
    tag: "Wireless / DCF / PCF",
  },
  {
    id: 3013,
    front: "¿Qué es el NAV y qué función cumple?",
    back: "Network Allocation Vector: temporizador virtual que mantiene cada estación.\n\nSu valor indica cuánto tiempo el medio estará ocupado, basado en el campo Duración de las tramas recibidas. Durante ese tiempo la estación no intenta transmitir sin necesidad de escuchar el canal físicamente.\n\nForma parte del mecanismo de CSMA/CA virtual para evitar colisiones.",
    tag: "Wireless / NAV",
  },
  {
    id: 3014,
    front: "¿Qué función cumple el campo 'duración' en la trama 802.11?",
    back: "Indica el tiempo en microsegundos que el medio estará ocupado por la transmisión actual (incluyendo ACK y espaciados SIFS).\n\nTodas las estaciones que reciben la trama actualizan su NAV con ese valor, reservando el canal y evitando colisiones.",
    tag: "Wireless / Duración",
  },
  {
    id: 3015,
    front: "¿Cuántas direcciones MAC contiene la cabecera 802.11 y qué dispositivos identifican?",
    back: "Hasta 4 direcciones MAC (6 bytes c/u):\n• Address 1: Receptor inmediato (RA).\n• Address 2: Transmisor inmediato (TA).\n• Address 3: Destino final o fuente original.\n• Address 4: Solo en modo WDS (puente entre APs).\n\nEn infraestructura típica (cliente ↔ AP ↔ red): A1=AP, A2=cliente, A3=destino en la red cableada.",
    tag: "Wireless / 802.11",
  },
  {
    id: 3016,
    front: "¿En qué bandas de frecuencia opera Wireless LAN y qué características tienen?",
    back: "2.4 GHz (802.11b/g/n): mayor alcance, mejor penetración de paredes, más interferencias (microondas, Bluetooth), solo 3 canales no solapados.\n\n5 GHz (802.11a/n/ac): menor alcance, menos interferencia, más canales disponibles, mayor velocidad.\n\nResumen por norma:\n• 802.11b: 2.4 GHz, 11 Mbps\n• 802.11g: 2.4 GHz, 54 Mbps\n• 802.11a: 5 GHz, 54 Mbps\n• 802.11n: 2.4/5 GHz, 600 Mbps (MIMO)\n• 802.11ac: 5 GHz, varios Gbps (MU-MIMO)",
    tag: "Wireless / Bandas",
  },
  {
    id: 3017,
    front: "¿Cómo opera un AP en modo PCF?",
    back: "El AP actúa como Point Coordinator:\n1. Durante el CFP (Contention-Free Period), envía un Beacon con bit PCF activado.\n2. Realiza polling a cada estación registrada.\n3. Cada estación solo transmite cuando el AP le da permiso (trama CF-Poll).\n4. El AP puede combinar datos + CF-Poll en una misma trama.\n5. Al finalizar el CFP, envía CF-End y comienza el período de contención (DCF).",
    tag: "Wireless / PCF",
  },
];

export const flashcardsParcialIP: Flashcard[] = [
  {
    id: 3101,
    front: "Modelo OSI vs TCP/IP (DARPA): capas y diferencias clave",
    back: "OSI (7 capas): Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación.\n\nTCP/IP (4 capas): Acceso a la red, Internet, Transporte, Aplicación.\n\nDiferencias:\n• OSI es teórico/referencia; TCP/IP es el implementado en Internet.\n• OSI separa Sesión y Presentación; TCP/IP las fusiona en Aplicación.\n\nControl de errores: Enlace (FCS/CRC) y Transporte (checksum + retransmisión TCP).",
    tag: "OSI / TCP-IP",
  },
  {
    id: 3102,
    front: "Flags en la cabecera IPv4: ¿cuáles son y qué hacen?",
    back: "3 bits:\n• Bit 0: Reservado (siempre 0).\n• Bit 1 — DF (Don't Fragment): si=1, el datagrama no puede fragmentarse. Si el router debe fragmentar, lo descarta y envía ICMP 'Fragmentation Needed'.\n• Bit 2 — MF (More Fragments): si=1, hay más fragmentos. Si=0, es el último (o único) fragmento.",
    tag: "IPv4 / Flags",
  },
  {
    id: 3103,
    front: "¿Qué campos de IPv4 intervienen en la fragmentación? ¿Quién fragmenta y quién reensambla?",
    back: "Campos:\n• Identification (16 bits): identifica a qué datagrama pertenece el fragmento.\n• Flags (3 bits): bits DF y MF.\n• Fragment Offset (13 bits): posición del fragmento en el original, en unidades de 8 bytes.\n• Total Length (16 bits): longitud total de cada fragmento.\n\nFragmenta: cualquier router en el camino (cuando supera el MTU).\nReensambla: el host destino final.",
    tag: "IPv4 / Fragmentación",
  },
  {
    id: 3104,
    front: "Clases de direcciones IP: A, B, C y D",
    back: "Clase A: 1-126, máscara /8 (255.0.0.0) — 126 redes, 16.777.214 hosts/red.\nClase B: 128-191, /16 (255.255.0.0) — 16.384 redes, 65.534 hosts/red.\nClase C: 192-223, /24 (255.255.255.0) — 2.097.152 redes, 254 hosts/red.\nClase D: 224-239 — Multicast (no tiene hosts/redes clásicos).",
    tag: "IPv4 / Clases",
  },
  {
    id: 3105,
    front: "¿Cuántas subredes se obtienen al aplicar una máscara de 13 bits a una red Clase A? ¿Cuál es la nueva máscara?",
    back: "Red Clase A: /8\n+ 13 bits para subred = /21\n\nNueva máscara: /21 → 255.255.248.0\nNúmero de subredes: 2¹³ = 8192 subredes\nHosts por subred: 2¹¹ − 2 = 2046 hosts",
    tag: "Subnetting",
  },
  {
    id: 3106,
    front: "¿Puede 172.16.255.3 ser dirección de broadcast? ¿De qué red?",
    back: "Sí, es el broadcast de la red 172.16.255.0/30:\n• Red: 172.16.255.0\n• Hosts válidos: 172.16.255.1 y 172.16.255.2\n• Broadcast: 172.16.255.3\n\nCon la máscara natural /16, el broadcast de 172.16.0.0 sería 172.16.255.255, por lo que .3 no es broadcast de la red natural, sino de la subred /30.",
    tag: "Subnetting",
  },
  {
    id: 3107,
    front: "Subnetting: 192.254.8.0/24 en 29 subredes. ¿Es 192.254.8.31 host válido?",
    back: "≥29 subredes → 2⁵=32 → 5 bits para subred.\nNueva máscara: /29 → 255.255.255.248\nHosts por subred: 2³−2 = 6. Incremento: cada 8 dir.\n\nSubred que contiene .31: 192.254.8.24/29\n• Red: .24 | Hosts: .25-.30 | Broadcast: .31\n\nConclusión: 192.254.8.31 es broadcast de la subred .24/29, NO es host válido.",
    tag: "Subnetting",
  },
  {
    id: 3108,
    front: "VLSM: asignar 172.16.0.0/23 para redes de 129, 58 y 10 hosts",
    back: "El rango /23 tiene 512 dir. (172.16.0.0–172.16.1.255).\n\nRed 1 — 129 hosts → /24 (256 dir.)\n• 172.16.0.0/24 | Hosts: .0.1–.0.254 | BC: .0.255\n\nRed 2 — 58 hosts → /26 (64 dir.)\n• 172.16.1.0/26 | Hosts: .1.1–.1.62 | BC: .1.63\n\nRed 3 — 10 hosts → /28 (16 dir.)\n• 172.16.1.64/28 | Hosts: .1.65–.1.78 | BC: .1.79",
    tag: "VLSM",
  },
  {
    id: 3109,
    front: "ARP: ¿qué mensajes intervienen y a quién van dirigidos?",
    back: "ARP Request:\n• Origen: host que busca la MAC.\n• Destino: broadcast (FF:FF:FF:FF:FF:FF).\n• Contenido: '¿Quién tiene la IP X? Dígaselo a Y'.\n\nARP Reply:\n• Origen: host dueño de la IP.\n• Destino: unicast (al que preguntó).\n• Contenido: 'La IP X la tengo yo, mi MAC es Z'.\n\nEl resultado se guarda en la tabla ARP (caché) del solicitante.",
    tag: "ARP",
  },
  {
    id: 3110,
    front: "¿Qué es un ARP gratuito (Gratuitous ARP)?",
    back: "ARP Request donde IP origen = IP destino = propia IP del host. Se envía en broadcast.\n\nUsos:\n• Detectar conflicto de IP (si alguien responde, hay duplicado).\n• Actualizar la caché ARP de otros nodos al cambiar de MAC (failover, cambio de placa).\n• Anunciar presencia en la red al iniciar.",
    tag: "ARP",
  },
  {
    id: 3111,
    front: "¿Qué es el Default Gateway y cuál es su relación con la Default Route?",
    back: "Default Gateway: dirección IP del router al que un host envía todos los datagramas cuyo destino no está en su red local.\n\nDefault Route: entrada en la tabla de ruteo que indica adónde enviar cuando ninguna ruta más específica coincide. Se representa como 0.0.0.0/0.\n\nRelación: el Default Gateway del host equivale a la Default Route de su tabla. El router que actúa como gateway tiene su propia Default Route hacia el ISP.",
    tag: "Routing",
  },
  {
    id: 3112,
    front: "Direcciones privadas RFC 1918: rangos y clases",
    back: "Reservadas para uso interno, no enrutables en Internet:\n\n• Clase A: 10.0.0.0 – 10.255.255.255 (/8)\n• Clase B: 172.16.0.0 – 172.31.255.255 (/12)\n• Clase C: 192.168.0.0 – 192.168.255.255 (/16)\n\nPara salir a Internet se requiere NAT (Network Address Translation).",
    tag: "IPv4 / RFC 1918",
  },
  {
    id: 3113,
    front: "ICMP 'Destino Inalcanzable': ¿qué lo provoca y quién lo genera?",
    back: "Genera: el router que no puede entregar el datagrama (o el host destino en algunos casos).\n\nSituaciones:\n• El router no tiene ruta y no tiene default route.\n• El protocolo de capa superior no está disponible en el destino.\n• El puerto UDP destino no existe.\n• El datagrama tiene DF=1 pero debe fragmentarse.\n\nEl mensaje ICMP se envía al host origen del datagrama.",
    tag: "ICMP",
  },
  {
    id: 3114,
    front: "Tabla de ruteo: ¿qué elementos contiene?",
    back: "Cada entrada incluye:\n• Red destino (dirección de red)\n• Máscara / prefijo\n• Next-hop (IP del próximo router) o interfaz de salida\n• Métrica (costo de la ruta)\n• Tipo de ruta: directamente conectada, estática, dinámica (RIP, OSPF, BGP…)",
    tag: "Routing",
  },
  {
    id: 3115,
    front: "DNS: ¿qué es una consulta iterativa?",
    back: "El servidor DNS consultado no resuelve completamente; devuelve la referencia al próximo servidor DNS que puede saber más (ej: el servidor del TLD).\n\nEl cliente (resolver) hace las sucesivas consultas por su cuenta siguiendo referencias hasta obtener la respuesta final.\n\nContraste: consulta recursiva → el servidor asume la responsabilidad de resolver completamente y devuelve la respuesta final.",
    tag: "DNS",
  },
  {
    id: 3116,
    front: "DHCP: ¿cuántas veces y con qué frecuencia intenta renovar la concesión?",
    back: "1. Al 50% del lease (T1): unicast DHCPREQUEST al mismo servidor.\n2. Al 87.5% del lease (T2): si no obtuvo renovación, broadcast a cualquier servidor DHCP.\n3. Al 100%: si aún no renovó, abandona la IP y reinicia el proceso DORA completo (DISCOVER → OFFER → REQUEST → ACK).",
    tag: "DHCP",
  },
];

export const flashcardsParcialTransporte: Flashcard[] = [
  {
    id: 3201,
    front: "¿Cuál es la finalidad del campo VERSION en los datagramas IP?",
    back: "Indica la versión del protocolo IP (4 = IPv4, 6 = IPv6). Permite al receptor saber cómo interpretar el resto del datagrama, ya que los formatos de cabecera difieren entre versiones.",
    tag: "IPv4 / Cabecera",
  },
  {
    id: 3202,
    front: "¿Por qué el tamaño máximo del datagrama IPv4 es 64 KB?",
    back: "El campo Total Length de la cabecera IPv4 tiene 16 bits → valor máximo = 2¹⁶ − 1 = 65.535 bytes ≈ 64 KB. Es un límite arquitectónico del protocolo.",
    tag: "IPv4",
  },
  {
    id: 3203,
    front: "¿Cuál es la finalidad del campo TTL?",
    back: "TTL (Time To Live) es un contador de saltos (no de tiempo). Cada router decrementa el TTL en 1. Si llega a 0, el router descarta el datagrama y envía ICMP Time Exceeded al origen.\n\nPropósito: evitar que los datagramas circulen indefinidamente en caso de bucles de ruteo.",
    tag: "IPv4 / TTL",
  },
  {
    id: 3204,
    front: "¿Cómo opera la fragmentación de datagramas IP?",
    back: "Cuando el datagrama supera el MTU del enlace saliente:\n1. El router divide el datagrama en fragmentos ≤ MTU.\n2. Cada fragmento lleva el mismo Identification que el original.\n3. Fragment Offset indica la posición (en unidades de 8 bytes).\n4. MF=1 en todos los fragmentos excepto el último.\n5. El host destino reensambla usando Identification y Fragment Offset.\n6. Si falta algún fragmento, el datagrama completo se descarta.",
    tag: "IPv4 / Fragmentación",
  },
  {
    id: 3205,
    front: "¿Cómo se realiza el control de flujo en IP, UDP y TCP?",
    back: "IP: no tiene control de flujo (best-effort).\n\nUDP: no tiene control de flujo.\n\nTCP: ventana deslizante (campo Window). El receptor anuncia cuántos bytes puede recibir en su buffer; el emisor no puede enviar más de lo que la ventana permite.",
    tag: "TCP / UDP / Control de flujo",
  },
  {
    id: 3206,
    front: "¿Cómo se controlan los errores en TCP y UDP?",
    back: "UDP: checksum de 16 bits (opcional en IPv4, obligatorio en IPv6). Si detecta error, descarta silenciosamente sin retransmitir.\n\nTCP: checksum de 16 bits (obligatorio) + retransmisión. Cada segmento tiene número de secuencia; el receptor envía ACK. Si el emisor no recibe ACK antes del timeout, retransmite.",
    tag: "TCP / UDP / Control de errores",
  },
  {
    id: 3207,
    front: "¿Qué funciones cumplen los bits FIN, ACK y SYN en TCP?",
    back: "SYN (Synchronize): inicia una conexión TCP; sincroniza números de secuencia en el handshake de 3 vías.\n\nACK (Acknowledgment): indica que el campo Acknowledgment Number es válido y confirma la recepción de datos.\n\nFIN (Finish): solicita el cierre de la conexión en un sentido (cada dirección se cierra independientemente).",
    tag: "TCP / Flags",
  },
  {
    id: 3208,
    front: "¿Cómo evita TCP la fragmentación de datagramas IP?",
    back: "Durante el handshake, cada extremo anuncia su MSS (Maximum Segment Size): máximo de datos TCP en un segmento.\n\nMSS = MTU − 20 bytes IP − 20 bytes TCP.\n\nTCP divide los datos en segmentos ≤ MSS mínimo acordado, de modo que el datagrama IP resultante no exceda el MTU y no necesite fragmentarse.",
    tag: "TCP / MSS",
  },
  {
    id: 3209,
    front: "Three-Way Handshake TCP: describir el intercambio",
    back: "1. SYN: cliente elige secuencia inicial x y envía SYN(seq=x).\n2. SYN+ACK: servidor elige secuencia y, confirma SYN del cliente (ack=x+1) y envía SYN+ACK(seq=y, ack=x+1).\n3. ACK: cliente confirma el SYN del servidor (ack=y+1).\n\nConexión establecida. Ambos extremos conocen los números de secuencia del otro.",
    tag: "TCP / Handshake",
  },
  {
    id: 3210,
    front: "¿Por qué el tráfico UDP no es confiable?",
    back: "UDP no tiene:\n• Confirmación de entrega (no hay ACK).\n• Retransmisión ante pérdida.\n• Control de orden (pueden llegar desordenados).\n• Control de flujo ni control de congestión.\n\nSi un segmento se pierde, se corrompe o llega fuera de orden, no hay mecanismo para detectarlo ni corregirlo. La fiabilidad, si se necesita, debe implementarla la aplicación.",
    tag: "UDP",
  },
  {
    id: 3211,
    front: "¿Cuál es el único campo igual en IPv4 e IPv6? ¿Qué finalidad tiene?",
    back: "El campo VERSION (4 bits), ubicado en la misma posición (primeros 4 bits de la cabecera).\n\nFinalidad: indicar qué versión del protocolo se usa (4 o 6) para que el receptor sepa cómo parsear el resto de la cabecera.",
    tag: "IPv4 / IPv6",
  },
  {
    id: 3212,
    front: "¿Cuáles son las direcciones IPv4 locales y qué función cumplen?",
    back: "127.0.0.0/8 (loopback): 127.0.0.1 — permite que un host se comunique consigo mismo sin usar la red física. Pruebas y comunicación entre procesos locales.\n\n169.254.0.0/16 (APIPA): asignada automáticamente si no hay servidor DHCP. Permite comunicación link-local en la misma red, pero no es enrutable hacia Internet.",
    tag: "IPv4 / Direcciones especiales",
  },
  {
    id: 3213,
    front: "¿Cómo se abrevia una dirección IPv6? Dar tres ejemplos.",
    back: "Reglas:\n1. Omitir ceros a la izquierda en cada grupo de 16 bits.\n2. Un único grupo consecutivo de todo-ceros → '::' (solo una vez).\n\nEjemplos:\n• 2001:0db8:0000:…:0001 → 2001:db8::1\n• fe80:0000:…:67cf → fe80::200:f8ff:fe21:67cf\n• 0000:…:0001 → ::1 (loopback)",
    tag: "IPv6",
  },
  {
    id: 3214,
    front: "Tipos de direcciones IPv6: unicast global, link-local, unique local, multicast, anycast",
    back: "Unicast Global (2000::/3): IP pública, enrutable en Internet.\nLink-Local (fe80::/10): solo válida en el enlace local, asignada automáticamente, no enrutable.\nUnique Local (fc00::/7): equivalente a IP privada IPv4, enrutable dentro del AS pero no en Internet.\nMulticast (ff00::/8): envío a un grupo; reemplaza al broadcast de IPv4.\nAnycast: una dirección asignada a múltiples interfaces; el paquete llega al más cercano según ruteo.\n\nIPv6 NO tiene broadcast.",
    tag: "IPv6 / Tipos",
  },
  {
    id: 3215,
    front: "¿Cómo se forma la dirección Link-Local a partir de la MAC? (EUI-64)",
    back: "1. MAC de 48 bits: AA:BB:CC:DD:EE:FF\n2. Insertar FF:FE en el medio: AA:BB:CC:FF:FE:DD:EE:FF\n3. Invertir el bit U/L (bit 7 del primer byte): 0→1 (o viceversa).\n4. Resultado en IPv6: AABB:CCFF:FEDD:EEFF\n5. Agregar prefijo: fe80:: + EUI-64\n\nEjemplo:\nMAC: 00:1A:2B:3C:4D:5E\nEUI-64: 021A:2BFF:FE3C:4D5E\nLink-Local: fe80::21a:2bff:fe3c:4d5e",
    tag: "IPv6 / EUI-64",
  },
  {
    id: 3216,
    front: "¿Qué tipo de direcciones circulan dentro del sistema autónomo pero no en Internet?",
    back: "IPv4: direcciones privadas RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).\n\nIPv6:\n• Unique Local Addresses (ULA): fc00::/7 — enrutables dentro de la organización pero los routers de Internet no las propagan.\n• Link-Local (fe80::/10): solo dentro del mismo enlace, ni siquiera se rutean dentro del AS.",
    tag: "IPv6 / Direcciones",
  },
];

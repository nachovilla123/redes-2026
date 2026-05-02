import type { Flashcard } from "./clase1";

export const TOPIC3 = {
  title: "Switches y VLAN",
  subtitle: "Unidad 2 · Clase 1",
  source: "Ethernet conmutada, tabla CAM, VLANs",
};

export const flashcardsClase3: Flashcard[] = [
  // Ethernet
  {
    id: 201,
    front: "¿Cuál es la diferencia entre un Hub y un Switch?",
    back: "Hub (Ethernet compartida, 1990-1995):\n• Todos los dispositivos comparten el mismo ancho de banda\n• Si dos hablan a la vez, colisionan\n• Todos forman UN solo dominio de colisión\n\nSwitch (Ethernet conmutada, 1995-):\n• Cada puerto tiene su propio canal dedicado\n• No hay colisiones entre puertos distintos\n• Cada puerto es un dominio de colisión separado\n• Cada dispositivo usa todo el ancho de banda de su puerto",
    tag: "Ethernet",
    simulator: { animationId: "hub-vs-switch", label: "Hub vs Switch (colisiones)" },
  },
  {
    id: 202,
    front: "¿Qué es un dominio de colisión?",
    back: "Conjunto de dispositivos que comparten el mismo medio físico y pueden interferir entre sí al transmitir simultáneamente.\n\nHub: todos los conectados forman un único dominio de colisión.\n\nSwitch: cada puerto es un dominio de colisión independiente → los dispositivos conectados a puertos distintos nunca colisionan entre sí.\n\nRouter: separa dominios de colisión Y dominios de broadcast.",
    tag: "Ethernet",
    simulator: { animationId: "hub-vs-switch", label: "Hub vs Switch (colisiones)" },
  },
  {
    id: 203,
    front: "¿Cuál es la estructura de una trama Ethernet?",
    back: "Preámbulo (8B) | MAC Destino (6B) | MAC Origen (6B) | Tipo/Longitud (2B) | Datos (0-1500B) | Relleno (0-46B) | CRC (4B)\n\nMínimo: 64 bytes (para detección de colisiones)\nMáximo: 1518 bytes (sin contar preámbulo)\nEl relleno aparece solo cuando los datos son muy cortos para llegar al mínimo.",
    tag: "Ethernet",
  },
  {
    id: 204,
    front: "¿Cuáles son los 3 tipos de emisión en una LAN?",
    back: "Unicast: dirigida a un único host (una sola interfaz). El más común.\n\nMulticast: dirigida a un grupo de hosts que se suscribieron. El grupo puede cambiar dinámicamente.\n\nBroadcast: dirigida a TODOS los hosts de la LAN. Dirección: FF:FF:FF:FF:FF:FF.\n\nRegla: las direcciones multicast y broadcast NUNCA aparecen como dirección de origen, solo como destino.",
    tag: "Ethernet",
    simulator: { animationId: "cast-types", label: "Unicast vs Multicast vs Broadcast" },
  },
  {
    id: 205,
    front: "¿Cómo se estructura una dirección MAC?",
    back: "6 bytes = 48 bits, expresados en hexadecimal.\n\nPrimeros 3 bytes → OUI (Organizationally Unique Identifier): asignado al fabricante por IEEE.\nÚltimos 3 bytes → Número específico del dispositivo.\n\nBit 1 del primer byte:\n• 0 = unicast (Individual)\n• 1 = multicast/broadcast (Grupo)\n\nBit 2 del primer byte:\n• 0 = Global (administrada por IEEE)\n• 1 = Local (administrada localmente)",
    tag: "Ethernet",
  },
  // Switch
  {
    id: 206,
    front: "¿Qué es la tabla CAM de un switch?",
    back: "Content Addressable Memory: tabla que mapea direcciones MAC → puerto del switch.\n\nCómo se llena:\n• El switch aprende la MAC de origen de cada trama que llega y la asocia al puerto por donde llegó.\n• Las entradas tienen un tiempo de vida (típicamente 5 min): si no hay actividad, se borran para contemplar la movilidad.\n\nCómo se usa:\n• Llega trama con destino X → busca X en la tabla → envía por ese puerto.\n• Si no está → envía por TODOS los puertos activos (flooding).",
    tag: "Switch",
    simulator: { animationId: "cam-table", label: "Tabla CAM aprendiendo" },
  },
  {
    id: 207,
    front: "¿Cuáles son los 3 modos de conmutación de un switch?",
    back: "Store and Forward:\n• Recibe la trama COMPLETA, verifica el CRC y luego reenvía.\n• Mayor latencia, pero no reenvía tramas con errores.\n\nCut-Through:\n• Lee solo la MAC de destino y reenvía de inmediato.\n• Muy baja latencia, pero puede reenviar tramas corruptas.\n\nFragment Free (Cut-Through modificado):\n• Espera los primeros 64 bytes (mínimo que dura una colisión) antes de reenviar.\n• Balance entre latencia y filtrado de errores.",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  {
    id: 208,
    front: "¿Qué es el Stacking de Switches?",
    back: "Interconexión de múltiples switches físicos por puertos especiales de alta velocidad para que funcionen como uno solo.\n\nCaracterísticas:\n• Una sola IP de administración para todo el stack\n• Topología interna en anillo\n• Roles: MASTER (uno), SLAVE (uno), Miembros (el resto)\n• Cada switch tiene un ID único\n• El sistema descubre automáticamente el camino óptimo para cada trama",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  {
    id: 209,
    front: "¿Qué es half duplex vs full duplex?",
    back: "Half duplex: la interfaz puede transmitir O recibir, pero no ambas cosas al mismo tiempo. (Como una radio walkie-talkie)\n→ Puede haber colisiones.\n\nFull duplex: transmite Y recibe simultáneamente en canales separados.\n→ Sin colisiones, doble ancho de banda efectivo.\n\nLos switches modernos operan en full duplex en cada puerto.",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  // VLAN
  {
    id: 210,
    front: "¿Qué es una VLAN y para qué sirve?",
    back: "Virtual LAN: segmentación lógica de una red física en múltiples redes virtuales independientes.\n\nSin VLANs: todos los dispositivos de todos los puertos del switch forman un único dominio de broadcast.\n\nCon VLANs:\n• Cada VLAN es su propio dominio de broadcast\n• Dispositivos de distintas VLANs no se 'ven' entre sí sin un router\n• Ventajas: seguridad, reducción de tráfico de broadcast, flexibilidad organizativa",
    tag: "VLAN",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs · 802.1Q" },
  },
  {
    id: 211,
    front: "¿Cuáles son los 4 criterios de asignación de puertos a VLANs?",
    back: "Por puerto: cada puerto del switch se asigna estáticamente a una VLAN. Más simple y común.\n\nPor dirección MAC: la VLAN se asigna según la MAC del dispositivo. Permite movilidad.\n\nPor tipo de protocolo: distintos protocolos (IP, IPX, AppleTalk) van a distintas VLANs.\n\nPor dirección IP: la VLAN se asigna según la IP origen del paquete.",
    tag: "VLAN",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs · 802.1Q" },
  },
  {
    id: 212,
    front: "¿Qué es un enlace troncal (trunk) y por qué se usa?",
    back: "Un trunk es un enlace entre switches que transporta tráfico de MÚLTIPLES VLANs simultáneamente, usando un único cable físico.\n\nSin trunk: necesitarías un cable físico separado por VLAN entre cada par de switches.\n\nCon trunk: un solo cable lleva todas las VLANs. Cada trama se etiqueta con el ID de su VLAN (IEEE 802.1Q) para que el switch receptor sepa a qué VLAN pertenece.",
    tag: "VLAN",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs · 802.1Q" },
  },
  {
    id: 213,
    front: "¿Qué es el protocolo IEEE 802.1Q?",
    back: "Estándar que define cómo etiquetar tramas Ethernet con información de VLAN para transportarlas por enlaces trunk.\n\nAgrega 4 bytes a la trama Ethernet original con:\n• TPID (2B): valor 0x8100 → indica que es una trama etiquetada\n• Prioridad (3 bits): QoS, prioridad del tráfico\n• CFI (1 bit): formato canónico (0) o no canónico (1)\n• VLAN ID (12 bits): identifica la VLAN (0-4095 VLANs posibles)",
    tag: "VLAN",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs · 802.1Q" },
  },
  {
    id: 214,
    front: "¿Qué es el STP (Spanning Tree Protocol) y por qué es necesario?",
    back: "Protocolo que evita bucles (loops) en redes con enlaces redundantes.\n\nProblema: si conectás dos switches con dos cables (para redundancia), se forman bucles → las tramas dan vueltas infinitas y colapsan la red.\n\nSolución STP:\n• Elige un switch raíz (root) con el ID más bajo\n• Calcula el árbol de spanning tree: camino único entre cada par de switches\n• Bloquea los puertos redundantes\n• Si un enlace falla, reactiva los bloqueados\n\nTramas de control: BPDU (Bridge Protocol Data Units)",
    tag: "VLAN",
    simulator: { animationId: "spanning-tree", label: "STP bloqueando loops" },
  },
  {
    id: 215,
    front: "¿Qué es el VTP (VLAN Trunking Protocol)?",
    back: "Protocolo propietario de Cisco para sincronizar la configuración de VLANs en todos los switches de una red.\n\nSin VTP: tenés que configurar cada VLAN en cada switch manualmente.\n\nCon VTP: configurás las VLANs en un switch SERVIDOR y automáticamente se propagan a todos los demás vía los enlaces trunk.\n\nRequiere: definir un dominio VTP compartido. Solo funciona entre switches Cisco.",
    tag: "VLAN",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs · 802.1Q" },
  },
  // Características del switch
  {
    id: 216,
    front: "¿Qué es el Storm Control en un switch?",
    back: "Mecanismo para controlar tormentas de broadcast: situaciones donde una cantidad anormal de tramas broadcast inunda la red y la satura.\n\nFuncionamiento:\n• El switch mide la velocidad de entrada de tramas broadcast en cada puerto\n• Si supera el umbral configurado (en kbps), descarta el exceso\n• Se configura puerto por puerto\n• También puede aplicarse a multicast y unicast desconocido",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  {
    id: 217,
    front: "¿Qué es Port Security (seguridad de puertos)?",
    back: "Mecanismo que controla qué dispositivos pueden conectarse a un puerto del switch, basándose en la dirección MAC.\n\nSi llega una trama cuya MAC origen no está en la tabla de ese puerto, el switch puede:\n• Forward: dejarla pasar sin aprender la MAC\n• Discard: descartarla silenciosamente\n• Discard + deshabilitar el puerto\n• Enviar un trap SNMP al sistema de gestión\n\nÚtil para evitar que alguien enchufe un dispositivo no autorizado.",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  {
    id: 218,
    front: "¿Qué es el Port Mirroring y para qué se usa?",
    back: "Función que copia el tráfico de uno o más puertos (puerto observado) hacia otro puerto (puerto observador).\n\nUso típico: conectar un analizador de tráfico (Wireshark, sniffer) al puerto observador para monitorear el tráfico sin interrumpir la comunicación.\n\nSe puede elegir monitorear:\n• Solo tráfico entrante (RX)\n• Solo tráfico saliente (TX)\n• Ambos\n\nDesde un puerto se pueden monitorear hasta 8 puertos simultáneamente.",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  {
    id: 219,
    front: "¿Qué es MDI/MDIX y qué problema resuelve?",
    back: "MDI (Media Dependent Interface): forma de cablear estaciones de trabajo.\nMDIX (MDI with Crossover): forma de cablear hubs o switches.\n\nProblema histórico: para conectar dos switches entre sí necesitabas un cable cruzado, y para conectar un switch a una PC, cable directo. Equivocarse causaba que no hubiera conexión.\n\nSolución: Auto-MDIX (Auto Cross): el switch detecta automáticamente qué tipo de cable es y ajusta internamente. Ya no importa si usás cable directo o cruzado.",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
  {
    id: 220,
    front: "¿Qué es PoE (Power over Ethernet)?",
    back: "Tecnología que permite transmitir energía eléctrica junto con datos por el mismo cable de red (UTP).\n\nBeneficio: no hace falta enchufar a la corriente eléctrica los dispositivos conectados.\n\nUsos típicos:\n• Cámaras IP de seguridad\n• Access points Wi-Fi\n• Teléfonos VoIP\n• Sensores IoT\n\nRequiere un switch con soporte PoE. Voltaje típico: 48V DC sobre el cable Cat5e/Cat6.",
    tag: "Switch",
    simulator: { url: "/simuladores/09-vlan.html", label: "Switch y VLANs" },
  },
];

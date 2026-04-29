import type { Flashcard } from "./clase1";

export const TOPIC9 = {
  title: "WLAN Avanzado: IEEE 802.11 y Control de Acceso",
  subtitle: "Unidad 4 · WLAN detallado",
  source: "DCF, PCF, IFS, NAV, IEEE 802.11n/ac/ax, trama 802.11",
};

export const flashcardsClase9: Flashcard[] = [
  {
    id: 801,
    front: "¿Cuál es la diferencia entre los protocolos Primario/Secundario y los de Igual a Igual en el control de canal?",
    back: "Son las dos familias de protocolos de gestión del canal que determinan quién puede transmitir en cada momento:\n\nPrimario/Secundario (Maestro/Esclavo):\n• Una estación central gestiona quién usa el canal\n• Ejemplos: Sondeo (Polling), Selección\n• Ventaja: sin colisiones, ordenado\n• Desventaja: si falla el maestro, cae todo\n\nIgual a Igual (Peer-to-Peer):\n• Ninguna estación controla el canal — todas compiten\n• Sin prioridad: CSMA (Ethernet, WiFi)\n• Con prioridad: Token Ring (paso de testigo)\n• Desventaja: puede haber colisiones\n\nEthernet moderno con switches usa full-duplex punto a punto → no necesita ningún protocolo de acceso al medio.",
    tag: "Control de Acceso",
  },
  {
    id: 802,
    front: "¿Cómo funciona el protocolo p-persistente en CSMA?",
    back: "Es una variante de CSMA (Carrier Sense Multiple Access) para redes igual a igual sin prioridad.\n\nAlgoritmo:\n• El tiempo se divide en intervalos de una trama\n• Si el canal está LIBRE: transmitís con probabilidad P, o esperás al siguiente intervalo con probabilidad (1−P)\n• Si el canal está OCUPADO: esperás a que se libere, luego aplicás la probabilidad P\n• Si hay COLISIÓN: esperás un tiempo aleatorio y reintentás\n\nEl parámetro P es el compromiso:\n• P alto → más colisiones (todos transmiten a la vez cuando se libera)\n• P bajo → canal subutilizado\n• P=1 → 1-persistente (transmitís siempre si el canal está libre → más colisiones)\n• P→0 → 0-persistente (esperás tiempo aleatorio → menos colisiones pero más ineficiente)\n\nCSMA/CD en Ethernet es 1-persistente. CSMA/CA en WiFi usa un mecanismo diferente.",
    tag: "Control de Acceso",
  },
  {
    id: 803,
    front: "¿Qué es el NAV (Network Allocation Vector) en WiFi?",
    back: "El NAV es un mecanismo de detección virtual de portadora en IEEE 802.11.\n\nCómo funciona:\n• Cada trama 802.11 incluye en su header un campo Duración/ID\n• Este campo indica cuánto tiempo más va a estar ocupado el canal\n• Cuando una estación escucha una trama (aunque no sea para ella), actualiza su contador NAV\n• Mientras el NAV > 0, la estación se abstiene de transmitir\n• El NAV funciona como un contador regresivo\n\nEn qué ayuda: resuelve parcialmente el problema del nodo oculto — aunque una estación no escuche directamente al transmisor, puede escuchar la respuesta CTS del AP con el tiempo de duración y saber que el canal está ocupado.\n\nEs la 'detección virtual' vs la 'detección física' de portadora — combinadas dan mayor confiabilidad.",
    tag: "WiFi",
  },
  {
    id: 804,
    front: "¿Cuáles son los 4 tipos de IFS (Inter Frame Spacing) y cuándo se usa cada uno?",
    back: "El IFS es el tiempo de espera obligatorio entre tramas — se usa como sistema de prioridades.\n\nDe MENOR a MAYOR tiempo (= mayor a menor prioridad):\n\n1. SIFS (Short IFS): el más corto → mayor prioridad\n   → Usado para: tramas ACK, CTS, fragmentos de datos\n   → 'El que ya tiene permiso responde rápido'\n\n2. PIFS (PCF IFS): usado por el Access Point en modo PCF\n   → Le permite al AP ganar acceso al medio antes que cualquier estación\n\n3. DIFS (DCF IFS): usado para transmisiones normales en modo DCF\n   → Siempre es mayor que SIFS — así el ACK llega antes que cualquier nueva transmisión\n\n4. EIFS (Extended IFS): el más largo → menor prioridad\n   → Se usa cuando una estación recibió una trama que no pudo interpretar (error)\n   → 'Espero más si recibí algo raro'\n\nAnalogía: es como un sistema de carriles VIP. El ACK usa el carril más rápido para llegar antes de que nadie más intente transmitir.",
    tag: "WiFi",
  },
  {
    id: 805,
    front: "¿Qué son DCF y PCF en IEEE 802.11 y cuál es la diferencia?",
    back: "Son las dos funciones de coordinación de acceso al medio en WiFi:\n\nDCF (Distributed Coordination Function):\n• El algoritmo básico de CSMA/CA\n• Cada estación decide por sí misma cuándo transmitir\n• Proceso: escuchar → esperar DIFS → backoff aleatorio → transmitir → esperar ACK\n• No evita el nodo oculto (lo mitiga con RTS/CTS)\n• Lo soportan todos los equipos 802.11\n\nPCF (Point Coordination Function):\n• El AP (Point Coordinator) gestiona quién transmite\n• El AP pregunta a cada estación si tiene datos pendientes y les da permiso\n• Garantiza calidad de servicio — no hay solapamiento posible\n• No puede haber colisiones porque nadie transmite sin permiso\n• Desventaja: no todos los equipos lo soportan\n\nRelación: PCF siempre coexiste con DCF pero tiene mayor prioridad (usa PIFS < DIFS).\n\nEn la práctica actual, PCF fue reemplazado por EDCA (Enhanced DCF) en 802.11e para QoS.",
    tag: "WiFi",
  },
  {
    id: 806,
    front: "¿Cuáles son las diferencias entre Wi-Fi 4, Wi-Fi 5 y Wi-Fi 6?",
    back: "| Característica | Wi-Fi 4 (802.11n) | Wi-Fi 5 (802.11ac) | Wi-Fi 6 (802.11ax) |\n|---|---|---|---|\n| Frecuencia | 2.4 + 5 GHz | Solo 5 GHz | 2.4 + 5 + 6 GHz |\n| Vel. máxima teórica | 600 Mbit/s | 6.936 Mbit/s | 9.608 Mbit/s |\n| Modulación | 64 QAM | 256 QAM | 1024 QAM |\n| Antenas | MIMO | MU-MIMO | MU-MIMO |\n| Canal máx | 40 MHz | 160 MHz | 160 MHz |\n| Técnica especial | — | — | OFDMA |\n\nClaves (en rojo en las slides):\n• Wi-Fi 5 → solo 5 GHz (no 2.4 GHz)\n• Wi-Fi 6 → agrega banda de 6 GHz y OFDMA (divide el canal en subcanales para varios usuarios simultáneos)\n• Modulación 1024 QAM de Wi-Fi 6 = 4x más densidad que 256 QAM de Wi-Fi 5\n\nEn 2024 se certifica IEEE 802.11be (Wi-Fi 7) — hasta 45.1 Gbps.",
    tag: "WiFi",
  },
  {
    id: 807,
    front: "¿Cuál es la estructura de la TRAMA IEEE 802.11 (WiFi)?",
    back: "La trama 802.11 tiene más campos que Ethernet porque el medio inalámbrico es más complejo.\n\nCampos principales:\n• Control de trama (2 bytes): tipo de trama (gestión, control, datos), flags (ADS, DeDS, WEP, etc.)\n• Duración/ID: tiempo de reserva del canal → actualiza el NAV de los vecinos\n• DA (Destination Address): MAC del destino final\n• SA (Source Address): MAC del origen\n• RA (Receiver Address): MAC del receptor inmediato (el AP)\n• TA (Transmitter Address): MAC del transmisor inmediato\n• Control de secuencia: número de fragmento + número de secuencia (para detección de duplicados)\n• Cuerpo de la trama: hasta 2312 bytes (payload, generalmente paquete IP)\n• FCS: CRC de 32 bits para detección de errores\n\nNota: 4 campos de direcciones porque en infraestructura WiFi el AP actúa como intermediario.",
    tag: "WiFi",
  },
  {
    id: 808,
    front: "¿Qué es OFDMA en Wi-Fi 6 y por qué mejora la eficiencia?",
    back: "OFDMA (Orthogonal Frequency Division Multiple Access): divide el canal en subcanales más pequeños llamados RUs (Resource Units).\n\nProblema que resuelve:\n• En Wi-Fi 4 y 5: el canal completo se asigna a una sola estación por vez. Si tenés 20 dispositivos, esperan en cola.\n• Analogía sin OFDMA: un solo taxi lleva un pasajero por viaje.\n\nCon OFDMA (Wi-Fi 6):\n• Múltiples estaciones transmiten simultáneamente en diferentes subcanales del mismo canal\n• El AP coordina qué RUs usa cada estación\n• Ideal para muchos dispositivos enviando poco dato cada uno (IoT, smartphones con apps)\n• Analogía: un colectivo que lleva muchos pasajeros al mismo tiempo\n\nCombinado con MU-MIMO (múltiples antenas), Wi-Fi 6 puede atender hasta 8 estaciones simultáneamente en downlink y uplink.",
    tag: "WiFi",
  },
  {
    id: 809,
    front: "Tabla comparativa CSMA/CD vs CSMA/CA: ¿cuándo aplica cada uno?",
    back: "| Aspecto | CSMA/CD | CSMA/CA |\n|---|---|---|\n| Tecnología | Ethernet clásico (coaxial) | WiFi (IEEE 802.11) |\n| Detección | Detecta colisión mientras ocurre | Evita la colisión antes de transmitir |\n| ¿Por qué no usar CD en WiFi? | En WiFi no podés escuchar mientras transmitís | Por eso se evita en lugar de detectar |\n| ACK capa 2 | No | Sí (confirma cada trama) |\n| Estado actual | Obsoleto (Ethernet moderno usa full-duplex) | Vigente |\n\nEthernet moderno (con switches, Fast/Gigabit/10G):\n• Usa enlaces punto a punto full-duplex\n• No hay colisiones posibles\n• No necesita CSMA/CD ni CA\n• Eficiencia ≈ 100%\n\nWiFi 6: CSMA/CA + OFDMA mejoran mucho la eficiencia respecto a WiFi anterior.",
    tag: "WiFi",
  },
  {
    id: 810,
    front: "¿Qué es el Preámbulo y el PLCP en la capa física de 802.11?",
    back: "La PDU de capa física (L1 PDU) en 802.11 tiene:\n\nPreámbulo:\n• Se transmite primero para sincronismo entre transmisor y receptor\n• Ayuda a la selección de la antena apropiada\n• Se transmite a velocidad más baja para mejor resistencia a errores\n\nPLCP (Physical Layer Convergence Procedure — Procedimiento de Convergencia de Capa Física):\n• Proporciona información sobre la capa física específica, independiente del modo\n• También se transmite a velocidad más baja que el payload\n• Permite compatibilidad con equipos de diferentes generaciones\n• Brindar protección contra interferencia de equipos anteriores\n\nPor qué a velocidad más baja:\n• Las velocidades bajas tienen mejor resistencia a errores\n• Si el header se corrompe, se pierde toda la trama\n• El cuerpo de la trama sí puede ir a máxima velocidad\n\nMAC PDU (MPDU): Similar a Ethernet pero con campos adicionales según DS y modo de operación.",
    tag: "WiFi",
  },
];

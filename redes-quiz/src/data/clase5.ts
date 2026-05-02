import type { Flashcard } from "./clase1";

export const TOPIC5 = {
  title: "Routing y Fragmentación IPv4",
  subtitle: "Unidad 3 · Clase 1",
  source: "Tabla de rutas, RIP, OSPF, BGP, MTU, fragmentación",
};

export const flashcardsClase5: Flashcard[] = [
  // Routing
  {
    id: 401,
    front: "¿Qué es la tabla de rutas y qué tipos de rutas contiene?",
    back: "Es la lista que tiene cada router con las redes que conoce y cómo llegar a ellas.\n\nTipos (indicados por letra al inicio):\n• C → Connected: red directamente conectada a una interfaz\n• S → Static: configurada a mano por el administrador\n• O → OSPF: aprendida por el protocolo OSPF\n• R → RIP: aprendida por el protocolo RIP\n• D → EIGRP, B → BGP, etc.\n\nLos números [AD/métrica] entre corchetes indican:\n• AD (distancia administrativa): qué tan confiable es la fuente (menos = más confiable)\n• Métrica: costo para llegar al destino (menos = mejor)",
    tag: "Routing",
    simulator: { animationId: "routing-table", label: "Paquete saltando por routers" },
  },
  {
    id: 402,
    front: "¿Qué es un Sistema Autónomo (AS) y cómo divide los protocolos de routing?",
    back: "Un Sistema Autónomo es una red bajo un mismo control administrativo (tu ISP, Google, Amazon, Telecom Argentina, etc.), identificado por un número (ASN).\n\nPor eso existen dos tipos de protocolos:\n\nIGP (Interior Gateway Protocol): para rutear DENTRO de un AS\n→ RIP, OSPF, EIGRP\n\nEGP (Exterior Gateway Protocol): para rutear ENTRE sistemas autónomos\n→ BGP (el único EGP vigente, es el protocolo de ruteo de Internet)",
    tag: "Routing",
    simulator: { url: "/simuladores/16-routing.html", label: "Routing · tablas y next-hop" },
  },
  {
    id: 403,
    front: "¿Cómo funciona RIP y cuáles son sus limitaciones?",
    back: "RIP (Routing Information Protocol):\n• Tipo: IGP, algoritmo de vector de distancia\n• Métrica: cantidad de saltos (hops) — cada router atravesado = 1\n• Límite: máximo 15 saltos. Si está a 16 hops → inalcanzable\n• Actualización: cada 30 segundos envía su tabla completa a los vecinos\n• Distancia administrativa: 120\n\nAnalogía: preguntarle al vecino '¿cuántas cuadras al centro?' — él te dice lo que sabe y vos sumás 1.\n\nProblemas: converge lento (puede tardar minutos si una ruta falla), no escala a redes grandes.",
    tag: "Routing",
    simulator: { url: "/simuladores/16-routing.html", label: "Routing · tablas y next-hop" },
  },
  {
    id: 404,
    front: "¿Cómo funciona OSPF y por qué es preferido sobre RIP?",
    back: "OSPF (Open Shortest Path First):\n• Tipo: IGP, algoritmo de estado de enlace (link-state)\n• Métrica: costo basado en el ancho de banda del enlace\n• Sin límite de saltos\n• Funcionamiento: cada router conoce la topología completa del AS y calcula el camino más corto con el algoritmo de Dijkstra\n• Distancia administrativa: 110 (más confiable que RIP=120)\n\nAnalogía: tener el mapa completo de la ciudad y calcular el mejor camino vos mismo.\n\nVentajas sobre RIP: converge mucho más rápido, escala a redes grandes, sin límite de saltos.",
    tag: "Routing",
    simulator: { url: "/simuladores/16-routing.html", label: "Routing · tablas y next-hop" },
  },
  {
    id: 405,
    front: "¿Qué es BGP y para qué se usa?",
    back: "BGP (Border Gateway Protocol):\n• Tipo: EGP — el protocolo de ruteo de Internet\n• Usado entre: sistemas autónomos (entre ISPs, entre empresas y sus ISPs)\n• Métrica: no usa métrica simple — considera políticas, relaciones comerciales y AS-PATH (cantidad de AS que cruza)\n• No busca el camino más rápido sino el más 'conveniente' según políticas\n\nAnalogía: si RIP/OSPF son el GPS interno de una empresa, BGP es el sistema de acuerdos entre países sobre qué aviones pueden cruzar qué espacio aéreo y por dónde.",
    tag: "Routing",
    simulator: { url: "/simuladores/16-routing.html", label: "Routing · tablas y next-hop" },
  },
  {
    id: 406,
    front: "Tabla comparativa: RIP, OSPF y BGP",
    back: "| | RIP | OSPF | BGP |\n|---|---|---|---|\n| Tipo | IGP | IGP | EGP |\n| Algoritmo | Vector de distancia | Link-state (Dijkstra) | Path vector |\n| Métrica | Hops (máx 15) | Costo (ancho de banda) | AS-PATH + políticas |\n| Convergencia | Lenta | Rápida | Lenta pero estable |\n| Escala | Redes pequeñas | Medianas/grandes | Internet |\n| Distancia adm. | 120 | 110 | 20 (eBGP) / 200 (iBGP) |",
    tag: "Routing",
    simulator: { url: "/simuladores/16-routing.html", label: "Routing · tablas y next-hop" },
  },
  // Fragmentación IPv4
  {
    id: 407,
    front: "¿Qué es el MTU y por qué genera el problema de fragmentación?",
    back: "MTU (Maximum Transmission Unit): tamaño máximo en bytes que puede transportar una trama en un enlace.\n\nValores típicos:\n• Ethernet: 1500 bytes\n• WiFi (802.11): 2304 bytes\n• PPP (WAN): 576 - 1500 bytes\n\nProblema: si un paquete IP debe pasar por un enlace con MTU menor que su tamaño, no cabe.\n\nAnalogía: enviar un mueble grande que no entra en un túnel angosto. IPv4 elige desarmarlo en partes (fragmentar). Si el bit DF está activo, descarta el paquete y manda un error ICMP.",
    tag: "Fragmentación",
    simulator: { url: "/simuladores/17-fragmentacion.html", label: "Fragmentación IPv4" },
  },
  {
    id: 408,
    front: "¿Cuáles son los tres campos clave del header IPv4 para la fragmentación?",
    back: "Identification (ID) — 16 bits:\nIdentifica a qué datagrama original pertenece el fragmento. Todos los fragmentos del mismo datagrama tienen el MISMO ID.\n\nFlags — 3 bits (solo 2 se usan):\n• Bit DF (Don't Fragment): 1 = no fragmentar, 0 = se puede fragmentar\n• Bit MF (More Fragments): 1 = hay más fragmentos después, 0 = este es el último\n\nFragment Offset — 13 bits:\nPosición de este fragmento dentro del datagrama original, en unidades de 8 bytes.\nEjemplo: offset=75 → el fragmento empieza en el byte 75 × 8 = 600.",
    tag: "Fragmentación",
    simulator: { animationId: "ip-fragmentation", label: "Fragmentación IP paso a paso" },
  },
  {
    id: 409,
    front: "¿Cómo se calcula la fragmentación? (fórmula y ejemplo)",
    back: "Fórmula:\n• Payload por fragmento = MTU − 20 (header IP), redondeado hacia abajo al múltiplo de 8\n• Offset de cada fragmento = posición inicial del payload ÷ 8\n• MF = 1 en todos excepto el último\n\nEjemplo: MTU destino = 620 bytes, datagrama = 1500 bytes (20 IP + 1480 datos)\n• Datos por fragmento: 620 − 20 = 600 bytes (ya es múltiplo de 8 ✓)\n• Fragmento 1: 600 bytes, MF=1, Offset=0\n• Fragmento 2: 600 bytes, MF=1, Offset=600/8=75\n• Fragmento 3: 280 bytes, MF=0, Offset=1200/8=150",
    tag: "Fragmentación",
    simulator: { animationId: "ip-fragmentation", label: "Fragmentación IP paso a paso" },
  },
  {
    id: 410,
    front: "¿Quién reensambla los fragmentos y qué pasa si uno se pierde?",
    back: "Solo el DESTINO FINAL reensambla los fragmentos — nunca los routers intermedios.\n\nPor eso:\n• Si un fragmento se pierde en el camino, todo el datagrama original se descarta\n• Hay que reenviar desde el origen (lo maneja TCP o la aplicación)\n• IP no garantiza entrega — es 'best effort'\n\nLa confiabilidad la agrega TCP encima con sus ACKs y retransmisiones.\n\nUDP también usa IP sin garantías — si le importa la integridad, la aplicación lo debe manejar.",
    tag: "Fragmentación",
    simulator: { url: "/simuladores/17-fragmentacion.html", label: "Fragmentación IPv4" },
  },
  {
    id: 411,
    front: "¿Qué es la ruta por defecto (default route) y cómo se representa?",
    back: "Es la ruta que usa un router cuando el destino de un paquete no coincide con ninguna entrada específica de su tabla de rutas.\n\nSe representa como: 0.0.0.0/0\nCoincide con CUALQUIER destino (por eso es el 'último recurso').\n\nSe configura típicamente para que el tráfico desconocido salga hacia el ISP.\n\nAplicación: en redes pequeñas y en PCs, la 'default gateway' es el router que conoce el camino al resto de Internet.",
    tag: "Routing",
    simulator: { url: "/simuladores/16-routing.html", label: "Routing · tablas y next-hop" },
  },
  // Retardo, pérdida y rendimiento (UD5 - Funcionamiento)
  {
    id: 412,
    front: "¿Cuáles son los 4 tipos de retardo nodal en una red de conmutación de paquetes?",
    back: "Cuando un paquete pasa por un router (nodo), sufre 4 tipos de retardo:\n\n1. Retardo de PROCESAMIENTO NODAL: tiempo que tarda el router en examinar el encabezado y decidir a dónde enviar el paquete. Generalmente microsegundos — despreciable en routers modernos.\n\n2. Retardo de COLA: tiempo esperando en la cola antes de poder transmitir. Depende del tráfico — puede ser 0 o muy alto si el enlace está congestionado.\n\n3. Retardo de TRANSMISIÓN: tiempo en poner todos los bits del paquete en el enlace. = Longitud del paquete (bits) / Velocidad del enlace (bps). Determinístico y predecible.\n\n4. Retardo de PROPAGACIÓN: tiempo que tarda la señal en viajar físicamente por el cable. = Distancia / Velocidad de propagación. Para fibra ≈ 2/3 de la velocidad de la luz.\n\nRetardo nodal total = suma de los 4.\n\nHerramienta para medirlo: Traceroute (tracert en Windows).",
    tag: "Nivel Internet",
    simulator: { animationId: "nodal-delays", label: "4 tipos de retardo en un router" },
  },
  {
    id: 413,
    front: "¿Cuándo se pierde un paquete en una red IP? ¿Qué es la intensidad de tráfico?",
    back: "Pérdida de paquetes: ocurre cuando un paquete llega a un router cuya cola está llena.\n• La cola tiene capacidad finita (memoria limitada)\n• Si no hay espacio → el router DESCARTA el paquete (drop)\n• El paquete se pierde — no llega al destino\n\nDesde el punto de vista del host origen: envió el paquete, pero nunca llega al destino.\n\nIntensidad de tráfico (La/R):\n• L = tamaño promedio del paquete (bits)\n• a = tasa de llegada de paquetes (paquetes/s)\n• R = velocidad del enlace (bits/s)\n• Si La/R → 1: la cola crece indefinidamente → retardo enorme y pérdidas\n• Si La/R < 1: la cola es manejable\n\nConclusión: el rendimiento de un nodo se mide tanto en retardo como en tasa de pérdida de paquetes.\n\nLas pérdidas de TCP las detecta el emisor (no llega el ACK) y retransmite.",
    tag: "Nivel Internet",
  },
  {
    id: 414,
    front: "¿Qué es el throughput (rendimiento) de extremo a extremo y qué lo limita?",
    back: "Throughput: velocidad real a la que el destino recibe datos del origen (bits/s).\n\nRegla del cuello de botella (bottleneck):\n• El throughput de extremo a extremo está limitado por el enlace más lento en el camino\n• Si hay dos enlaces Rs (servidor) y Rc (cliente), el throughput = min(Rs, Rc)\n\nEjemplo con un router:\n• Si Rs < Rc: el servidor es el cuello de botella → throughput = Rs\n• Si Rc < Rs: el cliente es el cuello de botella → throughput = Rc\n\nEscenario de tráfico compartido:\n• Si 10 usuarios comparten un enlace de R bps en el núcleo, cada uno obtiene aproximadamente R/10 bps\n• El enlace del núcleo puede convertirse en cuello de botella aunque Rs y Rc sean altos\n\nAnalogía: como una autopista con un túnel angosto en el medio — el flujo total está limitado por el ancho del túnel, no por las velocidades de entrada y salida.\n\nHerramienta para medir: iPerf, speedtest.net",
    tag: "Nivel Internet",
  },
];

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
  },
  {
    id: 402,
    front: "¿Qué es un Sistema Autónomo (AS) y cómo divide los protocolos de routing?",
    back: "Un Sistema Autónomo es una red bajo un mismo control administrativo (tu ISP, Google, Amazon, Telecom Argentina, etc.), identificado por un número (ASN).\n\nPor eso existen dos tipos de protocolos:\n\nIGP (Interior Gateway Protocol): para rutear DENTRO de un AS\n→ RIP, OSPF, EIGRP\n\nEGP (Exterior Gateway Protocol): para rutear ENTRE sistemas autónomos\n→ BGP (el único EGP vigente, es el protocolo de ruteo de Internet)",
    tag: "Routing",
  },
  {
    id: 403,
    front: "¿Cómo funciona RIP y cuáles son sus limitaciones?",
    back: "RIP (Routing Information Protocol):\n• Tipo: IGP, algoritmo de vector de distancia\n• Métrica: cantidad de saltos (hops) — cada router atravesado = 1\n• Límite: máximo 15 saltos. Si está a 16 hops → inalcanzable\n• Actualización: cada 30 segundos envía su tabla completa a los vecinos\n• Distancia administrativa: 120\n\nAnalogía: preguntarle al vecino '¿cuántas cuadras al centro?' — él te dice lo que sabe y vos sumás 1.\n\nProblemas: converge lento (puede tardar minutos si una ruta falla), no escala a redes grandes.",
    tag: "Routing",
  },
  {
    id: 404,
    front: "¿Cómo funciona OSPF y por qué es preferido sobre RIP?",
    back: "OSPF (Open Shortest Path First):\n• Tipo: IGP, algoritmo de estado de enlace (link-state)\n• Métrica: costo basado en el ancho de banda del enlace\n• Sin límite de saltos\n• Funcionamiento: cada router conoce la topología completa del AS y calcula el camino más corto con el algoritmo de Dijkstra\n• Distancia administrativa: 110 (más confiable que RIP=120)\n\nAnalogía: tener el mapa completo de la ciudad y calcular el mejor camino vos mismo.\n\nVentajas sobre RIP: converge mucho más rápido, escala a redes grandes, sin límite de saltos.",
    tag: "Routing",
  },
  {
    id: 405,
    front: "¿Qué es BGP y para qué se usa?",
    back: "BGP (Border Gateway Protocol):\n• Tipo: EGP — el protocolo de ruteo de Internet\n• Usado entre: sistemas autónomos (entre ISPs, entre empresas y sus ISPs)\n• Métrica: no usa métrica simple — considera políticas, relaciones comerciales y AS-PATH (cantidad de AS que cruza)\n• No busca el camino más rápido sino el más 'conveniente' según políticas\n\nAnalogía: si RIP/OSPF son el GPS interno de una empresa, BGP es el sistema de acuerdos entre países sobre qué aviones pueden cruzar qué espacio aéreo y por dónde.",
    tag: "Routing",
  },
  {
    id: 406,
    front: "Tabla comparativa: RIP, OSPF y BGP",
    back: "| | RIP | OSPF | BGP |\n|---|---|---|---|\n| Tipo | IGP | IGP | EGP |\n| Algoritmo | Vector de distancia | Link-state (Dijkstra) | Path vector |\n| Métrica | Hops (máx 15) | Costo (ancho de banda) | AS-PATH + políticas |\n| Convergencia | Lenta | Rápida | Lenta pero estable |\n| Escala | Redes pequeñas | Medianas/grandes | Internet |\n| Distancia adm. | 120 | 110 | 20 (eBGP) / 200 (iBGP) |",
    tag: "Routing",
  },
  // Fragmentación IPv4
  {
    id: 407,
    front: "¿Qué es el MTU y por qué genera el problema de fragmentación?",
    back: "MTU (Maximum Transmission Unit): tamaño máximo en bytes que puede transportar una trama en un enlace.\n\nValores típicos:\n• Ethernet: 1500 bytes\n• WiFi (802.11): 2304 bytes\n• PPP (WAN): 576 - 1500 bytes\n\nProblema: si un paquete IP debe pasar por un enlace con MTU menor que su tamaño, no cabe.\n\nAnalogía: enviar un mueble grande que no entra en un túnel angosto. IPv4 elige desarmarlo en partes (fragmentar). Si el bit DF está activo, descarta el paquete y manda un error ICMP.",
    tag: "Fragmentación",
  },
  {
    id: 408,
    front: "¿Cuáles son los tres campos clave del header IPv4 para la fragmentación?",
    back: "Identification (ID) — 16 bits:\nIdentifica a qué datagrama original pertenece el fragmento. Todos los fragmentos del mismo datagrama tienen el MISMO ID.\n\nFlags — 3 bits (solo 2 se usan):\n• Bit DF (Don't Fragment): 1 = no fragmentar, 0 = se puede fragmentar\n• Bit MF (More Fragments): 1 = hay más fragmentos después, 0 = este es el último\n\nFragment Offset — 13 bits:\nPosición de este fragmento dentro del datagrama original, en unidades de 8 bytes.\nEjemplo: offset=75 → el fragmento empieza en el byte 75 × 8 = 600.",
    tag: "Fragmentación",
  },
  {
    id: 409,
    front: "¿Cómo se calcula la fragmentación? (fórmula y ejemplo)",
    back: "Fórmula:\n• Payload por fragmento = MTU − 20 (header IP), redondeado hacia abajo al múltiplo de 8\n• Offset de cada fragmento = posición inicial del payload ÷ 8\n• MF = 1 en todos excepto el último\n\nEjemplo: MTU destino = 620 bytes, datagrama = 1500 bytes (20 IP + 1480 datos)\n• Datos por fragmento: 620 − 20 = 600 bytes (ya es múltiplo de 8 ✓)\n• Fragmento 1: 600 bytes, MF=1, Offset=0\n• Fragmento 2: 600 bytes, MF=1, Offset=600/8=75\n• Fragmento 3: 280 bytes, MF=0, Offset=1200/8=150",
    tag: "Fragmentación",
  },
  {
    id: 410,
    front: "¿Quién reensambla los fragmentos y qué pasa si uno se pierde?",
    back: "Solo el DESTINO FINAL reensambla los fragmentos — nunca los routers intermedios.\n\nPor eso:\n• Si un fragmento se pierde en el camino, todo el datagrama original se descarta\n• Hay que reenviar desde el origen (lo maneja TCP o la aplicación)\n• IP no garantiza entrega — es 'best effort'\n\nLa confiabilidad la agrega TCP encima con sus ACKs y retransmisiones.\n\nUDP también usa IP sin garantías — si le importa la integridad, la aplicación lo debe manejar.",
    tag: "Fragmentación",
  },
  {
    id: 411,
    front: "¿Qué es la ruta por defecto (default route) y cómo se representa?",
    back: "Es la ruta que usa un router cuando el destino de un paquete no coincide con ninguna entrada específica de su tabla de rutas.\n\nSe representa como: 0.0.0.0/0\nCoincide con CUALQUIER destino (por eso es el 'último recurso').\n\nSe configura típicamente para que el tráfico desconocido salga hacia el ISP.\n\nAplicación: en redes pequeñas y en PCs, la 'default gateway' es el router que conoce el camino al resto de Internet.",
    tag: "Routing",
  },
];

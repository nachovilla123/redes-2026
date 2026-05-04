export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[] }
  | { type: "divider" };

export type Lectura = {
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  blocks: Block[];
};

export const lecturas: Lectura[] = [
  {
    slug: "tcp-ip",
    title: "TCP/IP explicado desde cero",
    subtitle: "Por qué se llaman así, cómo se relacionan y qué hace cada protocolo",
    tag: "Capa de Transporte",
    blocks: [
      { type: "heading", text: "Por qué se llama TCP/IP" },
      { type: "paragraph", text: "Son dos protocolos distintos que trabajan en capas distintas. Ninguno de los dos puede hacer todo solo." },
      { type: "list", items: [
        "IP (capa de red): sabe mover un paquete de una máquina a otra saltando por routers. No garantiza nada. Si el paquete se pierde, IP no se entera y no lo reenvía.",
        "TCP (capa de transporte): construye encima de IP una comunicación confiable. Numera los datos, pide confirmaciones, retransmite si algo se pierde.",
      ]},
      { type: "paragraph", text: "Se llaman juntos \"TCP/IP\" porque TCP necesita a IP para mover datos entre máquinas, e IP solo no alcanza para aplicaciones que necesitan confiabilidad." },

      { type: "divider" },
      { type: "heading", text: "Analogía: el correo y vos coordinando" },
      { type: "paragraph", text: "Querés mandar un libro de 300 páginas a un amigo en otra ciudad. El correo solo acepta sobres de 100 páginas máximo." },
      { type: "paragraph", text: "IP es el correo. Él recibe tu sobre y lo lleva. Pero si se pierde en el camino, no te avisa y no lo reenvía. Hace lo mejor que puede (best-effort), sin garantías." },
      { type: "paragraph", text: "TCP sos vos coordinando con tu amigo. Antes de mandar nada, lo llamás y acuerdan un código:" },
      { type: "list", items: [
        "\"Te voy a mandar el libro en 3 sobres numerados.\" (handshake)",
        "Enviás sobre #1. Tu amigo recibe y te manda: \"recibí el #1, mandame el #2\" (ACK).",
        "Si en X minutos no recibís confirmación del sobre #2, lo reenviás (retransmisión).",
        "Cuando terminaste, le avisás: \"ya mandé todo\" (FIN). Él confirma y cierra su lado.",
      ]},
      { type: "paragraph", text: "TCP garantiza que los 3 sobres lleguen, en orden, sin importar cuántas veces IP los pierda en el camino." },

      { type: "divider" },
      { type: "heading", text: "Ejemplo real: tu browser pide google.com" },
      { type: "paragraph", text: "Escribís https://www.google.com y apretás Enter." },
      { type: "paragraph", text: "Paso 0 — DNS resuelve el nombre. Tu PC pregunta al servidor DNS: ¿cuál es la IP de google.com? Respuesta: 142.250.200.46 (ejemplo)." },
      { type: "paragraph", text: "Paso 1 — TCP establece la conexión (3-way handshake):" },
      { type: "code", text: "Tu PC  →  SYN              →  Google:443\nTu PC  ←  SYN + ACK        ←  Google:443\nTu PC  →  ACK              →  Google:443" },
      { type: "paragraph", text: "Ahora hay una conexión activa entre tu_IP:52341 y 142.250.200.46:443. El puerto 443 es donde vive el servicio HTTPS por convención. El 52341 lo eligió tu sistema operativo al azar." },
      { type: "paragraph", text: "Paso 2 — cada segmento TCP viaja dentro de un datagrama IP:" },
      { type: "code", text: "[ IP: src=tu_IP  dst=142.250.200.46  TTL=64 ]\n[ TCP: src_port=52341  dst_port=443  seq=1 ]\n[ HTTP: GET / HTTP/1.1  Host: www.google.com ]" },
      { type: "paragraph", text: "Los routers leen solo la cabecera IP. No ven puertos, no saben si es HTTPS o SSH." },
      { type: "paragraph", text: "Paso 3 — Google responde con el HTML dividido en múltiples segmentos. Tu TCP los reordena. Si falta alguno, lo pide de nuevo automáticamente." },
      { type: "paragraph", text: "Paso 4 — Cierre en 4 segmentos (TCP es full-duplex, cada dirección cierra por separado):" },
      { type: "code", text: "Browser  →  FIN  →  Google     (yo terminé de enviar)\nBrowser  ←  ACK  ←  Google     (ok, recibí tu FIN)\nBrowser  ←  FIN  ←  Google     (yo también terminé)\nBrowser  →  ACK  →  Google     (conexión cerrada)" },

      { type: "divider" },
      { type: "heading", text: "UDP: el hermano rápido sin garantías" },
      { type: "paragraph", text: "UDP también viaja sobre IP, pero no hace ninguna de las cosas que hace TCP." },
      { type: "table",
        headers: ["", "TCP", "UDP"],
        rows: [
          ["Conexión previa", "Sí (handshake)", "No"],
          ["Garantía de entrega", "Sí (ACK + retransmisión)", "No"],
          ["Orden garantizado", "Sí", "No"],
          ["Velocidad", "Más lento (espera ACKs)", "Más rápido"],
        ]
      },
      { type: "paragraph", text: "Analogía UDP: mandar postales. Las tirás al buzón sin saber si llegaron. Sirve cuando la velocidad importa más que la perfección: DNS, streaming de video, videollamadas." },

      { type: "divider" },
      { type: "heading", text: "Las 4 capas del modelo TCP/IP" },
      { type: "code", text: "┌─────────────────────────────────────┐\n│  APLICACIÓN  — HTTP, DNS, FTP...   │\n├─────────────────────────────────────┤\n│  TRANSPORTE  — TCP / UDP           │\n├─────────────────────────────────────┤\n│  RED         — IP                  │\n├─────────────────────────────────────┤\n│  ACCESO      — Ethernet, WiFi...   │\n└─────────────────────────────────────┘" },
      { type: "list", items: [
        "Las MACs (capa acceso) cambian en cada salto",
        "Las IPs (capa red) no cambian en todo el camino (salvo NAT)",
        "Los puertos (capa transporte) solo los lee el destino final",
      ]},

      { type: "divider" },
      { type: "heading", text: "Responsabilidades en una línea" },
      { type: "table",
        headers: ["Protocolo", "Responsabilidad"],
        rows: [
          ["IP", "Llevar un paquete de una IP a otra, sin garantías"],
          ["TCP", "Garantizar que todos los datos lleguen completos y en orden"],
          ["UDP", "Enviar rápido, sin garantías, sin conexión"],
        ]
      },
    ],
  },

  {
    slug: "csma",
    title: "CSMA/CD vs CSMA/CA",
    subtitle: "Por qué WiFi no puede detectar colisiones y cómo las evita",
    tag: "Capa de Enlace",
    blocks: [
      { type: "paragraph", text: "CSMA significa lo mismo en los dos: Carrier Sense Multiple Access — antes de transmitir, escuchás si el canal está libre. La diferencia está en la segunda parte." },

      { type: "divider" },
      { type: "heading", text: "CD — Collision Detection (Ethernet, cableado)" },
      { type: "paragraph", text: "Podés transmitir y escuchar al mismo tiempo porque el cable es físico. Si dos nodos transmiten a la vez, las señales eléctricas se superponen y ambos lo detectan mientras están transmitiendo." },
      { type: "list", items: [
        "Escuchás el cable — ¿libre? Transmitís",
        "Mientras transmitís, seguís escuchando",
        "Si detectás colisión → parás, mandás señal de jam, esperás tiempo aleatorio (backoff exponencial) y reintentás",
      ]},

      { type: "divider" },
      { type: "heading", text: "CA — Collision Avoidance (WiFi 802.11)" },
      { type: "paragraph", text: "En WiFi no podés transmitir y recibir al mismo tiempo con la misma antena. Si colisionás, no te enterás. Por eso no podés detectar — tenés que evitar antes de que pase." },
      { type: "list", items: [
        "Escuchás el canal — ¿libre? Esperás un tiempo fijo (DIFS) más un backoff aleatorio",
        "Si sigue libre después de ese tiempo → transmitís",
        "El receptor manda un ACK para confirmar",
        "Si no llega ACK → asumís colisión y reintentás",
      ]},
      { type: "paragraph", text: "El backoff aleatorio hace que dos nodos que quieran transmitir al mismo tiempo probablemente elijan tiempos distintos, evitando la colisión." },

      { type: "divider" },
      { type: "heading", text: "La diferencia en una línea" },
      { type: "paragraph", text: "CD detecta la colisión mientras pasa. CA trata de que no pase." },
      { type: "paragraph", text: "Una antena WiFi no puede transmitir y recibir simultáneamente en la misma frecuencia. En Ethernet el cable conduce electricidad en ambas direcciones al mismo tiempo, por eso sí funciona CD." },
    ],
  },

  {
    slug: "rts-cts",
    title: "RTS/CTS y el nodo oculto",
    subtitle: "Cómo WiFi resuelve el problema de nodos que no se ven entre sí",
    tag: "WiFi / 802.11",
    blocks: [
      { type: "heading", text: "El problema del nodo oculto" },
      { type: "paragraph", text: "CSMA/CA funciona bien si todos los nodos se escuchan entre sí. Pero en WiFi el rango de radio es limitado:" },
      { type: "code", text: "A ----ve----> AP <----ve---- C\nA  no ve  C" },
      { type: "paragraph", text: "A escucha el canal, lo nota libre (no oye a C) y empieza a transmitir. C hace lo mismo al mismo tiempo. El AP recibe las dos señales superpuestas — colisión. Ni A ni C se enteran." },

      { type: "divider" },
      { type: "heading", text: "La solución: pedir permiso antes de transmitir" },
      { type: "code", text: "1. A  →  RTS (Request To Send)  →  AP\n         \"quiero transmitir X microsegundos\"\n\n2. AP →  CTS (Clear To Send)    →  BROADCAST\n         \"canal libre, A puede transmitir\"\n         (lo escuchan TODOS, incluyendo C)\n\n3. C recibe el CTS → actualiza su NAV, no transmite\n\n4. A  →  datos                  →  AP\n\n5. AP →  ACK                    →  A" },

      { type: "divider" },
      { type: "heading", text: "NAV — Network Allocation Vector" },
      { type: "paragraph", text: "Temporizador virtual que cada nodo mantiene. Cuando recibe un RTS o CTS con un campo de duración, anota que el canal está ocupado hasta T y no transmite aunque no oiga tráfico físicamente. Es una reserva virtual del canal." },

      { type: "divider" },
      { type: "heading", text: "En una línea" },
      { type: "paragraph", text: "RTS/CTS hace que el AP avise a todos los vecinos que el canal está reservado, resolviendo el problema de los nodos que no se ven entre sí." },
    ],
  },

  {
    slug: "wifi-colisiones",
    title: "WiFi: AP, colisiones y half-duplex",
    subtitle: "Qué es un Access Point, qué es una colisión y por qué Ethernet no las tiene",
    tag: "WiFi / Ethernet",
    blocks: [
      { type: "heading", text: "¿Qué es un Access Point?" },
      { type: "paragraph", text: "Es el dispositivo que hace de puente entre el mundo WiFi y el mundo cableado. Recibe señales de radio de los dispositivos wireless y las convierte en tráfico Ethernet hacia el router." },
      { type: "code", text: "Laptop  ──radio──> [AP] ──cable──> Router ──> Internet\nCelular ──radio──> [AP]" },
      { type: "paragraph", text: "El AP administra el canal inalámbrico: decide quién puede transmitir, reparte IPs vía DHCP, y maneja la seguridad (WPA2, etc.)." },

      { type: "divider" },
      { type: "heading", text: "¿Por qué WiFi tiene estos problemas?" },
      { type: "paragraph", text: "Cable (Ethernet): el medio es físico y privado. Lo que viaja por ese cable solo lo ven los dos extremos conectados." },
      { type: "paragraph", text: "WiFi: el medio es el aire. Las ondas de radio se expanden en todas direcciones como cuando tirás una piedra al agua. Cualquiera dentro del rango puede recibir tu señal. La frecuencia (2.4 GHz, 5 GHz) afecta el alcance, pero el problema de fondo es que el aire es un medio compartido y abierto." },

      { type: "divider" },
      { type: "heading", text: "¿Por qué WiFi es half-duplex?" },
      { type: "paragraph", text: "Una antena no puede transmitir y recibir en la misma frecuencia al mismo tiempo. Cuando transmitís, tu propia señal es millones de veces más fuerte que cualquier señal entrante — literalmente te ensordecés a vos mismo." },
      { type: "paragraph", text: "Para hacer full-duplex en WiFi necesitarías dos antenas en frecuencias distintas con aislamiento de señal. Existe (MIMO full-duplex) pero es experimental. El 802.11 estándar es half-duplex." },

      { type: "divider" },
      { type: "heading", text: "¿Ethernet es mejor entonces?" },
      { type: "paragraph", text: "Para evitar colisiones: sí, Ethernet moderno es mejor. La clave es el switch. Un switch le da a cada dispositivo su propio canal dedicado:" },
      { type: "code", text: "PC1 ──cable dedicado──> [Switch] <──cable dedicado── PC2" },
      { type: "paragraph", text: "PC1 y PC2 nunca comparten el mismo cable → nunca colisionan. Además cada cable tiene pares separados para envío y recepción → full-duplex. Los hubs viejos sí tenían colisiones porque todos compartían el mismo medio, igual que WiFi." },

      { type: "divider" },
      { type: "heading", text: "¿Qué es una colisión?" },
      { type: "paragraph", text: "Es un problema puramente físico: dos dispositivos transmiten señales en el mismo medio al mismo tiempo. Las señales se superponen y el resultado es ruido incomprensible." },
      { type: "paragraph", text: "Lo que colisiona no son los destinos (Instagram vs Facebook son cosas distintas que el router maneja sin problema). Lo que colisiona son las señales físicas en el canal compartido." },
      { type: "paragraph", text: "Analogía: dos personas hablando al mismo tiempo en la misma habitación. No importa de qué habla cada una — el que escucha no entiende ninguna de las dos." },

      { type: "divider" },
      { type: "heading", text: "Más problemas en WiFi" },
      { type: "table",
        headers: ["Problema", "Qué es"],
        rows: [
          ["Nodo oculto", "A y C no se ven, colisionan en el AP. Solución: RTS/CTS"],
          ["Nodo expuesto", "Un nodo se queda callado innecesariamente porque oye tráfico que no le afecta"],
          ["Interferencia multipath", "La señal rebota en paredes y llega por múltiples caminos con distintos retardos"],
          ["Problema near/far", "Un dispositivo cercano al AP tapa la señal de uno lejano"],
          ["Interferencia entre canales", "Dos APs vecinos en el mismo canal se pisan entre sí"],
        ]
      },
    ],
  },
];

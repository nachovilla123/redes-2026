import type { Flashcard } from "./clase1";

export const TOPIC4 = {
  title: "WiFi y ARQ con Ventanas Deslizantes",
  subtitle: "Unidad 2 · Clase 2",
  source: "IEEE 802.11, CSMA/CA, Go-Back-N, Selective Repeat",
};

export const flashcardsClase4: Flashcard[] = [
  // WiFi / CSMA/CA
  {
    id: 301,
    front: "¿Por qué WiFi usa CSMA/CA y no CSMA/CD como Ethernet?",
    back: "En Ethernet con cable, si dos dispositivos transmiten a la vez, detectan la colisión mientras ocurre (CD = Collision Detection).\n\nEn WiFi, un dispositivo que transmite no puede escuchar al mismo tiempo — su propia señal ahoga cualquier señal entrante. Por eso no puede detectar colisiones.\n\nSolución: CSMA/CA (Collision Avoidance) — evita colisiones antes de que ocurran, en lugar de detectarlas.",
    tag: "WiFi",
  },
  {
    id: 302,
    front: "¿Cómo funciona CSMA/CA paso a paso?",
    back: "1. Escuchá el canal (Carrier Sense): ¿hay alguien transmitiendo?\n2. Si está ocupado → esperá a que se libere + tiempo aleatorio extra\n3. Si está libre → esperá DIFS (tiempo fijo) + backoff (tiempo aleatorio)\n4. Transmitís\n5. El receptor manda ACK confirmando recepción\n6. Si no llega el ACK → asumir colisión → esperar más tiempo aleatorio → reintentar\n\nEl backoff aleatorio es clave: si todos esperan distintos tiempos, es difícil que dos transmitan exactamente al mismo tiempo.",
    tag: "WiFi",
  },
  {
    id: 303,
    front: "¿Qué es el Problema del Nodo Oculto en WiFi?",
    back: "Ocurre cuando dos dispositivos (A y B) no se 'ven' entre sí pero ambos pueden llegar al mismo Access Point.\n\nA escucha el canal → libre → empieza a transmitir.\nB también escucha → libre (no escucha a A) → también empieza.\nEl AP recibe las dos señales al mismo tiempo → colisión.\n\nNi A ni B saben que colisionaron porque no se detectan mutuamente.\n\nAnalogía: dos personas en salas separadas que no se escuchan entre sí, pero ambas hablan con el mismo recepcionista al mismo tiempo.",
    tag: "WiFi",
  },
  {
    id: 304,
    front: "¿Cómo resuelve RTS/CTS el problema del nodo oculto?",
    back: "RTS = Request To Send | CTS = Clear To Send\n\n1. A quiere transmitir → envía RTS al AP: 'quiero el canal por X tiempo'\n2. El AP responde con CTS que TODOS en el área escuchan: 'A tiene el canal'\n3. B escucha el CTS → sabe que el canal está ocupado → espera\n4. A transmite sin interferencia\n5. AP manda ACK final\n\nLa clave: el AP anuncia la reserva (y sí llega a todos), no el cliente que nadie más escucha.\n\nCosto: overhead de tramas extra → solo se usa para tramas más grandes que un umbral configurable.",
    tag: "WiFi",
  },
  {
    id: 305,
    front: "Diferencia entre Ethernet (802.3) y WiFi (802.11)",
    back: "| | Ethernet | WiFi |\n|---|---|---|\n| Medio | Cable (guiado) | Aire (no guiado) |\n| Colisiones | CSMA/CD (detecta) | CSMA/CA (evita) |\n| ACK capa 2 | No | Sí |\n| Nodo oculto | No aplica | Problema real → RTS/CTS |\n| Entrega garantizada | No (capa 2) | No (capa 2) |\n\nNinguno garantiza entrega confiable a nivel capa 2 — eso lo hace TCP en la capa de transporte.",
    tag: "WiFi",
  },
  // ARQ / Ventanas Deslizantes
  {
    id: 306,
    front: "¿Qué es Stop-and-Wait y cuál es su limitación?",
    back: "Protocolo ARQ básico: se manda un paquete, se espera el ACK, recién entonces se manda el siguiente.\n\nAnalogía: mandar cartas y esperar respuesta antes de escribir la siguiente. Si el correo tarda 5 días en cada sentido, escribís una carta por semana aunque podrías escribir 10.\n\nLimitación: el canal está vacío la mayor parte del tiempo esperando ACKs. Es muy ineficiente cuando el RTT (Round Trip Time) es grande.",
    tag: "ARQ",
  },
  {
    id: 307,
    front: "¿Qué es una ventana deslizante?",
    back: "La cantidad máxima de paquetes que podés tener 'en vuelo' (enviados pero aún no confirmados con ACK).\n\nAnalogía: en vez de mandar una carta y esperar, mandás 5 seguidas. Cuando llega el ACK de la primera, mandás la sexta. La ventana 'se desliza' a medida que llegan los ACKs.\n\nBeneficio: el canal está ocupado la mayor parte del tiempo → mucho más eficiente que Stop-and-Wait.",
    tag: "ARQ",
  },
  {
    id: 308,
    front: "¿Cómo funciona Go-Back-N?",
    back: "El transmisor puede enviar hasta N paquetes sin ACK.\n\nSi uno tiene error o se pierde:\n• El receptor descarta ese paquete y TODOS los siguientes (aunque llegaron bien)\n• El transmisor retrocede y reenvía desde el paquete problemático en adelante\n\nAnalogía: cinta transportadora — si el paquete 3 está dañado, el inspector tira los paquetes 3, 4 y 5, aunque 4 y 5 estaban bien.\n\nVentaja: el receptor es simple (no necesita buffer).\nDesventaja: se reenvían paquetes que llegaron bien → desperdicio.",
    tag: "ARQ",
  },
  {
    id: 309,
    front: "¿Cómo funciona Selective Repeat (Repetición Selectiva)?",
    back: "El transmisor puede enviar hasta N paquetes sin ACK (igual que Go-Back-N).\n\nSi uno tiene error:\n• El receptor lo descarta PERO guarda los que llegaron después\n• El transmisor solo reenvía el paquete específico que falló\n• Cuando llega el faltante, el receptor reordena y entrega la secuencia completa\n\nAnalogía: rompecabezas en 10 sobres — si el sobre 3 se perdió, guardás los demás y pedís solo el 3.\n\nVentaja: más eficiente, no reenvía lo que ya llegó bien.\nDesventaja: el receptor necesita más memoria y lógica.",
    tag: "ARQ",
  },
  {
    id: 310,
    front: "Comparación: Stop-and-Wait, Go-Back-N y Selective Repeat",
    back: "| | Stop-and-Wait | Go-Back-N | Selective Repeat |\n|---|---|---|---|\n| Paquetes en vuelo | 1 | Hasta N | Hasta N |\n| Si hay error | Reenvía 1 | Reenvía desde el error | Reenvía solo el fallido |\n| Complejidad receptor | Mínima | Baja | Alta (buffer) |\n| Eficiencia | Muy baja | Media | Alta |\n\nTCP usa un mecanismo similar a Selective Repeat con SACK (Selective ACK).\nGo-Back-N es más común en capas de enlace de datos.",
    tag: "ARQ",
  },
  {
    id: 311,
    front: "¿Cuál es el tamaño máximo de ventana en Go-Back-N y en Selective Repeat?",
    back: "Si los números de secuencia son de N bits → hay 2^N valores posibles.\n\nGo-Back-N:\n• Ventana máxima = 2^N − 1\n• Se reserva 1 valor para evitar confusión entre ventanas consecutivas\n\nSelective Repeat:\n• Ventana máxima = 2^(N−1)\n• Se reserva la mitad para evitar confusión entre paquetes nuevos y reenvíos\n\nEjemplo con 3 bits (8 valores):\n• Go-Back-N: ventana máxima = 7\n• Selective Repeat: ventana máxima = 4",
    tag: "ARQ",
  },
];

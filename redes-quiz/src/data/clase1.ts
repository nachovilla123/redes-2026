export type Difficulty = "basico" | "intermedio" | "avanzado";

export interface QuizQuestion {
  id: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FlashcardSimulator {
  url: string;
  label?: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  tag: string;
  simulator?: FlashcardSimulator;
}

export const TOPIC = {
  title: "Introducción a las Redes de Datos",
  subtitle: "Unidad 1 · Clase 1",
  source: "Stallings cap. 1, 2 y 7",
};

export const flashcards: Flashcard[] = [
  {
    id: 1,
    front: "¿Cuáles son los 5 componentes del modelo de comunicaciones?",
    back: "Fuente → Transmisor → Sistema de Transmisión → Receptor → Destino\n\nLa fuente genera los datos, el transmisor los convierte en señales, el sistema de transmisión los transporta, el receptor los convierte de nuevo y el destino los consume.",
    tag: "Modelo",
    simulator: { url: "/simuladores/01-modelo-comunicaciones.html", label: "Modelo de comunicaciones" },
  },
  {
    id: 2,
    front: "¿Qué es una LAN?",
    back: "Local Area Network: red de alcance reducido (edificio o campus pequeño), generalmente pertenece a una misma organización, con velocidades altas. Hoy usa conmutación (switches).",
    tag: "Tipos de red",
    simulator: { url: "/simuladores/02-tipos-redes.html", label: "Tipos de redes" },
  },
  {
    id: 3,
    front: "¿Qué es una MAN?",
    back: "Metropolitan Area Network: alcance intermedio entre LAN y WAN. Cubre una ciudad. Puede ser privada o pública, de alta velocidad.",
    tag: "Tipos de red",
    simulator: { url: "/simuladores/02-tipos-redes.html", label: "Tipos de redes" },
  },
  {
    id: 4,
    front: "¿Qué es una WAN?",
    back: "Wide Area Network: gran extensión geográfica. Utiliza circuitos comunes a otras redes. Sus tecnologías principales son conmutación de circuitos y conmutación de paquetes.",
    tag: "Tipos de red",
    simulator: { url: "/simuladores/02-tipos-redes.html", label: "Tipos de redes" },
  },
  {
    id: 5,
    front: "¿Qué es una GAN?",
    back: "Global Area Network: red compuesta de distintas redes de computadoras interconectadas, con cobertura geográfica ilimitada. Se la conoce como 'internet' (minúscula). No confundir con 'la Internet' (red específica).",
    tag: "Tipos de red",
    simulator: { url: "/simuladores/02-tipos-redes.html", label: "Tipos de redes" },
  },
  {
    id: 6,
    front: "Conmutación de circuitos vs. conmutación de paquetes",
    back: "Circuitos: se establece un camino dedicado para toda la duración de la comunicación (ej: red telefónica).\n\nPaquetes: los datos se envían en pequeños paquetes que circulan por distintos nodos sin respetar secuencia fija.",
    tag: "Conmutación",
    simulator: { url: "/simuladores/03-conmutacion.html", label: "Conmutación: circuitos vs paquetes" },
  },
  {
    id: 7,
    front: "¿Cuáles son los 3 elementos de un protocolo?",
    back: "• Sintaxis: formatos de mensajes y niveles de señal\n• Semántica: información de control y manejo de errores\n• Temporizaciones: adaptación de velocidades y secuenciamiento",
    tag: "Protocolos",
    simulator: { url: "/simuladores/04-protocolos.html", label: "Protocolos" },
  },
  {
    id: 8,
    front: "Diferencia entre protocolo asincrónico y sincrónico",
    back: "Asincrónico: datos NO transferidos a velocidad constante. El inicio de cada carácter se marca con un bit de arranque y el fin con un bit de parada.\n\nSincrónico: datos a velocidad constante, con sincronismo entre transmisor y receptor. Se subclasifica en orientado al carácter y orientado al bit.",
    tag: "Protocolos",
    simulator: { url: "/simuladores/04-protocolos.html", label: "Protocolos" },
  },
  {
    id: 9,
    front: "¿Qué es el control de flujo?",
    back: "Mecanismo que asegura que el transmisor no supere la capacidad del receptor, previniendo el overflow de los buffers.\n\nInvolucra dos tiempos:\n• Tiempo de transmisión: tiempo para emitir todos los bits al medio\n• Tiempo de propagación: tiempo para que un bit atraviese el enlace",
    tag: "Control",
  },
  {
    id: 10,
    front: "¿Por qué se usa fragmentación?",
    back: "Dividir grandes bloques en pequeñas tramas permite:\n• Adaptar al tamaño limitado del buffer\n• Detectar errores más rápido\n• Retransmitir solo tramas pequeñas en caso de error\n• Evitar que una estación ocupe el medio por largos períodos",
    tag: "Control",
  },
  {
    id: 11,
    front: "¿Qué es el CRC?",
    back: "Cyclic Redundancy Check: técnica de detección de errores.\n\n1. Para cada bloque de k bits genera una secuencia de n bits\n2. Transmite k+n bits exactamente divisibles por un número determinado\n3. El receptor divide la trama por ese número:\n   • Resto = 0 → sin error\n   • Resto ≠ 0 → error detectado",
    tag: "Errores",
  },
  {
    id: 12,
    front: "¿Qué es el ARQ y cuáles son sus mecanismos?",
    back: "Pedido de Repetición Automático (Automatic Repeat reQuest): control de errores que combina:\n• Detección de error\n• ACK positivo (reconocimiento de recepción correcta)\n• Retransmisión después de timeout\n• NAK (reconocimiento negativo) y retransmisión inmediata",
    tag: "Errores",
    simulator: { url: "/simuladores/15-arq.html", label: "ARQ y ventanas deslizantes" },
  },
  {
    id: 13,
    front: "¿Cuál es la limitación de la paridad como detección de errores?",
    back: "El bit de paridad hace que la cantidad de unos en el carácter sea par (even parity) o impar (odd parity).\n\nLimitación clave: una cantidad PAR de bits errados no se detecta, ya que la paridad vuelve a ser correcta.",
    tag: "Errores",
  },
  {
    id: 14,
    front: "¿Para qué sirve la arquitectura de protocolos en capas?",
    back: "Permite separar las tareas de comunicación en módulos independientes (capas apiladas) donde:\n• Cada capa se implementa por separado\n• Las funciones existen en ambos extremos de la comunicación\n• Las capas equivalentes de cada extremo se comunican entre sí\n• Los cambios en una capa no afectan a las demás",
    tag: "Arquitectura",
    simulator: { url: "/simuladores/05-arquitectura-capas.html", label: "Arquitectura en capas" },
  },
];

export const quizQuestions: QuizQuestion[] = [
  // BASICO
  {
    id: 1,
    difficulty: "basico",
    question: "¿Cuál de las siguientes redes tiene el menor alcance geográfico?",
    options: ["WAN", "MAN", "LAN", "GAN"],
    correctIndex: 2,
    explanation: "La LAN (Local Area Network) tiene el menor alcance: se limita a un edificio o campus pequeño, generalmente de una misma organización.",
  },
  {
    id: 2,
    difficulty: "basico",
    question: "¿Qué componente del modelo de comunicaciones convierte los datos en señales transmisibles?",
    options: ["Fuente", "Destino", "Receptor", "Transmisor"],
    correctIndex: 3,
    explanation: "El Transmisor toma los datos generados por la Fuente y los convierte en señales que pueden viajar por el sistema de transmisión.",
  },
  {
    id: 3,
    difficulty: "basico",
    question: "¿Cuál de estas tecnologías es un ejemplo clásico de conmutación de circuitos?",
    options: ["Internet", "Email", "Red telefónica", "Ethernet"],
    correctIndex: 2,
    explanation: "La red telefónica tradicional es el ejemplo clásico: establece un camino dedicado para toda la duración de la llamada.",
  },
  {
    id: 4,
    difficulty: "basico",
    question: "¿Cómo se llama la red que cubre una región geográfica ilimitada, compuesta de múltiples redes interconectadas?",
    options: ["WAN", "MAN", "LAN", "GAN"],
    correctIndex: 3,
    explanation: "GAN (Global Area Network): cubre una región ilimitada. Se la conoce como 'internet' (minúscula). 'La Internet' (mayúscula) es una red GAN específica.",
  },
  // INTERMEDIO
  {
    id: 5,
    difficulty: "intermedio",
    question: "¿Qué problema resuelve el control de flujo?",
    options: [
      "Errores de transmisión por ruido en el canal",
      "Overflow del buffer del receptor",
      "Ruteo de paquetes entre redes distintas",
      "Encriptación de datos sensibles",
    ],
    correctIndex: 1,
    explanation: "El control de flujo evita que el transmisor envíe datos más rápido de lo que el receptor puede procesarlos, previniendo el overflow (desbordamiento) de sus buffers.",
  },
  {
    id: 6,
    difficulty: "intermedio",
    question: "En la conmutación de paquetes, ¿cómo viajan los datos?",
    options: [
      "Por un canal dedicado durante toda la comunicación",
      "Siempre respetando el orden de envío",
      "En pequeños paquetes que pasan por múltiples nodos",
      "Únicamente de punto a punto sin nodos intermedios",
    ],
    correctIndex: 2,
    explanation: "Los datos se dividen en pequeños paquetes que circulan entre varios nodos entre fuente y destino, sin respetar necesariamente la secuencia.",
  },
  {
    id: 7,
    difficulty: "intermedio",
    question: "¿Cuáles son los 3 elementos que definen a un protocolo según su arquitectura?",
    options: [
      "Velocidad, Capacidad y Latencia",
      "Sintaxis, Semántica y Temporizaciones",
      "Armado, Control de línea y Transparencia",
      "Unicast, Multicast y Broadcast",
    ],
    correctIndex: 1,
    explanation: "Un protocolo se define por: Sintaxis (formatos y niveles de señal), Semántica (info de control y manejo de errores) y Temporizaciones (velocidades y secuenciamiento).",
  },
  {
    id: 8,
    difficulty: "intermedio",
    question: "¿Cuál es la principal ventaja de fragmentar datos en pequeñas tramas?",
    options: [
      "Elimina la necesidad de usar ACK",
      "Reduce la cantidad total de bits transmitidos",
      "Permite detectar errores más rápido y retransmitir menos datos",
      "Garantiza que los paquetes lleguen en orden",
    ],
    correctIndex: 2,
    explanation: "Con tramas pequeñas, al detectar un error solo se retransmite esa trama pequeña (no el bloque entero), y la detección es más rápida al recibir cada trama completa.",
  },
  // AVANZADO
  {
    id: 9,
    difficulty: "avanzado",
    question: "En el CRC, ¿qué concluye el receptor cuando al dividir la trama recibida obtiene resto distinto de cero?",
    options: [
      "Que hubo un error en la transmisión",
      "Que la trama llegó sin errores",
      "Que debe pedir más bits de paridad",
      "Que el divisor usado es incorrecto",
    ],
    correctIndex: 0,
    explanation: "Si el resto ≠ 0, el receptor concluye que hubo un error. Si resto = 0, supone que no hubo errores. El CRC no corrige errores, solo los detecta.",
  },
  {
    id: 10,
    difficulty: "avanzado",
    question: "¿Por qué la paridad simple no es suficiente para detectar todos los errores?",
    options: [
      "Porque solo funciona con protocolos asincrónicos",
      "Porque agrega demasiados bits de overhead",
      "Porque no detecta cuando una cantidad par de bits se altera",
      "Porque requiere sincronismo entre transmisor y receptor",
    ],
    correctIndex: 2,
    explanation: "Si se alteran 2 bits (cantidad par), la paridad resultante sigue siendo correcta, por lo que el error no se detecta. El CRC soluciona esta limitación.",
  },
  {
    id: 11,
    difficulty: "avanzado",
    question: "En el ARQ, ¿qué sucede cuando el transmisor no recibe un ACK dentro del tiempo de espera?",
    options: [
      "Descarta el mensaje y envía el siguiente",
      "Aumenta el tamaño de las tramas",
      "Retransmite automáticamente el segmento no confirmado",
      "Cambia al modo de conmutación de circuitos",
    ],
    correctIndex: 2,
    explanation: "El ARQ combina: detección de error + ACK positivo + retransmisión después de timeout + NAK con retransmisión. Si no llega el ACK en el tiempo configurado, retransmite.",
  },
  {
    id: 12,
    difficulty: "avanzado",
    question: "¿Cuál es la diferencia clave entre un protocolo sincrónico orientado al carácter y uno orientado al bit?",
    options: [
      "El orientado al bit siempre es más lento",
      "En el orientado al carácter, cada octeto tiene un significado de control o dato; en el orientado al bit, cada bit tiene significado independiente del código",
      "El orientado al carácter usa CRC y el orientado al bit usa paridad",
      "Solo el orientado al bit soporta velocidades altas",
    ],
    correctIndex: 1,
    explanation: "Orientado al carácter: a cada octeto le corresponde un carácter de control o dato según el código. Orientado al bit: cada bit del control de la trama tiene significado independiente del código usado.",
  },
];

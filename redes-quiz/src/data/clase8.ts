import type { Flashcard } from "./clase1";

export const TOPIC8 = {
  title: "Cableado Estructurado EIA/TIA-568",
  subtitle: "Unidad 3 · Cableado físico",
  source: "Norma ANSI/TIA/EIA-568-B, estructura, categorías, certificación",
};

export const flashcardsClase8: Flashcard[] = [
  {
    id: 701,
    front: "¿Qué es el Cableado Estructurado y cuál es su objetivo fundamental?",
    back: "Es el sistema de cableado de un edificio (o serie de edificios) que permite interconectar equipos de diferentes o igual tecnología, integrando servicios como datos, telefonía, video, alarmas y control.\n\nObjetivo fundamental: cubrir las necesidades de los usuarios durante toda la vida útil del edificio sin necesidad de realizar más tendido de cables.\n\nAnalogía: como la instalación eléctrica de una casa — se hace una vez bien, con tomacorrientes en todos lados, y después enchufás lo que necesites. Sin cableado estructurado, cada vez que cambiás algo tenés que pasar un cable nuevo.",
    tag: "Cableado Estructurado",
  },
  {
    id: 702,
    front: "¿Cuáles son las normas principales de cableado estructurado y qué regula cada una?",
    back: "ANSI/TIA/EIA-568-B → Cómo INSTALAR el cableado en edificios comerciales:\n• 568-B1: Requerimientos generales\n• 568-B2: Par trenzado balanceado (UTP/STP)\n• 568-B3: Fibra óptica\n\nANSI/TIA/EIA-569-A → Cómo ENRUTAR el cableado (recorridos y espacios)\n\nANSI/TIA/EIA-570-A → Infraestructura residencial\n\nANSI/TIA/EIA-606-A → Administración de la infraestructura (etiquetado y documentación)\n\nANSI/TIA/EIA-607 → Puesta a tierra de telecomunicaciones\n\nANSI/TIA/EIA-758 → Cableado de planta externa (cliente-propietario)",
    tag: "Cableado Estructurado",
  },
  {
    id: 703,
    front: "¿Cuáles son los 4 niveles de la ESTRUCTURA del cableado estructurado?",
    back: "De mayor a menor alcance:\n\n1. Cableado de Campus (CD): conecta todos los distribuidores de edificios al distribuidor central de campus.\n\n2. Cableado Vertical (Backbone): conecta los distribuidores de piso (FD) al distribuidor de edificio (BD).\n\n3. Cableado Horizontal: conecta desde el distribuidor de piso (FD) hasta la toma del usuario (TO).\n\n4. Cableado de Usuario: el cable corto del puesto de trabajo hasta el equipo (PC, teléfono).\n\nJerarquía de siglas: CD → BD → FD → TO\n(Campus Distributor → Building Distributor → Floor Distributor → Telecommunication Outlet)",
    tag: "Cableado Estructurado",
  },
  {
    id: 704,
    front: "¿Cuáles son los 6 COMPONENTES del cableado estructurado?",
    back: "1. Área de trabajo: zona donde está el usuario con su equipo.\n\n2. Cableado horizontal: cables desde el FD hasta la toma del usuario.\n\n3. Armario de telecomunicaciones (rack/closet): donde vive el FD, con patch panels y switches.\n\n4. Cableado vertical (backbone): cables que suben entre pisos (FD → BD).\n\n5. Sala de equipos: cuarto central del edificio donde vive el BD/CD con los equipos principales.\n\n6. Backbone de Campus: cables entre edificios (BD → CD).\n\nEn la práctica, las funciones de CD, BD y FD pueden estar combinadas en un mismo armario.",
    tag: "Cableado Estructurado",
  },
  {
    id: 705,
    front: "¿Cuáles son las reglas del Cableado Horizontal?",
    back: "El cableado horizontal va desde el armario de telecomunicaciones (FD) hasta la toma del usuario (TO).\n\nRegla clave de distancias (canal completo = máximo 100m):\n• Cable horizontal fijo: máximo 90 metros\n• Cables de usuario (patch cord usuario): máximo 3 metros\n• Cables de equipos (patch cord panel): máximo 7 metros\n• Total: 90 + 3 + 7 = 100 metros\n\nProhibiciones:\n• No se permiten puentes, derivaciones ni empalmes a lo largo del cable.\n• Evitar proximidad con cables eléctricos que generen interferencia electromagnética (motores, elevadores, transformadores) — ver ANSI/EIA/TIA-569.",
    tag: "Cableado Estructurado",
  },
  {
    id: 706,
    front: "¿Qué son los Patch Panels y Patch Cords? ¿Para qué sirven?",
    back: "Patch Panel: panel fijo montado en el rack donde terminan todos los cables horizontales del piso. Tiene puertos RJ45 en el frente.\n\nPatch Cord: cable corto y flexible (de 0.5 a 3m) con conectores en ambos extremos.\n\nFlujo de conexión:\nEquipo de red (Switch)\n→ Patch Cord (de equipo)\n→ Patch Panel\n→ Cable horizontal (90m fijo en la pared)\n→ Toma de usuario (TO, la roseta en la pared)\n→ Patch Cord (de usuario)\n→ PC / teléfono / otro equipo\n\nVentaja del patch panel: si necesitás mover un usuario de switch, solo cambiás el patch cord en el rack, sin tocar el cable de la pared.",
    tag: "Cableado Estructurado",
  },
  {
    id: 707,
    front: "¿Qué medios físicos contempla el estándar ANSI/TIA/EIA-568 y cuáles son sus características?",
    back: "Par trenzado (UTP/STP):\n• 4 pares de hilos de cobre, conector RJ45\n• UTP (Unshielded): sin blindaje — 100 ohms, calibre 22/24 AWG\n• STP (Shielded): con blindaje — 150 ohms, calibre 22/24 AWG\n• El trenzado reduce interferencia electromagnética entre pares (diafonía)\n\nFibra Óptica multimodo:\n• 62.5/125 μm y 50/125 μm — transmite luz en múltiples modos\n• Para distancias medias dentro de un edificio o campus\n\nCable coaxial: contemplado pero obsoleto para nuevas instalaciones.",
    tag: "Cableado Estructurado",
  },
  {
    id: 708,
    front: "¿Cuáles son las categorías de cable UTP y qué velocidad soporta cada una?",
    back: "| Categoría | BW | Velocidad máx | Conector |\n|---|---|---|---|\n| Cat 3 | 16 MHz | 10 Mbps | RJ45 |\n| Cat 5e | 100 MHz | 100/1000/2500 Mbps | RJ45 |\n| Cat 6 | 250 MHz | 1000/5000 Mbps | RJ45 |\n| Cat 6A | 500 MHz | 10.000 Mbps | RJ45 |\n| Cat 8 | 2000 MHz | 25.000-40.000 Mbps | RJ45/Non-RJ45 |\n\nDistancia estándar (CH/PL): 100/90 metros en todos los casos.\n\nPara recordar: cada generación duplica aproximadamente el ancho de banda y soporta más velocidad. Cat 5e es el mínimo recomendado hoy. Cat 6A es el estándar actual para nuevas instalaciones.",
    tag: "Cableado Estructurado",
  },
  {
    id: 709,
    front: "¿Qué es la certificación del cableado y qué parámetros mide?",
    back: "La certificación verifica que el cableado puede transportar señales dentro de los parámetros de calidad del estándar.\n\nParámetros principales (en azul en las slides = los más importantes):\n\n• Atenuación: pérdida de señal a lo largo del cable (más cable = más pérdida).\n\n• Paradiafonía (NEXT): interferencia de un par sobre otro en el MISMO extremo del cable (Near-End CrossTalk).\n\n• Paradiafonía de suma de potencia (PS-NEXT): cuando varios pares activos interfieren.\n\n• Relación atenuación/diafonía (ACR): relación señal-ruido — cuánta señal llega vs cuánto ruido hay.\n\n• Pérdida de retorno: señal que rebota por imperfecciones de impedancia.\n\n• Retardo de propagación: cuánto tarda la señal en recorrer el cable.\n\n• Sesgo de retardo: diferencia de tiempo entre pares del mismo cable (importante para Gigabit que usa los 4 pares).\n\nSe mide con analizadores automáticos.",
    tag: "Cableado Estructurado",
  },
  {
    id: 710,
    front: "¿Cuál es la diferencia entre T-568A y T-568B?",
    back: "Son los dos estándares de pinout (orden de los colores de los pares) para conectar el cable UTP al conector RJ45.\n\nT-568B (más común en América):\n1. Blanco/Naranja\n2. Naranja\n3. Blanco/Verde\n4. Azul\n5. Blanco/Azul\n6. Verde\n7. Blanco/Marrón\n8. Marrón\n\nT-568A (estándar federal en EE.UU.):\nIgual pero los pares naranja y verde intercambiados.\n\nRegla práctica:\n• Cable directo (Straight): mismo estándar en ambos extremos (PC → Switch)\n• Cable cruzado (Crossover): T-568A en un extremo, T-568B en el otro (PC → PC, Switch → Switch)\n\nHoy los equipos modernos tienen auto-MDIX y detectan automáticamente el tipo de cable.",
    tag: "Cableado Estructurado",
  },
  {
    id: 711,
    front: "¿Por qué el cable UTP tiene los pares trenzados? ¿Qué es la diafonía?",
    back: "El trenzado cumple dos funciones:\n1. Cancelación de interferencia externa (EMI): los dos hilos del par están tan cerca que la interferencia que afecta a uno afecta al otro por igual → se cancela.\n2. Reducción de diafonía entre pares: cada par tiene un número diferente de vueltas por metro, entonces las interferencias entre pares no se suman constructivamente.\n\nDiafonía (CrossTalk): señal de un par que 'se cuela' en el par vecino. Es el problema más crítico a alta velocidad.\n\nAnalogía: como dos micrófonos muy juntos — el trenzado es como poner una pantalla física entre ellos.\n\nPor eso no se deben destrenzar más de 1.3 cm al terminar el cable — si los desenroscás mucho, perdés la protección.",
    tag: "Cableado Estructurado",
  },
  {
    id: 712,
    front: "¿Cómo se interrelacionan los elementos funcionales del cableado estructurado? (jerarquía CD/BD/FD/TO)",
    back: "Jerarquía en árbol:\n\nCD (Campus Distributor) — nivel más alto\n  ↓ cableado de campus\nBD (Building Distributor) — uno por edificio\n  ↓ cableado vertical (backbone)\nFD (Floor Distributor) — uno por piso\n  ↓ cableado horizontal\nTO (Telecommunication Outlet) — uno por puesto\n  ↓ cableado de usuario\nEquipo del usuario (PC, teléfono, etc.)\n\nImportante:\n• Las funciones de CD, BD y FD pueden combinarse en un mismo armario (en edificios pequeños, los tres suelen estar juntos).\n• El FD es el armario de telecomunicaciones del piso (closet con rack).\n• El CD/BD suele estar en la sala de equipos del edificio.",
    tag: "Cableado Estructurado",
  },
];

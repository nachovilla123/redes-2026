export interface SubnetQuestion {
  id: string;
  label: string;
  answer: string;
  altAnswers?: string[];
  hint?: string;
  explanation?: string; // shown automatically when the answer is wrong
  placeholder?: string;
}

export interface SubnetExercise {
  id: number;
  title: string;
  scenario?: string;
  given: string;
  difficulty: "básico" | "intermedio" | "avanzado";
  questions: SubnetQuestion[];
}

export const subnetExercises: SubnetExercise[] = [
  {
    id: 1,
    title: "Identificación básica — Clase C",
    scenario: "Tenés la dirección de red 192.168.1.0/24. Respondé las siguientes preguntas.",
    given: "192.168.1.0 / 24",
    difficulty: "básico",
    questions: [
      {
        id: "clase",
        label: "¿Qué clase de IP es? (A / B / C)",
        answer: "c",
        altAnswers: ["clase c", "class c"],
        hint: "Mirá el primer octeto.",
        explanation:
          "Las clases se determinan por el primer octeto:\n• Clase A → 1 a 126\n• Clase B → 128 a 191\n• Clase C → 192 a 223\nEl primer octeto es 192 → entra en el rango 192–223 → Clase C.",
        placeholder: "A, B o C",
      },
      {
        id: "bits_red",
        label: "¿Cuántos bits de RED tiene la máscara?",
        answer: "24",
        explanation:
          "El prefijo /24 te dice directamente cuántos bits están reservados para la red. El número después de la barra es exactamente eso: 24 bits de red.",
        placeholder: "número",
      },
      {
        id: "bits_host",
        label: "¿Cuántos bits de HOST te quedan?",
        answer: "8",
        explanation:
          "Una dirección IPv4 tiene 32 bits en total.\n32 − bits de red = bits de host\n32 − 24 = 8 bits de host.\nCon 8 bits podés representar 2^8 = 256 direcciones.",
        placeholder: "número",
      },
      {
        id: "mascara",
        label: "¿Cuál es la máscara en notación decimal?",
        answer: "255.255.255.0",
        explanation:
          "24 bits en 1, luego 8 bits en 0:\n11111111.11111111.11111111.00000000\nEn decimal: 255.255.255.0\nCada octeto de 8 bits en 1 = 255. El último octeto (bits de host) = 0.",
        placeholder: "255.x.x.x",
      },
      {
        id: "hosts",
        label: "¿Cuántos hosts ÚTILES hay en esta red?",
        answer: "254",
        explanation:
          "Fórmula: 2^(bits de host) − 2\n2^8 − 2 = 256 − 2 = 254 hosts útiles.\nSe restan 2 porque:\n• La primera dirección es la dirección de RED (192.168.1.0) → no asignable.\n• La última dirección es el BROADCAST (192.168.1.255) → no asignable.",
        placeholder: "número",
      },
      {
        id: "red",
        label: "¿Cuál es la dirección de RED?",
        answer: "192.168.1.0",
        explanation:
          "La dirección de red tiene todos los bits de host en 0.\nCon /24, los primeros 3 octetos son fijos (192.168.1) y el cuarto octeto de host queda en 0.\n→ 192.168.1.0",
        placeholder: "x.x.x.x",
      },
      {
        id: "broadcast",
        label: "¿Cuál es la dirección de BROADCAST?",
        answer: "192.168.1.255",
        explanation:
          "El broadcast tiene todos los bits de host en 1.\nCon /24, el cuarto octeto es el de host → todos en 1 = 11111111 = 255.\n→ 192.168.1.255\nAtajo: dirección de red + tamaño del bloque − 1 = 192.168.1.0 + 256 − 1 = 192.168.1.255",
        placeholder: "x.x.x.x",
      },
      {
        id: "primera",
        label: "¿Cuál es la primera IP USABLE?",
        answer: "192.168.1.1",
        explanation:
          "La primera IP usable es la dirección de red + 1.\n192.168.1.0 + 1 = 192.168.1.1\nLa dirección .0 en sí no se asigna a ningún host — es la dirección de la red.",
        placeholder: "x.x.x.x",
      },
      {
        id: "ultima",
        label: "¿Cuál es la última IP USABLE?",
        answer: "192.168.1.254",
        explanation:
          "La última IP usable es el broadcast − 1.\n192.168.1.255 − 1 = 192.168.1.254\nEl broadcast .255 no se asigna a ningún host — es la dirección de difusión a toda la subred.",
        placeholder: "x.x.x.x",
      },
    ],
  },
  {
    id: 2,
    title: "Clase A — Red privada grande",
    scenario: "Tu empresa tiene asignada la red 10.0.0.0/8. ¿Cuántos hosts podés tener?",
    given: "10.0.0.0 / 8",
    difficulty: "básico",
    questions: [
      {
        id: "clase",
        label: "¿Qué clase de IP es? (A / B / C)",
        answer: "a",
        altAnswers: ["clase a", "class a"],
        explanation:
          "El primer octeto es 10.\n• Clase A → 1 a 126 ← 10 está aquí\n• Clase B → 128 a 191\n• Clase C → 192 a 223\n→ Clase A.",
        placeholder: "A, B o C",
      },
      {
        id: "bits_host",
        label: "¿Cuántos bits de HOST te quedan?",
        answer: "24",
        explanation:
          "32 bits totales − 8 bits de red (/8) = 24 bits de host.\nCon 24 bits podés tener 2^24 = 16.777.216 direcciones (¡más de 16 millones!).",
        placeholder: "número",
      },
      {
        id: "mascara",
        label: "¿Cuál es la máscara en notación decimal?",
        answer: "255.0.0.0",
        explanation:
          "Solo el primer octeto tiene bits de red (8 bits en 1):\n11111111.00000000.00000000.00000000\n= 255.0.0.0\nLos tres octetos restantes son todos bits de host → quedan en 0.",
        placeholder: "255.x.x.x",
      },
      {
        id: "hosts",
        label: "¿Cuántos hosts útiles hay? (ej: 16777214)",
        answer: "16777214",
        explanation:
          "2^24 − 2 = 16.777.216 − 2 = 16.777.214 hosts útiles.\nLa Clase A es ideal para redes enormes como las de grandes ISPs o empresas multinacionales.\nEl rango 10.x.x.x es privado (RFC 1918) — el más grande de los rangos privados.",
        placeholder: "número",
      },
      {
        id: "broadcast",
        label: "¿Cuál es la dirección de BROADCAST?",
        answer: "10.255.255.255",
        explanation:
          "Con /8, solo el primer octeto es red. Los últimos 3 octetos son host → todos en 1:\n10 . 11111111 . 11111111 . 11111111\n= 10.255.255.255",
        placeholder: "x.x.x.x",
      },
      {
        id: "primera",
        label: "¿Cuál es la primera IP USABLE?",
        answer: "10.0.0.1",
        explanation:
          "Dirección de red + 1 = 10.0.0.0 + 1 = 10.0.0.1",
        placeholder: "x.x.x.x",
      },
      {
        id: "ultima",
        label: "¿Cuál es la última IP USABLE?",
        answer: "10.255.255.254",
        explanation:
          "Broadcast − 1 = 10.255.255.255 − 1 = 10.255.255.254",
        placeholder: "x.x.x.x",
      },
    ],
  },
  {
    id: 3,
    title: "Clase B — Red corporativa",
    scenario: "Una empresa mediana usa la red 172.16.0.0/16. Identificá sus características.",
    given: "172.16.0.0 / 16",
    difficulty: "básico",
    questions: [
      {
        id: "clase",
        label: "¿Qué clase de IP es? (A / B / C)",
        answer: "b",
        altAnswers: ["clase b", "class b"],
        explanation:
          "El primer octeto es 172.\n• Clase A → 1 a 126\n• Clase B → 128 a 191 ← 172 está aquí\n• Clase C → 192 a 223\n→ Clase B.",
        placeholder: "A, B o C",
      },
      {
        id: "bits_host",
        label: "¿Cuántos bits de HOST te quedan?",
        answer: "16",
        explanation:
          "32 − 16 = 16 bits de host.\nCon 16 bits de host → 2^16 = 65.536 direcciones posibles.",
        placeholder: "número",
      },
      {
        id: "mascara",
        label: "¿Cuál es la máscara en notación decimal?",
        answer: "255.255.0.0",
        explanation:
          "Los primeros 2 octetos tienen bits de red (16 bits en 1):\n11111111.11111111.00000000.00000000\n= 255.255.0.0\nLos últimos 2 octetos son bits de host → quedan en 0.",
        placeholder: "255.x.x.x",
      },
      {
        id: "hosts",
        label: "¿Cuántos hosts útiles hay?",
        answer: "65534",
        explanation:
          "2^16 − 2 = 65.536 − 2 = 65.534 hosts útiles.\nClase B cubre rangos como 172.16.x.x a 172.31.x.x (privados según RFC 1918).",
        placeholder: "número",
      },
      {
        id: "broadcast",
        label: "¿Cuál es la dirección de BROADCAST?",
        answer: "172.16.255.255",
        explanation:
          "Con /16, los últimos 2 octetos son bits de host → todos en 1:\n172.16 . 11111111 . 11111111\n= 172.16.255.255",
        placeholder: "x.x.x.x",
      },
      {
        id: "primera",
        label: "¿Cuál es la primera IP USABLE?",
        answer: "172.16.0.1",
        explanation: "Dirección de red + 1 = 172.16.0.0 + 1 = 172.16.0.1",
        placeholder: "x.x.x.x",
      },
      {
        id: "ultima",
        label: "¿Cuál es la última IP USABLE?",
        answer: "172.16.255.254",
        explanation: "Broadcast − 1 = 172.16.255.255 − 1 = 172.16.255.254",
        placeholder: "x.x.x.x",
      },
    ],
  },
  {
    id: 4,
    title: "Subnetting /26 — Una subred específica",
    scenario:
      "Dentro de la red 192.168.1.0/24, se crearon 4 subredes iguales (/26). Trabajás con la segunda subred.",
    given: "192.168.1.64 / 26",
    difficulty: "intermedio",
    questions: [
      {
        id: "bits_host",
        label: "¿Cuántos bits de HOST te quedan?",
        answer: "6",
        explanation:
          "32 − 26 = 6 bits de host.\nEn el último octeto: los 2 primeros bits son de subred, los 6 restantes son de host.\nEjemplo: 01|000000 (01 = subred 1, 000000 = host).",
        placeholder: "número",
      },
      {
        id: "mascara",
        label: "¿Cuál es la máscara en notación decimal?",
        answer: "255.255.255.192",
        explanation:
          "26 bits en 1 → los primeros 3 octetos son 255, y en el 4to octeto los 2 primeros bits son 1:\n11000000 en binario = 128 + 64 = 192\n→ Máscara: 255.255.255.192",
        placeholder: "255.x.x.x",
      },
      {
        id: "hosts",
        label: "¿Cuántos hosts ÚTILES hay en esta subred?",
        answer: "62",
        explanation:
          "2^(bits de host) − 2 = 2^6 − 2 = 64 − 2 = 62 hosts útiles.\nCada subred /26 tiene 64 direcciones en total, pero 2 están reservadas (red y broadcast).",
        placeholder: "número",
      },
      {
        id: "red",
        label: "¿Cuál es la dirección de RED de esta subred?",
        answer: "192.168.1.64",
        explanation:
          "El 64 en binario es 01|000000 (bits de subred=01, bits de host=000000).\nCon todos los bits de host en 0 → es la dirección de red.\n→ 192.168.1.64",
        placeholder: "x.x.x.x",
      },
      {
        id: "broadcast",
        label: "¿Cuál es la dirección de BROADCAST?",
        answer: "192.168.1.127",
        explanation:
          "Broadcast = dirección de red + tamaño del bloque − 1\nTamaño del bloque = 2^6 = 64 direcciones\n64 + 64 − 1 = 127\n→ 192.168.1.127\nEn binario: 01|111111 = 127 ✓",
        placeholder: "x.x.x.x",
      },
      {
        id: "primera",
        label: "¿Cuál es la primera IP USABLE?",
        answer: "192.168.1.65",
        explanation:
          "Dirección de red + 1 = 192.168.1.64 + 1 = 192.168.1.65",
        placeholder: "x.x.x.x",
      },
      {
        id: "ultima",
        label: "¿Cuál es la última IP USABLE?",
        answer: "192.168.1.126",
        explanation:
          "Broadcast − 1 = 192.168.1.127 − 1 = 192.168.1.126",
        placeholder: "x.x.x.x",
      },
      {
        id: "subredes_totales",
        label: "¿Cuántas subredes /26 caben en total en 192.168.1.0/24?",
        answer: "4",
        explanation:
          "Bits de subred tomados = 26 − 24 = 2 bits\n2^2 = 4 subredes posibles:\n• .0/26 (00|xxxxxx)\n• .64/26 (01|xxxxxx) ← esta\n• .128/26 (10|xxxxxx)\n• .192/26 (11|xxxxxx)",
        placeholder: "número",
      },
    ],
  },
  {
    id: 5,
    title: "Subnetting /27 — Subred más chica",
    scenario: "Necesitás una subred para 25 equipos. Usás 192.168.5.128/27.",
    given: "192.168.5.128 / 27",
    difficulty: "intermedio",
    questions: [
      {
        id: "bits_host",
        label: "¿Cuántos bits de HOST te quedan?",
        answer: "5",
        explanation:
          "32 − 27 = 5 bits de host.\nEn el último octeto: los 3 primeros bits son de subred, los 5 restantes de host.",
        placeholder: "número",
      },
      {
        id: "mascara",
        label: "¿Cuál es la máscara en notación decimal?",
        answer: "255.255.255.224",
        explanation:
          "27 bits en 1. En el 4to octeto, los 3 primeros bits son 1:\n11100000 = 128 + 64 + 32 = 224\n→ Máscara: 255.255.255.224",
        placeholder: "255.x.x.x",
      },
      {
        id: "hosts",
        label: "¿Cuántos hosts útiles hay?",
        answer: "30",
        altAnswers: ["30, sí", "30 si"],
        explanation:
          "2^5 − 2 = 32 − 2 = 30 hosts útiles.\nCon 30 hosts útiles alcanza para 25 equipos (sobran 5 lugares).",
        placeholder: "número",
      },
      {
        id: "broadcast",
        label: "¿Cuál es la dirección de BROADCAST?",
        answer: "192.168.5.159",
        explanation:
          "128 en binario: 10000000 → bits de subred = 100, bits de host = 00000\nBroadcast: todos los bits de host en 1 → 10011111\n128 + 16 + 8 + 4 + 2 + 1 = 159\n→ 192.168.5.159\nAtajo: 128 + 32 − 1 = 159 ✓",
        placeholder: "x.x.x.x",
      },
      {
        id: "primera",
        label: "¿Cuál es la primera IP USABLE?",
        answer: "192.168.5.129",
        explanation:
          "Dirección de red + 1 = 192.168.5.128 + 1 = 192.168.5.129",
        placeholder: "x.x.x.x",
      },
      {
        id: "ultima",
        label: "¿Cuál es la última IP USABLE?",
        answer: "192.168.5.158",
        explanation:
          "Broadcast − 1 = 192.168.5.159 − 1 = 192.168.5.158",
        placeholder: "x.x.x.x",
      },
      {
        id: "puede_25",
        label: "¿Se puede usar esta subred para 25 hosts? (sí / no)",
        answer: "sí",
        altAnswers: ["si", "yes", "s"],
        explanation:
          "Sí. Esta subred tiene 30 hosts útiles y necesitás 25 → 25 ≤ 30 → alcanza.",
        placeholder: "sí o no",
      },
      {
        id: "puede_35",
        label: "¿Se podría usar esta misma subred para 35 hosts? (sí / no)",
        answer: "no",
        altAnswers: ["n", "nope"],
        explanation:
          "No. Esta subred tiene solo 30 hosts útiles y necesitarías 35 → 35 > 30 → no alcanza.\nNecesitarías al menos /26 (62 hosts) para cubrir 35 equipos.",
        placeholder: "sí o no",
      },
    ],
  },
  {
    id: 6,
    title: "Clase B subneteada — /19",
    scenario: "Una universidad usa la subred 172.20.32.0/19 para su campus principal.",
    given: "172.20.32.0 / 19",
    difficulty: "avanzado",
    questions: [
      {
        id: "clase",
        label: "¿Qué clase de IP es? (A / B / C)",
        answer: "b",
        altAnswers: ["clase b", "class b"],
        explanation:
          "El primer octeto es 172.\n• Clase B → 128 a 191 ← 172 está aquí\n→ Clase B.",
        placeholder: "A, B o C",
      },
      {
        id: "bits_host",
        label: "¿Cuántos bits de HOST te quedan?",
        answer: "13",
        explanation:
          "32 − 19 = 13 bits de host.\nEn el tercer octeto: los 3 primeros bits son de subred (19 − 16 = 3), los 5 restantes son de host. Más el cuarto octeto completo (8 bits) → 5 + 8 = 13 bits de host.",
        placeholder: "número",
      },
      {
        id: "mascara",
        label: "¿Cuál es la máscara en notación decimal?",
        answer: "255.255.224.0",
        explanation:
          "19 bits en 1. Los primeros 2 octetos = 255.255. En el 3er octeto, los 3 primeros bits son 1:\n11100000 = 128 + 64 + 32 = 224\n→ Máscara: 255.255.224.0",
        placeholder: "255.x.x.x",
      },
      {
        id: "hosts",
        label: "¿Cuántos hosts útiles hay?",
        answer: "8190",
        explanation:
          "2^13 − 2 = 8.192 − 2 = 8.190 hosts útiles.\nEs una subred grande, ideal para un campus universitario con miles de dispositivos.",
        placeholder: "número",
      },
      {
        id: "red",
        label: "¿Cuál es la dirección de RED?",
        answer: "172.20.32.0",
        explanation:
          "El tercer octeto es 32 = 00100000 en binario.\nCon /19, los 3 primeros bits del tercer octeto son de subred (001) y los 5 restantes de host (00000).\nTodos los bits de host en 0 → dirección de red = 172.20.32.0",
        placeholder: "x.x.x.x",
      },
      {
        id: "broadcast",
        label: "¿Cuál es la dirección de BROADCAST?",
        answer: "172.20.63.255",
        explanation:
          "Broadcast = red + tamaño del bloque − 1\nTamaño = 2^13 = 8.192\n172.20.32.0 + 8.192 − 1:\n→ El tercer octeto: 32 en binario = 00100000. Bits de host todos en 1: 00111111 = 63\n→ El cuarto octeto todo en 1 = 255\n→ Broadcast: 172.20.63.255",
        placeholder: "x.x.x.x",
      },
      {
        id: "primera",
        label: "¿Cuál es la primera IP USABLE?",
        answer: "172.20.32.1",
        explanation:
          "Dirección de red + 1 = 172.20.32.0 + 1 = 172.20.32.1",
        placeholder: "x.x.x.x",
      },
      {
        id: "ultima",
        label: "¿Cuál es la última IP USABLE?",
        answer: "172.20.63.254",
        explanation:
          "Broadcast − 1 = 172.20.63.255 − 1 = 172.20.63.254",
        placeholder: "x.x.x.x",
      },
      {
        id: "subredes",
        label: "¿Cuántas subredes /19 caben en la red clase B original (172.20.0.0/16)?",
        answer: "8",
        explanation:
          "Bits de subred = 19 − 16 = 3 bits\n2^3 = 8 subredes posibles en el espacio /16.\nCada una cubre un bloque de 8.192 direcciones:\n172.20.0.0/19, 172.20.32.0/19, 172.20.64.0/19, … hasta 172.20.224.0/19",
        placeholder: "número",
      },
    ],
  },
];

import type { Flashcard } from "./clase1";

export const TOPIC6 = {
  title: "VLSM, DHCP y DNS",
  subtitle: "Unidad 3 · Clase 2",
  source: "Subnetting variable, DORA, jerarquía DNS",
};

export const flashcardsClase6: Flashcard[] = [
  // FLSM (Subnetting fijo)
  {
    id: 514,
    front: "¿Qué es FLSM (subnetting fijo) y cuándo se usa?",
    back: "FLSM (Fixed Length Subnet Mask): todos los segmentos de la red usan la misma máscara → subredes de igual tamaño.\n\nCuándo usarlo: cuando todos los segmentos necesitan aproximadamente la misma cantidad de hosts (ej: 4 departamentos con 50 equipos cada uno).\n\nProcedimiento:\n1. Determinar cuántas subredes necesitás → n bits de subred → 2^n subredes\n2. Nueva máscara = máscara original + n bits\n3. Cada subred tiene 2^(bits de host) - 2 hosts útiles\n\nEjemplo: Red 192.168.1.0/24, necesito 4 subredes iguales:\n• 4 subredes → 2 bits → /26 (255.255.255.192)\n• Cada subred: 2^6 - 2 = 62 hosts útiles\n• Subredes: .0/26, .64/26, .128/26, .192/26\n\nVentaja: simple de calcular\nDesventaja: desperdicio si las subredes tienen necesidades muy diferentes → ahí se usa VLSM",
    tag: "Subnetting",
  },
  {
    id: 515,
    front: "¿Cuáles son los 4 métodos de VLSM y cuándo conviene cada uno?",
    back: "VLSM permite subredes de diferentes tamaños en la misma red.\n\n1. TOP-DOWN (Descendente):\n• Se asigna de mayor a menor tamaño\n• Ventaja: maximiza el espacio, menos fragmentación\n• Cuándo: cuando conocés todos los requerimientos de antemano\n• Paso clave: ordenar por hosts requeridos de MAYOR a MENOR\n\n2. BOTTOM-UP (Ascendente):\n• Se asigna de menor a mayor tamaño\n• Ventaja: útil si las subredes pequeñas son críticas o numerosas\n• Riesgo: las subredes grandes pueden no entrar al final — fragmentación\n• Cuándo: muchas oficinas pequeñas / sensores IoT\n\n3. SUPERNET + DIVISIÓN:\n• Se toma un bloque grande (supernet) y se subdivide\n• Ventaja: flexibilidad total\n• Cuándo: diseños jerárquicos (ISP, data centers, universidades)\n\n4. VLSM JERÁRQUICO CON RUTAS AGREGADAS:\n• Se diseña pensando en resumir rutas en los routers\n• Ventaja: reduce tablas de enrutamiento y tráfico de actualizaciones\n• Cuándo: redes grandes con muchos routers (OSPF, BGP)",
    tag: "Subnetting",
  },
  {
    id: 516,
    front: "¿Qué es el Supernetting/CIDR y cómo se calcula el resumen?",
    back: "Supernetting (o agregación CIDR): combinar varias subredes contiguas en una sola entrada de la tabla de rutas.\n\nPor qué importa: reduce el tamaño de las tablas de rutas → menor uso de memoria y CPU en routers → mejor rendimiento.\n\nCondiciones para poder resumir:\n• Las redes deben ser CONTIGUAS (sin huecos entre ellas)\n• La cantidad de redes debe ser potencia de 2 (2, 4, 8, 16...)\n• Deben estar ALINEADAS: la primera red debe empezar en un límite binario correcto\n\nCómo se calcula:\n1. Escribir las direcciones en binario\n2. Encontrar los bits comunes de izquierda → ese es el nuevo prefijo\n3. La dirección del resumen = primera dirección de las subredes con el nuevo prefijo\n\nEjemplo:\n192.168.4.0/24 = 00000100\n192.168.5.0/24 = 00000101\n192.168.6.0/24 = 00000110\n192.168.7.0/24 = 00000111\n→ 6 bits comunes en el 3er octeto → /22\n→ Resumen: 192.168.4.0/22\n\nNo se puede resumir si hay un 'hueco' (ej: falta 192.168.5.0)",
    tag: "Subnetting",
  },
  {
    id: 517,
    front: "¿Qué es la 'subred 0' y se puede usar en redes modernas?",
    back: "La subred 0 es la subred donde los bits de subred son todos ceros.\nEjemplo: si dividís 192.168.1.0/24 en /26, la subred 0 es 192.168.1.0/26.\n\nHistoria:\n• Originalmente (RFC 950) estaba PROHIBIDA porque su dirección coincidía con la red original sin subnetear → posible confusión en el ruteo\n• Estaba reservada junto con la 'subred broadcast' (todos los bits de subred en 1)\n\nSituación actual:\n• El RFC 1878 y tecnologías modernas PERMITEN usar la subred 0\n• Todos los routers/switches/servidores modernos la soportan por defecto\n• Hoy es completamente válido usar 192.168.1.0/26 en producción\n\nConsejo para el examen:\n• Leer el enunciado con cuidado — si dice 'no usar subred 0', respetarlo\n• Si no dice nada, en contextos modernos se puede usar\n• En equipamiento muy antiguo o configuraciones heredadas puede haber restricciones",
    tag: "Subnetting",
  },
  // VLSM
  {
    id: 501,
    front: "¿Qué es VLSM y cuál es la regla de oro para aplicarlo?",
    back: "VLSM (Variable Length Subnet Mask): técnica de subnetting donde cada subred puede tener una máscara diferente, optimizando el uso de direcciones.\n\nRegla de oro: ordenar los requerimientos de MAYOR a MENOR cantidad de hosts y asignarlos en ese orden, empezando desde la primera dirección disponible.\n\nSi empezás con las subredes chicas, las grandes pueden no entrar en el espacio restante.",
    tag: "VLSM",
  },
  {
    id: 502,
    front: "¿Cómo se calcula la máscara para una subred con N hosts requeridos?",
    back: "Fórmula:\n1. Necesitás N + 2 direcciones (N hosts + dirección de red + broadcast)\n2. Buscás la potencia de 2 más chica que sea ≥ N + 2\n3. Bits de host = log₂(esa potencia) → máscara = /32 − bits de host\n\nTabla de referencia:\n| Hosts | N+2 | Bloque | Bits host | Máscara |\n|---|---|---|---|---|\n| 2 | 4 | 4 | 2 | /30 |\n| 6 | 8 | 8 | 3 | /29 |\n| 14 | 16 | 16 | 4 | /28 |\n| 28 | 30 | 32 | 5 | /27 |\n| 62 | 64 | 64 | 6 | /26 |\n| 126 | 128 | 128 | 7 | /25 |\n| 254 | 256 | 256 | 8 | /24 |",
    tag: "VLSM",
  },
  {
    id: 503,
    front: "Errores comunes a evitar en VLSM",
    back: "• No ordenar de mayor a menor: si empezás con las subredes chicas, las grandes no entran después\n\n• Confundir hosts requeridos con tamaño del bloque: para 14 hosts necesitás bloque de 16, no de 14\n\n• Olvidar restar 2: dirección de red y broadcast no son asignables\n\n• Subred cero: leer el enunciado con cuidado — a veces la subred 0 no es asignable (debe reservarse), a veces sí lo es\n\n• No verificar: broadcast de una subred = inicio de la siguiente − 1",
    tag: "VLSM",
  },
  // DHCP
  {
    id: 504,
    front: "¿Qué información entrega un servidor DHCP al cliente?",
    back: "Como mínimo:\n• Dirección IP (la que el dispositivo va a usar)\n• Máscara de subred\n• Default gateway (IP del router para salir a internet)\n• Servidor DNS\n• Lease time (por cuánto tiempo es válida la configuración)\n\nOpcional: servidor NTP, nombre de dominio, servidores WINS, etc.\n\nAnalogía: el hotel asigna habitación (IP), dice hasta cuándo podés usarla (lease), y te da el mapa (gateway) y la guía telefónica (DNS).",
    tag: "DHCP",
  },
  {
    id: 505,
    front: "¿Cuáles son los 4 mensajes del proceso DORA?",
    back: "D — DHCPDISCOVER: el cliente sin IP envía broadcast '¿hay algún servidor DHCP?'\n   (IP origen: 0.0.0.0, destino: 255.255.255.255, UDP 68→67)\n\nO — DHCPOFFER: el servidor responde con una IP propuesta y parámetros de red\n\nR — DHCPREQUEST: el cliente acepta la oferta (broadcast para que todos los servidores lo sepan)\n\nA — DHCPACK: el servidor confirma. El cliente recién ahora configura su interfaz.\n\nSi la IP ya estaba ocupada → DHCPNAK (negative ACK) en lugar de DHCPACK.",
    tag: "DHCP",
  },
  {
    id: 506,
    front: "¿Por qué el DHCPREQUEST (paso 3 del DORA) también se envía como broadcast?",
    back: "Porque puede haber varios servidores DHCP en la red. Cada uno hizo una oferta y reservó temporalmente la IP que ofreció.\n\nAl enviar DHCPREQUEST como broadcast, el cliente indica cuál oferta aceptó (via 'server identifier'). Los demás servidores que NO fueron elegidos ven el mensaje y liberan sus reservas.\n\nSi fuera unicast solo al servidor elegido, los otros no se enterarían y mantendrían esas IPs reservadas innecesariamente.",
    tag: "DHCP",
  },
  {
    id: 507,
    front: "¿Cómo funciona la renovación del lease DHCP?",
    back: "El lease tiene tres momentos clave:\n\nT1 = 50% del lease:\n→ El cliente envía DHCPREQUEST unicast al servidor original para renovar\n\nT2 = 87.5% del lease:\n→ Si T1 falló, envía DHCPREQUEST broadcast a cualquier servidor disponible\n\n100% del lease:\n→ Si tampoco renovó, el cliente PIERDE la IP y debe iniciar el proceso DORA desde cero\n→ Mientras tanto no tiene conectividad de red",
    tag: "DHCP",
  },
  {
    id: 508,
    front: "¿Qué es el DHCP Relay Agent y por qué es necesario?",
    back: "Problema: DHCPDISCOVER es broadcast. Los broadcasts NO atraviesan routers. Si el servidor DHCP está en otra red, el cliente nunca lo alcanza.\n\nSolución: el DHCP Relay Agent (o DHCP Helper) es una función del router.\n\nFuncionamiento:\n1. El relay recibe el broadcast de la subred local\n2. Le agrega el campo giaddr (su propia IP en esa subred)\n3. Lo reenvía como unicast al servidor DHCP remoto\n4. El servidor sabe en qué subred está el cliente por el giaddr y ofrece una IP del pool correcto\n\nConfigura en Cisco: ip helper-address <IP del servidor DHCP>",
    tag: "DHCP",
  },
  // DNS
  {
    id: 509,
    front: "¿Qué es DNS y cuál es su jerarquía?",
    back: "DNS (Domain Name System): sistema distribuido que traduce nombres de dominio a direcciones IP.\n\nJerarquía (de arriba hacia abajo):\n. (root) → .com / .ar / .org (TLD) → google.com (dominio) → www.google.com (subdominio)\n\nActores clave:\n• Root servers: conocen los servidores de cada TLD (13 direcciones IP anycast)\n• TLD servers: conocen los nameservers de cada dominio (.com lo maneja Verisign)\n• Authoritative nameserver: tiene la respuesta final para un dominio\n• Recursive resolver: hace todo el trabajo por el cliente (8.8.8.8, 1.1.1.1)\n• Stub resolver: el cliente (tu PC) — solo pregunta",
    tag: "DNS",
  },
  {
    id: 510,
    front: "¿Cuál es la diferencia entre resolución DNS iterativa y recursiva?",
    back: "Iterativa (la que usa el resolver en la práctica):\n• El resolver le pregunta a cada servidor\n• Cada servidor responde 'no sé, pero preguntale a tal'\n• El resolver hace todo el trabajo hasta obtener la respuesta final\n\nRecursiva:\n• El servidor al que le preguntás hace todo el trabajo él solo\n• Devuelve directamente la respuesta final\n• Los root servers NO la soportan (sería demasiada carga)\n\nFlujo típico: PC → resolver (recursivo) → root (iterativo) → TLD (iterativo) → autoritativo (respuesta final) → resolver → PC",
    tag: "DNS",
  },
  {
    id: 511,
    front: "¿Cuáles son los tipos de registros DNS más importantes?",
    back: "A: nombre → IPv4\nAAAA: nombre → IPv6\nCNAME: alias de otro nombre (el resolver sigue resolviendo hasta encontrar A/AAAA)\nMX: servidor de correo del dominio (con prioridad — menor número = preferido)\nNS: servidores autoritativos del dominio\nSOA: Start of Authority — uno por zona, contiene servidor primario, email del admin, número de serie y tiempos de sincronización\nPTR: IP → nombre (resolución inversa, usa in-addr.arpa)\nTXT: texto libre — usado para SPF, DKIM, DMARC, verificación de dominio\n\nImportante: un CNAME NO se puede usar en el apex del dominio (ej: empresa.com no puede ser CNAME).",
    tag: "DNS",
  },
  {
    id: 512,
    front: "¿Qué es el TTL en DNS y cómo afecta la propagación de cambios?",
    back: "TTL (Time To Live): tiempo en segundos que un resolver puede guardar en caché una respuesta DNS antes de volver a consultarla.\n\nEjemplo: TTL=300 → la respuesta se cachea 5 minutos.\n\nImplicaciones:\n• TTL alto (86400 = 1 día): menos carga en el servidor, pero los cambios tardan en propagarse\n• TTL bajo (60 = 1 min): cambios más rápidos, pero más consultas al servidor autoritativo\n\nPor eso se dice que 'un cambio de DNS tarda hasta 24/48hs en propagarse' — cada resolver lo sigue usando hasta que venza su TTL.",
    tag: "DNS",
  },
  {
    id: 513,
    front: "¿Qué es DNSSEC y qué problema resuelve?",
    back: "Problema que resuelve: el envenenamiento de caché (cache poisoning / ataque Kaminsky). Un atacante puede inyectar respuestas DNS falsas en el caché de un resolver, redirigiendo tráfico a sitios maliciosos.\n\nDNSSEC: extensión de seguridad que firma criptográficamente las respuestas DNS con claves públicas/privadas. El resolver puede verificar que la respuesta viene del servidor correcto y no fue alterada.\n\nRegistros adicionales que usa:\n• RRSIG: la firma criptográfica\n• DNSKEY: la clave pública para verificar\n• DS: hash de la clave del hijo (cadena de confianza)\n• NSEC/NSEC3: prueba de que un dominio NO existe",
    tag: "DNS",
  },
];

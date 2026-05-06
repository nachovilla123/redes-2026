import type { Flashcard } from "./clase1";

export const TOPIC10 = {
  title: "Redes Privadas Virtuales (VPN)",
  subtitle: "Unidad 5 · Clase 4",
  source: "PPTP, L2TP, IPSec, SSL/TLS, MPLS",
};

export const flashcardsClase10: Flashcard[] = [
  {
    id: 1001,
    front: "¿Qué es una VPN y qué problema resuelve?",
    back: "Una VPN (Red Privada Virtual) permite conectar LANs o usuarios remotos entre sí de forma segura a través de Internet (medio inseguro).\n\nLo logra combinando tres mecanismos:\n  · Autenticación — verificás quién se conecta\n  · Encriptación — los datos viajan cifrados\n  · Túneles — encapsulan el tráfico privado dentro de paquetes públicos\n\nAnalogía: es como enviar una carta dentro de un sobre sellado y cifrado, usando el correo común (Internet) para que nadie en el camino pueda leerla.",
    tag: "VPN",
  },
  {
    id: 1002,
    front: "¿Qué tecnologías WAN existían antes de las VPN?",
    back: "Antes de las VPN, las empresas usaban:\n\nEnlaces Dedicados:\n  · Línea física exclusiva entre dos puntos\n  · Muy caro, infraestructura de voz reutilizada\n  · Ej: Frame Relay, ATM, Clear Channel\n\nEnlaces Conmutados:\n  · Conexión establecida por demanda (llamada)\n  · Ej: acceso analógico, RDSI, PPP por módem\n  · Altos costos por llamada, sin encriptación\n\nEl problema de todas: costosas, difíciles de escalar y sin confidencialidad real.",
    tag: "VPN",
  },
  {
    id: 1003,
    front: "¿Qué es Frame Relay y cómo se relaciona con VPN?",
    back: "Frame Relay es un protocolo WAN de capa 2 (física + enlace de datos) orientado a paquetes.\n\nCaracterísticas:\n  · Comparte dinámicamente el medio y el ancho de banda\n  · Ancho de banda: 64 kbps hasta 4 Mbps\n  · Alto rendimiento y eficiencia de transmisión\n  · Usa PVCs (Circuitos Virtuales Permanentes)\n\nProblema con intranet LAN-to-LAN:\n  · Concentra tráfico en un nodo central\n  · Se cobra por PVC activado → costoso\n  · Las VPN reemplazaron Frame Relay usando Internet como transporte.",
    tag: "VPN",
  },
  {
    id: 1004,
    front: "¿Qué es ATM y en qué se diferencia de Frame Relay?",
    back: "ATM (Asynchronous Transfer Mode) es un protocolo de transporte de alta velocidad.\n\n  · Velocidades: 155 Mbps y 622 Mbps (4 canales × 155 Mbps)\n  · Diseñado para tráfico multimedia: datos, voz, video e imágenes\n  · Se usa principalmente como red troncal (Backbone)\n  · Transmite en celdas fijas de 53 bytes\n\nDiferencia clave con Frame Relay:\n  · ATM es mucho más rápido y soporta multimedia\n  · Frame Relay usa tramas de tamaño variable\n  · ATM es backbone, Frame Relay era más de acceso corporativo",
    tag: "VPN",
  },
  {
    id: 1005,
    front: "¿Qué es PPP y cuál es su rol en VPN?",
    back: "PPP (Protocolo Punto a Punto) es un protocolo de capa 2 de la pila TCP/IP.\n\n  · Transporta datagramas multiprotocolo sobre enlaces punto a punto\n  · Se usaba para conectar usuarios a Internet via módem telefónico\n  · También en banda ancha: PPPoE (Ethernet), PPPoA (ATM)\n\nRol en VPN:\n  · PPTP y L2TP se construyen sobre PPP\n  · PPP maneja la autenticación del usuario\n  · El protocolo VPN agrega el encapsulamiento y el túnel sobre PPP\n\nLimitación original: no soportaba encriptación de datos por sí solo.",
    tag: "VPN",
  },
  {
    id: 1006,
    front: "¿Cuáles son los tres tipos de VPN según su uso?",
    back: "1. Acceso Remoto:\n  · Usuario individual se conecta a la red corporativa desde cualquier lugar\n  · Reemplazó los servidores RAS (Remote Access Server) corporativos\n  · Ideal para teletrabajo, viajes, acceso mundial\n\n2. Intranet LAN-to-LAN:\n  · Conecta dos o más oficinas de la misma empresa\n  · Reemplaza Frame Relay entre sucursales\n  · Se evalúa: costo, seguridad, ancho de banda, cobertura Internet\n\n3. Extranet:\n  · Conecta empresas distintas entre sí\n  · Las empresas intercambian información usando Internet como medio\n  · Requiere control de acceso estricto entre organizaciones",
    tag: "VPN",
  },
  {
    id: 1007,
    front: "VPN por Hardware vs VPN por Software — diferencias clave",
    back: "Hardware:\n  · Encriptación a nivel físico (procesador dedicado)\n  · Dispositivos: routers con VPN incorporada\n  · Ventajas: fácil instalación, un equipo habilita múltiples VPNs, independiente de las PCs\n  · Desventajas: firmware cerrado (dependés del fabricante), algoritmos de un solo tipo, ambos extremos deben ser del mismo fabricante, el tramo PC→dispositivo VPN viaja sin cifrar\n\nSoftware:\n  · Gran variedad de opciones, en constante mejora\n  · Mayor base de usuarios → más documentación y soporte\n  · Cubre intranet y extranet\n  · La seguridad puede cubrir el camino completo desde el host",
    tag: "VPN",
  },
  {
    id: 1008,
    front: "¿Qué es PPTP y cómo funciona?",
    back: "PPTP (Point-to-Point Tunneling Protocol) es el protocolo VPN más antiguo y simple.\n\n  · Desarrollado por Microsoft, incluido en Windows\n  · Se construye sobre PPP para crear túneles sobre Internet\n  · Encapsula paquetes IP, IPX y NetBEUI\n  · Usa GRE (Generic Routing Encapsulation) para encapsular tramas PPP\n\nUso típico: pequeñas empresas con entornos Microsoft.\n\nLimitación: seguridad considerada débil hoy en día — tiene vulnerabilidades conocidas en sus mecanismos de autenticación.",
    tag: "VPN · Protocolos",
  },
  {
    id: 1009,
    front: "¿Qué es L2TP y en qué mejora a PPTP?",
    back: "L2TP (Layer 2 Tunneling Protocol) fue creado como sucesor de PPTP y L2F.\n\nOrigen: Microsoft (PPTP) + Cisco (L2F) se unieron para crear un estándar IETF.\n\nMejoras sobre PPTP:\n  · Soporta multiprotocolo\n  · Un único túnel puede tener múltiples conexiones\n  · El tunelamiento no depende de IP ni de GRE\n\nLimitación importante:\n  · L2TP por sí solo NO cifra el tráfico — no hay confidencialidad de datos\n  · Por eso se usa casi siempre combinado: L2TP/IPSec\n  · IPSec agrega la capa de encriptación que L2TP no tiene",
    tag: "VPN · Protocolos",
  },
  {
    id: 1010,
    front: "¿Qué es IPSec y qué servicios de seguridad provee?",
    back: "IPSec es un conjunto de protocolos criptográficos para asegurar comunicaciones IP.\n\nCaracterísticas:\n  · Trabaja en Capa 3 (red) del modelo OSI\n  · Incluido nativamente en IPv6\n  · No depende de un algoritmo criptográfico específico (modular)\n  · Solo aplicable a IP\n  · Independiente del transporte y la infraestructura\n\nServicios que provee:\n  · Control de acceso\n  · Integridad de datos\n  · Autenticación del origen\n  · Protección anti-repetición\n  · Confidencialidad (encriptación)\n\nUso más común: L2TP/IPSec — L2TP pone el túnel, IPSec cifra el contenido.",
    tag: "VPN · Protocolos",
  },
  {
    id: 1011,
    front: "¿Qué son las VPN SSL/TLS y cuándo se usan?",
    back: "Las VPN SSL (Secure Socket Layer) usan el protocolo HTTPS como transporte del túnel.\n\nObjetivos:\n  · Facilitar acceso a través de firewalls (usan puerto 443 — siempre abierto)\n  · Funcionar correctamente detrás de NAT\n  · No requieren cliente instalado → Web VPN (solo navegador)\n\nProductos más usados:\n  · SSTP (Secure Socket Tunneling Protocol) — Microsoft\n  · OpenVPN — open source, muy flexible\n  · SSL-Explorer\n\nVentaja clave: como usa el puerto 443 (HTTPS normal), no tiene los problemas de bloqueo que sufren PPTP o L2TP en redes restrictivas.",
    tag: "VPN · Protocolos",
  },
  {
    id: 1012,
    front: "¿Qué es SSTP y cómo se diferencia de otros protocolos VPN?",
    back: "SSTP (Secure Socket Tunneling Protocol) es un protocolo de tunelamiento desarrollado por Microsoft.\n\nCómo funciona:\n  · Encapsula tráfico PPP dentro del canal HTTPS (puerto TCP 443)\n  · Usa PPP → hereda todos sus métodos de autenticación seguros (ej: EAP-TLS)\n  · El tráfico pasa por el puerto 443, el mismo del acceso web normal\n\nVentaja principal:\n  · Atraviesa firewalls y NATs sin configuración especial\n  · Elimina los problemas de bloqueo de PPTP (GRE bloqueado) y L2TP (UDP 500/4500 bloqueado)\n\nLimitación: protocolo propietario de Microsoft — mejor soporte en Windows que en otros sistemas.",
    tag: "VPN · Protocolos",
  },
  {
    id: 1013,
    front: "Comparativa rápida: PPTP vs L2TP vs IPSec vs SSL",
    back: "PPTP:\n  · Capa 2 · sobre PPP + GRE · cifrado débil\n  · Fácil de configurar, Windows nativo\n\nL2TP:\n  · Capa 2 · estándar IETF · sin cifrado propio\n  · Siempre se usa con IPSec → L2TP/IPSec\n\nIPSec:\n  · Capa 3 · solo IP · cifrado robusto\n  · Nativo en IPv6 · modular (algoritmo configurable)\n  · Servicios: autenticación, integridad, anti-replay, confidencialidad\n\nSSL/TLS (SSTP, OpenVPN):\n  · Capa aplicación · usa puerto 443\n  · Atraviesa firewalls y NAT sin problema\n  · No requiere cliente en Web VPN mode",
    tag: "VPN · Protocolos",
  },
];

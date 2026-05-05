---
tags: [capa-4, transporte, confiabilidad]
---

# TCP — Transmission Control Protocol

Protocolo de transporte **orientado a conexión** y **confiable**. Vive en capa 4 del [[Modelo TCP-IP]] y usa [[IP]] por debajo para mover datos.

## Características

- Orientado a conexión (requiere [[Three-Way Handshake]] antes de enviar datos)
- Confiable: cada segmento tiene número de secuencia y el receptor manda [[ACK]]
- Retransmite si no llega confirmación en tiempo (timeout)
- [[Control de flujo TCP]] con ventana deslizante
- Full-duplex: cada dirección se cierra independientemente ([[Cierre de conexión TCP]])

## Cabecera TCP

Campos clave:
- **Source/Destination Port** → identifica el servicio ([[Puertos]])
- **Sequence Number** → posición del primer byte en el stream
- **Acknowledgment Number** → próximo byte esperado
- **Window** → cuántos bytes puede recibir el receptor (control de flujo)
- **Flags**: SYN, ACK, FIN, RST, PSH, URG

## Flags

| Flag | Significado |
|---|---|
| SYN | Inicia conexión, sincroniza números de secuencia |
| ACK | Confirma recepción (Acknowledgment Number válido) |
| FIN | Solicita cierre de un sentido de la conexión |
| RST | Reset: aborta conexión o rechaza conexión a puerto inexistente |
| PSH | Flush inmediato: entregá los datos a la app sin esperar el buffer |
| URG | Datos urgentes: hay un puntero urgente válido en la cabecera |

## Cierre

Se necesitan **4 segmentos** porque TCP es full-duplex y cada dirección cierra por separado. Ver [[Cierre de conexión TCP]].

## Comparación

| | TCP | [[UDP]] |
|---|---|---|
| Conexión | Sí | No |
| Confiabilidad | Sí | No |
| Orden | Garantizado | No |
| Velocidad | Más lento | Más rápido |

## Relacionado
- [[Three-Way Handshake]] — cómo se establece la conexión
- [[Cierre de conexión TCP]] — cierre en 4 segmentos
- [[UDP]] — alternativa sin conexión
- [[Puertos]] — cómo identifica servicios
- [[Control de flujo TCP]] — ventana deslizante
- [[IP]] — protocolo de red que usa TCP por debajo

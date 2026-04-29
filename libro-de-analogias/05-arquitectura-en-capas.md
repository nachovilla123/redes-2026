# Capítulo 05 — Arquitectura en Capas y PDUs

> **Pregunta clave:** ¿Por qué las redes se organizan en capas? ¿Qué son los PDUs?

---

## La analogía: enviar un paquete con FedEx internacional

Cuando una empresa manda un paquete de Buenos Aires a Tokio usando FedEx, hay distintos niveles de responsabilidad que no se mezclan entre sí:

**Nivel 1 — Vos (el cliente / Aplicación):**
Decidís qué mandar. Ponés el contenido en una caja. No necesitás saber cómo vuela el avión.

**Nivel 2 — FedEx (el servicio / Transporte):**
Le ponés el número de seguimiento. Garantizan la entrega. Se encargan de que llegue completo. No saben ni les importa qué hay dentro.

**Nivel 3 — El avión y el camión (la red / Acceso):**
Mueven el paquete físicamente. No saben si es FedEx o DHL. No saben qué hay adentro.

---

Cada nivel solo habla con su nivel equivalente en el otro extremo:
- El contenido de la caja lo entiende solo el destinatario (no FedEx, no el piloto)
- El número de seguimiento lo entiende solo la oficina FedEx de Tokio (no el piloto, no el destinatario)
- El manifiesto de carga del avión lo entiende solo el aeropuerto de Tokio

**Eso es exactamente una arquitectura en capas.**

---

## El modelo simplificado de 3 capas

```
Computadora X                          Computadora Y
┌──────────────────┐                  ┌──────────────────┐
│   APLICACIÓN     │ ←── protocolo ──→│   APLICACIÓN     │
├──────────────────┤                  ├──────────────────┤
│   TRANSPORTE     │ ←── protocolo ──→│   TRANSPORTE     │
├──────────────────┤                  ├──────────────────┤
│ ACCESO A LA RED  │←─ física/cables─→│ ACCESO A LA RED  │
└──────────────────┘                  └──────────────────┘
```

- **Aplicación**: lo que el usuario ve (email, transferencia de archivos, web)
- **Transporte**: garantiza que los datos lleguen correctamente, en orden, sin pérdidas, independientemente de qué aplicación sea o qué red haya abajo
- **Acceso a la red**: mueve los datos por la red concreta (puede ser Ethernet, WiFi, fibra — a las capas de arriba no les importa)

La clave es que **cada capa es independiente**. Podés cambiar la tecnología de red (de WiFi a cable) sin tocar la capa de Transporte ni la de Aplicación.

---

## PDU — Protocol Data Unit: la caja con etiquetas apiladas

Cuando los datos viajan hacia abajo por las capas, **cada capa agrega su propia etiqueta** (encabezamiento / header) con la información que su par en el otro lado necesita para entender qué hacer.

**Analogía perfecta:** Es como empaquetar algo para mandarlo:

```
[Tu carta]                             ← los datos originales
 ↓ Aplicación agrega su info
[Sobre con "Para: Dpto Archivo"]       ← datos + info de aplicación
 ↓ Transporte agrega su info
[Caja FedEx con número de seguimiento] ← todo + info de transporte
 ↓ Red agrega su info
[Etiqueta de carga aérea con ruta]     ← todo + info de la red
```

En el destino, se van sacando capas de afuera hacia adentro:
1. El aeropuerto lee la etiqueta de carga y entrega a FedEx
2. FedEx lee el número de seguimiento y entrega al destinatario correcto
3. El destinatario abre el sobre y lee la carta

Cada capa solo lee su propia etiqueta y se la pasa a la capa de arriba con el resto intacto.

---

## ¿Por qué capas y no todo junto?

**Sin capas** (todo mezclado): si cambia la tecnología de red, tenés que reescribir toda la aplicación. Si aparece una red nueva (5G, fibra cuántica, lo que sea), todo el software existente deja de funcionar.

**Con capas** (modular): cada capa hace su trabajo y no sabe nada de las otras. Aparece el 5G → solo cambiás la capa física. Aparece una app nueva → solo agregás lógica en la capa de aplicación. El resto no se toca.

**Analogía:** Como un edificio. Podés cambiar los ascensores (infraestructura) sin tocar los departamentos (aplicaciones). Podés remodelar un departamento sin cambiar los ascensores.

---

## Direccionamiento en dos niveles

Hay dos tipos de direcciones que conviven:

- **Dirección de red** (como la dirección del edificio): identifica la computadora en la red. Ejemplo: dirección IP.
- **Dirección de aplicación / puerto** (como el número de departamento): identifica qué aplicación dentro de esa computadora debe recibir los datos. Ejemplo: puerto 80 (web), puerto 25 (email).

**Analogía:** La dirección `Av. Corrientes 1234, Dpto 5B` tiene dos partes: el edificio (`Av. Corrientes 1234`) y el departamento (`5B`). Sin ambas, la carta no llega.

---

*Capítulo anterior → [04 - Protocolos](04-protocolos.md)*
*Siguiente capítulo → [06 - Modelo OSI](06-modelo-osi.md)*

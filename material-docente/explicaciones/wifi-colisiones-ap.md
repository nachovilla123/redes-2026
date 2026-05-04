# WiFi: Access Point, colisiones y half-duplex

## ¿Qué es un Access Point?

Es el dispositivo que hace de puente entre el mundo WiFi y el mundo cableado. Recibe señales de radio de los dispositivos wireless y las convierte en tráfico Ethernet hacia el router/switch.

```
Laptop (WiFi)  ──radio──> [AP] ──cable──> Router ──> Internet
Celular (WiFi) ──radio──> [AP]
```

El AP administra el canal inalámbrico: decide quién puede transmitir, reparte IPs vía DHCP, y maneja la seguridad (WPA2, etc.).

---

## ¿Por qué WiFi tiene estos problemas? ¿Es la frecuencia?

La raíz está en la naturaleza del medio:

**Cable (Ethernet):** el medio es físico y privado. Lo que viaja por ese cable solo lo ven los dos extremos conectados.

**WiFi:** el medio es el aire. Las ondas de radio se expanden en todas direcciones como cuando tirás una piedra al agua. Cualquiera dentro del rango puede recibir tu señal — y vos no podés saber quién más está transmitiendo si no lo oís directamente.

La frecuencia (2.4 GHz, 5 GHz) afecta el alcance y la capacidad de penetrar paredes, pero el problema de fondo es que **el aire es un medio compartido y abierto**.

---

## ¿Por qué WiFi es half-duplex?

Una antena no puede transmitir y recibir en la misma frecuencia al mismo tiempo. Cuando transmitís, tu propia señal es millones de veces más fuerte que cualquier señal entrante — literalmente te ensordecés a vos mismo.

Para hacer full-duplex en WiFi necesitarías dos antenas en frecuencias distintas con aislamiento de señal. Existe (MIMO full-duplex) pero es experimental y caro. El 802.11 estándar es half-duplex.

---

## ¿Ethernet es mejor entonces?

Depende del contexto, pero para evitar colisiones: **sí, Ethernet moderno es mejor**.

La clave es el **switch**. Un switch le da a cada dispositivo su propio canal dedicado:

```
PC1 ──cable dedicado──> [Switch] <──cable dedicado── PC2
```

PC1 y PC2 nunca comparten el mismo cable → nunca colisionan. Además cada cable tiene pares separados para envío y recepción → **full-duplex**. CSMA/CD hoy prácticamente no se usa porque los switches eliminaron las colisiones.

Los **hubs** viejos sí tenían colisiones porque todos compartían el mismo medio, igual que WiFi.

---

## ¿Qué es una colisión?

Es un problema puramente físico: dos dispositivos transmiten señales en el mismo medio al mismo tiempo. Las señales se superponen y el resultado es ruido incomprensible.

**Lo que colisiona no son los destinos** (Instagram vs Facebook son cosas distintas que el router maneja sin problema). Lo que colisiona son las señales físicas en el canal compartido.

**Analogía:** dos personas hablando al mismo tiempo en la misma habitación. No importa de qué habla cada una — el que escucha no entiende ninguna de las dos.

---

## Más problemas en WiFi

| Problema | Qué es |
|---|---|
| **Nodo oculto** | A y C no se ven, colisionan en el AP. Solución: RTS/CTS |
| **Nodo expuesto** | B escucha a A transmitiendo y se queda callado innecesariamente, aunque podría transmitir a otro AP sin interferir |
| **Interferencia multipath** | La señal rebota en paredes y llega por múltiples caminos con distintos retardos |
| **Problema near/far** | Un dispositivo cercano al AP transmite tan fuerte que tapa la señal de uno lejano |
| **Interferencia entre canales** | Dos APs vecinos en el mismo canal se pisan entre sí |

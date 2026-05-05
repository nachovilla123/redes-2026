# Plan de notas — qué falta completar

## Estado actual

Las notas marcadas con ✅ tienen contenido completo y links bidireccionales.
Las marcadas con ⬜ son placeholders — aparecen linkeadas desde otras notas pero todavía no tienen contenido.

---

## ✅ Completas hoy

- [[Modelo TCP-IP]]
- [[TCP]]
- [[UDP]]
- [[Three-Way Handshake]]
- [[Cierre de conexión TCP]]
- [[Puertos]]
- [[CSMA-CD]]
- [[CSMA-CA]]
- [[RTS-CTS]]
- [[Nodo Oculto]]
- [[Nodo Expuesto]]
- [[NAV]]
- [[Colisión]]
- [[Half-Duplex vs Full-Duplex]]
- [[Access Point]]

---

## ⬜ Capa 3 — Red (próximas)

### Prioridad alta (entran en parcial)
- [ ] [[IP]] — cabecera, TTL, protocolo, fragmentación
- [ ] [[Fragmentación IP]] — MTU, campos ID/flags/offset, quién fragmenta y quién reensambla
- [ ] [[TTL]] — qué es, por qué existe, qué pasa cuando llega a 0
- [ ] [[ARP]] — cómo resuelve IP→MAC, ARP gratuito
- [ ] [[ICMP]] — destino inalcanzable, time exceeded, ping
- [ ] [[Subnetting]] — máscaras, subredes, hosts por subred
- [ ] [[VLSM]] — subnetting de tamaño variable
- [ ] [[CIDR]] — supernetting, route summarization

### Prioridad media
- [ ] [[Ruteo]] — tabla de ruteo, longest prefix match, static vs dynamic
- [ ] [[NAT]] — por qué existe, cómo traduce
- [ ] [[IPv6]] — formato, tipos de dirección, EUI-64, diferencias con IPv4

---

## ⬜ Capa 2 — Enlace (próximas)

- [ ] [[Ethernet]] — trama, campos, FCS/CRC
- [ ] [[Switch]] — tabla CAM, flooding, forwarding, dominio de colisión
- [ ] [[Hub]] — medio compartido, dominio de colisión
- [ ] [[VLAN]] — segmentación lógica, 802.1Q, trunk/access
- [ ] [[STP]] — por qué existe, root bridge, estados de puerto, BPDU
- [ ] [[WiFi 802.11]] — bandas, normas, modos DCF/PCF, trama 802.11

---

## ⬜ Capa 7 — Aplicación (próximas)

- [ ] [[DNS]] — resolución iterativa vs recursiva, tipos de registro
- [ ] [[DHCP]] — DORA, renovación de lease (T1/T2), DHCP relay
- [ ] [[HTTP]] — métodos, códigos de estado
- [ ] [[TLS]] — handshake, por qué HTTPS usa el puerto 443

---

## ⬜ Otros

- [ ] [[Control de flujo TCP]] — ventana deslizante, slow start, Jacobson/Karel
- [ ] [[Modelo OSI]] — 7 capas, comparación con TCP/IP
- [ ] [[Ruteo dinámico]] — RIP, OSPF, EIGRP, BGP

---

## Cómo agregar una nota nueva

1. Escribila en este vault con el mismo nombre que el `[[link]]` que ya existe
2. Agregá frontmatter con `tags`
3. Terminá con una sección `## Relacionado` con links a conceptos vinculados
4. Marcá como ✅ en este archivo

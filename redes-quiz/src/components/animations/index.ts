"use client";

import type { ComponentType } from "react";
import { CamTableAnimation } from "./CamTable";
import { ThreeWayHandshake } from "./ThreeWayHandshake";
import { CastTypes } from "./CastTypes";
import { Encapsulation } from "./Encapsulation";
import { NatTranslation } from "./NatTranslation";
import { DhcpDora } from "./DhcpDora";
import { DnsResolution } from "./DnsResolution";
import { IpFragmentation } from "./IpFragmentation";
import { ArqComparison } from "./ArqComparison";
import { HiddenNode } from "./HiddenNode";
import { HubVsSwitch } from "./HubVsSwitch";
import { TcpVsUdp } from "./TcpVsUdp";
import { SpanningTree } from "./SpanningTree";
import { NodalDelays } from "./NodalDelays";
import { Crc } from "./Crc";
import { CsmaCa } from "./CsmaCa";
import { HalfFullDuplex } from "./HalfFullDuplex";
import { EthernetFrame } from "./EthernetFrame";
import { Dot1Q } from "./Dot1Q";
import { RoutingTable } from "./RoutingTable";
import { Vlsm } from "./Vlsm";
import { DhcpRelay } from "./DhcpRelay";
import { HttpRequest } from "./HttpRequest";
import { TlsHandshake } from "./TlsHandshake";
import { SwitchModes } from "./SwitchModes";
import { MacStructure } from "./MacStructure";
import { Ports } from "./Ports";
import { StormControl } from "./StormControl";
import { PortSecurity } from "./PortSecurity";

export const animations: Record<string, ComponentType> = {
  "cam-table": CamTableAnimation,
  "tcp-handshake": ThreeWayHandshake,
  "cast-types": CastTypes,
  encapsulation: Encapsulation,
  "nat-translation": NatTranslation,
  "dhcp-dora": DhcpDora,
  "dns-resolution": DnsResolution,
  "ip-fragmentation": IpFragmentation,
  "arq-comparison": ArqComparison,
  "hidden-node": HiddenNode,
  "hub-vs-switch": HubVsSwitch,
  "tcp-vs-udp": TcpVsUdp,
  "spanning-tree": SpanningTree,
  "nodal-delays": NodalDelays,
  crc: Crc,
  "csma-ca": CsmaCa,
  "half-full-duplex": HalfFullDuplex,
  "ethernet-frame": EthernetFrame,
  "dot1q": Dot1Q,
  "routing-table": RoutingTable,
  vlsm: Vlsm,
  "dhcp-relay": DhcpRelay,
  "http-request": HttpRequest,
  "tls-handshake": TlsHandshake,
  "switch-modes": SwitchModes,
  "mac-structure": MacStructure,
  ports: Ports,
  "storm-control": StormControl,
  "port-security": PortSecurity,
};

export function getAnimation(id: string): ComponentType | null {
  return animations[id] ?? null;
}

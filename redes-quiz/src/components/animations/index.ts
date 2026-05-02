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
};

export function getAnimation(id: string): ComponentType | null {
  return animations[id] ?? null;
}

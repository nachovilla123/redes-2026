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
};

export function getAnimation(id: string): ComponentType | null {
  return animations[id] ?? null;
}

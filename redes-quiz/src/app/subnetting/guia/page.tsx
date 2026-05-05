"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── IP utilities ──────────────────────────────────────────────────────────────

function ipToNum(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".");
}

function maskFromPrefix(p: number): number {
  return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
}

function isValidIp(ip: string): boolean {
  const parts = ip.split(".");
  return (
    parts.length === 4 &&
    parts.every((p) => {
      const n = parseInt(p, 10);
      return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p;
    })
  );
}

// ── Bit grid ──────────────────────────────────────────────────────────────────

type BitRole = "net" | "sub" | "host";

function buildRoles(prefix: number, subBits: number): BitRole[][] {
  return [0, 1, 2, 3].map((octet) =>
    Array.from({ length: 8 }, (_, bit) => {
      const pos = octet * 8 + bit;
      if (pos < prefix) return "net";
      if (pos < prefix + subBits) return "sub";
      return "host";
    })
  );
}

const ROLE_BG: Record<BitRole, string> = {
  net: "bg-blue-600 text-white",
  sub: "bg-purple-500 text-white",
  host: "bg-amber-500 text-white",
};
const ROLE_TEXT: Record<BitRole, string> = {
  net: "text-blue-400",
  sub: "text-purple-400",
  host: "text-amber-400",
};

function BitRow({
  value,
  roles,
  dim = false,
}: {
  value: number;
  roles: BitRole[];
  dim?: boolean;
}) {
  const binary = (value >>> 0).toString(2).padStart(8, "0");
  return (
    <div className="flex gap-[3px]">
      {binary.split("").map((bit, i) => (
        <div
          key={i}
          className={`w-[22px] h-[22px] flex items-center justify-center rounded text-[11px] font-bold font-mono transition-colors ${
            dim ? "bg-slate-700 text-slate-500" : ROLE_BG[roles[i]]
          }`}
        >
          {bit}
        </div>
      ))}
    </div>
  );
}

function IpBitDisplay({
  parts,
  prefix,
  subBits,
  showLabels = true,
}: {
  parts: number[];
  prefix: number;
  subBits: number;
  showLabels?: boolean;
}) {
  const roles = buildRoles(prefix, subBits);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max space-y-1.5">
        {parts.map((octet, i) => (
          <div key={i} className="flex items-center gap-3">
            <BitRow value={octet} roles={roles[i]} />
            <span className="font-mono text-sm text-slate-300 w-6 text-right shrink-0">
              {octet}
            </span>
            {showLabels && (
              <span className={`text-[10px] font-semibold uppercase tracking-wide shrink-0 ${
                roles[i].every((r) => r === "net")
                  ? "text-blue-400"
                  : roles[i].some((r) => r === "sub") && roles[i].some((r) => r === "host")
                  ? ROLE_TEXT.sub
                  : roles[i].some((r) => r === "sub")
                  ? ROLE_TEXT.sub
                  : ROLE_TEXT.host
              }`}>
                {roles[i].every((r) => r === "net")
                  ? "red"
                  : roles[i].some((r) => r === "sub") && roles[i].some((r) => r === "host")
                  ? "sub + host"
                  : roles[i].some((r) => r === "sub")
                  ? "subred"
                  : "host"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Calculation ───────────────────────────────────────────────────────────────

interface SubnetInfo {
  index: number;
  networkNum: number;
  broadcastNum: number;
  networkAddr: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  usableHosts: number;
  subnetPattern: string;
}

interface CalcResult {
  bitsToSteal: number;
  newPrefix: number;
  blockSize: number;
  actualSubnets: number;
  hostBits: number;
  subnets: SubnetInfo[];
}

function calcSubnets(baseIp: string, prefix: number, numSubnets: number): CalcResult | null {
  if (!isValidIp(baseIp) || prefix < 1 || prefix > 30 || numSubnets < 2) return null;
  const bitsToSteal = Math.ceil(Math.log2(numSubnets));
  const newPrefix = prefix + bitsToSteal;
  if (newPrefix > 30) return null;
  const blockSize = Math.pow(2, 32 - newPrefix);
  const hostBits = 32 - newPrefix;
  const baseNum = ipToNum(baseIp) & maskFromPrefix(prefix);
  const actualSubnets = Math.pow(2, bitsToSteal);
  const subnets: SubnetInfo[] = Array.from({ length: actualSubnets }, (_, i) => {
    const networkNum = (baseNum + i * blockSize) >>> 0;
    const broadcastNum = (networkNum + blockSize - 1) >>> 0;
    return {
      index: i,
      networkNum,
      broadcastNum,
      networkAddr: numToIp(networkNum),
      firstHost: numToIp((networkNum + 1) >>> 0),
      lastHost: numToIp((broadcastNum - 1) >>> 0),
      broadcast: numToIp(broadcastNum),
      usableHosts: blockSize - 2,
      subnetPattern: i.toString(2).padStart(bitsToSteal, "0"),
    };
  });
  return { bitsToSteal, newPrefix, blockSize, actualSubnets, hostBits, subnets };
}

// ── Legend chip ───────────────────────────────────────────────────────────────

function Legend({ role, label }: { role: BitRole; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className={`w-3 h-3 rounded ${ROLE_BG[role].split(" ")[0]} shrink-0`} />
      <span className={ROLE_TEXT[role]}>{label}</span>
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GuiaSubnettingPage() {
  const [ip, setIp] = useState("192.168.1.0");
  const [prefix, setPrefix] = useState(24);
  const [numSubnets, setNumSubnets] = useState(4);
  const [openSubnet, setOpenSubnet] = useState<number | null>(0);

  const result = useMemo(
    () => calcSubnets(ip, prefix, numSubnets),
    [ip, prefix, numSubnets]
  );

  const ipParts = ip.split(".").map(Number);
  const ipValid = isValidIp(ip);

  // Demo fijo: 192.168.1.0/24 → 4 subredes
  const demoRoles24 = buildRoles(24, 0);
  const demoRoles26 = buildRoles(24, 2);
  const demo = calcSubnets("192.168.1.0", 24, 4)!;

  return (
    <div className="min-h-dvh bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800/60 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/subnetting"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Ejercicios
          </Link>
          <h1 className="text-white font-semibold text-sm">Guía Visual · Subnetting</h1>
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-12">

        {/* ── 1. Anatomía de una IP ──────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 1</p>
            <h2 className="text-white font-bold text-xl">Anatomía de una dirección IP</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Una dirección IP son 32 bits, agrupados en 4 octetos. La máscara{" "}
              <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded text-xs">/24</code>{" "}
              le dice al router: los primeros 24 bits son la{" "}
              <span className="text-blue-400 font-semibold">red</span>, los 8 restantes son para
              los <span className="text-amber-400 font-semibold">hosts</span>.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <p className="font-mono text-2xl font-bold text-white tracking-wider">
              192.168.1.0<span className="text-slate-500">/24</span>
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Legend role="net" label="Bits de red (24 bits)" />
              <Legend role="host" label="Bits de host (8 bits)" />
            </div>

            <IpBitDisplay parts={[192, 168, 1, 0]} prefix={24} subBits={0} />

            {/* Anotaciones */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl px-4 py-3">
                <p className="text-blue-400 font-bold text-sm">Red = fija</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Los primeros 24 bits no cambian en toda la red. Identifican la red a la que pertenece el host.
                </p>
              </div>
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3">
                <p className="text-amber-400 font-bold text-sm">Host = variable</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  8 bits disponibles → 2⁸ = 256 combinaciones → 254 hosts útiles (se restan red y broadcast).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. La máscara ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 2</p>
            <h2 className="text-white font-bold text-xl">¿Qué hace la máscara?</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              La máscara tiene 1s donde están los bits de red y 0s donde están los de host. El router hace
              un AND bit a bit entre la IP y la máscara para obtener la dirección de red.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-4 overflow-x-auto">
            <div className="min-w-max space-y-2 font-mono text-sm">
              {/* IP */}
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-28 text-right text-xs">IP</span>
                <IpBitDisplay parts={[192, 168, 1, 42]} prefix={24} subBits={0} showLabels={false} />
                <span className="text-slate-400 text-xs">192.168.1.42</span>
              </div>
              {/* Mask */}
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-28 text-right text-xs">Máscara /24</span>
                <div className="overflow-x-auto">
                  <div className="min-w-max space-y-1.5">
                    {[255, 255, 255, 0].map((octet, i) => (
                      <div key={i} className="flex gap-[3px]">
                        {(octet >>> 0).toString(2).padStart(8, "0").split("").map((bit, j) => {
                          const pos = i * 8 + j;
                          return (
                            <div
                              key={j}
                              className={`w-[22px] h-[22px] flex items-center justify-center rounded text-[11px] font-bold font-mono ${
                                pos < 24
                                  ? "bg-blue-900/60 text-blue-400 border border-blue-700/40"
                                  : "bg-slate-800 text-slate-600"
                              }`}
                            >
                              {bit}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-slate-400 text-xs">255.255.255.0</span>
              </div>
              {/* Divider */}
              <div className="border-t border-slate-700 mx-0 ml-28" />
              {/* Result */}
              <div className="flex items-center gap-3">
                <span className="text-slate-500 w-28 text-right text-xs">AND = red</span>
                <IpBitDisplay parts={[192, 168, 1, 0]} prefix={24} subBits={0} showLabels={false} />
                <span className="text-blue-300 text-xs font-semibold">192.168.1.0</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-800 pt-3">
              El bit del host (.42 → 00101010) queda en 0 en el resultado. Eso es la{" "}
              <span className="text-blue-400">dirección de red base</span> del bloque.
            </p>
          </div>
        </section>

        {/* ── 3. Crear subredes ─────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 3</p>
            <h2 className="text-white font-bold text-xl">Crear 4 subredes</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Para dividir en 4 subredes necesitás <span className="text-purple-400 font-semibold">2 bits prestados</span> del
              área de host (porque 2² = 4). Esos bits pasan a ser bits de subred. La máscara crece de /24 a /26.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-5">
            {/* Fórmula */}
            <div className="bg-slate-800/60 rounded-xl px-4 py-3 flex flex-wrap gap-4 items-center text-sm">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Quiero</p>
                <p className="text-white font-bold text-lg">4 subredes</p>
              </div>
              <span className="text-slate-600">→</span>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Necesito</p>
                <p className="text-purple-400 font-bold text-lg">2 bits</p>
                <p className="text-slate-600 text-[10px]">2² = 4</p>
              </div>
              <span className="text-slate-600">→</span>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Nueva máscara</p>
                <p className="text-white font-bold text-lg">/26</p>
                <p className="text-slate-600 text-[10px]">24 + 2</p>
              </div>
              <span className="text-slate-600">→</span>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Bloque</p>
                <p className="text-amber-400 font-bold text-lg">64 IPs</p>
                <p className="text-slate-600 text-[10px]">2⁶ = 64</p>
              </div>
            </div>

            {/* Bits ANTES y DESPUÉS */}
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Antes (/24) — 8 bits de host</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2">
                <Legend role="net" label="Red" />
                <Legend role="host" label="Host" />
              </div>
              <IpBitDisplay parts={[192, 168, 1, 0]} prefix={24} subBits={0} />
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Después (/26) — 2 bits sub + 6 bits host</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2">
                <Legend role="net" label="Red" />
                <Legend role="sub" label="Subred (prestados)" />
                <Legend role="host" label="Host" />
              </div>
              <IpBitDisplay parts={[192, 168, 1, 0]} prefix={24} subBits={2} />
            </div>

            {/* Las 4 combinaciones */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <p className="text-xs text-slate-400 font-semibold">
                Los 2 bits prestados generan 4 combinaciones — cada una es una subred:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demo.subnets.map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    {/* Bits */}
                    <div className="flex gap-0.5 shrink-0">
                      {s.subnetPattern.split("").map((b, j) => (
                        <span
                          key={j}
                          className="w-5 h-5 flex items-center justify-center bg-purple-600 rounded text-[10px] font-bold font-mono text-white"
                        >
                          {b}
                        </span>
                      ))}
                      <div className="flex gap-0.5 ml-0.5">
                        {Array.from({ length: 6 }, (_, j) => (
                          <span
                            key={j}
                            className="w-5 h-5 flex items-center justify-center bg-amber-500/70 rounded text-[10px] font-bold font-mono text-white"
                          >
                            0
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-white font-bold">{s.networkAddr}/26</p>
                      <p className="text-[10px] text-slate-500">
                        .{i * 64} → .{i * 64 + 63}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cada subred arranca en un múltiplo de 64 (el tamaño del bloque): 0, 64, 128, 192.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. La tabla completa ──────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 4</p>
            <h2 className="text-white font-bold text-xl">La tabla completa</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Para cada subred, hay 4 datos clave. Tocá cada una para ver el desglose.
            </p>
          </div>

          {/* Leyenda de colores de la tabla */}
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/50 border border-blue-800/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-blue-400">Dirección de red</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/50 border border-emerald-800/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-400">Rango de hosts</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/50 border border-red-800/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400">Broadcast</span>
            </span>
          </div>

          <div className="space-y-2">
            {demo.subnets.map((s, i) => {
              const open = openSubnet === i;
              const colors = [
                "border-blue-800/40 bg-blue-950/20",
                "border-purple-800/40 bg-purple-950/20",
                "border-amber-800/40 bg-amber-950/20",
                "border-emerald-800/40 bg-emerald-950/20",
              ];
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all ${
                    open ? colors[i] : "border-slate-700/60 bg-slate-900"
                  }`}
                >
                  <button
                    className="w-full text-left px-5 py-4 flex items-center gap-4"
                    onClick={() => setOpenSubnet(open ? null : i)}
                  >
                    <div className="flex gap-0.5 shrink-0">
                      {s.subnetPattern.split("").map((b, j) => (
                        <span
                          key={j}
                          className="w-5 h-5 flex items-center justify-center bg-purple-600 rounded text-[10px] font-bold font-mono text-white"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white font-semibold">
                        Subred {i} — {s.networkAddr}/26
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        hosts: .{i * 64 + 1} → .{i * 64 + 62} · broadcast: .{i * 64 + 63}
                      </p>
                    </div>
                    <span
                      className={`text-slate-500 text-xs transition-transform ${open ? "rotate-90" : ""}`}
                    >
                      ▶
                    </span>
                  </button>

                  {open && (
                    <div className="px-5 pb-5 border-t border-slate-700/40">
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {/* Dir. de red */}
                        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl px-4 py-3">
                          <p className="text-[10px] text-blue-500 uppercase tracking-wider font-semibold">
                            Dirección de red
                          </p>
                          <p className="font-mono text-base text-blue-300 font-bold mt-1">
                            {s.networkAddr}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                            Todos los bits de host = 0. No asignable a ningún host.
                          </p>
                        </div>

                        {/* Broadcast */}
                        <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
                          <p className="text-[10px] text-red-500 uppercase tracking-wider font-semibold">
                            Broadcast
                          </p>
                          <p className="font-mono text-base text-red-300 font-bold mt-1">
                            {s.broadcast}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                            Todos los bits de host = 1. Llega a todos los hosts de la subred.
                          </p>
                        </div>

                        {/* Primer host */}
                        <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-4 py-3">
                          <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">
                            Primer host
                          </p>
                          <p className="font-mono text-base text-emerald-300 font-bold mt-1">
                            {s.firstHost}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">= dir. red + 1</p>
                        </div>

                        {/* Último host */}
                        <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl px-4 py-3">
                          <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">
                            Último host
                          </p>
                          <p className="font-mono text-base text-emerald-300 font-bold mt-1">
                            {s.lastHost}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">= broadcast − 1</p>
                        </div>

                        {/* Bloque completo */}
                        <div className="col-span-2 bg-slate-800/60 rounded-xl px-4 py-3">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                            Rango completo del bloque
                          </p>
                          {/* Visual ruler */}
                          <div className="relative h-8 bg-slate-700 rounded-lg overflow-hidden">
                            <div
                              className="absolute left-0 top-0 bottom-0 w-[1px] bg-blue-500"
                              style={{ left: "0%" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-mono text-white font-semibold">
                                {s.networkAddr} → {s.broadcast}
                              </span>
                            </div>
                            <div className="absolute inset-y-0 left-[1.5%] right-[1.5%] bg-emerald-600/40 rounded" />
                            <div className="absolute top-0 bottom-0 left-0 w-[1.5%] bg-blue-600/70" />
                            <div className="absolute top-0 bottom-0 right-0 w-[1.5%] bg-red-600/70" />
                          </div>
                          <div className="flex justify-between text-[10px] mt-1.5">
                            <span className="text-blue-400">red: {s.networkAddr}</span>
                            <span className="text-emerald-400">{s.usableHosts} hosts útiles</span>
                            <span className="text-red-400">bc: {s.broadcast}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Calculadora visual ─────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">
              Calculadora
            </p>
            <h2 className="text-white font-bold text-xl">Probá con tus propios datos</h2>
            <p className="text-slate-400 text-sm mt-2">
              Ingresá cualquier red y cantidad de subredes para ver cómo quedan.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-5">
            {/* Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">
                  IP base
                </label>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className={`w-full bg-slate-800 border rounded-xl px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-slate-500 transition-colors ${
                    ipValid ? "border-slate-700" : "border-red-700/60"
                  }`}
                  placeholder="192.168.1.0"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">
                  Prefijo
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-mono">/</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={prefix}
                    onChange={(e) => setPrefix(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">
                  Subredes
                </label>
                <select
                  value={numSubnets}
                  onChange={(e) => setNumSubnets(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-slate-500"
                >
                  {[2, 4, 8, 16, 32, 64].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {result && ipValid ? (
              <>
                {/* Resumen */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { val: result.bitsToSteal, label: "bits prestados", color: "text-purple-400" },
                    { val: `/${result.newPrefix}`, label: "nueva máscara", color: "text-white" },
                    { val: result.blockSize, label: "IPs por subred", color: "text-amber-400" },
                    { val: result.blockSize - 2, label: "hosts útiles", color: "text-emerald-400" },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-800/60 rounded-xl py-3 px-1">
                      <p className={`font-bold text-lg font-mono ${item.color}`}>{item.val}</p>
                      <p className="text-slate-500 text-[9px] uppercase tracking-wide mt-0.5 leading-tight">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Visualización de bits */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Distribución de bits
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mb-2">
                    <Legend role="net" label={`Red (${prefix})`} />
                    <Legend role="sub" label={`Subred (${result.bitsToSteal})`} />
                    <Legend role="host" label={`Host (${result.hostBits})`} />
                  </div>
                  {ipValid && (
                    <IpBitDisplay
                      parts={ipParts}
                      prefix={prefix}
                      subBits={result.bitsToSteal}
                      showLabels={false}
                    />
                  )}
                </div>

                {/* Tabla de subredes */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Las {result.actualSubnets} subredes
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono min-w-[500px]">
                      <thead>
                        <tr className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-800">
                          <th className="text-left pb-2 pr-3">#</th>
                          <th className="text-left pb-2 pr-3">Dirección de red</th>
                          <th className="text-left pb-2 pr-3">Primer host</th>
                          <th className="text-left pb-2 pr-3">Último host</th>
                          <th className="text-left pb-2">Broadcast</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {result.subnets.map((s) => (
                          <tr key={s.index} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2 pr-3">
                              <span className="text-slate-500">{s.index}</span>
                            </td>
                            <td className="py-2 pr-3 text-blue-300 font-semibold">{s.networkAddr}</td>
                            <td className="py-2 pr-3 text-emerald-300">{s.firstHost}</td>
                            <td className="py-2 pr-3 text-emerald-300">{s.lastHost}</td>
                            <td className="py-2 text-red-300">{s.broadcast}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                {!ipValid
                  ? "Ingresá una IP válida (ej: 192.168.1.0)"
                  : "Los parámetros no son válidos — probá con un prefijo menor o menos subredes"}
              </div>
            )}
          </div>
        </section>

        {/* ── Reglas de oro ──────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-white font-bold text-xl">Las 4 reglas de oro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: "1",
                title: "Dirección de red",
                body: "Primer IP del bloque. Bits de host todos en 0. No asignable.",
                color: "border-blue-800/40 bg-blue-950/30",
                num: "text-blue-400",
              },
              {
                icon: "2",
                title: "Broadcast",
                body: "Último IP del bloque. Bits de host todos en 1. Llega a toda la subred.",
                color: "border-red-800/40 bg-red-950/30",
                num: "text-red-400",
              },
              {
                icon: "3",
                title: "Hosts útiles",
                body: "Entre red y broadcast. Fórmula: 2^(bits host) − 2.",
                color: "border-emerald-800/40 bg-emerald-950/30",
                num: "text-emerald-400",
              },
              {
                icon: "4",
                title: "Tamaño de bloque",
                body: "IPs totales por subred = 2^(bits host). Las subredes arrancan en múltiplos de este número.",
                color: "border-purple-800/40 bg-purple-950/30",
                num: "text-purple-400",
              },
            ].map((rule) => (
              <div key={rule.icon} className={`rounded-2xl border px-5 py-4 ${rule.color}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-3xl font-black leading-none ${rule.num}`}>
                    {rule.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-white">{rule.title}</p>
                    <p className="text-sm mt-1 text-slate-400 leading-relaxed">{rule.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="pb-8">
          <Link
            href="/subnetting"
            className="block w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-sm text-center transition-all"
          >
            Practicar con ejercicios →
          </Link>
        </div>
      </main>
    </div>
  );
}

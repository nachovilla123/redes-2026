"use client";

import { useState } from "react";
import Link from "next/link";

// ── helpers ───────────────────────────────────────────────────────────────────

function hostBitsFor(n: number): number {
  return Math.ceil(Math.log2(n + 2));
}

// ── static data ───────────────────────────────────────────────────────────────

const BASE = "192.168.10";
const BASE_TOTAL = 256; // /24

type Colors = { bar: string; bg: string; border: string; text: string };

const COLORS: Record<string, Colors> = {
  iot: { bar: "bg-emerald-500", bg: "bg-emerald-950/50", border: "border-emerald-700/50", text: "text-emerald-400" },
  cam: { bar: "bg-sky-500",     bg: "bg-sky-950/50",     border: "border-sky-700/50",     text: "text-sky-400"     },
  adm: { bar: "bg-violet-500",  bg: "bg-violet-950/50",  border: "border-violet-700/50",  text: "text-violet-400"  },
};

type Group = Colors & {
  id: string;
  name: string;
  count: number;
  hostsNeeded: number;
  hostBits: number;
  prefix: number;
  blockSize: number;
  usable: number;
};

const GROUPS: Group[] = [
  { id: "iot", name: "Sensores IoT",         count: 8, hostsNeeded: 10  },
  { id: "cam", name: "Cámaras de Seguridad", count: 2, hostsNeeded: 30  },
  { id: "adm", name: "Administración",       count: 1, hostsNeeded: 100 },
].map((r) => {
  const hostBits = hostBitsFor(r.hostsNeeded);
  const prefix = 32 - hostBits;
  const blockSize = 1 << hostBits;
  return { ...r, ...COLORS[r.id], hostBits, prefix, blockSize, usable: blockSize - 2 };
});

// bottom-up: ascending by hostsNeeded
const BOTTOM_UP = [...GROUPS].sort((a, b) => a.hostsNeeded - b.hostsNeeded);

type Subnet = { group: Group; idx: number; start: number; end: number };

const SUBNETS: Subnet[] = (() => {
  const result: Subnet[] = [];
  let offset = 0;
  for (const g of BOTTOM_UP) {
    for (let i = 0; i < g.count; i++) {
      result.push({ group: g, idx: i, start: offset, end: offset + g.blockSize - 1 });
      offset += g.blockSize;
    }
  }
  return result;
})();

const TOTAL_NEEDED = SUBNETS[SUBNETS.length - 1].end + 1;
const HAS_OVERFLOW = TOTAL_NEEDED > BASE_TOTAL;

function addr(offset: number): string {
  return `${BASE}.${offset}`;
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function VLSMPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="min-h-dvh bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800/60 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/subnetting/guia" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Guía
          </Link>
          <h1 className="text-white font-semibold text-sm">VLSM · Bottom-Up</h1>
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            Inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-12">

        {/* ── ¿qué es VLSM? ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Concepto</p>
            <h2 className="text-white font-bold text-xl">¿Qué es VLSM?</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Con subnetting clásico todas las subredes tienen el mismo tamaño aunque no lo necesiten —
              un desperdicio enorme. VLSM (Variable Length Subnet Mask) permite asignar máscaras
              distintas: las redes grandes reciben bloques grandes y las pequeñas reciben bloques
              pequeños. Resultado: mucho menos desperdicio de IPs.
            </p>
          </div>

          {/* comparación visual */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4">
              <p className="text-slate-400 font-semibold text-sm mb-2">Subnetting clásico</p>
              <div className="flex h-8 rounded-lg overflow-hidden">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 border-r border-black/30 last:border-0 flex items-center justify-center ${
                      i === 0 ? "bg-violet-600" : "bg-slate-700"
                    }`}
                  >
                    <span className="text-[9px] text-white font-bold">/26</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-[10px] mt-2 leading-snug">
                4 subredes iguales aunque solo necesites una grande
              </p>
            </div>

            <div className="bg-slate-900 border border-indigo-800/40 rounded-2xl p-4">
              <p className="text-indigo-400 font-semibold text-sm mb-2">VLSM</p>
              <div className="flex h-8 rounded-lg overflow-hidden">
                <div className="flex-[2] bg-violet-500 flex items-center justify-center border-r border-black/30">
                  <span className="text-[9px] text-white font-bold">/25</span>
                </div>
                <div className="flex-[1] bg-sky-500 flex items-center justify-center border-r border-black/30">
                  <span className="text-[9px] text-white font-bold">/26</span>
                </div>
                <div className="flex-[0.5] bg-emerald-500 flex items-center justify-center border-r border-black/30">
                  <span className="text-[8px] text-white font-bold">/27</span>
                </div>
                <div className="flex-[0.5] bg-emerald-500 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">/27</span>
                </div>
              </div>
              <p className="text-slate-500 text-[10px] mt-2 leading-snug">
                Cada subred recibe exactamente lo que necesita
              </p>
            </div>
          </div>
        </section>

        {/* ── requerimientos ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Ejercicio</p>
            <h2 className="text-white font-bold text-xl">Los requerimientos</h2>
            <p className="text-slate-400 text-sm mt-2">
              Red base:{" "}
              <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
                192.168.10.0/24
              </code>
            </p>
          </div>

          <div className="space-y-2">
            {GROUPS.map((g) => (
              <div key={g.id} className={`rounded-2xl border ${g.bg} ${g.border} px-5 py-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${g.bar} shrink-0`} />
                    <div>
                      <p className={`font-semibold text-sm ${g.text}`}>{g.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {g.count} {g.count === 1 ? "subred" : "subredes"} × {g.hostsNeeded} hosts
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-white font-bold text-base">/{g.prefix}</p>
                    <p className="text-slate-500 text-[10px]">{g.usable} hosts útiles</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── paso 1: calcular máscara ───────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 1</p>
            <h2 className="text-white font-bold text-xl">Calcular la máscara de cada grupo</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Para cada grupo: ¿cuántos bits de host necesito para alojar N hosts?{" "}
              <code className="text-white bg-slate-800 px-1.5 rounded text-xs">2^n − 2 ≥ hosts</code>
            </p>
          </div>

          <div className="space-y-3">
            {GROUPS.map((g) => (
              <div key={g.id} className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${g.bar}`} />
                  <p className={`text-sm font-semibold ${g.text}`}>{g.name}</p>
                </div>
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <div className="bg-slate-800/60 rounded-xl px-3 py-2 text-center shrink-0">
                    <p className="text-slate-500 text-[9px] uppercase tracking-wider">Necesita</p>
                    <p className="text-white font-bold">{g.hostsNeeded} hosts</p>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="bg-slate-800/60 rounded-xl px-3 py-2 text-center shrink-0">
                    <p className="text-slate-500 text-[9px] uppercase tracking-wider">Bits de host</p>
                    <p className={`font-bold ${g.text}`}>{g.hostBits} bits</p>
                    <p className="text-slate-600 text-[9px]">2^{g.hostBits}−2 = {g.usable}</p>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="bg-slate-800/60 rounded-xl px-3 py-2 text-center shrink-0">
                    <p className="text-slate-500 text-[9px] uppercase tracking-wider">Máscara</p>
                    <p className="text-white font-bold font-mono">/{g.prefix}</p>
                    <p className="text-slate-600 text-[9px]">32 − {g.hostBits}</p>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="bg-slate-800/60 rounded-xl px-3 py-2 text-center shrink-0">
                    <p className="text-slate-500 text-[9px] uppercase tracking-wider">Bloque</p>
                    <p className={`font-bold font-mono ${g.text}`}>{g.blockSize} IPs</p>
                    <p className="text-slate-600 text-[9px]">2^{g.hostBits}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── paso 2: ordenar bottom-up ──────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 2</p>
            <h2 className="text-white font-bold text-xl">Ordenar — Bottom-Up (ascendente)</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              El método <span className="text-white font-semibold">bottom-up</span> ordena de menor a mayor requerimiento
              y asigna en ese orden desde el inicio del espacio de direcciones.
              Esto facilita encontrar subredes alineadas correctamente cuando los bloques son pequeños.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Orden de asignación</p>
            {BOTTOM_UP.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                  {i + 1}
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${g.bar} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{g.name}</p>
                  <p className="text-slate-500 text-xs">
                    {g.count} × /{g.prefix} — {g.blockSize} IPs c/u
                  </p>
                </div>
                <div className={`text-xs font-mono font-bold shrink-0 ${g.text}`}>
                  {g.count * g.blockSize} IPs
                </div>
              </div>
            ))}
            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500">Total necesario</span>
              <span className={`font-bold font-mono ${HAS_OVERFLOW ? "text-amber-400" : "text-white"}`}>
                {TOTAL_NEEDED} IPs{HAS_OVERFLOW ? ` (+${TOTAL_NEEDED - BASE_TOTAL} sobre el /24)` : ""}
              </span>
            </div>
          </div>
        </section>

        {/* ── paso 3: mapa visual ────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 3</p>
            <h2 className="text-white font-bold text-xl">Mapa del espacio de direcciones</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Cada bloque es proporcional al espacio que ocupa dentro del espacio total de{" "}
              {TOTAL_NEEDED} IPs. Tocá cualquier subred para ver sus datos.
            </p>
          </div>

          {/* leyenda */}
          <div className="flex flex-wrap gap-3">
            {GROUPS.map((g) => (
              <span key={g.id} className="flex items-center gap-1.5 text-xs">
                <span className={`w-3 h-3 rounded ${g.bar}`} />
                <span className={g.text}>{g.name}</span>
              </span>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4 space-y-4">
            {HAS_OVERFLOW && (
              <p className="text-xs text-amber-400 bg-amber-950/30 border border-amber-700/40 rounded-xl px-3 py-2 leading-relaxed">
                ⚠ El total necesario ({TOTAL_NEEDED} IPs) supera la red /24 (256 IPs). La línea blanca
                marca el límite de la red — las subredes a la derecha están en overflow.
              </p>
            )}

            {/* barra proporcional */}
            <div className="relative">
              {/* header labels */}
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-1">
                <span>.0</span>
                {HAS_OVERFLOW && (
                  <span
                    className="text-white absolute font-semibold"
                    style={{ left: `${(BASE_TOTAL / TOTAL_NEEDED) * 100}%`, transform: "translateX(-50%)" }}
                  >
                    .255
                  </span>
                )}
                <span>.{TOTAL_NEEDED - 1}</span>
              </div>

              {/* la barra */}
              <div className="flex h-14 rounded-xl overflow-hidden">
                {SUBNETS.map((s, i) => {
                  const overflow = s.end >= BASE_TOTAL;
                  const isActive = active === i;
                  return (
                    <button
                      key={i}
                      style={{ flex: s.group.blockSize }}
                      onClick={() => setActive(isActive ? null : i)}
                      className={`relative border-r border-black/20 last:border-0 flex items-center justify-center text-[9px] font-bold text-white transition-all
                        ${overflow
                          ? "bg-slate-700 opacity-40"
                          : isActive
                          ? `${s.group.bar} ring-2 ring-white ring-inset brightness-110`
                          : `${s.group.bar} hover:brightness-110`
                        }`}
                    >
                      {!overflow && s.group.blockSize >= 32 && (
                        <span>/{s.group.prefix}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* línea de límite /24 */}
              {HAS_OVERFLOW && (
                <div
                  className="absolute top-[18px] bottom-0 w-[2px] bg-white pointer-events-none"
                  style={{ left: `${(BASE_TOTAL / TOTAL_NEEDED) * 100}%` }}
                />
              )}

              {/* ruler */}
              <div className="flex justify-between mt-1 text-[9px] text-slate-600 font-mono">
                <span>{addr(0)}</span>
                <span>{addr(TOTAL_NEEDED - 1)}</span>
              </div>
            </div>

            {/* detalle de la subred activa */}
            {active !== null && (() => {
              const s = SUBNETS[active];
              const overflow = s.end >= BASE_TOTAL;
              return (
                <div className={`rounded-xl border p-4 ${s.group.bg} ${s.group.border}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${s.group.bar}`} />
                    <p className={`font-semibold text-sm ${s.group.text}`}>
                      {s.group.name} #{s.idx + 1}
                      {overflow && (
                        <span className="ml-2 text-amber-400 text-xs font-normal">⚠ overflow</span>
                      )}
                    </p>
                  </div>
                  {overflow ? (
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Esta subred comienza en el offset <span className="text-amber-400 font-mono">{s.start}</span>,
                      que cae fuera del rango .0–.255 de la red /24.
                      Se necesitaría una red base más grande (por ejemplo <code className="text-white bg-slate-800 px-1 rounded">/22</code> o <code className="text-white bg-slate-800 px-1 rounded">/23</code>).
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Dirección de red</p>
                        <p className="font-mono text-sm text-blue-300 font-bold">
                          {addr(s.start)}/{s.group.prefix}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Broadcast</p>
                        <p className="font-mono text-sm text-red-300 font-bold">{addr(s.end)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Primer host</p>
                        <p className="font-mono text-sm text-emerald-300 font-bold">{addr(s.start + 1)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Último host</p>
                        <p className="font-mono text-sm text-emerald-300 font-bold">{addr(s.end - 1)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Hosts útiles</p>
                        <p className="font-mono text-sm text-white font-bold">{s.group.usable}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── tabla resultado ────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Resultado</p>
            <h2 className="text-white font-bold text-xl">Tabla de subredes VLSM</h2>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono min-w-[520px]">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-800">
                    <th className="text-left px-4 py-3">Subred</th>
                    <th className="text-left px-3 py-3">Red / Máscara</th>
                    <th className="text-left px-3 py-3">Primer host</th>
                    <th className="text-left px-3 py-3">Último host</th>
                    <th className="text-left px-3 py-3">Broadcast</th>
                    <th className="text-right px-4 py-3">Hosts útiles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {SUBNETS.map((s, i) => {
                    const overflow = s.end >= BASE_TOTAL;
                    return (
                      <tr
                        key={i}
                        onClick={() => !overflow && setActive(active === i ? null : i)}
                        className={`transition-colors ${
                          overflow
                            ? "opacity-40"
                            : "hover:bg-slate-800/30 cursor-pointer"
                        } ${active === i ? "bg-slate-800/50" : ""}`}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${s.group.bar}`} />
                            <span className={`text-[10px] ${s.group.text}`}>
                              {s.group.name} {s.idx + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-blue-300 font-semibold">
                          {overflow ? <span className="text-amber-500">overflow</span> : `${addr(s.start)}/${s.group.prefix}`}
                        </td>
                        <td className="px-3 py-2.5 text-emerald-300">
                          {overflow ? "—" : addr(s.start + 1)}
                        </td>
                        <td className="px-3 py-2.5 text-emerald-300">
                          {overflow ? "—" : addr(s.end - 1)}
                        </td>
                        <td className="px-3 py-2.5 text-red-300">
                          {overflow ? "—" : addr(s.end)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-400">
                          {overflow ? "—" : s.group.usable}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {HAS_OVERFLOW && (
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-2xl px-5 py-4 space-y-2">
              <p className="text-amber-400 font-semibold text-sm">⚠ Este ejercicio no entra en un /24</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Los requerimientos suman <span className="text-white font-semibold">{TOTAL_NEEDED} IPs</span> en total, pero una red /24
                solo tiene <span className="text-white font-semibold">256 IPs</span>. Para que todo entre, la red base necesitaría ser al
                menos un{" "}
                <code className="text-white bg-slate-800 px-1.5 rounded">/22</code> (1024 IPs) o{" "}
                <code className="text-white bg-slate-800 px-1.5 rounded">/23</code> (512 IPs).
              </p>
              <p className="text-slate-500 text-xs">
                El método es correcto — el ejemplo ilustra que VLSM también requiere planificar el tamaño
                de la red base.
              </p>
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="pb-8 flex flex-col gap-3">
          <Link
            href="/subnetting/guia"
            className="block w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-300 font-semibold text-sm text-center transition-all border border-slate-700"
          >
            ← Guía de subnetting básico
          </Link>
          <Link
            href="/subnetting"
            className="block w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-sm text-center transition-all"
          >
            Practicar ejercicios →
          </Link>
        </div>
      </main>
    </div>
  );
}

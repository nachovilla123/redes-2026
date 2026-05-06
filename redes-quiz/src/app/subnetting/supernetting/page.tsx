"use client";

import { useState } from "react";
import Link from "next/link";

// ── data ──────────────────────────────────────────────────────────────────────

const NETS = [
  { label: "192.168.4.0/24", third: 4 },
  { label: "192.168.5.0/24", third: 5 },
  { label: "192.168.6.0/24", third: 6 },
  { label: "192.168.7.0/24", third: 7 },
];

// 3rd octet binary: 00000100, 00000101, 00000110, 00000111
// Common prefix in 3rd octet: 000001 (6 bits)
const SHARED_IN_THIRD = 6;
const SUPERNET_PREFIX = 22; // 8 + 8 + 6
const SUPERNET = "192.168.4.0/22";

const NET_COLORS = ["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"];
const NET_TEXT = ["text-sky-400", "text-violet-400", "text-emerald-400", "text-amber-400"];
const NET_BG = ["bg-sky-950/40", "bg-violet-950/40", "bg-emerald-950/40", "bg-amber-950/40"];
const NET_BORDER = ["border-sky-700/50", "border-violet-700/50", "border-emerald-700/50", "border-amber-700/50"];

// ── components ────────────────────────────────────────────────────────────────

function OctetRow({
  value,
  label,
  sharedBits,
  colorClass,
}: {
  value: number;
  label: string;
  sharedBits: number;
  colorClass: string;
}) {
  const bits = value.toString(2).padStart(8, "0").split("");
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-slate-400 w-28 shrink-0 text-right">{label}</span>
      <div className="flex gap-[3px]">
        {bits.map((bit, i) => (
          <div
            key={i}
            className={`w-[26px] h-[26px] flex items-center justify-center rounded text-[12px] font-bold font-mono transition-colors ${
              i < sharedBits
                ? `${colorClass} text-white`
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {bit}
          </div>
        ))}
      </div>
      <span className="font-mono text-xs text-slate-500 shrink-0">.{value}</span>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function SupernettingPage() {
  const [step, setStep] = useState(0);
  const [activeNet, setActiveNet] = useState<number | null>(null);

  return (
    <div className="min-h-dvh bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800/60 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/subnetting/guia" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Guía
          </Link>
          <h1 className="text-white font-semibold text-sm">Supernetting · CIDR Resumen</h1>
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            Inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full space-y-12">

        {/* ── concepto ──────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Concepto</p>
            <h2 className="text-white font-bold text-xl">¿Qué es Supernetting?</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Supernetting es lo opuesto al subnetting: en lugar de dividir una red grande en partes
              chicas, <span className="text-white font-semibold">agrupás varias redes pequeñas en una sola entrada de ruteo</span>.
              El objetivo es reducir el tamaño de las tablas de ruteo.
            </p>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              También se llama <span className="text-indigo-300 font-semibold">CIDR route summarization</span> o
              {" "}<span className="text-indigo-300 font-semibold">route aggregation</span>. La idea es que
              si un router sabe que todos los destinos 192.168.4.x–192.168.7.x están en la misma
              dirección, puede reemplazar 4 entradas por 1.
            </p>
          </div>

          {/* subnetting vs supernetting */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4">
              <p className="text-slate-400 font-semibold text-sm mb-3">Subnetting</p>
              {/* una red → varias */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-full h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">/22 (grande)</span>
                </div>
                <span className="text-slate-600 text-xs">divide ↓</span>
                <div className="flex gap-1 w-full">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`flex-1 h-7 ${NET_COLORS[i]} rounded flex items-center justify-center`}>
                      <span className="text-[9px] text-white font-bold">/24</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-indigo-800/40 rounded-2xl p-4">
              <p className="text-indigo-400 font-semibold text-sm mb-3">Supernetting</p>
              {/* varias redes → una */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 w-full">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`flex-1 h-7 ${NET_COLORS[i]} rounded flex items-center justify-center`}>
                      <span className="text-[9px] text-white font-bold">/24</span>
                    </div>
                  ))}
                </div>
                <span className="text-indigo-400 text-xs">agrupa ↑</span>
                <div className="w-full h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">/22 (superred)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── el problema ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">El problema</p>
            <h2 className="text-white font-bold text-xl">4 rutas → 1 ruta</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Una empresa tiene 4 subredes. El router de frontera tiene que anunciarlas hacia
              afuera. Sin supernetting, anuncia 4 entradas. Con supernetting, anuncia 1.
            </p>
          </div>

          {/* tabla de ruteo antes/después */}
          <div className="grid grid-cols-2 gap-3">
            {/* antes */}
            <div className="bg-slate-900 border border-red-800/40 rounded-2xl p-4 space-y-2">
              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Antes — 4 entradas
              </p>
              {NETS.map((n, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${NET_COLORS[i]} shrink-0`} />
                  <span className={`font-mono text-xs font-semibold ${NET_TEXT[i]}`}>{n.label}</span>
                </div>
              ))}
            </div>
            {/* después */}
            <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl p-4 flex flex-col justify-center items-center gap-2">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1 self-start">
                Después — 1 entrada
              </p>
              <div className="flex items-center gap-2 self-start">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="font-mono text-sm font-bold text-white">{SUPERNET}</span>
              </div>
              <p className="text-emerald-400 text-xs self-start">✓ reemplaza las 4</p>
            </div>
          </div>
        </section>

        {/* ── paso 1: binario ────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 1</p>
            <h2 className="text-white font-bold text-xl">Escribir las redes en binario</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Las 4 redes solo difieren en el tercer octeto. Lo escribimos en binario para encontrar
              qué bits tienen en común. Los dos primeros octetos (192.168) son idénticos — los
              ignoramos por ahora.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Tercer octeto — en binario
            </p>

            {/* encabezado de bits */}
            <div className="flex items-center gap-3">
              <span className="w-28 shrink-0" />
              <div className="flex gap-[3px]">
                {[7, 6, 5, 4, 3, 2, 1, 0].map((b) => (
                  <div key={b} className="w-[26px] text-center text-[9px] text-slate-600 font-mono">
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {NETS.map((n, i) => (
              <OctetRow
                key={i}
                value={n.third}
                label={n.label}
                sharedBits={8}
                colorClass={NET_COLORS[i].replace("bg-", "bg-")}
              />
            ))}

            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-800 pt-3">
              Cada red solo cambia los últimos bits del tercer octeto: 100, 101, 110, 111.
              Los demás son idénticos.
            </p>
          </div>
        </section>

        {/* ── paso 2: bits comunes ───────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 2</p>
            <h2 className="text-white font-bold text-xl">Encontrar los bits compartidos</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Comparamos bit por bit de izquierda a derecha hasta encontrar el primer bit que cambia.
              Los bits que coinciden en <span className="text-white font-semibold">todas</span> las redes
              forman el prefijo de la superred.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            {/* los 4 terceros octetos con bits compartidos resaltados */}
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                Tercer octeto — bits compartidos en{" "}
                <span className="text-indigo-400">azul</span>, variables en gris
              </p>

              {NETS.map((n, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-400 w-28 shrink-0 text-right">
                    {n.label}
                  </span>
                  <div className="flex gap-[3px]">
                    {n.third
                      .toString(2)
                      .padStart(8, "0")
                      .split("")
                      .map((bit, j) => (
                        <div
                          key={j}
                          className={`w-[26px] h-[26px] flex items-center justify-center rounded text-[12px] font-bold font-mono ${
                            j < SHARED_IN_THIRD
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                  </div>
                  <span className="font-mono text-xs text-slate-500">.{n.third}</span>
                </div>
              ))}

              {/* anotaciones de la máscara */}
              <div className="flex items-center gap-3 pt-1">
                <span className="w-28 shrink-0" />
                <div className="flex gap-[3px]">
                  {Array.from({ length: 8 }, (_, j) => (
                    <div
                      key={j}
                      className={`w-[26px] h-[5px] rounded-full ${
                        j < SHARED_IN_THIRD ? "bg-indigo-500" : "bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-indigo-400 font-semibold">
                    ← {SHARED_IN_THIRD} bits compartidos →
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {8 - SHARED_IN_THIRD} bits variables
                  </span>
                </div>
              </div>
            </div>

            {/* cálculo del nuevo prefijo */}
            <div className="border-t border-slate-800 pt-4">
              <p className="text-xs text-slate-400 font-semibold mb-3">
                ¿Cómo calculo el nuevo prefijo?
              </p>
              <div className="bg-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap text-sm">
                <div className="text-center">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">Octeto 1</p>
                  <p className="text-white font-bold font-mono">8 bits</p>
                  <p className="text-slate-600 text-[9px]">(192)</p>
                </div>
                <span className="text-slate-600">+</span>
                <div className="text-center">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">Octeto 2</p>
                  <p className="text-white font-bold font-mono">8 bits</p>
                  <p className="text-slate-600 text-[9px]">(168)</p>
                </div>
                <span className="text-slate-600">+</span>
                <div className="text-center">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">Octeto 3 (compartidos)</p>
                  <p className="text-indigo-400 font-bold font-mono">{SHARED_IN_THIRD} bits</p>
                  <p className="text-slate-600 text-[9px]">(000001xx)</p>
                </div>
                <span className="text-slate-600">=</span>
                <div className="text-center">
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider">Prefijo superred</p>
                  <p className="text-white font-bold font-mono text-xl">/{SUPERNET_PREFIX}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── paso 3: resultado ─────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Paso 3</p>
            <h2 className="text-white font-bold text-xl">La superred resultante</h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              La dirección de la superred es siempre la{" "}
              <span className="text-white font-semibold">primera red del grupo</span> (192.168.4.0),
              con la nueva máscara corta (/{SUPERNET_PREFIX}).
            </p>
          </div>

          {/* la superred en detalle */}
          <div className="bg-indigo-950/40 border border-indigo-700/50 rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <p className="text-indigo-400 text-xs uppercase tracking-widest mb-1">CIDR Resumen</p>
              <p className="font-mono text-4xl font-black text-white tracking-wider">{SUPERNET}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/60 rounded-xl px-3 py-3">
                <p className="text-slate-500 text-[9px] uppercase tracking-wider">Primera IP</p>
                <p className="font-mono text-sm text-blue-300 font-bold mt-1">192.168.4.0</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl px-3 py-3">
                <p className="text-slate-500 text-[9px] uppercase tracking-wider">IPs totales</p>
                <p className="font-mono text-sm text-white font-bold mt-1">1024</p>
                <p className="text-slate-600 text-[9px]">2^10</p>
              </div>
              <div className="bg-slate-900/60 rounded-xl px-3 py-3">
                <p className="text-slate-500 text-[9px] uppercase tracking-wider">Última IP</p>
                <p className="font-mono text-sm text-red-300 font-bold mt-1">192.168.7.255</p>
              </div>
            </div>
          </div>

          {/* mapa visual del /22 con las 4 /24 adentro */}
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              El bloque /22 contiene las 4 subredes /24
            </p>

            <div className="flex h-12 rounded-xl overflow-hidden">
              {NETS.map((n, i) => (
                <button
                  key={i}
                  onClick={() => setActiveNet(activeNet === i ? null : i)}
                  className={`flex-1 border-r border-black/20 last:border-0 flex items-center justify-center text-[10px] font-bold text-white transition-all hover:brightness-110 ${NET_COLORS[i]} ${
                    activeNet === i ? "ring-2 ring-white ring-inset" : ""
                  }`}
                >
                  .{n.third}.0/24
                </button>
              ))}
            </div>

            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>192.168.4.0</span>
              <span className="text-slate-400 font-semibold">← 192.168.4.0/22 →</span>
              <span>192.168.7.255</span>
            </div>

            {/* detalle de red activa */}
            {activeNet !== null && (
              <div className={`rounded-xl border p-4 ${NET_BG[activeNet]} ${NET_BORDER[activeNet]}`}>
                <p className={`font-semibold text-sm mb-2 ${NET_TEXT[activeNet]}`}>
                  {NETS[activeNet].label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">Dirección de red</p>
                    <p className="font-mono text-sm text-blue-300 font-bold">192.168.{NETS[activeNet].third}.0</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">Broadcast</p>
                    <p className="font-mono text-sm text-red-300 font-bold">192.168.{NETS[activeNet].third}.255</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">Rango de hosts</p>
                    <p className="font-mono text-sm text-emerald-300 font-bold">
                      .{NETS[activeNet].third}.1 → .{NETS[activeNet].third}.254
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">Hosts útiles</p>
                    <p className="font-mono text-sm text-white font-bold">254</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── reglas ─────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-white font-bold text-xl">Reglas para que funcione</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            No cualquier combinación de redes se puede resumir. Hay 3 condiciones obligatorias:
          </p>

          <div className="space-y-3">
            {[
              {
                num: "1",
                title: "Las redes deben ser contiguas",
                body: "Tienen que ser bloques consecutivos sin huecos. No podés agrupar 192.168.4.0 con 192.168.7.0 si 5 y 6 no forman parte del grupo.",
                ok: "192.168.4.0, 5.0, 6.0, 7.0 ✓",
                bad: "192.168.4.0, 5.0, 7.0 — falta el 6 ✗",
                color: "border-indigo-800/40 bg-indigo-950/30",
                num_color: "text-indigo-400",
              },
              {
                num: "2",
                title: "La cantidad de redes debe ser potencia de 2",
                body: "Necesitás 2, 4, 8, 16... redes para poder agruparlas. No se puede resumir 3 redes en 1 porque 3 no es potencia de 2.",
                ok: "4 redes (2²) ✓",
                bad: "3 redes ✗",
                color: "border-violet-800/40 bg-violet-950/30",
                num_color: "text-violet-400",
              },
              {
                num: "3",
                title: "La primera red debe estar alineada al bloque",
                body: "La dirección inicial debe ser múltiplo del tamaño del bloque. Para agrupar 4 redes /24, la primera tiene que ser múltiplo de 4 en el tercer octeto.",
                ok: "192.168.4.0 — 4 es múltiplo de 4 ✓",
                bad: "192.168.3.0 — 3 no es múltiplo de 4 ✗",
                color: "border-emerald-800/40 bg-emerald-950/30",
                num_color: "text-emerald-400",
              },
            ].map((rule) => (
              <div key={rule.num} className={`rounded-2xl border px-5 py-4 ${rule.color}`}>
                <div className="flex items-start gap-3">
                  <span className={`text-3xl font-black leading-none ${rule.num_color} shrink-0`}>
                    {rule.num}
                  </span>
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-sm">{rule.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{rule.body}</p>
                    <div className="flex flex-col gap-1">
                      <span className="text-emerald-400 text-xs font-mono">{rule.ok}</span>
                      <span className="text-red-400 text-xs font-mono">{rule.bad}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── por qué funciona ───────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-white font-bold text-xl">¿Por qué el router lo entiende?</h2>
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <p className="text-slate-400 text-sm leading-relaxed">
              Los routers usan <span className="text-white font-semibold">longest-prefix match</span>: cuando un paquete llega,
              el router busca la entrada más específica que coincida con el destino.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Si un paquete va a <code className="text-white bg-slate-800 px-1.5 rounded text-xs">192.168.5.42</code>,
              el router verifica: ¿está dentro de 192.168.4.0/22?
            </p>
            <div className="bg-slate-800/60 rounded-xl px-4 py-3 space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Verificación</p>
              <div className="font-mono text-xs space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Destino:</span>
                  <span className="text-white">192.168.<span className="text-sky-400 font-bold">5</span>.42</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Superred /22:</span>
                  <span className="text-white">192.168.<span className="text-indigo-400 font-bold">4</span>.0 – 192.168.<span className="text-indigo-400 font-bold">7</span>.255</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 w-32 shrink-0">¿Coincide?</span>
                  <span className="text-emerald-400 font-bold">✓ sí — .5 está entre .4 y .7</span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              El router reenvía el paquete por la interfaz asociada a esa ruta, sin necesitar
              las 4 entradas individuales.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="pb-8 flex flex-col gap-3">
          <Link
            href="/subnetting/vlsm"
            className="block w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-300 font-semibold text-sm text-center transition-all border border-slate-700"
          >
            ← Ver VLSM
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

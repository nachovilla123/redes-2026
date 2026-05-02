"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

// Red base: 192.168.1.0/24 (256 direcciones)
// Necesidades:
//   Ventas: 100 hosts → /25 (128 direcciones)
//   Ingeniería: 50 hosts → /26 (64 direcciones)
//   Soporte: 20 hosts → /27 (32 direcciones)
//   Admin: 10 hosts → /28 (16 direcciones)
//   Total usado: 240 / 256 → quedan 16 direcciones libres

type Block = {
  name: string;
  hosts: number;
  prefix: number;
  size: number;
  start: number;
  end: number;
  color: string;
};

const BLOCKS: Block[] = [
  { name: "Ventas (100 hosts)", hosts: 100, prefix: 25, size: 128, start: 0, end: 127, color: "#3fb950" },
  { name: "Ingeniería (50 hosts)", hosts: 50, prefix: 26, size: 64, start: 128, end: 191, color: "#58a6ff" },
  { name: "Soporte (20 hosts)", hosts: 20, prefix: 27, size: 32, start: 192, end: 223, color: "#fbbf24" },
  { name: "Admin (10 hosts)", hosts: 10, prefix: 28, size: 16, start: 224, end: 239, color: "#a371f7" },
];

const VLSM_TOTAL = BLOCKS.length + 1; // 4 blocks + 1 final summary

export function Vlsm() {
  const [step, setStep] = useState(-1); // -1: empty, 0..3: assign block i, 4: done
  const [running, setRunning] = useState(false);

  function reset() {
    setStep(-1);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, VLSM_TOTAL - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  useEffect(() => {
    if (!running) return;
    if (step >= VLSM_TOTAL - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1500);
    return () => clearTimeout(t);
  }, [running, step]);

  function auto() {
    if (running) return;
    if (step >= VLSM_TOTAL - 1) setStep(-1);
    setRunning(true);
    setStep((s) => (s < 0 ? 0 : s + 1));
  }

  const captions = [
    "Red base: 192.168.1.0/24 con 256 direcciones disponibles. Necesitamos 4 subredes con tamaños DISTINTOS.",
    "1️⃣ Ventas (100 hosts) → necesita /25 (128 direcciones). Asignamos el primer bloque: 192.168.1.0/25",
    "2️⃣ Ingeniería (50 hosts) → /26 (64 direcciones). Sigue desde donde quedó: 192.168.1.128/26",
    "3️⃣ Soporte (20 hosts) → /27 (32 direcciones). Continúa: 192.168.1.192/27",
    "4️⃣ Admin (10 hosts) → /28 (16 direcciones). Último bloque: 192.168.1.224/28. Sobran 16 direcciones libres.",
  ];

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{captions[Math.max(0, step)]}</p>
          <p className="text-slate-500 text-xs">Regla de oro: <b>ordenar por hosts requeridos de MAYOR a MENOR</b> antes de asignar.</p>
        </div>
      }
      controls={
        <StepControls
          step={step < 0 ? 0 : step}
          total={VLSM_TOTAL}
          onNext={next}
          onPrev={prev}
          onAuto={auto}
          onReset={reset}
          running={running}
        />
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        {/* Address bar */}
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-2">192.168.1.0/24 — 256 direcciones</p>
        <div className="flex w-full h-14 rounded-md overflow-hidden mb-4 border border-slate-800">
          {BLOCKS.map((b, i) => {
            const isActive = step === i;
            const isAssigned = step > i;
            const isPending = step <= i || step < 0;
            const flexBasis = (b.size / 256) * 100;
            return (
              <div
                key={i}
                className="flex items-center justify-center text-[11px] font-bold transition-all duration-500 border-r border-slate-950 last:border-r-0"
                style={{
                  flexBasis: `${flexBasis}%`,
                  background: isAssigned || isActive ? b.color : "#1e293b",
                  color: isAssigned || isActive ? "#0f172a" : "#475569",
                  boxShadow: isActive ? `0 0 16px ${b.color}` : undefined,
                }}
              >
                {isAssigned || isActive ? `/${b.prefix}` : `· · ·`}
              </div>
            );
          })}
          {/* Free space at end */}
          <div
            className="flex items-center justify-center text-[10px] border-l border-slate-950"
            style={{ flexBasis: `${(16 / 256) * 100}%`, background: "#1e293b", color: "#475569" }}
          >
            libre
          </div>
        </div>

        {/* Tick marks */}
        <div className="flex w-full text-[9px] text-slate-600 font-mono mb-4">
          <div style={{ flexBasis: "12.5%" }}>0</div>
          <div style={{ flexBasis: "12.5%" }}>32</div>
          <div style={{ flexBasis: "12.5%" }}>64</div>
          <div style={{ flexBasis: "12.5%" }}>96</div>
          <div style={{ flexBasis: "12.5%" }}>128</div>
          <div style={{ flexBasis: "12.5%" }}>160</div>
          <div style={{ flexBasis: "12.5%" }}>192</div>
          <div style={{ flexBasis: "12.5%" }}>224</div>
          <div className="text-right">255</div>
        </div>

        {/* Subnet table */}
        <div className="space-y-2">
          {BLOCKS.map((b, i) => {
            const isActive = step === i;
            const isAssigned = step > i;
            const visible = isActive || isAssigned;
            return (
              <div
                key={i}
                className={`p-2 rounded border transition-all ${
                  isActive ? "border-2" : "border"
                } ${visible ? "" : "opacity-30"}`}
                style={{
                  borderColor: visible ? b.color : "#334155",
                  background: visible ? b.color + "15" : "#0f172a",
                }}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-bold" style={{ color: b.color }}>
                    {b.name}
                  </span>
                  <span className="text-slate-400 font-mono">→ /{b.prefix}</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {visible ? `192.168.1.${b.start} – 192.168.1.${b.end}` : "esperando..."}
                  </span>
                  <span className="text-slate-500 ml-auto font-mono text-[11px]">
                    {visible ? `${b.size - 2} hosts útiles` : ""}
                  </span>
                </div>
              </div>
            );
          })}
          {step >= BLOCKS.length && (
            <div className="p-2 rounded border border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-300 font-bold">Sobrante</span>
                <span className="text-slate-500 font-mono">192.168.1.240 – 192.168.1.255 (16 direcciones libres)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimationFrame>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

const LAYERS = [
  { name: "Aplicación (L7)", header: "HTTP", color: "#f85149", pdu: "Datos" },
  { name: "Transporte (L4)", header: "TCP|443", color: "#58a6ff", pdu: "Segmento" },
  { name: "Red (L3)", header: "IP", color: "#3fb950", pdu: "Paquete" },
  { name: "Enlace (L2)", header: "ETH|MAC", color: "#d29922", pdu: "Trama" },
  { name: "Física (L1)", header: "", color: "#8b5cf6", pdu: "Bits" },
];

export function Encapsulation() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  function reset() {
    setStep(-1);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, LAYERS.length - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  useEffect(() => {
    if (!running) return;
    if (step >= LAYERS.length - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1300);
    return () => clearTimeout(t);
  }, [running, step]);

  function auto() {
    if (running) return;
    if (step >= LAYERS.length - 1) setStep(-1);
    setRunning(true);
    setStep((s) => (s < 0 ? 0 : s + 1));
  }

  // Build the PDU representation at current step
  const headersAdded = step >= 0 ? LAYERS.slice(0, Math.min(step + 1, 4)) : [];
  const showBits = step === 4;

  const current = step >= 0 && step < LAYERS.length ? LAYERS[step] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {current
              ? `Capa ${5 - step} ${current.name.split(" ")[0]} ${current.header ? `agrega header ${current.header}` : "convierte a bits"}`
              : "Los datos del usuario bajan por las capas. Cada una agrega su header."}
          </p>
          <p className="text-slate-500">Paso {Math.max(0, step + 1)}/{LAYERS.length}</p>
        </div>
      }
      controls={
        <StepControls
          step={step < 0 ? 0 : step}
          total={LAYERS.length}
          onNext={next}
          onPrev={prev}
          onAuto={auto}
          onReset={reset}
          running={running}
        />
      }
    >
      <div className="flex flex-col gap-3">
        {/* Layer stack */}
        <div className="flex flex-col gap-1.5">
          {LAYERS.map((l, i) => {
            const isActive = i === step;
            const wasActive = i < step;
            return (
              <div
                key={l.name}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-slate-800 border-2"
                    : wasActive
                    ? "bg-slate-900 border border-slate-700"
                    : "bg-slate-900/50 border border-slate-800"
                }`}
                style={{ borderColor: isActive ? l.color : undefined, boxShadow: isActive ? `0 0 16px ${l.color}55` : undefined }}
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{ background: l.color + "33", color: l.color }}
                >
                  L{5 - i}
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-semibold">{l.name}</p>
                  <p className="text-slate-500 text-[10px]">{l.pdu}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* PDU visualization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-2">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">
            PDU actual {current && `(saliendo de ${current.name})`}
          </p>
          {showBits ? (
            <div className="font-mono text-xs text-violet-300 break-all leading-relaxed">
              01000100 01000001 01010100 01000001 00100000 ...
            </div>
          ) : (
            <div className="flex items-stretch min-h-[44px] rounded-md overflow-hidden">
              {headersAdded.map((l) => (
                <div
                  key={l.name}
                  className="px-2.5 py-2 flex items-center justify-center text-[11px] font-bold text-white border-r border-slate-950 transition-all"
                  style={{ background: l.color, animation: "slideIn 0.4s" }}
                >
                  {l.header}
                </div>
              ))}
              <div className="flex-1 px-2.5 py-2 flex items-center justify-center text-[11px] font-bold text-white bg-slate-700">
                Datos
              </div>
              {step >= 3 && (
                <div className="px-2.5 py-2 flex items-center justify-center text-[11px] font-bold text-white" style={{ background: LAYERS[3].color }}>
                  CRC
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-12px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </AnimationFrame>
  );
}

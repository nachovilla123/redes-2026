"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

const FIELDS = [
  { name: "Preámbulo", bytes: 8, color: "#a371f7", detail: "10101010 × 7 + SFD: sincroniza al receptor a nivel bit." },
  { name: "MAC destino", bytes: 6, color: "#f85149", detail: "Identifica al receptor. FF:FF:FF:FF:FF:FF = broadcast." },
  { name: "MAC origen", bytes: 6, color: "#fbbf24", detail: "Identifica al emisor. Siempre unicast (un solo origen)." },
  { name: "Tipo / Long.", bytes: 2, color: "#58a6ff", detail: "EtherType (0x0800 = IPv4) o longitud del payload." },
  { name: "Datos", bytes: 1500, color: "#3fb950", detail: "Payload: 46 a 1500 bytes (limitado por el MTU)." },
  { name: "CRC", bytes: 4, color: "#06b6d4", detail: "Frame Check Sequence: detecta errores en la trama recibida." },
];

export function EthernetFrame() {
  const [highlight, setHighlight] = useState(-1);
  const [running, setRunning] = useState(false);

  function reset() {
    setHighlight(-1);
    setRunning(false);
  }
  function next() {
    setHighlight((h) => Math.min(h + 1, FIELDS.length - 1));
  }
  function prev() {
    setHighlight((h) => Math.max(h - 1, 0));
  }

  useEffect(() => {
    if (!running) return;
    if (highlight >= FIELDS.length - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setHighlight((h) => h + 1), 1500);
    return () => clearTimeout(t);
  }, [running, highlight]);

  function auto() {
    if (running) return;
    if (highlight >= FIELDS.length - 1) setHighlight(-1);
    setRunning(true);
    setHighlight((h) => (h < 0 ? 0 : h + 1));
  }

  const total = FIELDS.reduce((s, f) => s + f.bytes, 0);
  const current = highlight >= 0 ? FIELDS[highlight] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {current ? (
              <>
                <span className="font-bold mr-2" style={{ color: current.color }}>
                  {current.name} ({current.bytes} {current.bytes === 1 ? "byte" : "bytes"})
                </span>
                {current.detail}
              </>
            ) : (
              "Trama Ethernet IEEE 802.3 — mínimo 64 bytes (sin preámbulo), máximo 1518."
            )}
          </p>
        </div>
      }
      controls={
        <StepControls
          step={highlight < 0 ? 0 : highlight}
          total={FIELDS.length}
          onNext={next}
          onPrev={prev}
          onAuto={auto}
          onReset={reset}
          running={running}
        />
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        {/* Frame visualization */}
        <div className="flex items-stretch w-full overflow-hidden rounded-lg mb-4 min-h-[80px]">
          {FIELDS.map((f, i) => {
            const isHighlight = highlight === i;
            const wasHighlight = highlight > i;
            const flexBasis = Math.max(f.bytes / total, 0.05) * 100;
            return (
              <div
                key={f.name}
                className="flex flex-col items-center justify-center px-2 py-3 transition-all duration-300 border-r border-slate-950 last:border-r-0 text-center"
                style={{
                  flexBasis: `${flexBasis}%`,
                  background: isHighlight ? f.color : wasHighlight ? f.color + "55" : f.color + "22",
                  boxShadow: isHighlight ? `0 0 24px ${f.color}` : undefined,
                  transform: isHighlight ? "scale(1.02)" : "scale(1)",
                }}
              >
                <p
                  className="font-bold text-[11px] sm:text-xs leading-tight"
                  style={{ color: isHighlight ? "#0f172a" : f.color }}
                >
                  {f.name}
                </p>
                <p
                  className="text-[10px] mt-1 font-mono"
                  style={{ color: isHighlight ? "#0f172a" : "#94a3b8" }}
                >
                  {f.bytes}B
                </p>
              </div>
            );
          })}
        </div>

        {/* Total bar */}
        <div className="text-xs text-slate-500 font-mono flex justify-between mb-2 border-t border-slate-800 pt-3">
          <span>← Mínimo: 64B (sin preámbulo)</span>
          <span>1518B máximo →</span>
        </div>

        {/* Field info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
          {FIELDS.map((f, i) => {
            const isHighlight = highlight === i;
            return (
              <div
                key={f.name}
                className={`p-2 rounded border ${
                  isHighlight ? "border-slate-500 bg-slate-800" : "border-slate-800 bg-slate-900"
                }`}
              >
                <span className="font-bold mr-2" style={{ color: f.color }}>
                  {f.name}
                </span>
                <span className="text-slate-400 font-mono">{f.bytes}B</span>
              </div>
            );
          })}
        </div>
      </div>
    </AnimationFrame>
  );
}

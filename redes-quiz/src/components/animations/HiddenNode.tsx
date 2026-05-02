"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

type Mode = "no-rts" | "rts";

const NO_RTS_PHASES = [
  { id: "no-rts-attempt-a", caption: "PC-A escucha el medio (vacío para ella) y empieza a transmitir hacia el AP." },
  { id: "no-rts-attempt-b", caption: "PC-B también escucha y como NO ve la señal de A (está oculta), también empieza a transmitir." },
  { id: "no-rts-collision", caption: "💥 Las señales de A y B chocan en el AP. Ambas tramas se pierden." },
] as const;

const RTS_PHASES = [
  { id: "rts-from-a", caption: "Con RTS/CTS: PC-A primero envía RTS (Request To Send) al AP." },
  { id: "rts-cts-from-ap", caption: "El AP responde CTS (Clear To Send) a TODOS — incluyendo a PC-B, que aunque no ve a A, sí ve al AP." },
  { id: "rts-data-from-a", caption: "PC-A ya puede transmitir datos sin riesgo de colisión." },
  { id: "rts-b-blocked", caption: "PC-B recibió el CTS y sabe que el medio está reservado. Espera (NAV) sin transmitir." },
  { id: "rts-ack", caption: "El AP confirma con ACK. Recién ahora PC-B puede intentar enviar." },
] as const;

export function HiddenNode() {
  const [mode, setMode] = useState<Mode>("no-rts");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const phases = mode === "no-rts" ? NO_RTS_PHASES : RTS_PHASES;
  const phaseId = step >= 0 && step < phases.length ? phases[step].id : "idle";
  const total = phases.length;

  function reset() {
    setStep(-1);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function pause() {
    setRunning(false);
  }

  useEffect(() => {
    if (!running) return;
    if (step >= total - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1700);
    return () => clearTimeout(t);
  }, [running, step, total]);

  function auto() {
    if (running) return;
    if (step >= total - 1) setStep(-1);
    setRunning(true);
    setStep((s) => (s < 0 ? 0 : s + 1));
  }

  function switchMode(m: Mode) {
    setMode(m);
    setStep(-1);
    setRunning(false);
  }

  const idleCaption =
    mode === "no-rts"
      ? "PC-A y PC-B están fuera del alcance de radio entre sí pero ambas ven al AP. Sin RTS/CTS, hay colisiones invisibles."
      : "Con RTS/CTS, las estaciones reservan el medio antes de transmitir. PC-B se entera vía el CTS del AP.";

  const caption = step >= 0 && step < phases.length ? phases[step].caption : idleCaption;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{caption}</p>
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => switchMode("no-rts")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "no-rts" ? "bg-red-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Sin RTS/CTS
          </button>
          <button
            type="button"
            onClick={() => switchMode("rts")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "rts" ? "bg-green-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Con RTS/CTS
          </button>
          <StepControls
            step={step < 0 ? 0 : step}
            total={total}
            onNext={next}
            onPrev={prev}
            onAuto={auto}
            onPause={pause}
            onReset={reset}
            running={running}
          />
        </>
      }
    >
      <svg viewBox="0 0 800 380" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Coverage circles */}
        <circle cx={150} cy={200} r={170} fill="#58a6ff" opacity={0.06} stroke="#58a6ff" strokeOpacity={0.3} strokeDasharray="4 3" />
        <circle cx={650} cy={200} r={170} fill="#3fb950" opacity={0.06} stroke="#3fb950" strokeOpacity={0.3} strokeDasharray="4 3" />
        <text x={70} y={50} fill="#58a6ff" fontSize={11} opacity={0.7}>radio de A</text>
        <text x={620} y={50} fill="#3fb950" fontSize={11} opacity={0.7}>radio de B</text>

        {/* PC A */}
        <g transform="translate(150, 200)">
          <rect x={-50} y={-25} width={100} height={50} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
          <text y={5} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">PC-A</text>
        </g>

        {/* AP */}
        <g transform="translate(400, 200)">
          <rect x={-45} y={-25} width={90} height={50} rx={8} fill="#1e293b" stroke="#fbbf24" strokeWidth={2} />
          <text y={-2} fill="#fff" fontSize={13} fontWeight="bold" textAnchor="middle">AP</text>
          <text y={14} fill="#fbbf24" fontSize={9} textAnchor="middle">WiFi</text>
        </g>

        {/* PC B */}
        <g transform="translate(650, 200)">
          <rect x={-50} y={-25} width={100} height={50} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
          <text y={5} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">PC-B</text>
        </g>

        {/* Phase visuals */}
        {phaseId === "no-rts-attempt-a" && <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />}
        {phaseId === "no-rts-attempt-b" && (
          <>
            <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
            <Wave from={650} to={400} y={200} color="#3fb950" label="DATA" />
          </>
        )}
        {phaseId === "no-rts-collision" && (
          <g>
            <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
            <Wave from={650} to={400} y={200} color="#3fb950" label="DATA" />
            <text x={400} y={130} fill="#f85149" fontSize={36} textAnchor="middle">💥</text>
            <text x={400} y={260} fill="#f85149" fontSize={13} textAnchor="middle" fontWeight="bold">
              COLISIÓN — ambas tramas se pierden
            </text>
          </g>
        )}

        {phaseId === "rts-from-a" && <Wave from={150} to={400} y={200} color="#fbbf24" label="RTS" />}
        {phaseId === "rts-cts-from-ap" && (
          <>
            <Wave from={400} to={150} y={200} color="#3fb950" label="CTS" />
            <Wave from={400} to={650} y={200} color="#3fb950" label="CTS" />
          </>
        )}
        {phaseId === "rts-data-from-a" && (
          <>
            <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
            <text x={650} y={250} fill="#f59e0b" fontSize={11} textAnchor="middle">
              ⏸ esperando (NAV)
            </text>
          </>
        )}
        {phaseId === "rts-b-blocked" && (
          <>
            <text x={650} y={250} fill="#f59e0b" fontSize={11} textAnchor="middle" fontWeight="bold">
              ⏸ NAV: medio reservado
            </text>
            <text x={400} y={150} fill="#3fb950" fontSize={11} textAnchor="middle">
              ✓ A transmite sin colisión
            </text>
          </>
        )}
        {phaseId === "rts-ack" && (
          <>
            <Wave from={400} to={150} y={200} color="#3fb950" label="ACK" />
            <text x={650} y={250} fill="#3fb950" fontSize={11} textAnchor="middle">
              ✓ ahora B puede transmitir
            </text>
          </>
        )}
      </svg>
    </AnimationFrame>
  );
}

function Wave({ from, to, y, color, label }: { from: number; to: number; y: number; color: string; label: string }) {
  return (
    <g>
      <line x1={from} y1={y} x2={to} y2={y} stroke={color} strokeWidth={3} strokeDasharray="6 3">
        <animate attributeName="stroke-dashoffset" from={0} to={-18} dur="0.5s" repeatCount="indefinite" />
      </line>
      <rect x={(from + to) / 2 - 26} y={y - 14} width={52} height={20} rx={4} fill={color} stroke="#fff" />
      <text x={(from + to) / 2} y={y} fill="#0f172a" fontSize={10} textAnchor="middle" fontWeight="bold">
        {label}
      </text>
    </g>
  );
}

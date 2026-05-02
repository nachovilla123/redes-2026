"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Phase =
  | "idle"
  | "no-rts-attempt-a"
  | "no-rts-attempt-b"
  | "no-rts-collision"
  | "rts-from-a"
  | "rts-cts-from-ap"
  | "rts-data-from-a"
  | "rts-b-blocked"
  | "rts-ack";

export function HiddenNode() {
  const [mode, setMode] = useState<"no-rts" | "rts">("no-rts");
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setPhase("idle");
    setRunning(false);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setPhase("idle");
    await sleep(400);
    if (cancelRef.current) return;

    if (mode === "no-rts") {
      setPhase("no-rts-attempt-a");
      await sleep(1300);
      if (cancelRef.current) return;
      setPhase("no-rts-attempt-b");
      await sleep(1300);
      if (cancelRef.current) return;
      setPhase("no-rts-collision");
      await sleep(2000);
    } else {
      setPhase("rts-from-a");
      await sleep(1500);
      if (cancelRef.current) return;
      setPhase("rts-cts-from-ap");
      await sleep(1700);
      if (cancelRef.current) return;
      setPhase("rts-data-from-a");
      await sleep(1700);
      if (cancelRef.current) return;
      setPhase("rts-b-blocked");
      await sleep(1500);
      if (cancelRef.current) return;
      setPhase("rts-ack");
      await sleep(1500);
    }

    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const captions: Record<Phase, string> = {
    idle:
      "PC-A y PC-B están fuera del alcance de radio entre sí pero ambas ven al AP. Sin RTS/CTS, hay colisiones invisibles.",
    "no-rts-attempt-a": "PC-A escucha el medio (vacío para ella) y empieza a transmitir hacia el AP.",
    "no-rts-attempt-b":
      "PC-B también escucha y como NO ve la señal de A (está oculta), también empieza a transmitir.",
    "no-rts-collision": "💥 Las señales de A y B chocan en el AP. Ambas tramas se pierden.",
    "rts-from-a": "Con RTS/CTS: PC-A primero envía RTS (Request To Send) al AP.",
    "rts-cts-from-ap":
      "El AP responde CTS (Clear To Send) a TODOS — incluyendo a PC-B, que aunque no ve a A, sí ve al AP.",
    "rts-data-from-a": "PC-A ya puede transmitir datos sin riesgo de colisión.",
    "rts-b-blocked":
      "PC-B recibió el CTS y sabe que el medio está reservado. Espera (NAV) sin transmitir.",
    "rts-ack": "El AP confirma con ACK. Recién ahora PC-B puede intentar enviar.",
  };

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{captions[phase]}</p>
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => {
              setMode("no-rts");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "no-rts" ? "bg-red-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Sin RTS/CTS
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("rts");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "rts" ? "bg-green-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Con RTS/CTS
          </button>
          <PlayButton running={running} onPlay={play} onReset={reset} />
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

        {/* No-RTS animations */}
        {phase === "no-rts-attempt-a" && (
          <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
        )}
        {phase === "no-rts-attempt-b" && (
          <>
            <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
            <Wave from={650} to={400} y={200} color="#3fb950" label="DATA" />
          </>
        )}
        {phase === "no-rts-collision" && (
          <g>
            <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
            <Wave from={650} to={400} y={200} color="#3fb950" label="DATA" />
            <text x={400} y={130} fill="#f85149" fontSize={36} textAnchor="middle">💥</text>
            <text x={400} y={260} fill="#f85149" fontSize={13} textAnchor="middle" fontWeight="bold">
              COLISIÓN — ambas tramas se pierden
            </text>
          </g>
        )}

        {/* RTS animations */}
        {phase === "rts-from-a" && (
          <Wave from={150} to={400} y={200} color="#fbbf24" label="RTS" />
        )}
        {phase === "rts-cts-from-ap" && (
          <>
            <Wave from={400} to={150} y={200} color="#3fb950" label="CTS" />
            <Wave from={400} to={650} y={200} color="#3fb950" label="CTS" />
          </>
        )}
        {phase === "rts-data-from-a" && (
          <>
            <Wave from={150} to={400} y={200} color="#58a6ff" label="DATA" />
            <text x={650} y={250} fill="#f59e0b" fontSize={11} textAnchor="middle">
              ⏸ esperando (NAV)
            </text>
          </>
        )}
        {phase === "rts-b-blocked" && (
          <>
            <text x={650} y={250} fill="#f59e0b" fontSize={11} textAnchor="middle" fontWeight="bold">
              ⏸ NAV: medio reservado
            </text>
            <text x={400} y={150} fill="#3fb950" fontSize={11} textAnchor="middle">
              ✓ A transmite sin colisión
            </text>
          </>
        )}
        {phase === "rts-ack" && (
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

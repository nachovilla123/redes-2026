"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Phase = "idle" | "sense" | "difs" | "backoff" | "tx" | "ack" | "done";

const PHASES: { id: Phase; name: string; color: string; detail: string }[] = [
  { id: "sense", name: "Sense", color: "#a371f7", detail: "Escucha el canal: ¿hay alguien transmitiendo?" },
  { id: "difs", name: "DIFS", color: "#fbbf24", detail: "Espera un tiempo fijo (DIFS) tras ver el canal libre." },
  { id: "backoff", name: "Backoff", color: "#fb923c", detail: "Espera un tiempo aleatorio adicional para evitar colisiones simultáneas." },
  { id: "tx", name: "Transmite", color: "#3fb950", detail: "Transmite la trama hacia el AP." },
  { id: "ack", name: "ACK", color: "#58a6ff", detail: "El AP responde con ACK confirmando la recepción correcta." },
];

export function CsmaCa() {
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
    await sleep(300);
    for (const p of PHASES) {
      if (cancelRef.current) return;
      setPhase(p.id);
      await sleep(p.id === "tx" ? 1700 : p.id === "backoff" ? 1500 : 1200);
    }
    if (cancelRef.current) return;
    setPhase("done");
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const idx = PHASES.findIndex((p) => p.id === phase);
  const current = idx >= 0 ? PHASES[idx] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {current
              ? <><span className="font-bold mr-2" style={{ color: current.color }}>{current.name}</span>{current.detail}</>
              : "CSMA/CA = Carrier Sense Multiple Access with Collision Avoidance. WiFi no detecta colisiones (no puede transmitir y escuchar a la vez), entonces las EVITA."}
          </p>
          <p className="text-slate-500">Paso {Math.max(0, idx + 1)}/{PHASES.length}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Station */}
        <rect x={50} y={170} width={120} height={60} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={110} y={200} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">Estación</text>
        <text x={110} y={216} fill="#58a6ff" fontSize={10} textAnchor="middle">802.11</text>

        {/* AP */}
        <rect x={630} y={170} width={120} height={60} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={690} y={200} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">AP</text>
        <text x={690} y={216} fill="#3fb950" fontSize={10} textAnchor="middle">WiFi</text>

        {/* Channel */}
        <line x1={170} y1={200} x2={630} y2={200} stroke="#475569" strokeDasharray="3 3" strokeWidth={1.5} />

        {/* Sense */}
        {phase === "sense" && (
          <g>
            <text x={400} y={140} fill="#a371f7" fontSize={20} textAnchor="middle">👂</text>
            <text x={400} y={170} fill="#a371f7" fontSize={12} textAnchor="middle" fontWeight="bold">
              ¿canal libre?
            </text>
            <circle cx={170} cy={200} r={20} fill="none" stroke="#a371f7" strokeWidth={2} opacity={0.6}>
              <animate attributeName="r" values="20;100;20" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* DIFS */}
        {phase === "difs" && (
          <g>
            <text x={400} y={150} fill="#fbbf24" fontSize={36} textAnchor="middle">⏱</text>
            <text x={400} y={180} fill="#fbbf24" fontSize={12} textAnchor="middle" fontWeight="bold">
              DIFS = 50 µs
            </text>
            <rect x={300} y={250} width={200} height={20} rx={4} fill="#fbbf2444" stroke="#fbbf24" strokeWidth={1.5} />
            <rect x={300} y={250} width={0} height={20} rx={4} fill="#fbbf24">
              <animate attributeName="width" from={0} to={200} dur="1s" fill="freeze" />
            </rect>
          </g>
        )}

        {/* Backoff */}
        {phase === "backoff" && (
          <g>
            <text x={400} y={150} fill="#fb923c" fontSize={28} textAnchor="middle">🎲</text>
            <text x={400} y={180} fill="#fb923c" fontSize={12} textAnchor="middle" fontWeight="bold">
              Backoff aleatorio (slots)
            </text>
            <text x={400} y={250} fill="#fb923c" fontSize={10} textAnchor="middle" fontFamily="monospace">
              cw_min ≤ random ≤ cw_max
            </text>
            {/* Slot ticks */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={325 + i * 25}
                y={280}
                width={20}
                height={14}
                fill={"#fb923c"}
                opacity={0}
              >
                <animate attributeName="opacity" values="0;1;0.4" dur="0.25s" begin={`${i * 0.2}s`} fill="freeze" />
              </rect>
            ))}
          </g>
        )}

        {/* TX */}
        {phase === "tx" && (
          <g>
            <line x1={170} y1={200} x2={630} y2={200} stroke="#3fb950" strokeWidth={4} strokeDasharray="6 3">
              <animate attributeName="stroke-dashoffset" from={0} to={-18} dur="0.4s" repeatCount="indefinite" />
            </line>
            <rect x={350} y={190} width={100} height={20} rx={3} fill="#3fb950" stroke="#fff" />
            <text x={400} y={205} fill="#0f172a" fontSize={11} textAnchor="middle" fontWeight="bold">
              DATA →
            </text>
          </g>
        )}

        {/* ACK */}
        {phase === "ack" && (
          <g>
            <line x1={170} y1={200} x2={630} y2={200} stroke="#58a6ff" strokeWidth={3} strokeDasharray="6 3">
              <animate attributeName="stroke-dashoffset" from={0} to={18} dur="0.4s" repeatCount="indefinite" />
            </line>
            <rect x={370} y={190} width={60} height={20} rx={3} fill="#58a6ff" stroke="#fff" />
            <text x={400} y={205} fill="#0f172a" fontSize={11} textAnchor="middle" fontWeight="bold">
              ← ACK
            </text>
          </g>
        )}

        {phase === "done" && (
          <text x={400} y={140} fill="#3fb950" fontSize={14} textAnchor="middle" fontWeight="bold">
            ✓ Transmisión exitosa
          </text>
        )}

        {/* Timeline */}
        <g transform="translate(50, 340)">
          <line x1={0} y1={0} x2={700} y2={0} stroke="#334155" strokeWidth={2} />
          {PHASES.map((p, i) => {
            const x = i * 140;
            const isPast = idx > i;
            const isCurrent = idx === i;
            return (
              <g key={p.id}>
                <circle cx={x + 70} cy={0} r={isCurrent ? 10 : 6} fill={isPast || isCurrent ? p.color : "#475569"} />
                <text
                  x={x + 70}
                  y={25}
                  fill={isPast || isCurrent ? p.color : "#64748b"}
                  fontSize={10}
                  textAnchor="middle"
                  fontWeight={isCurrent ? "bold" : "normal"}
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </AnimationFrame>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

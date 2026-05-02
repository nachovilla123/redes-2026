"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Mode = "store" | "cut" | "fragment";

const MODES: Record<Mode, { name: string; detail: string; color: string; latency: string; integrity: string }> = {
  store: {
    name: "Store-and-Forward",
    detail: "Recibe la trama COMPLETA, verifica el CRC y recién entonces reenvía. Si está corrupta, descarta.",
    color: "#3fb950",
    latency: "Alta",
    integrity: "Garantizada",
  },
  cut: {
    name: "Cut-Through",
    detail: "Lee solo los primeros 14 bytes (hasta la MAC destino) y reenvía de inmediato. Puede pasar tramas con error.",
    color: "#f85149",
    latency: "Mínima",
    integrity: "Sin verificación",
  },
  fragment: {
    name: "Fragment-Free",
    detail: "Espera los primeros 64 bytes (largo mínimo de una trama válida) y reenvía. Filtra los runts (colisiones).",
    color: "#fbbf24",
    latency: "Media",
    integrity: "Parcial",
  },
};

export function SwitchModes() {
  const [mode, setMode] = useState<Mode>("store");
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setRunning(false);
    setTick((t) => t + 1);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setTick((t) => t + 1);
    setTimeout(() => {
      if (!cancelRef.current) setRunning(false);
    }, 4000);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const m = MODES[mode];

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            <span className="font-bold mr-2" style={{ color: m.color }}>{m.name}</span>{m.detail}
          </p>
          <p className="text-slate-500 text-xs">
            Latencia: <span style={{ color: m.color }}>{m.latency}</span> · Integridad: <span style={{ color: m.color }}>{m.integrity}</span>
          </p>
        </div>
      }
      controls={
        <>
          {(["store", "cut", "fragment"] as Mode[]).map((mm) => (
            <button
              key={mm}
              type="button"
              onClick={() => {
                setMode(mm);
                reset();
                setTimeout(play, 200);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === mm ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {MODES[mm].name}
            </button>
          ))}
        </>
      }
    >
      <svg key={`${mode}-${tick}`} viewBox="0 0 800 280" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Source */}
        <rect x={20} y={120} width={90} height={50} rx={6} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={65} y={150} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">PC-A</text>

        {/* Switch */}
        <rect x={300} y={100} width={200} height={90} rx={10} fill="#1e293b" stroke={m.color} strokeWidth={2} />
        <text x={400} y={130} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">SWITCH</text>
        <text x={400} y={150} fill={m.color} fontSize={10} textAnchor="middle">{m.name}</text>

        {/* Destination */}
        <rect x={690} y={120} width={90} height={50} rx={6} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={735} y={150} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">PC-B</text>

        {/* Lines */}
        <line x1={110} y1={145} x2={300} y2={145} stroke="#334155" strokeWidth={1.5} />
        <line x1={500} y1={145} x2={690} y2={145} stroke="#334155" strokeWidth={1.5} />

        {/* Frame entering — animation depends on mode */}
        <Frame mode={mode} color={m.color} />

        {/* Latency indicator */}
        <g transform="translate(120, 230)">
          <text x={0} y={0} fill="#94a3b8" fontSize={11}>Latencia:</text>
          <rect x={70} y={-10} width={mode === "store" ? 280 : mode === "fragment" ? 140 : 60} height={14} rx={3} fill={m.color} opacity={0.7} />
          <text x={mode === "store" ? 215 : mode === "fragment" ? 145 : 105} y={0} fill="#0f172a" fontSize={10} fontWeight="bold">
            {m.latency}
          </text>
        </g>
      </svg>
    </AnimationFrame>
  );
}

function Frame({ mode, color }: { mode: Mode; color: string }) {
  // The animation: a frame enters from left, switch behavior visualized
  if (mode === "store") {
    // Frame fully enters switch, validates, then exits
    return (
      <>
        <rect x={120} y={135} width={150} height={20} rx={3} fill="#58a6ff" stroke="#fff">
          <animate attributeName="x" from={120} to={320} dur="1.5s" fill="freeze" />
        </rect>
        <text x={195} y={148} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
          <animate attributeName="x" from={195} to={395} dur="1.5s" fill="freeze" />
          frame completo
        </text>
        {/* CRC check inside switch */}
        <text x={400} y={180} fill={color} fontSize={11} textAnchor="middle" fontWeight="bold" opacity={0}>
          <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" begin="1.6s" fill="freeze" />
          ✓ CRC verificado
        </text>
        {/* Frame exits */}
        <rect x={500} y={135} width={150} height={20} rx={3} fill="#3fb950" stroke="#fff" opacity={0}>
          <animate attributeName="opacity" values="0;1;1" dur="0.3s" begin="3.1s" fill="freeze" />
          <animate attributeName="x" from={500} to={690} dur="0.6s" begin="3.1s" fill="freeze" />
        </rect>
      </>
    );
  }
  if (mode === "cut") {
    // Frame starts entering, switch immediately starts exiting (parallel)
    return (
      <>
        <rect x={120} y={135} width={150} height={20} rx={3} fill="#58a6ff" stroke="#fff">
          <animate attributeName="x" from={120} to={320} dur="1.5s" fill="freeze" />
        </rect>
        <text x={195} y={148} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
          <animate attributeName="x" from={195} to={395} dur="1.5s" fill="freeze" />
          entrando
        </text>
        {/* Switch starts forwarding immediately after reading 14 bytes */}
        <rect x={500} y={135} width={150} height={20} rx={3} fill="#3fb950" stroke="#fff" opacity={0}>
          <animate attributeName="opacity" values="0;1" dur="0.2s" begin="0.3s" fill="freeze" />
          <animate attributeName="x" from={500} to={690} dur="1.2s" begin="0.3s" fill="freeze" />
        </rect>
        <text x={400} y={185} fill={color} fontSize={10} textAnchor="middle" fontWeight="bold" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" fill="freeze" />
          14B leídos → reenvía YA
        </text>
      </>
    );
  }
  // fragment-free
  return (
    <>
      <rect x={120} y={135} width={150} height={20} rx={3} fill="#58a6ff" stroke="#fff">
        <animate attributeName="x" from={120} to={320} dur="1.5s" fill="freeze" />
      </rect>
      <text x={195} y={148} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
        <animate attributeName="x" from={195} to={395} dur="1.5s" fill="freeze" />
        entrando
      </text>
      <text x={400} y={185} fill={color} fontSize={10} textAnchor="middle" fontWeight="bold" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" begin="0.7s" fill="freeze" />
        64B leídos → reenvía
      </text>
      <rect x={500} y={135} width={150} height={20} rx={3} fill="#3fb950" stroke="#fff" opacity={0}>
        <animate attributeName="opacity" values="0;1" dur="0.2s" begin="1.0s" fill="freeze" />
        <animate attributeName="x" from={500} to={690} dur="1.0s" begin="1.0s" fill="freeze" />
      </rect>
    </>
  );
}

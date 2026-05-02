"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

export function HubVsSwitch() {
  const [mode, setMode] = useState<"hub" | "switch">("hub");
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
    }, 4500);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {mode === "hub"
              ? "Hub: una señal eléctrica compartida. Si dos hablan a la vez → COLISIÓN. Todos están en el MISMO dominio de colisión."
              : "Switch: cada puerto es un canal dedicado. Las tramas van solo al destino. CADA puerto es un dominio de colisión separado."}
          </p>
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => {
              setMode("hub");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "hub" ? "bg-red-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Hub
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("switch");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "switch" ? "bg-green-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Switch
          </button>
          <PlayButton running={running} onPlay={play} onReset={reset} />
        </>
      }
    >
      <svg key={`${mode}-${tick}`} viewBox="0 0 700 380" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Hosts */}
        {[
          { id: "A", x: 100, y: 80, color: "#58a6ff" },
          { id: "B", x: 600, y: 80, color: "#3fb950" },
          { id: "C", x: 100, y: 300, color: "#fbbf24" },
          { id: "D", x: 600, y: 300, color: "#a371f7" },
        ].map((h) => (
          <g key={h.id}>
            <rect x={h.x - 35} y={h.y - 22} width={70} height={44} rx={6} fill="#1e293b" stroke={h.color} strokeWidth={2} />
            <text x={h.x} y={h.y + 5} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">
              PC-{h.id}
            </text>
          </g>
        ))}

        {/* Center device */}
        <rect x={300} y={160} width={100} height={60} rx={8} fill="#1e293b" stroke={mode === "hub" ? "#f85149" : "#3fb950"} strokeWidth={2} />
        <text x={350} y={190} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">
          {mode === "hub" ? "HUB" : "SWITCH"}
        </text>
        <text x={350} y={208} fill={mode === "hub" ? "#f85149" : "#3fb950"} fontSize={10} textAnchor="middle">
          {mode === "hub" ? "1 dominio colisión" : "4 dominios separados"}
        </text>

        {/* Lines from hosts to center */}
        <line x1={100} y1={102} x2={300} y2={180} stroke="#475569" strokeWidth={1.5} />
        <line x1={600} y1={102} x2={400} y2={180} stroke="#475569" strokeWidth={1.5} />
        <line x1={100} y1={278} x2={300} y2={200} stroke="#475569" strokeWidth={1.5} />
        <line x1={600} y1={278} x2={400} y2={200} stroke="#475569" strokeWidth={1.5} />

        {mode === "hub" ? <HubAnim /> : <SwitchAnim />}
      </svg>
    </AnimationFrame>
  );
}

function HubAnim() {
  // A → C, but hub broadcasts to everyone → collision when D also tries to talk
  return (
    <>
      {/* A's signal travels to hub */}
      <circle r={6} fill="#58a6ff">
        <animate attributeName="cx" from={100} to={350} dur="0.8s" begin="0s" fill="freeze" />
        <animate attributeName="cy" from={102} to={190} dur="0.8s" begin="0s" fill="freeze" />
      </circle>
      {/* Hub floods everywhere */}
      <circle r={6} fill="#58a6ff" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cx" from={350} to={600} dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cy" from={190} to={102} dur="0.9s" begin="0.9s" fill="freeze" />
      </circle>
      <circle r={6} fill="#58a6ff" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cx" from={350} to={100} dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cy" from={190} to={278} dur="0.9s" begin="0.9s" fill="freeze" />
      </circle>
      <circle r={6} fill="#58a6ff" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cx" from={350} to={600} dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cy" from={190} to={278} dur="0.9s" begin="0.9s" fill="freeze" />
      </circle>

      {/* D also transmits (collision) */}
      <circle r={6} fill="#a371f7" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="0.8s" begin="2.2s" fill="freeze" />
        <animate attributeName="cx" from={600} to={350} dur="0.8s" begin="2.2s" fill="freeze" />
        <animate attributeName="cy" from={278} to={200} dur="0.8s" begin="2.2s" fill="freeze" />
      </circle>

      {/* Collision */}
      <text x={350} y={130} fill="#f85149" fontSize={32} textAnchor="middle" opacity={0}>
        <animate attributeName="opacity" values="0;0;1;1;0" dur="1.5s" begin="3s" fill="freeze" />
        💥
      </text>
      <text x={350} y={260} fill="#f85149" fontSize={11} textAnchor="middle" fontWeight="bold" opacity={0}>
        <animate attributeName="opacity" values="0;0;1;1;0" dur="1.5s" begin="3s" fill="freeze" />
        COLISIÓN
      </text>
    </>
  );
}

function SwitchAnim() {
  // A → C and B → D simultaneously, no collision
  return (
    <>
      {/* A → switch → C (passes through, only goes to C) */}
      <circle r={6} fill="#58a6ff">
        <animate attributeName="cx" from={100} to={350} dur="0.8s" begin="0s" fill="freeze" />
        <animate attributeName="cy" from={102} to={190} dur="0.8s" begin="0s" fill="freeze" />
      </circle>
      <circle r={6} fill="#58a6ff" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cx" from={350} to={100} dur="0.9s" begin="0.9s" fill="freeze" />
        <animate attributeName="cy" from={190} to={278} dur="0.9s" begin="0.9s" fill="freeze" />
      </circle>
      <text x={250} y={150} fill="#58a6ff" fontSize={10} textAnchor="middle" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" begin="0s" />
        A → C
      </text>

      {/* B → switch → D (parallel, no collision) */}
      <circle r={6} fill="#3fb950">
        <animate attributeName="cx" from={600} to={400} dur="0.8s" begin="0.3s" fill="freeze" />
        <animate attributeName="cy" from={102} to={190} dur="0.8s" begin="0.3s" fill="freeze" />
      </circle>
      <circle r={6} fill="#3fb950" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin="1.2s" fill="freeze" />
        <animate attributeName="cx" from={400} to={600} dur="0.9s" begin="1.2s" fill="freeze" />
        <animate attributeName="cy" from={190} to={278} dur="0.9s" begin="1.2s" fill="freeze" />
      </circle>
      <text x={500} y={150} fill="#3fb950" fontSize={10} textAnchor="middle" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" begin="0.3s" />
        B → D
      </text>

      <text x={350} y={260} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold" opacity={0}>
        <animate attributeName="opacity" values="0;0;1;1;0" dur="1.5s" begin="2.5s" fill="freeze" />
        ✓ Sin colisiones, ambas en paralelo
      </text>
    </>
  );
}

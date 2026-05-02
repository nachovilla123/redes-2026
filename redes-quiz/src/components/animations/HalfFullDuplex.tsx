"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

export function HalfFullDuplex() {
  const [mode, setMode] = useState<"half" | "full">("half");
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
    }, mode === "half" ? 5500 : 4500);
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
          <p className="text-slate-300 font-medium">
            {mode === "half"
              ? "Half duplex (walkie-talkie): solo uno transmite por vez. Si los dos hablan a la vez → colisión. Hub funciona así."
              : "Full duplex (teléfono): ambos transmiten y reciben simultáneamente en canales separados. No hay colisiones. Switches modernos funcionan así."}
          </p>
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => {
              setMode("half");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "half" ? "bg-amber-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Half duplex
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("full");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "full" ? "bg-green-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Full duplex
          </button>
          <PlayButton running={running} onPlay={play} onReset={reset} />
        </>
      }
    >
      <svg key={`${mode}-${tick}`} viewBox="0 0 800 320" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Endpoints */}
        <rect x={50} y={120} width={130} height={80} rx={10} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={115} y={150} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">A</text>
        <text x={115} y={172} fill="#58a6ff" fontSize={28} textAnchor="middle">{mode === "half" ? "📻" : "📞"}</text>

        <rect x={620} y={120} width={130} height={80} rx={10} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={685} y={150} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">B</text>
        <text x={685} y={172} fill="#3fb950" fontSize={28} textAnchor="middle">{mode === "half" ? "📻" : "📞"}</text>

        {mode === "half" ? <HalfAnim /> : <FullAnim />}
      </svg>
    </AnimationFrame>
  );
}

function HalfAnim() {
  return (
    <>
      {/* One channel shared */}
      <line x1={180} y1={160} x2={620} y2={160} stroke="#475569" strokeWidth={2} strokeDasharray="3 3" />
      <text x={400} y={150} fill="#94a3b8" fontSize={11} textAnchor="middle">1 canal compartido</text>

      {/* A → B first */}
      <circle r={9} fill="#58a6ff" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="1s" begin="0s" fill="freeze" />
        <animate attributeName="cx" from={180} to={620} dur="1s" begin="0s" fill="freeze" />
        <animate attributeName="cy" from={160} to={160} dur="1s" begin="0s" fill="freeze" />
      </circle>
      <text x={400} y={210} fill="#58a6ff" fontSize={11} textAnchor="middle" opacity={0}>
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0s" fill="freeze" />
        A habla — B escucha
      </text>

      {/* Wait, then B → A */}
      <circle r={9} fill="#3fb950" opacity={0}>
        <animate attributeName="opacity" values="0;1;1;0" dur="1s" begin="1.5s" fill="freeze" />
        <animate attributeName="cx" from={620} to={180} dur="1s" begin="1.5s" fill="freeze" />
        <animate attributeName="cy" from={160} to={160} dur="1s" begin="1.5s" fill="freeze" />
      </circle>
      <text x={400} y={210} fill="#3fb950" fontSize={11} textAnchor="middle" opacity={0}>
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="1.5s" fill="freeze" />
        B habla — A escucha
      </text>

      {/* Then both try at once → collision */}
      <circle r={9} fill="#58a6ff" opacity={0}>
        <animate attributeName="opacity" values="0;1;0" dur="0.8s" begin="3s" fill="freeze" />
        <animate attributeName="cx" from={180} to={400} dur="0.8s" begin="3s" fill="freeze" />
        <animate attributeName="cy" from={160} to={160} dur="0.8s" begin="3s" fill="freeze" />
      </circle>
      <circle r={9} fill="#3fb950" opacity={0}>
        <animate attributeName="opacity" values="0;1;0" dur="0.8s" begin="3s" fill="freeze" />
        <animate attributeName="cx" from={620} to={400} dur="0.8s" begin="3s" fill="freeze" />
        <animate attributeName="cy" from={160} to={160} dur="0.8s" begin="3s" fill="freeze" />
      </circle>
      <text x={400} y={120} fill="#f85149" fontSize={32} textAnchor="middle" opacity={0}>
        <animate attributeName="opacity" values="0;0;1;1;0" dur="1.5s" begin="3.6s" fill="freeze" />
        💥
      </text>
      <text x={400} y={250} fill="#f85149" fontSize={12} textAnchor="middle" fontWeight="bold" opacity={0}>
        <animate attributeName="opacity" values="0;0;1;1;0" dur="1.5s" begin="3.6s" fill="freeze" />
        Si los dos hablan a la vez → COLISIÓN
      </text>
    </>
  );
}

function FullAnim() {
  return (
    <>
      {/* Two channels */}
      <line x1={180} y1={148} x2={620} y2={148} stroke="#3fb950" strokeWidth={2} />
      <line x1={180} y1={172} x2={620} y2={172} stroke="#58a6ff" strokeWidth={2} />
      <text x={400} y={138} fill="#3fb950" fontSize={10} textAnchor="middle">canal A→B</text>
      <text x={400} y={196} fill="#58a6ff" fontSize={10} textAnchor="middle">canal B→A</text>

      {/* A → B continuously */}
      {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((d, i) => (
        <circle key={`ab-${i}`} r={7} fill="#58a6ff" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="1s" begin={`${d}s`} fill="freeze" />
          <animate attributeName="cx" from={180} to={620} dur="1s" begin={`${d}s`} fill="freeze" />
          <animate attributeName="cy" from={148} to={148} dur="1s" begin={`${d}s`} fill="freeze" />
        </circle>
      ))}

      {/* B → A continuously, simultaneously */}
      {[0.2, 0.7, 1.2, 1.7, 2.2, 2.7].map((d, i) => (
        <circle key={`ba-${i}`} r={7} fill="#3fb950" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="1s" begin={`${d}s`} fill="freeze" />
          <animate attributeName="cx" from={620} to={180} dur="1s" begin={`${d}s`} fill="freeze" />
          <animate attributeName="cy" from={172} to={172} dur="1s" begin={`${d}s`} fill="freeze" />
        </circle>
      ))}

      <text x={400} y={250} fill="#3fb950" fontSize={12} textAnchor="middle" fontWeight="bold" opacity={0}>
        <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1s" fill="freeze" />
        ✓ Ambos transmiten en paralelo, sin colisiones
      </text>
    </>
  );
}

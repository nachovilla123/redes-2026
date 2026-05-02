"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame } from "./AnimationFrame";

type Mode = "saw" | "gbn";

export function ArqComparison() {
  const [mode, setMode] = useState<Mode>("saw");
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  function reset() {
    cancelRef.current = true;
    setRunning(false);
    setTick((t) => t + 1);
    setTimeout(() => {
      cancelRef.current = false;
    }, 100);
  }

  function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setTick((t) => t + 1);
    // The animation is purely SVG <animate> based, so we just rerun for the duration
    setTimeout(() => {
      if (!cancelRef.current) setRunning(false);
    }, mode === "saw" ? 9000 : 5500);
  }

  const captions: Record<Mode, string> = {
    saw: "Stop-and-Wait: el transmisor manda 1 paquete, espera el ACK, recién entonces manda el siguiente. Canal vacío la mayor parte del tiempo.",
    gbn: "Go-Back-N (ventana de 4): el transmisor manda hasta N sin esperar. ACKs vienen en paralelo. Mucho más eficiente.",
  };

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{captions[mode]}</p>
          <p className="text-slate-500">Cambiá entre los dos modos para comparar.</p>
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => {
              setMode("saw");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "saw" ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Stop-and-Wait
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("gbn");
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "gbn" ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Go-Back-N
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setTimeout(play, 200);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
          >
            Reproducir
          </button>
        </>
      }
    >
      <svg key={`${mode}-${tick}`} viewBox="0 0 700 480" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Endpoints */}
        <rect x={50} y={20} width={130} height={40} rx={6} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={115} y={45} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">TX</text>
        <rect x={520} y={20} width={130} height={40} rx={6} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={585} y={45} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">RX</text>

        <line x1={115} y1={60} x2={115} y2={470} stroke="#475569" strokeDasharray="3 3" />
        <line x1={585} y1={60} x2={585} y2={470} stroke="#475569" strokeDasharray="3 3" />

        <text x={350} y={478} fill="#64748b" fontSize={10} textAnchor="middle">tiempo →</text>

        {mode === "saw" ? <SawAnim /> : <GbnAnim />}
      </svg>
    </AnimationFrame>
  );
}

function SawAnim() {
  // 4 packets, each takes ~2s round-trip
  const items = [];
  for (let i = 0; i < 4; i++) {
    const yPkt = 90 + i * 90;
    const yAck = yPkt + 35;
    const startDelay = i * 2;
    items.push(
      <g key={`p${i}`}>
        {/* Packet TX -> RX */}
        <circle r={8} fill="#58a6ff" opacity={0}>
          <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
          <animate attributeName="cx" from={115} to={585} dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
          <animate attributeName="cy" from={yPkt} to={yPkt + 30} dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
        </circle>
        <text x={350} y={yPkt - 5} fill="#58a6ff" fontSize={11} textAnchor="middle" fontWeight="bold" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
          P{i + 1}
        </text>

        {/* ACK RX -> TX */}
        <circle r={6} fill="#3fb950" opacity={0}>
          <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin={`${startDelay + 1}s`} fill="freeze" />
          <animate attributeName="cx" from={585} to={115} dur="0.9s" begin={`${startDelay + 1}s`} fill="freeze" />
          <animate attributeName="cy" from={yAck} to={yAck + 30} dur="0.9s" begin={`${startDelay + 1}s`} fill="freeze" />
        </circle>
        <text x={350} y={yAck + 38} fill="#3fb950" fontSize={10} textAnchor="middle" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin={`${startDelay + 1}s`} fill="freeze" />
          ACK{i + 1}
        </text>
      </g>
    );
  }
  return <>{items}</>;
}

function GbnAnim() {
  // Send 4 packets back-to-back, then 4 ACKs come back
  const pkts = [];
  for (let i = 0; i < 4; i++) {
    const yPkt = 90 + i * 25;
    const yAck = 220 + i * 25;
    const startDelay = i * 0.3;
    pkts.push(
      <g key={`gp${i}`}>
        <circle r={7} fill="#58a6ff" opacity={0}>
          <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
          <animate attributeName="cx" from={115} to={585} dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
          <animate attributeName="cy" from={yPkt} to={yPkt + 100} dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
        </circle>
        <text x={350} y={yPkt + 50} fill="#58a6ff" fontSize={10} textAnchor="middle" fontWeight="bold" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin={`${startDelay}s`} fill="freeze" />
          P{i + 1}
        </text>
        <circle r={5} fill="#3fb950" opacity={0}>
          <animate attributeName="opacity" values="0;1;1;0" dur="0.9s" begin={`${startDelay + 1.5}s`} fill="freeze" />
          <animate attributeName="cx" from={585} to={115} dur="0.9s" begin={`${startDelay + 1.5}s`} fill="freeze" />
          <animate attributeName="cy" from={yAck} to={yAck + 80} dur="0.9s" begin={`${startDelay + 1.5}s`} fill="freeze" />
        </circle>
        <text x={350} y={yAck + 100} fill="#3fb950" fontSize={9} textAnchor="middle" opacity={0}>
          <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin={`${startDelay + 1.5}s`} fill="freeze" />
          ACK{i + 1}
        </text>
      </g>
    );
  }

  // Window indicator
  return (
    <>
      <rect x={20} y={75} width={70} height={120} fill="#fbbf24" opacity={0.1} stroke="#fbbf24" strokeDasharray="4 2" />
      <text x={55} y={205} fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight="bold">
        ventana N=4
      </text>
      {pkts}
    </>
  );
}

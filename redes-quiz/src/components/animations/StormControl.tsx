"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const THRESHOLD = 60; // % de utilización del enlace

export function StormControl() {
  const [enabled, setEnabled] = useState(false);
  const [level, setLevel] = useState(0); // 0..100 (% del enlace usado por broadcast)
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setRunning(false);
    setLevel(0);
    setTick((t) => t + 1);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setLevel(0);
    setTick((t) => t + 1);

    // Ramp up to 95% over ~3s
    const start = performance.now();
    const dur = 3500;
    function frame(now: number) {
      if (cancelRef.current) return;
      const t = Math.min((now - start) / dur, 1);
      // Ease-in then plateau
      const eased = t < 0.7 ? (t / 0.7) * 95 : 95;
      setLevel(eased);
      if (t < 1) requestAnimationFrame(frame);
      else setRunning(false);
    }
    requestAnimationFrame(frame);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  // Effective traffic that reaches the network
  const exceedsThreshold = level > THRESHOLD;
  const effectiveLevel = enabled && exceedsThreshold ? THRESHOLD : level;
  const dropped = enabled && exceedsThreshold ? level - THRESHOLD : 0;
  const networkSaturated = !enabled && level > 80;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {enabled
              ? exceedsThreshold
                ? `🛡️ Storm Control activo: descarta el exceso por encima del ${THRESHOLD}%. La red sigue funcionando.`
                : "Tráfico de broadcast normal — debajo del umbral, todo pasa."
              : networkSaturated
              ? "🌊 Tormenta de broadcast: la red se satura, los demás dispositivos no pueden comunicarse."
              : "Sin Storm Control. Mirá qué pasa cuando el broadcast crece descontroladamente."}
          </p>
          <p className="text-slate-500 text-xs">
            Tráfico de broadcast actual: {level.toFixed(0)}% del enlace
            {enabled && ` · Umbral: ${THRESHOLD}%`}
            {dropped > 0 && ` · Descartado: ${dropped.toFixed(0)}%`}
          </p>
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => {
              setEnabled(false);
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              !enabled ? "bg-red-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Sin Storm Control
          </button>
          <button
            type="button"
            onClick={() => {
              setEnabled(true);
              reset();
              setTimeout(play, 200);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              enabled ? "bg-green-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Con Storm Control
          </button>
          <PlayButton running={running} onPlay={play} onReset={reset} />
        </>
      }
    >
      <svg key={`${enabled}-${tick}`} viewBox="0 0 800 420" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Faulty device generating storm */}
        <rect x={20} y={170} width={130} height={60} rx={8} fill="#1e293b" stroke="#f85149" strokeWidth={2} />
        <text x={85} y={195} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">PC infectada</text>
        <text x={85} y={213} fill="#f85149" fontSize={10} textAnchor="middle">manda broadcast</text>

        {/* Switch */}
        <rect x={310} y={140} width={180} height={120} rx={10} fill="#1e293b" stroke={enabled ? "#3fb950" : "#fbbf24"} strokeWidth={2.5} />
        <text x={400} y={170} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">SWITCH</text>
        {enabled && (
          <>
            <text x={400} y={190} fill="#3fb950" fontSize={10} textAnchor="middle" fontWeight="bold">Storm Control ON</text>
            <text x={400} y={205} fill="#3fb950" fontSize={9} textAnchor="middle">umbral: {THRESHOLD}%</text>
          </>
        )}
        {!enabled && (
          <text x={400} y={190} fill="#f59e0b" fontSize={10} textAnchor="middle">sin protección</text>
        )}

        {/* Other devices */}
        {[
          { name: "PC-B", y: 90 },
          { name: "PC-C", y: 280 },
          { name: "PC-D", y: 350 },
        ].map((d, i) => {
          const stressed = networkSaturated;
          return (
            <g key={d.name}>
              <rect
                x={650}
                y={d.y}
                width={130}
                height={50}
                rx={6}
                fill={stressed ? "#f8514922" : "#1e293b"}
                stroke={stressed ? "#f85149" : "#3fb950"}
                strokeWidth={2}
              />
              <text x={715} y={d.y + 22} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">{d.name}</text>
              <text x={715} y={d.y + 38} fill={stressed ? "#f85149" : "#3fb950"} fontSize={9} textAnchor="middle">
                {stressed ? "saturada" : "ok"}
              </text>
            </g>
          );
        })}

        {/* Lines */}
        <line x1={150} y1={200} x2={310} y2={200} stroke="#475569" strokeWidth={2} />
        <line x1={490} y1={200} x2={650} y2={115} stroke="#475569" strokeWidth={1.5} />
        <line x1={490} y1={200} x2={650} y2={305} stroke="#475569" strokeWidth={1.5} />
        <line x1={490} y1={200} x2={650} y2={375} stroke="#475569" strokeWidth={1.5} />

        {/* Incoming traffic bar (left of switch) */}
        <g transform="translate(160, 280)">
          <rect width={140} height={20} rx={3} fill="#1e293b" stroke="#475569" />
          <rect width={(level / 100) * 140} height={20} rx={3} fill={level > 80 ? "#f85149" : level > 50 ? "#fbbf24" : "#3fb950"} />
          <text x={70} y={14} fill="#fff" fontSize={10} textAnchor="middle" fontWeight="bold">
            entrada: {level.toFixed(0)}%
          </text>
        </g>

        {/* Outgoing traffic bar (right of switch) */}
        <g transform="translate(500, 280)">
          <rect width={140} height={20} rx={3} fill="#1e293b" stroke="#475569" />
          <rect width={(effectiveLevel / 100) * 140} height={20} rx={3} fill={effectiveLevel > 80 ? "#f85149" : effectiveLevel > 50 ? "#fbbf24" : "#3fb950"} />
          <text x={70} y={14} fill="#fff" fontSize={10} textAnchor="middle" fontWeight="bold">
            salida: {effectiveLevel.toFixed(0)}%
          </text>
        </g>

        {/* Threshold marker on outgoing */}
        {enabled && (
          <g transform={`translate(${500 + (THRESHOLD / 100) * 140}, 270)`}>
            <line x1={0} y1={0} x2={0} y2={40} stroke="#3fb950" strokeWidth={2} strokeDasharray="3 3" />
            <text x={5} y={50} fill="#3fb950" fontSize={9}>{THRESHOLD}%</text>
          </g>
        )}

        {/* Drop visualization when storm control trims */}
        {enabled && dropped > 0 && (
          <g transform="translate(400, 320)">
            <text x={0} y={0} fill="#f85149" fontSize={11} textAnchor="middle" fontWeight="bold">
              ✂ {dropped.toFixed(0)}% descartado
            </text>
          </g>
        )}

        {/* Animated broadcast bursts during play */}
        {running && (
          <>
            {[0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4].map((delay, i) => (
              <circle key={`pkt-${i}-${tick}`} r={5} fill="#f85149">
                <animate attributeName="cx" from={150} to={310} dur="0.8s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cy" from={200} to={200} dur="0.8s" begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </>
        )}

        {/* Network status text */}
        {networkSaturated && (
          <text x={400} y={395} fill="#f85149" fontSize={13} textAnchor="middle" fontWeight="bold">
            💥 Red saturada — los demás hosts no pueden comunicarse
          </text>
        )}
        {enabled && exceedsThreshold && (
          <text x={400} y={395} fill="#3fb950" fontSize={13} textAnchor="middle" fontWeight="bold">
            ✓ Red protegida — el resto sigue funcionando
          </text>
        )}
      </svg>
    </AnimationFrame>
  );
}

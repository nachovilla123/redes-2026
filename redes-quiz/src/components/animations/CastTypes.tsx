"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame } from "./AnimationFrame";

type CastMode = "unicast" | "multicast" | "broadcast";

const HOSTS = [
  { id: 0, x: 120, y: 70 },
  { id: 1, x: 400, y: 50, isSource: true },
  { id: 2, x: 680, y: 70 },
  { id: 3, x: 120, y: 250 },
  { id: 4, x: 400, y: 280 },
  { id: 5, x: 680, y: 250 },
];

const MODES: Record<CastMode, { color: string; label: string; targets: number[]; description: string }> = {
  unicast: {
    color: "#58a6ff",
    label: "Unicast — un solo destino",
    targets: [4],
    description: "El paquete va a UN host específico. Es el modo más común. Se direcciona con la MAC del destino.",
  },
  multicast: {
    color: "#3fb950",
    label: "Multicast — grupo suscripto",
    targets: [0, 4, 5],
    description: "Va solo a los hosts que se suscribieron al grupo. Eficiente para streaming, video conferencias.",
  },
  broadcast: {
    color: "#f85149",
    label: "Broadcast — todos en la LAN",
    targets: [0, 2, 3, 4, 5],
    description: "Llega a TODOS los hosts de la LAN. Dirección destino: FF:FF:FF:FF:FF:FF.",
  },
};

export function CastTypes() {
  const [mode, setMode] = useState<CastMode>("unicast");
  const [animating, setAnimating] = useState(false);
  const [activeTargets, setActiveTargets] = useState<number[]>([]);
  const [tick, setTick] = useState(0); // forces re-render to play animation
  const animRef = useRef<number | null>(null);

  const source = HOSTS.find((h) => h.isSource)!;

  function play(m: CastMode) {
    setMode(m);
    setActiveTargets([]);
    setTick((t) => t + 1);
    setAnimating(true);
    const targets = MODES[m].targets;
    setTimeout(() => {
      setActiveTargets(targets);
      setTimeout(() => setAnimating(false), 1200);
    }, 100);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const m = MODES[mode];

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{m.label}</p>
          <p className="text-slate-500">{m.description}</p>
        </div>
      }
      controls={
        <>
          {(["unicast", "multicast", "broadcast"] as CastMode[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => play(c)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mode === c
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {c === "unicast" ? "Unicast" : c === "multicast" ? "Multicast" : "Broadcast"}
            </button>
          ))}
        </>
      }
    >
      <svg viewBox="0 0 800 360" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* LAN box */}
        <rect x={20} y={20} width={760} height={320} rx={12} fill="none" stroke="#334155" strokeDasharray="6 4" />
        <text x={40} y={40} fill="#64748b" fontSize={11} fontFamily="monospace">LAN</text>

        {/* Hosts */}
        {HOSTS.map((h) => {
          const isActive = activeTargets.includes(h.id);
          const isSource = h.isSource;
          const fill = isSource ? "#fbbf24" : isActive ? m.color : "#1e293b";
          const stroke = isSource ? "#fbbf24" : isActive ? m.color : "#475569";
          return (
            <g key={h.id}>
              <rect x={h.x - 35} y={h.y - 20} width={70} height={40} rx={6} fill={fill + "33"} stroke={stroke} strokeWidth={2} />
              <text x={h.x} y={h.y + 4} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">
                {isSource ? "SRC" : `H${h.id}`}
              </text>
              {isActive && !isSource && (
                <text x={h.x} y={h.y + 36} fill={m.color} fontSize={10} textAnchor="middle" fontWeight="bold">
                  ✓ recibió
                </text>
              )}
            </g>
          );
        })}

        {/* Animated packets to each target */}
        {animating &&
          MODES[mode].targets.map((targetId) => {
            const target = HOSTS.find((h) => h.id === targetId);
            if (!target) return null;
            return (
              <g key={`${tick}-${targetId}`}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={m.color}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  opacity={0.5}
                />
                <circle r={6} fill={m.color}>
                  <animate
                    attributeName="cx"
                    from={source.x}
                    to={target.x}
                    dur="1s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="cy"
                    from={source.y}
                    to={target.y}
                    dur="1s"
                    fill="freeze"
                  />
                </circle>
              </g>
            );
          })}
      </svg>
    </AnimationFrame>
  );
}

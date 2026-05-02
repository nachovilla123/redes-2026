"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const SWITCHES = [
  { id: "S1", x: 400, y: 80, root: true },
  { id: "S2", x: 200, y: 250 },
  { id: "S3", x: 600, y: 250 },
  { id: "S4", x: 400, y: 380 },
];

const LINKS = [
  { from: "S1", to: "S2" },
  { from: "S1", to: "S3" },
  { from: "S2", to: "S4" },
  { from: "S3", to: "S4" },
  { from: "S2", to: "S3", blocked: true }, // this one gets blocked by STP
];

type Phase = "loop" | "elect" | "blocked";

export function SpanningTree() {
  const [phase, setPhase] = useState<Phase>("loop");
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setPhase("loop");
    setRunning(false);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setPhase("loop");
    await sleep(2500);
    if (cancelRef.current) return;
    setPhase("elect");
    await sleep(2200);
    if (cancelRef.current) return;
    setPhase("blocked");
    await sleep(800);
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const captions: Record<Phase, string> = {
    loop:
      "Topología con enlaces redundantes (necesarios para tolerancia a fallos). Sin STP, un broadcast crea bucles infinitos que colapsan la red.",
    elect:
      "STP elige un Switch RAÍZ (el de menor Bridge ID). Cada otro switch calcula su camino más corto al raíz mediante BPDUs.",
    blocked:
      "STP bloquea los puertos redundantes para formar un árbol sin ciclos. Si un enlace activo falla, los bloqueados se reactivan automáticamente.",
  };

  function getSwitch(id: string) {
    return SWITCHES.find((s) => s.id === id)!;
  }

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{captions[phase]}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 460" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Links */}
        {LINKS.map((l, i) => {
          const a = getSwitch(l.from);
          const b = getSwitch(l.to);
          const isBlocked = phase === "blocked" && l.blocked;
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isBlocked ? "#475569" : phase === "loop" ? "#f85149" : "#3fb950"}
                strokeWidth={isBlocked ? 2 : 3}
                strokeDasharray={isBlocked ? "8 4" : "0"}
              />
              {isBlocked && (
                <g transform={`translate(${(a.x + b.x) / 2}, ${(a.y + b.y) / 2})`}>
                  <circle r={14} fill="#f85149" />
                  <text y={5} fill="#fff" fontSize={11} textAnchor="middle" fontWeight="bold">
                    🚫
                  </text>
                  <text y={28} fill="#f85149" fontSize={9} textAnchor="middle" fontWeight="bold">
                    BLOQUEADO
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Looping packet during phase=loop */}
        {phase === "loop" && (
          <>
            <circle r={8} fill="#fbbf24">
              <animateMotion
                dur="2.5s"
                repeatCount="indefinite"
                path="M 400 80 L 200 250 L 600 250 L 400 80"
              />
            </circle>
            <circle r={8} fill="#fbbf24" opacity={0.7}>
              <animateMotion
                dur="2.5s"
                begin="0.8s"
                repeatCount="indefinite"
                path="M 400 80 L 600 250 L 200 250 L 400 80"
              />
            </circle>
            <text x={400} y={440} fill="#f85149" fontSize={12} textAnchor="middle" fontWeight="bold">
              🌀 broadcast loop infinito
            </text>
          </>
        )}

        {/* Switches */}
        {SWITCHES.map((s) => {
          const isRoot = phase !== "loop" && s.root;
          return (
            <g key={s.id} transform={`translate(${s.x}, ${s.y})`}>
              <circle r={32} fill="#1e293b" stroke={isRoot ? "#fbbf24" : "#6366f1"} strokeWidth={isRoot ? 4 : 2} />
              <text y={-2} fill="#fff" fontSize={13} fontWeight="bold" textAnchor="middle">
                {s.id}
              </text>
              <text y={14} fill={isRoot ? "#fbbf24" : "#94a3b8"} fontSize={9} textAnchor="middle">
                {isRoot ? "👑 ROOT" : "switch"}
              </text>
            </g>
          );
        })}

        {/* BPDU election visuals */}
        {phase === "elect" && (
          <>
            {SWITCHES.filter((s) => !s.root).map((s) => (
              <line
                key={s.id}
                x1={400}
                y1={80}
                x2={s.x}
                y2={s.y}
                stroke="#fbbf24"
                strokeWidth={2}
                strokeDasharray="4 2"
                opacity={0.6}
              >
                <animate attributeName="stroke-dashoffset" from={0} to={-12} dur="0.6s" repeatCount="indefinite" />
              </line>
            ))}
            <text x={400} y={440} fill="#fbbf24" fontSize={12} textAnchor="middle" fontWeight="bold">
              📡 BPDUs eligiendo el camino más corto al ROOT
            </text>
          </>
        )}

        {phase === "blocked" && (
          <text x={400} y={440} fill="#3fb950" fontSize={12} textAnchor="middle" fontWeight="bold">
            ✓ Árbol activo, sin ciclos. Si falla un enlace, S2↔S3 se reactiva.
          </text>
        )}
      </svg>
    </AnimationFrame>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

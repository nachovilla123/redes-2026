"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const ROUTERS = [
  { id: "R1", x: 150, y: 200 },
  { id: "R2", x: 400, y: 100 },
  { id: "R3", x: 650, y: 200 },
];

const ROUTING_TABLES: Record<string, { net: string; nextHop: string; iface: string }[]> = {
  R1: [
    { net: "10.0.1.0/24", nextHop: "—", iface: "eth0" },
    { net: "10.0.2.0/24", nextHop: "R2", iface: "eth1" },
    { net: "10.0.3.0/24", nextHop: "R2", iface: "eth1" },
  ],
  R2: [
    { net: "10.0.1.0/24", nextHop: "R1", iface: "eth0" },
    { net: "10.0.2.0/24", nextHop: "—", iface: "eth1" },
    { net: "10.0.3.0/24", nextHop: "R3", iface: "eth2" },
  ],
  R3: [
    { net: "10.0.1.0/24", nextHop: "R2", iface: "eth0" },
    { net: "10.0.2.0/24", nextHop: "R2", iface: "eth0" },
    { net: "10.0.3.0/24", nextHop: "—", iface: "eth1" },
  ],
};

type Phase = "idle" | "at-r1" | "to-r2" | "at-r2" | "to-r3" | "at-r3" | "delivered";

export function RoutingTable() {
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
    const sequence: Phase[] = ["at-r1", "to-r2", "at-r2", "to-r3", "at-r3", "delivered"];
    for (const p of sequence) {
      if (cancelRef.current) return;
      setPhase(p);
      await sleep(p.startsWith("to-") ? 1300 : 1500);
    }
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const captions: Record<Phase, string> = {
    idle: "Un paquete con destino 10.0.3.50 entra a la red por R1.",
    "at-r1": "R1 busca 10.0.3.0/24 en su tabla → next-hop R2 vía eth1.",
    "to-r2": "Paquete viaja por el enlace R1 → R2.",
    "at-r2": "R2 busca 10.0.3.0/24 → next-hop R3 vía eth2.",
    "to-r3": "Paquete viaja por el enlace R2 → R3.",
    "at-r3": "R3 ve que 10.0.3.0/24 está directamente conectado → entrega.",
    delivered: "✓ Paquete entregado al host destino. Cada router tomó UNA decisión local sin saber el camino completo.",
  };

  const activeRouter: string | null =
    phase === "at-r1" ? "R1" : phase === "at-r2" ? "R2" : phase === "at-r3" ? "R3" : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{captions[phase]}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <svg viewBox="0 0 800 380" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
          {/* Networks (clouds) */}
          <ellipse cx={50} cy={300} rx={50} ry={30} fill="#3fb95022" stroke="#3fb950" strokeWidth={1.5} />
          <text x={50} y={295} fill="#3fb950" fontSize={10} textAnchor="middle" fontWeight="bold">10.0.1.0/24</text>
          <text x={50} y={310} fill="#3fb950" fontSize={9} textAnchor="middle">origen</text>

          <ellipse cx={750} cy={300} rx={50} ry={30} fill="#f8514922" stroke="#f85149" strokeWidth={1.5} />
          <text x={750} y={295} fill="#f85149" fontSize={10} textAnchor="middle" fontWeight="bold">10.0.3.0/24</text>
          <text x={750} y={310} fill="#f85149" fontSize={9} textAnchor="middle">destino</text>

          {/* Links */}
          <line x1={50} y1={270} x2={150} y2={220} stroke="#475569" strokeWidth={1.5} />
          <line x1={150} y1={200} x2={400} y2={100} stroke="#475569" strokeWidth={1.5} />
          <line x1={400} y1={100} x2={650} y2={200} stroke="#475569" strokeWidth={1.5} />
          <line x1={650} y1={220} x2={750} y2={270} stroke="#475569" strokeWidth={1.5} />

          {/* Routers */}
          {ROUTERS.map((r) => {
            const isActive = activeRouter === r.id;
            return (
              <g key={r.id}>
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={isActive ? 36 : 30}
                  fill="#1e293b"
                  stroke={isActive ? "#fbbf24" : "#6366f1"}
                  strokeWidth={isActive ? 3 : 2}
                />
                <text x={r.x} y={r.y + 5} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">
                  {r.id}
                </text>
              </g>
            );
          })}

          {/* Animated packet */}
          {phase === "to-r2" && (
            <circle r={9} fill="#fbbf24">
              <animate attributeName="cx" from={150} to={400} dur="1.2s" fill="freeze" />
              <animate attributeName="cy" from={200} to={100} dur="1.2s" fill="freeze" />
            </circle>
          )}
          {phase === "to-r3" && (
            <circle r={9} fill="#fbbf24">
              <animate attributeName="cx" from={400} to={650} dur="1.2s" fill="freeze" />
              <animate attributeName="cy" from={100} to={200} dur="1.2s" fill="freeze" />
            </circle>
          )}
          {phase === "delivered" && (
            <circle r={9} fill="#3fb950">
              <animate attributeName="cx" from={650} to={750} dur="0.8s" fill="freeze" />
              <animate attributeName="cy" from={200} to={300} dur="0.8s" fill="freeze" />
            </circle>
          )}

          {/* Header */}
          {phase !== "idle" && (
            <g>
              <rect x={300} y={350} width={200} height={20} rx={3} fill="#1e293b" stroke="#fbbf24" strokeWidth={1} />
              <text x={400} y={364} fill="#fbbf24" fontSize={10} textAnchor="middle" fontFamily="monospace">
                dst: 10.0.3.50
              </text>
            </g>
          )}
        </svg>

        {/* Routing tables */}
        <div className="space-y-2">
          {ROUTERS.map((r) => {
            const isActive = activeRouter === r.id;
            return (
              <div
                key={r.id}
                className={`bg-slate-900 rounded-lg p-3 border transition-all ${
                  isActive ? "border-amber-400 shadow-lg shadow-amber-500/20" : "border-slate-800"
                }`}
              >
                <p className="text-xs font-bold mb-1.5" style={{ color: isActive ? "#fbbf24" : "#94a3b8" }}>
                  Tabla de {r.id}
                </p>
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800">
                      <th className="text-left pb-0.5">Red</th>
                      <th className="text-left pb-0.5">Next-hop</th>
                      <th className="text-left pb-0.5">If</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROUTING_TABLES[r.id].map((row, i) => {
                      const dstNet = "10.0.3.0/24";
                      const isMatched = isActive && row.net === dstNet;
                      return (
                        <tr key={i} className={isMatched ? "bg-amber-500/20 text-amber-300" : "text-slate-300"}>
                          <td className="py-0.5">{row.net}</td>
                          <td className="py-0.5 text-blue-300">{row.nextHop}</td>
                          <td className="py-0.5 text-slate-500">{row.iface}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    </AnimationFrame>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

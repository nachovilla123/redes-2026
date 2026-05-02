"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const APPS = [
  { port: 443, name: "Chrome (HTTPS)", color: "#3fb950", icon: "🌐" },
  { port: 22, name: "SSH server", color: "#fbbf24", icon: "🔑" },
  { port: 4070, name: "Spotify", color: "#a371f7", icon: "🎵" },
  { port: 53, name: "DNS resolver", color: "#ec4899", icon: "🏷️" },
];

type Phase = "idle" | "incoming" | "delivered";

export function Ports() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetPort, setTargetPort] = useState<number>(443);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setPhase("idle");
    setRunning(false);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function send(port: number) {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setTargetPort(port);
    setPhase("incoming");
    await sleep(1500);
    if (cancelRef.current) return;
    setPhase("delivered");
    await sleep(1200);
    if (!cancelRef.current) {
      setPhase("idle");
      setRunning(false);
    }
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const target = APPS.find((a) => a.port === targetPort)!;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            La <b>IP</b> identifica el edificio (la PC). El <b>puerto</b> identifica el departamento (la app dentro de la PC).
          </p>
          <p className="text-slate-500 text-xs">
            {phase === "incoming" && `Entrando paquete con destino IP:${targetPort} → SO lo entrega a ${target.name}`}
            {phase === "delivered" && `${target.icon} ${target.name} recibe el paquete por el puerto ${targetPort}`}
            {phase === "idle" && "Tocá un puerto para ver cómo el SO entrega los paquetes a la app correcta."}
          </p>
        </div>
      }
      controls={
        <>
          <span className="text-xs text-slate-500 mr-2">Enviar a puerto:</span>
          {APPS.map((a) => (
            <button
              key={a.port}
              type="button"
              onClick={() => send(a.port)}
              disabled={running}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors disabled:opacity-50"
              style={{
                background: a.color + "33",
                color: a.color,
                border: `1px solid ${a.color}`,
              }}
            >
              :{a.port}
            </button>
          ))}
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
          >
            Reset
          </button>
        </>
      }
    >
      <svg viewBox="0 0 800 460" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Building */}
        <rect x={250} y={60} width={400} height={380} rx={14} fill="#0f172a" stroke="#58a6ff" strokeWidth={2.5} />
        <text x={450} y={45} fill="#58a6ff" fontSize={13} textAnchor="middle" fontWeight="bold" fontFamily="monospace">
          IP: 192.168.1.10
        </text>
        <text x={450} y={88} fill="#fff" fontSize={14} textAnchor="middle">tu computadora</text>

        {/* Apps with port doors */}
        {APPS.map((a, i) => {
          const y = 120 + i * 78;
          const isTarget = phase !== "idle" && a.port === targetPort;
          return (
            <g key={a.port}>
              <rect
                x={290}
                y={y}
                width={320}
                height={64}
                rx={8}
                fill={isTarget ? a.color + "44" : "#1e293b"}
                stroke={a.color}
                strokeWidth={isTarget ? 3 : 2}
                style={{ filter: isTarget ? `drop-shadow(0 0 10px ${a.color})` : undefined }}
              />
              <text x={310} y={y + 38} fill={a.color} fontSize={20} textAnchor="middle">
                {a.icon}
              </text>
              <text x={355} y={y + 30} fill={a.color} fontSize={18} fontFamily="monospace" fontWeight="bold">
                :{a.port}
              </text>
              <text x={500} y={y + 30} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">
                {a.name}
              </text>
              <text x={500} y={y + 50} fill="#94a3b8" fontSize={10} textAnchor="middle">
                escuchando en :{a.port}
              </text>

              {/* Door arrow */}
              <line x1={120} y1={y + 32} x2={290} y2={y + 32} stroke={isTarget ? a.color : "#334155"} strokeWidth={isTarget ? 2 : 1} strokeDasharray="4 3" opacity={isTarget ? 1 : 0.4} />
            </g>
          );
        })}

        {/* External label */}
        <text x={70} y={250} fill="#94a3b8" fontSize={11} textAnchor="middle">internet</text>

        {/* Animated packet */}
        {phase === "incoming" && (
          <g>
            <rect x={20} y={210} width={90} height={32} rx={4} fill={target.color} stroke="#fff" strokeWidth={1.5}>
              <animate attributeName="x" from={20} to={290} dur="1.4s" fill="freeze" />
              <animate
                attributeName="y"
                from={210}
                to={120 + APPS.findIndex((a) => a.port === targetPort) * 78 + 16}
                dur="1.4s"
                fill="freeze"
              />
            </rect>
            <text fill="#0f172a" fontSize={10} fontWeight="bold" textAnchor="middle">
              <animate attributeName="x" from={65} to={335} dur="1.4s" fill="freeze" />
              <animate
                attributeName="y"
                from={230}
                to={120 + APPS.findIndex((a) => a.port === targetPort) * 78 + 36}
                dur="1.4s"
                fill="freeze"
              />
              :{targetPort}
            </text>
          </g>
        )}
      </svg>
    </AnimationFrame>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

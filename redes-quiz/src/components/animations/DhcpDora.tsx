"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const STEPS = [
  {
    letter: "D",
    name: "DISCOVER",
    detail: "El cliente sin IP envía broadcast: '¿hay algún servidor DHCP?'",
    from: "client" as const,
    color: "#58a6ff",
    broadcast: true,
  },
  {
    letter: "O",
    name: "OFFER",
    detail: "El servidor responde ofreciendo una IP: 192.168.1.10, máscara, gateway, DNS, lease.",
    from: "server" as const,
    color: "#3fb950",
  },
  {
    letter: "R",
    name: "REQUEST",
    detail: "El cliente acepta formalmente. Es broadcast para que otros servidores DHCP liberen sus reservas.",
    from: "client" as const,
    color: "#d29922",
    broadcast: true,
  },
  {
    letter: "A",
    name: "ACK",
    detail: "El servidor confirma. Recién ahora el cliente configura su interfaz con la IP y parámetros.",
    from: "server" as const,
    color: "#a371f7",
  },
];

export function DhcpDora() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  function reset() {
    setStep(-1);
    setRunning(false);
    setPos({ x: 0, y: 0, visible: false });
  }

  async function play() {
    if (running) return;
    setRunning(true);
    if (step >= STEPS.length - 1) setStep(-1);
    let start = step + 1;
    if (start < 0) start = 0;
    for (let i = start; i < STEPS.length; i++) {
      setStep(i);
      const s = STEPS[i];
      const fromX = s.from === "client" ? 130 : 670;
      const toX = s.from === "client" ? 670 : 130;
      const yLine = 130 + i * 60;
      await animate({ x: fromX, y: yLine }, { x: toX, y: yLine }, 1000, (p) =>
        setPos({ ...p, visible: true })
      );
      setPos({ x: 0, y: 0, visible: false });
      await sleep(400);
    }
    setRunning(false);
  }

  useEffect(() => {
    return () => {};
  }, []);

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;
  const hasIP = step >= 3;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {current ? (
              <>
                <span className="font-mono font-bold mr-2" style={{ color: current.color }}>
                  {current.letter} → {current.name}
                </span>
                {current.detail}
              </>
            ) : (
              "DORA: los 4 mensajes para que un cliente nuevo obtenga IP del servidor DHCP."
            )}
          </p>
          <p className="text-slate-500">Paso {Math.max(0, step + 1)}/{STEPS.length}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Endpoints */}
        <rect x={50} y={30} width={160} height={50} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={130} y={52} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">CLIENTE</text>
        <text x={130} y={72} fill={hasIP ? "#3fb950" : "#94a3b8"} fontSize={10} fontFamily="monospace" textAnchor="middle">
          IP: {hasIP ? "192.168.1.10" : "0.0.0.0"}
        </text>

        <rect x={590} y={30} width={160} height={50} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={670} y={52} fill="#fff" fontSize={14} fontWeight="bold" textAnchor="middle">SERVIDOR DHCP</text>
        <text x={670} y={72} fill="#94a3b8" fontSize={10} fontFamily="monospace" textAnchor="middle">UDP 67</text>

        <line x1={130} y1={80} x2={130} y2={380} stroke="#475569" strokeDasharray="3 3" />
        <line x1={670} y1={80} x2={670} y2={380} stroke="#475569" strokeDasharray="3 3" />

        {/* Steps history */}
        {STEPS.map((s, i) => {
          if (i > step) return null;
          const yLine = 130 + i * 60;
          const fromX = s.from === "client" ? 130 : 670;
          const toX = s.from === "client" ? 670 : 130;
          const isAnimating = i === step && running;
          return (
            <g key={i} opacity={isAnimating ? 0.3 : 1}>
              <line x1={fromX} y1={yLine} x2={toX} y2={yLine} stroke={s.color} strokeWidth={2} strokeDasharray={s.broadcast ? "6 3" : "0"} />
              <polygon
                points={
                  s.from === "client"
                    ? `${toX},${yLine} ${toX - 8},${yLine - 5} ${toX - 8},${yLine + 5}`
                    : `${toX},${yLine} ${toX + 8},${yLine - 5} ${toX + 8},${yLine + 5}`
                }
                fill={s.color}
              />
              <rect x={400 - 75} y={yLine - 14} width={150} height={20} rx={4} fill="#0f172a" stroke={s.color} strokeWidth={1} />
              <text x={400} y={yLine} fill={s.color} fontSize={11} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                {s.letter} · {s.name}
                {s.broadcast && " 📢"}
              </text>
            </g>
          );
        })}

        {/* Animated packet */}
        {pos.visible && current && (
          <g>
            <circle cx={pos.x} cy={pos.y} r={12} fill={current.color} stroke="#fff" strokeWidth={2} />
            <text x={pos.x} y={pos.y + 4} fill="#0f172a" fontSize={11} textAnchor="middle" fontWeight="bold">
              {current.letter}
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

function animate(
  from: { x: number; y: number },
  to: { x: number; y: number },
  duration: number,
  setPos: (p: { x: number; y: number }) => void
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1);
      setPos({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

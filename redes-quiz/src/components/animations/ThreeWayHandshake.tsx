"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Step = {
  from: "client" | "server";
  label: string;
  detail: string;
  color: string;
  clientState: string;
  serverState: string;
};

const STEPS: Step[] = [
  {
    from: "client",
    label: "SYN, Seq=X",
    detail: "El cliente abre la conexión y envía su número de secuencia inicial.",
    color: "#58a6ff",
    clientState: "SYN_SENT",
    serverState: "LISTEN",
  },
  {
    from: "server",
    label: "SYN+ACK, Seq=Y, Ack=X+1",
    detail: "El servidor confirma el SYN del cliente (Ack=X+1) y manda su propio SYN (Seq=Y).",
    color: "#3fb950",
    clientState: "SYN_SENT",
    serverState: "SYN_RCVD",
  },
  {
    from: "client",
    label: "ACK, Seq=X+1, Ack=Y+1",
    detail: "El cliente confirma el SYN del servidor. Conexión ESTABLISHED en ambos lados.",
    color: "#d29922",
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
  },
];

export function ThreeWayHandshake() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [packetPos, setPacketPos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const animRef = useRef<number | null>(null);

  function reset() {
    setStep(-1);
    setRunning(false);
    setPacketPos({ x: 0, y: 0, visible: false });
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  async function play() {
    if (running) return;
    setRunning(true);
    if (step >= STEPS.length - 1) setStep(-1);
    let start = step + 1;
    if (start < 0) start = 0;
    for (let i = start; i < STEPS.length; i++) {
      setStep(i);
      const s = STEPS[i];
      const fromX = s.from === "client" ? 130 : 600;
      const toX = s.from === "client" ? 600 : 130;
      const yLine = 130 + i * 80;
      await animateAlong(
        { x: fromX, y: yLine },
        { x: toX, y: yLine },
        900,
        (p) => setPacketPos({ ...p, visible: true })
      );
      setPacketPos({ x: 0, y: 0, visible: false });
      await sleep(400);
    }
    setRunning(false);
  }

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{current ? current.detail : "Antes de mandar datos, TCP negocia la conexión con tres mensajes."}</p>
          <p className="text-slate-500">Paso {Math.max(0, step + 1)}/{STEPS.length}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 730 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Endpoints */}
        <rect x={50} y={30} width={160} height={50} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={130} y={55} fill="#fff" fontSize={15} fontWeight="bold" textAnchor="middle">CLIENTE</text>
        <text x={130} y={72} fill="#58a6ff" fontSize={11} textAnchor="middle" fontFamily="monospace">
          {current?.clientState ?? "LISTEN"}
        </text>

        <rect x={520} y={30} width={160} height={50} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={600} y={55} fill="#fff" fontSize={15} fontWeight="bold" textAnchor="middle">SERVIDOR</text>
        <text x={600} y={72} fill="#3fb950" fontSize={11} textAnchor="middle" fontFamily="monospace">
          {current?.serverState ?? "LISTEN"}
        </text>

        {/* Time lines */}
        <line x1={130} y1={80} x2={130} y2={380} stroke="#475569" strokeDasharray="3 3" />
        <line x1={600} y1={80} x2={600} y2={380} stroke="#475569" strokeDasharray="3 3" />

        {/* Show all completed step arrows */}
        {STEPS.map((s, i) => {
          if (i > step) return null;
          const yLine = 130 + i * 80;
          const fromX = s.from === "client" ? 130 : 600;
          const toX = s.from === "client" ? 600 : 130;
          const isLast = i === step && running;
          return (
            <g key={i} opacity={isLast ? 0.4 : 1}>
              <line x1={fromX} y1={yLine} x2={toX} y2={yLine} stroke={s.color} strokeWidth={2} />
              <polygon
                points={
                  s.from === "client"
                    ? `${toX},${yLine} ${toX - 8},${yLine - 5} ${toX - 8},${yLine + 5}`
                    : `${toX},${yLine} ${toX + 8},${yLine - 5} ${toX + 8},${yLine + 5}`
                }
                fill={s.color}
              />
              <rect x={365 - 100} y={yLine - 18} width={200} height={20} rx={4} fill="#0f172a" stroke={s.color} strokeWidth={1} />
              <text x={365} y={yLine - 4} fill={s.color} fontSize={11} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                {s.label}
              </text>
            </g>
          );
        })}

        {/* Animated packet */}
        {packetPos.visible && current && (
          <g>
            <circle cx={packetPos.x} cy={packetPos.y} r={10} fill={current.color} stroke="#fff" strokeWidth={2} />
            <text x={packetPos.x} y={packetPos.y - 16} fill={current.color} fontSize={11} textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              {current.label}
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

function animateAlong(
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

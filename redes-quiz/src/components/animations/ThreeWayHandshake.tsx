"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

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

  function reset() {
    setStep(-1);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  useEffect(() => {
    if (!running) return;
    if (step >= STEPS.length - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1700);
    return () => clearTimeout(t);
  }, [running, step]);

  function auto() {
    if (running) return;
    if (step >= STEPS.length - 1) setStep(-1);
    setRunning(true);
    setStep((s) => (s < 0 ? 0 : s + 1));
  }

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{current ? current.detail : "Antes de mandar datos, TCP negocia la conexión con tres mensajes. Apretá Siguiente paso para avanzar a tu ritmo."}</p>
          <p className="text-slate-500">Paso {Math.max(0, step + 1)}/{STEPS.length}</p>
        </div>
      }
      controls={
        <StepControls
          step={step < 0 ? 0 : step}
          total={STEPS.length}
          onNext={next}
          onPrev={prev}
          onAuto={auto}
          onReset={reset}
          running={running}
        />
      }
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
          return (
            <g key={i}>
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
      </svg>
    </AnimationFrame>
  );
}

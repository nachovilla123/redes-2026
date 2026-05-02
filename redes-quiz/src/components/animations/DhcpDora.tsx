"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

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

  function reset() {
    setStep(-1);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function pause() { setRunning(false); }
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
              "DORA: los 4 mensajes para que un cliente nuevo obtenga IP del servidor DHCP. Apretá Siguiente paso para avanzar a tu ritmo."
            )}
          </p>
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
          onPause={pause}
          onReset={reset}
          running={running}
        />
      }
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
          return (
            <g key={i}>
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
      </svg>
    </AnimationFrame>
  );
}

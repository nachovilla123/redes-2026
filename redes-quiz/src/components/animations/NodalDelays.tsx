"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton , sleep} from "./AnimationFrame";

type Phase = "idle" | "processing" | "queueing" | "transmitting" | "propagating" | "done";

const PHASES: { id: Phase; name: string; detail: string; color: string }[] = [
  {
    id: "processing",
    name: "1. Procesamiento",
    detail: "El router examina el header del paquete y decide por qué interfaz reenviarlo. Es el más rápido (microsegundos).",
    color: "#a371f7",
  },
  {
    id: "queueing",
    name: "2. Cola (queueing)",
    detail: "El paquete espera en el buffer de salida si hay otros paquetes adelante. Variable según la congestión.",
    color: "#fbbf24",
  },
  {
    id: "transmitting",
    name: "3. Transmisión",
    detail: "Tiempo en empujar TODOS los bits del paquete al medio. Depende de tamaño y ancho de banda: L/R.",
    color: "#3fb950",
  },
  {
    id: "propagating",
    name: "4. Propagación",
    detail: "Tiempo en que un bit cruza el enlace físico. Depende de distancia y velocidad del medio (~2/3 c). d/s.",
    color: "#58a6ff",
  },
];

export function NodalDelays() {
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
    for (const p of PHASES) {
      if (cancelRef.current) return;
      setPhase(p.id);
      await sleep(p.id === "transmitting" ? 1700 : 1300);
    }
    if (cancelRef.current) return;
    setPhase("done");
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const currentInfo = PHASES.find((p) => p.id === phase);

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">
            {currentInfo
              ? <><span className="font-bold mr-2" style={{ color: currentInfo.color }}>{currentInfo.name}</span>{currentInfo.detail}</>
              : "Cuando un paquete pasa por un router, sufre 4 tipos de retardo. Reproducí para verlos."}
          </p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 380" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Source */}
        <rect x={20} y={170} width={70} height={50} rx={6} fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
        <text x={55} y={200} fill="#fff" fontSize={12} textAnchor="middle">A</text>

        {/* Router with internals */}
        <rect x={250} y={120} width={300} height={150} rx={10} fill="#0f172a" stroke="#6366f1" strokeWidth={2} />
        <text x={400} y={108} fill="#6366f1" fontSize={12} textAnchor="middle" fontWeight="bold">ROUTER</text>

        {/* Processing block */}
        <rect x={270} y={140} width={80} height={50} rx={6} fill={phase === "processing" ? "#a371f733" : "#1e293b"} stroke="#a371f7" strokeWidth={phase === "processing" ? 3 : 1.5} />
        <text x={310} y={163} fill="#a371f7" fontSize={10} textAnchor="middle" fontWeight="bold">CPU</text>
        <text x={310} y={176} fill="#a371f7" fontSize={9} textAnchor="middle">procesa</text>

        {/* Queue */}
        <rect x={365} y={140} width={80} height={50} rx={6} fill={phase === "queueing" ? "#fbbf2433" : "#1e293b"} stroke="#fbbf24" strokeWidth={phase === "queueing" ? 3 : 1.5} />
        <text x={405} y={163} fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight="bold">Buffer</text>
        <text x={405} y={176} fill="#fbbf24" fontSize={9} textAnchor="middle">cola</text>

        {/* Output interface */}
        <rect x={460} y={140} width={70} height={50} rx={6} fill={phase === "transmitting" ? "#3fb95033" : "#1e293b"} stroke="#3fb950" strokeWidth={phase === "transmitting" ? 3 : 1.5} />
        <text x={495} y={163} fill="#3fb950" fontSize={10} textAnchor="middle" fontWeight="bold">Interfaz</text>
        <text x={495} y={176} fill="#3fb950" fontSize={9} textAnchor="middle">tx</text>

        {/* Wire */}
        <text x={650} y={155} fill="#58a6ff" fontSize={10} textAnchor="middle" fontWeight="bold">Cable</text>
        <line x1={550} y1={170} x2={760} y2={170} stroke={phase === "propagating" ? "#58a6ff" : "#475569"} strokeWidth={phase === "propagating" ? 4 : 2} />

        {/* Destination */}
        <rect x={710} y={170} width={70} height={50} rx={6} fill="#1e293b" stroke="#475569" strokeWidth={1.5} />
        <text x={745} y={200} fill="#fff" fontSize={12} textAnchor="middle">B</text>

        {/* Packet at different positions */}
        {phase === "processing" && (
          <rect x={290} y={148} width={40} height={20} rx={3} fill="#a371f7" stroke="#fff">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
          </rect>
        )}
        {phase === "queueing" && (
          <g>
            <rect x={385} y={148} width={40} height={10} rx={2} fill="#fbbf24" />
            <rect x={385} y={160} width={40} height={10} rx={2} fill="#fbbf24" />
            <rect x={385} y={172} width={40} height={10} rx={2} fill="#fbbf24" />
            <text x={405} y={205} fill="#fbbf24" fontSize={9} textAnchor="middle">⏳</text>
          </g>
        )}
        {phase === "transmitting" && (
          <g>
            <rect width={40} height={20} rx={3} fill="#3fb950" stroke="#fff">
              <animate attributeName="x" from={460} to={550} dur="1.5s" fill="freeze" />
              <animate attributeName="y" from={148} to={158} dur="1.5s" fill="freeze" />
            </rect>
            <text fill="#3fb950" fontSize={9} textAnchor="middle">
              <animate attributeName="x" from={480} to={570} dur="1.5s" fill="freeze" />
              <animate attributeName="y" from={210} to={210} dur="1.5s" fill="freeze" />
              L/R
            </text>
          </g>
        )}
        {phase === "propagating" && (
          <g>
            <rect width={40} height={20} rx={3} fill="#58a6ff" stroke="#fff">
              <animate attributeName="x" from={550} to={710} dur="1.1s" fill="freeze" />
              <animate attributeName="y" from={158} to={180} dur="1.1s" fill="freeze" />
            </rect>
            <text fill="#58a6ff" fontSize={9} textAnchor="middle">
              <animate attributeName="x" from={580} to={740} dur="1.1s" fill="freeze" />
              <animate attributeName="y" from={155} to={155} dur="1.1s" fill="freeze" />
              d/s
            </text>
          </g>
        )}
        {phase === "done" && (
          <text x={745} y={140} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold">
            ✓ entregado
          </text>
        )}

        {/* Formula box */}
        <g transform="translate(80, 300)">
          <rect width={640} height={60} rx={6} fill="#0f172a" stroke="#475569" />
          <text x={320} y={20} fill="#94a3b8" fontSize={10} textAnchor="middle" fontWeight="bold">
            d_nodal = d_proc + d_cola + d_trans + d_prop
          </text>
          <text x={320} y={40} fill="#64748b" fontSize={10} textAnchor="middle" fontFamily="monospace">
            d_trans = L (bits) / R (bps)        d_prop = d (m) / s (m/s)
          </text>
          <text x={320} y={54} fill="#64748b" fontSize={9} textAnchor="middle" fontStyle="italic">
            cola es la única que crece con la congestión
          </text>
        </g>
      </svg>
    </AnimationFrame>
  );
}

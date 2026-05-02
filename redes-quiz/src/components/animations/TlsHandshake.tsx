"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton , sleep} from "./AnimationFrame";

const STEPS = [
  { from: "client" as const, label: "ClientHello", detail: "Cliente envía: versión TLS soportada, cipher suites, random C, lista de extensiones (SNI...).", color: "#58a6ff" },
  { from: "server" as const, label: "ServerHello", detail: "Servidor elige cipher, manda su random S y comienza a enviar el certificado.", color: "#3fb950" },
  { from: "server" as const, label: "Certificate", detail: "El servidor envía su certificado X.509. El cliente lo verifica contra la cadena de CAs confiables.", color: "#3fb950" },
  { from: "server" as const, label: "ServerKeyExchange + Done", detail: "Servidor envía parámetros para el intercambio de claves (ECDHE) firmados con su clave privada.", color: "#3fb950" },
  { from: "client" as const, label: "ClientKeyExchange", detail: "Cliente genera su parte del key exchange. Ambos derivan la misma clave maestra (sin enviarla).", color: "#58a6ff" },
  { from: "client" as const, label: "ChangeCipherSpec + Finished", detail: "Cliente cambia a modo cifrado. Envía Finished cifrado con la clave derivada.", color: "#fbbf24" },
  { from: "server" as const, label: "ChangeCipherSpec + Finished", detail: "Servidor confirma el cambio a cifrado. La sesión está establecida.", color: "#fbbf24" },
  { from: "both" as const, label: "Datos cifrados (Application Data)", detail: "Toda la comunicación posterior va cifrada con la clave de sesión.", color: "#a371f7" },
];

export function TlsHandshake() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setStep(-1);
    setRunning(false);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    if (step >= STEPS.length - 1) setStep(-1);
    let start = step + 1;
    if (start < 0) start = 0;
    for (let i = start; i < STEPS.length; i++) {
      if (cancelRef.current) return;
      setStep(i);
      await sleep(1300);
    }
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{current ? current.detail : "TLS handshake (clásico). Negocia cifrado, autentica al servidor y deriva una clave de sesión."}</p>
          <p className="text-slate-500 text-xs">Paso {Math.max(0, step + 1)}/{STEPS.length}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 540" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Endpoints */}
        <rect x={50} y={20} width={150} height={50} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={125} y={50} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">CLIENTE</text>

        <rect x={600} y={20} width={150} height={50} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={675} y={50} fill="#fff" fontSize={14} textAnchor="middle" fontWeight="bold">SERVIDOR</text>

        {/* Time lines */}
        <line x1={125} y1={70} x2={125} y2={530} stroke="#475569" strokeDasharray="3 3" />
        <line x1={675} y1={70} x2={675} y2={530} stroke="#475569" strokeDasharray="3 3" />

        {/* Step arrows */}
        {STEPS.map((s, i) => {
          if (i > step) return null;
          const yLine = 100 + i * 55;
          if (s.from === "both") {
            return (
              <g key={i}>
                <rect x={150} y={yLine - 15} width={500} height={30} rx={5} fill={`${s.color}33`} stroke={s.color} strokeWidth={1.5} />
                <text x={400} y={yLine + 5} fill={s.color} fontSize={11} textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                  🔒 {s.label}
                </text>
              </g>
            );
          }
          const fromX = s.from === "client" ? 125 : 675;
          const toX = s.from === "client" ? 675 : 125;
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
              <rect x={400 - 130} y={yLine - 13} width={260} height={20} rx={4} fill="#0f172a" stroke={s.color} strokeWidth={1} />
              <text x={400} y={yLine + 1} fill={s.color} fontSize={11} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AnimationFrame>
  );
}

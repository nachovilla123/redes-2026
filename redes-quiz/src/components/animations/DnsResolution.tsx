"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

const ACTORS = {
  pc: { x: 80, y: 200, label: "TU PC", sub: "stub", color: "#58a6ff" },
  resolver: { x: 270, y: 200, label: "RESOLVER", sub: "8.8.8.8", color: "#3fb950" },
  root: { x: 480, y: 80, label: "ROOT", sub: ".", color: "#fbbf24" },
  tld: { x: 680, y: 200, label: "TLD .com", sub: "verisign", color: "#a371f7" },
  auth: { x: 480, y: 340, label: "AUTORITATIVO", sub: "ns1.google.com", color: "#f85149" },
} as const;

type ActorKey = keyof typeof ACTORS;

const STEPS: Array<{
  from: ActorKey;
  to: ActorKey;
  label: string;
  detail: string;
  color: string;
}> = [
  { from: "pc", to: "resolver", label: "¿www.google.com?", detail: "Tu PC consulta al resolver del ISP (lo configuró DHCP).", color: "#58a6ff" },
  { from: "resolver", to: "root", label: "¿www.google.com?", detail: "El resolver no lo tiene en caché. Le pregunta al servidor root.", color: "#58a6ff" },
  { from: "root", to: "resolver", label: "preguntale al .com", detail: "Root no sabe la IP final pero conoce los nameservers de cada TLD.", color: "#fbbf24" },
  { from: "resolver", to: "tld", label: "¿www.google.com?", detail: "Resolver consulta al TLD de .com.", color: "#58a6ff" },
  { from: "tld", to: "resolver", label: "preguntale a ns1.google.com", detail: "TLD devuelve los nameservers autoritativos de google.com.", color: "#a371f7" },
  { from: "resolver", to: "auth", label: "¿www.google.com?", detail: "Resolver consulta al servidor autoritativo de google.com.", color: "#58a6ff" },
  { from: "auth", to: "resolver", label: "A 142.250.80.4 TTL=300", detail: "Autoritativo devuelve la IP final con su TTL.", color: "#f85149" },
  { from: "resolver", to: "pc", label: "142.250.80.4", detail: "Resolver guarda en caché y responde a tu PC. Próximas consultas son instantáneas.", color: "#3fb950" },
];

export function DnsResolution() {
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
    const t = setTimeout(() => setStep((s) => s + 1), 1500);
    return () => clearTimeout(t);
  }, [running, step]);

  function auto() {
    if (running) return;
    if (step >= STEPS.length - 1) setStep(-1);
    setRunning(true);
    setStep((s) => (s < 0 ? 0 : s + 1));
  }

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;
  const currentEdge = current ? { from: ACTORS[current.from], to: ACTORS[current.to] } : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{current ? current.detail : "Resolución DNS recursiva: tu PC quiere la IP de www.google.com. Apretá Siguiente paso para avanzar a tu ritmo."}</p>
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
      <svg viewBox="0 0 780 420" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Edges from history */}
        {STEPS.map((s, i) => {
          if (i > step) return null;
          const from = ACTORS[s.from];
          const to = ACTORS[s.to];
          const isCurrent = i === step;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={s.color}
              strokeWidth={isCurrent ? 2.5 : 1.5}
              opacity={isCurrent ? 0.9 : 0.35}
            />
          );
        })}

        {/* Actors */}
        {(Object.keys(ACTORS) as ActorKey[]).map((key) => {
          const a = ACTORS[key];
          return (
            <g key={key}>
              <rect x={a.x - 60} y={a.y - 24} width={120} height={48} rx={8} fill="#1e293b" stroke={a.color} strokeWidth={2} />
              <text x={a.x} y={a.y - 5} fill="#fff" fontSize={12} fontWeight="bold" textAnchor="middle">
                {a.label}
              </text>
              <text x={a.x} y={a.y + 12} fill={a.color} fontSize={10} fontFamily="monospace" textAnchor="middle">
                {a.sub}
              </text>
            </g>
          );
        })}

        {/* Current message label */}
        {currentEdge && current && (
          <g>
            <rect
              x={(currentEdge.from.x + currentEdge.to.x) / 2 - 90}
              y={(currentEdge.from.y + currentEdge.to.y) / 2 - 13}
              width={180}
              height={26}
              rx={5}
              fill={current.color}
              stroke="#fff"
              strokeWidth={1}
            />
            <text
              x={(currentEdge.from.x + currentEdge.to.x) / 2}
              y={(currentEdge.from.y + currentEdge.to.y) / 2 + 4}
              fill="#0f172a"
              fontSize={10}
              textAnchor="middle"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {current.label}
            </text>
          </g>
        )}
      </svg>
    </AnimationFrame>
  );
}

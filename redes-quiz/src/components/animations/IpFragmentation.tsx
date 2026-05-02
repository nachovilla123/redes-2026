"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

const FRAGMENTS = [
  { id: 1, total: 620, payload: 600, mf: 1, offset: 0 },
  { id: 2, total: 620, payload: 600, mf: 1, offset: 75 },
  { id: 3, total: 300, payload: 280, mf: 0, offset: 150 },
];

const TOTAL_STEPS = 5;

export function IpFragmentation() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  function reset() {
    setStep(0);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }
  function pause() { setRunning(false); }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  useEffect(() => {
    if (!running) return;
    if (step >= TOTAL_STEPS - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1500);
    return () => clearTimeout(t);
  }, [running, step]);

  function auto() {
    if (running) return;
    if (step >= TOTAL_STEPS - 1) setStep(0);
    setRunning(true);
    setStep((s) => (s === 0 ? 1 : s + 1));
  }

  const captions = [
    "Datagrama de 1500B (20B header IP + 1480B datos) sale del origen. El próximo enlace tiene MTU=620B.",
    "Llega al router. Compara: 1500 > 620 y bit DF=0 → debe fragmentar.",
    "Calcula: payload por fragmento = 620 − 20 = 600B. Datos a fragmentar = 1480B → 3 fragmentos.",
    "Cada fragmento mantiene el mismo ID. MF=1 en todos menos el último. Offset en bloques de 8 bytes.",
    "Solo el destino final reensambla los fragmentos en orden, usando ID y Offset.",
  ];

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{captions[step]}</p>
          <p className="text-slate-500">Paso {step + 1}/{captions.length}</p>
        </div>
      }
      controls={
        <StepControls
          step={step}
          total={TOTAL_STEPS}
          onNext={next}
          onPrev={prev}
          onAuto={auto}
          onPause={pause}
          onReset={reset}
          running={running}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <svg viewBox="0 0 800 280" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
          {/* Source */}
          <rect x={20} y={120} width={100} height={60} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
          <text x={70} y={145} fill="#fff" fontSize={12} fontWeight="bold" textAnchor="middle">Origen</text>
          <text x={70} y={163} fill="#58a6ff" fontSize={10} textAnchor="middle">MTU=1500</text>

          {/* Router */}
          <rect x={310} y={100} width={140} height={100} rx={10} fill="#1e293b" stroke="#fbbf24" strokeWidth={2} />
          <text x={380} y={130} fill="#fff" fontSize={13} fontWeight="bold" textAnchor="middle">ROUTER</text>
          <text x={380} y={150} fill="#fbbf24" fontSize={10} textAnchor="middle">in: MTU=1500</text>
          <text x={380} y={165} fill="#fbbf24" fontSize={10} textAnchor="middle">out: MTU=620</text>
          {step >= 1 && step < 4 && (
            <text x={380} y={185} fill="#f85149" fontSize={10} textAnchor="middle" fontWeight="bold">
              ✂ fragmenta
            </text>
          )}

          {/* Destination */}
          <rect x={680} y={120} width={100} height={60} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
          <text x={730} y={145} fill="#fff" fontSize={12} fontWeight="bold" textAnchor="middle">Destino</text>
          <text x={730} y={163} fill="#3fb950" fontSize={10} textAnchor="middle">reensambla</text>

          {/* Lines */}
          <line x1={120} y1={150} x2={310} y2={150} stroke="#334155" strokeWidth={1.5} />
          <line x1={450} y1={150} x2={680} y2={150} stroke="#334155" strokeWidth={1.5} />
          <text x={215} y={142} fill="#64748b" fontSize={10} textAnchor="middle">enlace 1500B</text>
          <text x={565} y={142} fill="#fbbf24" fontSize={10} textAnchor="middle">enlace 620B</text>

          {/* Original datagram traveling (step 0) */}
          {step === 0 && (
            <g>
              <rect x={140} y={135} width={150} height={30} rx={4} fill="#58a6ff" stroke="#fff" strokeWidth={1}>
                <animate attributeName="x" from={140} to={290} dur="1.4s" repeatCount="indefinite" />
              </rect>
              <text x={215} y={154} fill="#0f172a" fontSize={11} textAnchor="middle" fontWeight="bold">
                <animate attributeName="x" from={215} to={365} dur="1.4s" repeatCount="indefinite" />
                1500B (ID=42)
              </text>
            </g>
          )}

          {/* Original at router (step 1-2) */}
          {(step === 1 || step === 2) && (
            <g>
              <rect x={310} y={210} width={140} height={20} rx={3} fill="#58a6ff" stroke="#fff" strokeWidth={1} />
              <text x={380} y={224} fill="#0f172a" fontSize={10} textAnchor="middle" fontWeight="bold">
                entrada: 1500B
              </text>
            </g>
          )}

          {/* Fragments traveling out (step 3+) */}
          {step >= 3 &&
            FRAGMENTS.map((f, i) => {
              const offsetX = step === 3 ? 460 + i * 70 : 600 + i * 60;
              const w = (f.total / 620) * 60;
              return (
                <g key={f.id}>
                  <rect x={offsetX} y={135} width={w} height={30} rx={3} fill="#fbbf24" stroke="#fff" strokeWidth={1} />
                  <text x={offsetX + w / 2} y={127} fill="#fbbf24" fontSize={9} textAnchor="middle" fontWeight="bold">
                    Frag {i + 1}
                  </text>
                  <text x={offsetX + w / 2} y={154} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
                    {f.total}B
                  </text>
                </g>
              );
            })}

          {/* Reassembled at destination (step 4) */}
          {step === 4 && (
            <g>
              <rect x={695} y={185} width={70} height={16} rx={3} fill="#3fb950" stroke="#fff" strokeWidth={1} />
              <text x={730} y={197} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
                ✓ 1500B
              </text>
            </g>
          )}
        </svg>

        {/* Calculation table */}
        {step >= 2 && (
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4">
            <p className="text-amber-400 text-xs font-bold mb-2 uppercase tracking-widest">Cálculo de fragmentación</p>
            <p className="text-slate-300 text-xs font-mono mb-1">Datos por fragmento = MTU − IP_hdr = 620 − 20 = 600B (múltiplo de 8 ✓)</p>
            <p className="text-slate-300 text-xs font-mono mb-3">Datos totales: 1480B → ⌈1480 / 600⌉ = 3 fragmentos</p>

            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-amber-400 border-b border-slate-800">
                  <th className="text-left py-1">#</th>
                  <th className="text-left py-1">Total</th>
                  <th className="text-left py-1">Payload</th>
                  <th className="text-left py-1">MF</th>
                  <th className="text-left py-1">Offset</th>
                  <th className="text-left py-1">(en bytes)</th>
                </tr>
              </thead>
              <tbody>
                {FRAGMENTS.map((f) => (
                  <tr key={f.id} className="text-slate-300">
                    <td className="py-1">{f.id}</td>
                    <td className="py-1">{f.total}B</td>
                    <td className="py-1">{f.payload}B</td>
                    <td className={`py-1 ${f.mf === 0 ? "text-red-400 font-bold" : ""}`}>{f.mf}</td>
                    <td className="py-1">{f.offset}</td>
                    <td className="py-1 text-slate-500">×8 = {f.offset * 8}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AnimationFrame>
  );
}

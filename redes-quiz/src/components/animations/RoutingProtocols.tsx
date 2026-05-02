"use client";

import { useEffect, useState } from "react";
import { AnimationFrame, StepControls } from "./AnimationFrame";

type Mode = "rip" | "ospf" | "bgp";

const RIP_STEPS = [
  "Cada router arranca conociendo SOLO sus redes directamente conectadas (sus enlaces inmediatos).",
  "RIP funciona por vector de distancia: cada 30s, cada router envía SU tabla completa a TODOS sus vecinos directos.",
  "Los vecinos reciben las tablas y actualizan: 'si vos llegás a X en 2 saltos, yo llego a través tuyo en 3'.",
  "Tras varias rondas de intercambio, la información se propaga por toda la red. Métrica = saltos (máx 15).",
  "Converge lento (puede tardar minutos si una ruta cae). Limitado a redes chicas. AD=120.",
];

const OSPF_STEPS = [
  "Cada router conoce sus enlaces directos y a sus vecinos OSPF (vía paquetes Hello).",
  "Genera un LSA (Link-State Advertisement) describiendo SUS enlaces y costos.",
  "Inunda (flood) ese LSA a TODOS los routers del área — no solo a los vecinos directos.",
  "Cuando termina el flood, TODOS los routers tienen el MISMO mapa completo (link-state database).",
  "Cada router corre Dijkstra LOCAL sobre el mapa para calcular el camino más corto a cada destino. Sin límite de saltos. AD=110.",
];

const BGP_STEPS = [
  "Internet es una colección de Sistemas Autónomos (AS). Cada AS tiene su propia red interna (IGP).",
  "Los routers de borde (edge) de cada AS hablan BGP entre sí: 'yo sé llegar a la red X via mi AS'.",
  "Cada anuncio BGP lleva un AS-PATH: la lista de AS que se atraviesan para llegar al destino.",
  "Cuando un AS recibe múltiples rutas al mismo destino, elige según POLÍTICAS (no solo distancia): acuerdos comerciales, peer vs transit, AS-PATH más corto, etc.",
  "Si una ruta falla, BGP recalcula y anuncia el cambio. Lento pero estable. AD=20 (eBGP) / 200 (iBGP).",
];

export function RoutingProtocols() {
  const [mode, setMode] = useState<Mode>("rip");
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const STEPS = mode === "rip" ? RIP_STEPS : mode === "ospf" ? OSPF_STEPS : BGP_STEPS;
  const total = STEPS.length;

  function reset() {
    setStep(-1);
    setRunning(false);
  }
  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function pause() {
    setRunning(false);
  }

  useEffect(() => {
    if (!running) return;
    if (step >= total - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 2000);
    return () => clearTimeout(t);
  }, [running, step, total]);

  function auto() {
    if (running) return;
    if (step >= total - 1) setStep(-1);
    setRunning(true);
    setStep((s) => (s < 0 ? 0 : s + 1));
  }

  function switchMode(m: Mode) {
    setMode(m);
    setStep(-1);
    setRunning(false);
  }

  const caption = step >= 0 ? STEPS[step] : pickIntro(mode);

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{caption}</p>
          {step >= 0 && <p className="text-slate-500 mt-1">Paso {step + 1}/{total}</p>}
        </div>
      }
      controls={
        <>
          <button
            type="button"
            onClick={() => switchMode("rip")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "rip" ? "bg-amber-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            RIP
          </button>
          <button
            type="button"
            onClick={() => switchMode("ospf")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "ospf" ? "bg-emerald-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            OSPF
          </button>
          <button
            type="button"
            onClick={() => switchMode("bgp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === "bgp" ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            BGP
          </button>
          <StepControls
            step={step < 0 ? 0 : step}
            total={total}
            onNext={next}
            onPrev={prev}
            onAuto={auto}
            onPause={pause}
            onReset={reset}
            running={running}
          />
        </>
      }
    >
      {mode === "rip" && <RipDiagram step={step} />}
      {mode === "ospf" && <OspfDiagram step={step} />}
      {mode === "bgp" && <BgpDiagram step={step} />}
    </AnimationFrame>
  );
}

function pickIntro(m: Mode) {
  if (m === "rip") return "RIP es un IGP de vector de distancia. Cada router le pregunta al vecino: '¿cuántos saltos hasta X?'. Apretá Siguiente paso para ver cómo aprende.";
  if (m === "ospf") return "OSPF es un IGP de estado de enlace. Cada router conoce el mapa completo y calcula su mejor camino con Dijkstra.";
  return "BGP es el EGP que une los Sistemas Autónomos de internet. Las decisiones se basan en políticas, no solo distancia.";
}

const RIP_ROUTERS = [
  { id: "R1", x: 120, y: 200, networks: ["10.1.0.0/24"] },
  { id: "R2", x: 320, y: 100, networks: ["10.2.0.0/24"] },
  { id: "R3", x: 320, y: 300, networks: ["10.3.0.0/24"] },
  { id: "R4", x: 520, y: 200, networks: ["10.4.0.0/24"] },
];
const RIP_LINKS: Array<[string, string]> = [
  ["R1", "R2"], ["R1", "R3"], ["R2", "R4"], ["R3", "R4"], ["R2", "R3"],
];

function RipDiagram({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 640 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Links */}
        {RIP_LINKS.map(([a, b], i) => {
          const ra = RIP_ROUTERS.find((r) => r.id === a)!;
          const rb = RIP_ROUTERS.find((r) => r.id === b)!;
          return <line key={i} x1={ra.x} y1={ra.y} x2={rb.x} y2={rb.y} stroke="#475569" strokeWidth={2} />;
        })}

        {/* Step 1: each router announces its tables to neighbors */}
        {step >= 1 &&
          RIP_LINKS.map(([a, b], i) => {
            const ra = RIP_ROUTERS.find((r) => r.id === a)!;
            const rb = RIP_ROUTERS.find((r) => r.id === b)!;
            return (
              <g key={`pulse-${i}`}>
                <circle r={6} fill="#fbbf24">
                  <animate attributeName="cx" from={ra.x} to={rb.x} dur="1.4s" repeatCount={step >= 2 ? "1" : "indefinite"} />
                  <animate attributeName="cy" from={ra.y} to={rb.y} dur="1.4s" repeatCount={step >= 2 ? "1" : "indefinite"} />
                </circle>
                <circle r={6} fill="#fbbf24">
                  <animate attributeName="cx" from={rb.x} to={ra.x} dur="1.4s" begin="0.3s" repeatCount={step >= 2 ? "1" : "indefinite"} />
                  <animate attributeName="cy" from={rb.y} to={ra.y} dur="1.4s" begin="0.3s" repeatCount={step >= 2 ? "1" : "indefinite"} />
                </circle>
              </g>
            );
          })}

        {/* Routers */}
        {RIP_ROUTERS.map((r) => (
          <g key={r.id}>
            <circle cx={r.x} cy={r.y} r={28} fill="#1e293b" stroke="#fbbf24" strokeWidth={2} />
            <text x={r.x} y={r.y + 5} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">
              {r.id}
            </text>
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RIP_ROUTERS.map((r, i) => {
          const visibleHops = computeRipHops(r.id, step);
          return (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-[11px] font-mono">
              <p className="text-amber-400 font-bold mb-1">{r.id}</p>
              {Object.entries(visibleHops).map(([dest, hops]) => (
                <div key={dest} className="text-slate-400">
                  {dest} → <span className="text-amber-300">{hops} hop{hops !== 1 ? "s" : ""}</span>
                </div>
              ))}
              {Object.keys(visibleHops).length === 0 && <p className="text-slate-600 italic">vacía</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function computeRipHops(routerId: string, step: number): Record<string, number> {
  // step 0: only directly connected
  // step 1+: progressively more
  const directlyConnected: Record<string, string[]> = {
    R1: ["10.1.0.0/24"],
    R2: ["10.2.0.0/24"],
    R3: ["10.3.0.0/24"],
    R4: ["10.4.0.0/24"],
  };
  const result: Record<string, number> = {};
  if (step < 0) return result;
  for (const net of directlyConnected[routerId] ?? []) result[net] = 0;

  if (step >= 2) {
    // After first exchange: neighbors' nets at 1 hop
    const neighbors: Record<string, string[]> = {
      R1: ["R2", "R3"],
      R2: ["R1", "R3", "R4"],
      R3: ["R1", "R2", "R4"],
      R4: ["R2", "R3"],
    };
    for (const n of neighbors[routerId] ?? []) {
      for (const net of directlyConnected[n] ?? []) {
        if (!(net in result)) result[net] = 1;
      }
    }
  }
  if (step >= 3) {
    // After second exchange: 2 hops
    const allNets = ["10.1.0.0/24", "10.2.0.0/24", "10.3.0.0/24", "10.4.0.0/24"];
    for (const net of allNets) {
      if (!(net in result)) result[net] = 2;
    }
  }
  return result;
}

const OSPF_ROUTERS = [
  { id: "R1", x: 120, y: 100 },
  { id: "R2", x: 360, y: 80 },
  { id: "R3", x: 580, y: 130 },
  { id: "R4", x: 200, y: 280 },
  { id: "R5", x: 480, y: 290 },
];
const OSPF_LINKS: Array<[string, string, number]> = [
  ["R1", "R2", 5],
  ["R2", "R3", 3],
  ["R1", "R4", 4],
  ["R4", "R5", 6],
  ["R3", "R5", 2],
  ["R2", "R5", 7],
];

function OspfDiagram({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 700 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Links */}
        {OSPF_LINKS.map(([a, b, cost], i) => {
          const ra = OSPF_ROUTERS.find((r) => r.id === a)!;
          const rb = OSPF_ROUTERS.find((r) => r.id === b)!;
          const mx = (ra.x + rb.x) / 2;
          const my = (ra.y + rb.y) / 2;
          return (
            <g key={i}>
              <line x1={ra.x} y1={ra.y} x2={rb.x} y2={rb.y} stroke="#475569" strokeWidth={2} />
              <rect x={mx - 14} y={my - 9} width={28} height={16} rx={3} fill="#0f172a" stroke="#475569" />
              <text x={mx} y={my + 3} fill="#94a3b8" fontSize={9} textAnchor="middle" fontFamily="monospace">
                {cost}
              </text>
            </g>
          );
        })}

        {/* Step 2: flooding pulses from each router to all */}
        {step === 2 &&
          OSPF_ROUTERS.flatMap((src) =>
            OSPF_ROUTERS.filter((r) => r.id !== src.id).map((dst) => (
              <circle key={`f-${src.id}-${dst.id}`} r={4} fill="#3fb950">
                <animate attributeName="cx" from={src.x} to={dst.x} dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="cy" from={src.y} to={dst.y} dur="1.5s" repeatCount="indefinite" />
              </circle>
            ))
          )}

        {/* Routers */}
        {OSPF_ROUTERS.map((r) => {
          const knowsAll = step >= 3;
          return (
            <g key={r.id}>
              <circle cx={r.x} cy={r.y} r={26} fill="#1e293b" stroke={knowsAll ? "#3fb950" : "#6366f1"} strokeWidth={2} />
              <text x={r.x} y={r.y + 5} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">
                {r.id}
              </text>
              {knowsAll && (
                <text x={r.x} y={r.y - 36} fill="#3fb950" fontSize={9} textAnchor="middle" fontWeight="bold">
                  📍 mapa OK
                </text>
              )}
            </g>
          );
        })}

        {/* Step 4: highlight Dijkstra path R1 -> R5 (via R4 = 10, via R2->R3->R5 = 10, via R2->R5 = 12 → R1-R4-R5 wins) */}
        {step >= 4 && (
          <g>
            {[["R1", "R4"], ["R4", "R5"]].map(([a, b], i) => {
              const ra = OSPF_ROUTERS.find((r) => r.id === a)!;
              const rb = OSPF_ROUTERS.find((r) => r.id === b)!;
              return <line key={i} x1={ra.x} y1={ra.y} x2={rb.x} y2={rb.y} stroke="#3fb950" strokeWidth={4} opacity={0.7} />;
            })}
            <text x={350} y={380} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold">
              ✓ R1 → R5 vía R4 (costo total = 10), elegido por Dijkstra
            </text>
          </g>
        )}
      </svg>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
        <p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-1">Link-State Database</p>
        {step >= 1 ? (
          <pre className="text-slate-300 font-mono text-[11px] leading-relaxed">
{`R1 conecta a: R2 (5), R4 (4)
R2 conecta a: R1 (5), R3 (3), R5 (7)
R3 conecta a: R2 (3), R5 (2)
R4 conecta a: R1 (4), R5 (6)
R5 conecta a: R2 (7), R3 (2), R4 (6)`}
          </pre>
        ) : (
          <p className="text-slate-600 italic">cada router solo conoce sus enlaces directos</p>
        )}
      </div>
    </div>
  );
}

const BGP_AS = [
  { id: "AS 100", color: "#58a6ff", x: 80, y: 60, w: 180, h: 280, name: "Tu ISP" },
  { id: "AS 200", color: "#fbbf24", x: 290, y: 60, w: 180, h: 280, name: "Operador tránsito" },
  { id: "AS 300", color: "#3fb950", x: 500, y: 60, w: 180, h: 280, name: "Google" },
];

function BgpDiagram({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 760 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* AS boxes */}
        {BGP_AS.map((as) => (
          <g key={as.id}>
            <rect
              x={as.x}
              y={as.y}
              width={as.w}
              height={as.h}
              rx={12}
              fill={as.color + "11"}
              stroke={as.color}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <text x={as.x + as.w / 2} y={as.y - 8} fill={as.color} fontSize={12} textAnchor="middle" fontWeight="bold">
              {as.id} ({as.name})
            </text>
            {/* Internal routers */}
            <circle cx={as.x + 50} cy={as.y + 100} r={20} fill="#1e293b" stroke={as.color} strokeWidth={1.5} />
            <text x={as.x + 50} y={as.y + 105} fill="#fff" fontSize={10} textAnchor="middle" fontWeight="bold">int</text>
            <circle cx={as.x + as.w - 50} cy={as.y + 100} r={22} fill="#1e293b" stroke={as.color} strokeWidth={2} />
            <text x={as.x + as.w - 50} y={as.y + 100} fill="#fff" fontSize={10} textAnchor="middle" fontWeight="bold">edge</text>
            <text x={as.x + as.w - 50} y={as.y + 130} fill={as.color} fontSize={9} textAnchor="middle">BGP</text>
            <line x1={as.x + 70} y1={as.y + 100} x2={as.x + as.w - 70} y2={as.y + 100} stroke={as.color} strokeWidth={1} strokeDasharray="3 3" />
          </g>
        ))}

        {/* eBGP links between edges */}
        <line x1={210} y1={160} x2={300} y2={160} stroke="#94a3b8" strokeWidth={2} />
        <line x1={420} y1={160} x2={530} y2={160} stroke="#94a3b8" strokeWidth={2} />

        {/* Step 1: AS300 announces its prefix */}
        {step >= 1 && step < 3 && (
          <>
            <circle r={5} fill="#3fb950">
              <animate attributeName="cx" from={550} to={420} dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="cy" from={160} to={160} dur="1.5s" repeatCount="indefinite" />
            </circle>
            <text x={485} y={140} fill="#3fb950" fontSize={9} textAnchor="middle" fontWeight="bold">
              AS-PATH: [300]
            </text>
          </>
        )}

        {/* Step 2: AS200 propagates to AS100 */}
        {step >= 2 && step < 3 && (
          <>
            <circle r={5} fill="#fbbf24">
              <animate attributeName="cx" from={340} to={210} dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="cy" from={160} to={160} dur="1.5s" repeatCount="indefinite" />
            </circle>
            <text x={275} y={140} fill="#fbbf24" fontSize={9} textAnchor="middle" fontWeight="bold">
              AS-PATH: [200, 300]
            </text>
          </>
        )}

        {/* Step 3+: route propagation completed, label */}
        {step >= 3 && (
          <>
            <text x={275} y={195} fill="#94a3b8" fontSize={9} textAnchor="middle" fontFamily="monospace">[200, 300]</text>
            <text x={485} y={195} fill="#94a3b8" fontSize={9} textAnchor="middle" fontFamily="monospace">[300]</text>
          </>
        )}

        {/* Step 4: policy decision */}
        {step >= 4 && (
          <g transform="translate(80, 360)">
            <rect width={600} height={32} rx={6} fill="#1e293b" stroke="#a371f7" strokeWidth={1.5} />
            <text x={300} y={20} fill="#a371f7" fontSize={11} textAnchor="middle" fontWeight="bold">
              💼 AS 100 prefiere ruta vía AS 200 por acuerdo comercial — aunque haya otra más corta
            </text>
          </g>
        )}
      </svg>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
        <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-2">
          <p className="text-blue-400 font-bold mb-1">AS 100 (tu ISP)</p>
          {step < 2 ? (
            <p className="text-slate-600 italic">no conoce a 10.0.0.0/8</p>
          ) : (
            <p className="text-slate-300 font-mono">10.0.0.0/8 via AS 200, 300</p>
          )}
        </div>
        <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-2">
          <p className="text-amber-400 font-bold mb-1">AS 200 (tránsito)</p>
          {step < 1 ? (
            <p className="text-slate-600 italic">vacía</p>
          ) : (
            <p className="text-slate-300 font-mono">10.0.0.0/8 via AS 300</p>
          )}
        </div>
        <div className="bg-slate-900 border border-green-500/30 rounded-lg p-2">
          <p className="text-green-400 font-bold mb-1">AS 300 (Google)</p>
          <p className="text-slate-300 font-mono">10.0.0.0/8 directo (origen)</p>
        </div>
      </div>
    </div>
  );
}

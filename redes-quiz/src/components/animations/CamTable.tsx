"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Step = {
  description: string;
  packet?: { from: number; to: number; srcMac: string; dstMac: string };
  // After packet arrives, table additions / forwarding behavior
  learnMac?: string; // MAC learned -> port = packet.from
  forwardTo?: number[] | "flood"; // ports to forward to
};

const HOSTS = [
  { id: 0, name: "PC-A", mac: "AA:11", color: "#58a6ff" },
  { id: 1, name: "PC-B", mac: "BB:22", color: "#3fb950" },
  { id: 2, name: "PC-C", mac: "CC:33", color: "#d29922" },
  { id: 3, name: "PC-D", mac: "DD:44", color: "#f85149" },
];

const STEPS: Step[] = [
  {
    description: "PC-A envía a PC-B. El switch no conoce la MAC destino → flood (envía por todos los puertos excepto el de origen).",
    packet: { from: 0, to: 1, srcMac: "AA:11", dstMac: "BB:22" },
    learnMac: "AA:11",
    forwardTo: "flood",
  },
  {
    description: "PC-B responde a PC-A. El switch ya sabe dónde está PC-A → reenvía solo por el puerto 0.",
    packet: { from: 1, to: 0, srcMac: "BB:22", dstMac: "AA:11" },
    learnMac: "BB:22",
    forwardTo: [0],
  },
  {
    description: "PC-C envía a PC-A. El switch ya conoce a PC-A → reenvía directo. Aprende también la MAC de C.",
    packet: { from: 2, to: 0, srcMac: "CC:33", dstMac: "AA:11" },
    learnMac: "CC:33",
    forwardTo: [0],
  },
  {
    description: "PC-D envía broadcast (FF:FF) → siempre se hace flood, sin importar la tabla.",
    packet: { from: 3, to: -1, srcMac: "DD:44", dstMac: "FF:FF" },
    learnMac: "DD:44",
    forwardTo: "flood",
  },
];

export function CamTableAnimation() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [table, setTable] = useState<{ mac: string; port: number; just: boolean }[]>([]);
  const [packetPos, setPacketPos] = useState<{ x: number; y: number } | null>(null);
  const [floodTargets, setFloodTargets] = useState<number[]>([]);
  const animRef = useRef<number | null>(null);

  function reset() {
    setStep(-1);
    setRunning(false);
    setTable([]);
    setPacketPos(null);
    setFloodTargets([]);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  async function runStep(idx: number) {
    if (idx >= STEPS.length) {
      setRunning(false);
      return;
    }
    setStep(idx);
    const s = STEPS[idx];
    if (!s.packet) return;

    // Animate packet from source host to switch
    const fromPos = hostPos(s.packet.from);
    const switchPos = { x: 400, y: 220 };
    await animatePoint(fromPos, switchPos, 700, setPacketPos);

    // Update table (learn source MAC)
    if (s.learnMac) {
      setTable((prev) => {
        const filtered = prev.map((e) => ({ ...e, just: false })).filter((e) => e.mac !== s.learnMac);
        return [...filtered, { mac: s.learnMac!, port: s.packet!.from, just: true }];
      });
    }

    await sleep(500);

    // Forward
    if (s.forwardTo === "flood") {
      const targets = HOSTS.filter((h) => h.id !== s.packet!.from).map((h) => h.id);
      setFloodTargets(targets);
      await Promise.all(
        targets.map((tid) => animatePointFanout(switchPos, hostPos(tid), 700))
      );
      setFloodTargets([]);
    } else if (Array.isArray(s.forwardTo)) {
      for (const tid of s.forwardTo) {
        await animatePoint(switchPos, hostPos(tid), 700, setPacketPos);
      }
    }
    setPacketPos(null);
    await sleep(400);
  }

  async function play() {
    if (running) return;
    setRunning(true);
    if (step >= STEPS.length - 1) {
      setStep(-1);
      setTable([]);
    }
    let i = step + 1;
    if (i < 0 || i >= STEPS.length) i = 0;
    if (i === 0) setTable([]);
    for (let idx = i; idx < STEPS.length; idx++) {
      await runStep(idx);
    }
    setRunning(false);
  }

  const currentStep = step >= 0 && step < STEPS.length ? STEPS[step] : null;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">{currentStep ? currentStep.description : "El switch arranca con la tabla CAM vacía. Reproducí para ver cómo aprende."}</p>
          <p className="text-slate-500">Paso {Math.max(0, step + 1)}/{STEPS.length}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <svg viewBox="0 0 800 440" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
          {/* Switch */}
          <rect x={300} y={180} width={200} height={80} rx={10} fill="#1e293b" stroke="#6366f1" strokeWidth={2} />
          <text x={400} y={215} fill="#fff" fontSize={16} textAnchor="middle" fontWeight="bold">SWITCH</text>
          <text x={400} y={235} fill="#94a3b8" fontSize={10} textAnchor="middle">tabla CAM</text>

          {/* Hosts and links */}
          {HOSTS.map((h) => {
            const p = hostPos(h.id);
            return (
              <g key={h.id}>
                <line x1={p.x} y1={p.y} x2={400} y2={220} stroke="#334155" strokeWidth={1.5} strokeDasharray={floodTargets.includes(h.id) ? "4 2" : "0"} />
                <rect x={p.x - 50} y={p.y - 25} width={100} height={50} rx={6} fill={h.color + "22"} stroke={h.color} strokeWidth={2} />
                <text x={p.x} y={p.y - 6} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">{h.name}</text>
                <text x={p.x} y={p.y + 12} fill={h.color} fontSize={11} textAnchor="middle" fontFamily="monospace">{h.mac}</text>
                <text x={portLabelPos(h.id).x} y={portLabelPos(h.id).y} fill="#64748b" fontSize={10} textAnchor="middle">P{h.id}</text>
              </g>
            );
          })}

          {/* Packet */}
          {packetPos && currentStep?.packet && (
            <g>
              <rect x={packetPos.x - 30} y={packetPos.y - 14} width={60} height={28} rx={4} fill="#fbbf24" stroke="#fff" strokeWidth={1} />
              <text x={packetPos.x} y={packetPos.y - 1} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
                {currentStep.packet.srcMac}
              </text>
              <text x={packetPos.x} y={packetPos.y + 10} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
                → {currentStep.packet.dstMac}
              </text>
            </g>
          )}
        </svg>

        {/* CAM Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-2">Tabla CAM</p>
          {table.length === 0 ? (
            <p className="text-slate-600 text-xs italic">vacía</p>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left pb-1">MAC</th>
                  <th className="text-left pb-1">Puerto</th>
                </tr>
              </thead>
              <tbody>
                {table.map((e) => (
                  <tr key={e.mac} className={e.just ? "text-amber-300" : "text-slate-300"}>
                    <td className="py-1">{e.mac}</td>
                    <td className="py-1">P{e.port}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AnimationFrame>
  );
}

function hostPos(id: number) {
  const positions = [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 100, y: 340 },
    { x: 700, y: 340 },
  ];
  return positions[id];
}

function portLabelPos(id: number) {
  // closer to the switch
  const pos = hostPos(id);
  const switchX = 400;
  const switchY = 220;
  return { x: (pos.x + switchX) / 2, y: (pos.y + switchY) / 2 - 4 };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function animatePoint(
  from: { x: number; y: number },
  to: { x: number; y: number },
  duration: number,
  setPos: (p: { x: number; y: number } | null) => void
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

// for flooding we don't care about pos updates, we just sleep for the right duration
function animatePointFanout(
  _from: { x: number; y: number },
  _to: { x: number; y: number },
  duration: number
): Promise<void> {
  return sleep(duration);
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton , sleep} from "./AnimationFrame";

type Phase = "idle" | "before" | "tagged" | "in-trunk" | "untagged" | "delivered";

export function Dot1Q() {
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
    setPhase("before");
    await sleep(1500);
    if (cancelRef.current) return;
    setPhase("tagged");
    await sleep(1700);
    if (cancelRef.current) return;
    setPhase("in-trunk");
    await sleep(1700);
    if (cancelRef.current) return;
    setPhase("untagged");
    await sleep(1700);
    if (cancelRef.current) return;
    setPhase("delivered");
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const captions: Record<Phase, string> = {
    idle: "Una trama Ethernet sale de PC-A (VLAN 10) hacia PC-B (también VLAN 10) en otro switch.",
    before: "PC-A envía la trama normal sin tag por el puerto access (que está en VLAN 10).",
    tagged: "Switch 1 inserta 4 bytes de tag 802.1Q antes de enviarla por el trunk. El VID=10 identifica la VLAN.",
    "in-trunk": "La trama tagged viaja por el trunk. Si hubiera otra VLAN (ej: 20), también iría por ahí pero con VID distinto.",
    untagged: "Switch 2 quita el tag y reenvía la trama original por el puerto access de PC-B.",
    delivered: "PC-B recibe una trama Ethernet normal. La VLAN fue transparente para los hosts.",
  };

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{captions[phase]}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* PC A */}
        <rect x={20} y={170} width={90} height={50} rx={6} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={65} y={195} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">PC-A</text>
        <text x={65} y={210} fill="#3fb950" fontSize={9} textAnchor="middle">VLAN 10</text>

        {/* Switch 1 */}
        <rect x={170} y={150} width={140} height={90} rx={8} fill="#1e293b" stroke="#6366f1" strokeWidth={2} />
        <text x={240} y={175} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">SW1</text>
        <text x={210} y={220} fill="#94a3b8" fontSize={8} textAnchor="middle">access P1</text>
        <text x={285} y={220} fill="#fbbf24" fontSize={8} textAnchor="middle">trunk</text>

        {/* Switch 2 */}
        <rect x={490} y={150} width={140} height={90} rx={8} fill="#1e293b" stroke="#6366f1" strokeWidth={2} />
        <text x={560} y={175} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">SW2</text>
        <text x={515} y={220} fill="#fbbf24" fontSize={8} textAnchor="middle">trunk</text>
        <text x={595} y={220} fill="#94a3b8" fontSize={8} textAnchor="middle">access P3</text>

        {/* PC B */}
        <rect x={690} y={170} width={90} height={50} rx={6} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={735} y={195} fill="#fff" fontSize={12} textAnchor="middle" fontWeight="bold">PC-B</text>
        <text x={735} y={210} fill="#3fb950" fontSize={9} textAnchor="middle">VLAN 10</text>

        {/* Lines */}
        <line x1={110} y1={195} x2={170} y2={195} stroke="#3fb950" strokeWidth={1.5} />
        <line x1={310} y1={195} x2={490} y2={195} stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="6 3" />
        <text x={400} y={140} fill="#fbbf24" fontSize={11} textAnchor="middle" fontWeight="bold">TRUNK 802.1Q</text>
        <line x1={630} y1={195} x2={690} y2={195} stroke="#3fb950" strokeWidth={1.5} />

        {/* Frame visualization */}
        {(phase === "before" || phase === "delivered") && (
          <FramePill x={phase === "before" ? 110 : 660} y={290} tagged={false} />
        )}
        {(phase === "tagged" || phase === "in-trunk" || phase === "untagged") && (
          <FramePill x={phase === "tagged" ? 240 : phase === "in-trunk" ? 400 : 560} y={290} tagged={true} />
        )}

        {/* Animated packet */}
        {phase === "before" && (
          <circle r={8} fill="#3fb950">
            <animate attributeName="cx" from={65} to={170} dur="1.4s" fill="freeze" />
            <animate attributeName="cy" from={195} to={195} dur="1.4s" fill="freeze" />
          </circle>
        )}
        {phase === "tagged" && (
          <g>
            <text x={240} y={130} fill="#fbbf24" fontSize={20} textAnchor="middle">⊕</text>
            <text x={240} y={250} fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight="bold">
              + tag VID=10
            </text>
          </g>
        )}
        {phase === "in-trunk" && (
          <rect x={350} y={185} width={100} height={20} rx={3} fill="#fbbf24" stroke="#fff">
            <animate attributeName="x" from={310} to={490} dur="1.5s" repeatCount="1" fill="freeze" />
          </rect>
        )}
        {phase === "untagged" && (
          <g>
            <text x={560} y={130} fill="#94a3b8" fontSize={20} textAnchor="middle">⊖</text>
            <text x={560} y={250} fill="#94a3b8" fontSize={10} textAnchor="middle" fontWeight="bold">
              − quita tag
            </text>
          </g>
        )}
        {phase === "delivered" && (
          <text x={735} y={150} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold">
            ✓ entregado
          </text>
        )}
      </svg>
    </AnimationFrame>
  );
}

function FramePill({ x, y, tagged }: { x: number; y: number; tagged: boolean }) {
  if (!tagged) {
    return (
      <g transform={`translate(${x - 95}, ${y - 25})`}>
        <rect width={190} height={50} rx={4} fill="#0f172a" stroke="#3fb950" strokeWidth={1.5} />
        <text x={95} y={-6} fill="#3fb950" fontSize={10} textAnchor="middle" fontWeight="bold">
          Trama Ethernet sin tag
        </text>
        <rect x={5} y={6} width={50} height={34} rx={3} fill="#f8514944" stroke="#f85149" strokeWidth={1} />
        <text x={30} y={28} fill="#f85149" fontSize={9} textAnchor="middle">MAC dst</text>
        <rect x={60} y={6} width={50} height={34} rx={3} fill="#fbbf2444" stroke="#fbbf24" strokeWidth={1} />
        <text x={85} y={28} fill="#fbbf24" fontSize={9} textAnchor="middle">MAC src</text>
        <rect x={115} y={6} width={70} height={34} rx={3} fill="#3fb95044" stroke="#3fb950" strokeWidth={1} />
        <text x={150} y={28} fill="#3fb950" fontSize={9} textAnchor="middle">payload</text>
      </g>
    );
  }
  return (
    <g transform={`translate(${x - 110}, ${y - 25})`}>
      <rect width={220} height={50} rx={4} fill="#0f172a" stroke="#fbbf24" strokeWidth={2} />
      <text x={110} y={-6} fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight="bold">
        Trama 802.1Q tagged
      </text>
      <rect x={5} y={6} width={45} height={34} rx={3} fill="#f8514944" stroke="#f85149" strokeWidth={1} />
      <text x={28} y={28} fill="#f85149" fontSize={9} textAnchor="middle">MAC dst</text>
      <rect x={55} y={6} width={45} height={34} rx={3} fill="#fbbf2444" stroke="#fbbf24" strokeWidth={1} />
      <text x={78} y={28} fill="#fbbf24" fontSize={9} textAnchor="middle">MAC src</text>
      <rect x={105} y={6} width={45} height={34} rx={3} fill="#a371f7" stroke="#a371f7" strokeWidth={1.5} />
      <text x={128} y={22} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">tag</text>
      <text x={128} y={34} fill="#0f172a" fontSize={8} textAnchor="middle" fontWeight="bold">VID=10</text>
      <rect x={155} y={6} width={60} height={34} rx={3} fill="#3fb95044" stroke="#3fb950" strokeWidth={1} />
      <text x={185} y={28} fill="#3fb950" fontSize={9} textAnchor="middle">payload</text>
    </g>
  );
}

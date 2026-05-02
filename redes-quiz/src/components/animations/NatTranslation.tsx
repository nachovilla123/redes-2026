"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const PUBLIC_IP = "181.12.45.67";

type PacketState = "idle" | "outgoing-pre" | "outgoing-post" | "returning-pre" | "returning-post";

export function NatTranslation() {
  const [step, setStep] = useState<PacketState>("idle");
  const [running, setRunning] = useState(false);
  const [packetPos, setPacketPos] = useState({ x: 90, y: 200 });
  const [tableEntry, setTableEntry] = useState<null | { priv: string; pubPort: number }>(null);
  const tickRef = useRef(0);

  function reset() {
    setStep("idle");
    setRunning(false);
    setPacketPos({ x: 90, y: 200 });
    setTableEntry(null);
  }

  async function play() {
    if (running) return;
    setRunning(true);
    reset();
    tickRef.current = 0;
    await sleep(200);

    // outgoing-pre: from PC to router (still has private IP)
    setStep("outgoing-pre");
    await animate({ x: 90, y: 200 }, { x: 380, y: 200 }, 1100, setPacketPos);

    // NAT translates
    setTableEntry({ priv: "192.168.1.10:52341", pubPort: 52341 });
    await sleep(800);

    // outgoing-post: from router to internet (public IP)
    setStep("outgoing-post");
    await animate({ x: 380, y: 200 }, { x: 720, y: 200 }, 1100, setPacketPos);
    await sleep(500);

    // returning-pre: from internet to router (back to public IP)
    setStep("returning-pre");
    await animate({ x: 720, y: 200 }, { x: 380, y: 200 }, 1100, setPacketPos);
    await sleep(500);

    // returning-post: from router back to PC (private IP again)
    setStep("returning-post");
    await animate({ x: 380, y: 200 }, { x: 90, y: 200 }, 1100, setPacketPos);

    setRunning(false);
  }

  useEffect(() => {
    return () => {};
  }, []);

  const captions: Record<PacketState, string> = {
    idle: "Tu PC quiere acceder a Google. Reproducí para ver cómo el router NAT traduce las direcciones.",
    "outgoing-pre": "PC envía paquete con origen 192.168.1.10:52341 hacia el router (su gateway).",
    "outgoing-post": "Router reescribe el origen a la IP pública. Anota la traducción en su tabla NAT.",
    "returning-pre": "Google responde a la IP pública del router (no sabe nada de la red privada).",
    "returning-post": "Router consulta su tabla NAT, identifica al dueño y reenvía a la IP privada.",
  };

  const packetData = (() => {
    switch (step) {
      case "outgoing-pre":
        return { src: "192.168.1.10:52341", dst: "142.250.80.46:443", color: "#58a6ff" };
      case "outgoing-post":
        return { src: `${PUBLIC_IP}:52341`, dst: "142.250.80.46:443", color: "#3fb950" };
      case "returning-pre":
        return { src: "142.250.80.46:443", dst: `${PUBLIC_IP}:52341`, color: "#d29922" };
      case "returning-post":
        return { src: "142.250.80.46:443", dst: "192.168.1.10:52341", color: "#a371f7" };
      default:
        return null;
    }
  })();

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">{captions[step]}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg viewBox="0 0 800 400" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* LAN */}
        <rect x={20} y={50} width={200} height={300} rx={10} fill="none" stroke="#334155" strokeDasharray="5 4" />
        <text x={120} y={40} fill="#64748b" fontSize={11} textAnchor="middle">LAN privada</text>

        {/* PC */}
        <rect x={50} y={170} width={140} height={60} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={120} y={195} fill="#fff" fontSize={13} fontWeight="bold" textAnchor="middle">PC</text>
        <text x={120} y={215} fill="#58a6ff" fontSize={10} fontFamily="monospace" textAnchor="middle">192.168.1.10</text>

        {/* Router */}
        <rect x={330} y={150} width={140} height={100} rx={10} fill="#1e293b" stroke="#fbbf24" strokeWidth={2} />
        <text x={400} y={175} fill="#fff" fontSize={13} fontWeight="bold" textAnchor="middle">ROUTER NAT</text>
        <text x={400} y={195} fill="#fbbf24" fontSize={10} fontFamily="monospace" textAnchor="middle">int: 192.168.1.1</text>
        <text x={400} y={210} fill="#fbbf24" fontSize={10} fontFamily="monospace" textAnchor="middle">ext: {PUBLIC_IP}</text>

        {/* Internet */}
        <rect x={580} y={50} width={200} height={300} rx={10} fill="none" stroke="#334155" strokeDasharray="5 4" />
        <text x={680} y={40} fill="#64748b" fontSize={11} textAnchor="middle">Internet</text>

        {/* Server */}
        <rect x={610} y={170} width={140} height={60} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={680} y={195} fill="#fff" fontSize={13} fontWeight="bold" textAnchor="middle">Google</text>
        <text x={680} y={215} fill="#3fb950" fontSize={10} fontFamily="monospace" textAnchor="middle">142.250.80.46</text>

        {/* Lines */}
        <line x1={190} y1={200} x2={330} y2={200} stroke="#334155" strokeWidth={1.5} />
        <line x1={470} y1={200} x2={610} y2={200} stroke="#334155" strokeWidth={1.5} />

        {/* NAT Table */}
        <g transform="translate(280, 280)">
          <rect width={240} height={90} rx={6} fill="#0f172a" stroke="#fbbf24" strokeWidth={1.5} />
          <text x={120} y={18} fill="#fbbf24" fontSize={10} fontWeight="bold" textAnchor="middle">TABLA NAT</text>
          {tableEntry ? (
            <g>
              <text x={10} y={42} fill="#94a3b8" fontSize={9}>Privado:</text>
              <text x={70} y={42} fill="#58a6ff" fontSize={11} fontFamily="monospace">
                {tableEntry.priv}
              </text>
              <text x={10} y={62} fill="#94a3b8" fontSize={9}>Público:</text>
              <text x={70} y={62} fill="#3fb950" fontSize={11} fontFamily="monospace">
                {PUBLIC_IP}:{tableEntry.pubPort}
              </text>
              <text x={10} y={82} fill="#94a3b8" fontSize={9}>Destino:</text>
              <text x={70} y={82} fill="#d29922" fontSize={11} fontFamily="monospace">
                142.250.80.46:443
              </text>
            </g>
          ) : (
            <text x={120} y={55} fill="#475569" fontSize={11} textAnchor="middle" fontStyle="italic">
              vacía
            </text>
          )}
        </g>

        {/* Animated packet */}
        {step !== "idle" && packetData && (
          <g>
            <rect
              x={packetPos.x - 75}
              y={packetPos.y - 22}
              width={150}
              height={44}
              rx={5}
              fill={packetData.color}
              stroke="#fff"
              strokeWidth={1}
            />
            <text x={packetPos.x} y={packetPos.y - 7} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
              src: {packetData.src}
            </text>
            <text x={packetPos.x} y={packetPos.y + 8} fill="#0f172a" fontSize={9} textAnchor="middle" fontWeight="bold">
              dst: {packetData.dst}
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

function animate(
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

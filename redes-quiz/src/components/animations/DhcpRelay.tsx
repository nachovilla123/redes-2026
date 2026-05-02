"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Phase =
  | "idle"
  | "client-discover"
  | "router-blocks"
  | "relay-unicast"
  | "server-offer"
  | "relay-back"
  | "client-receives";

export function DhcpRelay() {
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
    const seq: Phase[] = ["client-discover", "router-blocks", "relay-unicast", "server-offer", "relay-back", "client-receives"];
    for (const p of seq) {
      if (cancelRef.current) return;
      setPhase(p);
      await sleep(1500);
    }
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const captions: Record<Phase, string> = {
    idle: "Cliente sin IP en una subred (192.168.1.0/24). Servidor DHCP está en otra subred (10.0.0.0/24). El broadcast normalmente no cruza routers.",
    "client-discover": "Cliente envía DHCPDISCOVER como broadcast. Llega al router pero NO al servidor remoto.",
    "router-blocks": "Sin DHCP Relay, el router descartaría el broadcast. Pero está configurado como Relay Agent.",
    "relay-unicast": "El Relay Agent agrega su IP en el campo giaddr y reenvía el mensaje como UNICAST al servidor DHCP.",
    "server-offer": "Servidor recibe el unicast. Por giaddr sabe en qué subred está el cliente y elige una IP de ese pool.",
    "relay-back": "Servidor responde unicast al Relay. El Relay convierte la respuesta en broadcast para entregarla al cliente.",
    "client-receives": "Cliente recibe la oferta. Continúa el resto de DORA con el Relay como intermediario.",
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
      <svg viewBox="0 0 800 380" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Client subnet */}
        <rect x={20} y={50} width={210} height={300} rx={10} fill="none" stroke="#475569" strokeDasharray="5 4" />
        <text x={125} y={40} fill="#64748b" fontSize={11} textAnchor="middle">192.168.1.0/24</text>

        {/* Server subnet */}
        <rect x={580} y={50} width={210} height={300} rx={10} fill="none" stroke="#475569" strokeDasharray="5 4" />
        <text x={685} y={40} fill="#64748b" fontSize={11} textAnchor="middle">10.0.0.0/24</text>

        {/* Client */}
        <rect x={50} y={170} width={140} height={60} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
        <text x={120} y={195} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">Cliente</text>
        <text x={120} y={213} fill="#58a6ff" fontSize={10} textAnchor="middle" fontFamily="monospace">IP: 0.0.0.0</text>

        {/* Router (relay) */}
        <rect x={290} y={150} width={220} height={100} rx={10} fill="#1e293b" stroke="#fbbf24" strokeWidth={2} />
        <text x={400} y={175} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">ROUTER</text>
        <text x={400} y={193} fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight="bold">DHCP Relay Agent</text>
        <text x={400} y={210} fill="#fbbf24" fontSize={9} textAnchor="middle" fontFamily="monospace">192.168.1.1 (int)</text>
        <text x={400} y={224} fill="#fbbf24" fontSize={9} textAnchor="middle" fontFamily="monospace">10.0.0.2 (ext)</text>

        {/* Server */}
        <rect x={610} y={170} width={150} height={60} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
        <text x={685} y={195} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">DHCP Server</text>
        <text x={685} y={213} fill="#3fb950" fontSize={10} textAnchor="middle" fontFamily="monospace">10.0.0.10</text>

        {/* Lines */}
        <line x1={190} y1={200} x2={290} y2={200} stroke="#334155" strokeWidth={1.5} />
        <line x1={510} y1={200} x2={610} y2={200} stroke="#334155" strokeWidth={1.5} />

        {/* Animations */}
        {phase === "client-discover" && (
          <g>
            <line x1={190} y1={200} x2={290} y2={200} stroke="#58a6ff" strokeWidth={3} strokeDasharray="6 3" />
            <rect x={210} y={185} width={80} height={20} rx={3} fill="#58a6ff" stroke="#fff">
              <animate attributeName="x" from={190} to={290} dur="1.2s" fill="freeze" />
            </rect>
            <text x={230} y={155} fill="#58a6ff" fontSize={10} fontWeight="bold">📢 broadcast</text>
            <text x={250} y={200} fill="#0f172a" fontSize={10} textAnchor="middle" fontWeight="bold">
              <animate attributeName="x" from={230} to={330} dur="1.2s" fill="freeze" />
              DISCOVER
            </text>
          </g>
        )}

        {phase === "router-blocks" && (
          <g>
            <text x={400} y={130} fill="#f85149" fontSize={20} textAnchor="middle">🛑</text>
            <text x={400} y={290} fill="#f85149" fontSize={11} textAnchor="middle" fontWeight="bold">
              Broadcast NO cruza routers
            </text>
            <text x={400} y={310} fill="#fbbf24" fontSize={10} textAnchor="middle">
              ...pero el Relay Agent SÍ lo procesa
            </text>
          </g>
        )}

        {phase === "relay-unicast" && (
          <g>
            <line x1={510} y1={200} x2={610} y2={200} stroke="#fbbf24" strokeWidth={3} />
            <rect x={530} y={185} width={80} height={20} rx={3} fill="#fbbf24" stroke="#fff">
              <animate attributeName="x" from={510} to={610} dur="1.3s" fill="freeze" />
            </rect>
            <text x={550} y={155} fill="#fbbf24" fontSize={10} fontWeight="bold">🎯 unicast</text>
            <text x={570} y={200} fill="#0f172a" fontSize={10} textAnchor="middle" fontWeight="bold">
              <animate attributeName="x" from={550} to={650} dur="1.3s" fill="freeze" />
              giaddr=192.168.1.1
            </text>
          </g>
        )}

        {phase === "server-offer" && (
          <g>
            <text x={685} y={140} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold">
              ✓ ofrece IP del pool
            </text>
            <text x={685} y={155} fill="#3fb950" fontSize={10} textAnchor="middle" fontFamily="monospace">
              192.168.1.50
            </text>
          </g>
        )}

        {phase === "relay-back" && (
          <g>
            <line x1={510} y1={200} x2={610} y2={200} stroke="#3fb950" strokeWidth={3} />
            <rect x={530} y={185} width={80} height={20} rx={3} fill="#3fb950" stroke="#fff">
              <animate attributeName="x" from={610} to={510} dur="1.2s" fill="freeze" />
            </rect>
            <text x={570} y={200} fill="#0f172a" fontSize={10} textAnchor="middle" fontWeight="bold">
              <animate attributeName="x" from={570} to={470} dur="1.2s" fill="freeze" />
              OFFER
            </text>
          </g>
        )}

        {phase === "client-receives" && (
          <g>
            <line x1={190} y1={200} x2={290} y2={200} stroke="#3fb950" strokeWidth={3} />
            <rect x={210} y={185} width={80} height={20} rx={3} fill="#3fb950" stroke="#fff">
              <animate attributeName="x" from={290} to={190} dur="1.2s" fill="freeze" />
            </rect>
            <text x={250} y={200} fill="#0f172a" fontSize={10} textAnchor="middle" fontWeight="bold">
              <animate attributeName="x" from={250} to={150} dur="1.2s" fill="freeze" />
              OFFER
            </text>
            <text x={120} y={150} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold">
              ✓ IP recibida
            </text>
          </g>
        )}
      </svg>
    </AnimationFrame>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

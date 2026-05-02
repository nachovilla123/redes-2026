"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

const NUM_PACKETS = 6;
const LOSS_INDEX = 2; // packet #3 will be lost

export function TcpVsUdp() {
  const [running, setRunning] = useState(false);
  const [tcpDelivered, setTcpDelivered] = useState(0);
  const [tcpResent, setTcpResent] = useState(0);
  const [udpDelivered, setUdpDelivered] = useState(0);
  const [udpLost, setUdpLost] = useState(0);
  const [tick, setTick] = useState(0);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setRunning(false);
    setTcpDelivered(0);
    setTcpResent(0);
    setUdpDelivered(0);
    setUdpLost(0);
    setTick((t) => t + 1);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    reset();
    await sleep(150);
    setRunning(true);
    setTick((t) => t + 1);

    // Simulate both lanes in parallel via timeouts
    const start = Date.now();
    const stepDur = 700;

    // UDP: send NUM_PACKETS, lose LOSS_INDEX
    for (let i = 0; i < NUM_PACKETS; i++) {
      setTimeout(() => {
        if (cancelRef.current) return;
        if (i === LOSS_INDEX) setUdpLost((x) => x + 1);
        else setUdpDelivered((x) => x + 1);
      }, i * stepDur + 800);
    }

    // TCP: send NUM_PACKETS, lose LOSS_INDEX, retransmit it
    for (let i = 0; i < NUM_PACKETS; i++) {
      setTimeout(() => {
        if (cancelRef.current) return;
        if (i === LOSS_INDEX) {
          // not delivered yet — retransmission shows later
        } else {
          setTcpDelivered((x) => x + 1);
        }
      }, i * stepDur + 800);
    }

    // Retransmission of lost packet
    setTimeout(() => {
      if (cancelRef.current) return;
      setTcpResent(1);
    }, NUM_PACKETS * stepDur + 600);

    setTimeout(() => {
      if (cancelRef.current) return;
      setTcpDelivered((x) => x + 1);
    }, NUM_PACKETS * stepDur + 1500);

    setTimeout(() => {
      if (cancelRef.current) return;
      setRunning(false);
    }, NUM_PACKETS * stepDur + 2200);

    void start;
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium">
            Mismo escenario: 6 paquetes, el #3 se pierde. TCP detecta y retransmite. UDP simplemente lo pierde.
          </p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <svg key={tick} viewBox="0 0 800 460" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
        {/* Title rows */}
        <text x={400} y={25} fill="#58a6ff" fontSize={14} fontWeight="bold" textAnchor="middle">
          TCP — confiable
        </text>
        <text x={400} y={245} fill="#a371f7" fontSize={14} fontWeight="bold" textAnchor="middle">
          UDP — sin garantías
        </text>

        {/* TCP lane */}
        <Lane y={70} color="#58a6ff" tcp lossIndex={LOSS_INDEX} />

        {/* UDP lane */}
        <Lane y={290} color="#a371f7" lossIndex={LOSS_INDEX} />

        {/* Stats */}
        <g transform="translate(40, 200)">
          <text fill="#58a6ff" fontSize={11} fontFamily="monospace">
            ✓ Entregados: {tcpDelivered}/{NUM_PACKETS} · 🔁 Reenvíos: {tcpResent}
          </text>
        </g>
        <g transform="translate(40, 420)">
          <text fill="#a371f7" fontSize={11} fontFamily="monospace">
            ✓ Entregados: {udpDelivered}/{NUM_PACKETS} · ✗ Perdidos: {udpLost}
          </text>
        </g>
      </svg>
    </AnimationFrame>
  );
}

function Lane({ y, color, tcp = false, lossIndex }: { y: number; color: string; tcp?: boolean; lossIndex: number }) {
  const stepDur = 0.7;
  return (
    <g>
      {/* Endpoints */}
      <rect x={20} y={y} width={80} height={40} rx={6} fill="#1e293b" stroke={color} strokeWidth={2} />
      <text x={60} y={y + 24} fill="#fff" fontSize={11} textAnchor="middle" fontWeight="bold">
        TX
      </text>
      <rect x={700} y={y} width={80} height={40} rx={6} fill="#1e293b" stroke={color} strokeWidth={2} />
      <text x={740} y={y + 24} fill="#fff" fontSize={11} textAnchor="middle" fontWeight="bold">
        RX
      </text>
      <line x1={100} y1={y + 20} x2={700} y2={y + 20} stroke="#334155" strokeDasharray="3 3" />

      {/* Packets */}
      {Array.from({ length: NUM_PACKETS }).map((_, i) => {
        const lost = i === lossIndex;
        const fadeOut = lost ? 0.5 : 1;
        return (
          <g key={i}>
            <circle r={9} fill={lost ? "#f85149" : color} opacity={0}>
              <animate
                attributeName="opacity"
                values={lost ? "0;1;1;0" : "0;1;1;1"}
                dur={`${stepDur}s`}
                begin={`${i * stepDur + 0.3}s`}
                fill="freeze"
              />
              <animate
                attributeName="cx"
                from={100}
                to={lost ? 400 : 700}
                dur={`${stepDur}s`}
                begin={`${i * stepDur + 0.3}s`}
                fill="freeze"
              />
              <animate
                attributeName="cy"
                from={y + 20}
                to={y + 20}
                dur={`${stepDur}s`}
                begin={`${i * stepDur + 0.3}s`}
                fill="freeze"
              />
            </circle>
            <text x={0} y={0} fill="#fff" fontSize={9} textAnchor="middle" fontWeight="bold" opacity={0}>
              <animate
                attributeName="opacity"
                values={lost ? "0;1;1;0" : "0;1;1;1"}
                dur={`${stepDur}s`}
                begin={`${i * stepDur + 0.3}s`}
                fill="freeze"
              />
              <animate
                attributeName="x"
                from={100}
                to={lost ? 400 : 700}
                dur={`${stepDur}s`}
                begin={`${i * stepDur + 0.3}s`}
                fill="freeze"
              />
              <animate attributeName="y" from={y + 23} to={y + 23} dur={`${stepDur}s`} begin={`${i * stepDur + 0.3}s`} fill="freeze" />
              {i + 1}
            </text>
            {lost && (
              <text x={400} y={y + 5} fill="#f85149" fontSize={18} textAnchor="middle" opacity={0}>
                <animate attributeName="opacity" values="0;0;1;1;0" dur="1.5s" begin={`${i * stepDur + 0.7}s`} fill="freeze" />
                ✕
              </text>
            )}
          </g>
        );
      })}

      {/* TCP retransmission */}
      {tcp && (
        <g>
          <circle r={9} fill="#fbbf24" opacity={0}>
            <animate
              attributeName="opacity"
              values="0;1;1;1"
              dur={`${stepDur}s`}
              begin={`${NUM_PACKETS * stepDur + 0.8}s`}
              fill="freeze"
            />
            <animate
              attributeName="cx"
              from={100}
              to={700}
              dur={`${stepDur}s`}
              begin={`${NUM_PACKETS * stepDur + 0.8}s`}
              fill="freeze"
            />
            <animate
              attributeName="cy"
              from={y + 20}
              to={y + 20}
              dur={`${stepDur}s`}
              begin={`${NUM_PACKETS * stepDur + 0.8}s`}
              fill="freeze"
            />
          </circle>
          <text fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight="bold" opacity={0}>
            <animate
              attributeName="opacity"
              values="0;1;1;1"
              dur={`${stepDur}s`}
              begin={`${NUM_PACKETS * stepDur + 0.8}s`}
              fill="freeze"
            />
            <animate
              attributeName="x"
              from={100}
              to={700}
              dur={`${stepDur}s`}
              begin={`${NUM_PACKETS * stepDur + 0.8}s`}
              fill="freeze"
            />
            <animate attributeName="y" from={y + 6} to={y + 6} dur={`${stepDur}s`} begin={`${NUM_PACKETS * stepDur + 0.8}s`} fill="freeze" />
            🔁 retransmite #{lossIndex + 1}
          </text>
        </g>
      )}
    </g>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

type Violation = "protect" | "restrict" | "shutdown";

const VIOLATION_INFO: Record<Violation, { name: string; detail: string; logs: boolean; portDown: boolean }> = {
  protect: {
    name: "Protect",
    detail: "Descarta tramas de MAC no autorizada en silencio. El puerto sigue funcionando para las MAC permitidas.",
    logs: false,
    portDown: false,
  },
  restrict: {
    name: "Restrict",
    detail: "Descarta + envía notificación SNMP/syslog y aumenta el contador de violaciones.",
    logs: true,
    portDown: false,
  },
  shutdown: {
    name: "Shutdown (default Cisco)",
    detail: "Descarta + pasa el puerto a estado err-disabled (apagado). Requiere intervención manual para volver a habilitarlo.",
    logs: true,
    portDown: true,
  },
};

type Phase = "idle" | "auth-pass" | "intruder-detected" | "violation-applied";

const ALLOWED_MAC = "AA:11:22:33:44:55";
const INTRUDER_MAC = "BB:DE:AD:BE:EF:99";

export function PortSecurity() {
  const [violationMode, setViolationMode] = useState<Violation>("shutdown");
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const [counter, setCounter] = useState(0);
  const [portDown, setPortDown] = useState(false);
  const cancelRef = useRef(false);

  function reset() {
    cancelRef.current = true;
    setPhase("idle");
    setRunning(false);
    setCounter(0);
    setPortDown(false);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    reset();
    await sleep(300);
    if (cancelRef.current) return;

    // 1. Authorized PC sends → passes
    setPhase("auth-pass");
    await sleep(2000);
    if (cancelRef.current) return;

    // 2. Intruder appears
    setPhase("intruder-detected");
    await sleep(1700);
    if (cancelRef.current) return;

    // 3. Violation action
    setPhase("violation-applied");
    setCounter((c) => c + 1);
    if (VIOLATION_INFO[violationMode].portDown) setPortDown(true);
    await sleep(1500);

    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const v = VIOLATION_INFO[violationMode];

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            <span className="font-bold mr-2 text-indigo-300">Modo {v.name}</span>
            {v.detail}
          </p>
          <p className="text-slate-500 text-xs">
            {phase === "auth-pass" && `✓ MAC ${ALLOWED_MAC} está en la lista permitida → trama aceptada.`}
            {phase === "intruder-detected" && `🚨 MAC ${INTRUDER_MAC} no está en la lista → violación detectada.`}
            {phase === "violation-applied" && `✂ Acción ${v.name} aplicada${portDown ? " — puerto err-disabled" : ""}.`}
            {phase === "idle" && "Tocá un modo y reproducí. Se conectan dos PCs: una autorizada y una intrusa."}
          </p>
        </div>
      }
      controls={
        <>
          {(["protect", "restrict", "shutdown"] as Violation[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setViolationMode(m);
                reset();
                setTimeout(play, 200);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                violationMode === m ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {VIOLATION_INFO[m].name}
            </button>
          ))}
          <PlayButton running={running} onPlay={play} onReset={reset} />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        <svg viewBox="0 0 700 380" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
          {/* Allowed PC */}
          <rect x={20} y={70} width={140} height={60} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
          <text x={90} y={95} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">PC autorizada</text>
          <text x={90} y={113} fill="#3fb950" fontSize={9} textAnchor="middle" fontFamily="monospace">{ALLOWED_MAC}</text>

          {/* Intruder */}
          <rect x={20} y={250} width={140} height={60} rx={8} fill="#1e293b" stroke="#f85149" strokeWidth={2} />
          <text x={90} y={275} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">PC intrusa 😈</text>
          <text x={90} y={293} fill="#f85149" fontSize={9} textAnchor="middle" fontFamily="monospace">{INTRUDER_MAC}</text>

          {/* Switch port */}
          <rect x={300} y={150} width={130} height={80} rx={10} fill="#1e293b" stroke={portDown ? "#f85149" : "#fbbf24"} strokeWidth={2.5} />
          <text x={365} y={178} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">SWITCH</text>
          <text x={365} y={196} fill={portDown ? "#f85149" : "#fbbf24"} fontSize={10} textAnchor="middle">
            {portDown ? "puerto: ERR-DISABLE" : "puerto: up"}
          </text>
          <text x={365} y={213} fill="#94a3b8" fontSize={9} textAnchor="middle">port-security</text>

          {/* Network */}
          <rect x={550} y={150} width={130} height={80} rx={10} fill="none" stroke="#475569" strokeDasharray="5 4" />
          <text x={615} y={193} fill="#94a3b8" fontSize={11} textAnchor="middle">resto de la red</text>

          {/* Lines */}
          <line x1={160} y1={100} x2={300} y2={170} stroke={portDown && phase === "violation-applied" ? "#f85149" : "#475569"} strokeWidth={1.5} strokeDasharray={portDown ? "5 3" : "0"} />
          <line x1={160} y1={280} x2={300} y2={210} stroke={portDown && phase === "violation-applied" ? "#f85149" : "#475569"} strokeWidth={1.5} strokeDasharray={portDown ? "5 3" : "0"} />
          <line x1={430} y1={190} x2={550} y2={190} stroke={portDown ? "#f85149" : "#475569"} strokeWidth={1.5} strokeDasharray={portDown ? "5 3" : "0"} />

          {/* Authorized passes */}
          {phase === "auth-pass" && (
            <g>
              <rect width={70} height={20} rx={3} fill="#3fb950" stroke="#fff">
                <animate attributeName="x" from={160} to={550} dur="1.7s" fill="freeze" />
                <animate attributeName="y" from={90} to={180} dur="1.7s" fill="freeze" />
              </rect>
              <text fill="#0f172a" fontSize={9} fontWeight="bold" textAnchor="middle">
                <animate attributeName="x" from={195} to={585} dur="1.7s" fill="freeze" />
                <animate attributeName="y" from={104} to={194} dur="1.7s" fill="freeze" />
                ✓ MAC ok
              </text>
            </g>
          )}

          {/* Intruder detected at switch */}
          {phase === "intruder-detected" && (
            <g>
              <rect width={70} height={20} rx={3} fill="#f85149" stroke="#fff">
                <animate attributeName="x" from={160} to={300} dur="1.2s" fill="freeze" />
                <animate attributeName="y" from={270} to={200} dur="1.2s" fill="freeze" />
              </rect>
              <text fill="#fff" fontSize={9} fontWeight="bold" textAnchor="middle">
                <animate attributeName="x" from={195} to={335} dur="1.2s" fill="freeze" />
                <animate attributeName="y" from={284} to={214} dur="1.2s" fill="freeze" />
                MAC?
              </text>
              <text x={365} y={130} fill="#f85149" fontSize={20} textAnchor="middle">
                <animate attributeName="opacity" values="0;1" dur="0.5s" begin="1.2s" fill="freeze" />
                🚨
              </text>
            </g>
          )}

          {/* Violation applied */}
          {phase === "violation-applied" && (
            <g>
              <text x={365} y={135} fill="#f85149" fontSize={14} textAnchor="middle" fontWeight="bold">
                ✕ DROP
              </text>
              {portDown && (
                <text x={365} y={260} fill="#f85149" fontSize={11} textAnchor="middle" fontWeight="bold">
                  🔌 puerto apagado
                </text>
              )}
            </g>
          )}
        </svg>

        {/* Side panel: allowed list + counter */}
        <div className="space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">MACs permitidas</p>
            <div className="font-mono text-[11px] text-emerald-300 bg-slate-800 rounded p-2">
              {ALLOWED_MAC}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">max-addresses: 1</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-amber-400 mb-2">Estado del puerto</p>
            <div className={`font-mono text-xs font-bold ${portDown ? "text-red-400" : "text-green-400"}`}>
              {portDown ? "🔴 err-disabled" : "🟢 up"}
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Violaciones: <span className="text-amber-400 font-bold">{counter}</span>
            </div>
            {VIOLATION_INFO[violationMode].logs && counter > 0 && (
              <div className="mt-2 text-[10px] text-slate-500">
                📋 syslog/SNMP enviado
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[10px] text-slate-400 leading-relaxed">
            <p className="font-bold text-slate-300 mb-1">Configuración Cisco:</p>
            <code className="text-amber-300 block">switchport port-security</code>
            <code className="text-amber-300 block">switchport port-security maximum 1</code>
            <code className="text-amber-300 block">switchport port-security violation {violationMode}</code>
          </div>
        </div>
      </div>
    </AnimationFrame>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton , sleep} from "./AnimationFrame";

type Phase = "idle" | "request" | "processing" | "response" | "rendered";

export function HttpRequest() {
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
    setPhase("request");
    await sleep(2000);
    if (cancelRef.current) return;
    setPhase("processing");
    await sleep(1300);
    if (cancelRef.current) return;
    setPhase("response");
    await sleep(2000);
    if (cancelRef.current) return;
    setPhase("rendered");
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const captions: Record<Phase, string> = {
    idle: "Una petición HTTP típica: el cliente envía un mensaje formateado, el servidor responde con otro.",
    request: "El navegador envía una request: método, ruta, versión, headers y opcionalmente body.",
    processing: "El servidor recibe, valida headers, busca el recurso y arma la respuesta.",
    response: "La response viene con status code, headers y el body (HTML, JSON, imagen, etc.).",
    rendered: "El navegador renderiza la respuesta. Si era HTML, dispara más requests para CSS, JS, imágenes.",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Diagram */}
        <svg viewBox="0 0 400 280" className="w-full h-auto bg-slate-900 rounded-xl border border-slate-800">
          {/* Client */}
          <rect x={20} y={110} width={100} height={60} rx={8} fill="#1e293b" stroke="#58a6ff" strokeWidth={2} />
          <text x={70} y={135} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">Browser</text>
          <text x={70} y={152} fill="#58a6ff" fontSize={10} textAnchor="middle">cliente</text>

          {/* Server */}
          <rect x={280} y={110} width={100} height={60} rx={8} fill="#1e293b" stroke="#3fb950" strokeWidth={2} />
          <text x={330} y={135} fill="#fff" fontSize={13} textAnchor="middle" fontWeight="bold">Server</text>
          <text x={330} y={152} fill="#3fb950" fontSize={10} textAnchor="middle">api.example.com</text>

          <line x1={120} y1={140} x2={280} y2={140} stroke="#475569" strokeDasharray="3 3" />

          {/* Request animation */}
          {phase === "request" && (
            <g>
              <rect x={130} y={120} width={60} height={20} rx={3} fill="#58a6ff" stroke="#fff">
                <animate attributeName="x" from={120} to={220} dur="1.8s" fill="freeze" />
              </rect>
              <text fill="#0f172a" fontSize={10} fontWeight="bold" textAnchor="middle">
                <animate attributeName="x" from={150} to={250} dur="1.8s" fill="freeze" />
                <animate attributeName="y" from={134} to={134} dur="1.8s" fill="freeze" />
                GET /
              </text>
            </g>
          )}

          {/* Processing */}
          {phase === "processing" && (
            <g>
              <text x={330} y={100} fill="#fbbf24" fontSize={20} textAnchor="middle">⚙️</text>
              <rect x={290} y={170} width={80} height={4} rx={2} fill="#1e293b" />
              <rect x={290} y={170} width={0} height={4} rx={2} fill="#fbbf24">
                <animate attributeName="width" from={0} to={80} dur="1.2s" fill="freeze" />
              </rect>
            </g>
          )}

          {/* Response */}
          {phase === "response" && (
            <g>
              <rect x={210} y={120} width={80} height={20} rx={3} fill="#3fb950" stroke="#fff">
                <animate attributeName="x" from={280} to={120} dur="1.8s" fill="freeze" />
              </rect>
              <text fill="#0f172a" fontSize={10} fontWeight="bold" textAnchor="middle">
                <animate attributeName="x" from={250} to={150} dur="1.8s" fill="freeze" />
                <animate attributeName="y" from={134} to={134} dur="1.8s" fill="freeze" />
                200 OK
              </text>
            </g>
          )}

          {/* Rendered */}
          {phase === "rendered" && (
            <g>
              <text x={70} y={100} fill="#3fb950" fontSize={11} textAnchor="middle" fontWeight="bold">
                ✓ HTML renderizado
              </text>
              <text x={70} y={195} fill="#94a3b8" fontSize={9} textAnchor="middle">
                {`<h1>Hello!</h1>`}
              </text>
            </g>
          )}

          {/* Phase label */}
          <text x={200} y={250} fill="#fbbf24" fontSize={11} textAnchor="middle">
            puerto destino: 443 (HTTPS) o 80 (HTTP)
          </text>
        </svg>

        {/* Message panes */}
        <div className="flex flex-col gap-3">
          <div
            className={`bg-slate-900 border rounded-xl p-3 transition-all ${
              phase === "request" || phase === "processing" || phase === "response" || phase === "rendered"
                ? "border-blue-400"
                : "border-slate-800 opacity-50"
            }`}
          >
            <p className="text-blue-400 text-xs font-bold mb-2 uppercase tracking-widest">→ Request</p>
            <pre className="text-[11px] font-mono text-slate-300 leading-relaxed">
{`GET / HTTP/1.1
Host: api.example.com
User-Agent: Chrome/120
Accept: text/html
Cookie: session=abc123

`}
            </pre>
          </div>
          <div
            className={`bg-slate-900 border rounded-xl p-3 transition-all ${
              phase === "response" || phase === "rendered" ? "border-green-400" : "border-slate-800 opacity-50"
            }`}
          >
            <p className="text-green-400 text-xs font-bold mb-2 uppercase tracking-widest">← Response</p>
            <pre className="text-[11px] font-mono text-slate-300 leading-relaxed">
{`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 124
Set-Cookie: theme=dark

<html>
  <h1>Hello!</h1>
</html>`}
            </pre>
          </div>
        </div>
      </div>
    </AnimationFrame>
  );
}

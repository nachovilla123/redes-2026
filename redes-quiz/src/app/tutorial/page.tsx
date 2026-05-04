"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, ChevronLeft } from "lucide-react";

const DEMO_CARD = {
  front: "¿Qué es CSMA/CA y para qué sirve?",
  back: "Carrier Sense Multiple Access / Collision Avoidance: el protocolo que usa WiFi para evitar colisiones.\n\nAntes de transmitir, el dispositivo escucha el canal y espera un tiempo aleatorio. Si el canal está libre, transmite. Si hay colisión, espera más tiempo aleatorio y reintenta.",
  tag: "WiFi",
};

type Step = 1 | 2 | 3 | 4 | 5;

const HINTS: Record<number, { text: string; sub?: string }> = {
  1: { text: "Tocá la card para ver la respuesta", sub: "Podés volver a verla tocándola de nuevo" },
  2: { text: "¡Bien! Tocá de nuevo para volver a la pregunta" },
  3: { text: "Dos opciones desde el frente", sub: "\"Ya la sé\" la da por dominada sin verla · \"Ver respuesta\" la muestra primero" },
  4: { text: "¿La sabías?", sub: "\"Lo sé\" la da por dominada · \"A repasar\" la vuelve a poner en la cola · ← deshace la última acción" },
};

export default function TutorialPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isFlipped, setIsFlipped] = useState(false);

  function handleCardClick() {
    if (step === 1) { setIsFlipped(true);  setStep(2); return; }
    if (step === 2) { setIsFlipped(false); setStep(3); return; }
  }

  function handleVerRespuesta() {
    if (step !== 3) return;
    setIsFlipped(true);
    setStep(4);
  }

  function handleYaLaSe() {
    if (step !== 3) return;
    setStep(5);
  }

  function handleMark() {
    if (step !== 4) return;
    setStep(5);
  }

  function handleFinish() {
    localStorage.setItem("redes_onboarding_done", "1");
    router.push("/");
  }

  // ── Pantalla final ────────────────────────────────────────────────────────
  if (step === 5) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <PartyPopper className="w-14 h-14 text-blue-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-white mb-3">¡Ya sabés cómo funciona!</h2>
          <p className="text-slate-400 text-sm mb-8">
            Ahora elegí un tema y empezá a estudiar de verdad.
          </p>
          <button
            onClick={handleFinish}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl py-4 transition-colors"
          >
            Ir al inicio →
          </button>
        </div>
      </main>
    );
  }

  const hint = HINTS[step];
  const cardIsClickable = step === 1 || step === 2;

  return (
    <main className="min-h-dvh flex flex-col px-4 pt-4 pb-6 sm:pt-8 sm:pb-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-xl mx-auto mb-4 flex items-center justify-between">
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
          Tutorial · Paso {step} de 4
        </span>
        <button
          onClick={handleFinish}
          className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
        >
          Saltar tutorial →
        </button>
      </div>

      {/* ── Hint banner ────────────────────────────────────────────────── */}
      <div className="w-full max-w-xl mx-auto mb-4">
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl px-4 py-3">
          <p className="text-blue-300 text-sm font-semibold">{hint.text}</p>
          {hint.sub && <p className="text-blue-400/60 text-xs mt-1">{hint.sub}</p>}
        </div>
      </div>

      {/* ── Card ───────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-xl mx-auto mb-4">
        {!isFlipped ? (
          <div
            key="front"
            onClick={cardIsClickable ? handleCardClick : undefined}
            className={`card-face select-none h-full min-h-40 bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-5 sm:p-8 text-center transition-all border-2 ${
              step === 1
                ? "border-blue-500 ring-4 ring-blue-500/20 cursor-pointer"
                : "border-slate-700 cursor-default"
            }`}
          >
            <span className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-4">
              {DEMO_CARD.tag}
            </span>
            <p className="text-white text-lg sm:text-xl font-semibold leading-relaxed">
              {DEMO_CARD.front}
            </p>
            {step === 1 && (
              <p className="text-blue-400 text-xs mt-6 animate-pulse">tocá la card ↑</p>
            )}
          </div>
        ) : (
          <div
            key="back"
            onClick={step === 2 ? handleCardClick : undefined}
            className={`card-face select-none h-full min-h-40 bg-slate-800 rounded-2xl flex flex-col p-5 sm:p-8 overflow-y-auto transition-all border-2 ${
              step === 2
                ? "border-blue-500 ring-4 ring-blue-500/20 cursor-pointer"
                : "border-slate-600 cursor-default"
            }`}
          >
            <span className="text-xs text-blue-400 uppercase tracking-widest font-medium mb-4">
              Respuesta
            </span>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {DEMO_CARD.back}
            </p>
            {step === 2 && (
              <p className="text-blue-400 text-xs mt-6 animate-pulse">tocá la card para volver ↑</p>
            )}
          </div>
        )}
      </div>

      {/* ── Buttons ────────────────────────────────────────────────────── */}
      <div className="w-full max-w-xl mx-auto">
        {/* Steps 1 & 2: layout fantasma, no interactivo */}
        {(step === 1 || step === 2) && (
          <div className="flex gap-3 opacity-30 pointer-events-none select-none">
            <div className="w-11 shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl py-4">
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 font-semibold rounded-xl py-4 text-sm text-center">
              ✓ Ya la sé
            </div>
            <div className="flex-1 bg-blue-600 text-white font-semibold rounded-xl py-4 text-center">
              Ver respuesta
            </div>
          </div>
        )}

        {/* Step 3: frente con botones activos */}
        {step === 3 && !isFlipped && (
          <div className="flex gap-3">
            <div className="w-11 shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl opacity-30 cursor-not-allowed">
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </div>
            <button
              onClick={handleYaLaSe}
              className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 active:scale-95 border border-slate-700 text-slate-300 font-semibold rounded-xl py-4 transition-all text-sm ring-2 ring-slate-500/30"
            >
              ✓ Ya la sé
            </button>
            <button
              onClick={handleVerRespuesta}
              className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl py-4 transition-all ring-2 ring-blue-400/40"
            >
              Ver respuesta
            </button>
          </div>
        )}

        {/* Step 4: dorso con A repasar / Lo sé */}
        {step === 4 && isFlipped && (
          <div className="flex gap-3">
            <div className="w-11 shrink-0 flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl opacity-30 cursor-not-allowed">
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <p className="text-yellow-500/80 text-xs text-center font-medium">No la sabías</p>
              <button
                onClick={handleMark}
                className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 active:bg-yellow-500/30 active:scale-95 border border-yellow-500/30 text-yellow-400 font-semibold rounded-xl py-4 transition-all ring-2 ring-yellow-500/30"
              >
                ↩ A repasar
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <p className="text-green-500/80 text-xs text-center font-medium">La tenías clara</p>
              <button
                onClick={handleMark}
                className="w-full bg-green-500/10 hover:bg-green-500/20 active:bg-green-500/30 active:scale-95 border border-green-500/30 text-green-400 font-semibold rounded-xl py-4 transition-all ring-2 ring-green-500/30"
              >
                ✓ Lo sé
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

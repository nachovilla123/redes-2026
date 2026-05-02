"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Velocidad global para los `sleep()` async. 1 = velocidad escrita por la animación.
// Por debajo de 1 → más rápido. Por encima de 1 → más lento.
let SLOW_FACTOR = 1.6;
const speedListeners: Array<(n: number) => void> = [];

export function setSpeedFactor(n: number) {
  SLOW_FACTOR = n;
  speedListeners.forEach((l) => l(n));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms * SLOW_FACTOR));
}

function useSpeedFactor() {
  const [s, setS] = useState(SLOW_FACTOR);
  useEffect(() => {
    speedListeners.push(setS);
    return () => {
      const i = speedListeners.indexOf(setS);
      if (i >= 0) speedListeners.splice(i, 1);
    };
  }, []);
  return s;
}

export function AnimationFrame({
  children,
  controls,
  caption,
}: {
  children: ReactNode;
  controls?: ReactNode;
  caption?: ReactNode;
}) {
  const speed = useSpeedFactor();
  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-auto">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
        <div className="w-full max-w-3xl">{children}</div>
      </div>
      {(controls || caption) && (
        <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-3 flex flex-col gap-3">
          {caption && <div className="text-xs text-slate-400 leading-relaxed">{caption}</div>}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <SpeedControl current={speed} onChange={setSpeedFactor} />
            {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

const SPEED_PRESETS: Array<{ label: string; value: number }> = [
  { label: "🐢 Lento", value: 2.4 },
  { label: "🚶 Normal", value: 1.6 },
  { label: "🏃 Rápido", value: 1 },
  { label: "⚡ Muy rápido", value: 0.5 },
];

function SpeedControl({ current, onChange }: { current: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mr-1">Velocidad</span>
      {SPEED_PRESETS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors ${
            Math.abs(current - p.value) < 0.05
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-400"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function PlayButton({
  running,
  onPlay,
  onReset,
}: {
  running: boolean;
  onPlay: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onPlay}
        disabled={running}
        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
      >
        {running ? "Reproduciendo..." : "▶ Reproducir"}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
      >
        Reset
      </button>
    </>
  );
}

/**
 * Controles step-by-step: Anterior · Siguiente · Auto/Pausa · Reset.
 * Para animaciones que tienen pasos discretos (1..n).
 */
export function StepControls({
  step,
  total,
  onNext,
  onPrev,
  onAuto,
  onPause,
  onReset,
  running,
}: {
  step: number;
  total: number;
  onNext: () => void;
  onPrev?: () => void;
  onAuto: () => void;
  onPause?: () => void;
  onReset: () => void;
  running: boolean;
}) {
  const atStart = step <= 0;
  const atEnd = step >= total - 1;
  return (
    <>
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          disabled={atStart || running}
          className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium rounded-lg transition-colors"
          title="Paso anterior"
        >
          ← Atrás
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={atEnd || running}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors"
        title="Avanzar un paso"
      >
        Siguiente paso →
      </button>
      {running && onPause ? (
        <button
          type="button"
          onClick={onPause}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors"
          title="Pausar reproducción automática"
        >
          ⏸ Pausa
        </button>
      ) : (
        <button
          type="button"
          onClick={onAuto}
          disabled={running}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          title="Reproducir automáticamente"
        >
          ▶ Auto
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
      >
        Reset
      </button>
    </>
  );
}

/**
 * Hook unificado para animaciones por pasos.
 * Manejá `step` (-1 = no empezó, 0..total-1 = paso N) y delega el auto-play
 * a un `setTimeout` que respeta el slow factor global.
 */
export function useStepRunner(total: number, autoStepMs: number = 1500): {
  step: number;
  running: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  auto: () => void;
} {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  function next() {
    setStep((s) => Math.min(s + 1, total - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    cancelRef.current = true;
    setStep(-1);
    setRunning(false);
    setTimeout(() => {
      cancelRef.current = false;
    }, 50);
  }
  function auto() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    if (step >= total - 1) setStep(-1);
    let i = step >= total - 1 || step < 0 ? 0 : step + 1;
    setStep(i);
    const tick = () => {
      if (cancelRef.current) {
        setRunning(false);
        return;
      }
      i++;
      if (i >= total) {
        setRunning(false);
        return;
      }
      setStep(i);
      setTimeout(tick, autoStepMs * SLOW_FACTOR);
    };
    setTimeout(tick, autoStepMs * SLOW_FACTOR);
  }

  return { step, running, next, prev, reset, auto };
}

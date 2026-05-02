"use client";

import { useState, type ReactNode } from "react";

export function AnimationFrame({
  children,
  controls,
  caption,
}: {
  children: ReactNode;
  controls?: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-auto">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
        <div className="w-full max-w-3xl">{children}</div>
      </div>
      {(controls || caption) && (
        <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {caption && <div className="text-xs text-slate-400 leading-relaxed">{caption}</div>}
          {controls && <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">{controls}</div>}
        </div>
      )}
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

export function useAnimationStep(initialStep = 0): {
  step: number;
  setStep: (n: number) => void;
  running: boolean;
  setRunning: (b: boolean) => void;
  reset: () => void;
} {
  const [step, setStep] = useState(initialStep);
  const [running, setRunning] = useState(false);
  function reset() {
    setStep(initialStep);
    setRunning(false);
  }
  return { step, setStep, running, setRunning, reset };
}

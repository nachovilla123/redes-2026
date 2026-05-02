"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationFrame, PlayButton } from "./AnimationFrame";

// Datos: 1101011011  (10 bits)
// Polinomio generador G: 10011 (5 bits → grado 4 → CRC de 4 bits)
// Datos extendidos con 4 ceros: 11010110110000
// Resto al dividir por XOR: 1110

const DATA = "1101011011";
const G = "10011";
const EXTENDED = DATA + "0000";

type StepData = {
  highlight: number; // start index of current segment
  before: string;
  after: string;
  description: string;
};

function computeSteps(): StepData[] {
  const steps: StepData[] = [];
  const arr = EXTENDED.split("");
  let i = 0;
  while (i <= arr.length - G.length) {
    if (arr[i] === "0") {
      i++;
      continue;
    }
    const before = arr.join("");
    // XOR with G at position i
    for (let k = 0; k < G.length; k++) {
      const a = arr[i + k] === "1";
      const b = G[k] === "1";
      arr[i + k] = a !== b ? "1" : "0";
    }
    const after = arr.join("");
    steps.push({
      highlight: i,
      before,
      after,
      description: `XOR del segmento que empieza en bit ${i + 1}: divide cuando el primer bit es 1.`,
    });
    i++;
  }
  return steps;
}

export function Crc() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);
  const steps = computeSteps();
  const remainder = steps.length > 0 ? steps[steps.length - 1].after.slice(-4) : "0000";

  function reset() {
    cancelRef.current = true;
    setStep(-1);
    setRunning(false);
    setTimeout(() => (cancelRef.current = false), 100);
  }

  async function play() {
    if (running) return;
    cancelRef.current = false;
    setRunning(true);
    setStep(-1);
    await sleep(400);
    for (let i = 0; i < steps.length; i++) {
      if (cancelRef.current) return;
      setStep(i);
      await sleep(1400);
    }
    if (!cancelRef.current) setRunning(false);
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const current = step >= 0 ? steps[step] : null;
  const displayString = current ? current.after : EXTENDED;
  const finalDone = step === steps.length - 1;

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">
            {current
              ? current.description
              : `Datos = ${DATA}, polinomio generador G = ${G} (grado 4 → CRC de 4 bits). Se agregan 4 ceros al final y se divide por G usando XOR.`}
          </p>
          {finalDone && (
            <p className="text-amber-400 font-mono">
              Resto = <span className="font-bold">{remainder}</span> → este es el CRC. Se transmite {DATA + remainder}.
            </p>
          )}
          <p className="text-slate-500">Paso {Math.max(0, step + 1)}/{steps.length}</p>
        </div>
      }
      controls={<PlayButton running={running} onPlay={play} onReset={reset} />}
    >
      <div className="font-mono bg-slate-900 border border-slate-800 rounded-xl p-6 text-base sm:text-lg">
        <div className="text-slate-500 text-xs mb-3 uppercase tracking-widest">División XOR (long division)</div>

        {/* Header: dividend with G applied step by step */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-400 w-12 text-xs">datos:</span>
          <span className="text-blue-300 tracking-widest">{DATA}</span>
          <span className="text-slate-500 mx-1">+</span>
          <span className="text-slate-500 tracking-widest">0000</span>
          <span className="text-slate-500 ml-auto text-xs">(dividendo)</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-slate-400 w-12 text-xs">G:</span>
          <span className="text-amber-400 tracking-widest">{G}</span>
          <span className="text-slate-500 ml-auto text-xs">(divisor)</span>
        </div>

        <div className="border-t border-slate-700 pt-4 space-y-2">
          {/* Show all completed XOR steps */}
          {steps.slice(0, step + 1).map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-slate-500 w-12 text-xs">paso {i + 1}:</span>
              <pre className="tracking-widest leading-tight">
                <span className="text-slate-600">{" ".repeat(s.highlight)}</span>
                <span className="text-amber-400">{G}</span>
              </pre>
            </div>
          ))}

          {/* Current state of dividend */}
          <div className="flex items-center gap-1 border-t border-slate-800 pt-2">
            <span className="text-slate-500 w-12 text-xs">↓</span>
            <pre className="tracking-widest leading-tight">
              {displayString.split("").map((bit, i) => {
                const isCurrentSegment =
                  current !== null && i >= current.highlight && i < current.highlight + G.length;
                const isResto = finalDone && i >= displayString.length - 4;
                return (
                  <span
                    key={i}
                    className={
                      isResto
                        ? "text-amber-400 font-bold bg-amber-900/30 rounded"
                        : isCurrentSegment
                        ? "text-cyan-300 font-bold bg-cyan-900/30 rounded"
                        : bit === "1"
                        ? "text-slate-300"
                        : "text-slate-600"
                    }
                  >
                    {bit}
                  </span>
                );
              })}
            </pre>
          </div>

          {finalDone && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-300 text-sm">
                ✓ <strong>Resto = {remainder}</strong>: este es el CRC que viaja con los datos.
              </p>
              <p className="text-slate-400 text-xs mt-2">
                El receptor divide los <code>{DATA + remainder}</code> recibidos por G:
              </p>
              <ul className="text-xs text-slate-300 mt-1 ml-4 list-disc">
                <li>Resto = 0 → frame OK</li>
                <li>Resto ≠ 0 → frame con errores → descartar</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </AnimationFrame>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

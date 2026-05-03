"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hand, Target, CreditCard, FileDown, type LucideIcon } from "lucide-react";

const STEPS: { Icon: LucideIcon; iconColor: string; title: string; body: string }[] = [
  {
    Icon: Hand,
    iconColor: "text-blue-400",
    title: "¡Bienvenido!",
    body: "Flashcards para preparar Redes de Información · UTN-FRBA.",
  },
  {
    Icon: Target,
    iconColor: "text-indigo-400",
    title: "Elegí un tema",
    body: "Cada tema tiene sus propias cards. Empezá por el que querés repasar.",
  },
  {
    Icon: CreditCard,
    iconColor: "text-violet-400",
    title: "Saltear o ver la respuesta",
    body: "Hacé click en la card para revelar la respuesta, o usá \"Saltear\" para ir más rápido.",
  },
  {
    Icon: FileDown,
    iconColor: "text-emerald-400",
    title: "Descargá lo que no sabés",
    body: "Marcá \"A repasar\" en las que no te sabías. Al terminar podés bajar un PDF e imprimirlo.",
  },
];

export default function OnboardingModal({
  forceOpen = false,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setStep(0);
      setVisible(true);
      return;
    }
    const done = localStorage.getItem("redes_onboarding_done");
    if (!done) setVisible(true);
  }, [forceOpen]);

  function advance() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      localStorage.setItem("redes_onboarding_done", "1");
      setVisible(false);
      onClose?.();
      router.push("/tutorial");
    }
  }

  function dismiss() {
    localStorage.setItem("redes_onboarding_done", "1");
    setVisible(false);
    onClose?.();
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(2, 6, 23, 0.85)" }}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-7 text-center shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <current.Icon className={`w-12 h-12 ${current.iconColor}`} />
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-white mb-3 leading-snug">
          {current.title}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-7">{current.body}</p>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 mb-6">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Ir al paso ${i + 1}`}
              className="p-3 flex items-center justify-center"
            >
              <span className={`block rounded-full transition-all duration-200 ${
                i === step ? "bg-blue-400 w-4 h-2" : "bg-slate-700 hover:bg-slate-500 w-2 h-2"
              }`} />
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={dismiss}
            className="flex-1 text-slate-500 hover:text-slate-300 text-sm py-3 transition-colors"
          >
            Saltar
          </button>
          <button
            onClick={advance}
            className="flex-[2] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl py-3 transition-colors"
          >
            {isLast ? "¡Empezar! →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}

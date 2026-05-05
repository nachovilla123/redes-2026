"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PartyPopper, BookOpen } from "lucide-react";
import { subnetExercises, type SubnetExercise, type SubnetQuestion } from "@/data/subnetExercises";

// ── helpers ───────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function isCorrect(question: SubnetQuestion, userAnswer: string): boolean {
  const u = normalize(userAnswer);
  if (!u) return false;
  if (u === normalize(question.answer)) return true;
  return (question.altAnswers ?? []).some((a) => u === normalize(a));
}

function getScore(exercise: SubnetExercise, answers: Record<string, string>) {
  const total = exercise.questions.length;
  const correct = exercise.questions.filter((q) =>
    isCorrect(q, answers[q.id] ?? "")
  ).length;
  return { correct, total };
}

// ── single question row ───────────────────────────────────────────────────────

function QuestionRow({
  index,
  question,
  userAnswer,
  checked,
  showHints,
  onChange,
  onEnter,
}: {
  index: number;
  question: SubnetQuestion;
  userAnswer: string;
  checked: boolean;
  showHints: boolean;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const answered = userAnswer.trim() !== "";
  const correct = checked && answered && isCorrect(question, userAnswer);
  const wrong = checked && (answered ? !isCorrect(question, userAnswer) : true);
  const showExplanation = checked && (wrong || !answered);

  return (
    <div className="group">
      <div className="flex gap-3 items-start">
        {/* number bubble */}
        <span
          className={`mt-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
            correct
              ? "bg-emerald-500 text-white"
              : checked
              ? "bg-red-500 text-white"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {correct ? "✓" : checked ? "✗" : index + 1}
        </span>

        <div className="flex-1 space-y-2">
          <p className="text-sm text-slate-300 leading-snug">{question.label}</p>

          <input
            type="text"
            value={userAnswer}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            placeholder={question.placeholder ?? "tu respuesta…"}
            autoComplete="off"
            spellCheck={false}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all border ${
              correct
                ? "bg-emerald-950/60 border-emerald-600 text-emerald-300"
                : checked && answered
                ? "bg-red-950/60 border-red-600 text-red-300"
                : checked && !answered
                ? "bg-amber-950/30 border-amber-700/60 text-white placeholder-amber-900"
                : "bg-slate-800/80 border-slate-700 text-white placeholder-slate-600 focus:border-slate-500 focus:bg-slate-800"
            }`}
          />

          {/* correct answer + explanation shown when wrong */}
          {showExplanation && (
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 overflow-hidden">
              {/* correct answer pill */}
              <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                <span className="text-xs text-slate-500">Respuesta correcta:</span>
                <code className="font-mono text-sm text-white bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg">
                  {question.answer}
                </code>
              </div>
              {/* explanation */}
              {(question.explanation ?? question.hint) && (
                <div className="px-3 pb-3 border-t border-slate-800/60 pt-2.5">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                    ¿Por qué?
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {question.explanation ?? question.hint}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* hint — always available for básico, only pre-check for others */}
          {question.hint && !correct && (showHints || !checked) && (
            <div>
              {showHint ? (
                <p className="text-xs text-slate-500 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 leading-relaxed">
                  💡 {question.hint}
                </p>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Ver pista
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── exercise view ─────────────────────────────────────────────────────────────

function ExerciseView({
  exercise,
  onNext,
  onPrev,
  isFirst,
  isLast,
  exerciseIndex,
  total,
}: {
  exercise: SubnetExercise;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  exerciseIndex: number;
  total: number;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // reset when exercise changes
  useEffect(() => {
    setAnswers({});
    setChecked(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [exercise.id]);

  function setAnswer(qId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    if (checked) setChecked(false);
  }

  const allAnswered = exercise.questions.every((q) => (answers[q.id] ?? "").trim() !== "");
  const { correct, total: qTotal } = getScore(exercise, answers);
  const perfect = checked && correct === qTotal;

  const diffColors: Record<string, string> = {
    básico: "text-emerald-400 bg-emerald-950/50 border-emerald-800/60",
    intermedio: "text-amber-400 bg-amber-950/50 border-amber-800/60",
    avanzado: "text-red-400 bg-red-950/50 border-red-800/60",
  };

  return (
    <div ref={topRef} className="flex flex-col min-h-dvh">
      {/* ── top bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-800/60 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors shrink-0"
          >
            ← Inicio
          </Link>
          <Link
            href="/subnetting/guia"
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Ver guía visual
          </Link>

          {/* progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === exerciseIndex
                    ? "w-5 h-2 bg-white"
                    : i < exerciseIndex
                    ? "w-2 h-2 bg-slate-500"
                    : "w-2 h-2 bg-slate-700"
                }`}
              />
            ))}
          </div>

          <span className="text-slate-500 text-sm shrink-0">
            {exerciseIndex + 1}/{total}
          </span>
        </div>
      </header>

      {/* ── main ────────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* title + badge */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-white font-bold text-lg leading-tight">{exercise.title}</h1>
            <span
              className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${diffColors[exercise.difficulty]}`}
            >
              {exercise.difficulty}
            </span>
          </div>

          {/* scenario */}
          {exercise.scenario && (
            <p className="text-slate-400 text-sm leading-relaxed">{exercise.scenario}</p>
          )}

          {/* given IP — hero display */}
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">
              Datos
            </p>
            <p className="font-mono text-3xl font-bold text-white tracking-wider">
              {exercise.given}
            </p>
          </div>

          {/* quick reference */}
          <details className="group">
            <summary className="cursor-pointer text-xs text-slate-600 hover:text-slate-400 transition-colors list-none flex items-center gap-1.5">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              Reglas rápidas
            </summary>
            <div className="mt-2 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-500 space-y-1">
              <p>• Hosts útiles = 2^(bits host) − 2</p>
              <p>• Broadcast = red + tamaño bloque − 1</p>
              <p>• Primera usable = red + 1 &nbsp;|&nbsp; Última = broadcast − 1</p>
              <p>• Clases: A = 1–126, B = 128–191, C = 192–223</p>
            </div>
          </details>

          {/* tip notice */}
          {!checked && (
            <p className="text-xs text-slate-600 bg-slate-900/50 border border-slate-800/60 rounded-xl px-4 py-2.5 leading-relaxed">
              💡 <span className="text-slate-500">Si no sabés la respuesta, escribí cualquier valor y verificá — vas a ver la respuesta correcta con su explicación.</span>
            </p>
          )}

          {/* questions */}
          <div className="space-y-5">
            {exercise.questions.map((q, i) => (
              <QuestionRow
                key={q.id}
                index={i}
                question={q}
                userAnswer={answers[q.id] ?? ""}
                checked={checked}
                showHints={exercise.difficulty === "básico"}
                onChange={(v) => setAnswer(q.id, v)}
                onEnter={() => {
                  if (allAnswered) setChecked(true);
                }}
              />
            ))}
          </div>

          {/* score banner — shown after check */}
          {checked && (
            <div
              className={`rounded-2xl px-5 py-4 border text-center ${
                perfect
                  ? "bg-emerald-950/60 border-emerald-700/60"
                  : "bg-slate-900 border-slate-700/60"
              }`}
            >
              {perfect ? (
                <p className="text-emerald-400 font-bold text-lg">
                  <PartyPopper className="w-4 h-4 inline mr-1.5" />¡Perfecto! {qTotal}/{qTotal}
                </p>
              ) : (
                <p className="text-white font-semibold text-base">
                  {correct}/{qTotal} correctas
                  <span className="text-slate-400 text-sm font-normal ml-2">
                    — revisá las rojas
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── bottom action bar ────────────────────────────────────────── */}
      <footer className="sticky bottom-0 bg-slate-950/90 backdrop-blur border-t border-slate-800/60 px-4 py-4">
        <div className="max-w-lg mx-auto">
          {!checked ? (
            <div className="flex gap-3">
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors border border-slate-700"
                >
                  ←
                </button>
              )}
              <button
                onClick={() => setChecked(true)}
                disabled={!allAnswered}
                className="flex-1 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Verificar respuestas
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAnswers({});
                  setChecked(false);
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors border border-slate-700"
              >
                Reintentar
              </button>
              {isLast ? (
                <Link
                  href="/"
                  className="flex-1 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-colors text-center flex items-center justify-center"
                >
                  Volver al inicio
                </Link>
              ) : (
                <button
                  onClick={onNext}
                  className="flex-1 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-colors"
                >
                  Siguiente ejercicio →
                </button>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function SubnettingPage() {
  const [current, setCurrent] = useState(0);
  const total = subnetExercises.length;

  return (
    <ExerciseView
      key={current}
      exercise={subnetExercises[current]}
      exerciseIndex={current}
      total={total}
      isFirst={current === 0}
      isLast={current === total - 1}
      onNext={() => setCurrent((c) => Math.min(c + 1, total - 1))}
      onPrev={() => setCurrent((c) => Math.max(c - 1, 0))}
    />
  );
}

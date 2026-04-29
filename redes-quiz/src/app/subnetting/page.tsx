"use client";

import { useState } from "react";
import Link from "next/link";
import { subnetExercises, type SubnetExercise, type SubnetQuestion } from "@/data/subnetExercises";

// ── helpers ──────────────────────────────────────────────────────────────────

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

// ── difficulty badge ──────────────────────────────────────────────────────────

const difficultyStyle: Record<string, string> = {
  básico: "bg-emerald-900/50 text-emerald-400 border-emerald-800",
  intermedio: "bg-amber-900/50 text-amber-400 border-amber-800",
  avanzado: "bg-red-900/50 text-red-400 border-red-800",
};

// ── sub-components ────────────────────────────────────────────────────────────

function QuestionRow({
  question,
  userAnswer,
  checked,
  onChange,
}: {
  question: SubnetQuestion;
  userAnswer: string;
  checked: boolean;
  onChange: (v: string) => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const answered = userAnswer.trim() !== "";
  const correct = isCorrect(question, userAnswer);

  let inputClass =
    "w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors font-mono";

  if (checked && answered) {
    inputClass += correct
      ? " border-emerald-500 bg-emerald-900/20"
      : " border-red-500 bg-red-900/20";
  } else {
    inputClass += " border-slate-700 focus:border-slate-500";
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm text-slate-300 font-medium">{question.label}</label>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder ?? "tu respuesta"}
        className={inputClass}
        autoComplete="off"
        spellCheck={false}
      />

      {/* result feedback */}
      {checked && answered && (
        <p
          className={`text-xs font-medium ${
            correct ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {correct ? (
            "✓ Correcto"
          ) : (
            <>
              ✗ Incorrecto — la respuesta es:{" "}
              <span className="font-mono text-white">{question.answer}</span>
            </>
          )}
        </p>
      )}

      {/* hint */}
      {question.hint && (
        <div>
          {showHint ? (
            <p className="text-xs text-slate-400 bg-slate-800 rounded-md px-3 py-2 border border-slate-700">
              💡 {question.hint}
            </p>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Ver pista
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: SubnetExercise }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  function setAnswer(qId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    if (checked) setChecked(false);
  }

  function handleCheck() {
    setChecked(true);
  }

  function handleReset() {
    setAnswers({});
    setChecked(false);
  }

  const { correct, total } = getScore(exercise, answers);
  const allAnswered = exercise.questions.every((q) => (answers[q.id] ?? "").trim() !== "");
  const perfect = checked && correct === total;

  return (
    <div className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
      perfect ? "border-emerald-600" : "border-slate-800"
    }`}>
      {/* header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-bold shrink-0">
              {exercise.id}
            </span>
            <div>
              <h2 className="text-white font-semibold text-sm">{exercise.title}</h2>
              {exercise.scenario && (
                <p className="text-slate-400 text-xs mt-0.5">{exercise.scenario}</p>
              )}
            </div>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md border shrink-0 ${
              difficultyStyle[exercise.difficulty]
            }`}
          >
            {exercise.difficulty}
          </span>
        </div>

        {/* given IP */}
        <div className="mt-4 bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Datos</p>
          <p className="text-white font-mono text-lg font-bold tracking-wider">
            {exercise.given}
          </p>
        </div>
      </div>

      {/* questions */}
      <div className="px-6 py-5 space-y-5">
        {exercise.questions.map((q) => (
          <QuestionRow
            key={q.id}
            question={q}
            userAnswer={answers[q.id] ?? ""}
            checked={checked}
            onChange={(v) => setAnswer(q.id, v)}
          />
        ))}
      </div>

      {/* footer */}
      <div className="px-6 pb-5 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-400">
          {checked ? (
            <span className={correct === total ? "text-emerald-400 font-semibold" : "text-slate-300"}>
              {correct === total
                ? "🎉 ¡Perfecto! Todas correctas"
                : `${correct} / ${total} correctas`}
            </span>
          ) : (
            <span>{total} preguntas</span>
          )}
        </div>

        <div className="flex gap-2">
          {checked && (
            <button
              onClick={handleReset}
              className="text-xs px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              Reiniciar
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={!allAnswered}
            className="text-sm px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function SubnettingPage() {
  const básicos = subnetExercises.filter((e) => e.difficulty === "básico");
  const intermedios = subnetExercises.filter((e) => e.difficulty === "intermedio");
  const avanzados = subnetExercises.filter((e) => e.difficulty === "avanzado");

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-8"
        >
          ← Volver
        </Link>

        {/* header */}
        <div className="mb-10">
          <p className="text-slate-500 text-xs font-medium tracking-widest uppercase mb-2">
            Práctica · IPv4
          </p>
          <h1 className="text-3xl font-bold text-white mb-3">Subnetting</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Completá cada ejercicio con la dirección de red, broadcast, rango de hosts y más.
            Usá el botón <strong className="text-slate-200">Verificar</strong> para ver cuántas acertaste.
          </p>
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 space-y-1">
            <p>📌 <strong className="text-slate-300">Reglas rápidas:</strong></p>
            <p>• Hosts útiles = 2^(bits de host) − 2</p>
            <p>• Broadcast = dirección de red + tamaño del bloque − 1</p>
            <p>• Primera usable = dirección de red + 1</p>
            <p>• Última usable = broadcast − 1</p>
          </div>
        </div>

        {/* exercises by difficulty */}
        {básicos.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Nivel básico — Identificación de clase y rangos
            </h3>
            <div className="flex flex-col gap-5">
              {básicos.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </section>
        )}

        {intermedios.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Nivel intermedio — Subnetting
            </h3>
            <div className="flex flex-col gap-5">
              {intermedios.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </section>
        )}

        {avanzados.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Nivel avanzado — Clase B con subnetting
            </h3>
            <div className="flex flex-col gap-5">
              {avanzados.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </section>
        )}

        <p className="text-center text-slate-600 text-xs mt-6">
          Más ejercicios pronto · Redes UTN FRBA 2026
        </p>
      </div>
    </main>
  );
}

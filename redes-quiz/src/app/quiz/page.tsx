"use client";

import { useState } from "react";
import Link from "next/link";
import { quizQuestions, TOPIC, type Difficulty } from "@/data/clase1";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  basico: "bg-green-500/20 text-green-400 border-green-500/30",
  intermedio: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  avanzado: "bg-red-500/20 text-red-400 border-red-500/30",
};

type AnswerState = "unanswered" | "correct" | "incorrect";

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentIndex];
  const isLast = currentIndex === quizQuestions.length - 1;
  const progress = ((currentIndex + (answerState !== "unanswered" ? 1 : 0)) / quizQuestions.length) * 100;

  function handleOptionClick(index: number) {
    if (answerState !== "unanswered") return;
    setSelectedOption(index);
    if (index === question.correctIndex) {
      setAnswerState("correct");
      setScore((s) => s + 1);
    } else {
      setAnswerState("incorrect");
    }
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState("unanswered");
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerState("unanswered");
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📚";
    const message =
      pct >= 80
        ? "Excelente manejo del tema!"
        : pct >= 60
        ? "Buen progreso, seguí repasando"
        : "Hay conceptos para reforzar";

    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <div className="text-7xl mb-6">{emoji}</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {score} / {quizQuestions.length} correctas
          </h2>
          <p className="text-slate-400 mb-2">{message}</p>
          <div className="text-5xl font-black text-blue-400 my-6">{pct}%</div>

          {/* Score by difficulty */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 text-left">
            {(["basico", "intermedio", "avanzado"] as Difficulty[]).map((diff) => {
              const qs = quizQuestions.filter((q) => q.difficulty === diff);
              return (
                <div key={diff} className="flex items-center justify-between py-2">
                  <span className={`text-sm px-2 py-0.5 rounded border ${DIFFICULTY_COLOR[diff]}`}>
                    {DIFFICULTY_LABEL[diff]}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {qs.length} preguntas
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl py-3 transition-colors text-center"
            >
              Inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* Top bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Inicio
          </Link>
          <span className="text-slate-500 text-sm">
            {currentIndex + 1} / {quizQuestions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {/* Difficulty badge */}
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md border mb-5 ${DIFFICULTY_COLOR[question.difficulty]}`}>
            {DIFFICULTY_LABEL[question.difficulty]}
          </span>

          <h2 className="text-xl font-semibold text-white mb-8 leading-relaxed">
            {question.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options.map((option, index) => {
              let style =
                "border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500 hover:bg-slate-700";

              if (answerState !== "unanswered") {
                if (index === question.correctIndex) {
                  style = "border border-green-500 bg-green-500/10 text-green-300";
                } else if (index === selectedOption && index !== question.correctIndex) {
                  style = "border border-red-500 bg-red-500/10 text-red-300";
                } else {
                  style = "border border-slate-800 bg-slate-900 text-slate-500";
                }
              } else if (selectedOption === index) {
                style = "border border-blue-500 bg-blue-500/10 text-blue-300";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={answerState !== "unanswered"}
                  className={`w-full text-left rounded-xl px-5 py-4 font-medium transition-all ${style} disabled:cursor-default`}
                >
                  <span className="text-slate-500 mr-3 font-mono text-sm">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answerState !== "unanswered" && (
            <div className={`mt-6 rounded-xl p-4 text-sm leading-relaxed ${
              answerState === "correct"
                ? "bg-green-500/10 border border-green-500/30 text-green-300"
                : "bg-red-500/10 border border-red-500/30 text-red-300"
            }`}>
              <p className="font-semibold mb-1">
                {answerState === "correct" ? "✓ Correcto!" : "✗ Incorrecto"}
              </p>
              <p className="text-slate-300">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Next button */}
        {answerState !== "unanswered" && (
          <button
            onClick={handleNext}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl py-4 transition-colors"
          >
            {isLast ? "Ver resultados" : "Siguiente →"}
          </button>
        )}
      </div>
    </main>
  );
}

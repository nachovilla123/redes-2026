"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import { getTopicBySlug, type Flashcard } from "@/data/index";
import { notFound } from "next/navigation";

export default function FlashcardsPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = use(params);
  const topicData = getTopicBySlug(slug);

  if (!topicData) notFound();

  return <FlashcardSession flashcards={topicData.flashcards} topicTitle={topicData.title} slug={slug} />;
}

function FlashcardSession({
  flashcards,
  topicTitle,
  slug,
}: {
  flashcards: Flashcard[];
  topicTitle: string;
  slug: string;
}) {
  const total = flashcards.length;

  const [doneIds, setDoneIds] = useState<Set<number>>(new Set());
  const [queue, setQueue] = useState<number[]>(() => flashcards.map((_, i) => i));
  const [queuePos, setQueuePos] = useState(0);
  const [nextQueue, setNextQueue] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [roundDone, setRoundDone] = useState(false);

  const currentCardIdx = queue[queuePos];
  const card = flashcards[currentCardIdx];

  function flip() {
    setIsFlipped((f) => !f);
  }

  function markAndAdvance(status: "known" | "review") {
    if (status === "known") {
      setDoneIds((prev) => new Set([...prev, currentCardIdx]));
    } else {
      setNextQueue((prev) => [...prev, currentCardIdx]);
    }
    setIsFlipped(false);
    if (queuePos < queue.length - 1) {
      setTimeout(() => setQueuePos((p) => p + 1), 150);
    } else {
      setRoundDone(true);
    }
  }

  function startNextRound() {
    setQueue(nextQueue);
    setNextQueue([]);
    setQueuePos(0);
    setRound((r) => r + 1);
    setRoundDone(false);
  }

  function restartAll() {
    setDoneIds(new Set());
    setQueue(flashcards.map((_, i) => i));
    setNextQueue([]);
    setQueuePos(0);
    setRound(1);
    setRoundDone(false);
    setIsFlipped(false);
  }

  function dotColor(i: number): string {
    if (doneIds.has(i)) return "bg-green-500";
    if (nextQueue.includes(i)) return "bg-yellow-500";
    if (!roundDone && i === currentCardIdx) return "bg-blue-400";
    if (queue.slice(queuePos + 1).includes(i)) return "bg-slate-600";
    return "bg-slate-800";
  }

  // ── Entre rondas ─────────────────────────────────────────────────────────
  if (roundDone && nextQueue.length > 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-2xl font-bold text-white mb-1">Ronda {round} completa</h2>
            <p className="text-slate-400 text-sm">{doneIds.size} de {total} dominadas</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex gap-3 mb-5">
              <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-green-400">{doneIds.size}</div>
                <div className="text-green-500 text-sm mt-1">Dominadas</div>
              </div>
              <div className="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-yellow-400">{nextQueue.length}</div>
                <div className="text-yellow-500 text-sm mt-1">Para repasar</div>
              </div>
            </div>
            <p className="text-slate-500 text-xs uppercase tracking-wide font-medium mb-2">Vas a repasar:</p>
            <ul className="flex flex-col gap-2 max-h-52 overflow-y-auto">
              {nextQueue.map((idx) => (
                <li key={idx} className="text-sm text-slate-300 bg-slate-800 rounded-lg px-3 py-2 leading-snug">
                  {flashcards[idx].front}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startNextRound}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-4 transition-colors"
            >
              Repasar {nextQueue.length} cards →
            </button>
            <Link href="/" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-4 transition-colors text-center flex items-center justify-center">
              Salir
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Todo dominado ────────────────────────────────────────────────────────
  if (roundDone && nextQueue.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <div className="text-7xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-2">¡Dominaste todo!</h2>
          <p className="text-slate-400 mb-1">{total} flashcards completadas</p>
          <p className="text-slate-500 text-sm mb-10">en {round} {round === 1 ? "ronda" : "rondas"}</p>
          <div className="flex gap-3">
            <button onClick={restartAll} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3 transition-colors">
              Empezar de nuevo
            </button>
            <Link href="/" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl py-3 transition-colors text-center flex items-center justify-center">
              Inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Sesión principal ─────────────────────────────────────────────────────
  return (
    <main className="min-h-dvh flex flex-col px-4 pt-4 pb-6 sm:pt-8 sm:pb-10">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="w-full max-w-xl mx-auto mb-4">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Inicio
          </Link>
          <div className="flex items-center gap-2">
            {round > 1 && (
              <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Ronda {round}
              </span>
            )}
            <span className="text-slate-400 text-sm">{queuePos + 1} / {queue.length}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {flashcards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                !roundDone && i === currentCardIdx ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950" : ""
              } ${dotColor(i)}`}
            />
          ))}
        </div>

        <div className="flex gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {doneIds.size} dominadas
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
            {nextQueue.length} a repasar
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
            {queue.length - queuePos - 1} restantes
          </span>
        </div>
      </div>

      {/* ── Tarjeta ────────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-xl mx-auto mb-4">
        {!isFlipped ? (
          <div
            key={`front-${currentCardIdx}`}
            className="card-face cursor-pointer select-none h-full min-h-40 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col items-center justify-center p-5 sm:p-8 text-center"
            onClick={flip}
          >
            <span className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-4">{card.tag}</span>
            <p className="text-white text-lg sm:text-xl font-semibold leading-relaxed">{card.front}</p>
            <p className="text-slate-600 text-xs mt-6">Tocá para ver la respuesta</p>
          </div>
        ) : (
          <div
            key={`back-${currentCardIdx}`}
            className="card-face cursor-pointer select-none h-full min-h-40 bg-slate-800 border border-slate-600 rounded-2xl flex flex-col p-5 sm:p-8 overflow-y-auto"
            onClick={flip}
          >
            <span className="text-xs text-blue-400 uppercase tracking-widest font-medium mb-4">Respuesta</span>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-line">{card.back}</p>
          </div>
        )}
      </div>

      {/* ── Botones ────────────────────────────────────────────────── */}
      <div className="w-full max-w-xl mx-auto">
        {isFlipped ? (
          <div className="flex gap-3">
            <button
              onClick={() => markAndAdvance("review")}
              className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 active:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-semibold rounded-xl py-4 transition-colors"
            >
              ↩ A repasar
            </button>
            <button
              onClick={() => markAndAdvance("known")}
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 active:bg-green-500/30 border border-green-500/30 text-green-400 font-semibold rounded-xl py-4 transition-colors"
            >
              ✓ Lo sé
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => markAndAdvance("review")}
              className="flex-[1] bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-400 font-semibold rounded-xl py-4 transition-colors text-sm"
            >
              → Saltear
            </button>
            <button
              onClick={flip}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl py-4 transition-colors"
            >
              Ver respuesta
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { RefreshCw, Trophy, FileDown, Loader2, Clapperboard } from "lucide-react";
import { getTopicBySlug, type Flashcard } from "@/data/index";
import { notFound } from "next/navigation";
import { downloadReviewPDF } from "@/lib/generatePDF";
import { getAnimation } from "@/components/animations";

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
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [simulatorOpen, setSimulatorOpen] = useState<{ url?: string; animationId?: string; label?: string } | null>(null);

  useEffect(() => {
    if (!simulatorOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSimulatorOpen(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [simulatorOpen]);

  async function handleDownloadPDF(cardIndices: number[]) {
    setGeneratingPDF(true);
    try {
      const cards = cardIndices.map((i) => flashcards[i]);
      await downloadReviewPDF(cards, topicTitle, `repaso-${slug}.pdf`);
    } finally {
      setGeneratingPDF(false);
    }
  }

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
            <RefreshCw className="w-14 h-14 text-blue-400 mx-auto mb-4" />
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
              {nextQueue.map((idx, i) => (
                <li key={i} className="text-sm text-slate-300 bg-slate-800 rounded-lg px-3 py-2 leading-snug">
                  {flashcards[idx].front}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => handleDownloadPDF(nextQueue)}
            disabled={generatingPDF}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-slate-300 font-semibold rounded-xl py-3 transition-colors mb-3 text-sm"
          >
            {generatingPDF ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generando PDF...</>
            ) : (
              <><FileDown className="w-4 h-4" /> Descargar PDF para imprimir ({nextQueue.length} tarjetas)</>
            )}
          </button>

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
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">¡Dominaste todo!</h2>
          <p className="text-slate-400 mb-1">{total} flashcards completadas</p>
          <p className="text-slate-500 text-sm mb-8">en {round} {round === 1 ? "ronda" : "rondas"}</p>

          <button
            onClick={() => handleDownloadPDF(flashcards.map((_, i) => i))}
            disabled={generatingPDF}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-slate-300 font-semibold rounded-xl py-3 transition-colors mb-3 text-sm"
          >
            {generatingPDF ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generando PDF...</>
            ) : (
              <><FileDown className="w-4 h-4" /> Descargar todas las tarjetas en PDF</>
            )}
          </button>

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

        {flashcards.length <= 20 ? (
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
        ) : (
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(doneIds.size / flashcards.length) * 100}%` }}
            />
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${(nextQueue.length / flashcards.length) * 100}%` }}
            />
          </div>
        )}

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
            className="card-face select-none h-full min-h-40 bg-slate-800 border border-slate-600 rounded-2xl flex flex-col p-5 sm:p-8 overflow-y-auto"
          >
            <div className="cursor-pointer" onClick={flip}>
              <span className="text-xs text-blue-400 uppercase tracking-widest font-medium mb-4 block">Respuesta</span>
              <p className="text-slate-100 text-base leading-relaxed whitespace-pre-line">{card.back}</p>
            </div>
            {card.simulator && (card.simulator.url || card.simulator.animationId) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSimulatorOpen({
                    url: card.simulator!.url,
                    animationId: card.simulator!.animationId,
                    label: card.simulator!.label,
                  });
                }}
                className="mt-5 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors text-sm self-start"
              >
                <Clapperboard className="w-4 h-4" />
                Ver animación{card.simulator.label ? `: ${card.simulator.label}` : ""}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Botones ────────────────────────────────────────────────── */}
      <div className="w-full max-w-xl mx-auto">
        {isFlipped ? (
          <div className="flex gap-3">
            <button
              onClick={() => markAndAdvance("review")}
              className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 active:bg-yellow-500/30 active:scale-95 border border-yellow-500/30 text-yellow-400 font-semibold rounded-xl py-4 transition-all"
            >
              ↩ A repasar
            </button>
            <button
              onClick={() => markAndAdvance("known")}
              className="flex-1 bg-green-500/10 hover:bg-green-500/20 active:bg-green-500/30 active:scale-95 border border-green-500/30 text-green-400 font-semibold rounded-xl py-4 transition-all"
            >
              ✓ Lo sé
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => markAndAdvance("review")}
              className="flex-[1] bg-slate-800 hover:bg-slate-700 active:bg-slate-600 active:scale-95 border border-slate-700 text-slate-400 font-semibold rounded-xl py-4 transition-all text-sm"
            >
              → Saltear
            </button>
            <button
              onClick={flip}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl py-4 transition-all"
            >
              Ver respuesta
            </button>
          </div>
        )}

      </div>

      {/* ── Modal del simulador ──────────────────────────────────── */}
      {simulatorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-3 sm:p-6"
          onClick={() => setSimulatorOpen(null)}
        >
          <div
            className="w-full max-w-6xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-3 min-w-0">
                <Clapperboard className="w-5 h-5 text-slate-300" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Animación</p>
                  <p className="text-white font-semibold text-sm truncate">{simulatorOpen.label ?? "Animación"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {simulatorOpen.url && (
                  <a
                    href={simulatorOpen.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
                    title="Abrir en nueva pestaña"
                  >
                    ↗ Pestaña nueva
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSimulatorOpen(null)}
                  className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-lg leading-none flex items-center justify-center transition-colors"
                  aria-label="Cerrar animación"
                >
                  ×
                </button>
              </div>
            </div>
            <SimulatorBody open={simulatorOpen} />
          </div>
        </div>
      )}
    </main>
  );
}

function SimulatorBody({ open }: { open: { url?: string; animationId?: string; label?: string } }) {
  if (open.animationId) {
    const Animation = getAnimation(open.animationId);
    if (Animation) {
      return (
        <div className="flex-1 w-full overflow-hidden bg-slate-950">
          <Animation />
        </div>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Animación no encontrada: {open.animationId}
      </div>
    );
  }
  if (open.url) {
    return (
      <iframe
        src={open.url}
        className="flex-1 w-full bg-slate-950"
        title={open.label ?? "Simulador"}
      />
    );
  }
  return null;
}

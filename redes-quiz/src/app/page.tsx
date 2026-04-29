"use client";

import Link from "next/link";
import { topics } from "@/data/index";
import OnboardingModal from "@/components/OnboardingModal";

export default function Home() {
  return (
    <>
      <OnboardingModal />
      <main className="min-h-screen flex flex-col items-center px-4 py-16">
        <div className="text-center mb-12 relative">
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase mb-2">
            UTN · FRBA · Redes de Información
          </p>
          <h1 className="text-4xl font-bold text-white mb-3">Redes Quiz</h1>
          <p className="text-slate-400">Elegí un tema y empezá a estudiar</p>
          <Link
            href="/tutorial"
            className="absolute -right-8 top-0 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-colors flex items-center justify-center"
            title="Ver tutorial"
          >
            ?
          </Link>
        </div>

        <div className="w-full max-w-lg flex flex-col gap-4">
          {/* Subnetting interactive section */}
          <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-900/40 flex items-center justify-center text-xl">
                🖊️
              </div>
              <div>
                <h2 className="text-white font-semibold">Práctica de Subnetting</h2>
                <p className="text-slate-500 text-xs">IPv4 · Fill-in-the-blank · 6 ejercicios</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-5">
              Calculá broadcast, rango de hosts, máscara y más. Verificá tus respuestas al instante.
            </p>
            <Link
              href="/subnetting"
              className="flex items-center justify-between w-full bg-indigo-900/40 hover:bg-indigo-900/60 text-white font-semibold rounded-xl px-5 py-3.5 transition-colors border border-indigo-800/50"
            >
              <span className="flex items-center gap-2 text-sm">
                <span>🖊️</span>
                Ejercicios interactivos
              </span>
              <span className="text-slate-400 text-sm">→</span>
            </Link>
          </div>

          {topics.map((topic) => (
            <div
              key={topic.slug}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                  {topic.emoji}
                </div>
                <div>
                  <h2 className="text-white font-semibold">{topic.title}</h2>
                  <p className="text-slate-500 text-xs">
                    {topic.subtitle} · {topic.source}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                <span className="bg-slate-800 rounded-md px-2 py-1">
                  🃏 {topic.flashcards.length} flashcards
                </span>
              </div>

              <Link
                href={`/flashcards/${topic.slug}`}
                className="flex items-center justify-between w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl px-5 py-3.5 transition-colors border border-slate-700"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span>🃏</span>
                  Flashcards
                </span>
                <span className="text-slate-400 text-sm">→</span>
              </Link>
            </div>
          ))}
        </div>

        <footer className="w-full max-w-lg mt-10 border-t border-slate-800 pt-6 flex flex-col gap-3">
          <p className="text-slate-500 text-xs leading-relaxed">
            ⚠️ Tomá el contenido con consideración — puede contener errores. Si encontrás algo incorrecto o tenés una duda, por favor abrí un issue en el repositorio.
          </p>
          <a
            href="https://github.com/nachovilla123/redes-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors w-fit"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            github.com/nachovilla123/redes-2026
          </a>
        </footer>
      </main>
    </>
  );
}

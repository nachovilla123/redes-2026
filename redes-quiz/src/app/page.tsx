import Link from "next/link";
import { topics } from "@/data/index";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase mb-2">
          UTN · FRBA · Redes de Información
        </p>
        <h1 className="text-4xl font-bold text-white mb-3">Redes Quiz</h1>
        <p className="text-slate-400">Elegí un tema y modo de estudio</p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-4">
        {topics.map((topic) => (
          <div
            key={topic.slug}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            {/* Encabezado del tema */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                {topic.emoji}
              </div>
              <div>
                <h2 className="text-white font-semibold">{topic.title}</h2>
                <p className="text-slate-500 text-xs">{topic.subtitle} · {topic.source}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
              <span className="bg-slate-800 rounded-md px-2 py-1">
                🃏 {topic.flashcards.length} flashcards
              </span>
            </div>

            {/* Botón flashcards */}
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
    </main>
  );
}

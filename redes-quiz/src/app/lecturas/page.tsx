import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { lecturas } from "@/data/lecturas";

const TAG_COLORS: Record<string, string> = {
  "Capa de Transporte": "bg-blue-900/40 text-blue-300 border-blue-800/50",
  "Capa de Enlace":     "bg-violet-900/40 text-violet-300 border-violet-800/50",
  "WiFi / 802.11":      "bg-teal-900/40 text-teal-300 border-teal-800/50",
  "WiFi / Ethernet":    "bg-teal-900/40 text-teal-300 border-teal-800/50",
};

export default function LecturasPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-10 bg-slate-950">
      <div className="w-full max-w-3xl">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <p className="text-slate-500 text-xs font-medium tracking-widest uppercase mb-1">
            Material de estudio
          </p>
          <h1 className="text-2xl font-bold text-white">Lecturas y explicaciones</h1>
          <p className="text-slate-400 text-sm mt-2">
            Conceptos explicados con analogías y ejemplos reales.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {lecturas.map((lectura) => (
            <Link
              key={lectura.slug}
              href={`/lecturas/${lectura.slug}`}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-600 active:scale-[0.99] rounded-2xl p-5 flex items-start gap-4 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-white font-semibold text-sm">{lectura.title}</h2>
                  <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ${TAG_COLORS[lectura.tag] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                    {lectura.tag}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{lectura.subtitle}</p>
              </div>
              <span className="text-slate-600 group-hover:text-slate-400 text-sm transition-colors shrink-0 mt-1">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

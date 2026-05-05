"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { ejerciciosLANWLAN, type Ejercicio } from "@/data/ejercicios";

const TAG_COLORS: Record<string, string> = {
  "WiFi / 802.11":   "bg-teal-900/40 text-teal-300 border-teal-800/50",
  "Ethernet / Hub":  "bg-orange-900/40 text-orange-300 border-orange-800/50",
  "WiFi / Seguridad":"bg-teal-900/40 text-teal-300 border-teal-800/50",
  "TCP / UDP / DHCP":"bg-blue-900/40 text-blue-300 border-blue-800/50",
  "Encapsulamiento": "bg-violet-900/40 text-violet-300 border-violet-800/50",
  "STP / Switching": "bg-amber-900/40 text-amber-300 border-amber-800/50",
};

type Reveal = "none" | "pistas" | "resolucion";

function EjercicioCard({ ej }: { ej: Ejercicio }) {
  const [reveal, setReveal] = useState<Reveal>("none");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* Escenario */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-slate-600 font-mono text-sm shrink-0 mt-0.5">#{ej.id}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h2 className="text-white font-semibold text-sm">{ej.titulo}</h2>
              <span className={`text-xs border rounded-full px-2 py-0.5 font-medium ${TAG_COLORS[ej.tag] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
                {ej.tag}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{ej.escenario}</p>
          </div>
        </div>
      </div>

      {/* Pistas */}
      {reveal !== "none" && (
        <div className="px-5 sm:px-6 pb-4 border-t border-slate-800 pt-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Pistas</p>
          {ej.preguntas.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-400 text-sm">
              <span className="shrink-0 text-slate-600 mt-0.5">{i + 1}.</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      )}

      {/* Resolución */}
      {reveal === "resolucion" && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-slate-800 pt-4 flex flex-col gap-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Resolución</p>
          {ej.analisis.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-slate-600 text-xs font-mono shrink-0 mt-0.5">{i + 1}.</span>
              <p className="text-slate-300 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Botones */}
      <div className="flex border-t border-slate-800">
        {reveal === "none" && (
          <button
            onClick={() => setReveal("pistas")}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            <ChevronDown className="w-4 h-4" /> Ver pistas
          </button>
        )}
        {reveal === "pistas" && (
          <>
            <button
              onClick={() => setReveal("none")}
              className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 transition-colors border-r border-slate-800"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReveal("resolucion")}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-colors"
            >
              <ChevronDown className="w-4 h-4" /> Ver resolución
            </button>
          </>
        )}
        {reveal === "resolucion" && (
          <button
            onClick={() => setReveal("none")}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 transition-colors"
          >
            <ChevronUp className="w-4 h-4" /> Ocultar
          </button>
        )}
      </div>
    </div>
  );
}

export default function EjerciciosPage() {
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
            Banco de ejercicios
          </p>
          <h1 className="text-2xl font-bold text-white">Escenarios LAN/WLAN</h1>
          <p className="text-slate-400 text-sm mt-2">
            Escenarios del docente. Pensá la respuesta antes de ver el análisis.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {ejerciciosLANWLAN.map((ej) => (
            <EjercicioCard key={ej.id} ej={ej} />
          ))}
        </div>
      </div>
    </main>
  );
}

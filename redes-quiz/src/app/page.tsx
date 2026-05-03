"use client";

import Link from "next/link";
import {
  Radio, Layers, Shuffle, Wifi, Map, Globe, Lock, Cable,
  ClipboardList, PenLine, AlertTriangle, Trophy, type LucideIcon,
} from "lucide-react";
import { topics } from "@/data/index";
import OnboardingModal from "@/components/OnboardingModal";

const parcialTopics = topics.filter((t) => t.isParcial);
const regularTopics = topics.filter((t) => !t.isParcial);

const TOPIC_ICONS: Record<string, LucideIcon> = {
  "intro":                       Radio,
  "arquitectura":                Layers,
  "switches":                    Shuffle,
  "wifi-arq":                    Wifi,
  "routing-fragmentacion":       Map,
  "vlsm-dhcp-dns":               Globe,
  "http-tls-jwt":                Lock,
  "cableado-estructurado":       Cable,
  "wlan-avanzado":               Wifi,
  "parcial-lan-stp-wireless":    ClipboardList,
  "parcial-ip-direccionamiento": ClipboardList,
  "parcial-transporte-ipv6":     ClipboardList,
};

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Home() {
  return (
    <>
      <OnboardingModal />
      <main className="min-h-dvh flex flex-col items-center px-4 py-10 bg-slate-950">

        {/* Header */}
        <header className="w-full max-w-4xl flex items-center justify-between mb-10">
          <div>
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">
              UTN · FRBA · Redes de Información
            </p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Redes Quiz</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://ar.linkedin.com/in/ignaciovillarruel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 text-xs font-medium transition-colors"
              aria-label="LinkedIn de Ignacio Villarruel (abre en nueva pestaña)"
            >
              <LinkedinIcon />
              <span className="hidden sm:inline">Ignacio Villarruel</span>
            </a>
            <a
              href="https://www.linkedin.com/in/alanfried/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 text-xs font-medium transition-colors"
              aria-label="LinkedIn de Alan Fried (abre en nueva pestaña)"
            >
              <LinkedinIcon />
              <span className="hidden sm:inline">Alan Fried</span>
            </a>
            <a
              href="https://github.com/nachovilla123/redes-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
              aria-label="Repositorio en GitHub (abre en nueva pestaña)"
            >
              <GithubIcon />
              <span className="hidden sm:inline">redes-2026</span>
            </a>
            <Link
              href="/tutorial"
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-colors flex items-center justify-center"
              title="Ver tutorial"
              aria-label="Ver tutorial"
            >
              ?
            </Link>
          </div>
        </header>

        {/* Hero cards — Subnetting + Quiz */}
        <div className="w-full max-w-4xl mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subnetting */}
          <div className="bg-slate-900 border border-indigo-800/60 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/40 flex items-center justify-center shrink-0">
                <PenLine className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-semibold text-base">Práctica de Subnetting</h2>
                  <span className="text-xs bg-indigo-900/50 text-indigo-300 border border-indigo-800/50 rounded-full px-2 py-0.5 font-medium">
                    Interactivo
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-1">IPv4 · Fill-in-the-blank · 6 ejercicios</p>
                <p className="text-slate-400 text-sm">Calculá broadcast, rango de hosts, máscara y más.</p>
              </div>
            </div>
            <Link
              href="/subnetting"
              className="mt-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl px-6 py-3 transition-all text-sm"
            >
              Practicar ahora →
            </Link>
          </div>

          {/* Quiz MCQ */}
          <div className="bg-slate-900 border border-violet-800/60 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-900/40 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-semibold text-base">Quiz Clase 1</h2>
                  <span className="text-xs bg-violet-900/50 text-violet-300 border border-violet-800/50 rounded-full px-2 py-0.5 font-medium">
                    Opción múltiple
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-1">Introducción · Básico → Avanzado</p>
                <p className="text-slate-400 text-sm">Elegí la opción correcta y recibí feedback al instante.</p>
              </div>
            </div>
            <Link
              href="/quiz"
              className="mt-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 active:scale-95 text-white font-semibold rounded-xl px-6 py-3 transition-all text-sm"
            >
              Empezar quiz →
            </Link>
          </div>
        </div>

        {/* Topics grid */}
        <div className="w-full max-w-4xl">
          <p className="text-slate-500 text-xs font-medium tracking-widest uppercase mb-4">
            Flashcards por tema
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularTopics.map((topic) => {
              const TopicIcon = TOPIC_ICONS[topic.slug] ?? Radio;
              return (
              <Link
                key={topic.slug}
                href={`/flashcards/${topic.slug}`}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-[0.97] rounded-2xl p-5 flex flex-col gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    <TopicIcon className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-white font-semibold text-sm leading-snug">{topic.title}</h2>
                    <p className="text-slate-500 text-xs mt-0.5 truncate">{topic.subtitle}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs bg-slate-800 rounded-md px-2 py-1 text-slate-400">
                    {topic.flashcards.length} flashcards
                  </span>
                  <span className="text-slate-600 group-hover:text-slate-400 text-sm transition-colors">→</span>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Parciales section */}
        <div className="w-full max-w-4xl mt-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">
              Banco de preguntas de parciales
            </p>
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-medium">
              Nuevo
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Preguntas estilo parcial organizadas por área. Leé la pregunta, pensá la respuesta y verific si la sabías.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {parcialTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/flashcards/${topic.slug}`}
                className="group bg-slate-900 border border-amber-800/40 hover:border-amber-700/60 active:scale-[0.97] rounded-2xl p-5 flex flex-col gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-900/30 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-white font-semibold text-sm leading-snug">{topic.title}</h2>
                    <p className="text-slate-500 text-xs mt-0.5 truncate">{topic.subtitle}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs bg-amber-900/30 border border-amber-800/40 rounded-md px-2 py-1 text-amber-400">
                    {topic.flashcards.length} preguntas
                  </span>
                  <span className="text-slate-600 group-hover:text-amber-400 text-sm transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-4xl mt-10 border-t border-slate-800 pt-6">
          <p className="text-slate-600 text-xs leading-relaxed flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Tomá el contenido con consideración — puede contener errores. Si encontrás algo incorrecto,{" "}
            <a
              href="https://github.com/nachovilla123/redes-2026/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-400 transition-colors"
              aria-label="Abrir un issue en GitHub (abre en nueva pestaña)"
            >
              abrí un issue acá
            </a>.
          </p>
        </footer>
      </main>
    </>
  );
}

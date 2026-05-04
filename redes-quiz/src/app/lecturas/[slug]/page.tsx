import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { lecturas, type Block } from "@/data/lecturas";

export function generateStaticParams() {
  return lecturas.map((l) => ({ slug: l.slug }));
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={i} className="text-white font-semibold text-lg mt-8 mb-3 first:mt-0">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p key={i} className="text-slate-300 text-sm leading-relaxed mb-4">
          {block.text}
        </p>
      );
    case "code":
      return (
        <pre key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 font-mono overflow-x-auto mb-4 leading-relaxed whitespace-pre">
          {block.text}
        </pre>
      );
    case "list":
      return (
        <ul key={i} className="mb-4 flex flex-col gap-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
              <span className="text-slate-500 shrink-0 mt-0.5">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j} className="text-left text-slate-400 font-medium text-xs uppercase tracking-wide pb-2 pr-6 border-b border-slate-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j} className="border-b border-slate-800/50">
                  {row.map((cell, k) => (
                    <td key={k} className="py-2.5 pr-6 text-slate-300 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "divider":
      return <hr key={i} className="border-slate-800 my-6" />;
  }
}

export default async function LecturaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lectura = lecturas.find((l) => l.slug === slug);
  if (!lectura) notFound();

  const idx = lecturas.findIndex((l) => l.slug === slug);
  const prev = lecturas[idx - 1];
  const next = lecturas[idx + 1];

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-10 bg-slate-950">
      <div className="w-full max-w-3xl">

        <Link
          href="/lecturas"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Todas las lecturas
        </Link>

        <header className="mb-8">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">
            {lectura.tag}
          </span>
          <h1 className="text-2xl font-bold text-white mt-1 mb-2">{lectura.title}</h1>
          <p className="text-slate-400 text-sm">{lectura.subtitle}</p>
        </header>

        <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          {lectura.blocks.map((block, i) => renderBlock(block, i))}
        </article>

        {(prev || next) && (
          <nav className="mt-6 grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={`/lecturas/${prev.slug}`}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-all"
              >
                <p className="text-slate-500 text-xs mb-1">← Anterior</p>
                <p className="text-white text-sm font-medium">{prev.title}</p>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/lecturas/${next.slug}`}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-all text-right"
              >
                <p className="text-slate-500 text-xs mb-1">Siguiente →</p>
                <p className="text-white text-sm font-medium">{next.title}</p>
              </Link>
            ) : <div />}
          </nav>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { AnimationFrame } from "./AnimationFrame";

const SAMPLES = [
  { mac: "00:1A:2B:3C:4D:5E", oui: "00:1A:2B", vendor: "Cisco", isMulticast: false, isLocal: false },
  { mac: "00:50:56:01:02:03", oui: "00:50:56", vendor: "VMware", isMulticast: false, isLocal: false },
  { mac: "B8:27:EB:11:22:33", oui: "B8:27:EB", vendor: "Raspberry Pi", isMulticast: false, isLocal: false },
  { mac: "FF:FF:FF:FF:FF:FF", oui: "FF:FF:FF", vendor: "—", isMulticast: true, isLocal: true, isBroadcast: true },
  { mac: "01:00:5E:00:00:01", oui: "01:00:5E", vendor: "IPv4 Multicast", isMulticast: true, isLocal: false },
  { mac: "02:42:AC:11:00:02", oui: "02:42:AC", vendor: "Local (Docker)", isMulticast: false, isLocal: true },
];

export function MacStructure() {
  const [idx, setIdx] = useState(0);
  const sample = SAMPLES[idx];
  const bytes = sample.mac.split(":");
  const firstByteBin = parseInt(bytes[0], 16).toString(2).padStart(8, "0");
  const bit7 = firstByteBin[7]; // I/G bit (LSB) — multicast if 1
  const bit6 = firstByteBin[6]; // U/L bit — locally administered if 1

  return (
    <AnimationFrame
      caption={
        <div>
          <p className="text-slate-300 font-medium mb-1">Una dirección MAC son <b>48 bits = 6 bytes</b>: los primeros 3 son el OUI (fabricante), los últimos 3 son el serial.</p>
          <p className="text-slate-500 text-xs">
            Los <b>2 bits menos significativos del primer byte</b> tienen significado especial: I/G (individual/group) y U/L (universal/local).
          </p>
        </div>
      }
      controls={
        <>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
                idx === i ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {s.mac}
            </button>
          ))}
        </>
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        {/* MAC display */}
        <div className="font-mono text-2xl sm:text-3xl text-center tracking-wider flex flex-wrap justify-center gap-1">
          {bytes.map((b, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded"
              style={{
                background: i < 3 ? "#f8514922" : "#3fb95022",
                color: i < 3 ? "#f85149" : "#3fb950",
                border: `1px solid ${i < 3 ? "#f85149" : "#3fb950"}`,
              }}
            >
              {b}
              {i < 5 && <span className="text-slate-500">:</span>}
            </span>
          ))}
        </div>

        {/* Section labels */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">OUI · 24 bits</p>
            <p className="font-mono text-sm text-red-300">{sample.oui}</p>
            <p className="text-slate-400 text-xs mt-1">Asignado por IEEE → fabricante</p>
            <p className="text-slate-300 text-sm font-bold mt-1">{sample.vendor}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">NIC · 24 bits</p>
            <p className="font-mono text-sm text-green-300">{bytes.slice(3).join(":")}</p>
            <p className="text-slate-400 text-xs mt-1">Asignado por el fabricante a la placa</p>
          </div>
        </div>

        {/* First byte zoom */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Primer byte en binario: {bytes[0]} = {firstByteBin}</p>
          <div className="flex justify-center gap-1 font-mono text-lg mb-3">
            {firstByteBin.split("").map((b, i) => {
              const isIG = i === 7;
              const isUL = i === 6;
              return (
                <span
                  key={i}
                  className={`px-2 py-1 rounded ${
                    isIG ? "bg-amber-500/20 text-amber-300 border border-amber-500/50" :
                    isUL ? "bg-purple-500/20 text-purple-300 border border-purple-500/50" :
                    "bg-slate-700 text-slate-400"
                  }`}
                >
                  {b}
                </span>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
              <p className="text-amber-400 font-bold">I/G (bit 0): {bit7}</p>
              <p className="text-slate-300 mt-1">
                {bit7 === "0" ? "Individual (unicast)" : "Group (multicast/broadcast)"}
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
              <p className="text-purple-400 font-bold">U/L (bit 1): {bit6}</p>
              <p className="text-slate-300 mt-1">
                {bit6 === "0" ? "Universal (asignada por IEEE)" : "Local (admin local)"}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          {sample.isBroadcast && (
            <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full font-medium">📢 BROADCAST</span>
          )}
          {sample.isMulticast && !sample.isBroadcast && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-medium">🎯 Multicast</span>
          )}
          {!sample.isMulticast && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full font-medium">📍 Unicast</span>
          )}
          {sample.isLocal && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-medium">🏠 Local</span>
          )}
          {!sample.isLocal && (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-medium">🌐 Universal (IEEE)</span>
          )}
        </div>
      </div>
    </AnimationFrame>
  );
}

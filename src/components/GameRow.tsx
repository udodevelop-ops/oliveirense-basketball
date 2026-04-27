"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Game } from "@/lib/types";

// Cache in memory to avoid repeated DB calls
const logoCache: Record<string, string | null> = {};
let cacheLoaded = false;
let cachePromise: Promise<void> | null = null;

async function loadLogoCache() {
  if (cacheLoaded) return;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    const supabase = createClient();
    const { data } = await supabase.from("team_logos").select("name, logo_url");
    if (data) data.forEach(t => { logoCache[t.name] = t.logo_url; });
    cacheLoaded = true;
  })();
  return cachePromise;
}

function TeamLogo({ name, overrideUrl, size = 48 }: { name: string; overrideUrl?: string | null; size?: number }) {
  const [src, setSrc] = useState<string | null>(overrideUrl || null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (overrideUrl) { setSrc(overrideUrl); return; }
    loadLogoCache().then(() => {
      setSrc(logoCache[name] ?? null);
    });
  }, [name, overrideUrl]);

  return (
    <div
      className="rounded-full overflow-hidden bg-[#1a1a24] border border-oliv-border flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {src && !errored ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-contain p-1"
          style={{ mixBlendMode: "screen" }}
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          className="font-extrabold"
          style={{ fontSize: size * 0.18, color: name === "OLIVEIRENSE" ? "#C8102E" : "#666" }}
        >
          {name.slice(0, 3)}
        </span>
      )}
    </div>
  );
}

export function GameRow({ game: g }: { game: Game }) {
  const isOlivHome = g.home_team === "OLIVEIRENSE";
  const isOlivAway = g.away_team === "OLIVEIRENSE";
  const hasResult = !!g.result;

  let homeScore: number | null = null;
  let awayScore: number | null = null;
  let olivWon = false;

  if (hasResult && g.result) {
    [homeScore, awayScore] = g.result.split("-").map(Number);
    olivWon =
      (isOlivHome && homeScore! > awayScore!) ||
      (isOlivAway && awayScore! > homeScore!);
  }

  return (
    <div className="flex items-center py-5 border-t border-oliv-border gap-5 flex-wrap">
      {/* Data */}
      <div className="min-w-[110px]">
        <div className="text-[14px] font-extrabold">{g.date_label}</div>
        <div className="text-[11px] text-gray-600 mt-1 tracking-wide">{g.time_label}</div>
      </div>

      {/* Equipas + placar */}
      <div className="flex-1 flex items-center gap-4 min-w-[300px]">
        {/* Casa */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className={`text-[13px] font-bold text-right ${isOlivHome ? "text-oliv-red" : "text-gray-300"}`}>
            {g.home_team}
          </span>
          <TeamLogo name={g.home_team} overrideUrl={g.home_logo_url} size={44} />
        </div>

        {/* Centro */}
        {hasResult ? (
          <div className="text-center min-w-[90px]">
            <div className="text-2xl font-black tracking-widest leading-none">
              <span className={homeScore! > awayScore! ? "text-green-400" : "text-red-400"}>{homeScore}</span>
              <span className="text-gray-700 mx-1">–</span>
              <span className={awayScore! > homeScore! ? "text-green-400" : "text-red-400"}>{awayScore}</span>
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${olivWon ? "text-green-400" : "text-red-400"}`}>
              {olivWon ? "✓ VITÓRIA" : "✗ DERROTA"}
            </div>
          </div>
        ) : (
          <div className="text-center min-w-[50px]">
            <div className="text-[13px] font-bold text-gray-600 tracking-[3px]">VS</div>
          </div>
        )}

        {/* Fora */}
        <div className="flex items-center gap-3 flex-1 justify-start">
          <TeamLogo name={g.away_team} overrideUrl={g.away_logo_url} size={44} />
          <span className={`text-[13px] font-bold ${isOlivAway ? "text-oliv-red" : "text-gray-300"}`}>
            {g.away_team}
          </span>
        </div>
      </div>

      {/* Local */}
      <div className="min-w-[160px] text-center">
        <div className="text-[10px] text-gray-600 uppercase tracking-wider leading-relaxed">
          {g.venue}
        </div>
      </div>

      {/* Competição + FPB */}
      <div className="min-w-[180px] text-right">
        <div className="text-[11px] font-extrabold uppercase leading-snug">{g.competition}</div>
        <div className="text-[11px] text-gray-600 mt-1">{g.round}</div>
        {g.fpb_url && (
          <a href={g.fpb_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-oliv-navy hover:text-white border border-oliv-navy/40 hover:border-oliv-navy px-2.5 py-1 rounded-full transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
            </svg>
            Estatísticas FPB
          </a>
        )}
      </div>
    </div>
  );
}

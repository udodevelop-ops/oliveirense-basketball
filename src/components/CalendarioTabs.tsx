"use client";

import { useState } from "react";
import { GameRow } from "./GameRow";
import type { Game } from "@/lib/types";

export default function CalendarioTabs({
  upcoming,
  results,
}: {
  upcoming: Game[];
  results: Game[];
}) {
  const [tab, setTab] = useState<"calendar" | "results">("calendar");

  return (
    <div>
      {/* Tabs — estilo Braga */}
      <div className="flex border-b border-oliv-border mt-6 mb-2">
        {[
          { key: "calendar", label: "CALENDÁRIO" },
          { key: "results", label: "RESULTADOS" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "calendar" | "results")}
            className={`px-6 py-3.5 text-[13px] font-bold tracking-[1.5px] transition-all border-b-2 -mb-px ${
              tab === t.key
                ? "text-white border-oliv-red"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {tab === "calendar" && (
          upcoming.length === 0 ? (
            <p className="text-gray-500 text-center py-16">Sem jogos agendados.</p>
          ) : (
            upcoming.map((g) => <GameRow key={g.id} game={g} />)
          )
        )}
        {tab === "results" && (
          results.length === 0 ? (
            <p className="text-gray-500 text-center py-16">Sem resultados disponíveis.</p>
          ) : (
            results.map((g) => <GameRow key={g.id} game={g} />)
          )
        )}
        <div className="border-t border-oliv-border" />
      </div>
    </div>
  );
}

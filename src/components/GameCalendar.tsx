"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { Game } from "@/lib/types";

const RED = "#C8102E";
const NAVY = "#1C3A6B";
const BORDER = "#1E1E2A";
const CLUB = "OLIVEIRENSE";

function TeamBadge({ name, isClub }: { name: string; isClub: boolean }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: isClub ? `${RED}22` : "#1a1a24",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 800,
        color: isClub ? RED : "#888",
        border: `1px solid ${isClub ? RED + "44" : BORDER}`,
        flexShrink: 0,
      }}
    >
      {name.slice(0, 3)}
    </div>
  );
}

export function GameCalendar({ games }: { games: Game[] }) {
  const [tab, setTab] = useState<"calendar" | "results">("calendar");

  const upcoming = games
    .filter((g) => g.status === "scheduled" || g.status === "live")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const results = games
    .filter((g) => g.status === "finished")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const display = tab === "calendar" ? upcoming : results;

  if (games.length === 0) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto 0", width: "100%", position: "relative" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
        {[
          { key: "calendar" as const, label: "CALENDÁRIO" },
          { key: "results" as const, label: "RESULTADOS" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none",
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              color: tab === t.key ? "#fff" : "#555",
              borderBottom: tab === t.key ? `2px solid ${RED}` : "2px solid transparent",
              paddingBottom: 8,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Games list */}
      {display.length === 0 ? (
        <p style={{ color: "#555", fontSize: 13, padding: "20px 0" }}>
          {tab === "calendar" ? "Sem jogos agendados." : "Sem resultados disponíveis."}
        </p>
      ) : (
        display.map((g, i) => {
          const isHomeClub = g.home_team.toUpperCase().includes(CLUB);
          const isAwayClub = g.away_team.toUpperCase().includes(CLUB);
          const gameDate = new Date(g.date + "T12:00:00");

          return (
            <div
              key={g.id || i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 0",
                borderTop: `1px solid ${BORDER}`,
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {/* Date */}
              <div style={{ minWidth: 110 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {format(gameDate, "dd MMM yyyy", { locale: pt }).toUpperCase()}
                </div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                  {format(gameDate, "EEE", { locale: pt }).toUpperCase()} {g.time || "15:00"}H
                </div>
              </div>

              {/* Teams */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  minWidth: 280,
                }}
              >
                <div style={{ textAlign: "right", flex: 1 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isHomeClub ? RED : "#ccc",
                    }}
                  >
                    {g.home_team}
                  </span>
                </div>

                <TeamBadge name={g.home_team} isClub={isHomeClub} />

                {/* Score or VS */}
                {g.status === "finished" && g.home_score !== null ? (
                  <div style={{ textAlign: "center", minWidth: 60 }}>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#fff",
                        letterSpacing: 2,
                      }}
                    >
                      {g.home_score} - {g.away_score}
                    </span>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#555",
                      letterSpacing: 2,
                      minWidth: 30,
                      textAlign: "center",
                    }}
                  >
                    VS
                  </span>
                )}

                <TeamBadge name={g.away_team} isClub={isAwayClub} />

                <div style={{ textAlign: "left", flex: 1 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isAwayClub ? RED : "#ccc",
                    }}
                  >
                    {g.away_team}
                  </span>
                </div>
              </div>

              {/* Venue */}
              {g.venue && (
                <div style={{ minWidth: 180, textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#555",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {g.venue}
                  </div>
                </div>
              )}

              {/* Competition */}
              <div style={{ minWidth: 200, textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{g.competition}</div>
                {g.round && (
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{g.round}</div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

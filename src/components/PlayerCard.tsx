import Link from "next/link";
import type { Player } from "@/lib/types";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/plantel/${player.id}`}
      className="group block bg-white rounded-lg overflow-hidden border border-oliv-surface-high hover:border-oliv-navy transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 1px 8px rgba(53,87,188,0.06)" }}
    >
      {/* Foto */}
      <div
        className="relative overflow-hidden"
        style={{ height: 280, background: "linear-gradient(160deg, #e7e8e9 0%, #edeeef 100%)" }}
      >
        {/* Numero watermark */}
        <div
          className="absolute right-0 bottom-0 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 120, color: "#3557bc", opacity: 0.08, lineHeight: 0.85 }}
        >
          {player.number}
        </div>

        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display font-black text-6xl" style={{ color: "#3557bc", opacity: 0.15 }}>
              {player.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
            </span>
          </div>
        )}

        {/* Posicao badge top-left */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[1.5px] px-2 py-1 rounded"
            style={{ background: "rgba(53,87,188,0.12)", color: "#3557bc" }}
          >
            {player.position}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Nome + Numero */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            className="font-display font-bold text-oliv-text leading-tight group-hover:text-oliv-red transition-colors"
            style={{ fontSize: 20, letterSpacing: "-0.01em" }}
          >
            {player.name}
          </h3>
          <span
            className="font-display font-black flex-shrink-0"
            style={{ fontSize: 22, color: "#bd001b", letterSpacing: "-0.02em" }}
          >
            #{player.number}
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          {[["PPG", player.ppg], ["APG", player.apg], ["RPG", player.rpg]].map(([label, value]) => (
            <div key={label as string}>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#926e6b" }}>
                {label}
              </div>
              <div className="font-display font-black text-oliv-text" style={{ fontSize: 20 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Botao */}
        <div
          className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors group-hover:text-oliv-red"
          style={{ color: "#3557bc", borderTop: "1px solid #e7e8e9", paddingTop: 12 }}
        >
          VER PERFIL
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

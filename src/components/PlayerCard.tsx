import Link from "next/link";
import type { Player } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/plantel/${player.id}`}
      className="group block rounded-xl p-6 text-center border transition-all duration-300 hover:-translate-y-1.5 hover:border-oliv-navy hover:shadow-[0_12px_40px_rgba(28,58,107,0.2)]"
      style={{ background: "#1C1C20", borderColor: "#2E2E36" }}
    >
      <div className="text-sm font-extrabold text-right mb-2" style={{ color: "#3A3A44" }}>
        #{player.number}
      </div>
      <div
        className="w-[90px] h-[90px] rounded-full mx-auto flex items-center justify-center overflow-hidden border-2 transition-all duration-300 group-hover:border-oliv-navy"
        style={{ background: "linear-gradient(135deg, rgba(28,58,107,0.2), rgba(200,16,46,0.1))", borderColor: "#2E2E36" }}
      >
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-extrabold" style={{ color: "#1C3A6B" }}>
            {getInitials(player.name)}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-white mt-3 mb-1">{player.name}</h3>
      <div className="text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: "#C8102E" }}>{player.position}</div>
      {player.height && <div className="text-[12px] mb-4" style={{ color: "#555560" }}>{player.height} • {player.age} anos</div>}
      <div className="flex justify-center gap-4 pt-4 border-t" style={{ borderColor: "#2E2E36" }}>
        {[["PTS", player.ppg], ["AST", player.apg], ["REB", player.rpg]].map(([label, value]) => (
          <div key={label as string} className="text-center">
            <div className="text-lg font-extrabold text-white">{value}</div>
            <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "#555560" }}>{label}</div>
          </div>
        ))}
      </div>
    </Link>
  );
}
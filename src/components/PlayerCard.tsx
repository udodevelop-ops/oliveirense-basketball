import Link from "next/link";
import type { Player } from "@/lib/types";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link href={`/plantel/${player.id}`}
      className="group block bg-white rounded-lg overflow-hidden border border-oliv-surface-high hover:border-oliv-navy transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 1px 4px rgba(53,87,188,0.06)" }}>

      {/* Player photo area */}
      <div className="relative h-52 overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #edeeef 0%, #e7e8e9 100%)" }}>
        {/* Number watermark */}
        <div className="absolute right-3 top-2 font-display font-black opacity-10 leading-none select-none"
          style={{ fontSize: 80, color: "#3557bc" }}>
          {player.number}
        </div>
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="font-display font-black text-5xl z-10" style={{ color: "#3557bc", opacity: 0.3 }}>
            {getInitials(player.name)}
          </span>
        )}
        {/* Position badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(53,87,188,0.1)", color: "#3557bc" }}>
            {player.position}
          </span>
        </div>
        {/* Number badge */}
        <div className="absolute top-3 right-3">
          <span className="font-display font-black text-oliv-red text-xl">#{player.number}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-oliv-text group-hover:text-oliv-red transition-colors"
          style={{ fontSize: 18, letterSpacing: "-0.01em" }}>
          {player.name}
        </h3>
        {player.height && (
          <div className="text-[12px] text-gray-500 mt-0.5">{player.height} &bull; {player.age} anos</div>
        )}

        {/* Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-oliv-surface-high">
          {[["PPG", player.ppg], ["APG", player.apg], ["RPG", player.rpg]].map(([label, value]) => (
            <div key={label as string} className="text-center flex-1">
              <div className="font-display font-black text-xl text-oliv-text">{value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "#926e6b" }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-[12px] font-bold text-oliv-navy group-hover:text-oliv-red transition-colors flex items-center gap-1">
          VER PERFIL <span className="text-[10px]">-&gt;</span>
        </div>
      </div>
    </Link>
  );
}

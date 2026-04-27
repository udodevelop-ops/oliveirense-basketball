import Link from "next/link";
import type { Player } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/plantel/${player.id}`}
      className="group block bg-oliv-card rounded-xl p-6 text-center border border-oliv-border hover:border-oliv-navy transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(28,58,107,.25)]"
    >
      <div className="text-sm font-extrabold text-gray-800 text-right">
        #{player.number}
      </div>

      {/* Avatar */}
      <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-oliv-navy/15 to-oliv-red/15 mx-auto flex items-center justify-center border-2 border-oliv-navy/20">
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-[32px] font-extrabold text-oliv-navy">
            {getInitials(player.name)}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold mt-3 mb-1">{player.name}</h3>
      <div className="text-[13px] text-oliv-red font-semibold uppercase tracking-wider">
        {player.position}
      </div>
      {player.height && (
        <div className="text-[13px] text-gray-500 mt-2">
          {player.height} • {player.age} anos
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-oliv-border">
        {[
          ["PTS", player.ppg],
          ["AST", player.apg],
          ["REB", player.rpg],
        ].map(([label, value]) => (
          <div key={label as string} className="text-center">
            <div className="text-lg font-extrabold">{value}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>
    </Link>
  );
}

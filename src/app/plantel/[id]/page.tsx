import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PlayerCard } from "@/components/PlayerCard";

export const revalidate = 60;

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams").select("*").eq("slug", slug).single();

  if (!team) notFound();

  const { data: schedules } = await supabase
    .from("team_schedules").select("*")
    .eq("team_id", team.id).order("display_order");

  const { data: members } = await supabase
    .from("team_players").select("*")
    .eq("team_id", team.id).order("display_order");

  const staff = members?.filter((m) => m.role === "staff") ?? [];
  const players = members?.filter((m) => m.role === "player") ?? [];

  // Convert team_players to Player format for PlayerCard
  const playerCards = players.map((p) => ({
    id: p.id,
    name: p.name,
    number: p.number || "0",
    position: p.position || "",
    height: null,
    age: null,
    bio: p.bio,
    photo_url: p.photo_url,
    ppg: 0,
    apg: 0,
    rpg: 0,
    active: true,
    display_order: p.display_order,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }));

  return (
    <div style={{ background: "#f8f9fa" }}>

      {/* Header */}
      <div className="bg-white border-b border-oliv-surface-high">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <Link href="/plantel" className="text-[12px] font-bold text-oliv-red hover:underline mb-4 inline-block uppercase tracking-wider">
            Plantel
          </Link>
          <div className="text-[11px] font-bold text-oliv-red uppercase tracking-[3px] mb-1">{team.season}</div>
          <h1 className="font-display font-extrabold text-oliv-text" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
            {team.name.toUpperCase()}
          </h1>
          {team.description && (
            <p className="text-gray-500 mt-2 max-w-2xl">{team.description}</p>
          )}
        </div>
      </div>

      {/* Foto de equipa */}
      {team.team_photo_url && (
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="rounded-xl overflow-hidden border border-oliv-surface-high" style={{ maxHeight: 420 }}>
            <img src={team.team_photo_url} alt={`Equipa ${team.name}`} className="w-full object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Main content */}
          <div className="lg:col-span-3 space-y-14">

            {/* STAFF */}
            {staff.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display font-bold text-oliv-text uppercase" style={{ fontSize: 20, letterSpacing: "0.05em" }}>
                    STAFF TECNICO
                  </h2>
                  <div className="flex-1 h-px bg-oliv-surface-high" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {staff.map((s) => (
                    <div key={s.id} className="bg-white rounded-lg overflow-hidden border border-oliv-surface-high text-center p-4">
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-oliv-surface-high flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #e7e8e9, #edeeef)" }}>
                        {s.photo_url
                          ? <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                          : <span className="font-display font-black text-2xl" style={{ color: "#3557bc", opacity: 0.3 }}>
                              {s.name.split(" ").slice(0,2).map((w: string) => w[0]).join("")}
                            </span>
                        }
                      </div>
                      <div className="font-bold text-sm text-oliv-text">{s.name}</div>
                      <div className="text-[11px] font-bold text-oliv-red uppercase tracking-wider mt-1">
                        {s.staff_role || "Staff"}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* JOGADORES */}
            {playerCards.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display font-bold text-oliv-text uppercase" style={{ fontSize: 20, letterSpacing: "0.05em" }}>
                    JOGADORES
                  </h2>
                  <div className="flex-1 h-px bg-oliv-surface-high" />
                  <span className="text-[12px] font-bold text-gray-400">{playerCards.length} jogadores</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {playerCards.map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>
              </section>
            )}

            {playerCards.length === 0 && staff.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p>Ainda nao ha membros registados neste escalao.</p>
                <Link href="/admin/escaloes" className="text-oliv-red text-sm font-bold mt-2 inline-block hover:underline">
                  Adicionar no admin
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - Treinos */}
          <aside className="lg:col-span-1">
            {schedules && schedules.length > 0 && (
              <div className="bg-white rounded-xl border border-oliv-surface-high p-6 sticky top-24"
                style={{ boxShadow: "0 2px 12px rgba(53,87,188,0.06)" }}>
                <h3 className="font-display font-bold text-oliv-text uppercase mb-5" style={{ fontSize: 16, letterSpacing: "0.05em" }}>
                  TREINOS
                </h3>
                <div className="space-y-4">
                  {schedules.map((s) => (
                    <div key={s.id} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-oliv-red mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="text-[13px] font-bold text-oliv-text">{s.day_of_week}</div>
                        <div className="text-[12px] text-gray-500">{s.start_time} - {s.end_time}</div>
                        <div className="text-[11px] text-gray-400">{s.venue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

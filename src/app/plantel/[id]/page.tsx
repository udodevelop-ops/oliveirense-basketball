import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export const revalidate = 60;

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!team) notFound();

  const { data: schedules } = await supabase
    .from("team_schedules")
    .select("*")
    .eq("team_id", team.id)
    .order("display_order");

  const { data: members } = await supabase
    .from("team_players")
    .select("*")
    .eq("team_id", team.id)
    .order("display_order");

  const staff = members?.filter((m) => m.role === "staff") ?? [];
  const players = members?.filter((m) => m.role === "player") ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div>
          <div className="text-[11px] font-bold text-oliv-red uppercase tracking-[2px] mb-1">
            {team.season}
          </div>
          <h1 className="font-display text-5xl tracking-[3px]">{team.name}</h1>
          {team.description && (
            <p className="text-gray-400 mt-3 max-w-2xl leading-relaxed">{team.description}</p>
          )}
        </div>
      </div>

      {/* Foto de equipa */}
      {team.team_photo_url && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-oliv-border">
          <img
            src={team.team_photo_url}
            alt={`Equipa ${team.name}`}
            className="w-full object-cover max-h-[480px]"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">

          {/* STAFF */}
          {staff.length > 0 && (
            <section>
              <h2 className="text-sm font-bold tracking-[2px] text-white border-b-2 border-oliv-navy inline-block pb-2 mb-6">
                STAFF TÉCNICO
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {staff.map((s) => (
                  <div key={s.id} className="bg-oliv-card border border-oliv-border rounded-xl p-4 text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-oliv-navy/20 border-2 border-oliv-navy/30 flex items-center justify-center">
                      {s.photo_url ? (
                        <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-extrabold text-oliv-navy">{getInitials(s.name)}</span>
                      )}
                    </div>
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-[11px] text-oliv-red font-semibold uppercase tracking-wider mt-1">
                      {s.staff_role || "Staff"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* JOGADORES */}
          {players.length > 0 && (
            <section>
              <h2 className="text-sm font-bold tracking-[2px] text-white border-b-2 border-oliv-red inline-block pb-2 mb-6">
                JOGADORES
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {players.map((p) => (
                  <div key={p.id} className="bg-oliv-card border border-oliv-border rounded-xl overflow-hidden group hover:border-oliv-navy transition-all">
                    {/* Foto */}
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-oliv-navy/10 to-oliv-red/10 flex items-center justify-center overflow-hidden">
                      {p.photo_url ? (
                        <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <span className="text-4xl font-extrabold text-oliv-navy/40">{getInitials(p.name)}</span>
                      )}
                      {/* Número sobreposto */}
                      {p.number && (
                        <div className="absolute top-2 left-2 w-8 h-8 bg-oliv-dark/80 rounded-lg flex items-center justify-center">
                          <span className="text-[11px] font-extrabold text-white">{p.number}</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <div className="font-bold text-sm leading-tight">{p.name}</div>
                      {p.position && (
                        <div className="text-[11px] text-oliv-red font-semibold uppercase tracking-wider mt-1">{p.position}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {players.length === 0 && staff.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p>Ainda não há membros registados neste escalão.</p>
            </div>
          )}
        </div>

        {/* SIDEBAR — Horários */}
        {schedules && schedules.length > 0 && (
          <aside>
            <div className="bg-oliv-card border border-oliv-border rounded-xl p-6 sticky top-24">
              <h2 className="text-sm font-bold tracking-[2px] text-white border-b-2 border-oliv-navy inline-block pb-2 mb-5">
                TREINOS
              </h2>
              <div className="space-y-3 mt-1">
                {schedules.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-oliv-red mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">{s.day_of_week}</div>
                      <div className="text-gray-500 text-[12px] mt-0.5">
                        {s.start_time} – {s.end_time}
                      </div>
                      <div className="text-gray-600 text-[11px]">{s.venue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

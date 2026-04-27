import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ArchivedSeasonPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const decodedSeason = decodeURIComponent(season);
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .eq("season", decodedSeason)
    .eq("is_current", false)
    .order("display_order");

  if (!teams || teams.length === 0) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px] mb-1">Arquivo</div>
        <h1 className="font-display text-4xl tracking-[3px]">Época {decodedSeason}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((t) => (
          <Link key={t.id} href={`/plantel/${t.slug}-${encodeURIComponent(decodedSeason)}`}
            className="group bg-oliv-card border border-oliv-border rounded-xl overflow-hidden hover:border-oliv-navy transition-all hover:-translate-y-1">
            {t.team_photo_url ? (
              <div className="h-48 overflow-hidden">
                <img src={t.team_photo_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-oliv-navy/10 to-oliv-red/10 flex items-center justify-center">
                <span className="font-display text-5xl text-oliv-navy/30 tracking-widest">{t.name}</span>
              </div>
            )}
            <div className="p-5">
              <div className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px] mb-1">{t.season}</div>
              <div className="text-lg font-bold">{t.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

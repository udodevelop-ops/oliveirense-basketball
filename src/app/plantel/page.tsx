import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const revalidate = 60;

export default async function PlantelPage() {
  const supabase = await createClient();

  const { data: teams } = await supabase
    .from("teams")
    .select("*")
    .eq("is_current", true)
    .order("display_order");

  if (!teams || teams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl tracking-[3px] mb-4">Plantel 2025/26</h1>
        <p className="text-gray-500">Os escalões ainda estão a ser configurados.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl tracking-[3px] mb-8">Plantel 2025/26</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((t) => (
          <Link key={t.id} href={`/plantel/${t.slug}`}
            className="group bg-oliv-card border border-oliv-border rounded-xl overflow-hidden hover:border-oliv-navy transition-all hover:-translate-y-1">
            {t.team_photo_url ? (
              <div className="h-44 overflow-hidden">
                <img src={t.team_photo_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="h-44 bg-gradient-to-br from-oliv-navy/10 to-oliv-red/10 flex items-center justify-center">
                <span className="font-display text-5xl text-oliv-navy/30 tracking-widest">{t.name}</span>
              </div>
            )}
            <div className="p-5">
              <div className="text-[11px] font-bold text-oliv-red uppercase tracking-[2px] mb-1">{t.season}</div>
              <div className="text-lg font-bold">{t.name}</div>
              {t.description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{t.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

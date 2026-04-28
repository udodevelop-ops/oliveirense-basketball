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
        <h1 className="font-display font-extrabold text-oliv-text mb-4" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
          O PLANTEL
        </h1>
        <p className="text-gray-400">Os escaloes estao a ser configurados.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8f9fa" }}>
      {/* Header */}
      <div className="border-b border-oliv-surface-high bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-[11px] font-bold text-oliv-red uppercase tracking-[3px] mb-2">2025/26</div>
          <h1 className="font-display font-extrabold text-oliv-text" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
            O <span className="text-oliv-red">PLANTEL</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl">
            Os guerreiros de Oliveira de Azemeis. Uma equipa construida na disciplina, velocidade e a perseguicao implacavel da vitoria.
          </p>
        </div>
      </div>

      {/* Escaloes */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {teams.map((t) => (
            <Link key={t.id} href={`/plantel/${t.slug}`}
              className="block text-center px-3 py-2.5 rounded-full text-[12px] font-bold border transition-all hover:bg-oliv-red hover:text-white hover:border-oliv-red"
              style={{ borderColor: "#e7e8e9", color: "#191c1d", background: "#fff" }}>
              {t.name}
            </Link>
          ))}
        </div>

        {/* Grid de equipas com preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <Link key={t.id} href={`/plantel/${t.slug}`}
              className="group block bg-white rounded-xl overflow-hidden border border-oliv-surface-high hover:border-oliv-navy transition-all hover:-translate-y-1"
              style={{ boxShadow: "0 2px 12px rgba(53,87,188,0.06)" }}>
              {/* Imagem ou placeholder */}
              <div className="h-44 overflow-hidden relative"
                style={{ background: t.team_photo_url ? undefined : "linear-gradient(135deg, #191c1d 0%, #2e3132 100%)" }}>
                {t.team_photo_url && (
                  <img src={t.team_photo_url} alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                {!t.team_photo_url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-black text-white opacity-20" style={{ fontSize: 48 }}>{t.name}</span>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(25,28,29,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-4 left-4">
                  <div className="text-[10px] font-bold text-oliv-red uppercase tracking-[2px]">{t.season}</div>
                  <div className="font-display font-bold text-white text-xl">{t.name}</div>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-gray-500">Ver equipa</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bd001b" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

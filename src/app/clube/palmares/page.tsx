import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

const MEDAL: Record<string, string> = {
  "1º Lugar": "🥇",
  "2º Lugar": "🥈",
  "3º Lugar": "🥉",
};

export default async function PalmaresPage() {
  const supabase = await createClient();

  const { data: titles } = await supabase
    .from("palmares")
    .select("*")
    .order("season", { ascending: false })
    .order("team_name");

  const grouped: Record<string, typeof titles> = {};
  for (const t of titles ?? []) {
    if (!grouped[t.season]) grouped[t.season] = [];
    grouped[t.season]!.push(t);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-bold text-oliv-red uppercase tracking-[2px] mb-1">Clube</div>
        <h1 className="font-display text-4xl tracking-[3px]">Palmarés de Formação</h1>
        <p className="text-gray-500 mt-2 text-sm">Títulos e conquistas das equipas de formação da Oliveirense Basquetebol.</p>
      </div>

      {(!titles || titles.length === 0) && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">🏆</div>
          <p>Ainda não há títulos registados.</p>
        </div>
      )}

      <div className="space-y-10">
        {Object.entries(grouped).map(([season, items]) => (
          <section key={season}>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-lg font-extrabold tracking-[2px]">{season}</h2>
              <div className="flex-1 h-px bg-oliv-border" />
              <span className="text-xs text-gray-600 font-semibold">{items!.length} título{items!.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-oliv-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-oliv-card border-b border-oliv-border">
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Escalão</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Competição</th>
                    <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Posição</th>
                  </tr>
                </thead>
                <tbody>
                  {items!.map((t, i) => (
                    <tr key={t.id} className={`border-b border-oliv-border/50 ${i % 2 === 0 ? "bg-oliv-dark/30" : "bg-oliv-card/30"}`}>
                      <td className="px-5 py-3.5 font-semibold text-white">{t.team_name}</td>
                      <td className="px-5 py-3.5 text-gray-300">{t.competition}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-[12px] ${
                          t.position === "1º Lugar" ? "text-yellow-400" :
                          t.position === "2º Lugar" ? "text-gray-300" :
                          t.position === "3º Lugar" ? "text-amber-600" :
                          "text-gray-400"
                        }`}>
                          {MEDAL[t.position] || ""} {t.position}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

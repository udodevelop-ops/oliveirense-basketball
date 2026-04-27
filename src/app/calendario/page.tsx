import { createClient } from "@/lib/supabase/server";
import { GameRow } from "@/components/GameRow";
import CalendarioTabs from "@/components/CalendarioTabs";

export const revalidate = 60;

export default async function CalendarioPage() {
  const supabase = await createClient();

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("date", { ascending: true });

  const upcoming = games?.filter((g) => !g.result) ?? [];
  const results = [...(games?.filter((g) => !!g.result) ?? [])].reverse();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl tracking-[3px] mb-0">
        Calendário 2025/26
      </h1>
      <CalendarioTabs upcoming={upcoming} results={results} />
    </div>
  );
}

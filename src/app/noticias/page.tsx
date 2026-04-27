import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/NewsCard";

export const revalidate = 60;

export default async function NoticiasPage() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl tracking-[3px] mb-8">Notícias</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news?.map((n) => <NewsCard key={n.id} news={n} />)}
      </div>

      {(!news || news.length === 0) && (
        <p className="text-gray-500 text-center py-20">
          Ainda não há notícias publicadas.
        </p>
      )}
    </div>
  );
}

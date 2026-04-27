import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link
        href="/noticias"
        className="text-oliv-navy text-sm font-semibold hover:underline"
      >
        ← Voltar às notícias
      </Link>

      <article className="max-w-3xl mt-6">
        {article.image_url && (
          <div
            className="h-80 bg-cover bg-center rounded-xl mb-6"
            style={{ backgroundImage: `url(${article.image_url})` }}
          />
        )}

        <span className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px]">
          {article.category}
        </span>

        <h1 className="text-3xl font-extrabold mt-3 mb-2">{article.title}</h1>

        <p className="text-gray-500 text-sm mb-6">
          {format(new Date(article.date), "d 'de' MMMM 'de' yyyy", {
            locale: pt,
          })}
        </p>

        {article.subtitle && (
          <p className="text-lg text-gray-300 font-medium leading-relaxed mb-5 border-l-[3px] border-oliv-navy pl-4">
            {article.subtitle}
          </p>
        )}

        <div className="text-gray-400 leading-relaxed text-[15px] whitespace-pre-line">
          {article.content}
        </div>
      </article>
    </div>
  );
}

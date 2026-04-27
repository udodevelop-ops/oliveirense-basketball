import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/NewsCard";
import { PlayerCard } from "@/components/PlayerCard";
import { GameCalendar } from "@/components/GameCalendar";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false })
    .limit(3);

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("display_order")
    .limit(3);

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("date", { ascending: true });

  const { data: settings } = await supabase
    .from("club_settings")
    .select("*");

  const getSetting = (key: string) =>
    settings?.find((s) => s.key === key)?.value ?? "";

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[520px] flex flex-col justify-center px-6 py-20 overflow-hidden bg-gradient-to-br from-oliv-dark via-[#0E0E1A] to-oliv-dark">
        {/* Glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(28,58,107,.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(200,16,46,.08)_0%,transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[3px] text-oliv-navy border border-oliv-navy/40 px-4 py-1.5 rounded-full mb-5">
            <Image
              src="/logo.png"
              alt=""
              width={20}
              height={20}
              className="rounded-full object-cover"
            />
            TEMPORADA {getSetting("season")}
          </div>

          <h1 className="font-display text-7xl leading-[0.95] tracking-wider">
            OLIVEIRENSE
            <br />
            <span className="text-oliv-red">BASQUETEBOL</span>
          </h1>

          <p className="text-gray-500 text-lg mt-4 max-w-md">
            Uma nova era começa agora.{" "}
            <span className="text-oliv-navy font-semibold">
              Força Oliveirense!
            </span>
          </p>

          <div className="flex gap-3 mt-6 flex-wrap">
            <Link
              href="/plantel"
              className="bg-oliv-navy text-white px-8 py-3.5 rounded-lg text-sm font-bold tracking-wide hover:bg-oliv-navy-light transition-colors"
            >
              Ver plantel
            </Link>
            <Link
              href="/noticias"
              className="border border-oliv-navy text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-oliv-navy/10 transition-colors"
            >
              Últimas notícias
            </Link>
          </div>
        </div>

        {/* Calendário de jogos */}
        <div className="relative max-w-7xl mx-auto w-full px-6">
          <GameCalendar games={games ?? []} />
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold tracking-wider flex items-center gap-3">
            <span className="inline-block w-1 h-6 bg-oliv-red rounded" />
            Últimas Notícias
          </h2>
          <Link
            href="/noticias"
            className="text-oliv-navy text-[13px] font-semibold hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news?.map((n) => <NewsCard key={n.id} news={n} />)}
        </div>
      </section>

      {/* PLANTEL */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-oliv-surface">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold tracking-wider flex items-center gap-3">
            <span className="inline-block w-1 h-6 bg-oliv-red rounded" />
            Destaques do Plantel
          </h2>
          <Link
            href="/plantel"
            className="text-oliv-navy text-[13px] font-semibold hover:underline"
          >
            Ver plantel →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {players?.map((p) => <PlayerCard key={p.id} player={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-oliv-border bg-gradient-to-br from-[#0E0E1A] to-oliv-dark">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-wider">
            JUNTA-TE À <span className="text-oliv-red">FAMÍLIA</span>
          </h2>
          <p className="text-gray-400 text-base mt-3 mb-6 max-w-lg mx-auto">
            Inscrições abertas para todas as camadas. Vem fazer parte do
            projeto.
          </p>
          <Link
            href="/clube"
            className="inline-block bg-oliv-navy text-white px-8 py-3.5 rounded-lg text-sm font-bold tracking-wide hover:bg-oliv-navy-light transition-colors"
          >
            Saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}

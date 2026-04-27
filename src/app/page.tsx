import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/NewsCard";
import { PlayerCard } from "@/components/PlayerCard";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news").select("*").eq("published", true)
    .order("date", { ascending: false }).limit(3);

  const { data: players } = await supabase
    .from("players").select("*").eq("active", true)
    .order("display_order").limit(3);

  const { data: settings } = await supabase.from("club_settings").select("*");
  const get = (key: string) => settings?.find((s) => s.key === key)?.value ?? "";

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[540px] flex flex-col justify-center px-6 py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #141416 0%, #1a1a1f 40%, #1C1C20 60%, #141416 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 65% 40%, rgba(28,58,107,0.18) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 75%, rgba(200,16,46,0.1) 0%, transparent 55%)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full border text-[11px] font-bold tracking-[2.5px] uppercase"
            style={{ borderColor: "rgba(28,58,107,0.5)", color: "#6B8FCC", background: "rgba(28,58,107,0.1)" }}>
            <Image src="/logo.png" alt="" width={18} height={18} className="object-contain" />
            Temporada {get("season")}
          </div>

          <h1 className="font-display leading-[0.9] tracking-wider mb-5" style={{ fontSize: "clamp(56px, 8vw, 88px)" }}>
            <span className="text-white">OLIVEIRENSE</span><br />
            <span style={{ color: "#C8102E" }}>BASQUETEBOL</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-md mb-8 leading-relaxed">
            Uma nova era começa agora.{" "}
            <span className="font-semibold" style={{ color: "#6B8FCC" }}>Força Oliveirense!</span>
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link href="/plantel"
              className="px-8 py-3.5 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1C3A6B, #2a5199)" }}>
              Ver plantel
            </Link>
            <Link href="/noticias"
              className="px-8 py-3.5 rounded-lg text-sm font-semibold text-gray-300 border transition-all hover:text-white hover:bg-white/5"
              style={{ borderColor: "#2E2E36" }}>
              Últimas notícias
            </Link>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #2E2E36 20%, #2E2E36 80%, transparent)" }} />

      {/* NOTÍCIAS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold tracking-wider flex items-center gap-3">
            <span className="inline-block w-1 h-6 rounded-sm" style={{ background: "#C8102E" }} />
            <span className="text-white">Últimas Notícias</span>
          </h2>
          <Link href="/noticias" className="text-sm font-semibold hover:text-white transition-colors" style={{ color: "#6B8FCC" }}>
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news?.map((n) => <NewsCard key={n.id} news={n} />)}
          {(!news || news.length === 0) && (
            <p className="text-gray-600 col-span-3 py-8 text-center">Ainda não há notícias publicadas.</p>
          )}
        </div>
      </section>

      {/* PLANTEL */}
      <section className="py-16 px-6" style={{ background: "#1C1C20" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-extrabold tracking-wider flex items-center gap-3">
              <span className="inline-block w-1 h-6 rounded-sm" style={{ background: "#C8102E" }} />
              <span className="text-white">Destaques do Plantel</span>
            </h2>
            <Link href="/plantel" className="text-sm font-semibold hover:text-white transition-colors" style={{ color: "#6B8FCC" }}>
              Ver plantel →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {players?.map((p) => <PlayerCard key={p.id} player={p} />)}
            {(!players || players.length === 0) && (
              <p className="text-gray-600 col-span-3 py-8 text-center">Ainda não há jogadores registados.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 px-6" style={{ background: "#141416" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(28,58,107,0.12) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="font-display text-4xl tracking-wider text-white mb-3">
            JUNTA-TE À <span style={{ color: "#C8102E" }}>FAMÍLIA</span>
          </h2>
          <p className="text-gray-400 text-base mb-8 max-w-lg mx-auto">
            Inscrições abertas para todas as camadas. Vem fazer parte do projeto.
          </p>
          <Link href="/clube"
            className="inline-block px-10 py-4 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1C3A6B, #2a5199)" }}>
            Saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}

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
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ minHeight: 560, background: "#141416" }}>

        {/* Faixa vermelha diagonal no fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute"
            style={{
              right: "-5%", top: 0, bottom: 0, width: "52%",
              background: "linear-gradient(175deg, #C8102E 0%, #8B0A1F 100%)",
              clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)"
            }} />
          {/* Textura subtil sobre o vermelho */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 8px)",
              right: "-5%", left: "45%"
            }} />
        </div>

        {/* Conteúdo */}
        <div className="relative max-w-7xl mx-auto px-6 flex items-center" style={{ minHeight: 560 }}>

          {/* Esquerda — texto */}
          <div className="flex-1 py-16 pr-8 z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[2px] uppercase"
              style={{ background: "rgba(200,16,46,0.15)", color: "#ff6b6b", border: "1px solid rgba(200,16,46,0.3)" }}>
              ● Temporada {get("season") || "2025/26"}
            </div>

            <h1 className="font-display text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(52px, 7vw, 80px)", letterSpacing: "2px" }}>
              UNIDOS PELA<br />
              <span style={{ color: "#C8102E", WebkitTextStroke: "1px #ff4444" }}>BOLA</span>
            </h1>

            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm">
              Oliveirense Basquetebol — paixão, dedicação e espírito de equipa em cada jogo.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/plantel"
                className="px-7 py-3.5 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #C8102E, #8B0A1F)" }}>
                Ver Plantel
              </Link>
              <Link href="/calendario"
                className="px-7 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-all hover:bg-white/10"
                style={{ color: "#ccc", border: "1px solid rgba(255,255,255,0.15)" }}>
                Calendário
              </Link>
            </div>
          </div>

          {/* Direita — Logo grande */}
          <div className="relative z-10 flex-shrink-0 flex items-center justify-center"
            style={{ width: "clamp(220px, 35vw, 420px)", height: "clamp(220px, 35vw, 420px)" }}>
            {/* Glow atrás do logo */}
            <div className="absolute inset-0 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }} />
            <Image
              src="/logo.png"
              alt="U.D. Oliveirense"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 220px, 420px"
              priority
            />
          </div>
        </div>

        {/* Linha decorativa em baixo */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #C8102E 30%, #1C3A6B 70%, transparent)" }} />
      </section>

      {/* ═══ NOTÍCIAS ═══ */}
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

      {/* ═══ PLANTEL ═══ */}
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

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden py-20 px-6" style={{ background: "#141416" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,16,46,0.08) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="font-display text-4xl tracking-wider text-white mb-3">
            JUNTA-TE À <span style={{ color: "#C8102E" }}>FAMÍLIA</span>
          </h2>
          <p className="text-gray-400 text-base mb-8 max-w-lg mx-auto">
            Inscrições abertas para todas as camadas. Vem fazer parte do projeto.
          </p>
          <Link href="/clube"
            className="inline-block px-10 py-4 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #C8102E, #8B0A1F)" }}>
            Saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}

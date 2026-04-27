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
      <section className="relative overflow-hidden" style={{ minHeight: 560 }}>

        {/* Fundo gradiente azul marinho */}
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(125deg, #0a0e1a 0%, #0f1628 30%, #1a2540 55%, #0d1420 80%, #080c14 100%)"
          }} />

        {/* Linhas decorativas subtis */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, #4A6FA5 0px, #4A6FA5 1px, transparent 1px, transparent 60px)"
          }} />

        {/* Glow azul no centro-direita */}
        <div className="absolute"
          style={{
            right: "5%", top: "50%", transform: "translateY(-50%)",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(28,58,107,0.5) 0%, rgba(28,58,107,0.15) 40%, transparent 70%)",
            filter: "blur(40px)"
          }} />

        {/* Glow vermelho subtil na esquerda */}
        <div className="absolute"
          style={{
            left: "-5%", bottom: "0%",
            width: 400, height: 300,
            background: "radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)",
            filter: "blur(60px)"
          }} />

        {/* Conteudo */}
        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ minHeight: 560 }}>

          {/* Esquerda - Texto */}
          <div className="flex-1 py-20 pr-12 z-10 max-w-xl">

            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[2px] uppercase"
              style={{ background: "rgba(200,16,46,0.15)", color: "#ff8096", border: "1px solid rgba(200,16,46,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-oliv-red inline-block" />
              Temporada {get("season") || "2025/26"}
            </div>

            <h1 className="font-display text-white leading-[0.92] mb-6 tracking-wide"
              style={{ fontSize: "clamp(54px, 7vw, 82px)" }}>
              OLIVEIRENSE<br />
              <span style={{
                background: "linear-gradient(135deg, #C8102E 0%, #ff4466 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                BASQUETEBOL
              </span>
            </h1>

            <p style={{ color: "#8A9BB5", fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 400 }}>
              Paixao, dedicacao e espirito de equipa em cada jogo.
              Forca Oliveirense!
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/plantel"
                className="px-7 py-3.5 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:brightness-110 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #C8102E 0%, #8B0A1F 100%)", boxShadow: "0 4px 20px rgba(200,16,46,0.35)" }}>
                Ver Plantel
              </Link>
              <Link href="/calendario"
                className="px-7 py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-all hover:-translate-y-0.5"
                style={{ color: "#A0B8D8", border: "1px solid rgba(74,111,165,0.4)", background: "rgba(28,58,107,0.2)" }}>
                Calendario
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8" style={{ borderTop: "1px solid rgba(74,111,165,0.2)" }}>
              {[["22", "Vitorias"], ["8", "Derrotas"], ["89.3", "Pts/Jogo"]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-white text-3xl tracking-wider">{v}</div>
                  <div className="text-[11px] uppercase tracking-[1.5px] mt-1" style={{ color: "#556688" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Direita - Logo */}
          <div className="relative flex-shrink-0 flex items-center justify-center z-10"
            style={{ width: "clamp(260px, 38vw, 460px)", height: "clamp(260px, 38vw, 460px)" }}>
            {/* Anel decorativo */}
            <div className="absolute inset-8 rounded-full opacity-20"
              style={{ border: "1px solid #4A6FA5" }} />
            <div className="absolute inset-16 rounded-full opacity-10"
              style={{ border: "1px solid #4A6FA5" }} />
            {/* Logo */}
            <Image
              src="/logo.png"
              alt="U.D. Oliveirense"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 40px rgba(28,58,107,0.6)) drop-shadow(0 0 80px rgba(28,58,107,0.3))" }}
              sizes="(max-width: 768px) 260px, 460px"
              priority
            />
          </div>
        </div>

        {/* Linha em baixo */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #1C3A6B 30%, #C8102E 50%, #1C3A6B 70%, transparent)" }} />
      </section>

      {/* NOTICIAS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-extrabold tracking-wider flex items-center gap-3">
            <span className="inline-block w-1 h-6 rounded-sm" style={{ background: "#C8102E" }} />
            <span className="text-white">Ultimas Noticias</span>
          </h2>
          <Link href="/noticias" className="text-sm font-semibold hover:text-white transition-colors" style={{ color: "#6B8FCC" }}>
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news?.map((n) => <NewsCard key={n.id} news={n} />)}
          {(!news || news.length === 0) && (
            <p className="text-gray-600 col-span-3 py-8 text-center">Ainda nao ha noticias publicadas.</p>
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
              Ver plantel
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {players?.map((p) => <PlayerCard key={p.id} player={p} />)}
            {(!players || players.length === 0) && (
              <p className="text-gray-600 col-span-3 py-8 text-center">Ainda nao ha jogadores registados.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 px-6" style={{ background: "#0f1628" }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(28,58,107,0.2) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="font-display text-4xl tracking-wider text-white mb-3">
            JUNTA-TE A <span style={{ color: "#C8102E" }}>FAMILIA</span>
          </h2>
          <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "#8A9BB5" }}>
            Inscricoes abertas para todas as camadas. Vem fazer parte do projeto.
          </p>
          <Link href="/clube"
            className="inline-block px-10 py-4 rounded-lg text-sm font-bold text-white tracking-wide transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #1C3A6B, #2a5199)", boxShadow: "0 4px 20px rgba(28,58,107,0.4)" }}>
            Saber mais
          </Link>
        </div>
      </section>
    </div>
  );
}

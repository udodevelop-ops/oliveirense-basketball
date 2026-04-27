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
    .order("date", { ascending: false }).limit(4);

  const { data: players } = await supabase
    .from("players").select("*").eq("active", true)
    .order("display_order").limit(4);

  const { data: settings } = await supabase.from("club_settings").select("*");
  const get = (key: string) => settings?.find((s) => s.key === key)?.value ?? "";

  return (
    <div style={{ background: "#f8f9fa" }}>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "#191c1d", minHeight: 560 }}>
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&q=80)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(25,28,29,0.98) 40%, rgba(25,28,29,0.7) 70%, rgba(53,87,188,0.4) 100%)" }} />

        {/* Red accent line top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-oliv-red" />

        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ minHeight: 560 }}>
          {/* Left - Text */}
          <div className="flex-1 py-20 pr-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[2px] uppercase"
              style={{ background: "rgba(189,0,27,0.2)", color: "#ff6b7a", border: "1px solid rgba(189,0,27,0.4)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-oliv-red inline-block pulse-red" />
              TEMPORADA {get("season") || "2025/26"}
            </div>

            <h1 className="font-display font-extrabold text-white leading-[1.0] mb-6"
              style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.02em" }}>
              FOR THE HEART<br />OF{" "}
              <span className="text-oliv-red">OLIVEIRA</span><br />
              DE AZEMEIS.
            </h1>

            <p className="mb-8 leading-relaxed" style={{ color: "#8a9099", fontSize: 16, maxWidth: 420 }}>
              Join the legacy. Experience the adrenaline of every play,
              the roar of the crowd, and the pursuit of victory.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link href="/plantel"
                className="px-6 py-3 rounded text-sm font-bold text-white tracking-wide transition-all hover:brightness-110"
                style={{ background: "#bd001b" }}>
                VER PLANTEL
              </Link>
              <Link href="/clube"
                className="px-6 py-3 rounded text-sm font-bold tracking-wide transition-all hover:bg-white/10"
                style={{ color: "#ffffff", border: "2px solid rgba(255,255,255,0.3)" }}>
                SOBRE O CLUBE
              </Link>
            </div>
          </div>

          {/* Right - Logo large */}
          <div className="relative flex-shrink-0 hidden lg:flex items-center justify-center"
            style={{ width: 380, height: 380 }}>
            <div className="absolute inset-0 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #3557bc 0%, transparent 70%)" }} />
            <Image
              src="/logo.png"
              alt="U.D. Oliveirense"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 60px rgba(53,87,188,0.4))" }}
              sizes="380px"
              priority
            />
          </div>
        </div>

        {/* Bottom slant */}
        <div className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: "#f8f9fa", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </section>

      {/* PROXIMO JOGO + CLASSIFICACAO */}
      <section className="max-w-7xl mx-auto px-6 -mt-1 pb-16 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Proximo jogo */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-oliv-surface-high p-6"
            style={{ boxShadow: "0 2px 12px rgba(53,87,188,0.06)" }}>
            <div className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px] mb-4">Proximo Jogo</div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[13px] font-semibold text-gray-500 mb-1">Liga Betclic | Jornada 22</div>
                <div className="font-display font-bold text-oliv-text" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
                  NOV 14, 21:00
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-oliv-surface-low flex items-center justify-center overflow-hidden mx-auto mb-1">
                    <Image src="/logo.png" alt="UDO" width={40} height={40} className="object-contain" />
                  </div>
                  <div className="text-[11px] font-bold text-oliv-red">UDO</div>
                </div>
                <div className="text-center px-4">
                  <div className="font-display text-2xl font-black text-gray-300">VS</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Liga Betclic</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-oliv-surface-low flex items-center justify-center mx-auto mb-1">
                    <span className="text-[11px] font-bold text-gray-500">SLB</span>
                  </div>
                  <div className="text-[11px] font-bold text-gray-600">SL Benfica</div>
                </div>
              </div>
              <Link href="/calendario"
                className="px-5 py-2.5 rounded text-sm font-bold text-white whitespace-nowrap"
                style={{ background: "#bd001b" }}>
                VER JOGO
              </Link>
            </div>
          </div>

          {/* Classificacao */}
          <div className="bg-oliv-navy rounded-lg p-6" style={{ boxShadow: "0 2px 12px rgba(53,87,188,0.2)" }}>
            <div className="text-[11px] font-bold text-oliv-navy-light uppercase tracking-[2px] mb-4">Classificacao</div>
            {[
              { pos: 1, name: "FC Porto", pts: 24 },
              { pos: 2, name: "UD Oliveirense", pts: 22, highlight: true },
              { pos: 3, name: "SL Benfica", pts: 21 },
              { pos: 4, name: "Sporting CP", pts: 20 },
            ].map((t) => (
              <div key={t.pos} className={`flex items-center justify-between py-2 ${t.highlight ? "text-white" : "text-white/60"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold w-4">{t.pos}</span>
                  <span className={`text-[13px] font-semibold ${t.highlight ? "text-white" : ""}`}>{t.name}</span>
                </div>
                <span className={`text-[13px] font-bold px-2.5 py-0.5 rounded ${t.highlight ? "bg-oliv-red text-white" : ""}`}>{t.pts} PTS</span>
              </div>
            ))}
            <Link href="/calendario" className="block mt-4 text-[12px] font-semibold text-oliv-navy-light hover:text-white transition-colors">
              VER TABELA COMPLETA
            </Link>
          </div>
        </div>
      </section>

      {/* NOTICIAS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-[11px] font-bold text-oliv-red uppercase tracking-[3px] mb-2">THE DAILY COURT</div>
            <h2 className="font-display font-extrabold text-oliv-text" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>
              ULTIMAS NOTICIAS
            </h2>
            <div className="h-0.5 w-12 bg-oliv-red mt-2" />
          </div>
          <Link href="/noticias" className="text-[13px] font-bold text-oliv-red hover:text-oliv-red-dark transition-colors tracking-wide">
            VER TODAS AS NOTICIAS
          </Link>
        </div>

        {/* Featured + side */}
        {news && news.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Featured large */}
            <Link href={`/noticias/${news[0].id}`} className="lg:col-span-2 group relative rounded-lg overflow-hidden block"
              style={{ minHeight: 360 }}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: news[0].image_url ? `url(${news[0].image_url})` : "linear-gradient(135deg, #3557bc, #bd001b)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(25,28,29,0.95) 0%, rgba(25,28,29,0.3) 60%, transparent 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                  style={{ background: "#bd001b", color: "#fff" }}>
                  {news[0].category}
                </span>
                <h3 className="font-display font-bold text-white leading-tight text-2xl">{news[0].title}</h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">{news[0].subtitle}</p>
              </div>
            </Link>

            {/* Side news */}
            <div className="flex flex-col gap-4">
              {news.slice(1, 4).map((n) => (
                <Link key={n.id} href={`/noticias/${n.id}`}
                  className="flex gap-3 bg-white rounded-lg p-3 border border-oliv-surface-high hover:border-oliv-navy transition-all group"
                  style={{ boxShadow: "0 1px 4px rgba(53,87,188,0.04)" }}>
                  <div className="w-20 h-16 rounded flex-shrink-0 overflow-hidden"
                    style={{ background: n.image_url ? undefined : "linear-gradient(135deg, #3557bc, #bd001b)" }}>
                    {n.image_url && <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${n.image_url})` }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-oliv-navy uppercase tracking-wider">{n.category}</span>
                    <h4 className="text-[13px] font-bold text-oliv-text leading-snug mt-0.5 group-hover:text-oliv-red transition-colors line-clamp-2">{n.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* RESULTADOS */}
      <section className="py-20 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-extrabold text-oliv-text mb-8" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>
            ULTIMOS RESULTADOS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { date: "5 ABR", comp: "Liga Betclic", home: "Oliveirense", hs: 89, as: 72, away: "Vitoria SC", win: true },
              { date: "29 MAR", comp: "Liga Betclic", home: "Lusitania", hs: 68, as: 75, away: "Oliveirense", win: true },
              { date: "22 MAR", comp: "Liga Betclic", home: "Oliveirense", hs: 82, as: 71, away: "Academica", win: true },
              { date: "8 MAR", comp: "Liga Betclic", home: "Imortal", hs: 61, as: 83, away: "Oliveirense", win: true },
            ].map((r, i) => (
              <div key={i} className="bg-oliv-surface-low rounded-lg p-4 border border-oliv-surface-high">
                <div className="text-[10px] font-bold text-oliv-navy uppercase tracking-wider mb-1">{r.date} - {r.comp}</div>
                <div className="flex items-center justify-between my-3">
                  <div className="text-[13px] font-bold text-oliv-text">{r.home}</div>
                  <div className="font-display font-black text-xl text-oliv-text">
                    <span className={r.home === "Oliveirense" && r.win ? "text-oliv-red" : ""}>{r.hs}</span>
                    <span className="text-gray-300 mx-1">-</span>
                    <span className={r.away === "Oliveirense" && r.win ? "text-oliv-red" : ""}>{r.as}</span>
                  </div>
                  <div className="text-[13px] font-bold text-oliv-text text-right">{r.away}</div>
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${r.win ? "text-green-600" : "text-oliv-red"}`}>
                  {r.win ? "VITORIA" : "DERROTA"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="py-20 px-6" style={{ background: "#2e3132" }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-extrabold text-white leading-tight" style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
              NEVER MISS<br />A BEAT.
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-md leading-relaxed">
              Subscreve a nossa newsletter para entrevistas exclusivas,
              pre-venda de bilhetes e noticias direto na tua caixa de correio.
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <input
              type="email"
              placeholder="O teu email"
              className="flex-1 lg:w-72 px-4 py-3 rounded text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-oliv-red transition-colors"
            />
            <button className="px-6 py-3 rounded text-sm font-bold text-white whitespace-nowrap transition-all hover:brightness-110"
              style={{ background: "#bd001b" }}>
              SUBSCREVER
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

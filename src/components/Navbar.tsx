"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Lock, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Team } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const [teams, setTeams] = useState<Team[]>([]);
  const [archiveSeasons, setArchiveSeasons] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const plantelRef = useRef<HTMLDivElement>(null);
  const clubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("teams").select("*").order("display_order").then(({ data }) => {
      if (!data) return;
      setTeams(data.filter((t) => t.is_current));
      const seasons = Array.from(new Set(data.filter((t) => !t.is_current).map((t) => t.season))).sort().reverse();
      setArchiveSeasons(seasons);
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (plantelRef.current?.contains(target) || clubeRef.current?.contains(target)) return;
      setOpenMenu(null);
      setArchiveOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (menu: string) => { setOpenMenu(openMenu === menu ? null : menu); setArchiveOpen(false); };
  const close = () => { setOpenMenu(null); setArchiveOpen(false); };

  const linkCls = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return `px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`;
  };

  const dropCls = (menu: string, path: string) => {
    const isActive = pathname.startsWith(path) || openMenu === menu;
    return `flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`;
  };

  const dropItem = (active: boolean) =>
    `block px-4 py-2.5 text-[13px] font-semibold transition-all ${active ? "text-white bg-oliv-navy/20 border-l-2 border-oliv-red pl-3.5" : "text-gray-300 hover:text-white hover:bg-white/5"}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-oliv-border" style={{ background: "rgba(20,20,22,0.97)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

        {/* Brand — logo maior */}
        <Link href="/" onClick={close} className="flex items-center gap-3 group">
          <div className="relative" style={{ width: 56, height: 56 }}>
            <Image
              src="/logo.png"
              alt="U.D. Oliveirense"
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-[3px] leading-tight text-white">OLIVEIRENSE</div>
            <div className="text-[9px] font-bold tracking-[3px]" style={{ color: "#C8102E" }}>BASQUETEBOL</div>
          </div>
        </Link>
          <div>
            <div className="text-[16px] font-extrabold tracking-[3px] leading-tight text-white">OLIVEIRENSE</div>
            <div className="text-[9px] font-bold tracking-[3px] text-oliv-red">BASQUETEBOL</div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          <Link href="/" onClick={close} className={linkCls("/", true)}>Início</Link>

          {/* CLUBE */}
          <div ref={clubeRef} className="relative">
            <button onClick={() => toggle("clube")} className={dropCls("clube", "/clube")}>
              Clube <ChevronDown size={13} className={`transition-transform duration-200 ${openMenu === "clube" ? "rotate-180" : ""}`} />
            </button>
            {openMenu === "clube" && (
              <div className="absolute top-full left-0 mt-2 border border-oliv-border rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px]" style={{ background: "#1C1C20" }}>
                <Link href="/clube" onClick={close} className={dropItem(pathname === "/clube")}>O Clube</Link>
                <Link href="/clube/palmares" onClick={close} className={dropItem(pathname.startsWith("/clube/palmares"))}>🏆 Palmarés</Link>
              </div>
            )}
          </div>

          {/* PLANTEL */}
          <div ref={plantelRef} className="relative">
            <button onClick={() => toggle("plantel")} className={dropCls("plantel", "/plantel")}>
              Plantel <ChevronDown size={13} className={`transition-transform duration-200 ${openMenu === "plantel" ? "rotate-180" : ""}`} />
            </button>
            {openMenu === "plantel" && (
              <div className="absolute top-full left-0 mt-2 border border-oliv-border rounded-xl shadow-2xl overflow-hidden z-50 min-w-[210px]" style={{ background: "#1C1C20" }}>
                <div className="px-4 pt-3 pb-1.5">
                  <span className="text-[10px] font-bold text-oliv-red uppercase tracking-[2px]">Época 2025/26</span>
                </div>
                {teams.length === 0 && <p className="px-4 py-3 text-gray-500 text-[12px]">A configurar no admin...</p>}
                {teams.map((t) => (
                  <Link key={t.id} href={`/plantel/${t.slug}`} onClick={close} className={dropItem(pathname === `/plantel/${t.slug}`)}>
                    {t.name}
                  </Link>
                ))}
                {archiveSeasons.length > 0 && (
                  <>
                    <div className="border-t border-oliv-border mt-1 mb-0.5" />
                    <button onClick={() => setArchiveOpen(!archiveOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                      <span>Arquivo</span>
                      <ChevronDown size={12} className={`transition-transform ${archiveOpen ? "rotate-180" : ""}`} />
                    </button>
                    {archiveOpen && archiveSeasons.map((s) => (
                      <Link key={s} href={`/plantel/arquivo/${encodeURIComponent(s)}`} onClick={close}
                        className="block px-6 py-2 text-[12px] text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        {s}
                      </Link>
                    ))}
                    <div className="pb-1" />
                  </>
                )}
              </div>
            )}
          </div>

          <Link href="/calendario" onClick={close} className={linkCls("/calendario")}>Calendário</Link>
          <Link href="/noticias" onClick={close} className={linkCls("/noticias")}>Notícias</Link>

          <Link href="/admin" className="ml-3 p-2 rounded-lg border border-oliv-border text-gray-500 hover:text-white hover:border-oliv-navy transition-all">
            <Lock size={15} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

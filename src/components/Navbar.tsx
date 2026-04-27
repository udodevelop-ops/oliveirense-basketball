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
      const seasons = [...new Set(data.filter((t) => !t.is_current).map((t) => t.season))].sort().reverse();
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

  const toggle = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setArchiveOpen(false);
  };

  const close = () => { setOpenMenu(null); setArchiveOpen(false); };

  const linkCls = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return `px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${isActive ? "bg-oliv-navy/20 text-white" : "text-gray-500 hover:text-white"}`;
  };

  const dropCls = (menu: string, path: string) => {
    const isActive = pathname.startsWith(path) || openMenu === menu;
    return `flex items-center gap-1 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${isActive ? "bg-oliv-navy/20 text-white" : "text-gray-500 hover:text-white"}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-oliv-dark/95 backdrop-blur-xl border-b border-oliv-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" onClick={close} className="flex items-center gap-3">
          <Image src="/logo.png" alt="UDO" width={44} height={44} className="rounded-full border-2 border-oliv-navy object-cover" />
          <div>
            <div className="text-[15px] font-extrabold tracking-[3px] leading-tight">OLIVEIRENSE</div>
            <div className="text-[9px] font-bold tracking-[3px] text-oliv-red">BASQUETEBOL</div>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/" onClick={close} className={linkCls("/", true)}>Início</Link>

          {/* CLUBE dropdown */}
          <div ref={clubeRef} className="relative">
            <button onClick={() => toggle("clube")} className={dropCls("clube", "/clube")}>
              Clube <ChevronDown size={13} className={`transition-transform duration-200 ${openMenu === "clube" ? "rotate-180" : ""}`} />
            </button>
            {openMenu === "clube" && (
              <div className="absolute top-full left-0 mt-2 bg-[#0D0D18] border border-oliv-border rounded-xl shadow-2xl overflow-hidden z-50 min-w-[200px]">
                <Link href="/clube" onClick={close}
                  className={`block px-4 py-2.5 text-[13px] font-semibold hover:bg-oliv-navy/15 hover:text-white transition-all ${pathname === "/clube" ? "text-white bg-oliv-navy/10 border-l-2 border-oliv-red" : "text-gray-300"}`}>
                  O Clube
                </Link>
                <Link href="/clube/palmares" onClick={close}
                  className={`block px-4 py-2.5 text-[13px] font-semibold hover:bg-oliv-navy/15 hover:text-white transition-all ${pathname.startsWith("/clube/palmares") ? "text-white bg-oliv-navy/10 border-l-2 border-oliv-red" : "text-gray-300"}`}>
                  🏆 Palmarés
                </Link>
              </div>
            )}
          </div>

          {/* PLANTEL dropdown */}
          <div ref={plantelRef} className="relative">
            <button onClick={() => toggle("plantel")} className={dropCls("plantel", "/plantel")}>
              Plantel <ChevronDown size={13} className={`transition-transform duration-200 ${openMenu === "plantel" ? "rotate-180" : ""}`} />
            </button>
            {openMenu === "plantel" && (
              <div className="absolute top-full left-0 mt-2 bg-[#0D0D18] border border-oliv-border rounded-xl shadow-2xl overflow-hidden z-50 min-w-[210px]">
                <div className="px-4 pt-3 pb-1.5">
                  <span className="text-[10px] font-bold text-oliv-red uppercase tracking-[2px]">Época 2025/26</span>
                </div>
                {teams.length === 0 && <p className="px-4 py-3 text-gray-600 text-[12px]">A configurar no admin...</p>}
                {teams.map((t) => (
                  <Link key={t.id} href={`/plantel/${t.slug}`} onClick={close}
                    className={`block px-4 py-2.5 text-[13px] font-semibold hover:bg-oliv-navy/15 hover:text-white transition-all ${pathname === `/plantel/${t.slug}` ? "text-white bg-oliv-navy/10 border-l-2 border-oliv-red" : "text-gray-300"}`}>
                    {t.name}
                  </Link>
                ))}
                {archiveSeasons.length > 0 && (
                  <>
                    <div className="border-t border-oliv-border mt-1 mb-0.5" />
                    <button onClick={() => setArchiveOpen(!archiveOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-white hover:bg-oliv-navy/10 transition-all">
                      <span>Arquivo</span>
                      <ChevronDown size={12} className={`transition-transform ${archiveOpen ? "rotate-180" : ""}`} />
                    </button>
                    {archiveOpen && archiveSeasons.map((s) => (
                      <Link key={s} href={`/plantel/arquivo/${encodeURIComponent(s)}`} onClick={close}
                        className="block px-6 py-2 text-[12px] text-gray-400 hover:text-white hover:bg-oliv-navy/10 transition-all">
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

          <Link href="/admin" className="ml-2 p-2 rounded-lg border border-oliv-border text-gray-500 hover:text-white hover:border-oliv-navy transition-all">
            <Lock size={15} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

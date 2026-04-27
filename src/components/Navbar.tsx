"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Lock, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Team } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const [teams, setTeams] = useState<Team[]>([]);
  const [archiveSeasons, setArchiveSeasons] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  const navLink = (path: string, label: string, exact = false) => (
    <Link href={path} onClick={close}
      className={`relative px-1 py-1 text-[13px] font-semibold tracking-wide transition-colors ${isActive(path, exact) ? "text-oliv-red" : "text-oliv-text hover:text-oliv-red"}`}>
      {label}
      {isActive(path, exact) && (
        <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-oliv-red" />
      )}
    </Link>
  );

  const dropItem = (path: string, label: string) => (
    <Link href={path} onClick={close}
      className={`block px-4 py-2.5 text-[13px] font-semibold transition-all hover:bg-oliv-surface-low hover:text-oliv-red ${isActive(path) ? "text-oliv-red border-l-2 border-oliv-red pl-3.5 bg-oliv-surface-low" : "text-oliv-text"}`}>
      {label}
    </Link>
  );

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "#ffffff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderColor: "#e7e8e9",
        boxShadow: scrolled ? "0 2px 20px rgba(53,87,188,0.08)" : "none"
      }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Brand */}
        <Link href="/" onClick={close} className="flex items-center gap-2.5 flex-shrink-0">
          <Image src="/logo.png" alt="UDO" width={44} height={44} className="object-contain" />
          <div className="font-display font-extrabold leading-tight text-oliv-text" style={{ fontSize: 15, letterSpacing: "-0.02em" }}>
            OLIVEIRENSE<br />
            <span className="text-oliv-red" style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 700 }}>BASQUETEBOL</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 border-b border-transparent pb-5 pt-5">
          {navLink("/", "HOME", true)}

          {/* CLUBE */}
          <div ref={clubeRef} className="relative">
            <button onClick={() => toggle("clube")}
              className={`flex items-center gap-1 text-[13px] font-semibold tracking-wide transition-colors ${isActive("/clube") || openMenu === "clube" ? "text-oliv-red" : "text-oliv-text hover:text-oliv-red"}`}>
              CLUBE <ChevronDown size={12} className={`transition-transform ${openMenu === "clube" ? "rotate-180" : ""}`} />
            </button>
            {openMenu === "clube" && (
              <div className="absolute top-full left-0 mt-3 bg-white border border-oliv-surface-high rounded-lg shadow-[0_4px_24px_rgba(53,87,188,0.12)] overflow-hidden z-50 min-w-[180px]">
                {dropItem("/clube", "O Clube")}
                {dropItem("/clube/palmares", "Palmares")}
              </div>
            )}
          </div>

          {/* PLANTEL */}
          <div ref={plantelRef} className="relative">
            <button onClick={() => toggle("plantel")}
              className={`flex items-center gap-1 text-[13px] font-semibold tracking-wide transition-colors ${isActive("/plantel") || openMenu === "plantel" ? "text-oliv-red" : "text-oliv-text hover:text-oliv-red"}`}>
              PLANTEL <ChevronDown size={12} className={`transition-transform ${openMenu === "plantel" ? "rotate-180" : ""}`} />
            </button>
            {openMenu === "plantel" && (
              <div className="absolute top-full left-0 mt-3 bg-white border border-oliv-surface-high rounded-lg shadow-[0_4px_24px_rgba(53,87,188,0.12)] overflow-hidden z-50 min-w-[200px]">
                <div className="px-4 py-2 border-b border-oliv-surface-high">
                  <span className="text-[10px] font-bold text-oliv-navy uppercase tracking-[2px]">Epoca 2025/26</span>
                </div>
                {teams.length === 0 && <p className="px-4 py-3 text-gray-400 text-[12px]">A configurar...</p>}
                {teams.map((t) => (
                  <Link key={t.id} href={`/plantel/${t.slug}`} onClick={close}
                    className={`block px-4 py-2.5 text-[13px] font-semibold transition-all hover:bg-oliv-surface-low hover:text-oliv-red ${pathname === `/plantel/${t.slug}` ? "text-oliv-red border-l-2 border-oliv-red pl-3.5 bg-oliv-surface-low" : "text-oliv-text"}`}>
                    {t.name}
                  </Link>
                ))}
                {archiveSeasons.length > 0 && (
                  <>
                    <div className="border-t border-oliv-surface-high" />
                    <button onClick={() => setArchiveOpen(!archiveOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-oliv-red hover:bg-oliv-surface-low transition-all">
                      Arquivo <ChevronDown size={12} className={`transition-transform ${archiveOpen ? "rotate-180" : ""}`} />
                    </button>
                    {archiveOpen && archiveSeasons.map((s) => (
                      <Link key={s} href={`/plantel/arquivo/${encodeURIComponent(s)}`} onClick={close}
                        className="block px-6 py-2 text-[12px] text-gray-500 hover:text-oliv-red hover:bg-oliv-surface-low transition-all">
                        {s}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {navLink("/calendario", "CALENDARIO")}
          {navLink("/noticias", "NOTICIAS")}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/admin"
            className="p-2 rounded text-gray-400 hover:text-oliv-navy transition-colors border border-transparent hover:border-oliv-surface-high">
            <Lock size={15} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

type Title = {
  id: string;
  team_name: string;
  competition: string;
  position: string;
  season: string;
};

const POSITIONS = ["1º Lugar", "2º Lugar", "3º Lugar", "Fase Final", "Meias-Finais"];
const TEAMS = ["Sénior", "Sub-18", "Sub-16", "Sub-14", "Sub-12", "Sub-10", "Minibasquete", "Seniores Femininos"];

export default function AdminPalmaresPage() {
  const supabase = createClient();
  const router = useRouter();
  const [titles, setTitles] = useState<Title[]>([]);
  const [editing, setEditing] = useState<Partial<Title> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("palmares").select("*").order("season", { ascending: false }).order("team_name");
    if (data) setTitles(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin"); else fetch();
    });
  }, [supabase, router, fetch]);

  const handleSave = async () => {
    if (!editing?.team_name || !editing?.competition || !editing?.season) return;
    const payload = { team_name: editing.team_name, competition: editing.competition, position: editing.position || "1º Lugar", season: editing.season };
    if (editing.id) await supabase.from("palmares").update(payload).eq("id", editing.id);
    else await supabase.from("palmares").insert(payload);
    setEditing(null); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este título?")) return;
    await supabase.from("palmares").delete().eq("id", id);
    fetch();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/admin"); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-oliv-navy border-t-oliv-red rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-oliv-border">
        <div><h1 className="text-xl font-extrabold tracking-wider">BACKOFFICE</h1><p className="text-gray-500 text-[13px] mt-1">Gestão de conteúdos</p></div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 text-[13px] font-semibold border border-oliv-border px-4 py-2 rounded-lg hover:text-white transition-colors"><LogOut size={14} /> Sair</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[["noticias","Notícias"],["jogadores","Jogadores"],["jogos","Jogos"],["escaloes","Escalões"],["palmares","Palmarés"]].map(([k,l]) => (
          <Link key={k} href={`/admin/${k}`} className={`flex-1 min-w-[80px] border px-4 py-3 rounded-xl text-[12px] font-semibold text-center transition-colors ${k === "palmares" ? "bg-oliv-navy/15 border-oliv-navy text-white" : "bg-oliv-card border-oliv-border text-gray-500 hover:text-white"}`}>{l}</Link>
        ))}
      </div>

      {!editing ? (
        <div>
          <button onClick={() => setEditing({ team_name: "Sub-14", competition: "", position: "1º Lugar", season: "2024/25" })}
            className="w-full bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white py-3 rounded-lg text-sm font-bold mb-5 flex items-center justify-center gap-2 hover:opacity-90">
            <Plus size={16} /> Novo Título
          </button>

          {titles.length === 0 && <p className="text-center text-gray-600 py-10">Ainda não há títulos. Adiciona o primeiro!</p>}

          <div className="overflow-hidden rounded-xl border border-oliv-border">
            {titles.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-oliv-card border-b border-oliv-border">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Época</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Escalão</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Competição</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Posição</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {titles.map((t, i) => (
                    <tr key={t.id} className={`border-b border-oliv-border/50 ${i % 2 === 0 ? "" : "bg-oliv-card/30"}`}>
                      <td className="px-4 py-3 text-gray-400 text-[12px]">{t.season}</td>
                      <td className="px-4 py-3 font-semibold">{t.team_name}</td>
                      <td className="px-4 py-3 text-gray-300">{t.competition}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[12px] font-bold ${t.position === "1º Lugar" ? "text-yellow-400" : t.position === "2º Lugar" ? "text-gray-300" : t.position === "3º Lugar" ? "text-amber-600" : "text-gray-500"}`}>
                          {t.position}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditing(t)} className="p-1.5 rounded-lg border border-oliv-navy text-gray-400 hover:text-white transition-colors"><Pencil size={13} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg border border-oliv-red/30 text-oliv-red hover:bg-oliv-red/10 transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <h3 className="text-lg font-bold">{editing.id ? "Editar Título" : "Novo Título"}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Escalão</label>
              <select className="fi" value={editing.team_name || ""} onChange={e => setEditing({...editing, team_name: e.target.value})}>
                {TEAMS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Época</label>
              <input className="fi" value={editing.season || ""} onChange={e => setEditing({...editing, season: e.target.value})} placeholder="2024/25" />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Competição</label>
            <input className="fi" value={editing.competition || ""} onChange={e => setEditing({...editing, competition: e.target.value})} placeholder="Campeonato Regional, Taça Nacional, ..." />
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Posição / Resultado</label>
            <select className="fi" value={editing.position || "1º Lugar"} onChange={e => setEditing({...editing, position: e.target.value})}>
              {POSITIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90">Guardar</button>
            <button onClick={() => setEditing(null)} className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .fi { width:100%; background:#0a0a12; border:1px solid #1e1e2a; color:#fff; padding:10px 14px; border-radius:8px; font-size:14px; }
        .fi:focus { outline:none; border-color:#1c3a6b; }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Team, TeamPlayer, TeamSchedule } from "@/lib/types";
import { Plus, Pencil, Trash2, ArrowLeft, LogOut, ChevronDown, ChevronUp, Archive } from "lucide-react";
import Link from "next/link";

const POSITIONS = ["Base", "Base/Extremo", "Extremo", "Extremo-Poste", "Poste"];
const STAFF_ROLES = ["Treinador Principal", "Treinador Adjunto", "Preparador Físico", "Team Manager", "Médico", "Fisioterapeuta"];
const DAYS = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

type View = "list" | "team" | "editTeam" | "editPlayer" | "editSchedule";

export default function AdminEscaloesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [schedules, setSchedules] = useState<TeamSchedule[]>([]);
  const [editingTeam, setEditingTeam] = useState<Partial<Team> | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Partial<TeamPlayer> | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Partial<TeamSchedule> | null>(null);

  const fetchTeams = useCallback(async () => {
    const { data } = await supabase.from("teams").select("*").order("is_current", { ascending: false }).order("season", { ascending: false }).order("display_order");
    if (data) setTeams(data);
    setLoading(false);
  }, [supabase]);

  const fetchTeamData = useCallback(async (teamId: string) => {
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("team_players").select("*").eq("team_id", teamId).order("role").order("display_order"),
      supabase.from("team_schedules").select("*").eq("team_id", teamId).order("display_order"),
    ]);
    if (p) setPlayers(p);
    if (s) setSchedules(s);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin"); else fetchTeams();
    });
  }, [supabase, router, fetchTeams]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/admin"); };

  // TEAM CRUD
  const saveTeam = async () => {
    if (!editingTeam?.name) return;
    const slug = editingTeam.slug || editingTeam.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = { name: editingTeam.name, slug, season: editingTeam.season || "2025/26", is_current: editingTeam.is_current ?? true, team_photo_url: editingTeam.team_photo_url || null, description: editingTeam.description || null, display_order: editingTeam.display_order || 0 };
    if (editingTeam.id) await supabase.from("teams").update(payload).eq("id", editingTeam.id);
    else await supabase.from("teams").insert(payload);
    setEditingTeam(null); setView("list"); fetchTeams();
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Apagar este escalão e todos os seus jogadores e horários?")) return;
    await supabase.from("teams").delete().eq("id", id);
    fetchTeams(); setView("list");
  };

  const archiveTeam = async (team: Team) => {
    await supabase.from("teams").update({ is_current: false }).eq("id", team.id);
    fetchTeams();
  };

  // PLAYER CRUD
  const savePlayer = async () => {
    if (!editingPlayer?.name || !selectedTeam) return;
    const payload = { team_id: selectedTeam.id, name: editingPlayer.name, number: editingPlayer.number || null, position: editingPlayer.position || null, role: editingPlayer.role || "player", staff_role: editingPlayer.staff_role || null, photo_url: editingPlayer.photo_url || null, bio: editingPlayer.bio || null, display_order: editingPlayer.display_order || 0 };
    if (editingPlayer.id) await supabase.from("team_players").update(payload).eq("id", editingPlayer.id);
    else await supabase.from("team_players").insert(payload);
    setEditingPlayer(null); setView("team"); fetchTeamData(selectedTeam.id);
  };

  const deletePlayer = async (id: string) => {
    if (!confirm("Remover este membro?")) return;
    await supabase.from("team_players").delete().eq("id", id);
    if (selectedTeam) fetchTeamData(selectedTeam.id);
  };

  // SCHEDULE CRUD
  const saveSchedule = async () => {
    if (!editingSchedule?.day_of_week || !editingSchedule?.start_time || !selectedTeam) return;
    const payload = { team_id: selectedTeam.id, day_of_week: editingSchedule.day_of_week, start_time: editingSchedule.start_time, end_time: editingSchedule.end_time || "", venue: editingSchedule.venue || "", display_order: editingSchedule.display_order || 0 };
    if (editingSchedule.id) await supabase.from("team_schedules").update(payload).eq("id", editingSchedule.id);
    else await supabase.from("team_schedules").insert(payload);
    setEditingSchedule(null); setView("team"); fetchTeamData(selectedTeam.id);
  };

  const deleteSchedule = async (id: string) => {
    await supabase.from("team_schedules").delete().eq("id", id);
    if (selectedTeam) fetchTeamData(selectedTeam.id);
  };

  const openTeam = (team: Team) => {
    setSelectedTeam(team); setView("team"); fetchTeamData(team.id);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-oliv-navy border-t-oliv-red rounded-full animate-spin" /></div>;

  const currentTeams = teams.filter((t) => t.is_current);
  const archivedTeams = teams.filter((t) => !t.is_current);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-oliv-border">
        <div><h1 className="text-xl font-extrabold tracking-wider">BACKOFFICE</h1><p className="text-gray-500 text-[13px] mt-1">Gestão de conteúdos</p></div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 text-[13px] font-semibold border border-oliv-border px-4 py-2 rounded-lg hover:text-white transition-colors"><LogOut size={14} /> Sair</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[["noticias","Notícias"],["jogadores","Jogadores"],["jogos","Jogos"],["escaloes","Escalões"],["palmares","Palmarés"]].map(([k,l]) => (
          <Link key={k} href={`/admin/${k}`} className={`flex-1 min-w-[80px] border px-4 py-3 rounded-xl text-[12px] font-semibold text-center transition-colors ${k === "escaloes" ? "bg-oliv-navy/15 border-oliv-navy text-white" : "bg-oliv-card border-oliv-border text-gray-500 hover:text-white"}`}>{l}</Link>
        ))}
      </div>

      {/* ===== LIST VIEW ===== */}
      {view === "list" && (
        <div>
          <button onClick={() => { setEditingTeam({ name: "", season: "2025/26", is_current: true, display_order: 0 }); setView("editTeam"); }}
            className="w-full bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white py-3 rounded-lg text-sm font-bold mb-6 flex items-center justify-center gap-2 hover:opacity-90">
            <Plus size={16} /> Novo Escalão
          </button>

          {/* Época atual */}
          <div className="mb-2">
            <span className="text-[11px] font-bold text-oliv-red uppercase tracking-[2px]">Época Atual — 2025/26</span>
          </div>
          <div className="space-y-2 mb-6">
            {currentTeams.map((t) => (
              <div key={t.id} className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-xl px-4 py-3.5">
                <div className="flex-1 cursor-pointer" onClick={() => openTeam(t)}>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{t.season} • Época ativa</div>
                </div>
                <button onClick={() => openTeam(t)} className="p-2 rounded-lg border border-oliv-navy text-gray-400 hover:text-white transition-colors" title="Gerir"><Pencil size={14} /></button>
                <button onClick={() => archiveTeam(t)} className="p-2 rounded-lg border border-gray-700 text-gray-500 hover:text-white transition-colors" title="Mover para arquivo"><Archive size={14} /></button>
                <button onClick={() => deleteTeam(t.id)} className="p-2 rounded-lg border border-oliv-red/30 text-oliv-red hover:bg-oliv-red/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
            {currentTeams.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Nenhum escalão ativo. Cria um acima.</p>}
          </div>

          {/* Arquivo */}
          {archivedTeams.length > 0 && (
            <>
              <div className="mb-2 mt-4"><span className="text-[11px] font-bold text-gray-600 uppercase tracking-[2px]">Arquivo</span></div>
              <div className="space-y-2">
                {archivedTeams.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 bg-oliv-card/50 border border-oliv-border/50 rounded-xl px-4 py-3 opacity-70">
                    <div className="flex-1"><div className="font-semibold text-sm text-gray-400">{t.name}</div><div className="text-gray-600 text-xs mt-1">{t.season} • Arquivo</div></div>
                    <button onClick={() => supabase.from("teams").update({ is_current: true }).eq("id", t.id).then(() => fetchTeams())} className="text-xs text-gray-500 border border-gray-700 px-3 py-1.5 rounded-lg hover:text-white transition-colors">Reativar</button>
                    <button onClick={() => deleteTeam(t.id)} className="p-2 rounded-lg border border-oliv-red/20 text-oliv-red/60 hover:bg-oliv-red/10 transition-colors"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ===== TEAM VIEW ===== */}
      {view === "team" && selectedTeam && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setView("list")} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <div>
              <h2 className="text-lg font-bold">{selectedTeam.name}</h2>
              <p className="text-gray-500 text-xs">{selectedTeam.season}</p>
            </div>
            <button onClick={() => { setEditingTeam(selectedTeam); setView("editTeam"); }} className="ml-auto text-xs border border-oliv-navy text-gray-400 px-3 py-1.5 rounded-lg hover:text-white">Editar escalão</button>
          </div>

          {/* HORÁRIOS */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px]">Horários de Treino</span>
              <button onClick={() => { setEditingSchedule({ day_of_week: "Segunda-feira", start_time: "18:30", end_time: "20:00", venue: "", display_order: schedules.length }); setView("editSchedule"); }}
                className="text-xs bg-oliv-navy text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus size={11} /> Adicionar</button>
            </div>
            {schedules.length === 0 && <p className="text-gray-600 text-xs py-2">Sem horários definidos.</p>}
            {schedules.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-lg px-3 py-2.5 mb-1.5">
                <div className="flex-1 text-sm"><span className="font-semibold">{s.day_of_week}</span> <span className="text-gray-500">{s.start_time}–{s.end_time}</span> <span className="text-gray-600 text-xs ml-1">{s.venue}</span></div>
                <button onClick={() => { setEditingSchedule(s); setView("editSchedule"); }} className="p-1.5 text-gray-500 hover:text-white"><Pencil size={12} /></button>
                <button onClick={() => deleteSchedule(s.id)} className="p-1.5 text-oliv-red/60 hover:text-oliv-red"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>

          {/* STAFF */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-oliv-navy uppercase tracking-[2px]">Staff Técnico</span>
              <button onClick={() => { setEditingPlayer({ role: "staff", staff_role: "Treinador Principal", display_order: 0 }); setView("editPlayer"); }}
                className="text-xs bg-oliv-navy text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus size={11} /> Adicionar</button>
            </div>
            {players.filter(p => p.role === "staff").map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-lg px-3 py-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-full bg-oliv-navy/20 flex items-center justify-center text-[10px] font-bold text-oliv-navy overflow-hidden flex-shrink-0">
                  {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" /> : p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 text-sm"><span className="font-semibold">{p.name}</span> <span className="text-gray-500 text-xs ml-1">{p.staff_role}</span></div>
                <button onClick={() => { setEditingPlayer(p); setView("editPlayer"); }} className="p-1.5 text-gray-500 hover:text-white"><Pencil size={12} /></button>
                <button onClick={() => deletePlayer(p.id)} className="p-1.5 text-oliv-red/60 hover:text-oliv-red"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>

          {/* JOGADORES */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-oliv-red uppercase tracking-[2px]">Jogadores ({players.filter(p=>p.role==="player").length})</span>
              <button onClick={() => { setEditingPlayer({ role: "player", position: "Base", display_order: players.filter(p=>p.role==="player").length }); setView("editPlayer"); }}
                className="text-xs bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus size={11} /> Adicionar</button>
            </div>
            {players.filter(p => p.role === "player").map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-lg px-3 py-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-full bg-oliv-red/10 flex items-center justify-center text-[10px] font-bold text-oliv-red overflow-hidden flex-shrink-0">
                  {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" /> : (p.number || p.name[0])}
                </div>
                <div className="flex-1 text-sm"><span className="font-semibold">#{p.number} {p.name}</span> <span className="text-gray-500 text-xs ml-1">{p.position}</span></div>
                <button onClick={() => { setEditingPlayer(p); setView("editPlayer"); }} className="p-1.5 text-gray-500 hover:text-white"><Pencil size={12} /></button>
                <button onClick={() => deletePlayer(p.id)} className="p-1.5 text-oliv-red/60 hover:text-oliv-red"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== EDIT TEAM ===== */}
      {view === "editTeam" && editingTeam && (
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => { setEditingTeam(null); setView(selectedTeam ? "team" : "list"); }} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <h3 className="text-lg font-bold">{editingTeam.id ? "Editar Escalão" : "Novo Escalão"}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FF label="Nome do Escalão"><input className="fi" value={editingTeam.name || ""} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} placeholder="Ex: Sub-14" /></FF>
            <FF label="Época"><input className="fi" value={editingTeam.season || "2025/26"} onChange={e => setEditingTeam({...editingTeam, season: e.target.value})} placeholder="2025/26" /></FF>
          </div>
          <FF label="URL Foto de Equipa">
            <input className="fi" value={editingTeam.team_photo_url || ""} onChange={e => setEditingTeam({...editingTeam, team_photo_url: e.target.value})} placeholder="https://..." />
            <p className="text-[11px] text-gray-600 mt-1">Cola o URL da foto de equipa. Podes usar o Supabase Storage, Google Drive (link direto) ou qualquer URL público.</p>
            {editingTeam.team_photo_url && (
              <div className="mt-3 rounded-xl overflow-hidden border border-oliv-border max-h-48">
                <img src={editingTeam.team_photo_url} alt="Preview" className="w-full object-cover max-h-48"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </FF>
          <FF label="Descrição / Apresentação"><textarea className="fi min-h-[80px] resize-y" value={editingTeam.description || ""} onChange={e => setEditingTeam({...editingTeam, description: e.target.value})} /></FF>
          <FF label="Ordem de apresentação"><input type="number" className="fi" value={editingTeam.display_order || 0} onChange={e => setEditingTeam({...editingTeam, display_order: parseInt(e.target.value)})} /></FF>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer mt-2">
            <input type="checkbox" checked={editingTeam.is_current ?? true} onChange={e => setEditingTeam({...editingTeam, is_current: e.target.checked})} />
            Época atual (desmarca para mover para arquivo)
          </label>
          <div className="flex gap-3 mt-6">
            <button onClick={saveTeam} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90">Guardar</button>
            <button onClick={() => { setEditingTeam(null); setView(selectedTeam ? "team" : "list"); }} className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      {/* ===== EDIT PLAYER / STAFF ===== */}
      {view === "editPlayer" && editingPlayer && (
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => { setEditingPlayer(null); setView("team"); }} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <h3 className="text-lg font-bold">{editingPlayer.id ? "Editar" : "Adicionar"} {editingPlayer.role === "staff" ? "Staff" : "Jogador"}</h3>
          </div>
          <div className="flex gap-4 mb-4">
            {["player","staff"].map(r => (
              <button key={r} onClick={() => setEditingPlayer({...editingPlayer, role: r})}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${editingPlayer.role === r ? "bg-oliv-navy/20 border-oliv-navy text-white" : "border-oliv-border text-gray-500 hover:text-white"}`}>
                {r === "player" ? "Jogador" : "Staff"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><FF label="Nome"><input className="fi" value={editingPlayer.name || ""} onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} /></FF></div>
            {editingPlayer.role === "player" ? (
              <>
                <FF label="Número"><input className="fi" value={editingPlayer.number || ""} onChange={e => setEditingPlayer({...editingPlayer, number: e.target.value})} placeholder="7" /></FF>
                <FF label="Posição"><select className="fi" value={editingPlayer.position || "Base"} onChange={e => setEditingPlayer({...editingPlayer, position: e.target.value})}>{POSITIONS.map(p => <option key={p}>{p}</option>)}</select></FF>
              </>
            ) : (
              <div className="col-span-2"><FF label="Função"><select className="fi" value={editingPlayer.staff_role || ""} onChange={e => setEditingPlayer({...editingPlayer, staff_role: e.target.value})}>{STAFF_ROLES.map(r => <option key={r}>{r}</option>)}</select></FF></div>
            )}
          </div>
          <FF label="URL da Foto">
            <input className="fi" value={editingPlayer.photo_url || ""} onChange={e => setEditingPlayer({...editingPlayer, photo_url: e.target.value})} placeholder="https://..." />
            {editingPlayer.photo_url && (
              <div className="mt-2 w-20 h-20 rounded-full overflow-hidden border border-oliv-border">
                <img src={editingPlayer.photo_url} alt="Preview" className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </FF>
          <FF label="Biografia / Notas"><textarea className="fi min-h-[80px] resize-y" value={editingPlayer.bio || ""} onChange={e => setEditingPlayer({...editingPlayer, bio: e.target.value})} /></FF>
          <div className="flex gap-3 mt-6">
            <button onClick={savePlayer} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90">Guardar</button>
            <button onClick={() => { setEditingPlayer(null); setView("team"); }} className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      {/* ===== EDIT SCHEDULE ===== */}
      {view === "editSchedule" && editingSchedule && (
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => { setEditingSchedule(null); setView("team"); }} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <h3 className="text-lg font-bold">{editingSchedule.id ? "Editar" : "Adicionar"} Horário</h3>
          </div>
          <FF label="Dia da Semana"><select className="fi" value={editingSchedule.day_of_week || ""} onChange={e => setEditingSchedule({...editingSchedule, day_of_week: e.target.value})}>{DAYS.map(d => <option key={d}>{d}</option>)}</select></FF>
          <div className="grid grid-cols-2 gap-3">
            <FF label="Hora Início"><input className="fi" value={editingSchedule.start_time || ""} onChange={e => setEditingSchedule({...editingSchedule, start_time: e.target.value})} placeholder="18:30" /></FF>
            <FF label="Hora Fim"><input className="fi" value={editingSchedule.end_time || ""} onChange={e => setEditingSchedule({...editingSchedule, end_time: e.target.value})} placeholder="20:00" /></FF>
          </div>
          <FF label="Pavilhão / Local"><input className="fi" value={editingSchedule.venue || ""} onChange={e => setEditingSchedule({...editingSchedule, venue: e.target.value})} placeholder="Pav. Municipal O. Azeméis" /></FF>
          <div className="flex gap-3 mt-6">
            <button onClick={saveSchedule} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90">Guardar</button>
            <button onClick={() => { setEditingSchedule(null); setView("team"); }} className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white">Cancelar</button>
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

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

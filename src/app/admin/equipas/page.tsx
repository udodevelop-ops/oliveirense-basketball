"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

type TeamLogo = {
  id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
  primary_color: string | null;
};

const TABS = [
  ["noticias", "Notícias"],
  ["jogadores", "Jogadores"],
  ["jogos", "Jogos"],
  ["escaloes", "Escalões"],
  ["palmares", "Palmarés"],
  ["equipas", "Equipas"],
];

export default function AdminEquipasPage() {
  const supabase = createClient();
  const router = useRouter();
  const [teams, setTeams] = useState<TeamLogo[]>([]);
  const [editing, setEditing] = useState<Partial<TeamLogo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTeams = useCallback(async () => {
    const { data } = await supabase
      .from("team_logos")
      .select("*")
      .order("name");
    if (data) setTeams(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin");
      else fetchTeams();
    });
  }, [supabase, router, fetchTeams]);

  const handleSave = async () => {
    if (!editing?.name) return;
    const payload = {
      name: editing.name.toUpperCase().trim(),
      short_name: editing.short_name || null,
      logo_url: editing.logo_url || null,
      primary_color: editing.primary_color || null,
    };
    if (editing.id) {
      await supabase.from("team_logos").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("team_logos").insert(payload);
    }
    setEditing(null);
    fetchTeams();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar esta equipa?")) return;
    await supabase.from("team_logos").delete().eq("id", id);
    fetchTeams();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.short_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-oliv-navy border-t-oliv-red rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-oliv-border">
        <div>
          <h1 className="text-xl font-extrabold tracking-wider">BACKOFFICE</h1>
          <p className="text-gray-500 text-[13px] mt-1">Gestão de conteúdos</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 text-[13px] font-semibold border border-oliv-border px-4 py-2 rounded-lg hover:text-white transition-colors">
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(([k, l]) => (
          <Link key={k} href={`/admin/${k}`}
            className={`flex-1 min-w-[70px] border px-3 py-3 rounded-xl text-[11px] font-semibold text-center transition-colors ${
              k === "equipas"
                ? "bg-oliv-navy/15 border-oliv-navy text-white"
                : "bg-oliv-card border-oliv-border text-gray-500 hover:text-white"
            }`}>
            {l}
          </Link>
        ))}
      </div>

      {!editing ? (
        <div>
          {/* Info box */}
          <div className="bg-oliv-navy/10 border border-oliv-navy/30 rounded-xl p-4 mb-5">
            <p className="text-[13px] text-gray-300">
              <span className="font-bold text-oliv-navy">Como funciona:</span> Os logos aqui guardados são usados automaticamente ao adicionar jogos ou importar pelo Excel. O nome tem de ser <span className="font-bold text-white">exatamente igual</span> ao nome da equipa usado nos jogos (ex: "FC PORTO").
            </p>
          </div>

          <div className="flex gap-3 mb-5">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar equipa..."
              className="flex-1 bg-oliv-card border border-oliv-border text-white px-4 py-2.5 rounded-lg text-sm focus:border-oliv-navy outline-none"
            />
            <button
              onClick={() => setEditing({ name: "", short_name: "", logo_url: "", primary_color: "#000000" })}
              className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90"
            >
              <Plus size={16} /> Nova Equipa
            </button>
          </div>

          {/* Grid de logos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map(t => (
              <div key={t.id} className="bg-oliv-card border border-oliv-border rounded-xl p-4 flex flex-col items-center gap-3 relative group hover:border-oliv-navy transition-all">
                {/* Logo */}
                <div className="w-16 h-16 rounded-full bg-[#1a1a24] border border-oliv-border flex items-center justify-center overflow-hidden">
                  {t.logo_url ? (
                    <img
                      src={t.logo_url}
                      alt={t.name}
                      className="w-full h-full object-contain p-1.5"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span className="text-[11px] font-extrabold text-gray-500">
                      {t.name.slice(0, 3)}
                    </span>
                  )}
                </div>

                {/* Nome */}
                <div className="text-center">
                  <div className="text-[12px] font-bold text-white leading-tight">{t.name}</div>
                  {t.short_name && <div className="text-[11px] text-gray-500 mt-0.5">{t.short_name}</div>}
                </div>

                {/* Cor */}
                {t.primary_color && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-oliv-border" style={{ background: t.primary_color }} />
                    <span className="text-[10px] text-gray-600 font-mono">{t.primary_color}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing(t)} className="p-1.5 bg-oliv-dark rounded-lg border border-oliv-navy text-gray-400 hover:text-white transition-colors">
                    <Pencil size={11} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 bg-oliv-dark rounded-lg border border-oliv-red/30 text-oliv-red hover:bg-oliv-red/10 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>

                {/* Indicador sem logo */}
                {!t.logo_url && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold bg-oliv-red/20 text-oliv-red px-1.5 py-0.5 rounded-full">
                    Sem logo
                  </span>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-600 py-10">Nenhuma equipa encontrada.</p>
          )}
        </div>
      ) : (
        /* FORM */
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <h3 className="text-lg font-bold">{editing.id ? "Editar Equipa" : "Nova Equipa"}</h3>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-5 bg-[#0A0A12] rounded-xl p-5 mb-6 border border-oliv-border">
            <div className="w-20 h-20 rounded-full bg-[#1a1a24] border-2 border-oliv-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {editing.logo_url ? (
                <img src={editing.logo_url} alt="preview" className="w-full h-full object-contain p-1.5"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <span className="text-sm font-extrabold text-gray-500">
                  {(editing.name || "?").slice(0, 3)}
                </span>
              )}
            </div>
            <div>
              <div className="text-lg font-extrabold">{editing.name || "Nome da equipa"}</div>
              <div className="text-gray-500 text-sm">{editing.short_name || "Nome curto"}</div>
              {editing.primary_color && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full border border-oliv-border" style={{ background: editing.primary_color }} />
                  <span className="text-[11px] text-gray-500 font-mono">{editing.primary_color}</span>
                </div>
              )}
            </div>
          </div>

          <FF label="Nome da equipa (em MAIÚSCULAS — tem de coincidir exactamente com o nome nos jogos)">
            <input className="fi" value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value.toUpperCase() })} placeholder="FC PORTO" />
          </FF>

          <FF label="Nome curto (para mostrar em espaços reduzidos)">
            <input className="fi" value={editing.short_name || ""} onChange={e => setEditing({ ...editing, short_name: e.target.value })} placeholder="Porto" />
          </FF>

          <FF label="URL do Logo">
            <input className="fi" value={editing.logo_url || ""} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} placeholder="https://..." />
            <p className="text-[11px] text-gray-600 mt-1">
              Podes usar o Supabase Storage, Wikipedia ou qualquer URL de imagem pública. O preview atualiza em tempo real acima.
            </p>
          </FF>

          <FF label="Cor principal (hex)">
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={editing.primary_color || "#000000"}
                onChange={e => setEditing({ ...editing, primary_color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-oliv-border bg-oliv-dark cursor-pointer p-1"
              />
              <input className="fi flex-1" value={editing.primary_color || ""} onChange={e => setEditing({ ...editing, primary_color: e.target.value })} placeholder="#003DA5" />
            </div>
          </FF>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90">
              Guardar
            </button>
            <button onClick={() => setEditing(null)} className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white transition-colors">
              Cancelar
            </button>
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
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

type Sponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  active: boolean;
  display_order: number;
};

const TABS = [
  ["noticias", "Noticias"],
  ["jogadores", "Jogadores"],
  ["jogos", "Jogos"],
  ["escaloes", "Escaloes"],
  ["palmares", "Palmares"],
  ["equipas", "Equipas"],
  ["patrocinadores", "Patrocinadores"],
];

const TIERS = [
  { value: "main", label: "Patrocinador Principal" },
  { value: "official", label: "Parceiro Oficial" },
  { value: "standard", label: "Parceiro" },
];

export default function AdminPatrocinadoresPage() {
  const supabase = createClient();
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [editing, setEditing] = useState<Partial<Sponsor> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSponsors = useCallback(async () => {
    const { data } = await supabase
      .from("sponsors").select("*").order("display_order");
    if (data) setSponsors(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin"); else fetchSponsors();
    });
  }, [supabase, router, fetchSponsors]);

  const handleSave = async () => {
    if (!editing?.name) return;
    const payload = {
      name: editing.name,
      logo_url: editing.logo_url || null,
      website_url: editing.website_url || null,
      tier: editing.tier || "standard",
      active: editing.active ?? true,
      display_order: editing.display_order ?? 0,
    };
    if (editing.id) await supabase.from("sponsors").update(payload).eq("id", editing.id);
    else await supabase.from("sponsors").insert(payload);
    setEditing(null); fetchSponsors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este patrocinador?")) return;
    await supabase.from("sponsors").delete().eq("id", id);
    fetchSponsors();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/admin"); };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-oliv-navy border-t-oliv-red rounded-full animate-spin" /></div>;

  const tierLabel = (t: string) => TIERS.find(x => x.value === t)?.label || t;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-oliv-surface-high">
        <div>
          <h1 className="text-xl font-display font-extrabold tracking-wider text-oliv-text">BACKOFFICE</h1>
          <p className="text-gray-400 text-[13px] mt-1">Gestao de conteudos</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 text-[13px] font-semibold border border-oliv-surface-high px-4 py-2 rounded-lg hover:text-oliv-red transition-colors">
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(([k, l]) => (
          <Link key={k} href={`/admin/${k}`}
            className={`flex-1 min-w-[70px] border px-3 py-2.5 rounded-lg text-[11px] font-bold text-center transition-colors ${
              k === "patrocinadores"
                ? "bg-oliv-navy text-white border-oliv-navy"
                : "bg-white border-oliv-surface-high text-gray-500 hover:text-oliv-red"
            }`}>
            {l}
          </Link>
        ))}
      </div>

      {!editing ? (
        <div>
          <button
            onClick={() => setEditing({ name: "", logo_url: "", website_url: "", tier: "standard", active: true, display_order: sponsors.length })}
            className="w-full bg-oliv-red text-white py-3 rounded-lg text-sm font-bold mb-5 flex items-center justify-center gap-2 hover:bg-oliv-red-dark transition-colors">
            <Plus size={16} /> Novo Patrocinador
          </button>

          {/* Info */}
          <div className="bg-oliv-surface-low border border-oliv-surface-high rounded-lg p-4 mb-5 text-[13px] text-gray-500">
            <strong className="text-oliv-navy">Como funciona:</strong> Adiciona o nome, o logotipo (URL da imagem) e o site do patrocinador. O logotipo aparece na homepage em escala de cinzento, a cores quando o utilizador passa o rato por cima.
          </div>

          {/* Grid de patrocinadores */}
          {sponsors.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">Ainda nao ha patrocinadores. Adiciona o primeiro!</p>
          ) : (
            <div className="space-y-2">
              {sponsors.map((s) => (
                <div key={s.id} className="flex items-center gap-4 bg-white border border-oliv-surface-high rounded-xl px-4 py-3.5">
                  {/* Logo preview */}
                  <div className="w-16 h-10 rounded border border-oliv-surface-high bg-oliv-surface-low flex items-center justify-center overflow-hidden flex-shrink-0">
                    {s.logo_url
                      ? <img src={s.logo_url} alt={s.name} className="w-full h-full object-contain p-1" />
                      : <span className="text-[9px] font-bold text-gray-400 text-center px-1">{s.name.slice(0, 10)}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-oliv-text">{s.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5 flex gap-2">
                      <span>{tierLabel(s.tier)}</span>
                      {s.website_url && <span className="text-oliv-navy truncate">{s.website_url}</span>}
                      {!s.active && <span className="text-oliv-red">Inativo</span>}
                    </div>
                  </div>
                  <button onClick={() => setEditing(s)} className="p-2 rounded-lg border border-oliv-surface-high text-gray-400 hover:text-oliv-navy hover:border-oliv-navy transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg border border-red-100 text-oliv-red hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-oliv-surface-high rounded-xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-oliv-navy"><ArrowLeft size={18} /></button>
            <h3 className="text-lg font-display font-bold text-oliv-text">{editing.id ? "Editar Patrocinador" : "Novo Patrocinador"}</h3>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-4 bg-oliv-surface-low rounded-xl p-4 mb-6 border border-oliv-surface-high">
            <div className="w-24 h-16 rounded border border-oliv-surface-high bg-white flex items-center justify-center overflow-hidden">
              {editing.logo_url
                ? <img src={editing.logo_url} alt="preview" className="w-full h-full object-contain p-1" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : <span className="text-[10px] font-bold text-gray-300">SEM LOGO</span>
              }
            </div>
            <div>
              <div className="font-bold text-oliv-text">{editing.name || "Nome do patrocinador"}</div>
              <div className="text-[12px] text-gray-400 mt-0.5">{tierLabel(editing.tier || "standard")}</div>
              {editing.website_url && <div className="text-[11px] text-oliv-navy mt-0.5">{editing.website_url}</div>}
            </div>
          </div>

          <FF label="Nome"><input className="fi" value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Ex: MultiOpticas" /></FF>

          <FF label="Nivel de parceria">
            <div className="flex gap-2">
              {TIERS.map(t => (
                <button key={t.value} onClick={() => setEditing({ ...editing, tier: t.value })}
                  className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-colors ${editing.tier === t.value ? "bg-oliv-navy text-white border-oliv-navy" : "bg-white text-gray-500 border-oliv-surface-high hover:border-oliv-navy"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </FF>

          <FF label="URL do Logotipo">
            <input className="fi" value={editing.logo_url || ""} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} placeholder="https://..." />
            <p className="text-[11px] text-gray-400 mt-1">Cola o URL da imagem do logotipo (PNG ou SVG com fundo transparente ideal)</p>
          </FF>

          <FF label="Website do patrocinador">
            <input className="fi" value={editing.website_url || ""} onChange={e => setEditing({ ...editing, website_url: e.target.value })} placeholder="https://www.patrocinador.pt" />
          </FF>

          <FF label="Ordem de apresentacao">
            <input type="number" className="fi" value={editing.display_order ?? 0} onChange={e => setEditing({ ...editing, display_order: parseInt(e.target.value) })} />
          </FF>

          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer mt-2">
            <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing({ ...editing, active: e.target.checked })} />
            Patrocinador ativo (aparece no site)
          </label>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="bg-oliv-red text-white px-7 py-3 rounded-lg text-sm font-bold hover:bg-oliv-red-dark transition-colors">Guardar</button>
            <button onClick={() => setEditing(null)} className="text-gray-500 border border-oliv-surface-high px-7 py-3 rounded-lg text-sm font-semibold hover:text-oliv-red transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .fi { width:100%; background:#f8f9fa; border:1px solid #e7e8e9; color:#191c1d; padding:10px 14px; border-radius:8px; font-size:14px; }
        .fi:focus { outline:none; border-color:#3557bc; }
      `}</style>
    </div>
  );
}

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

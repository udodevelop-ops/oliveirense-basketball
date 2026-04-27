"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Player } from "@/lib/types";
import { Pencil, Trash2, Plus, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminJogadoresPage() {
  const supabase = createClient();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [editing, setEditing] = useState<Partial<Player> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    const { data } = await supabase
      .from("players")
      .select("*")
      .order("display_order")
      .order("name");
    if (data) setPlayers(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin");
      else fetchPlayers();
    });
  }, [supabase, router, fetchPlayers]);

  const handleSave = async () => {
    if (!editing || !editing.name || !editing.number) return;

    const payload = {
      name: editing.name,
      number: editing.number,
      position: editing.position || "Base",
      height: editing.height || null,
      age: editing.age || null,
      bio: editing.bio || null,
      photo_url: editing.photo_url || null,
      ppg: Number(editing.ppg) || 0,
      apg: Number(editing.apg) || 0,
      rpg: Number(editing.rpg) || 0,
      active: editing.active ?? true,
      display_order: Number(editing.display_order) || 0,
    };

    if (editing.id) {
      await supabase.from("players").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("players").insert(payload);
    }

    setEditing(null);
    fetchPlayers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tens a certeza que queres remover este jogador?")) return;
    await supabase.from("players").delete().eq("id", id);
    fetchPlayers();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const newItem = () =>
    setEditing({
      name: "",
      number: "",
      position: "Base",
      height: "",
      age: "",
      bio: "",
      photo_url: "",
      ppg: 0,
      apg: 0,
      rpg: 0,
      active: true,
      display_order: 0,
    });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-oliv-navy border-t-oliv-red rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-oliv-border">
        <div>
          <h1 className="text-xl font-extrabold tracking-wider">BACKOFFICE</h1>
          <p className="text-gray-500 text-[13px] mt-1">Gestão de conteúdos</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 text-[13px] font-semibold border border-oliv-border px-4 py-2 rounded-lg hover:text-white transition-colors"
        >
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/noticias" className="flex-1 min-w-[80px] bg-oliv-card border border-oliv-border text-gray-500 px-4 py-3 rounded-xl text-[12px] font-semibold text-center hover:text-white transition-colors">Notícias</Link>
        <div className="flex-1 min-w-[80px] bg-oliv-navy/15 border border-oliv-navy text-white px-4 py-3 rounded-xl text-[12px] font-semibold text-center">Jogadores</div>
        <Link href="/admin/jogos" className="flex-1 min-w-[80px] bg-oliv-card border border-oliv-border text-gray-500 px-4 py-3 rounded-xl text-[12px] font-semibold text-center hover:text-white transition-colors">Jogos</Link>
        <Link href="/admin/escaloes" className="flex-1 min-w-[80px] bg-oliv-card border border-oliv-border text-gray-500 px-4 py-3 rounded-xl text-[12px] font-semibold text-center hover:text-white transition-colors">Escalões</Link>
        <Link href="/admin/palmares" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Palmarés</Link>
        <Link href="/admin/equipas" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Equipas</Link>
      </div>

      {/* List or Form */}
      {!editing ? (
        <div>
          <button
            onClick={newItem}
            className="w-full bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white py-3 rounded-lg text-sm font-bold mb-5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Novo Jogador
          </button>

          <div className="space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-xl px-4 py-3.5"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">
                    #{p.number} {p.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {p.position} • {p.height}
                    {!p.active ? " • 🔒 Inativo" : ""}
                  </div>
                </div>
                <button
                  onClick={() => setEditing(p)}
                  className="p-2 rounded-lg border border-oliv-navy text-gray-400 hover:text-white transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg border border-oliv-red/30 text-oliv-red hover:bg-oliv-red/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setEditing(null)}
              className="text-oliv-navy"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 className="text-lg font-bold">
              {editing.id ? "Editar Jogador" : "Novo Jogador"}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <FormField label="Nome">
                <input
                  className="form-input"
                  value={editing.name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </FormField>
            </div>
            <FormField label="Número">
              <input
                className="form-input"
                value={editing.number || ""}
                onChange={(e) =>
                  setEditing({ ...editing, number: e.target.value })
                }
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Posição">
              <select
                className="form-input"
                value={editing.position || "Base"}
                onChange={(e) =>
                  setEditing({ ...editing, position: e.target.value })
                }
              >
                {[
                  "Base",
                  "Base/Extremo",
                  "Extremo",
                  "Extremo-Poste",
                  "Poste",
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Altura">
              <input
                className="form-input"
                value={editing.height || ""}
                onChange={(e) =>
                  setEditing({ ...editing, height: e.target.value })
                }
                placeholder="1.85m"
              />
            </FormField>
            <FormField label="Idade">
              <input
                className="form-input"
                value={editing.age || ""}
                onChange={(e) =>
                  setEditing({ ...editing, age: e.target.value })
                }
              />
            </FormField>
          </div>

          <FormField label="Biografia">
            <textarea
              className="form-input min-h-[100px] resize-y"
              value={editing.bio || ""}
              onChange={(e) =>
                setEditing({ ...editing, bio: e.target.value })
              }
            />
          </FormField>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="PTS/Jogo">
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={editing.ppg || 0}
                onChange={(e) =>
                  setEditing({ ...editing, ppg: parseFloat(e.target.value) })
                }
              />
            </FormField>
            <FormField label="AST/Jogo">
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={editing.apg || 0}
                onChange={(e) =>
                  setEditing({ ...editing, apg: parseFloat(e.target.value) })
                }
              />
            </FormField>
            <FormField label="REB/Jogo">
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={editing.rpg || 0}
                onChange={(e) =>
                  setEditing({ ...editing, rpg: parseFloat(e.target.value) })
                }
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={editing.active ?? true}
              onChange={(e) =>
                setEditing({ ...editing, active: e.target.checked })
              }
            />
            Jogador ativo
          </label>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditing(null)}
              className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-input {
          width: 100%;
          background: #0a0a12;
          border: 1px solid #1e1e2a;
          color: #fff;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #1c3a6b;
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { News } from "@/lib/types";
import { Pencil, Trash2, Plus, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminNoticiasPage() {
  const supabase = createClient();
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [editing, setEditing] = useState<Partial<News> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });
    if (data) setNews(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // Verificar autenticação
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin");
      else fetchNews();
    });
  }, [supabase, router, fetchNews]);

  const handleSave = async () => {
    if (!editing || !editing.title) return;

    if (editing.id) {
      await supabase
        .from("news")
        .update({
          title: editing.title,
          subtitle: editing.subtitle,
          content: editing.content,
          category: editing.category,
          date: editing.date,
          image_url: editing.image_url,
          featured: editing.featured,
          published: editing.published,
        })
        .eq("id", editing.id);
    } else {
      await supabase.from("news").insert({
        title: editing.title,
        subtitle: editing.subtitle || null,
        content: editing.content || null,
        category: editing.category || "Clube",
        date: editing.date || new Date().toISOString().split("T")[0],
        image_url: editing.image_url || null,
        featured: editing.featured || false,
        published: editing.published ?? true,
      });
    }

    setEditing(null);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tens a certeza que queres apagar esta notícia?")) return;
    await supabase.from("news").delete().eq("id", id);
    fetchNews();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const newItem = () =>
    setEditing({
      title: "",
      subtitle: "",
      content: "",
      category: "Clube",
      date: new Date().toISOString().split("T")[0],
      image_url: "",
      featured: false,
      published: true,
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
        <div className="flex-1 min-w-[80px] bg-oliv-navy/15 border border-oliv-navy text-white px-4 py-3 rounded-xl text-[12px] font-semibold text-center">Notícias</div>
        <Link href="/admin/jogadores" className="flex-1 min-w-[80px] bg-oliv-card border border-oliv-border text-gray-500 px-4 py-3 rounded-xl text-[12px] font-semibold text-center hover:text-white transition-colors">Jogadores</Link>
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
            <Plus size={16} /> Nova Notícia
          </button>

          <div className="space-y-2">
            {news.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-xl px-4 py-3.5"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {n.title}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {n.category} • {n.date}
                    {n.featured ? " • ⭐" : ""}
                    {!n.published ? " • 🔒 Rascunho" : ""}
                  </div>
                </div>
                <button
                  onClick={() => setEditing(n)}
                  className="p-2 rounded-lg border border-oliv-navy text-gray-400 hover:text-white transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
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
              {editing.id ? "Editar Notícia" : "Nova Notícia"}
            </h3>
          </div>

          <FormField label="Título">
            <input
              className="form-input"
              value={editing.title || ""}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
          </FormField>

          <FormField label="Subtítulo">
            <input
              className="form-input"
              value={editing.subtitle || ""}
              onChange={(e) =>
                setEditing({ ...editing, subtitle: e.target.value })
              }
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Data">
              <input
                type="date"
                className="form-input"
                value={editing.date || ""}
                onChange={(e) =>
                  setEditing({ ...editing, date: e.target.value })
                }
              />
            </FormField>
            <FormField label="Categoria">
              <select
                className="form-input"
                value={editing.category || "Clube"}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                {["Clube", "Jogo", "Formação", "Evento", "Comunicado"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  )
                )}
              </select>
            </FormField>
          </div>

          <FormField label="Conteúdo">
            <textarea
              className="form-input min-h-[120px] resize-y"
              value={editing.content || ""}
              onChange={(e) =>
                setEditing({ ...editing, content: e.target.value })
              }
            />
          </FormField>

          <FormField label="URL da Imagem">
            <input
              className="form-input"
              value={editing.image_url || ""}
              onChange={(e) =>
                setEditing({ ...editing, image_url: e.target.value })
              }
              placeholder="https://..."
            />
          </FormField>

          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured || false}
                onChange={(e) =>
                  setEditing({ ...editing, featured: e.target.checked })
                }
              />
              Destaque
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published ?? true}
                onChange={(e) =>
                  setEditing({ ...editing, published: e.target.checked })
                }
              />
              Publicada
            </label>
          </div>

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

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Game } from "@/lib/types";
import {
  Pencil, Trash2, Plus, ArrowLeft, LogOut,
  Upload, FileSpreadsheet, X, Check, AlertCircle, Download,
} from "lucide-react";
import Link from "next/link";

/* ── helpers ─────────────────────────────────────────────── */

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    const months = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
    return `${String(d.getDate()).padStart(2,"0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch { return dateStr; }
}

function formatTimeLabel(dateStr: string, time: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    const days = ["DOM","SEG","TER","QUA","QUI","SEX","SÁB"];
    return `${days[d.getDay()]} ${time || "15:00"}H`;
  } catch { return time || "15:00H"; }
}

function parseExcelDate(val: any): string {
  if (!val) return "";
  if (typeof val === "number") {
    const d = new Date((val - 25569) * 86400 * 1000);
    return d.toISOString().split("T")[0];
  }
  const s = String(val).trim();
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s;
}

const COL_MAP: Record<string,string> = {
  data:"date", date:"date", dia:"date",
  hora:"time", time:"time",
  casa:"home_team", home:"home_team", "equipa casa":"home_team",
  fora:"away_team", away:"away_team", "equipa fora":"away_team", visitante:"away_team",
  local:"venue", venue:"venue", "pavilhão":"venue",
  "competição":"competition", competition:"competition", liga:"competition",
  jornada:"round", round:"round", fase:"round",
  resultado:"result", result:"result",
  "logo casa":"home_logo_url", "logo home":"home_logo_url",
  "logo fora":"away_logo_url", "logo away":"away_logo_url",
};

function mapColumns(headers: string[]) {
  const map: Record<number,string> = {};
  headers.forEach((h,i) => {
    const key = h.toLowerCase().trim();
    if (COL_MAP[key]) map[i] = COL_MAP[key];
  });
  return map;
}

type ImportRow = {
  date: string; time: string; home_team: string; away_team: string;
  venue: string; competition: string; round: string; result: string;
  home_logo_url: string; away_logo_url: string;
  valid: boolean; error?: string;
};

async function loadSheetJS(): Promise<any> {
  if ((window as any).XLSX) return (window as any).XLSX;
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = () => res((window as any).XLSX);
    s.onerror = () => rej(null);
    document.head.appendChild(s);
  });
}

/* ── component ───────────────────────────────────────────── */

export default function AdminJogosPage() {
  const supabase = createClient();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [editing, setEditing] = useState<Partial<Game> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ok:number;fail:number}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchGames = useCallback(async () => {
    const { data } = await supabase.from("games").select("*").order("date", { ascending: false });
    if (data) setGames(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/admin"); else fetchGames();
    });
  }, [supabase, router, fetchGames]);

  /* ── Excel import ── */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const XLSX = await loadSheetJS();
    if (!XLSX) { alert("Erro ao carregar biblioteca Excel."); return; }
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (rows.length < 2) { alert("Ficheiro vazio."); return; }
    const colMap = mapColumns(rows[0].map((h: any) => String(h)));
    const mapped: ImportRow[] = rows.slice(1)
      .filter((r: any[]) => r.some((c: any) => c !== ""))
      .map((row: any[]) => {
        const obj: any = { date:"", time:"15:00", home_team:"", away_team:"", venue:"", competition:"LIGA MASC. BASQUETEBOL", round:"", result:"", home_logo_url:"", away_logo_url:"" };
        Object.entries(colMap).forEach(([idx, field]) => {
          const val = row[Number(idx)];
          if (field === "date") obj.date = parseExcelDate(val);
          else if (val !== undefined && val !== null) obj[field] = String(val).trim();
        });
        if (obj.result?.match(/^\d+[\-:]\d+$/)) obj.status = "finished";
        let valid = true, error = "";
        if (!obj.date || !/^\d{4}-\d{2}-\d{2}$/.test(obj.date)) { valid = false; error = "Data inválida"; }
        if (!obj.home_team) { valid = false; error = "Falta equipa casa"; }
        if (!obj.away_team) { valid = false; error = "Falta equipa fora"; }
        return { ...obj, valid, error } as ImportRow;
      });
    setImportData(mapped); setShowImport(true); setImportResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const executeImport = async () => {
    const validRows = importData.filter(r => r.valid);
    if (!validRows.length) return;
    setImporting(true);
    let ok = 0, fail = 0;
    for (const row of validRows) {
      const hs = row.result ? parseInt(row.result.split(/[\-:]/)[0]) : null;
      const as_ = row.result ? parseInt(row.result.split(/[\-:]/)[1]) : null;
      const { error } = await supabase.from("games").insert({
        date: row.date, date_label: formatDateLabel(row.date),
        time_label: formatTimeLabel(row.date, row.time), time: row.time || "15:00",
        home_team: row.home_team.toUpperCase(), away_team: row.away_team.toUpperCase(),
        home_logo_url: row.home_logo_url || null, away_logo_url: row.away_logo_url || null,
        venue: row.venue || null, competition: row.competition || "LIGA MASC. BASQUETEBOL",
        round: row.round || null, result: row.result || null,
        status: row.result ? "finished" : "scheduled", home_score: hs, away_score: as_,
      });
      error ? fail++ : ok++;
    }
    setImporting(false); setImportResult({ ok, fail });
    if (ok > 0) fetchGames();
  };

  const downloadTemplate = () => {
    const csv = "Data,Hora,Equipa Casa,Equipa Fora,Local,Competição,Jornada,Resultado,Logo Casa,Logo Fora\n2026-05-30,15:00,OLIVEIRENSE,FC PORTO,PAV. MUNICIPAL O. AZEMÉIS,LIGA MASC. BASQUETEBOL,JORNADA 27,,\n";
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "jogos_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── CRUD ── */
  const handleSave = async () => {
    if (!editing?.home_team || !editing?.away_team) return;
    const dateStr = editing.date || new Date().toISOString().split("T")[0];
    const timeStr = editing.time || "15:00";
    const hs = editing.home_score ?? null, as_ = editing.away_score ?? null;
    const payload = {
      date: dateStr, date_label: formatDateLabel(dateStr),
      time_label: formatTimeLabel(dateStr, timeStr), time: timeStr,
      home_team: editing.home_team, away_team: editing.away_team,
      home_logo_url: editing.home_logo_url || null, away_logo_url: editing.away_logo_url || null,
      home_score: hs, away_score: as_,
      venue: editing.venue || null, competition: editing.competition || "LIGA MASC. BASQUETEBOL",
      round: editing.round || null,
      result: hs !== null && as_ !== null ? `${hs}-${as_}` : null,
      status: hs !== null && as_ !== null ? "finished" : (editing.status || "scheduled"),
      fpb_url: editing.fpb_url || null,
    };
    if (editing.id) await supabase.from("games").update(payload).eq("id", editing.id);
    else await supabase.from("games").insert(payload);
    setEditing(null); fetchGames();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este jogo?")) return;
    await supabase.from("games").delete().eq("id", id); fetchGames();
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/admin"); };

  const newItem = () => setEditing({
    date: new Date().toISOString().split("T")[0], time: "15:00",
    home_team: "OLIVEIRENSE", away_team: "", home_score: null, away_score: null,
    home_logo_url: null, away_logo_url: null,
    venue: "PAV. MUNICIPAL O. AZEMÉIS", competition: "LIGA MASC. BASQUETEBOL", round: "", status: "scheduled",
    fpb_url: null,
  });

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-oliv-navy border-t-oliv-red rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-oliv-border">
        <div><h1 className="text-xl font-extrabold tracking-wider">BACKOFFICE</h1><p className="text-gray-500 text-[13px] mt-1">Gestão de conteúdos</p></div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 text-[13px] font-semibold border border-oliv-border px-4 py-2 rounded-lg hover:text-white transition-colors"><LogOut size={14} /> Sair</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/noticias" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Notícias</Link>
        <Link href="/admin/jogadores" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Jogadores</Link>
        <div className="flex-1 min-w-[70px] bg-oliv-navy/15 border border-oliv-navy text-white px-3 py-3 rounded-xl text-[11px] font-semibold text-center">Jogos</div>
        <Link href="/admin/escaloes" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Escalões</Link>
        <Link href="/admin/palmares" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Palmarés</Link>
        <Link href="/admin/equipas" className="flex-1 min-w-[70px] bg-oliv-card border border-oliv-border text-gray-500 px-3 py-3 rounded-xl text-[11px] font-semibold text-center hover:text-white transition-colors">Equipas</Link>
      </div>

      {/* Import modal */}
      {showImport && (
        <div className="bg-oliv-card border border-oliv-border rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold flex items-center gap-2"><FileSpreadsheet size={18} className="text-oliv-navy" /> Importar jogos do Excel</h3>
            <button onClick={() => { setShowImport(false); setImportData([]); setImportResult(null); }} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          {importResult ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">{importResult.fail === 0 ? "✅" : "⚠️"}</div>
              <p className="text-lg font-bold">{importResult.ok} jogos importados com sucesso</p>
              {importResult.fail > 0 && <p className="text-oliv-red text-sm mt-1">{importResult.fail} falharam</p>}
              <button onClick={() => { setShowImport(false); setImportData([]); setImportResult(null); }} className="mt-4 bg-oliv-navy text-white px-6 py-2 rounded-lg text-sm font-bold">Fechar</button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-4">Pré-visualização de {importData.length} jogos.</p>
              <div className="overflow-x-auto mb-4" style={{ maxHeight: 300 }}>
                <table className="w-full text-xs">
                  <thead><tr className="text-gray-500 uppercase tracking-wider border-b border-oliv-border">
                    <th className="py-2 px-2 text-left">OK</th><th className="py-2 px-2 text-left">Data</th>
                    <th className="py-2 px-2 text-left">Casa</th><th className="py-2 px-2 text-left">Fora</th>
                    <th className="py-2 px-2 text-left">Local</th><th className="py-2 px-2 text-left">Jornada</th>
                    <th className="py-2 px-2 text-left">Resultado</th>
                  </tr></thead>
                  <tbody>{importData.map((row, i) => (
                    <tr key={i} className={`border-b border-oliv-border/50 ${!row.valid ? "opacity-50" : ""}`}>
                      <td className="py-2 px-2">{row.valid ? <Check size={14} className="text-green-400" /> : <AlertCircle size={14} className="text-oliv-red" />}</td>
                      <td className="py-2 px-2 font-mono">{row.date}</td>
                      <td className="py-2 px-2 font-semibold">{row.home_team}</td>
                      <td className="py-2 px-2 font-semibold">{row.away_team}</td>
                      <td className="py-2 px-2 text-gray-500">{row.venue}</td>
                      <td className="py-2 px-2 text-gray-500">{row.round}</td>
                      <td className="py-2 px-2">{row.result || "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">{importData.filter(r => r.valid).length} válidos • {importData.filter(r => !r.valid).length} com erros</p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowImport(false); setImportData([]); }} className="text-gray-500 border border-oliv-border px-5 py-2 rounded-lg text-sm font-semibold hover:text-white transition-colors">Cancelar</button>
                  <button onClick={executeImport} disabled={importing || !importData.filter(r => r.valid).length}
                    className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                    {importing ? "A importar..." : <><Upload size={14} /> Importar {importData.filter(r => r.valid).length} jogos</>}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* List or Form */}
      {!editing ? (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={newItem} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90">
              <Plus size={16} /> Novo jogo
            </button>
            <div className="relative">
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
              <button className="w-full bg-oliv-navy text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90">
                <FileSpreadsheet size={16} /> Importar Excel
              </button>
            </div>
          </div>
          <button onClick={downloadTemplate} className="w-full text-center text-xs text-gray-600 hover:text-oliv-navy mb-5 flex items-center justify-center gap-1 transition-colors">
            <Download size={12} /> Descarregar template CSV de exemplo
          </button>

          <div className="space-y-2">
            {games.map((g) => (
              <div key={g.id} className="flex items-center gap-3 bg-oliv-card border border-oliv-border rounded-xl px-4 py-3.5">
                {/* Mini logos */}
                <div className="flex gap-1.5 items-center">
                  {[g.home_team, g.away_team].map((team, i) => {
                    const logo = (i === 0 ? g.home_logo_url : g.away_logo_url);
                    return (
                      <div key={i} className="w-7 h-7 rounded-full bg-[#1a1a24] border border-oliv-border flex items-center justify-center overflow-hidden">
                        {logo ? <img src={logo} className="w-full h-full object-contain p-0.5" /> : <span className="text-[8px] font-bold text-gray-500">{team.slice(0,3)}</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{g.home_team} vs {g.away_team}</div>
                  <div className="text-gray-500 text-xs mt-1">{g.date_label || g.date} • {g.time_label || g.time}{g.result ? ` • ${g.result}` : " • Agendado"}</div>
                </div>
                <button onClick={() => setEditing(g)} className="p-2 rounded-lg border border-oliv-navy text-gray-400 hover:text-white transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(g.id)} className="p-2 rounded-lg border border-oliv-red/30 text-oliv-red hover:bg-oliv-red/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <GameForm editing={editing} setEditing={setEditing} onSave={handleSave} />
      )}
    </div>
  );
}

/* ── Game Form ── */
function GameForm({ editing, setEditing, onSave }: { editing: Partial<Game>; setEditing: (v: Partial<Game>) => void; onSave: () => void }) {
  const u = (k: keyof Game, v: any) => setEditing({ ...editing, [k]: v });

  const homeLogoSrc = editing.home_logo_url || undefined;
  const awayLogoSrc = editing.away_logo_url || undefined;

  return (
    <div className="bg-oliv-card border border-oliv-border rounded-xl p-7">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setEditing(null as any)} className="text-oliv-navy"><ArrowLeft size={18} /></button>
        <h3 className="text-lg font-bold">{editing.id ? "Editar Jogo" : "Novo Jogo"}</h3>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center gap-6 bg-[#0A0A12] rounded-xl p-5 mb-6 border border-oliv-border">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#1a1a24] border border-oliv-border mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {homeLogoSrc ? <img src={homeLogoSrc} className="w-full h-full object-contain p-1" /> : <span className="text-[10px] font-extrabold text-oliv-red">{(editing.home_team || "?").slice(0,3)}</span>}
          </div>
          <div className="text-[11px] font-bold text-oliv-red">{editing.home_team || "Casa"}</div>
        </div>
        <div className="text-center">
          {editing.home_score !== null && editing.away_score !== null && editing.home_score !== undefined && editing.away_score !== undefined
            ? <div className="text-2xl font-black tracking-widest">{editing.home_score} – {editing.away_score}</div>
            : <div className="text-sm font-bold text-gray-600 tracking-[3px]">VS</div>}
          <div className="text-[10px] text-gray-600 mt-1">{editing.date_label || editing.date}</div>
        </div>
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#1a1a24] border border-oliv-border mx-auto mb-2 flex items-center justify-center overflow-hidden">
            {awayLogoSrc ? <img src={awayLogoSrc} className="w-full h-full object-contain p-1" /> : <span className="text-[10px] font-extrabold text-gray-500">{(editing.away_team || "?").slice(0,3)}</span>}
          </div>
          <div className="text-[11px] font-bold text-gray-300">{editing.away_team || "Fora"}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FF label="Data"><input type="date" className="fi" value={editing.date || ""} onChange={e => u("date", e.target.value)} /></FF>
        <FF label="Hora"><input className="fi" value={editing.time || ""} onChange={e => u("time", e.target.value)} placeholder="15:00" /></FF>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FF label="Equipa Casa"><input className="fi" value={editing.home_team || ""} onChange={e => u("home_team", e.target.value)} placeholder="OLIVEIRENSE" /></FF>
        <FF label="Equipa Fora"><input className="fi" value={editing.away_team || ""} onChange={e => u("away_team", e.target.value)} placeholder="FC PORTO" /></FF>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FF label="Logo Casa (URL)">
          <input className="fi" value={editing.home_logo_url || ""} onChange={e => u("home_logo_url", e.target.value)} placeholder="https://..." />
          <p className="text-[11px] text-gray-600 mt-1">Deixar vazio para logo automático</p>
        </FF>
        <FF label="Logo Fora (URL)">
          <input className="fi" value={editing.away_logo_url || ""} onChange={e => u("away_logo_url", e.target.value)} placeholder="https://..." />
        </FF>
      </div>
      <FF label="Local / Pavilhão"><input className="fi" value={editing.venue || ""} onChange={e => u("venue", e.target.value)} placeholder="PAV. MUNICIPAL O. AZEMÉIS" /></FF>
      <div className="grid grid-cols-2 gap-3">
        <FF label="Competição"><input className="fi" value={editing.competition || ""} onChange={e => u("competition", e.target.value)} /></FF>
        <FF label="Jornada / Fase"><input className="fi" value={editing.round || ""} onChange={e => u("round", e.target.value)} placeholder="JORNADA 22" /></FF>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <FF label="Estado">
          <select className="fi" value={editing.status || "scheduled"} onChange={e => u("status", e.target.value)}>
            <option value="scheduled">Agendado</option>
            <option value="finished">Terminado</option>
            <option value="postponed">Adiado</option>
          </select>
        </FF>
        <FF label="Resultado Casa"><input type="number" className="fi" value={editing.home_score ?? ""} onChange={e => u("home_score", e.target.value ? parseInt(e.target.value) : null)} placeholder="—" /></FF>
        <FF label="Resultado Fora"><input type="number" className="fi" value={editing.away_score ?? ""} onChange={e => u("away_score", e.target.value ? parseInt(e.target.value) : null)} placeholder="—" /></FF>
      </div>
      <FF label="Link Estatísticas FPB (URL do relatório do jogo)">
        <input
          className="fi"
          value={editing.fpb_url || ""}
          onChange={e => u("fpb_url", e.target.value)}
          placeholder="https://fpb.pt/en/game/..."
        />
        <p className="text-[11px] text-gray-600 mt-1">
          Vai ao site da FPB → abre o jogo → copia o URL da página. Aparece como botão "Estatísticas FPB" junto ao resultado.
        </p>
      </FF>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} className="bg-gradient-to-r from-oliv-red to-oliv-red-dark text-white px-7 py-3 rounded-lg text-sm font-bold hover:opacity-90">Guardar</button>
        <button onClick={() => setEditing(null as any)} className="text-gray-500 border border-oliv-border px-7 py-3 rounded-lg text-sm font-semibold hover:text-white transition-colors">Cancelar</button>
      </div>

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

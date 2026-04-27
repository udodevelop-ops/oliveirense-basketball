-- ============================================
-- OLIVEIRENSE BASQUETEBOL — Tabela de Jogos
-- Executar no SQL Editor do Supabase Dashboard
-- ============================================

create table if not exists public.games (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  date_label text not null,
  time_label text not null,
  home_team text not null,
  away_team text not null,
  home_logo_url text,
  away_logo_url text,
  venue text,
  competition text not null default 'LIGA MASC. BASQUETEBOL',
  round text,
  result text,
  status text not null default 'scheduled',
  home_score int,
  away_score int,
  time text default '15:00',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_games_date on public.games (date);
create index if not exists idx_games_status on public.games (status);

create trigger games_updated_at
  before update on public.games
  for each row execute function public.update_updated_at();

alter table public.games enable row level security;

create policy "Games: leitura pública"
  on public.games for select using (true);

create policy "Games: admins podem tudo"
  on public.games for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Dados de exemplo
insert into public.games (date, date_label, time_label, home_team, away_team, venue, competition, round, result, status, home_score, away_score) values
  ('2026-02-01','01 FEV 2026','SÁB 16:00H','OLIVEIRENSE','OVARENSE','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 13','78-65','finished',78,65),
  ('2026-02-08','08 FEV 2026','DOM 15:00H','FC PORTO','OLIVEIRENSE','DRAGÃO ARENA','LIGA MASC. BASQUETEBOL','JORNADA 14','91-88','finished',91,88),
  ('2026-02-15','15 FEV 2026','SÁB 15:00H','OLIVEIRENSE','CAB MADEIRA','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 15','95-80','finished',95,80),
  ('2026-02-22','22 FEV 2026','SÁB 15:00H','SPORTING CP','OLIVEIRENSE','PAV. JOÃO ROCHA','LIGA MASC. BASQUETEBOL','JORNADA 16','74-79','finished',74,79),
  ('2026-03-01','01 MAR 2026','DOM 16:00H','OLIVEIRENSE','SL BENFICA','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 17','88-84','finished',88,84),
  ('2026-03-08','08 MAR 2026','SÁB 15:00H','IMORTAL','OLIVEIRENSE','PAV. IMORTAL','LIGA MASC. BASQUETEBOL','JORNADA 18','61-83','finished',61,83),
  ('2026-03-22','22 MAR 2026','SÁB 15:00H','OLIVEIRENSE','ACADÉMICA','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 19','82-71','finished',82,71),
  ('2026-03-29','29 MAR 2026','SÁB 15:00H','LUSITÂNIA','OLIVEIRENSE','PAV. LUSITÂNIA','LIGA MASC. BASQUETEBOL','JORNADA 20','68-75','finished',68,75),
  ('2026-04-05','05 ABR 2026','SÁB 15:00H','OLIVEIRENSE','VITÓRIA SC','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 21','89-72','finished',89,72),
  ('2026-04-26','26 ABR 2026','SÁB 15:00H','OLIVEIRENSE','FC PORTO','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 22',null,'scheduled',null,null),
  ('2026-05-02','02 MAI 2026','SÁB 21:00H','SL BENFICA','OLIVEIRENSE','PAVILHÃO Nº 2 DA LUZ','LIGA MASC. BASQUETEBOL','JORNADA 23',null,'scheduled',null,null),
  ('2026-05-09','09 MAI 2026','SÁB 15:00H','OLIVEIRENSE','SPORTING CP','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 24',null,'scheduled',null,null),
  ('2026-05-16','16 MAI 2026','SÁB 18:00H','OVARENSE','OLIVEIRENSE','ARENA DE OVAR','LIGA MASC. BASQUETEBOL','JORNADA 25',null,'scheduled',null,null),
  ('2026-05-23','23 MAI 2026','SÁB 15:00H','OLIVEIRENSE','CAB MADEIRA','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 26',null,'scheduled',null,null),
  ('2026-05-30','30 MAI 2026','SÁB 15:00H','ACADÉMICA','OLIVEIRENSE','PAV. ACADÉMICA','LIGA MASC. BASQUETEBOL','JORNADA 27',null,'scheduled',null,null),
  ('2026-06-06','06 JUN 2026','SÁB 15:00H','OLIVEIRENSE','IMORTAL','PAV. MUNICIPAL O. AZEMÉIS','LIGA MASC. BASQUETEBOL','JORNADA 28',null,'scheduled',null,null);

-- ============================================
-- ADICIONAR COLUNA fpb_url (correr separado se
-- a tabela já existir)
-- ============================================
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS fpb_url text;

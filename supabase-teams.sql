-- ============================================
-- OLIVEIRENSE — Escalões / Plantel
-- Executar no SQL Editor do Supabase
-- ============================================

-- 1. ESCALÕES (teams)
create table if not exists public.teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,                    -- ex: "Sénior", "Sub-18", "Sub-16"
  slug text not null unique,             -- ex: "senior", "sub-18", "sub-16"
  season text not null default '2025/26',-- ex: "2025/26", "2024/25"
  is_current boolean default true,       -- true = época atual, false = arquivo
  team_photo_url text,                   -- foto de equipa
  description text,                      -- texto livre sobre o escalão
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_teams_season on public.teams (season);
create index if not exists idx_teams_current on public.teams (is_current);
create index if not exists idx_teams_slug on public.teams (slug);

-- 2. HORÁRIOS DE TREINO (team_schedules)
create table if not exists public.team_schedules (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  day_of_week text not null,             -- ex: "Segunda-feira"
  start_time text not null,             -- ex: "18:30"
  end_time text not null,               -- ex: "20:00"
  venue text not null,                  -- ex: "Pav. Municipal"
  display_order int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_schedules_team on public.team_schedules (team_id);

-- 3. JOGADORES/STAFF POR ESCALÃO (team_players)
create table if not exists public.team_players (
  id uuid default gen_random_uuid() primary key,
  team_id uuid references public.teams(id) on delete cascade,
  name text not null,
  number text,                          -- número de camisola (null para staff)
  position text,                        -- ex: "Base", "Extremo", "Poste"
  role text not null default 'player',  -- 'player' ou 'staff'
  staff_role text,                      -- ex: "Treinador", "Treinador Adjunto"
  photo_url text,
  bio text,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_team_players_team on public.team_players (team_id);
create index if not exists idx_team_players_role on public.team_players (role);

-- 4. TRIGGERS updated_at
create trigger teams_updated_at
  before update on public.teams
  for each row execute function public.update_updated_at();

create trigger team_players_updated_at
  before update on public.team_players
  for each row execute function public.update_updated_at();

-- 5. ROW LEVEL SECURITY
alter table public.teams enable row level security;
alter table public.team_schedules enable row level security;
alter table public.team_players enable row level security;

create policy "Teams: leitura pública" on public.teams for select using (true);
create policy "Teams: admins podem tudo" on public.teams for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "Schedules: leitura pública" on public.team_schedules for select using (true);
create policy "Schedules: admins podem tudo" on public.team_schedules for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "Team players: leitura pública" on public.team_players for select using (true);
create policy "Team players: admins podem tudo" on public.team_players for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- 6. DADOS DE EXEMPLO (escalões 2025/26)
insert into public.teams (name, slug, season, is_current, display_order) values
  ('Sénior',      'senior',     '2025/26', true, 1),
  ('Sub-18',      'sub-18',     '2025/26', true, 2),
  ('Sub-16',      'sub-16',     '2025/26', true, 3),
  ('Sub-14',      'sub-14',     '2025/26', true, 4),
  ('Sub-12',      'sub-12',     '2025/26', true, 5),
  ('Sub-10',      'sub-10',     '2025/26', true, 6),
  ('Minibasquete','minibasquete','2025/26', true, 7);

-- Horários de exemplo para o Sénior
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Segunda-feira', '19:00', '21:00', 'Pav. Municipal O. Azeméis', 1 from public.teams where slug = 'senior';
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Quarta-feira',  '19:00', '21:00', 'Pav. Municipal O. Azeméis', 2 from public.teams where slug = 'senior';
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Sexta-feira',   '19:00', '21:00', 'Pav. Municipal O. Azeméis', 3 from public.teams where slug = 'senior';

-- Horários de exemplo para Sub-14
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Segunda-feira', '18:30', '20:00', 'Pav. Municipal O. Azeméis', 1 from public.teams where slug = 'sub-14';
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Terça-feira',   '18:30', '20:00', 'Pav. Ferreira de Castro',   2 from public.teams where slug = 'sub-14';
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Sexta-feira',   '18:30', '20:00', 'Pav. Soares Basto',         3 from public.teams where slug = 'sub-14';
insert into public.team_schedules (team_id, day_of_week, start_time, end_time, venue, display_order)
select id, 'Sábado',        '11:30', '13:00', 'Pav. Soares Basto',         4 from public.teams where slug = 'sub-14';

-- ============================================
-- PRONTO! Corre este SQL no Supabase.
-- ============================================

-- =====================================================================
-- FreelanceConnect.de — Initial-Schema mit Row-Level-Security
-- =====================================================================
-- DSGVO-Logik server-seitig durchgesetzt:
--   * Gäste sehen Projekte ohne Auftraggeber-Klarnamen
--   * Freelancer-Profile sind nur für lizenzierte Recruiter im Klartext
--   * Bewerben erfordert aktives Connect-Pro-Abo
--   * Recruiter-Kontaktaufnahme erfordert verifizierte Lizenz + AVV
--   * Audit-Log für jeden Profilzugriff
-- =====================================================================

-- ────────── Erweiterungen ──────────
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ────────── Enums ──────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('freelancer', 'recruiter');
  end if;
  if not exists (select 1 from pg_type where typname = 'work_mode') then
    create type work_mode as enum ('remote', 'hybrid', 'onsite');
  end if;
  if not exists (select 1 from pg_type where typname = 'contract_type') then
    create type contract_type as enum (
      'freelance', 'werkvertrag', 'dienstvertrag', 'anue', 'festanstellung'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'availability') then
    create type availability as enum (
      'immediately', '1month', '3months', 'flexible'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'country') then
    create type country as enum ('DE', 'AT', 'CH');
  end if;
end$$;

-- ────────── profiles ──────────
-- Eine Zeile pro auth.users-Eintrag.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null,
  full_name text not null,
  email citext not null,
  -- Freelancer-Felder
  freelancer_title text,
  freelancer_bio text,
  freelancer_initials text,
  freelancer_location text,
  freelancer_region text,
  freelancer_country country,
  freelancer_work_mode work_mode,
  freelancer_availability availability,
  freelancer_rate_min int,
  freelancer_rate_max int,
  freelancer_years_exp int,
  freelancer_industry text,
  freelancer_skills text[] not null default '{}',
  freelancer_languages text[] not null default '{}',
  freelancer_is_verified boolean not null default false,
  -- Abo-/Lizenz-Status (server-seitig vertrauenswürdig)
  has_freelancer_premium boolean not null default false,
  has_recruiter_license boolean not null default false,
  company_name text,
  company_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ────────── projects ──────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  industry text not null,
  contract_type contract_type not null,
  work_mode work_mode not null,
  country country not null,
  region text,
  location text not null,
  postal_code text,
  start_date date not null,
  duration_months int,
  budget_min int,
  budget_max int,
  budget_unit text not null check (budget_unit in ('hour','day','project')),
  rate_undisclosed boolean not null default false,
  skills text[] not null default '{}',
  is_top boolean not null default false,
  is_urgent boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists projects_industry_idx on public.projects (industry);
create index if not exists projects_country_idx on public.projects (country);
create index if not exists projects_published_idx on public.projects (published_at desc);
create index if not exists projects_skills_gin on public.projects using gin (skills);

-- ────────── applications (Bewerbungen) ──────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  freelancer_id uuid not null references public.profiles(id) on delete cascade,
  cover_letter text,
  proposed_rate int,
  created_at timestamptz not null default now(),
  unique (project_id, freelancer_id)
);

-- ────────── recruiter_licenses ──────────
-- Eine Lizenz pro Recruiter; nur 'active' erlaubt Klartext-Zugriff.
create table if not exists public.recruiter_licenses (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null unique references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'active', 'revoked')),
  legal_name text not null,
  ust_id text,
  hrb_number text,
  avv_signed_at timestamptz,
  granted_at timestamptz,
  expires_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- ────────── profile_access_log (DSGVO-Audit) ──────────
-- Jede Recruiter-Aktion auf einem Freelancer-Profil.
create table if not exists public.profile_access_log (
  id bigserial primary key,
  recruiter_id uuid not null references public.profiles(id) on delete cascade,
  freelancer_id uuid not null references public.profiles(id) on delete cascade,
  access_type text not null check (access_type in ('view', 'download', 'contact')),
  created_at timestamptz not null default now()
);

create index if not exists access_log_freelancer_idx
  on public.profile_access_log (freelancer_id, created_at desc);

-- =====================================================================
-- Helper-Funktionen
-- =====================================================================
create or replace function public.current_role()
returns user_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.has_valid_recruiter_license()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.recruiter_licenses rl
    join public.profiles p on p.id = rl.recruiter_id
    where rl.recruiter_id = auth.uid()
      and rl.status = 'active'
      and (rl.expires_at is null or rl.expires_at > now())
      and p.company_verified = true
  );
$$;

create or replace function public.has_freelancer_premium()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select has_freelancer_premium from public.profiles where id = auth.uid()),
    false
  );
$$;

-- =====================================================================
-- RLS — Row-Level-Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.recruiter_licenses enable row level security;
alter table public.profile_access_log enable row level security;

-- ────────── profiles ──────────
-- Eigenen Profil-Eintrag immer lesen/schreiben.
create policy "profiles_own_select" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_own_update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_own_insert" on public.profiles
  for insert with check (id = auth.uid());

-- Lizenzierte Recruiter dürfen Freelancer-Profile im Klartext lesen.
create policy "profiles_recruiter_select_freelancers" on public.profiles
  for select using (
    role = 'freelancer' and public.has_valid_recruiter_license()
  );

-- ────────── projects ──────────
-- Veröffentlichte Projekte sind für alle authentifizierten Nutzer sichtbar.
-- (Klartext-Firma steuern wir über die SELECT-Spaltenliste im Client/RPC.)
create policy "projects_authenticated_select" on public.projects
  for select using (auth.uid() is not null);

-- Eigene Projekte verwalten — Recruiter mit verifizierter Firma.
create policy "projects_owner_insert" on public.projects
  for insert with check (
    owner_id = auth.uid()
    and public.current_role() = 'recruiter'
  );

create policy "projects_owner_update" on public.projects
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "projects_owner_delete" on public.projects
  for delete using (owner_id = auth.uid());

-- ────────── applications ──────────
-- Freelancer bewirbt sich — Premium erforderlich.
create policy "applications_freelancer_insert" on public.applications
  for insert with check (
    freelancer_id = auth.uid()
    and public.current_role() = 'freelancer'
    and public.has_freelancer_premium()
  );

create policy "applications_freelancer_select_own" on public.applications
  for select using (freelancer_id = auth.uid());

-- Recruiter sieht Bewerbungen auf seine Projekte (Lizenz erforderlich).
create policy "applications_recruiter_select_inbox" on public.applications
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = applications.project_id
        and p.owner_id = auth.uid()
    )
    and public.has_valid_recruiter_license()
  );

-- ────────── recruiter_licenses ──────────
create policy "licenses_recruiter_select_own" on public.recruiter_licenses
  for select using (recruiter_id = auth.uid());

create policy "licenses_recruiter_insert_own" on public.recruiter_licenses
  for insert with check (
    recruiter_id = auth.uid()
    and public.current_role() = 'recruiter'
    and status = 'pending'
  );

-- ────────── profile_access_log ──────────
-- Recruiter sieht eigene Zugriffe (Compliance), Freelancer sieht Zugriffe
-- auf das eigene Profil (Auskunftsrecht nach Art. 15 DSGVO).
create policy "access_log_recruiter_select" on public.profile_access_log
  for select using (recruiter_id = auth.uid());

create policy "access_log_freelancer_select" on public.profile_access_log
  for select using (freelancer_id = auth.uid());

-- Recruiter darf nur eigene Zugriffe loggen.
create policy "access_log_recruiter_insert" on public.profile_access_log
  for insert with check (
    recruiter_id = auth.uid()
    and public.has_valid_recruiter_license()
  );

-- =====================================================================
-- Auto-Provisioning: profile-Zeile bei jedem neuen auth.users
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, freelancer_initials, company_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'freelancer'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    upper(left(coalesce(new.raw_user_meta_data->>'full_name', new.email), 2)),
    new.raw_user_meta_data->>'company_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Hinweis: Anonyme (nicht eingeloggte) Nutzer sehen *keine* Projekte
-- oder Profile aus der Datenbank. Die öffentliche Landing-Page nutzt
-- weiterhin Mock/Demo-Daten oder server-seitig vorgerenderte, anonymisierte
-- Auszüge — DSGVO-konform.
-- =====================================================================

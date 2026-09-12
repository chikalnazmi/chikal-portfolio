-- =========================================================================
-- SUPABASE SCHEMA UNTUK PORTOFOLIO & CMS CHIKAL NAZMI MAHIRA
-- =========================================================================
-- Jalankan query ini di menu "SQL Editor" -> "New query" di dashboard Supabase Anda.

-- 1. Buat Tabel portfolio_content
create table if not exists public.portfolio_content (
  id text primary key default 'main',
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.portfolio_content enable row level security;

-- 3. Policy agar siapa pun (pengunjung website) bisa membaca konten portofolio
create policy "Allow public read access"
  on public.portfolio_content
  for select
  using (true);

-- 4. Policy agar admin (melalui studio admin) bisa menyimpan perubahan
create policy "Allow public update access"
  on public.portfolio_content
  for update
  using (true)
  with check (true);

create policy "Allow public insert access"
  on public.portfolio_content
  for insert
  with check (true);

-- 5. Data inisial
insert into public.portfolio_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

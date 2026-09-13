-- =========================================================================
-- SUPABASE SCHEMA UNTUK PORTOFOLIO & CMS CHIKAL NAZMI MAHIRA
-- =========================================================================
-- Skema bersih tanpa rules rumit: Database tunggal (Single Source of Truth)
-- Jalankan query ini di menu "SQL Editor" -> "New query" di dashboard Supabase jika ingin reset total.

-- 1. Buat Tabel portfolio_content jika belum ada
create table if not exists public.portfolio_content (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Nonaktifkan Row Level Security (RLS) agar tidak ada rules yang memblokir simpan / baca
alter table public.portfolio_content disable row level security;

-- 3. Data inisial (placeholder baris utama)
insert into public.portfolio_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

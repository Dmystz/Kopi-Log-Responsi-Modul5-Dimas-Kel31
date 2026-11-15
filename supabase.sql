-- Jalankan di Supabase > SQL Editor
create table public.kopi (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  metode text,
  rating int,
  tanggal date,
  catatan text,
  created_at timestamptz default now()
);

alter table public.kopi enable row level security;

-- Untuk tugas praktikum: izinkan akses publik (anon) penuh
create policy "akses publik" on public.kopi
  for all to anon using (true) with check (true);

# Kopi Log (PWA)
React + Vite + vite-plugin-pwa + Axios (REST API Supabase).

1. `npm install`
2. Buat project di https://supabase.com, jalankan isi `supabase.sql` di SQL Editor
3. Salin `.env.example` jadi `.env`, isi URL dan anon key (Project Settings > API)
4. Edit data diri di `src/pages/Profil.jsx`
5. `npm run build && npm run preview` untuk uji install & offline
6. Push ke GitHub, import di Vercel, tambahkan Environment Variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, lalu deploy.

import axios from 'axios'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
const KEY = 'kopi-log:entries'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const write = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch {} }

// Jika env Supabase diisi -> pakai REST API Supabase lewat Axios. Jika kosong -> mode lokal.
const http = URL && KEY_ANON
  ? axios.create({
      baseURL: `${URL}/rest/v1`,
      timeout: 8000,
      headers: {
        apikey: KEY_ANON,
        Authorization: `Bearer ${KEY_ANON}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      }
    })
  : null
export const sumberData = http ? 'Supabase (Axios)' : 'Lokal'

const bersih = (d) => ({
  nama: d.nama, metode: d.metode, rating: Number(d.rating), tanggal: d.tanggal, catatan: d.catatan
})

// READ: ambil dari Supabase, simpan cache; kalau offline pakai cache
export async function listEntries() {
  if (!http) return read()
  try {
    const { data } = await http.get('/kopi', { params: { select: '*', order: 'created_at.desc' } })
    write(data)
    return data
  } catch {
    return read()
  }
}

// CREATE
export async function createEntry(d) {
  if (!http) { const item = { ...d, id: crypto.randomUUID() }; write([item, ...read()]); return item }
  const { data } = await http.post('/kopi', bersih(d))
  write([data[0], ...read()])
  return data[0]
}

// UPDATE
export async function updateEntry(id, d) {
  if (!http) { const item = { ...d, id }; write(read().map((x) => (x.id === id ? item : x))); return item }
  const { data } = await http.patch('/kopi', bersih(d), { params: { id: `eq.${id}` } })
  write(read().map((x) => (x.id === id ? data[0] : x)))
  return data[0]
}

// DELETE
export async function removeEntry(id) {
  if (http) await http.delete('/kopi', { params: { id: `eq.${id}` } })
  write(read().filter((x) => x.id !== id))
}

// ---------- PROFIL (satu baris, id = 1) ----------
const PKEY = 'kopi-log:profil'
const profilAwal = { nama: 'Nama Lengkap Kamu', nim: '00000000000', kelompok: 'Kelompok X' }
const bacaProfil = () => { try { return { ...profilAwal, ...JSON.parse(localStorage.getItem(PKEY)) } } catch { return profilAwal } }
const tulisProfil = (d) => { try { localStorage.setItem(PKEY, JSON.stringify(d)) } catch {} }
const ambilProfil = (d) => ({ nama: d.nama, nim: d.nim, kelompok: d.kelompok })

export async function getProfil() {
  if (!http) return bacaProfil()
  try {
    const { data } = await http.get('/profil', { params: { select: '*', id: 'eq.1' } })
    if (data.length) { const p = ambilProfil(data[0]); tulisProfil(p); return p }
    return bacaProfil()
  } catch {
    return bacaProfil()
  }
}

export async function saveProfil(d) {
  const p = ambilProfil(d)
  if (http) {
    await http.post('/profil', { id: 1, ...p }, {
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' }
    })
  }
  tulisProfil(p)
  return p
}
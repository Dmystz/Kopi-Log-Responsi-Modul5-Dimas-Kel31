import { useState } from 'react'
import { useEffect } from 'react'
import { listEntries, createEntry, updateEntry, removeEntry } from '../api.js'

const kosong = { nama: '', metode: 'Espresso', rating: 4, tanggal: new Date().toISOString().slice(0, 10), catatan: '' }

export default function Catatan() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cari, setCari] = useState('')

  useEffect(() => { listEntries().then((d) => { setEntries(d); setLoading(false) }) }, [])
  const [form, setForm] = useState(kosong)
  const [editId, setEditId] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function simpan(e) {
    e.preventDefault()
    if (!form.nama.trim()) return
    setError('')
    try {
      if (editId) {
        const item = await updateEntry(editId, form)
        setEntries(entries.map((x) => (x.id === editId ? item : x)))
      } else {
        const item = await createEntry(form)
        setEntries([item, ...entries])
      }
      batal()
    } catch {
      setError('Gagal menyimpan. Periksa koneksi internet lalu coba lagi.')
    }
  }
  function ubah(x) { setForm({ ...kosong, ...Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v ?? ''])) }); setEditId(x.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  async function hapus(id) {
    if (!confirm('Hapus catatan ini?')) return
    setError('')
    try {
      await removeEntry(id)
      setEntries(entries.filter((x) => x.id !== id))
    } catch {
      setError('Gagal menghapus. Periksa koneksi internet lalu coba lagi.')
    }
  }
  function batal() { setForm(kosong); setEditId(null) }

  const q = cari.trim().toLowerCase()
  const tampil = entries.filter((x) => `${x.nama} ${x.metode}`.toLowerCase().includes(q))

  return (
    <section className="split">
      <div>
      <h2>{editId ? 'Ubah catatan' : 'Catatan baru'}</h2>
      <form onSubmit={simpan} className="card form">
        <label>Nama kopi
          <input value={form.nama} onChange={set('nama')} placeholder="Contoh: Gayo Wine" required />
        </label>
        <label>Metode seduh
          <select value={form.metode} onChange={set('metode')}>
            {['Espresso', 'V60', 'Tubruk', 'French Press', 'Kopi Susu', 'Cold Brew'].map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <div className="row top-align">
          <label>Rating (1-5)
            <input type="number" min="1" max="5" value={form.rating} onChange={set('rating')} />
          </label>
          <label>Tanggal
            <input type="date" value={form.tanggal} onChange={set('tanggal')} />
          </label>
        </div>
        <label>Rasa & catatan
          <textarea rows="2" value={form.catatan} onChange={set('catatan')} placeholder="Asam buah, body ringan..." />
        </label>
        <div className="row">
          <button className="btn" type="submit">{editId ? 'Simpan perubahan' : 'Tambah catatan'}</button>
          {editId && <button type="button" className="btn ghost" onClick={batal}>Batal</button>}
        </div>
      </form>
      </div>

      <div>
        <h2>Riwayat ({entries.length})</h2>
        {error && <p role="alert" className="card" style={{ borderColor: 'var(--red)' }}>{error}</p>}
        {loading && <p className="muted">Memuat...</p>}

        {!loading && entries.length === 0 && (
          <div className="kosong">
            <svg viewBox="0 0 120 120" width="96" height="96" aria-hidden="true">
              <path d="M24 44h58v30a20 20 0 0 1-20 20H44a20 20 0 0 1-20-20z" fill="#E0A526"/>
              <path d="M82 52h6a11 11 0 0 1 0 22h-6" fill="none" stroke="#E0A526" strokeWidth="7"/>
              <rect x="18" y="100" width="76" height="6" rx="3" fill="#1F2A44"/>
              <path d="M44 32c-4-6 4-8 0-14M60 32c-4-6 4-8 0-14" stroke="#1F2A44" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
            <h3>Belum ada catatan kopi</h3>
            <p className="muted">Isi form di sebelah kiri, lalu klik "Tambah catatan". Cangkir pertamamu akan muncul di sini.</p>
          </div>
        )}

        {entries.length > 0 && (
          <>
            <input
              className="cari"
              placeholder="Cari nama kopi atau metode..."
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />
            <div className="grid">
              {tampil.map((x) => (
                <article key={x.id} className="card kopi">
                  <div className="row between">
                    <span className="tag">{x.metode}</span>
                    <span className="rate">{'★'.repeat(Number(x.rating) || 0)}<small> {x.rating}/5</small></span>
                  </div>
                  <h3>{x.nama}</h3>
                  <p className="muted">{x.tanggal}</p>
                  {x.catatan && <p>{x.catatan}</p>}
                  <div className="row">
                    <button className="btn small" onClick={() => ubah(x)}>Ubah</button>
                    <button className="btn small danger" onClick={() => hapus(x.id)}>Hapus</button>
                  </div>
                </article>
              ))}
            </div>
            {tampil.length === 0 && <p className="muted">Tidak ada catatan yang cocok dengan "{cari}".</p>}
          </>
        )}
      </div>
    </section>
  )
}

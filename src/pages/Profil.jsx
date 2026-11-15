import { useEffect, useState } from 'react'
import { getProfil, saveProfil } from '../api.js'

export default function Profil() {
  const [profil, setProfil] = useState(null)
  const [form, setForm] = useState(null)
  const [edit, setEdit] = useState(false)
  const [error, setError] = useState('')
  const [pesan, setPesan] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)

  useEffect(() => { getProfil().then((p) => { setProfil(p); setForm(p) }) }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function simpan(e) {
    e.preventDefault()
    setError(''); setMenyimpan(true)
    try {
      const p = await saveProfil(form)
      setProfil(p); setForm(p); setEdit(false); setPesan('Profil tersimpan.')
      setTimeout(() => setPesan(''), 3000)
    } catch {
      setError('Gagal menyimpan profil. Periksa koneksi internet lalu coba lagi.')
    }
    setMenyimpan(false)
  }

  if (!profil) return <section><h2>Profil</h2><p className="muted">Memuat...</p></section>

  return (
    <section>
      <h2>Profil</h2>
      {error && <p role="alert" className="card" style={{ borderColor: 'var(--red)' }}>{error}</p>}
      {pesan && <p role="status" className="card">{pesan}</p>}
      {edit ? (
        <form onSubmit={simpan} className="card form profil-form">
          <label>Nama<input value={form.nama} onChange={set('nama')} required /></label>
          <label>NIM<input value={form.nim} onChange={set('nim')} required /></label>
          <label>Kelompok<input value={form.kelompok} onChange={set('kelompok')} required /></label>
          <div className="row">
            <button className="btn" type="submit" disabled={menyimpan}>{menyimpan ? 'Menyimpan...' : 'Simpan profil'}</button>
            <button type="button" className="btn ghost" onClick={() => { setForm(profil); setEdit(false); setError('') }}>Batal</button>
          </div>
        </form>
      ) : (
        <>
          <dl className="card profil">
            <dt>Nama</dt><dd>{profil.nama}</dd>
            <dt>NIM</dt><dd>{profil.nim}</dd>
            <dt>Kelompok</dt><dd>{profil.kelompok}</dd>
          </dl>
          <button className="btn" onClick={() => setEdit(true)}>Ubah profil</button>
        </>
      )}
    </section>
  )
}
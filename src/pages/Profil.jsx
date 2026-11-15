import { useState } from 'react'

const KEY = 'kopi-log:profil'
const awal = { nama: 'Nama Lengkap Kamu', nim: '00000000000', kelompok: 'Kelompok X' }

function baca() {
  try { return { ...awal, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return awal }
}

export default function Profil() {
  const [profil, setProfil] = useState(baca)
  const [form, setForm] = useState(profil)
  const [edit, setEdit] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function simpan(e) {
    e.preventDefault()
    setProfil(form)
    try { localStorage.setItem(KEY, JSON.stringify(form)) } catch {}
    setEdit(false)
  }

  return (
    <section>
      <h2>Profil</h2>
      {edit ? (
        <form onSubmit={simpan} className="card form">
          <label>Nama<input value={form.nama} onChange={set('nama')} required /></label>
          <label>NIM<input value={form.nim} onChange={set('nim')} required /></label>
          <label>Kelompok<input value={form.kelompok} onChange={set('kelompok')} required /></label>
          <div className="row">
            <button className="btn" type="submit">Simpan profil</button>
            <button type="button" className="btn ghost" onClick={() => { setForm(profil); setEdit(false) }}>Batal</button>
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

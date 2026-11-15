import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listEntries } from '../api.js'

export default function Beranda() {
  const [entries, setEntries] = useState([])
  useEffect(() => { listEntries().then(setEntries) }, [])
  const avg = entries.length ? (entries.reduce((s, e) => s + Number(e.rating), 0) / entries.length).toFixed(1) : '-'
  const last = entries[0]
  return (
    <section>
      <h2>Catat setiap cangkir, ingat mana yang paling enak.</h2>
      <div className="stats">
        <div><strong>{entries.length}</strong><span>cangkir dicatat</span></div>
        <div><strong>{avg}</strong><span>rata-rata rating</span></div>
      </div>
      {last ? (
        <div className="card">
          <p className="muted">Terakhir diminum</p>
          <h3>{last.nama}</h3>
          <p>{last.metode} · {last.tanggal}</p>
        </div>
      ) : (
        <div className="card"><p>Belum ada catatan.</p></div>
      )}
      <Link className="btn" to="/catatan">Tambah catatan kopi</Link>
    </section>
  )
}

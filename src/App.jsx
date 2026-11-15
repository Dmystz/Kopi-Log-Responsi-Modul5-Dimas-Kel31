import { NavLink, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Beranda from './pages/Beranda.jsx'
import Catatan from './pages/Catatan.jsx'
import Profil from './pages/Profil.jsx'

export default function App() {
  const [online, setOnline] = useState(navigator.onLine)
  const [installEvt, setInstallEvt] = useState(null)

  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false)
    const prompt = (e) => { e.preventDefault(); setInstallEvt(e) }
    const done = () => setInstallEvt(null)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    window.addEventListener('beforeinstallprompt', prompt)
    window.addEventListener('appinstalled', done)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
      window.removeEventListener('beforeinstallprompt', prompt)
      window.removeEventListener('appinstalled', done)
    }
  }, [])

  async function pasang() {
    installEvt.prompt()
    await installEvt.userChoice
    setInstallEvt(null)
  }

  return (
    <div className="app">
      <header className="top">
        <h1>Kopi Log</h1>
        <div className="aksi">
          {installEvt && <button className="pasang" onClick={pasang}>Pasang aplikasi</button>}
          <span className={online ? 'pill on' : 'pill off'}>{online ? 'Online' : 'Offline'}</span>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/catatan" element={<Catatan />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </main>
      <nav className="tabs">
        <NavLink to="/" end>Beranda</NavLink>
        <NavLink to="/catatan">Catatan</NavLink>
        <NavLink to="/profil">Profil</NavLink>
      </nav>
    </div>
  )
}

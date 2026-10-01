import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Auth from './components/Auth.jsx'
import Profile from './components/Profile.jsx'
import Sessions from './components/Sessions.jsx'
import NewSession from './components/NewSession.jsx'
import MyBookings from './components/MyBookings.jsx'
import TutorPanel from './components/TutorPanel.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('tutorias')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const loadProfile = async () => {
    if (!session) return setProfile(null)
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    setProfile(data)
  }
  useEffect(() => { loadProfile() }, [session])

  if (loading) return <p className="center">Cargando…</p>
  if (!session) return <Auth />
  if (!profile) return <p className="center">Cargando tu perfil…</p>

  const isTutor = profile.role === 'tutor'
  const tabs = [
    ['tutorias', 'Tutorías'],
    ['reservas', 'Mis reservas'],
    ...(isTutor ? [['publicar', 'Publicar'], ['panel', 'Mi panel']] : []),
    ['perfil', 'Perfil'],
  ]

  return (
    <div className="shell">
      <header className="top">
        <h1>Tutorías</h1>
        <span className="who">{profile.full_name} · {profile.role}</span>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
      </header>
      <nav className="tabs">
        {tabs.map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </nav>
      <main>
        {tab === 'tutorias' && <Sessions user={session.user} />}
        {tab === 'reservas' && <MyBookings user={session.user} />}
        {tab === 'publicar' && isTutor && <NewSession user={session.user} onDone={() => setTab('panel')} />}
        {tab === 'panel' && isTutor && <TutorPanel user={session.user} />}
        {tab === 'perfil' && <Profile profile={profile} onSaved={loadProfile} />}
      </main>
    </div>
  )
}

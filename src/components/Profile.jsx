import { useState } from 'react'
import { supabase } from '../supabase'

export default function Profile({ profile, onSaved }) {
  const [name, setName] = useState(profile.full_name)
  const [bio, setBio] = useState(profile.bio || '')
  const [msg, setMsg] = useState('')

  const save = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('profiles').update({ full_name: name, bio }).eq('id', profile.id)
    setMsg(error ? error.message : 'Perfil guardado')
    if (!error) onSaved()
  }

  return (
    <form onSubmit={save} className="card">
      <h2>Mi perfil</h2>
      <p className="muted">Rol: {profile.role}</p>
      <label>Nombre<input required value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Sobre mí<textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} /></label>
      {msg && <p className="msg">{msg}</p>}
      <button>Guardar cambios</button>
    </form>
  )
}

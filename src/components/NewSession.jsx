import { useState } from 'react'
import { supabase } from '../supabase'

export default function NewSession({ user, onDone }) {
  const [f, setF] = useState({ title: '', subject: '', description: '', starts_at: '', capacity: 5 })
  const [msg, setMsg] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('sessions').insert({
      ...f, capacity: Number(f.capacity), starts_at: new Date(f.starts_at).toISOString(), tutor_id: user.id,
    })
    if (error) setMsg(error.message)
    else onDone()
  }

  return (
    <form onSubmit={submit} className="card">
      <h2>Publicar tutoría</h2>
      <label>Título<input required value={f.title} onChange={set('title')} /></label>
      <label>Materia<input required value={f.subject} onChange={set('subject')} /></label>
      <label>Descripción<textarea rows={3} value={f.description} onChange={set('description')} /></label>
      <label>Fecha y hora<input type="datetime-local" required value={f.starts_at} onChange={set('starts_at')} /></label>
      <label>Cupos<input type="number" min={1} max={50} required value={f.capacity} onChange={set('capacity')} /></label>
      {msg && <p className="msg">{msg}</p>}
      <button>Publicar tutoría</button>
    </form>
  )
}

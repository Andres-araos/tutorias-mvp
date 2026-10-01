import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { fmt } from '../utils'

function Rate({ booking, onSaved }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const save = async () => {
    await supabase.from('bookings').update({ rating, comment }).eq('id', booking.id)
    onSaved()
  }
  return (
    <div className="rate">
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
      </select>
      <input placeholder="Comentario (opcional)" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={save}>Enviar calificación</button>
    </div>
  )
}

export default function MyBookings({ user }) {
  const [rows, setRows] = useState([])

  const load = async () => {
    const { data } = await supabase.from('bookings')
      .select('*, sessions(title, subject, starts_at, tutor:profiles(full_name))')
      .eq('student_id', user.id).order('created_at', { ascending: false })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  const cancel = async (id) => {
    await supabase.from('bookings').update({ status: 'cancelada' }).eq('id', id)
    load()
  }

  if (rows.length === 0) return <p className="muted">Aún no has reservado tutorías. Busca una en la pestaña Tutorías.</p>

  return rows.map((b) => {
    const past = new Date(b.sessions.starts_at) < new Date()
    return (
      <article key={b.id} className="card">
        <div className="row">
          <div>
            <h3>{b.sessions.title}</h3>
            <p className="muted">{b.sessions.subject} · {b.sessions.tutor?.full_name} · {fmt(b.sessions.starts_at)}</p>
          </div>
          <span className="tag">{b.status}</span>
        </div>
        {b.status === 'activa' && !past && <button className="ghost" onClick={() => cancel(b.id)}>Cancelar reserva</button>}
        {b.status === 'activa' && past && (b.rating
          ? <p>Tu calificación: {b.rating} ★ {b.comment}</p>
          : <Rate booking={b} onSaved={load} />)}
      </article>
    )
  })
}

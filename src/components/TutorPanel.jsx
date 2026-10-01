import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { fmt } from '../utils'

export default function TutorPanel({ user }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    supabase.from('sessions')
      .select('*, bookings(status, rating, comment, student:profiles(full_name))')
      .eq('tutor_id', user.id).order('starts_at', { ascending: false })
      .then(({ data }) => setRows(data || []))
  }, [])

  if (rows.length === 0) return <p className="muted">Todavía no has publicado tutorías.</p>

  return rows.map((s) => {
    const active = s.bookings.filter((b) => b.status === 'activa')
    const rated = active.filter((b) => b.rating)
    const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : null
    return (
      <article key={s.id} className="card">
        <h3>{s.title}</h3>
        <p className="muted">{s.subject} · {fmt(s.starts_at)} · {active.length}/{s.capacity} inscritos{avg && ` · ${avg} ★ promedio`}</p>
        {active.length === 0 ? <p className="muted">Sin inscritos todavía.</p> : (
          <ul>{active.map((b, i) => (
            <li key={i}>{b.student?.full_name}{b.rating ? ` — ${b.rating} ★ ${b.comment || ''}` : ''}</li>
          ))}</ul>
        )}
      </article>
    )
  })
}

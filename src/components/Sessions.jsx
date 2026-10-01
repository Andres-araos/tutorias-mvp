import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { fmt } from '../utils'

export default function Sessions({ user }) {
  const [rows, setRows] = useState([])
  const [mine, setMine] = useState(new Set())
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    const [s, b] = await Promise.all([
      supabase.from('sessions_open').select('*').gte('starts_at', new Date().toISOString()).order('starts_at'),
      supabase.from('bookings').select('session_id').eq('student_id', user.id).eq('status', 'activa'),
    ])
    setRows(s.data || [])
    setMine(new Set((b.data || []).map((x) => x.session_id)))
  }
  useEffect(() => { load() }, [])

  const book = async (id) => {
    setMsg('')
    const { error } = await supabase.from('bookings')
      .upsert({ session_id: id, student_id: user.id, status: 'activa' }, { onConflict: 'session_id,student_id' })
    if (error) setMsg(error.message)
    load()
  }

  const shown = rows.filter((r) =>
    `${r.subject} ${r.title} ${r.tutor_name}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <section>
      <input className="search" placeholder="Buscar por materia, título o tutor" value={q} onChange={(e) => setQ(e.target.value)} />
      {msg && <p className="msg">{msg}</p>}
      {shown.length === 0 && <p className="muted">No hay tutorías próximas que coincidan.</p>}
      {shown.map((r) => {
        const left = r.capacity - r.taken
        const own = r.tutor_id === user.id
        return (
          <article key={r.id} className="card row">
            <div>
              <h3>{r.title}</h3>
              <p className="muted">{r.subject} · {r.tutor_name} · {fmt(r.starts_at)}</p>
              {r.description && <p>{r.description}</p>}
              <p className="muted">{left > 0 ? `${left} cupos libres` : 'Sin cupos'}</p>
            </div>
            {own ? <span className="tag">Tuya</span>
              : mine.has(r.id) ? <span className="tag">Reservada</span>
              : <button disabled={left <= 0} onClick={() => book(r.id)}>Reservar</button>}
          </article>
        )
      })}
    </section>
  )
}

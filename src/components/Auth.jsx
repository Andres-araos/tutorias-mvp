import { useState } from 'react'
import { supabase } from '../supabase'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ email: '', password: '', full_name: '', role: 'estudiante' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg('')
    const { error, data } = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password })
      : await supabase.auth.signUp({
          email: f.email, password: f.password,
          options: { data: { full_name: f.full_name, role: f.role } },
        })
    setBusy(false)
    if (error) setMsg(error.message)
    else if (mode === 'signup' && !data.session) setMsg('Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.')
  }

  return (
    <div className="auth">
      <h1>Tutorías</h1>
      <p className="muted">Encuentra o publica tutorías académicas.</p>
      <form onSubmit={submit} className="card">
        {mode === 'signup' && (
          <>
            <label>Nombre completo<input required value={f.full_name} onChange={set('full_name')} /></label>
            <label>Soy
              <select value={f.role} onChange={set('role')}>
                <option value="estudiante">Estudiante</option>
                <option value="tutor">Tutor</option>
              </select>
            </label>
          </>
        )}
        <label>Correo<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>Contraseña<input type="password" minLength={6} required value={f.password} onChange={set('password')} /></label>
        {msg && <p className="msg">{msg}</p>}
        <button disabled={busy}>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
        <button type="button" className="ghost" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg('') }}>
          {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
        </button>
      </form>
    </div>
  )
}

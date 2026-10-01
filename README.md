# Tutorías — MVP (Taller "Operación Rescate")

App web para organizar tutorías académicas. Stack: React + Vite + Supabase (Auth, Postgres, RLS).

## Puesta en marcha
1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega y ejecuta `supabase/schema.sql`.
3. (Recomendado para la demo) En **Authentication > Providers > Email**, desactiva "Confirm email".
4. Copia `.env.example` a `.env` y completa la URL y la anon key (Project Settings > API).
5. `npm install` y `npm run dev`.

## Funcionalidades (Product Backlog)
| Código | Historia de usuario | Archivo principal |
|---|---|---|
| APP-01 | Registrarme e iniciar sesión | `src/components/Auth.jsx` |
| APP-02 | Ver y editar mi perfil y rol | `src/components/Profile.jsx` |
| APP-03 | Publicar una tutoría (tutor) | `src/components/NewSession.jsx` |
| APP-04 | Listar y buscar tutorías | `src/components/Sessions.jsx` |
| APP-05 | Reservar un cupo | `Sessions.jsx` + trigger `check_booking` |
| APP-06 | Ver y cancelar mis reservas | `src/components/MyBookings.jsx` |
| APP-07 | Calificar una tutoría pasada | `MyBookings.jsx` |
| APP-08 | Ver inscritos y promedio (tutor) | `src/components/TutorPanel.jsx` |

Detalle y criterios de aceptación: `docs/BACKLOG.md`. Flujo de trazabilidad: `docs/TRAZABILIDAD.md`.

## Seguridad
RLS activo en todas las tablas: cada estudiante solo ve sus reservas, el tutor solo ve las inscripciones de sus tutorías, y el rol no se puede cambiar desde el cliente.

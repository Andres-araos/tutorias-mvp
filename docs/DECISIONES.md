# Decisiones técnicas

Registro de decisiones reales del código, útiles para defender el MVP en la sustentación.

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| El cupo se valida con un trigger en Postgres (`check_booking`) | Evita que dos estudiantes reserven el último cupo a la vez; el cliente no se puede saltar la regla | Validar solo en React (se evade con una llamada directa a la API) |
| Seguridad por filas (RLS) en las tres tablas | Cada estudiante solo ve sus reservas y el tutor solo las de sus tutorías, sin backend propio | Un servidor intermedio (más código para un MVP) |
| El rol solo se define al registrarse y no se puede editar | `revoke update` + `grant update (full_name, bio)`: nadie se vuelve tutor desde el cliente | Permitir editar el perfil completo |
| Vista `sessions_open` con cupos ocupados | Los estudiantes no pueden leer reservas ajenas por RLS; la vista expone solo el conteo | Dar lectura de todas las reservas (filtra datos) |
| Reservas canceladas se reactivan con `upsert` | La restricción `unique(session_id, student_id)` impide duplicados y permite volver a reservar | Borrar la reserva al cancelar (se pierde el historial) |
| Perfil creado por trigger al registrarse | El perfil existe aunque la confirmación de correo retrase el primer login | Insertarlo desde el cliente tras el signUp (falla sin sesión) |

## Limitaciones conocidas (para decirlas con honestidad)
- No hay notificaciones por correo ni recordatorios.
- Un tutor no puede editar ni cancelar una tutoría desde la interfaz (las políticas ya lo permiten).
- No hay pruebas automatizadas; se validó manualmente.

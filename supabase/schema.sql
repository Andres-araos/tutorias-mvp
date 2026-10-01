-- Esquema del MVP de tutorías. Ejecutar completo en Supabase > SQL Editor.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'estudiante' check (role in ('estudiante','tutor')),
  bio text default '',
  created_at timestamptz default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  title text not null,
  description text default '',
  starts_at timestamptz not null,
  capacity int not null default 5 check (capacity between 1 and 50),
  created_at timestamptz default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'activa' check (status in ('activa','cancelada')),
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (session_id, student_id)
);

-- Perfil automático al registrarse (APP-01 / APP-02)
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1)),
    case when new.raw_user_meta_data->>'role' = 'tutor' then 'tutor' else 'estudiante' end
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reglas de reserva: cupo y no reservar la propia tutoría (APP-05)
create function public.check_booking() returns trigger
language plpgsql security definer set search_path = '' as $$
declare s public.sessions; taken int;
begin
  if new.status <> 'activa' then return new; end if;
  select * into s from public.sessions where id = new.session_id;
  if s.tutor_id = new.student_id then
    raise exception 'No puedes reservar tu propia tutoría';
  end if;
  select count(*) into taken from public.bookings
    where session_id = new.session_id and status = 'activa' and id <> new.id;
  if taken >= s.capacity then raise exception 'La tutoría no tiene cupos disponibles'; end if;
  return new;
end $$;
create trigger bookings_check before insert or update of status on public.bookings
  for each row execute function public.check_booking();

-- Vista con cupos ocupados (APP-04)
create view public.sessions_open as
  select s.*, p.full_name as tutor_name,
    (select count(*) from public.bookings b where b.session_id = s.id and b.status = 'activa')::int as taken
  from public.sessions s join public.profiles p on p.id = s.tutor_id;
grant select on public.sessions_open to authenticated;

-- Seguridad (RLS)
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.bookings enable row level security;

create policy "perfiles visibles" on public.profiles for select to authenticated using (true);
create policy "editar mi perfil" on public.profiles for update to authenticated using (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (full_name, bio) on public.profiles to authenticated;

create policy "tutorías visibles" on public.sessions for select to authenticated using (true);
create policy "tutor publica" on public.sessions for insert to authenticated
  with check (tutor_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'tutor'));
create policy "tutor edita las suyas" on public.sessions for update to authenticated using (tutor_id = auth.uid());
create policy "tutor borra las suyas" on public.sessions for delete to authenticated using (tutor_id = auth.uid());

create policy "ver reservas propias o de mis tutorías" on public.bookings for select to authenticated
  using (student_id = auth.uid() or exists (select 1 from public.sessions s where s.id = session_id and s.tutor_id = auth.uid()));
create policy "reservar" on public.bookings for insert to authenticated with check (student_id = auth.uid());
create policy "actualizar mi reserva" on public.bookings for update to authenticated using (student_id = auth.uid());

-- ============================================================
-- Seguridad: Row Level Security (RLS) para Bazzi Chicken
-- Ejecutar completo en: Supabase Dashboard -> SQL Editor -> New query
--
-- Por que: la app es un sitio estatico que habla directo con Supabase
-- usando la "anon key", que es publica por diseno (viaja en el
-- navegador de cualquier visitante). Sin RLS, esa key sola alcanza
-- para leer y ESCRIBIR cualquier fila de la tabla. El login del panel
-- /admin es solo una pantalla en React: la proteccion real vive aca.
-- ============================================================

-- 1. Activar RLS en la tabla de productos
alter table public.productos enable row level security;

-- 2. Permite re-ejecutar este script sin error si ya corriste una version antes
drop policy if exists "productos_select_publico" on public.productos;
drop policy if exists "productos_select_admin"    on public.productos;
drop policy if exists "productos_insert_admin"    on public.productos;
drop policy if exists "productos_update_admin"    on public.productos;
drop policy if exists "productos_delete_admin"    on public.productos;

-- 3. Visitantes del sitio (anon): solo ven productos disponibles
create policy "productos_select_publico"
  on public.productos
  for select
  to anon
  using (disponible = true);

-- 4. Panel admin (usuario logueado): ve todo, incluidos los inactivos
create policy "productos_select_admin"
  on public.productos
  for select
  to authenticated
  using (true);

-- 5. Escribir (crear/editar/borrar) SOLO si estas logueado en /admin
create policy "productos_insert_admin"
  on public.productos
  for insert
  to authenticated
  with check (true);

create policy "productos_update_admin"
  on public.productos
  for update
  to authenticated
  using (true)
  with check (true);

create policy "productos_delete_admin"
  on public.productos
  for delete
  to authenticated
  using (true);


-- ============================================================
-- Seguridad: bucket de Storage "productos" (fotos de productos)
-- ============================================================

drop policy if exists "productos_storage_select_publico" on storage.objects;
drop policy if exists "productos_storage_insert_admin"    on storage.objects;
drop policy if exists "productos_storage_update_admin"    on storage.objects;
drop policy if exists "productos_storage_delete_admin"    on storage.objects;

-- Lectura publica de las fotos (se necesita para mostrarlas en el menu)
create policy "productos_storage_select_publico"
  on storage.objects
  for select
  to public
  using (bucket_id = 'productos');

-- Solo el admin logueado puede subir, reemplazar o borrar fotos
create policy "productos_storage_insert_admin"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'productos');

create policy "productos_storage_update_admin"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'productos');

create policy "productos_storage_delete_admin"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'productos');

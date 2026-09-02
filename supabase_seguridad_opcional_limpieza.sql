-- ============================================================
-- OPCIONAL - no urgente, no es un problema de seguridad.
--
-- Tu proyecto quedo con politicas duplicadas: las que ya existian
-- de antes ("productos: update admin", "productos: insert admin",
-- "productos: delete admin") y las que agrego supabase_seguridad.sql
-- ("productos_update_admin", "productos_insert_admin",
-- "productos_delete_admin"). Ambas hacen exactamente lo mismo
-- (restringir a usuarios autenticados), asi que no hay ningun hueco
-- de seguridad - es solo prolijidad.
--
-- Si en algun momento quieres dejarlo con una sola version de cada
-- politica, corre esto en el SQL Editor:
-- ============================================================

drop policy if exists "productos: update admin" on public.productos;
drop policy if exists "productos: insert admin" on public.productos;
drop policy if exists "productos: delete admin" on public.productos;

-- Verificacion: deberian quedar exactamente 5 politicas
select policyname, cmd, roles
from pg_policies
where tablename = 'productos'
order by cmd;

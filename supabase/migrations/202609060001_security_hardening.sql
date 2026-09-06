-- =============================================================================
-- 👑 INVENTIVE QUEEN — SECURITY HARDENING MIGRATION
-- Hardens Row Level Security (RLS) and enforces payment integrity at database level
-- =============================================================================

-- 1. Drop permissive order update policy
drop policy if exists "Users can update own orders during payment" on public.orders;

-- 2. Grant Admins full update permissions on orders
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- 3. Trigger Function: Prevent non-admin users from tampering with payment and status fields
create or replace function public.enforce_order_security_integrity()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Allow if administrator or executing inside verified payment confirmation RPC
  if public.is_admin() or current_setting('app.payment_verification_in_progress', true) = 'true' then
    return new;
  end if;

  -- Prevent tampering with sensitive order fields
  if old.payment_status != new.payment_status and new.payment_status = 'paid' then
    raise exception 'Security violation: Unauthorized payment status escalation.';
  end if;

  if old.amount_total != new.amount_total then
    raise exception 'Security violation: Order total amount cannot be modified after creation.';
  end if;

  if old.status != new.status and new.status in ('confirmed', 'crafting', 'shipped', 'delivered') then
    raise exception 'Security violation: Order fulfillment status can only be transitioned by store admins.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_order_security on public.orders;
create trigger trg_enforce_order_security
  before update on public.orders
  for each row execute function public.enforce_order_security_integrity();

-- 4. Atomic Security Definer Function to mark orders as verified and paid
create or replace function public.confirm_order_payment(
  p_order_id uuid,
  p_payment_id text,
  p_user_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows_affected integer;
begin
  -- Set transaction-local setting so integrity trigger permits verified payment confirmation
  perform set_config('app.payment_verification_in_progress', 'true', true);

  update public.orders
  set payment_status = 'paid',
      status = 'confirmed',
      payment_id = p_payment_id,
      updated_at = now()
  where id = p_order_id
    and (p_user_id is null or user_id = p_user_id)
    and payment_status != 'paid';

  get diagnostics v_rows_affected = row_count;
  return v_rows_affected > 0;
end;
$$;

-- Grant execution to authenticated users and anon for server-side verification
grant execute on function public.confirm_order_payment(uuid, text, uuid) to authenticated, anon;

-- 5. Lock down Product ID Counters to Admins only
drop policy if exists "Allow updating counters via RPC or admin" on public.product_id_counters;
create policy "Allow updating counters via RPC or admin"
  on public.product_id_counters
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 6. Lock down Storage Bucket (cms-images) upload and update strictly to Admins
drop policy if exists "Admins can upload to cms-images" on storage.objects;
create policy "Admins can upload to cms-images"
  on storage.objects
  for insert
  with check (bucket_id = 'cms-images' and public.is_admin());

drop policy if exists "Admins can update cms-images" on storage.objects;
create policy "Admins can update cms-images"
  on storage.objects
  for update
  using (bucket_id = 'cms-images' and public.is_admin());

drop policy if exists "Admins can delete from cms-images" on storage.objects;
create policy "Admins can delete from cms-images"
  on storage.objects
  for delete
  using (bucket_id = 'cms-images' and public.is_admin());

alter table public.cms_products
  add column if not exists original_price text,
  add column if not exists selling_price text,
  add column if not exists discount_percent integer,
  add column if not exists is_new_arrival boolean not null default false,
  add column if not exists new_arrival_days integer not null default 30,
  add column if not exists new_arrival_started_at timestamptz;

create table if not exists public.product_id_counters (
  category text primary key,
  last_number integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.product_id_counters enable row level security;

drop policy if exists "Admins can view product id counters" on public.product_id_counters;
create policy "Admins can view product id counters"
  on public.product_id_counters
  for select
  to authenticated
  using (private.is_admin());

drop policy if exists "Admins can update product id counters" on public.product_id_counters;
create policy "Admins can update product id counters"
  on public.product_id_counters
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

insert into public.product_id_counters (category, last_number)
select prefix, max(number_value)
from (
  select
    substring(id from '^IQ-([A-Z]{3})-[0-9]{3,}$') as prefix,
    substring(id from '^IQ-[A-Z]{3}-([0-9]{3,})$')::integer as number_value
  from public.cms_products
  where id ~ '^IQ-[A-Z]{3}-[0-9]{3,}$'
) existing_ids
where prefix is not null
  and number_value is not null
group by prefix
on conflict (category) do update
set last_number = greatest(public.product_id_counters.last_number, excluded.last_number),
    updated_at = now();

create or replace function public.reserve_product_id(product_type text)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  prefix text;
  next_number integer;
begin
  prefix := case lower(coalesce(product_type, ''))
    when 'doll' then 'DOL'
    when 'keychain' then 'KCH'
    when 'bouquet' then 'FLW'
    when 'teddy' then 'PLS'
    when 'bookmark' then 'ACC'
    else upper(left(regexp_replace(coalesce(product_type, 'ITM'), '[^a-zA-Z0-9]', '', 'g') || 'ITM', 3))
  end;

  insert into public.product_id_counters (category, last_number)
  values (prefix, 1)
  on conflict (category) do update
    set last_number = public.product_id_counters.last_number + 1,
        updated_at = now()
  returning last_number into next_number;

  return 'IQ-' || prefix || '-' || lpad(next_number::text, 3, '0');
end;
$$;

grant execute on function public.reserve_product_id(text) to authenticated;
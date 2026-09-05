-- =============================================================================
-- 👑 INVENTIVE QUEEN ROYAL ATELIER — COMPLETE MASTER DATABASE SCHEMA
-- =============================================================================
-- Includes:
-- 1. Profiles & Admin Authorization (profiles, admin_users)
-- 2. Products CMS & Dynamic ID Generation (cms_products, product_id_counters)
-- 3. Checkout Orders & Item Pipeline (orders, order_items)
-- 4. Centralized Storefront CMS Settings (site_settings: reviews, coupons, inventory, announcements)
-- 5. Public Storage Bucket for Product Media (cms-images)
-- 6. Row Level Security (RLS) & Strict Role-Based Access Control
-- 7. Automatic Timestamps & User Creation Triggers
-- 8. Complete Seed Data for Immediate Production Launch
-- =============================================================================

-- Enable standard cryptographic extension for UUID generation
create extension if not exists "pgcrypto";

-- =============================================================================
-- SECTION 1: HELPER FUNCTIONS & ROLE CHECKS
-- =============================================================================

-- Function: Check if currently authenticated user is an administrator
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- Function: Automatically maintain updated_at timestamps
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- SECTION 2: PROFILES & ADMIN USERS
-- =============================================================================

-- Table: User Profiles (linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Table: Admin Users (grants access to Executive CMS Portal)
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Trigger: Automatically create profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = case when public.profiles.full_name is null or public.profiles.full_name = '' then excluded.full_name else public.profiles.full_name end,
      phone = case when public.profiles.phone is null or public.profiles.phone = '' then excluded.phone else public.profiles.phone end,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: Updated_at for profiles
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- SECTION 3: PRODUCTS CMS & ATOMIC ID GENERATION
-- =============================================================================

-- Table: Category sequence counters for deterministic sequential IDs
create table if not exists public.product_id_counters (
  category text primary key,
  last_number integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Table: Products CMS (Master catalog for dolls, bouquets, plushies, keychains)
create table if not exists public.cms_products (
  id text primary key,
  name text not null,
  price text not null,
  original_price text,
  selling_price text,
  discount_percent integer,
  type text not null default 'doll' check (type in ('doll', 'bouquet', 'keychain', 'plushie', 'misc')),
  size text,
  tagline text not null default '',
  description text not null default '',
  images text[] not null default '{}',
  badge text,
  is_new_arrival boolean not null default false,
  new_arrival_days integer not null default 30,
  new_arrival_started_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: Updated_at for cms_products
drop trigger if exists set_cms_products_updated_at on public.cms_products;
create trigger set_cms_products_updated_at
  before update on public.cms_products
  for each row execute function public.set_updated_at();

-- RPC Function: Reserve next atomic product ID (e.g. IQ-DOL-001, IQ-FLW-002)
create or replace function public.reserve_product_id(product_type text)
returns text
language plpgsql
security definer
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
    when 'plushie' then 'PLS'
    when 'teddy' then 'PLS'
    when 'bookmark' then 'ACC'
    when 'misc' then 'ACC'
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

grant execute on function public.reserve_product_id(text) to authenticated, anon;

-- =============================================================================
-- SECTION 4: ORDERS & ORDER ITEMS PIPELINE
-- =============================================================================

-- Table: Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  pincode text not null,
  gift_note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'crafting', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_id text,
  amount_total numeric not null default 0,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: Updated_at for orders
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Table: Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  price_text text not null,
  unit_price numeric not null default 0,
  quantity integer not null default 1,
  image_url text,
  color text,
  flowers text[],
  custom text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- SECTION 5: CENTRALIZED SITE SETTINGS (REVIEWS, COUPONS, INVENTORY, STORE)
-- =============================================================================

-- Table: Site Settings (Polymorphic JSONB storage for CMS tabs)
create table if not exists public.site_settings (
  id text primary key,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Trigger: Updated_at for site_settings
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- =============================================================================
-- SECTION 6: STORAGE BUCKET (CMS IMAGES)
-- =============================================================================

-- Ensure the public bucket for product images exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-images',
  'cms-images',
  true,
  10485760, -- 10MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- =============================================================================
-- SECTION 7: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- 1. Profiles RLS
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- 2. Admin Users RLS
alter table public.admin_users enable row level security;

drop policy if exists "Users can check own admin status" on public.admin_users;
create policy "Users can check own admin status"
  on public.admin_users for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
  on public.admin_users for all
  using (public.is_admin())
  with check (public.is_admin());

-- 3. Product ID Counters RLS
alter table public.product_id_counters enable row level security;

drop policy if exists "Allow reading counters" on public.product_id_counters;
create policy "Allow reading counters"
  on public.product_id_counters for select
  using (true);

drop policy if exists "Allow updating counters via RPC or admin" on public.product_id_counters;
create policy "Allow updating counters via RPC or admin"
  on public.product_id_counters for all
  using (true)
  with check (true);

-- 4. CMS Products RLS
alter table public.cms_products enable row level security;

drop policy if exists "Public can browse active products" on public.cms_products;
create policy "Public can browse active products"
  on public.cms_products for select
  using (true);

drop policy if exists "Admins can insert products" on public.cms_products;
create policy "Admins can insert products"
  on public.cms_products for insert
  with check (public.is_admin());

drop policy if exists "Admins can update products" on public.cms_products;
create policy "Admins can update products"
  on public.cms_products for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.cms_products;
create policy "Admins can delete products"
  on public.cms_products for delete
  using (public.is_admin());

-- 5. Orders RLS
alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Authenticated users can create orders" on public.orders;
create policy "Authenticated users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can update own orders during payment" on public.orders;
create policy "Users can update own orders during payment"
  on public.orders for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete
  using (public.is_admin());

-- 6. Order Items RLS
alter table public.order_items enable row level security;

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Users can insert own order items" on public.order_items;
create policy "Users can insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Admins can manage order items" on public.order_items;
create policy "Admins can manage order items"
  on public.order_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- 7. Site Settings RLS
alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
  on public.site_settings for insert
  with check (public.is_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

-- 8. Storage Object Policies (cms-images bucket)
drop policy if exists "Public read for cms-images" on storage.objects;
create policy "Public read for cms-images"
  on storage.objects for select
  using (bucket_id = 'cms-images');

drop policy if exists "Admins can upload to cms-images" on storage.objects;
create policy "Admins can upload to cms-images"
  on storage.objects for insert
  with check (bucket_id = 'cms-images' and (auth.role() = 'authenticated' or public.is_admin()));

drop policy if exists "Admins can update cms-images" on storage.objects;
create policy "Admins can update cms-images"
  on storage.objects for update
  using (bucket_id = 'cms-images' and (auth.role() = 'authenticated' or public.is_admin()));

drop policy if exists "Admins can delete from cms-images" on storage.objects;
create policy "Admins can delete from cms-images"
  on storage.objects for delete
  using (bucket_id = 'cms-images' and public.is_admin());

-- =============================================================================
-- SECTION 8: PERFORMANCE INDEXES
-- =============================================================================

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_cms_products_type on public.cms_products(type);
create index if not exists idx_cms_products_is_active on public.cms_products(is_active);
create index if not exists idx_cms_products_sort_order on public.cms_products(sort_order);

-- =============================================================================
-- SECTION 9: INITIAL SEED DATA
-- =============================================================================

-- Seed 1: Default Storefront Announcement & Store Settings
insert into public.site_settings (id, settings)
values (
  'global',
  jsonb_build_object(
    'announcementBadge', '✨ Limited slots',
    'announcementText', '👑 Online Checkout with Razorpay is OPEN! Custom crochet made to order.',
    'announcementLink', '/how-to-order',
    'announcementLinkLabel', 'How to order →',
    'isStoreOpen', true,
    'storeNotice', '',
    'freeShippingThreshold', 1999,
    'supportPhone', '919876543210',
    'instagramHandle', '@inventivequeen'
  )
)
on conflict (id) do update
set settings = excluded.settings, updated_at = now();

-- Seed 2: Default Customer Testimonials & Reviews CMS
insert into public.site_settings (id, settings)
values (
  'reviews_cms',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'rev-1',
      'handle', '@ananya_r',
      'location', 'Mumbai',
      'text', 'The custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was in tears!',
      'rating', 5,
      'item', 'Custom Chibi Doll',
      'category', 'doll',
      'tag', 'Verified Order',
      'date', '2 weeks ago',
      'isApproved', true,
      'isFeatured', true
    ),
    jsonb_build_object(
      'id', 'rev-2',
      'handle', '@kavya_m',
      'location', 'Bengaluru',
      'text', 'The pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.',
      'rating', 5,
      'item', 'Signature Pastel Bouquet',
      'category', 'bouquet',
      'tag', 'Verified Order',
      'date', '1 month ago',
      'isApproved', true,
      'isFeatured', true
    ),
    jsonb_build_object(
      'id', 'rev-3',
      'handle', '@riya_s',
      'location', 'New Delhi',
      'text', 'Such a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!',
      'rating', 5,
      'item', 'Velvet Cuddle Bear',
      'category', 'plushie',
      'tag', 'Verified Order',
      'date', '3 weeks ago',
      'isApproved', true,
      'isFeatured', true
    ),
    jsonb_build_object(
      'id', 'rev-4',
      'handle', '@tanvi_p',
      'location', 'Hyderabad',
      'text', 'Ordered the Mixed Rose Grand Bouquet for my mother''s 50th birthday. She couldn''t believe they were crocheted by hand! The stems are wired so they sit gracefully in any vase.',
      'rating', 5,
      'item', 'Mixed Rose Grand Atelier Bouquet',
      'category', 'bouquet',
      'tag', 'Verified Order',
      'date', '1 month ago',
      'isApproved', true,
      'isFeatured', false
    )
  )
)
on conflict (id) do update
set settings = excluded.settings, updated_at = now();

-- Seed 3: Promotional Discount Coupons CMS
insert into public.site_settings (id, settings)
values (
  'coupons_cms',
  jsonb_build_array(
    jsonb_build_object(
      'code', 'ROYAL10',
      'discountType', 'percentage',
      'discountValue', 10,
      'minOrderValue', 999,
      'description', '10% off handcrafted creations on orders above ₹999',
      'isActive', true
    ),
    jsonb_build_object(
      'code', 'QUEEN200',
      'discountType', 'flat',
      'discountValue', 200,
      'minOrderValue', 1499,
      'description', 'Flat ₹200 royal blessing on orders above ₹1,499',
      'isActive', true
    ),
    jsonb_build_object(
      'code', 'ATELIER15',
      'discountType', 'percentage',
      'discountValue', 15,
      'minOrderValue', 2499,
      'description', '15% off bespoke bouquets & dolls above ₹2,499',
      'isActive', true
    )
  )
)
on conflict (id) do update
set settings = excluded.settings, updated_at = now();

-- Seed 4: Raw Materials & Yarn Supplies Inventory CMS
insert into public.site_settings (id, settings)
values (
  'inventory_cms',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'inv-1',
      'name', 'Milk Cotton Yarn — Royal Lilac',
      'category', 'yarn',
      'quantity', 14,
      'unit', 'spools',
      'minThreshold', 4,
      'colorHex', '#7E57C2',
      'costPerUnit', 95,
      'supplier', 'Vardhman Premium'
    ),
    jsonb_build_object(
      'id', 'inv-2',
      'name', 'Milk Cotton Yarn — Pastel Buttercup',
      'category', 'yarn',
      'quantity', 9,
      'unit', 'spools',
      'minThreshold', 4,
      'colorHex', '#FBBF24',
      'costPerUnit', 95,
      'supplier', 'Vardhman Premium'
    ),
    jsonb_build_object(
      'id', 'inv-3',
      'name', 'Milk Cotton Yarn — Baby Pink Blossom',
      'category', 'yarn',
      'quantity', 22,
      'unit', 'spools',
      'minThreshold', 5,
      'colorHex', '#F472B6',
      'costPerUnit', 95,
      'supplier', 'Ganga Soft'
    ),
    jsonb_build_object(
      'id', 'inv-4',
      'name', 'Milk Cotton Yarn — Sage Leaf Green',
      'category', 'yarn',
      'quantity', 3,
      'unit', 'spools',
      'minThreshold', 5,
      'colorHex', '#10B981',
      'costPerUnit', 95,
      'supplier', 'Ganga Soft'
    ),
    jsonb_build_object(
      'id', 'inv-5',
      'name', 'Safety Doll Eyes (9mm & 12mm)',
      'category', 'hardware',
      'quantity', 65,
      'unit', 'pairs',
      'minThreshold', 20,
      'costPerUnit', 8,
      'supplier', 'CraftSupplies Mumbai'
    ),
    jsonb_build_object(
      'id', 'inv-6',
      'name', 'Gold Swivel Clasp Keychain Rings',
      'category', 'hardware',
      'quantity', 48,
      'unit', 'pcs',
      'minThreshold', 15,
      'costPerUnit', 14,
      'supplier', 'CraftSupplies Mumbai'
    ),
    jsonb_build_object(
      'id', 'inv-7',
      'name', 'Royal Purple Wax Seal Beads',
      'category', 'acc',
      'quantity', 180,
      'unit', 'beads',
      'minThreshold', 50,
      'costPerUnit', 2,
      'supplier', 'Atelier Wax Co'
    ),
    jsonb_build_object(
      'id', 'inv-8',
      'name', 'Inventive Queen Custom Gift Boxes',
      'category', 'packaging',
      'quantity', 19,
      'unit', 'boxes',
      'minThreshold', 10,
      'costPerUnit', 45,
      'supplier', 'Crown Packagings'
    ),
    jsonb_build_object(
      'id', 'inv-9',
      'name', 'Luxury Satin Ribbon Rolls (Lilac)',
      'category', 'packaging',
      'quantity', 4,
      'unit', 'rolls',
      'minThreshold', 2,
      'costPerUnit', 85,
      'supplier', 'Ribbon Hub'
    )
  )
)
on conflict (id) do update
set settings = excluded.settings, updated_at = now();

-- Seed 5: Category ID Counters
insert into public.product_id_counters (category, last_number)
values
  ('DOL', 5),
  ('FLW', 8),
  ('KCH', 6),
  ('PLS', 5),
  ('ACC', 3)
on conflict (category) do update
set last_number = greatest(public.product_id_counters.last_number, excluded.last_number);

-- =============================================================================
-- INSTRUCTIONS FOR ADMIN ACCESS:
-- To grant admin rights to an authenticated user:
--   insert into public.admin_users (user_id) values ('<USER-UUID-FROM-AUTH.USERS>');
-- =============================================================================

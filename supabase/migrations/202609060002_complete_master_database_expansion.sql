-- =============================================================================
-- 👑 INVENTIVE QUEEN ROYAL ATELIER — COMPLETE MASTER DATABASE EXPANSION
-- Migration: 202609060002_complete_master_database_expansion.sql
-- =============================================================================

-- Enable cryptographic extension
create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. ENHANCE USER PROFILES TABLE
-- =============================================================================
alter table public.profiles
  add column if not exists avatar_id text default 'queen',
  add column if not exists patron_tier text default 'patron',
  add column if not exists default_gift_note text,
  add column if not exists is_phone_verified boolean default false;

-- =============================================================================
-- 2. USER ADDRESSES (MULTI-ADDRESS VAULT)
-- =============================================================================
create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null,
  street_address text not null,
  city_state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_addresses_user_id on public.user_addresses(user_id);

-- =============================================================================
-- 3. PRODUCT CATEGORIES MASTER
-- =============================================================================
create table if not exists public.product_categories (
  id text primary key,
  name text not null,
  tagline text not null default '',
  banner_image text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.product_categories (id, name, tagline, sort_order, is_active)
values
  ('doll', 'Keepsake Dolls', 'Hand-stitched custom amigurumi dolls crafted from reference photos', 1, true),
  ('bouquet', 'Everlasting Bouquets', 'Crochet floral arrangements with roses, tulips & daisies that never wilt', 2, true),
  ('plushie', 'Velvet Plushies', 'Huggable cuddly animals crafted with ultra-soft milk cotton yarn', 3, true),
  ('keychain', 'Pocket Charms', 'Charming pocket-sized amigurumi keychains for bags and gifts', 4, true),
  ('misc', 'Atelier Keepsakes', 'Artisan bookmarks, accessories and handcrafted treasures', 5, true)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- =============================================================================
-- 4. ORDERS & TRACKING ENHANCEMENTS
-- =============================================================================
alter table public.orders
  add column if not exists tracking_carrier text,
  add column if not exists tracking_number text,
  add column if not exists tracking_url text,
  add column if not exists estimated_delivery timestamptz,
  add column if not exists dispatched_at timestamptz,
  add column if not exists delivered_at timestamptz;

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_status_history_order_id on public.order_status_history(order_id);

-- =============================================================================
-- 5. DISCOUNT COUPONS & REDEMPTIONS ENGINE
-- =============================================================================
create table if not exists public.coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('percentage', 'flat')),
  discount_value numeric not null check (discount_value > 0),
  min_order_value numeric not null default 0,
  max_discount_cap numeric,
  description text not null default '',
  is_active boolean not null default true,
  usage_limit integer,
  usage_count integer not null default 0,
  per_user_limit integer not null default 1,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.coupons (code, discount_type, discount_value, min_order_value, description, is_active)
values
  ('ROYAL10', 'percentage', 10, 999, '10% off handcrafted creations on orders above ₹999', true),
  ('QUEEN200', 'flat', 200, 1499, 'Flat ₹200 royal blessing on orders above ₹1,499', true),
  ('ATELIER15', 'percentage', 15, 2499, '15% off bespoke bouquets & dolls above ₹2,499', true)
on conflict (code) do update set
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  min_order_value = excluded.min_order_value,
  description = excluded.description,
  is_active = excluded.is_active;

create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_code text not null references public.coupons(code) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  discount_applied numeric not null default 0,
  redeemed_at timestamptz not null default now()
);

create index if not exists idx_coupon_redemptions_user on public.coupon_redemptions(user_id, coupon_code);

-- =============================================================================
-- 6. CONTACT INQUIRIES & BESPOKE COMMISSIONS
-- =============================================================================
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  inquiry_type text not null default 'general' check (inquiry_type in ('custom_doll', 'bulk_bouquet', 'order_help', 'general')),
  message text not null,
  reference_image_urls text[] not null default '{}',
  status text not null default 'new' check (status in ('new', 'in_discussion', 'quote_sent', 'resolved', 'spam')),
  artisan_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_inquiries_status on public.contact_inquiries(status);

-- =============================================================================
-- 7. CUSTOMER REVIEWS & TESTIMONIALS
-- =============================================================================
create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  product_id text references public.cms_products(id) on delete set null,
  author_name text not null,
  author_handle text,
  location text not null default 'India',
  rating smallint not null default 5 check (rating >= 1 and rating <= 5),
  item_name text not null default 'Custom Creation',
  category text not null default 'doll' check (category in ('doll', 'bouquet', 'plushie', 'keychain', 'misc')),
  review_text text not null,
  photos text[] not null default '{}',
  is_approved boolean not null default false,
  is_featured boolean not null default false,
  artisan_reply text,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_approved on public.reviews(is_approved, is_featured);

-- Seed initial approved reviews
insert into public.reviews (author_name, author_handle, location, rating, item_name, category, review_text, is_approved, is_featured)
values
  ('Ananya R.', '@ananya_r', 'Mumbai', 5, 'Custom Chibi Doll', 'doll', 'The custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was in tears!', true, true),
  ('Kavya M.', '@kavya_m', 'Bengaluru', 5, 'Signature Pastel Bouquet', 'bouquet', 'The pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.', true, true),
  ('Riya S.', '@riya_s', 'New Delhi', 5, 'Velvet Cuddle Bear', 'plushie', 'Such a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!', true, true),
  ('Tanvi P.', '@tanvi_p', 'Hyderabad', 5, 'Mixed Rose Grand Atelier Bouquet', 'bouquet', 'Ordered the Mixed Rose Grand Bouquet for my mother''s 50th birthday. She couldn''t believe they were crocheted by hand! The stems are wired so they sit gracefully in any vase.', true, true)
on conflict do nothing;

-- =============================================================================
-- 8. WORKSHOP SUPPLIES & RAW MATERIALS INVENTORY
-- =============================================================================
create table if not exists public.inventory_items (
  id text primary key,
  name text not null,
  category text not null check (category in ('yarn', 'hardware', 'packaging', 'acc')),
  quantity numeric not null default 0,
  unit text not null default 'spools',
  min_threshold numeric not null default 5,
  cost_per_unit numeric not null default 0,
  supplier text,
  color_hex text,
  updated_at timestamptz not null default now()
);

insert into public.inventory_items (id, name, category, quantity, unit, min_threshold, cost_per_unit, supplier, color_hex)
values
  ('inv-1', 'Milk Cotton Yarn — Royal Lilac', 'yarn', 14, 'spools', 4, 95, 'Vardhman Premium', '#7E57C2'),
  ('inv-2', 'Milk Cotton Yarn — Pastel Buttercup', 'yarn', 9, 'spools', 4, 95, 'Vardhman Premium', '#FBBF24'),
  ('inv-3', 'Milk Cotton Yarn — Baby Pink Blossom', 'yarn', 22, 'spools', 5, 95, 'Ganga Soft', '#F472B6'),
  ('inv-4', 'Milk Cotton Yarn — Sage Leaf Green', 'yarn', 3, 'spools', 5, 95, 'Ganga Soft', '#10B981'),
  ('inv-5', 'Safety Doll Eyes (9mm & 12mm)', 'hardware', 65, 'pairs', 20, 8, 'CraftSupplies Mumbai', null),
  ('inv-6', 'Gold Swivel Clasp Keychain Rings', 'hardware', 40, 'pieces', 15, 12, 'CraftSupplies Mumbai', null),
  ('inv-7', 'Bespoke Wax Seal Stamp & Lilac Wax Beads', 'packaging', 80, 'seals', 25, 6, 'RoyalStationers', '#9333EA'),
  ('inv-8', 'Polyfill Organic Fiberfill Stuffing', 'yarn', 8.5, 'kg', 2.0, 180, 'EcoFiber Surat', null)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  quantity = excluded.quantity,
  unit = excluded.unit,
  min_threshold = excluded.min_threshold,
  cost_per_unit = excluded.cost_per_unit,
  supplier = excluded.supplier,
  color_hex = excluded.color_hex;

-- =============================================================================
-- 9. WISHLISTS & CROSS-DEVICE PERSISTENT CART
-- =============================================================================
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.cms_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists idx_wishlists_user on public.wishlists(user_id);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  price_text text not null,
  unit_price numeric not null default 0,
  quantity integer not null default 1 check (quantity > 0),
  image_url text,
  custom_options jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists idx_cart_items_user on public.cart_items(user_id);

-- =============================================================================
-- 10. FAQS & KNOWLEDGE BASE
-- =============================================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.faqs (category, question, answer, sort_order, is_active)
values
  ('ordering', 'How do I place a custom order?', 'Choose any item or reach out via our contact page with your reference photo and details. We will confirm the design, size, colors, and turnaround before crafting begins.', 1, true),
  ('crafting', 'How long does each order take?', 'Most custom pieces take 1–2 weeks depending on stitch complexity and our current queue. Express rush crafting may be possible upon inquiry.', 2, true),
  ('customization', 'What kind of pieces can you craft?', 'We specialize in custom amigurumi dolls, anime characters, everlasting floral bouquets, and pocket charms. Send a photo and we will recreate it stitch by stitch!', 3, true),
  ('shipping', 'Do you ship nationwide across India?', 'Yes! All orders are securely wrapped in bubble cushioning, scented with lavender, sealed with royal wax, and dispatched with insured tracking nationwide.', 4, true),
  ('payments', 'What payment methods do you accept?', 'We accept UPI, Credit/Debit cards, Net Banking, and Wallets securely via Razorpay with 256-bit encryption.', 5, true)
on conflict do nothing;

-- =============================================================================
-- 11. AUDIT LOGS (ADMIN ACTIVITY MONITORING)
-- =============================================================================
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource text not null,
  resource_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- =============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS across all new tables
alter table public.user_addresses enable row level security;
alter table public.product_categories enable row level security;
alter table public.order_status_history enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.inventory_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.cart_items enable row level security;
alter table public.faqs enable row level security;
alter table public.audit_logs enable row level security;

-- user_addresses: Patrons manage their own addresses; Admins can read for delivery
drop policy if exists "Users can view own addresses" on public.user_addresses;
create policy "Users can view own addresses"
  on public.user_addresses for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can insert own addresses" on public.user_addresses;
create policy "Users can insert own addresses"
  on public.user_addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own addresses" on public.user_addresses;
create policy "Users can update own addresses"
  on public.user_addresses for update
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can delete own addresses" on public.user_addresses;
create policy "Users can delete own addresses"
  on public.user_addresses for delete
  using (auth.uid() = user_id or public.is_admin());

-- product_categories: Public read active, Admin full control
drop policy if exists "Public can view active product categories" on public.product_categories;
create policy "Public can view active product categories"
  on public.product_categories for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage product categories" on public.product_categories;
create policy "Admins manage product categories"
  on public.product_categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- order_status_history: Patrons can view their order history; Admins full control
drop policy if exists "Users can view history of their orders" on public.order_status_history;
create policy "Users can view history of their orders"
  on public.order_status_history for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_status_history.order_id and o.user_id = auth.uid()
    ) or public.is_admin()
  );

drop policy if exists "Admins can insert status history" on public.order_status_history;
create policy "Admins can insert status history"
  on public.order_status_history for insert
  with check (public.is_admin());

-- coupons: Public can read active coupons, Admins full control
drop policy if exists "Public can view active coupons" on public.coupons;
create policy "Public can view active coupons"
  on public.coupons for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage coupons" on public.coupons;
create policy "Admins manage coupons"
  on public.coupons for all
  using (public.is_admin())
  with check (public.is_admin());

-- coupon_redemptions: Users can view own redemptions; Admins manage
drop policy if exists "Users view own coupon redemptions" on public.coupon_redemptions;
create policy "Users view own coupon redemptions"
  on public.coupon_redemptions for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "System and users can insert coupon redemptions" on public.coupon_redemptions;
create policy "System and users can insert coupon redemptions"
  on public.coupon_redemptions for insert
  with check (auth.uid() = user_id or public.is_admin());

-- contact_inquiries: Anyone can submit an inquiry; Only admins can read/update
drop policy if exists "Anyone can submit contact inquiry" on public.contact_inquiries;
create policy "Anyone can submit contact inquiry"
  on public.contact_inquiries for insert
  with check (true);

drop policy if exists "Admins can view and manage inquiries" on public.contact_inquiries;
create policy "Admins can view and manage inquiries"
  on public.contact_inquiries for all
  using (public.is_admin())
  with check (public.is_admin());

-- reviews: Public can view approved reviews; Users can insert; Admins manage
drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews"
  on public.reviews for select
  using (is_approved = true or public.is_admin());

drop policy if exists "Authenticated users can submit reviews" on public.reviews;
create policy "Authenticated users can submit reviews"
  on public.reviews for insert
  with check (auth.uid() is not null or public.is_admin());

drop policy if exists "Admins manage all reviews" on public.reviews;
create policy "Admins manage all reviews"
  on public.reviews for all
  using (public.is_admin())
  with check (public.is_admin());

-- inventory_items: Admin only access
drop policy if exists "Admins manage workshop inventory" on public.inventory_items;
create policy "Admins manage workshop inventory"
  on public.inventory_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- wishlists: Patrons manage their own wishlist
drop policy if exists "Users manage own wishlist" on public.wishlists;
create policy "Users manage own wishlist"
  on public.wishlists for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

-- cart_items: Patrons manage their own persistent cart
drop policy if exists "Users manage own cart" on public.cart_items;
create policy "Users manage own cart"
  on public.cart_items for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id);

-- faqs: Public read active; Admin manage
drop policy if exists "Public can view active FAQs" on public.faqs;
create policy "Public can view active FAQs"
  on public.faqs for select
  using (is_active = true or public.is_admin());

drop policy if exists "Admins manage FAQs" on public.faqs;
create policy "Admins manage FAQs"
  on public.faqs for all
  using (public.is_admin())
  with check (public.is_admin());

-- audit_logs: Admin only
drop policy if exists "Admins can view audit logs" on public.audit_logs;
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

drop policy if exists "Admins can create audit logs" on public.audit_logs;
create policy "Admins can create audit logs"
  on public.audit_logs for insert
  with check (public.is_admin());

-- =============================================================================
-- 13. REALTIME REPLICATION REFRESH
-- =============================================================================
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    execute 'alter publication supabase_realtime add table public.orders, public.order_items, public.reviews, public.inventory_items, public.contact_inquiries';
  end if;
exception
  when duplicate_object then null;
  when others then null;
end $$;

-- =============================================================================
-- 14. HELPER STORED PROCEDURES
-- =============================================================================

-- Redeem coupon atomically
create or replace function public.redeem_coupon(p_coupon_code text, p_order_id uuid, p_discount_applied numeric)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon record;
  v_user_id uuid := auth.uid();
begin
  select * into v_coupon from public.coupons where code = upper(p_coupon_code) and is_active = true;
  if not found then
    return jsonb_build_object('success', false, 'message', 'Coupon is invalid or inactive');
  end if;

  if v_coupon.usage_limit is not null and v_coupon.usage_count >= v_coupon.usage_limit then
    return jsonb_build_object('success', false, 'message', 'Coupon usage limit has been reached');
  end if;

  -- Record redemption
  insert into public.coupon_redemptions (coupon_code, order_id, user_id, discount_applied)
  values (v_coupon.code, p_order_id, v_user_id, p_discount_applied);

  -- Increment usage counter
  update public.coupons
  set usage_count = usage_count + 1
  where code = v_coupon.code;

  return jsonb_build_object('success', true, 'message', 'Coupon redeemed successfully');
end;
$$;

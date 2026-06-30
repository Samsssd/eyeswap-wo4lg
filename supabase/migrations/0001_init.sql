-- EyeSwap — initial schema (idempotent)
-- All tables are prefixed with the app id "app_bfefc9d2".

-- ── Users / photographer profiles ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_bfefc9d2_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now()
);

-- ── Portfolio items (products) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_bfefc9d2_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  currency text DEFAULT 'EUR',
  image_url text,
  category text,
  status text DEFAULT 'draft',
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ── Messages (in-app messaging between users) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_bfefc9d2_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id text NOT NULL,
  receiver_id text NOT NULL,
  product_id uuid,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ── Orders (bookings / payments) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.app_bfefc9d2_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id text NOT NULL,
  seller_id text NOT NULL,
  product_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ── Grants ─────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_bfefc9d2_users TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_bfefc9d2_products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_bfefc9d2_messages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_bfefc9d2_orders TO anon, authenticated;

-- ── Row Level Security (permissive — client-driven marketplace) ────────────
ALTER TABLE public.app_bfefc9d2_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_bfefc9d2_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_bfefc9d2_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_bfefc9d2_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_all" ON public.app_bfefc9d2_users;
CREATE POLICY "users_all" ON public.app_bfefc9d2_users
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "products_all" ON public.app_bfefc9d2_products;
CREATE POLICY "products_all" ON public.app_bfefc9d2_products
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "messages_all" ON public.app_bfefc9d2_messages;
CREATE POLICY "messages_all" ON public.app_bfefc9d2_messages
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "orders_all" ON public.app_bfefc9d2_orders;
CREATE POLICY "orders_all" ON public.app_bfefc9d2_orders
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

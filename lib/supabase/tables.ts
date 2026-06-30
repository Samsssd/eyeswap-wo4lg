/**
 * Single source of truth for every Supabase table name used by EyeSwap.
 * All names are prefixed with the app id "app_bfefc9d2_".
 * Never type a raw table-name string elsewhere — import from here.
 */
export const TABLES = {
  users: 'app_bfefc9d2_users',
  products: 'app_bfefc9d2_products',
  messages: 'app_bfefc9d2_messages',
  orders: 'app_bfefc9d2_orders',
} as const;

export type UserRow = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
};

export type ProductRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number | string;
  currency: string | null;
  image_url: string | null;
  category: string | null;
  status: string | null;
  stock: number | null;
  created_at: string;
};

export type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id: string | null;
  content: string;
  created_at: string;
};

export type OrderRow = {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  amount: number | string;
  currency: string;
  status: string | null;
  created_at: string;
};

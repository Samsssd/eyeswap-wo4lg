import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { TABLES, type OrderRow } from '@/lib/supabase/tables';
import { orderInsertSchema, type OrderInsert } from '@/lib/schemas';

interface OrdersState {
  orders: OrderRow[];
  loading: boolean;
  error: string | null;
  createOrder: (payload: OrderInsert) => Promise<OrderRow | null>;
  markPaid: (orderId: string) => Promise<void>;
  fetchOrders: (userId: string) => Promise<OrderRow[]>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  createOrder: async (payload) => {
    set({ error: null });
    try {
      const parsed = orderInsertSchema.parse(payload);
      const { data, error } = await supabase
        .from(TABLES.orders)
        .insert({
          buyer_id: parsed.buyer_id,
          seller_id: parsed.seller_id,
          product_id: parsed.product_id,
          amount: parsed.amount,
          currency: parsed.currency,
          status: 'pending',
        })
        .select()
        .single();
      if (error) throw error;
      const row = data as OrderRow;
      set((state) => ({ orders: [row, ...state.orders] }));
      return row;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  markPaid: async (orderId) => {
    set({ error: null });
    try {
      const { data, error } = await supabase
        .from(TABLES.orders)
        .update({ status: 'paid' })
        .eq('id', orderId)
        .select()
        .single();
      if (error) throw error;
      const row = data as OrderRow;
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? row : o)),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  fetchOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from(TABLES.orders)
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const rows = (data as OrderRow[]) ?? [];
      set({ orders: rows, loading: false });
      return rows;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      return [];
    }
  },
}));

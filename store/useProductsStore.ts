import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { TABLES, type ProductRow, type UserRow } from '@/lib/supabase/tables';
import { productInsertSchema, type ProductInsert } from '@/lib/schemas';

export type ProductWithPhotographer = ProductRow & {
  photographer: UserRow | null;
};

export interface ProductFilters {
  status?: string;
  category?: string;
  search?: string;
}

interface ProductsState {
  products: ProductWithPhotographer[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<ProductWithPhotographer | null>;
  fetchByOwner: (user_id: string) => Promise<ProductRow[]>;
  createProduct: (data: ProductInsert, user_id: string) => Promise<ProductRow | null>;
  updateProduct: (id: string, data: Partial<ProductInsert>) => Promise<void>;
  setStatus: (id: string, status: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (filters) => {
    set({ loading: true, error: null });
    try {
      let query = supabase.from(TABLES.products).select('*');

      // Public feed defaults to active items only.
      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'active');
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data: rows, error } = await query;
      if (error) throw error;

      const products = (rows as ProductRow[]) ?? [];

      // Join photographer profile data (no FK in DB — merge in JS).
      const userIds = [...new Set(products.map((p) => p.user_id))];
      const photographerMap = new Map<string, UserRow>();
      if (userIds.length) {
        const { data: users } = await supabase
          .from(TABLES.users)
          .select('*')
          .in('user_id', userIds);
        (users as UserRow[] | null)?.forEach((u) => photographerMap.set(u.user_id, u));
      }

      const merged: ProductWithPhotographer[] = products.map((p) => ({
        ...p,
        photographer: photographerMap.get(p.user_id) ?? null,
      }));

      set({ products: merged, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      const { data: product, error } = await supabase
        .from(TABLES.products)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const row = product as ProductRow;

      const { data: user } = await supabase
        .from(TABLES.users)
        .select('*')
        .eq('user_id', row.user_id)
        .single();

      return { ...row, photographer: (user as UserRow) ?? null };
    } catch {
      return null;
    }
  },

  fetchByOwner: async (user_id) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.products)
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ProductRow[]) ?? [];
    } catch {
      return [];
    }
  },

  createProduct: async (data, user_id) => {
    set({ error: null });
    try {
      const parsed = productInsertSchema.parse(data);
      const { data: row, error } = await supabase
        .from(TABLES.products)
        .insert({
          user_id,
          name: parsed.name,
          description: parsed.description ?? null,
          price: parsed.price,
          currency: parsed.currency ?? 'EUR',
          image_url: parsed.image_url ?? null,
          category: parsed.category ?? null,
          status: parsed.status ?? 'draft',
          stock: parsed.stock ?? 0,
        })
        .select()
        .single();
      if (error) throw error;
      return row as ProductRow;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  updateProduct: async (id, data) => {
    set({ error: null });
    try {
      const { error } = await supabase.from(TABLES.products).update(data).eq('id', id);
      if (error) throw error;
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  setStatus: async (id, status) => {
    set({ error: null });
    try {
      const { error } = await supabase
        .from(TABLES.products)
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));

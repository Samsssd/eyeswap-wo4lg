import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { TABLES, type MessageRow } from '@/lib/supabase/tables';
import { messageSchema, type MessageInsert } from '@/lib/schemas';

interface MessagesState {
  messages: MessageRow[];
  loading: boolean;
  error: string | null;
  fetchMessages: (userId: string) => Promise<MessageRow[]>;
  fetchThread: (currentUserId: string, otherUserId: string) => Promise<MessageRow[]>;
  sendMessage: (senderId: string, payload: MessageInsert) => Promise<MessageRow | null>;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: [],
  loading: false,
  error: null,

  fetchMessages: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from(TABLES.messages)
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const rows = (data as MessageRow[]) ?? [];
      set({ messages: rows, loading: false });
      return rows;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      return [];
    }
  },

  fetchThread: async (currentUserId, otherUserId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from(TABLES.messages)
        .select('*')
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),` +
            `and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`,
        )
        .order('created_at', { ascending: true });
      if (error) throw error;
      const rows = (data as MessageRow[]) ?? [];
      set({ messages: rows, loading: false });
      return rows;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      return [];
    }
  },

  sendMessage: async (senderId, payload) => {
    set({ error: null });
    try {
      const parsed = messageSchema.parse(payload);
      const { data, error } = await supabase
        .from(TABLES.messages)
        .insert({
          sender_id: senderId,
          receiver_id: parsed.receiver_id,
          content: parsed.content,
          product_id: parsed.product_id ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      const row = data as MessageRow;
      set((state) => ({ messages: [...state.messages, row] }));
      return row;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },
}));

import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { TABLES, type UserRow } from '@/lib/supabase/tables';
import { profileSchema, type ProfileUpdate } from '@/lib/schemas';

/** Minimal shape we need from a Clerk user to upsert a profile row. */
export interface ClerkUserInfo {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

interface UsersState {
  profiles: UserRow[];
  currentProfile: UserRow | null;
  loading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  ensureCurrentUser: (clerkUser: ClerkUserInfo) => Promise<UserRow | null>;
  updateProfile: (user_id: string, partial: ProfileUpdate) => Promise<UserRow | null>;
  getProfileByUserId: (user_id: string) => Promise<UserRow | null>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,

  fetchProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from(TABLES.users)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ profiles: (data as UserRow[]) ?? [], loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  ensureCurrentUser: async (clerkUser) => {
    set({ error: null });
    try {
      const { data, error } = await supabase
        .from(TABLES.users)
        .upsert(
          {
            user_id: clerkUser.id,
            email: clerkUser.email,
            full_name: clerkUser.full_name ?? null,
            avatar_url: clerkUser.avatar_url ?? null,
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single();
      if (error) throw error;
      const row = data as UserRow;
      set((state) => ({
        currentProfile: row,
        profiles: state.profiles.some((p) => p.user_id === row.user_id)
          ? state.profiles.map((p) => (p.user_id === row.user_id ? row : p))
          : [row, ...state.profiles],
      }));
      return row;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  updateProfile: async (user_id, partial) => {
    set({ error: null });
    try {
      const parsed = profileSchema.parse(partial);
      const { data, error } = await supabase
        .from(TABLES.users)
        .update(parsed)
        .eq('user_id', user_id)
        .select()
        .single();
      if (error) throw error;
      const row = data as UserRow;
      set((state) => ({
        currentProfile: row,
        profiles: state.profiles.map((p) => (p.user_id === user_id ? row : p)),
      }));
      return row;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  getProfileByUserId: async (user_id) => {
    // Check local cache first.
    const cached = get().profiles.find((p) => p.user_id === user_id);
    if (cached) return cached;
    try {
      const { data, error } = await supabase
        .from(TABLES.users)
        .select('*')
        .eq('user_id', user_id)
        .single();
      if (error) throw error;
      return data as UserRow;
    } catch {
      return null;
    }
  },
}));

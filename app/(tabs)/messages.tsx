import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, View } from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { useMessagesStore } from '@/store/useMessagesStore';
import { useUsersStore } from '@/store/useUsersStore';
import { supabase } from '@/lib/supabase/client';
import { TABLES, type UserRow, type MessageRow } from '@/lib/supabase/tables';
import { clockTime } from '@/lib/format';

interface Thread {
  otherUserId: string;
  otherUser: UserRow | null;
  lastMessage: MessageRow;
}

export default function MessagesScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { messages, loading, fetchMessages } = useMessagesStore();
  const { profiles } = useUsersStore();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = user?.id;

  const buildThreads = useCallback(async () => {
    if (!currentUserId) return;
    const rows = await fetchMessages(currentUserId);

    // Group messages by the other participant.
    const map = new Map<string, MessageRow>();
    for (const m of rows) {
      const otherId = m.sender_id === currentUserId ? m.receiver_id : m.sender_id;
      const existing = map.get(otherId);
      if (!existing || new Date(m.created_at) > new Date(existing.created_at)) {
        map.set(otherId, m);
      }
    }

    // Fetch the profile rows for each conversation partner.
    const otherIds = [...map.keys()];
    const profileMap = new Map<string, UserRow>();
    const cached = [...profiles];
    const toFetch = otherIds.filter((id) => !cached.find((p) => p.user_id === id));
    if (toFetch.length) {
      const { data } = await supabase
        .from(TABLES.users)
        .select('*')
        .in('user_id', toFetch);
      (data as UserRow[] | null)?.forEach((u) => profileMap.set(u.user_id, u));
    }
    cached.forEach((u) => profileMap.set(u.user_id, u));

    const built: Thread[] = [...map.entries()]
      .map(([otherUserId, lastMessage]) => ({
        otherUserId,
        otherUser: profileMap.get(otherUserId) ?? null,
        lastMessage,
      }))
      .sort(
        (a, b) =>
          new Date(b.lastMessage.created_at).getTime() -
          new Date(a.lastMessage.created_at).getTime(),
      );

    setThreads(built);
  }, [currentUserId, fetchMessages, profiles]);

  useEffect(() => {
    if (currentUserId) buildThreads();
  }, [currentUserId, buildThreads]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await buildThreads();
    setRefreshing(false);
  }, [buildThreads]);

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  const renderItem = ({ item }: { item: Thread }) => {
    const name = item.otherUser?.full_name || 'Utilisateur';
    const avatar = item.otherUser?.avatar_url;
    const isMe = item.lastMessage.sender_id === currentUserId;

    return (
      <Pressable
        onPress={() => router.push(`/conversation/${item.otherUserId}`)}
        className="mb-3 flex-row items-center gap-3.5 rounded-2xl bg-white p-3.5 active:opacity-90">
        {avatar ? (
          <Image source={{ uri: avatar }} className="h-12 w-12 rounded-full" resizeMode="cover" />
        ) : (
          <View className="h-12 w-12 items-center justify-center rounded-full bg-paper">
            <Ionicons name="person" size={20} color="#9ca3af" />
          </View>
        )}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-semibold text-base text-ink" numberOfLines={1}>
              {name}
            </Text>
            <Text className="font-sans text-[11px] text-neutral-400">
              {clockTime(item.lastMessage.created_at)}
            </Text>
          </View>
          <Text className="mt-0.5 text-sm text-neutral-500" numberOfLines={1}>
            {isMe ? 'Vous : ' : ''}
            {item.lastMessage.content}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-paper">
      <Header title="Messages" />
      <FlatList
        data={threads}
        keyExtractor={(item) => item.otherUserId}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5A3C" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon="chatbubble-ellipses-outline"
              title="Aucune conversation"
              message="Contactez un photographe depuis une prestation pour démarrer une discussion."
              action={
                <View className="w-56">
                  <Button label="Découvrir des prestations" onPress={() => router.push('/')} />
                </View>
              }
            />
          )
        }
      />
    </View>
  );
}

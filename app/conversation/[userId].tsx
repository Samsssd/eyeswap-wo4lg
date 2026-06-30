import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  FlatList,
  Image,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { useMessagesStore } from '@/store/useMessagesStore';
import { useUsersStore } from '@/store/useUsersStore';
import { clockTime } from '@/lib/format';
import type { MessageRow } from '@/lib/supabase/tables';

export default function ConversationScreen() {
  const { userId: otherUserId } = useLocalSearchParams<{ userId: string }>();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { messages, loading, fetchThread, sendMessage } = useMessagesStore();
  const { getProfileByUserId } = useUsersStore();
  const [otherName, setOtherName] = useState('Utilisateur');
  const [otherAvatar, setOtherAvatar] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = user?.id;

  const load = useCallback(async () => {
    if (!currentUserId || !otherUserId) return;
    await fetchThread(currentUserId, otherUserId);
    const profile = await getProfileByUserId(otherUserId);
    if (profile) {
      setOtherName(profile.full_name || 'Utilisateur');
      setOtherAvatar(profile.avatar_url ?? null);
    }
  }, [currentUserId, otherUserId, fetchThread, getProfileByUserId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const onSend = useCallback(async () => {
    if (!draft.trim() || !currentUserId || !otherUserId) return;
    setSending(true);
    const content = draft.trim();
    setDraft('');
    await sendMessage(currentUserId, {
      receiver_id: otherUserId,
      content,
    });
    setSending(false);
  }, [draft, currentUserId, otherUserId, sendMessage]);

  const ordered = useMemo(() => messages, [messages]);

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  const renderMessage = ({ item, index }: { item: MessageRow; index: number }) => {
    const isMe = item.sender_id === currentUserId;
    const prev = ordered[index - 1];
    const showTime = !prev || new Date(item.created_at).getTime() - new Date(prev.created_at).getTime() > 5 * 60 * 1000;

    return (
      <View className="mb-1">
        {showTime ? (
          <Text className="mb-1.5 mt-2 text-center text-[11px] text-neutral-400">
            {clockTime(item.created_at)}
          </Text>
        ) : null}
        <View className={`flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
          <View
            className={`max-w-[78%] px-4 py-2.5 ${
              isMe ? 'rounded-2xl rounded-br-md bg-coral' : 'rounded-2xl rounded-bl-md bg-white'
            }`}>
            <Text className={`text-[15px] ${isMe ? 'text-white' : 'text-ink'}`}>{item.content}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-paper">
      <Header
        showBack
        title={otherName}
        right={
          otherAvatar ? (
            <Image source={{ uri: otherAvatar }} className="h-9 w-9 rounded-full" resizeMode="cover" />
          ) : (
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <Ionicons name="person" size={18} color="#9ca3af" />
            </View>
          )
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
        className="flex-1">
        <FlatList
          data={ordered}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5A3C" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            loading ? null : (
              <EmptyState
                icon="chatbubble-ellipses-outline"
                title="Démarrez la conversation"
                message="Envoyez un premier message à ce photographe."
              />
            )
          }
        />

        <View className="flex-row items-center gap-2.5 border-t border-neutral-200 bg-white px-4 py-3">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Écrivez un message…"
            placeholderTextColor="#9ca3af"
            multiline
            className="max-h-28 min-h-[44px] flex-1 rounded-2xl bg-paper px-4 py-3 font-sans text-[15px] text-ink"
          />
          <Pressable
            onPress={onSend}
            disabled={!draft.trim() || sending}
            className={`h-11 w-11 items-center justify-center rounded-full ${
              draft.trim() && !sending ? 'bg-coral' : 'bg-neutral-200'
            }`}>
            <Ionicons name="send" size={18} color={draft.trim() && !sending ? '#fff' : '#9ca3af'} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

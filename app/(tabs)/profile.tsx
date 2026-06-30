import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth, useUser, useClerk } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ProductCard } from '@/components/ProductCard';
import { useUsersStore } from '@/store/useUsersStore';
import { useProductsStore, type ProductWithPhotographer } from '@/store/useProductsStore';
import { pickAndUploadImage } from '@/lib/storage/upload';
import type { ProductRow } from '@/lib/supabase/tables';

export default function ProfileScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { currentProfile, ensureCurrentUser, updateProfile, error } = useUsersStore();
  const { fetchByOwner } = useProductsStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [myProducts, setMyProducts] = useState<ProductWithPhotographer[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Sync the local form fields with the loaded profile.
  useEffect(() => {
    if (currentProfile) {
      setFullName(currentProfile.full_name ?? '');
      setPhone(currentProfile.phone ?? '');
      setAvatarUrl(currentProfile.avatar_url ?? null);
    }
  }, [currentProfile]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    if (!currentProfile) {
      await ensureCurrentUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        full_name: user.fullName,
        avatar_url: user.imageUrl,
      });
    }
  }, [user, currentProfile, ensureCurrentUser]);

  const loadProducts = useCallback(async () => {
    if (!user) return;
    setLoadingProducts(true);
    const rows = await fetchByOwner(user.id);
    setMyProducts(
      rows.map((p: ProductRow) => ({
        ...p,
        photographer: currentProfile ? { ...currentProfile } : null,
      })),
    );
    setLoadingProducts(false);
  }, [user, fetchByOwner, currentProfile]);

  useEffect(() => {
    loadProfile();
    loadProducts();
  }, [loadProfile, loadProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadProducts()]);
    setRefreshing(false);
  }, [loadProfile, loadProducts]);

  const onAvatarUpload = useCallback(async () => {
    setUploading(true);
    try {
      const url = await pickAndUploadImage();
      setAvatarUrl(url);
    } catch {
      // user cancelled or upload failed — keep existing avatar
    } finally {
      setUploading(false);
    }
  }, []);

  const onSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    await updateProfile(user.id, {
      full_name: fullName,
      phone,
      avatar_url: avatarUrl ?? undefined,
    });
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }, [user, fullName, phone, avatarUrl, updateProfile]);

  const onSignOut = useCallback(() => {
    signOut();
    router.replace('/');
  }, [signOut]);

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-1 bg-paper">
      <Header
        title="Profil"
        right={
          <Pressable onPress={onSignOut} hitSlop={12} className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons name="log-out-outline" size={20} color="#FF5A3C" />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5A3C" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}>
        {/* Avatar + identity */}
        <View className="mb-6 items-center">
          <Pressable onPress={onAvatarUpload} disabled={uploading} className="relative">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} className="h-24 w-24 rounded-full" resizeMode="cover" />
            ) : (
              <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
                {uploading ? (
                  <ActivityIndicator color="#FF5A3C" />
                ) : (
                  <Ionicons name="person" size={36} color="#9ca3af" />
                )}
              </View>
            )}
            <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-paper bg-coral">
              <Ionicons name="camera" size={15} color="#fff" />
            </View>
          </Pressable>
          <Text className="mt-3 font-sans-bold text-lg text-ink">
            {currentProfile?.full_name || 'Votre profil'}
          </Text>
          <Text className="text-sm text-neutral-500">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Edit form */}
        <View className="mb-2 gap-4 rounded-3xl bg-white p-5">
          <Text className="font-sans-semibold text-base text-ink">Informations</Text>
          <TextField
            label="Nom complet"
            icon="person-outline"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Votre nom"
          />
          <TextField
            label="Téléphone"
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <Button
            label={savedFlash ? 'Enregistré ✓' : 'Enregistrer'}
            onPress={onSave}
            loading={saving}
          />
          {error ? <Text className="text-center text-xs text-coral">{error}</Text> : null}
        </View>

        {/* My portfolio */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="font-sans-bold text-lg text-ink">Mes prestations</Text>
          <Pressable
            onPress={() => router.push('/product/new')}
            className="flex-row items-center gap-1.5 rounded-full bg-coral px-4 py-2">
            <Ionicons name="add" size={18} color="#fff" />
            <Text className="font-sans-semibold text-sm text-white">Ajouter</Text>
          </Pressable>
        </View>

        {loadingProducts ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#FF5A3C" />
          </View>
        ) : myProducts.length === 0 ? (
          <EmptyState
            icon="camera-outline"
            title="Aucune prestation"
            message="Ajoutez votre première prestation pour apparaître dans le fil d'actualité."
            action={
              <View className="w-56">
                <Button label="Créer une prestation" onPress={() => router.push('/product/new')} />
              </View>
            }
          />
        ) : (
          <FlatList
            data={myProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />
        )}
      </ScrollView>
    </View>
  );
}

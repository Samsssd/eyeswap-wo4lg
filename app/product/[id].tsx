import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { useProductsStore, type ProductWithPhotographer } from '@/store/useProductsStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { createCheckoutSession } from '@/lib/payments/checkout';
import { formatPrice, CATEGORY_LABELS, timeAgo } from '@/lib/format';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { fetchProductById } = useProductsStore();
  const { createOrder } = useOrdersStore();

  const [product, setProduct] = useState<ProductWithPhotographer | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const p = await fetchProductById(id);
    setProduct(p);
    setLoading(false);
  }, [id, fetchProductById]);

  useEffect(() => {
    load();
  }, [load]);

  const onContact = useCallback(() => {
    if (!product?.user_id) return;
    router.push(`/conversation/${product.user_id}`);
  }, [product]);

  const onBook = useCallback(async () => {
    if (!product || !user) {
      setBookingError('Vous devez être connecté pour réserver.');
      return;
    }
    setBooking(true);
    setBookingError(null);
    try {
      const order = await createOrder({
        buyer_id: user.id,
        seller_id: product.user_id,
        product_id: product.id,
        amount: Number(product.price),
        currency: product.currency || 'EUR',
      });
      if (!order) {
        throw new Error('Impossible de créer la commande.');
      }
      const url = await createCheckoutSession({
        amount: Number(product.price),
        currency: product.currency || 'EUR',
        productName: product.name,
        orderId: order.id,
      });
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      setBookingError((e as Error).message);
    } finally {
      setBooking(false);
    }
  }, [product, user, createOrder]);

  if (loading) {
    return (
      <View className="flex-1 bg-paper">
        <Header showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF5A3C" />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-paper">
        <Header showBack />
        <EmptyState
          icon="alert-circle-outline"
          title="Prestation introuvable"
          message="Cette prestation n'existe plus ou a été retirée."
          action={
            <View className="w-48">
              <Button label="Retour" onPress={() => router.back()} />
            </View>
          }
        />
      </View>
    );
  }

  const photographer = product.photographer;
  const isOwner = user?.id === product.user_id;

  return (
    <View className="flex-1 bg-paper">
      <Header
        showBack
        right={
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Ionicons name="share-outline" size={18} color="#101013" />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero image */}
        <View className="px-5">
          <View className="overflow-hidden rounded-3xl">
            <Image
              source={{ uri: product.image_url || FALLBACK_IMAGE }}
              className="h-80 w-full"
              resizeMode="cover"
            />
            {product.category ? (
              <View className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1">
                <Text className="font-sans-semibold text-[11px] uppercase tracking-wider text-white">
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Title + price */}
        <View className="mt-5 px-5">
          <Text className="font-sans-extrabold text-2xl text-ink">{product.name}</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Text className="font-sans-bold text-xl text-coral">
              {formatPrice(Number(product.price), product.currency || 'EUR')}
            </Text>
            {product.stock ? (
              <View className="rounded-full bg-neutral-200 px-2.5 py-0.5">
                <Text className="font-sans-medium text-[11px] text-neutral-600">
                  {product.stock} dispo
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Photographer card */}
        <View className="mt-5 px-5">
          <Pressable
            onPress={onContact}
            className="flex-row items-center gap-3.5 rounded-2xl bg-white p-4 active:opacity-90">
            {photographer?.avatar_url ? (
              <Image source={{ uri: photographer.avatar_url }} className="h-12 w-12 rounded-full" resizeMode="cover" />
            ) : (
              <View className="h-12 w-12 items-center justify-center rounded-full bg-paper">
                <Ionicons name="camera" size={20} color="#101013" />
              </View>
            )}
            <View className="flex-1">
              <Text className="font-sans-semibold text-base text-ink">
                {photographer?.full_name || 'Photographe'}
              </Text>
              <Text className="text-sm text-neutral-500">Photographe · EyeSwap</Text>
            </View>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-paper">
              <Ionicons name="chatbubble-outline" size={17} color="#FF5A3C" />
            </View>
          </Pressable>
        </View>

        {/* Description */}
        {product.description ? (
          <View className="mt-5 px-5">
            <Text className="font-sans-semibold text-base text-ink mb-2">À propos de cette prestation</Text>
            <Text className="text-[15px] leading-relaxed text-neutral-600">{product.description}</Text>
          </View>
        ) : null}

        {/* Meta */}
        <View className="mt-5 px-5">
          <View className="flex-row items-center gap-2 text-neutral-400">
            <Ionicons name="time-outline" size={14} color="#9ca3af" />
            <Text className="text-xs text-neutral-400">Publié {timeAgo(product.created_at)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom action bar */}
      {!isOwner ? (
        <View
          className="absolute inset-x-0 bottom-0 flex-row gap-3 border-t border-neutral-200 bg-white px-5 pt-3"
          style={{ paddingBottom: 32 }}>
          <Pressable
            onPress={onContact}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-neutral-200 py-4 active:opacity-90">
            <Ionicons name="chatbubble-outline" size={18} color="#101013" />
            <Text className="font-sans-semibold text-base text-ink">Contacter</Text>
          </Pressable>
          <View className="flex-[1.3]">
            <Button label="Réserver" onPress={onBook} loading={booking} />
          </View>
        </View>
      ) : null}

      {bookingError ? (
        <View className="absolute inset-x-0 bottom-24 px-5">
          <View className="rounded-2xl bg-coral/10 px-4 py-3">
            <Text className="text-center text-sm text-coral">{bookingError}</Text>
          </View>
        </View>
      ) : null}

      {!isSignedIn && !isOwner ? (
        <View className="absolute inset-x-0 bottom-0 bg-white px-5 pt-3" style={{ paddingBottom: 32 }}>
          <Button label="Se connecter pour réserver" onPress={() => router.push('/sign-in')} />
        </View>
      ) : null}
    </View>
  );
}

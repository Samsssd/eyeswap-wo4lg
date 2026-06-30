import { Image, Pressable, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { formatPrice, CATEGORY_LABELS } from '@/lib/format';
import type { ProductWithPhotographer } from '@/store/useProductsStore';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80';

export function ProductCard({ product }: { product: ProductWithPhotographer }) {
  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable className="active:opacity-90">
        <View className="overflow-hidden rounded-3xl bg-white">
          <View className="relative">
            <Image
              source={{ uri: product.image_url || FALLBACK_IMAGE }}
              className="h-52 w-full"
              resizeMode="cover"
            />
            {product.category ? (
              <View className="absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1">
                <Text className="font-sans-semibold text-[11px] uppercase tracking-wider text-white">
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </Text>
              </View>
            ) : null}
            <View className="absolute bottom-3 right-3 rounded-full bg-coral px-3 py-1.5">
              <Text className="font-sans-bold text-sm text-white">
                {formatPrice(Number(product.price), product.currency || 'EUR')}
              </Text>
            </View>
          </View>

          <View className="gap-2 p-4">
            <Text className="font-sans-bold text-base leading-tight text-ink" numberOfLines={1}>
              {product.name}
            </Text>

            <View className="flex-row items-center gap-2">
              {product.photographer?.avatar_url ? (
                <Image
                  source={{ uri: product.photographer.avatar_url }}
                  className="h-6 w-6 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-6 w-6 items-center justify-center rounded-full bg-paper">
                  <Ionicons name="camera" size={13} color="#101013" />
                </View>
              )}
              <Text className="font-sans-medium text-[13px] text-neutral-500" numberOfLines={1}>
                {product.photographer?.full_name || 'Photographe'}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

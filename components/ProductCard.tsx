import { Image, Pressable, View } from 'react-native';
import { Link } from 'expo-router';

import { Text } from '@/components/Text';
import type { ProductWithPhotographer } from '@/store/useProductsStore';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80';

export function ProductCard({ product }: { product: ProductWithPhotographer }) {
  return (
    <Link href={`/product/${product.id}`} asChild>
      <Pressable className="active:opacity-90">
        <View className="flex-1 overflow-hidden rounded-3xl bg-white">
          <View className="relative">
            <Image
              source={{ uri: product.image_url || FALLBACK_IMAGE }}
              className="aspect-square w-full"
              resizeMode="cover"
            />
          </View>

          <View className="gap-1 p-4">
            <Text className="font-sans-bold text-base leading-tight text-ink" numberOfLines={1}>
              {product.name}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
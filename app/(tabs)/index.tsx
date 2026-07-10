import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { useProductsStore, type ProductWithPhotographer } from '@/store/useProductsStore';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/format';

function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2.5 rounded-full px-4 py-2.5 ${active ? 'bg-ink' : 'bg-white'}`}>
      <Text
        className={`font-sans-semibold text-sm ${active ? 'text-white' : 'text-neutral-600'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function SkeletonCard() {
  return (
    <View className="overflow-hidden rounded-3xl bg-white">
      <View className="aspect-square w-full animate-pulse bg-neutral-200" />
      <View className="gap-2 p-4">
        <View className="h-4 w-2/3 animate-pulse rounded-full bg-neutral-200" />
      </View>
    </View>
  );
}

const STATIC_DICTATORS = [
  {
    name: 'Kylian Mobutu',
    image: 'https://d2w5g74r7hbhjx.cloudfront.net/random_tests/mobutu.WEBP',
  },
  {
    name: 'Ousmane Pinochet',
    image: 'https://d2w5g74r7hbhjx.cloudfront.net/random_tests/ousmane_pinochet.jpg',
  },
  {
    name: 'Maréchal Deschamps',
    image: 'https://d2w5g74r7hbhjx.cloudfront.net/random_tests/deschamps.PNG',
  },
  {
    name: 'Bashar Al-Cherki',
    image: 'https://d2w5g74r7hbhjx.cloudfront.net/random_tests/cherki.PNG',
  },
];

function StaticDictatorCard({ name, image }: { name: string; image: string }) {
  return (
    <View className="w-1/2 px-2 mb-4">
      <View className="overflow-hidden rounded-3xl bg-white">
        <Image
          source={{ uri: image }}
          className="aspect-square w-full"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="font-sans-bold text-base leading-tight text-ink" numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
    </View>
  );
}

function GeneralKylianSection() {
  return (
    <View className="mb-6 overflow-hidden rounded-3xl bg-ink">
      <Image
        source={{ uri: 'https://d2w5g74r7hbhjx.cloudfront.net/random_tests/mobutu.WEBP' }}
        className="h-48 w-full"
        resizeMode="cover"
      />
      <View className="p-5">
        <View className="mb-2 flex-row items-center gap-2">
          <Text className="font-sans-bold text-xl text-white">
            Général Kylian
          </Text>
          <Text className="text-xl">🫡</Text>
        </View>
        <Text className="font-sans text-sm leading-relaxed text-white/80">
          En hommage à notre leader suprême, commandant en chef des dimensions et gardien du rond-point. Gloire et honneur à ses bottes.
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { products, loading, error, fetchProducts } = useProductsStore();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const columns = 2;

  // Debounce the search query.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(() => {
    fetchProducts({
      status: 'active',
      category: category ?? undefined,
      search: debounced || undefined,
    });
  }, [fetchProducts, category, debounced]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts({
      status: 'active',
      category: category ?? undefined,
      search: debounced || undefined,
    });
    setRefreshing(false);
  }, [fetchProducts, category, debounced]);

  const renderItem = ({ item }: { item: ProductWithPhotographer }) => (
    <View className="mb-4 px-2">
      <ProductCard product={item} />
    </View>
  );

  return (
    <View className="flex-1 bg-paper">
      <Header />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EF4444" />}
        numColumns={columns}
        key={columns}
        columnWrapperStyle={{ marginHorizontal: -2 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-2">
            {/* Hero title */}
            <View className="mb-5 mt-2">
              <Text className="font-sans-bold text-2xl text-ink">
                Trouvez votre dictateur
              </Text>
              <Text className="mt-1 font-sans text-sm text-neutral-500">
                Un dictateur sur mesure, partout près de chez vous.
              </Text>
            </View>

            {/* Search */}
            <View className="mb-4 flex-row items-center gap-3 rounded-2xl bg-white px-4">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Rechercher un dictateur…"
                placeholderTextColor="#9ca3af"
                className="flex-1 py-3.5 font-sans text-base text-ink"
              />
              {search ? (
                <Pressable hitSlop={12} onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </Pressable>
              ) : null}
            </View>

            {/* Category chips */}
            <View className="mb-6">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <CategoryChip
                  label="Tout"
                  active={category === null}
                  onPress={() => setCategory(null)}
                />
                {CATEGORIES.map((c) => (
                  <CategoryChip
                    key={c}
                    label={CATEGORY_LABELS[c]}
                    active={category === c}
                    onPress={() => setCategory(c)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* General Kylian */}
            <GeneralKylianSection />

            {/* Static dictator cards */}
            <View className="flex-row flex-wrap mx-[-8px] mb-6">
              {STATIC_DICTATORS.map((d) => (
                <StaticDictatorCard key={d.name} name={d.name} image={d.image} />
              ))}
            </View>

          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="flex-row flex-wrap">
              {[0, 1, 2, 3].map((i) => (
                <View key={i} className="w-1/2 px-2">
                  <SkeletonCard />
                  <View className="mb-4" />
                </View>
              ))}
            </View>
          ) : error ? (
            <View className="items-center py-16">
              <Text className="font-sans-bold text-lg text-ink">Oups</Text>
              <Text className="mt-2 text-center text-sm text-neutral-500">{error}</Text>
              <View className="mt-6 w-48">
                <Button label="Réessayer" onPress={load} />
              </View>
            </View>
          ) : (
            <EmptyState
              icon="images-outline"
              title="Aucune prestation trouvée"
              message="Essayez une autre catégorie ou un autre mot-clé."
            />
          )
        }
      />
    </View>
  );
}
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { useProductsStore } from '@/store/useProductsStore';
import { pickAndUploadImage } from '@/lib/storage/upload';
import { productInsertSchema } from '@/lib/schemas';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/format';

const CURRENCIES = ['EUR', 'USD', 'GBP'];
const STATUSES = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'active', label: 'Publié' },
  { value: 'archived', label: 'Archivé' },
];

function PillRow({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(active ? '' : opt.value)}
            className={`rounded-full px-4 py-2.5 ${active ? 'bg-coral' : 'bg-neutral-100'}`}>
            <Text className={`font-sans-medium text-sm ${active ? 'text-white' : 'text-neutral-600'}`}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function NewProductScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { createProduct, error: storeError } = useProductsStore();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [stock, setStock] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const onPickImage = useCallback(async () => {
    setUploading(true);
    try {
      const url = await pickAndUploadImage();
      setImageUrl(url);
    } catch {
      // user cancelled or upload failed — keep state
    } finally {
      setUploading(false);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    if (!user) return;
    setFormError(null);
    setErrors({});

    const result = productInsertSchema.safeParse({
      name,
      description: description || undefined,
      price: price ? Number(price) : undefined,
      currency,
      category: category || undefined,
      status,
      stock: stock ? Number(stock) : undefined,
      image_url: imageUrl || undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const product = await createProduct(result.data, user.id);
    setSubmitting(false);

    if (product) {
      router.back();
    } else {
      setFormError(storeError ?? 'Une erreur est survenue lors de la création.');
    }
  }, [user, name, description, price, currency, category, status, stock, imageUrl, createProduct, storeError]);

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-1 bg-paper">
      <Header showBack title="Nouvelle prestation" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}>
        {/* Image picker */}
        <Pressable onPress={onPickImage} disabled={uploading} className="mb-5 active:opacity-90">
          {imageUrl ? (
            <View className="relative">
              <Image source={{ uri: imageUrl }} className="h-52 w-full rounded-3xl" resizeMode="cover" />
              <View className="absolute bottom-3 right-3 flex-row items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5">
                <Ionicons name="swap-horizontal" size={14} color="#fff" />
                <Text className="font-sans-medium text-xs text-white">Changer</Text>
              </View>
            </View>
          ) : (
            <View className="h-52 items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 bg-white">
              {uploading ? (
                <View className="items-center gap-2">
                  <ActivityIndicator color="#FF5A3C" />
                  <Text className="text-sm text-neutral-500">Envoi en cours…</Text>
                </View>
              ) : (
                <View className="items-center gap-2">
                  <View className="h-14 w-14 items-center justify-center rounded-full bg-paper">
                    <Ionicons name="camera-outline" size={26} color="#FF5A3C" />
                  </View>
                  <Text className="font-sans-semibold text-sm text-neutral-600">Ajouter une photo</Text>
                  <Text className="text-xs text-neutral-400">Touchez pour choisir une image</Text>
                </View>
              )}
            </View>
          )}
        </Pressable>

        {/* Form card */}
        <View className="gap-5 rounded-3xl bg-white p-5">
          {/* Name */}
          <View className="gap-2">
            <Text className="font-sans-medium text-sm text-neutral-700">Nom de la prestation *</Text>
            <View className={`flex-row items-center rounded-2xl border px-4 ${errors.name ? 'border-coral' : 'border-neutral-200'}`}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Séance photo portrait"
                placeholderTextColor="#9ca3af"
                className="flex-1 py-3.5 font-sans text-base text-ink"
              />
            </View>
            {errors.name ? <Text className="text-xs text-coral">{errors.name}</Text> : null}
          </View>

          {/* Description */}
          <View className="gap-2">
            <Text className="font-sans-medium text-sm text-neutral-700">Description</Text>
            <View className={`rounded-2xl border px-4 ${errors.description ? 'border-coral' : 'border-neutral-200'}`}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez votre prestation…"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                className="py-3.5 font-sans text-base text-ink"
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />
            </View>
          </View>

          {/* Price + currency */}
          <View className="gap-2">
            <Text className="font-sans-medium text-sm text-neutral-700">Prix *</Text>
            <View className={`flex-row items-center rounded-2xl border px-4 ${errors.price ? 'border-coral' : 'border-neutral-200'}`}>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="150"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className="flex-1 py-3.5 font-sans text-base text-ink"
              />
              <Text className="font-sans-semibold text-neutral-400">€</Text>
            </View>
            {errors.price ? <Text className="text-xs text-coral">{errors.price}</Text> : null}
            <View className="mt-1">
              <Text className="mb-1.5 text-xs text-neutral-400">Devise</Text>
              <PillRow
                options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                value={currency}
                onChange={setCurrency}
              />
            </View>
          </View>

          {/* Category */}
          <View className="gap-2">
            <Text className="font-sans-medium text-sm text-neutral-700">Catégorie</Text>
            <PillRow
              options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] ?? c }))}
              value={category}
              onChange={setCategory}
            />
          </View>

          {/* Status */}
          <View className="gap-2">
            <Text className="font-sans-medium text-sm text-neutral-700">Statut</Text>
            <PillRow options={STATUSES} value={status} onChange={setStatus} />
          </View>

          {/* Stock */}
          <View className="gap-2">
            <Text className="font-sans-medium text-sm text-neutral-700">Disponibilités (stock)</Text>
            <View className="flex-row items-center rounded-2xl border border-neutral-200 px-4">
              <TextInput
                value={stock}
                onChangeText={setStock}
                placeholder="Illimité"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                className="flex-1 py-3.5 font-sans text-base text-ink"
              />
            </View>
          </View>
        </View>

        {/* Submit */}
        <View className="mt-5">
          <Button label="Publier la prestation" onPress={onSubmit} loading={submitting} />
          {formError ? (
            <Text className="mt-2 text-center text-sm text-coral">{formError}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

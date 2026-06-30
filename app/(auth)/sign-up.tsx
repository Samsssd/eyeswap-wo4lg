import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignUp } from '@clerk/expo/legacy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { BRAND_LOGO_URL } from '@/lib/format';
import { useUsersStore } from '@/store/useUsersStore';

const detailsSchema = z.object({
  full_name: z.string().min(2, 'Indiquez votre nom'),
  email: z.string().email('Adresse e-mail invalide'),
});
const codeSchema = z.object({
  code: z.string().min(6, 'Code à 6 chiffres'),
});

type DetailsForm = z.infer<typeof detailsSchema>;
type CodeForm = z.infer<typeof codeSchema>;

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const insets = useSafeAreaInsets();
  const ensureCurrentUser = useUsersStore((s) => s.ensureCurrentUser);

  const [step, setStep] = useState<'details' | 'code'>('details');
  const [pending, setPending] = useState<{ full_name: string; email: string }>({
    full_name: '',
    email: '',
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const detailsForm = useForm<DetailsForm>({ resolver: zodResolver(detailsSchema) });
  const codeForm = useForm<CodeForm>({ resolver: zodResolver(codeSchema) });

  async function startSignup(values: DetailsForm) {
    if (!isLoaded) return;
    setLoading(true);
    setServerError(null);
    try {
      await signUp.create({ emailAddress: values.email });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPending(values);
      setStep('code');
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message ?? 'Impossible de créer le compte.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(code: string) {
    if (!isLoaded) return;
    setLoading(true);
    setServerError(null);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === 'complete') {
        await setActive({ session: res.createdSessionId });
        await ensureCurrentUser({
          id: res.createdUserId as string,
          email: pending.email,
          full_name: pending.full_name,
        });
        router.replace('/(tabs)');
      } else {
        setServerError('Vérification incomplète, réessayez.');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message ?? 'Code incorrect.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-paper">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled">
          {/* Hero */}
          <View className="items-center px-6 pb-8">
            <Image
              source={{ uri: BRAND_LOGO_URL }}
              style={{ width: 64, height: 64, borderRadius: 18 }}
              resizeMode="contain"
            />
            <Text className="mt-5 font-sans-extrabold text-3xl tracking-tight text-ink">
              Rejoignez EyeSwap
            </Text>
            <Text className="mt-2 text-center text-base text-neutral-500">
              {step === 'details'
                ? 'Créez votre profil de photographe en quelques secondes'
                : 'Confirmez votre e-mail pour finaliser l’inscription'}
            </Text>
          </View>

          {/* Form */}
          <View className="px-6">
            {step === 'details' ? (
              <>
                <Controller
                  control={detailsForm.control}
                  name="full_name"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      label="Nom complet"
                      icon="person-outline"
                      placeholder="Jean Dupont"
                      value={value ?? ''}
                      onChangeText={onChange}
                      error={error?.message}
                    />
                  )}
                />
                <View className="h-4" />
                <Controller
                  control={detailsForm.control}
                  name="email"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      label="Adresse e-mail"
                      icon="mail-outline"
                      placeholder="vous@exemple.com"
                      value={value ?? ''}
                      onChangeText={onChange}
                      error={error?.message}
                      keyboardType="email-address"
                    />
                  )}
                />

                {serverError ? (
                  <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-coral/10 px-4 py-3">
                    <Ionicons name="alert-circle" size={18} color="#FF5A3C" />
                    <Text className="flex-1 text-sm text-coral">{serverError}</Text>
                  </View>
                ) : null}

                <View className="mt-6">
                  <Button
                    label="Créer mon compte"
                    loading={loading}
                    onPress={detailsForm.handleSubmit(startSignup)}
                  />
                </View>

                <Pressable
                  onPress={() => router.push('/sign-in')}
                  className="mt-6 flex-row items-center justify-center gap-1.5">
                  <Text className="text-sm text-neutral-500">Déjà un compte ?</Text>
                  <Text className="font-sans-bold text-sm text-coral">Se connecter</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Controller
                  control={codeForm.control}
                  name="code"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      label="Code de vérification"
                      icon="keypad-outline"
                      placeholder="123456"
                      value={value ?? ''}
                      onChangeText={onChange}
                      error={error?.message}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  )}
                />

                {serverError ? (
                  <View className="mt-4 flex-row items-center gap-2 rounded-2xl bg-coral/10 px-4 py-3">
                    <Ionicons name="alert-circle" size={18} color="#FF5A3C" />
                    <Text className="flex-1 text-sm text-coral">{serverError}</Text>
                  </View>
                ) : null}

                <View className="mt-6 gap-3">
                  <Button
                    label="Valider l’inscription"
                    loading={loading}
                    onPress={codeForm.handleSubmit((v) => verifyCode(v.code))}
                  />
                  <Button
                    label="Modifier mes infos"
                    variant="ghost"
                    loading={false}
                    onPress={() => {
                      setStep('details');
                      setServerError(null);
                      codeForm.reset();
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

import * as Linking from 'expo-linking';

/**
 * Create a Stripe Checkout session via this project's backend and return the
 * hosted checkout URL. The deep-link return paths are derived at runtime from
 * the app scheme so they work in Expo Go.
 *
 * Throws a clear Error if the backend is unreachable or returns no URL.
 */
export async function createCheckoutSession(params: {
  amount: number;
  currency: string;
  productName: string;
  orderId?: string;
}): Promise<string> {
  // Sanitize the base URL — a trailing space or slash makes the fetch URL
  // malformed and crashes iOS native networking.
  const apiUrl = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

  const successFull = Linking.createURL('merci');
  const cancelFull = Linking.createURL('annule');

  const scheme = successFull.split('://')[0];
  const successPath =
    successFull.split('://').slice(1).join('://') +
    (params.orderId ? `?orderId=${params.orderId}` : '');
  const cancelPath = cancelFull.split('://').slice(1).join('://');

  const res = await fetch(`${apiUrl}/api/mobile/stripe/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mobile-token': process.env.EXPO_PUBLIC_MOBILE_API_TOKEN ?? '',
    },
    body: JSON.stringify({
      appId: process.env.EXPO_PUBLIC_APP_ID,
      amount: params.amount,
      currency: params.currency,
      productName: params.productName,
      scheme,
      successPath,
      cancelPath,
    }),
  });

  if (!res.ok) {
    throw new Error('Impossible de créer la session de paiement.');
  }

  const data = await res.json();
  if (!data.url) {
    throw new Error('Aucune URL de paiement renvoyée.');
  }

  return data.url as string;
}

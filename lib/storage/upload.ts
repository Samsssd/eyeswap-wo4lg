import * as ImagePicker from 'expo-image-picker';

/**
 * Pick a single image from the library, then upload it to S3 via this
 * project's presign endpoint. Returns the public URL of the stored image.
 *
 * Throws a clear Error on any failure so callers can show inline feedback.
 */
export async function pickAndUploadImage(): Promise<string> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.length) {
    throw new Error('Aucune image sélectionnée.');
  }

  const asset = result.assets[0];
  const filename = asset.fileName ?? `eyeswap-${Date.now()}.jpg`;
  const contentType = asset.mimeType ?? 'image/jpeg';

  return uploadImage(asset.uri, filename, contentType);
}

/** Upload an already-resolved local image uri to S3 and return its public URL. */
export async function uploadImage(
  uri: string,
  filename: string,
  contentType: string,
): Promise<string> {
  // Sanitize the base URL — a trailing space or slash makes the fetch URL
  // malformed and crashes iOS native networking.
  const apiUrl = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');

  const presignRes = await fetch(`${apiUrl}/api/mobile/storage/presign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mobile-token': process.env.EXPO_PUBLIC_MOBILE_API_TOKEN ?? '',
    },
    body: JSON.stringify({
      appId: process.env.EXPO_PUBLIC_APP_ID,
      filename,
      contentType,
    }),
  });

  if (!presignRes.ok) {
    throw new Error("Impossible d'obtenir l'URL d'envoi du fichier.");
  }

  const presignData = await presignRes.json();
  if (!presignData.uploadUrl || !presignData.publicUrl) {
    throw new Error('Réponse de présignature invalide.');
  }

  // Read the local file as a blob and PUT it to S3 with the returned headers.
  const fileBlob = await (await fetch(uri)).blob();
  const putHeaders: Record<string, string> = {
    'Content-Type': contentType,
    ...(presignData.headers ?? {}),
  };

  const putRes = await fetch(presignData.uploadUrl as string, {
    method: 'PUT',
    headers: putHeaders,
    body: fileBlob,
  });

  if (!putRes.ok) {
    throw new Error("Échec de l'envoi du fichier.");
  }

  return presignData.publicUrl as string;
}

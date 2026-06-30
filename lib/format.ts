export const BRAND_LOGO_URL =
  'https://d2w5g74r7hbhjx.cloudfront.net/app_bfefc9d2/branding/logo/2b2725f2fa2caff5mr0k6k66.png';

/** Map ISO currency codes to a compact display symbol. */
export function formatPrice(amount: number, currency: string): string {
  const symbol =
    currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency + ' ';
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${symbol.trim()}`;
}

/** Short French relative-ish label for an ISO timestamp. */
export function timeAgo(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'à l’instant';
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const CATEGORY_LABELS: Record<string, string> = {
  mariage: 'Mariage',
  portrait: 'Portrait',
  evenement: 'Événement',
  produit: 'Produit',
  paysage: 'Paysage',
  immobilier: 'Immobilier',
  famille: 'Famille',
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS);

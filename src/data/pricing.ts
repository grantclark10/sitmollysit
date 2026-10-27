// Pricing and currency tiers. Kept free of image imports so Pages Functions
// (functions/) can import it alongside the Astro pages.

export type Tier = 'US' | 'UK' | 'EU';
export type PetCount = 1 | 2;
export type ProductSlug = 'studio-portrait';

export type PriceGrid<T> = Record<ProductSlug, Record<Tier, Record<PetCount, T>>>;

// ---------------------------------------------------------------------------
// TODO: launch prices, in minor units (cents / pence). Hardcoded per tier,
// never FX-converted. These are placeholders — set the real prices here AND
// on the matching Lemon Squeezy variants.
// ---------------------------------------------------------------------------
export const PRICES = {
  'studio-portrait': {
    US: { 1: 4900, 2: 6900 },
    UK: { 1: 3900, 2: 5500 },
    EU: { 1: 4500, 2: 6500 },
  },
} as const satisfies PriceGrid<number>;

// ---------------------------------------------------------------------------
// TODO: Lemon Squeezy variant IDs, one per (product × petCount × tier).
// Lemon Squeezy dashboard → Products → [product] → Variants → copy each ID.
// See README "Lemon Squeezy setup".
// ---------------------------------------------------------------------------
export const VARIANT_IDS = {
  'studio-portrait': {
    US: { 1: 'TODO_LS_STUDIO_US_1PET', 2: 'TODO_LS_STUDIO_US_2PET' },
    UK: { 1: 'TODO_LS_STUDIO_UK_1PET', 2: 'TODO_LS_STUDIO_UK_2PET' },
    EU: { 1: 'TODO_LS_STUDIO_EU_1PET', 2: 'TODO_LS_STUDIO_EU_2PET' },
  },
} as const satisfies PriceGrid<string>;

// ---------------------------------------------------------------------------

export interface TierConfig {
  currency: 'USD' | 'GBP' | 'EUR';
  locale: string;
  label: string;
}

export const TIERS: Record<Tier, TierConfig> = {
  US: { currency: 'USD', locale: 'en-US', label: 'USD' },
  UK: { currency: 'GBP', locale: 'en-GB', label: 'GBP' },
  EU: { currency: 'EUR', locale: 'en-IE', label: 'EUR' },
};

export const DEFAULT_TIER: Tier = 'US';
export const PET_COUNTS: readonly PetCount[] = [1, 2];

/** Cookie holding the visitor's chosen tier. Overrides country detection. */
export const TIER_COOKIE = 'sms_tier';

// Countries and territories that use the euro (EU eurozone plus the
// microstates and others that adopted it).
const EURO_COUNTRIES = new Set([
  'AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI',
  'SK', 'AD', 'MC', 'SM', 'VA', 'ME', 'XK', 'GP', 'MQ', 'GF', 'RE', 'YT', 'PM', 'BL', 'MF', 'AX',
]);
const GBP_COUNTRIES = new Set(['GB', 'IM', 'JE', 'GG']);

/** Maps an ISO 3166-1 alpha-2 country code (Cloudflare's request.cf.country) to a tier. */
export function tierForCountry(country: string | null | undefined): Tier {
  if (!country) return DEFAULT_TIER;
  const code = country.toUpperCase();
  if (GBP_COUNTRIES.has(code)) return 'UK';
  if (EURO_COUNTRIES.has(code)) return 'EU';
  return DEFAULT_TIER;
}

export function isTier(value: unknown): value is Tier {
  return value === 'US' || value === 'UK' || value === 'EU';
}

export function isProductSlug(value: unknown): value is ProductSlug {
  return typeof value === 'string' && Object.hasOwn(PRICES, value);
}

export function isPetCount(value: unknown): value is PetCount {
  return value === 1 || value === 2;
}

export function formatPrice(amountMinor: number, tier: Tier): string {
  const { currency, locale } = TIERS[tier];
  const whole = amountMinor % 100 === 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

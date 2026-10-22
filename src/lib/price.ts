import { TIERS, type PetCount, type Product, type Tier } from '../data/products';

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

export function priceFor(product: Product, tier: Tier, petCount: PetCount): string {
  return formatPrice(product.priceTiers[tier][petCount].amount, tier);
}

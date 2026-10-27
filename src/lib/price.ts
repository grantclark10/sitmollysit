import { formatPrice, type PetCount, type Tier } from '../data/pricing';
import type { Product } from '../data/products';

export { formatPrice };

export function priceFor(product: Product, tier: Tier, petCount: PetCount): string {
  return formatPrice(product.priceTiers[tier][petCount].amount, tier);
}

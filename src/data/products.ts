import type { ImageMetadata } from 'astro';
import lily from '../assets/pets/lily.jpg';
import frankie from '../assets/pets/frankie.jpg';
import benjy from '../assets/pets/benjy.jpg';
import chase from '../assets/pets/chase.jpg';
import noodle from '../assets/pets/noodle.jpg';
import murphy from '../assets/pets/murphy.jpg';
import faf from '../assets/pets/faf.jpg';

import { PRICES, VARIANT_IDS, TIERS, type PetCount, type ProductSlug, type Tier } from './pricing';

export {
  DEFAULT_TIER,
  PET_COUNTS,
  TIERS,
  isTier,
  type PetCount,
  type ProductSlug,
  type Tier,
  type TierConfig,
} from './pricing';

export type Background = 'white' | 'black';

export const BACKGROUNDS: readonly Background[] = ['white', 'black'];

export interface PriceTier {
  /** Minor units (cents / pence). */
  amount: number;
  lemonSqueezyVariantId: string;
}

export interface GalleryImage {
  src: ImageMetadata;
  petName: string;
  alt: string;
  /** MeetLabel tone: 'dark' for images on a light background. */
  labelTone?: 'light' | 'dark';
}

export interface Product {
  slug: ProductSlug;
  title: string;
  shortTitle: string;
  summary: string;
  requiresBackground: boolean;
  /** Product page copy, one paragraph per entry. */
  intro: string[];
  steps: string[];
  included: string[];
  cover: GalleryImage;
  gallery: GalleryImage[];
  priceTiers: Record<Tier, Record<PetCount, PriceTier>>;
}

function tiersFor(slug: ProductSlug): Product['priceTiers'] {
  const grid = {} as Product['priceTiers'];
  for (const tier of Object.keys(TIERS) as Tier[]) {
    grid[tier] = {
      1: { amount: PRICES[slug][tier][1], lemonSqueezyVariantId: VARIANT_IDS[slug][tier][1] },
      2: { amount: PRICES[slug][tier][2], lemonSqueezyVariantId: VARIANT_IDS[slug][tier][2] },
    };
  }
  return grid;
}

const studioGallery: GalleryImage[] = [
  { src: lily, petName: 'Lily', alt: 'Studio portrait of Lily, a cavalier spaniel, on a deep black background' },
  { src: frankie, petName: 'Frankie', alt: 'Studio portrait of Frankie, a black and white dog, lying with a teddy bear' },
  { src: benjy, petName: 'Benjy', alt: 'Studio portrait of Benjy, a brown and white dog, sitting on black' },
  { src: chase, petName: 'Chase', alt: 'Studio portrait of Chase, a white bull terrier, on a crisp white background', labelTone: 'dark' },
  { src: noodle, petName: 'Noodle', alt: 'Studio portrait of Noodle, a tabby and white cat, on black' },
  { src: murphy, petName: 'Murphy', alt: 'Studio portrait of Murphy, a bulldog, lying with a tennis ball' },
  { src: faf, petName: 'Faf', alt: 'Studio portrait of Faf, a boxer, sitting on a deep black background' },
];

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'studio-portrait',
    title: 'Studio Portrait',
    shortTitle: 'Studio',
    summary:
      'Your pet as a professional studio photograph on a crisp white or deep black background — without the studio session.',
    requiresBackground: true,
    intro: [
      'Receive a studio-style portrait of your pet, without the studio session.',
      'We take your pet’s photos and turn them into a clean, high-resolution portrait on a crisp white or deep black background. Minimal, timeless, and ridiculously frameable. The kind of look you’d expect from a proper studio shoot, minus the booking, travel and “please sit still” negotiations.',
    ],
    steps: [
      'Send 5 photos of your pet (phone pics are perfect).',
      'We choose the strongest shots.',
      'We refine the portrait for a polished studio finish.',
      'We place them on a clean white or black background.',
    ],
    included: ['Edited and finished by a real person', 'Artwork proof in 1–2 days', 'Unlimited edits, free'],
    cover: studioGallery[0]!,
    gallery: studioGallery,
    priceTiers: tiersFor('studio-portrait'),
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

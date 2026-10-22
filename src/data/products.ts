import type { ImageMetadata } from 'astro';
import lily from '../assets/pets/lily.jpg';
import frankie from '../assets/pets/frankie.jpg';
import benjy from '../assets/pets/benjy.jpg';
import chase from '../assets/pets/chase.jpg';
import noodle from '../assets/pets/noodle.jpg';
import murphy from '../assets/pets/murphy.jpg';
import faf from '../assets/pets/faf.jpg';

// ---------------------------------------------------------------------------
// TODO: launch prices, in minor units (cents / pence). Hardcoded per tier,
// never FX-converted. These are placeholders — set the real prices here AND
// on the matching Lemon Squeezy variants.
// ---------------------------------------------------------------------------
const TODO_PRICES = {
  'studio-portrait': { US: { 1: 4900, 2: 6900 }, UK: { 1: 3900, 2: 5500 } },
  'animated-portrait': { US: { 1: 5900, 2: 7900 }, UK: { 1: 4700, 2: 6300 } },
} as const satisfies PriceGrid<number>;

// ---------------------------------------------------------------------------
// TODO: Lemon Squeezy variant IDs, one per (product × petCount × tier).
// Lemon Squeezy dashboard → Products → [product] → Variants → copy each ID.
// See README "Lemon Squeezy setup".
// ---------------------------------------------------------------------------
const TODO_VARIANT_IDS = {
  'studio-portrait': {
    US: { 1: 'TODO_LS_STUDIO_US_1PET', 2: 'TODO_LS_STUDIO_US_2PET' },
    UK: { 1: 'TODO_LS_STUDIO_UK_1PET', 2: 'TODO_LS_STUDIO_UK_2PET' },
  },
  'animated-portrait': {
    US: { 1: 'TODO_LS_ANIMATED_US_1PET', 2: 'TODO_LS_ANIMATED_US_2PET' },
    UK: { 1: 'TODO_LS_ANIMATED_UK_1PET', 2: 'TODO_LS_ANIMATED_UK_2PET' },
  },
} as const satisfies PriceGrid<string>;

// ---------------------------------------------------------------------------

export type Tier = 'US' | 'UK';
export type PetCount = 1 | 2;
export type ProductSlug = 'studio-portrait' | 'animated-portrait';
export type Background = 'white' | 'black';

type PriceGrid<T> = Record<ProductSlug, Record<Tier, Record<PetCount, T>>>;

export interface TierConfig {
  currency: 'USD' | 'GBP';
  locale: string;
  label: string;
}

export const TIERS: Record<Tier, TierConfig> = {
  US: { currency: 'USD', locale: 'en-US', label: 'USD' },
  UK: { currency: 'GBP', locale: 'en-GB', label: 'GBP' },
};

export const DEFAULT_TIER: Tier = 'US';
export const PET_COUNTS: readonly PetCount[] = [1, 2];
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
}

export interface Product {
  slug: ProductSlug;
  title: string;
  shortTitle: string;
  summary: string;
  requiresBackground: boolean;
  cover: GalleryImage;
  gallery: GalleryImage[];
  priceTiers: Record<Tier, Record<PetCount, PriceTier>>;
}

function tiersFor(slug: ProductSlug): Product['priceTiers'] {
  const grid = {} as Product['priceTiers'];
  for (const tier of Object.keys(TIERS) as Tier[]) {
    grid[tier] = {
      1: { amount: TODO_PRICES[slug][tier][1], lemonSqueezyVariantId: TODO_VARIANT_IDS[slug][tier][1] },
      2: { amount: TODO_PRICES[slug][tier][2], lemonSqueezyVariantId: TODO_VARIANT_IDS[slug][tier][2] },
    };
  }
  return grid;
}

const studioGallery: GalleryImage[] = [
  { src: lily, petName: 'Lily', alt: 'Studio portrait of Lily, a cavalier spaniel, on a deep black background' },
  { src: frankie, petName: 'Frankie', alt: 'Studio portrait of Frankie, a black and white dog, lying with a teddy bear' },
  { src: benjy, petName: 'Benjy', alt: 'Studio portrait of Benjy, a brown and white dog, sitting on black' },
  { src: chase, petName: 'Chase', alt: 'Studio portrait of Chase, a white bull terrier, on a crisp white background' },
  { src: noodle, petName: 'Noodle', alt: 'Studio portrait of Noodle, a tabby and white cat, on black' },
  { src: murphy, petName: 'Murphy', alt: 'Studio portrait of Murphy, a bulldog, lying with a tennis ball' },
  { src: faf, petName: 'Faf', alt: 'Studio portrait of Faf, a boxer, sitting on a deep black background' },
];

// TODO: replace with real animated-feature example artwork before launch.
// Studio photos are standing in so layouts can be reviewed.
const animatedGallery: GalleryImage[] = [
  { src: benjy, petName: 'Benjy', alt: 'Storybook 3D animated portrait of Benjy, a brown and white dog' },
  { src: noodle, petName: 'Noodle', alt: 'Storybook 3D animated portrait of Noodle, a tabby and white cat' },
];

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'studio-portrait',
    title: 'Studio Portrait',
    shortTitle: 'Studio',
    summary:
      'Your pet as a professional studio photograph on a crisp white or deep black background — without the studio session.',
    requiresBackground: true,
    cover: studioGallery[0]!,
    gallery: studioGallery,
    priceTiers: tiersFor('studio-portrait'),
  },
  {
    slug: 'animated-portrait',
    title: 'Animated Portrait',
    shortTitle: 'Animated',
    summary: 'Your pet reimagined as a big-screen, animated-feature character in a warm storybook 3D style.',
    requiresBackground: false,
    cover: animatedGallery[0]!,
    gallery: animatedGallery,
    priceTiers: tiersFor('animated-portrait'),
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isTier(value: unknown): value is Tier {
  return value === 'US' || value === 'UK';
}

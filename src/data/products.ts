import type { ImageMetadata } from 'astro';
import lily from '../assets/pets/lily.jpg';
import frankie from '../assets/pets/frankie.jpg';
import benjy from '../assets/pets/benjy.jpg';
import chase from '../assets/pets/chase.jpg';
import noodle from '../assets/pets/noodle.jpg';
import murphy from '../assets/pets/murphy.jpg';
import faf from '../assets/pets/faf.jpg';
import wcLily from '../assets/watercolor/lily.webp';
import wcTilly from '../assets/watercolor/tilly.webp';
import wcFafBlack from '../assets/watercolor/faf-black.webp';
import wcFafWhite from '../assets/watercolor/faf-white.webp';
import wallpaperStudio from '../assets/wallpaper/studio-benjy.webp';
import wallpaperWatercolor from '../assets/wallpaper/watercolor-lily.webp';

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
  /** The artwork already has the "Meet …" label painted in, so skip the overlay. */
  labelInImage?: boolean;
}

export interface Product {
  slug: ProductSlug;
  title: string;
  shortTitle: string;
  summary: string;
  requiresBackground: boolean;
  /**
   * Product page copy. Entries are trusted HTML authored here (rendered with
   * set:html) so they can carry <strong>/<em>; one paragraph per entry.
   */
  copy: {
    intro: string[];
    howItWorks: { lead: string; steps?: string[]; outro: string };
    included: string[];
    /** Shown before the phone wallpaper mockup (ends with the Bonus line). */
    closing: string[];
    /** Shown after the phone wallpaper mockup. */
    afterWallpaper: string[];
  };
  /** Phone lock-screen mockup illustrating the free wallpaper bonus. */
  wallpaper: GalleryImage;
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

const watercolorGallery: GalleryImage[] = [
  { src: wcFafWhite, petName: 'Faf', alt: 'Watercolor portrait of Faf, a boxer with a green collar, on white paper', labelInImage: true },
  { src: wcTilly, petName: 'Tilly', alt: 'Watercolor portrait of Tilly, a fluffy white cat with green eyes', labelInImage: true },
  { src: wcLily, petName: 'Lily', alt: 'Watercolor portrait of Lily, a cavalier spaniel, on white paper', labelInImage: true },
  { src: wcFafBlack, petName: 'Faf', alt: 'Watercolor portrait of Faf, a boxer, on a deep black background', labelInImage: true },
];

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'studio-portrait',
    title: 'Studio Portrait',
    shortTitle: 'Studio',
    summary:
      'Your pet as a professional studio photograph on a crisp white or deep black background — without the studio session.',
    requiresBackground: true,
    copy: {
      intro: [
        'Receive a studio-style portrait of your pet, without the studio session.',
        'We take your pet’s photos and turn them into a clean, high-resolution portrait on a <strong>crisp white or deep black background</strong>. Minimal, timeless, and ridiculously frameable. It’s the kind of look you’d expect from a proper studio shoot… minus the booking, travel, and “please sit still” negotiations.',
      ],
      howItWorks: {
        lead: 'Send <strong>5 photos</strong> of your pet (phone pics are perfect). Our team will:',
        steps: [
          'choose the strongest shots',
          'refine the portrait for a polished studio finish',
          'place them on a clean <strong>white or black</strong> background',
        ],
        outro: 'You’ll receive a <strong>high-resolution digital file</strong> to download, then print or frame however you like.',
      },
      included: [
        '<strong>Edited and finished by a real person</strong>',
        '<strong>Artwork proof in 1–2 days</strong>',
        '<strong>Unlimited edits, free</strong>',
      ],
      closing: [
        'You’ll get a preview first, and we’ll tweak it until it feels perfect: we’ll look at the lighting, crop, background and overall feeling. And if you’re not happy with the final result, you’ll get a <strong>full refund</strong>.',
        '<strong>Bonus:</strong> We’ll also include a free phone wallpaper version, so your pet can live rent-free on your lock screen.',
      ],
      afterWallpaper: ['Let’s get started!'],
    },
    wallpaper: {
      src: wallpaperStudio,
      petName: 'Benjy',
      alt: 'Phone lock screen showing a studio portrait of Benjy as the wallpaper',
      labelInImage: true,
    },
    cover: studioGallery[0]!,
    gallery: studioGallery,
    priceTiers: tiersFor('studio-portrait'),
  },
  {
    slug: 'watercolor-portrait',
    title: 'Watercolor Portrait',
    shortTitle: 'Watercolor',
    summary:
      'Your pet’s best pics turned into a high-resolution watercolor-style portrait, designed and refined by a real person.',
    requiresBackground: true,
    copy: {
      intro: [
        '<strong>Same floof, now in watercolor.</strong><br />From photo to painting, it’s still 100% them.',
        'Want something a little more artistic, without the mission of finding (and paying) a painter? That’s exactly what Sit Molly Sit! is for. We turn your pet’s best pics into a high-resolution watercolor-style portrait that looks like they’ve been posing in a studio all day… without the drama.',
      ],
      howItWorks: {
        lead: 'Send <strong>5 photos</strong> of your pet (phone pics are perfect). Our team handles the rest.',
        outro: 'You’ll receive a <strong>high-resolution digital file</strong> you can download and print however you like: frame it, gift it, make it the centrepiece. Your call.',
      },
      included: [
        '<strong>Designed and refined by a real person</strong> (no generic auto-filter look)',
        '<strong>Artwork proof in 1–2 days</strong>',
        '<strong>Unlimited edits, free</strong>',
      ],
      closing: [
        'We’ll send a preview before anything is final. Then we’ll tweak it until it feels exactly right. The expression, color, emotion, all of it. No limits. No weird revision rules.',
        '<strong>Bonus:</strong> We’ll also include a free phone wallpaper version, so your pet can live rent-free on your lock screen.',
      ],
      afterWallpaper: [
        'And if you’re not happy with the final portrait? <strong>You get a full refund.</strong> Simple.',
        'Let’s get started!',
      ],
    },
    wallpaper: {
      src: wallpaperWatercolor,
      petName: 'Lily',
      alt: 'Phone lock screen showing a watercolor portrait of Lily as the wallpaper',
      labelInImage: true,
    },
    cover: watercolorGallery[0]!,
    gallery: watercolorGallery,
    priceTiers: tiersFor('watercolor-portrait'),
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

// Defaults for the homepage "Shop by Brands" section, editable in
// Admin → Content → Home (CMS section "brands", per-brand keys prefixed by the brand slug).

export const BRANDS_CMS_SECTION = "brands";

export const BRANDS_DEFAULT_HEADING = "Shop by Brands";
export const BRANDS_DEFAULT_CTA = "Visit Store";

// Copy and banner photos from the Figma design. The photos are already darkened, so their
// default overlay is none.
const BRAND_DEFAULTS: Record<string, { description: string; image: string }> = {
  "secret-garden-bees": {
    description: "Discover handcrafted bee-inspired products made with care, creativity, and a love for nature. Explore their unique creations and the story behind what inspires them.",
    image: "https://res.cloudinary.com/dre9yontg/image/upload/v1790902742/jpr-uploads/k2mvyrl778dxvsqftdek.png",
  },
  "emergency-essentials": {
    description: "Helping families prepare for the unexpected with long-term food storage, emergency supplies, and preparedness essentials. Discover practical products designed to bring confidence, security, and peace of mind.",
    image: "https://res.cloudinary.com/dre9yontg/image/upload/v1790902742/jpr-uploads/ilz8iqrpna1fbjr5d5ux.png",
  },
};

/** Dark overlay strength over the banner photo, as a percentage of black. */
export const BRAND_OVERLAY_OPTIONS = [
  { value: "0", label: "None (image already dark)" },
  { value: "40", label: "Light" },
  { value: "65", label: "Strong" },
];

export function brandDefaults(slug: string, name: string) {
  const d = BRAND_DEFAULTS[slug];
  return {
    description: d?.description ?? `Explore original products from ${name}, hand-picked for our community.`,
    image: d?.image ?? "",
    // Uploaded/fallback photos aren't pre-darkened, so they get a strong overlay by default
    overlay: d ? "0" : "65",
  };
}

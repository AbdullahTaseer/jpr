import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
      { protocol: "https", hostname: "www.beprepared.com", pathname: "/**" },
      { protocol: "https", hostname: "secretgardenbees.com", pathname: "/**" },
      { protocol: "https", hostname: "www.secretgardenbees.com", pathname: "/**" },
    ],
  },
  // Old product URLs from before these products were renamed to match beprepared.com
  async redirects() {
    return [
      {
        source: "/shop/ee-100-hour-candle-by-ready-hour-3-pack",
        destination: "/shop/ee-ready-hour-100-hour-candle",
        permanent: true,
      },
      {
        source: "/shop/ee-complete-instant-mashed-potatoes-large-can",
        destination: "/shop/ee-cherrywood-mashed-potatoes-large-can",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

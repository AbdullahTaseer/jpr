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
};

export default nextConfig;

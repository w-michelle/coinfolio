import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://resources.cryptocompare.com/**"),
      new URL("https://images.cryptocompare.com/**"),
    ],
  },
};

export default nextConfig;

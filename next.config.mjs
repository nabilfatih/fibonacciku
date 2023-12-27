import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

const millionConfig = {
  auto: true,
  // if you're using RSC:
  auto: { rsc: true },
};

export default million.next(nextConfig, millionConfig);

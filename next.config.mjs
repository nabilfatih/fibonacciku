import million from "million/compiler"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  webpack: config => {
    config.resolve.alias.canvas = false
    return config
  }
}

const millionConfig = {
  // if you're using RSC:
  auto: {
    threshold: 0.05, // default: 0.1,
    rsc: true
  }
}

export default million.next(nextConfig, millionConfig)

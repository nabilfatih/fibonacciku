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
  headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ]
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

const ContentSecurityPolicy = `
    default-src 'self';
    worker-src 'self' blob:;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com va.vercel-scripts.com js.stripe.com www.googletagmanager.com www.google-analytics.com unpkg.com;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'self' blob:;
    connect-src *;
    font-src 'self' data:;
    frame-src 'self' *.codesandbox.io js.stripe.com www.youtube.com;
    form-action 'self';
    base-uri 'self';
    object-src 'none';
`

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, "")
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin"
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
]

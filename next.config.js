const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  // NOTE: enabled for hydration debugging purposes
  productionBrowserSourceMaps: true,
  images: {
    domains: [
      "pbs.twimg.com",
      "abs.twimg.com",
      "openseauserdata.com",
      "lh3.googleusercontent.com",
    ],
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      has: [
        {
          type: "host",
          value: "oyfy.tunnelto.dev",
        },
      ],
      destination: "http://127.0.0.1:8080/api/:path*",
    },
  ],
});

module.exports = nextConfig;

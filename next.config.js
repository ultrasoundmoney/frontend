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
      source: "/api/v2/fees/:path*",
      has: [{ type: "host", value: "localhost" }],
      destination: "https://ultrasound.money/api/v2/fees/:path*",
    },
    // To test locally with the fam-analysis api running and a local tunnel to receive the oauth2 callback, use the below rewrite.
    // {
    //   source: "/api/auth/:path*",
    //   has: [
    //     {
    //       type: "host",
    //       value: "oyfy.tunnelto.dev",
    //     },
    //   ],
    //   destination: "http://127.0.0.1:3001/api/auth/:path*",
    // },
    // {
    //   source: "/api/fam/queue-for-discord",
    //   has: [
    //     {
    //       type: "host",
    //       value: "oyfy.tunnelto.dev",
    //     },
    //   ],
    //   destination: "http://127.0.0.1:3001/api/fam/queue-for-discord",
    // },
  ],
});

module.exports = nextConfig;

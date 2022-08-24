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
    // To test locally with the fam-analysis api running and a local tunnel to receive the oauth2 callback, use the below rewrite.
    // {
    //   source: "/api/:path*",
    //   has: [
    //     {
    //       type: "host",
    //       value: "oyfy.tunnelto.dev",
    //     },
    //   ],
    //   destination: "http://127.0.0.1:8080/api/:path*",
    // },
    // To do frontend dev accepting that an oauth2 callback won't work, but without our auth routes blowing up, use the below rewrite.
    {
      source: "/api/:path*",
      has: [
        {
          type: "host",
          value: "localhost",
        },
      ],
      destination: "https://ultrasound.money/api/:path*",
    },
  ],
});

module.exports = nextConfig;

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  // images: {
  //   loader: "custom",
  //   // domains: ["pbs.twimg.com", "lh3.googleusercontent.com"],
  // },
});

module.exports = nextConfig;

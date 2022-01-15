const { flow } = require("lodash");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");
module.exports = flow([withBundleAnalyzer, withImages])({
  trailingSlash: true,
  // Without the exportPathMap fleek deployments for /page break.
  exportPathMap: () => ({
    "/": { page: "/", query: { "admin-token": "admin-token" } },
    "/landing": { page: "/landing" },
    "/dashboard": { page: "/dashboard" },
  }),
  images: {
    disableStaticImages: true,
  },
});

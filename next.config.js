const { pipe } = require("fp-ts/function");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");
module.exports = pipe(
  {
    // Fleek recommends this.
    // See: https://blog.fleek.co/posts/fleek-nextJS
    trailingSlash: true,
    // Without the exportPathMap fleek deployments for /page break.
    exportPathMap: () => ({
      "/": { page: "/" },
      "/landing": { page: "/landing" },
      "/dashboard": { page: "/dashboard" },
    }),
    images: {
      disableStaticImages: true,
    },
  },
  withBundleAnalyzer,
  withImages
);

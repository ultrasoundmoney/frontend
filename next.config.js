/** @type {import('next').NextConfig} */
module.exports = {
  // Fleek recommends this.
  // See: https://blog.fleek.co/posts/fleek-nextJS
  trailingSlash: true,
  // Without the exportPathMap fleek deployments for /page break.
  exportPathMap: () => ({
    "/": { page: "/" },
    "/landing": { page: "/landing" },
    "/dashboard": { page: "/dashboard" },
  }),
  reactStrictMode: true,
  images: {
    domains: ["pbs.twimg.com"],
  },
};

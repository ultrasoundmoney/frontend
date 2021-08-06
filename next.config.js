const withImages = require("next-images");
module.exports = withImages({
  trailingSlash: true,
  // Without the exportPathMap fleek deployments for /page break.
  exportPathMap: () => ({
    "/": { page: "/" },
    "/landing": { page: "/landing" },
    "/dashboard": { page: "/dashboard" },
  }),
});

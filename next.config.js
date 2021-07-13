const withImages = require("next-images");
module.exports = withImages({
  future: { webpack5: true },
  trailingSlash: true,
  // Without the exportPathMap fleek deployments for /page break.
  exportPathMap: () => ({
    "/": { page: "/" },
    "/landing": { page: "/landing" },
  }),
});

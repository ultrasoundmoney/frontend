const withImages = require("next-images");
module.exports = withImages({
  future: { webpack5: true },
  trailingSlash: true,
  exportPathMap: () => ({
    "/": { page: "/" },
    "/landing": { page: "/landing" },
  }),
});

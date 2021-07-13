module.exports = {
  future: {
    webpack5: true,
  },
  exportTrailingSlash: true,
  exportPathMap: function () {
    return {
      "/": { page: "/" },
      "/landing": { page: "/landing" },
    };
  },
};
const withPWA = require("next-pwa");
module.exports = withPWA({
  pwa: {
    dest: "public",
  },
});
const withImages = require("next-images");
module.exports = withImages({
  webpack(config, options) {
    return config;
  },
});
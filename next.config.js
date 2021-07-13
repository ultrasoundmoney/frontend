module.exports = {
  future: {
    webpack5: true,
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
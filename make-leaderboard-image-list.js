const fs = require("fs/promises");

const makeContractImageList = async () => {
  const images = await fs.readdir("./public/leaderboard-images");
  const addresses = images
    .filter((image) => image.startsWith("0x"))
    .map((image) => image.slice(0, -4));
  await fs.writeFile(
    "./src/assets/leaderboard-image-ids.json",
    JSON.stringify(addresses)
  );
};

makeContractImageList();

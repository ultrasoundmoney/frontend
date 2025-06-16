export type Network = "mainnet" | "holesky" | "hoodi";

export const networkFromEnv = (): Network => {
  const rawNetwork = process.env.NEXT_PUBLIC_NETWORK;

  switch (rawNetwork) {
    case "mainnet":
      return "mainnet";
    case "holesky":
      return "holesky";
    case "hoodi":
      return "hoodi";
    default:
      console.warn("no NEXT_PUBLIC_NETWORK in env, defaulting to mainnet");
      return "mainnet";
  }
};

export const getDomain = () => {
  const network = networkFromEnv();
  switch (network) {
    case "holesky":
      return "https://relay-stag.ultrasound.money";
    case "hoodi":
      return "https://relay-hoodi.ultrasound.money";
    case "mainnet":
    default:
      return "https://relay.ultrasound.money";
  }
};

export const getCensorshipDomain = () => {
  const network = networkFromEnv();
  switch (network) {
    case "holesky":
      return "https://relay.ultrasound.money";
    case "hoodi":
      return "https://relay-hoodi.ultrasound.money";
    case "mainnet":
    default:
      return "https://relay.ultrasound.money";
  }
};

export const getRelayUrl = () => {
  const network = networkFromEnv();
  switch (network) {
    case "holesky":
      return "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-stag.ultrasound.money";
    case "hoodi":
      return "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-hoodi.ultrasound.money";
    case "mainnet":
      return "https://0xa1559ace749633b997cb3fdacffb890aeebdb0f5a3b6aaa7eeeaf1a38af0a8fe88b9e4b1f61f236d2e64d95733327a62@relay.ultrasound.money";
  }
};

export const getRelayDisplayUrl = () => {
  const network = networkFromEnv();
  switch (network) {
    case "holesky":
      return {
        pubkey: "0xb1559...",
        host: "relay-stag.ultrasound.money",
      };
    case "hoodi":
      return {
        pubkey: "0xb1559...",
        host: "relay-hoodi.ultrasound.money",
      };
    case "mainnet":
      return {
        pubkey: "0xa1559...",
        host: "relay.ultrasound.money",
      };
  }
};

export const getEtherscanUrl = () => {
  const network = networkFromEnv();
  return network === "holesky"
    ? "https://holesky.etherscan.io"
    : network === "hoodi"
    ? "https://hoodi.etherscan.io"
    : "https://etherscan.io";
};

export const getBeaconchainUrl = () => {
  const network = networkFromEnv();
  return network === "holesky"
    ? "https://holesky.beaconcha.in"
    : network === "hoodi"
    ? "https://hoodi.beaconcha.in"
    : "https://beaconcha.in";
};

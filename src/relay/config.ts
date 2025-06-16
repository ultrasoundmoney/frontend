import * as SharedConfig from "../config";

export const getDomain = () => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const apiEnv = process.env.NEXT_PUBLIC_API_ENV;
    switch (apiEnv) {
      case "dev":
        return "http://relay.localhost:3000";
      case "stag":
        return "https://relay-stag.ultrasound.money";
      case "hoodi":
        return "https://relay-hoodi.ultrasound.money";
      case "prod":
        return "https://relay.ultrasound.money";
      default:
        // Default to prod relay for local dev
        return "https://relay.ultrasound.money";
    }
  }

  const network = SharedConfig.networkFromEnv();
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

// Use prod api for censorship data on staging since we don't have the data for goerli
export const getCensorshipDomain = () => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const apiEnv = process.env.NEXT_PUBLIC_API_ENV;
    switch (apiEnv) {
      case "dev":
        return "http://relay.localhost:3000";
      case "stag":
        return "https://relay.ultrasound.money";
      case "hoodi":
        return "https://relay-hoodi.ultrasound.money";
      case "prod":
        return "https://relay.ultrasound.money";
      default:
        return "https://relay.ultrasound.money";
    }
  }

  const network = SharedConfig.networkFromEnv();
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
  const network = SharedConfig.networkFromEnv();
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
  const network = SharedConfig.networkFromEnv();
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
  const network = SharedConfig.networkFromEnv();
  return network === "holesky"
    ? "https://holesky.etherscan.io"
    : network === "hoodi"
    ? "https://hoodi.etherscan.io"
    : "https://etherscan.io";
};

export const getBeaconchainUrl = () => {
  const network = SharedConfig.networkFromEnv();
  return network === "holesky"
    ? "https://holesky.beaconcha.in"
    : network === "hoodi"
    ? "https://hoodi.beaconcha.in"
    : "https://beaconcha.in";
};

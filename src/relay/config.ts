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
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https:";
  const fallbackHost = new URL(getDomain()).host;
  const host =
    typeof window !== "undefined" ? window.location.host : fallbackHost;

  const pubkey =
    network === "mainnet"
      ? "0xa1559ace749633b997cb3fdacffb890aeebdb0f5a3b6aaa7eeeaf1a38af0a8fe88b9e4b1f61f236d2e64d95733327a62"
      : "0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc";

  return `${protocol}//${pubkey}@${host}`;
};

export const getRelayDisplayUrl = () => {
  const network = networkFromEnv();
  const fallbackHost = new URL(getDomain()).host;
  const host =
    typeof window !== "undefined" ? window.location.host : fallbackHost;

  return {
    pubkey: network === "mainnet" ? "0xa1559..." : "0xb1559...",
    host,
  };
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

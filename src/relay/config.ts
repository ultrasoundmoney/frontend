import { getEnv } from "../config";

export const getApiUrl = () => {
  const env = getEnv();
  return env === "stag"
    ? "https://relay-stag.ultrasound.money"
    : "https://relay.ultrasound.money";
};

export const getDomain = () => {
  const env = getEnv();
  return env === "dev" ? "http://relay.localhost:3000" : getApiUrl();
};

export const getRelayUrl = () => {
  const env = getEnv();
  switch (env) {
    case "dev":
      return "http://0xc1559cee7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay.localhost:3000";
    case "stag":
      return "https://0xb1559beef7b5ba3127485bbbb090362d9f497ba64e177ee2c8e7db74746306efad687f2cf8574e38d70067d40ef136dc@relay-stag.ultrasound.money";
    case "prod":
      return "https://0xa1559ace749633b997cb3fdacffb890aeebdb0f5a3b6aaa7eeeaf1a38af0a8fe88b9e4b1f61f236d2e64d95733327a62@relay.ultrasound.money";
  }
};

export const getRelayDisplayUrl = () => {
  const env = getEnv();
  switch (env) {
    case "dev":
      return {
        pubkey: "0xc1559...",
        host: "localhost:3000",
      };
    case "stag":
      return {
        pubkey: "0xb1559...",
        host: "relay-stag.ultrasound.money",
      };

    case "prod":
      return {
        pubkey: "0xa1559...",
        host: "relay.ultrasound.money",
      };
  }
};

export const getEtherscanUrl = () => {
  const env = getEnv();
  return env === "stag"
    ? "https://goerli.etherscan.io"
    : "https://etherscan.io";
};

export const getBeaconchainUrl = () => {
  const env = getEnv();
  return env === "stag"
    ? "https://goerli.beaconcha.in"
    : "https://beaconcha.in";
};

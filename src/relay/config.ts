import * as SharedConfig from "../config";

export const getDomain = () => {
  const apiEnv = SharedConfig.apiEnvFromEnv();
  switch (apiEnv) {
    case "dev":
      return "http://relay.localhost:3000";
    case "stag":
      return "https://relay-stag.ultrasound.money";
    case "prod":
      return "https://relay.ultrasound.money";
  }
};

// Use prod api for censorship data on staging since we don't have the data for goerli
export const getCensorshipDomain = () => {
  const apiEnv = SharedConfig.apiEnvFromEnv();
  switch (apiEnv) {
    case "dev":
      return "http://relay.localhost:3000";
    case "stag":
      return "https://relay.ultrasound.money";
    case "prod":
      return "https://relay.ultrasound.money";
  }
};

export const getRelayUrl = () => {
  const env = SharedConfig.envFromEnv();
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
  const env = SharedConfig.envFromEnv();
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
  const env = SharedConfig.envFromEnv();
  return env === "stag"
    ? "https://goerli.etherscan.io"
    : "https://etherscan.io";
};

export const getBeaconchainUrl = () => {
  const env = SharedConfig.envFromEnv();
  return env === "stag"
    ? "https://goerli.beaconcha.in"
    : "https://beaconcha.in";
};

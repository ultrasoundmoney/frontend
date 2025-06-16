// ugly hack to get hoodi working.
// would be nice to split the relay.ultrasound.money frontend out further.
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

export const getApiDomain = (): string => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    const apiEnv = process.env.NEXT_PUBLIC_API_ENV;
    switch (apiEnv) {
      case "dev":
        return "http://localhost:3000";
      case "stag":
        return "https://usm-i7x0.ultrasound.money";
      case "prod":
        return "https://ultrasound.money";
      default:
        // In dev, default to prod API
        return "https://ultrasound.money";
    }
  }

  const network = networkFromEnv();
  switch (network) {
    case "mainnet":
      return "https://ultrasound.money";
    case "holesky":
    case "hoodi":
      return "https://usm-i7x0.ultrasound.money";
    default:
      return "https://ultrasound.money";
  }
};

// We expect these to be set by the build process.
export const versionFromEnv = (): string => {
  const tags = process.env.NEXT_PUBLIC_TAGS;
  const commit = process.env.NEXT_PUBLIC_COMMIT;

  const shortTagVersion =
    typeof tags !== "string" ? undefined : tags.split("-")[1];
  const shortCommitVersion =
    typeof commit !== "string" ? undefined : commit.slice(0, 7);

  if (shortTagVersion && shortCommitVersion) {
    return `${shortTagVersion}-${shortCommitVersion}`;
  }

  if (shortTagVersion) {
    return shortTagVersion;
  }

  if (shortCommitVersion) {
    return shortCommitVersion;
  }

  return "unknown";
};

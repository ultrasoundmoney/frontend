type Env = "dev" | "prod" | "stag";

export const envFromEnv = (): Env => {
  const rawEnv = process.env.NEXT_PUBLIC_ENV;

  switch (rawEnv) {
    case "prod":
      return "prod";
    case "dev":
      return "dev";
    case "staging":
      return "stag";
    case "stag":
      return "stag";
    default:
      console.warn("no ENV in env, defaulting to dev");
      return "dev";
  }
};

export const apiEnvFromEnv = (): Env => {
  const apiEnv = process.env.NEXT_PUBLIC_API_ENV;

  // If API_ENV is undefined, we decide based on ENV
  if (apiEnv === undefined) {
    // Use production by default, unless we're running on staging, then use staging.
    return envFromEnv() === "stag" ? "stag" : "prod";
  }

  switch (apiEnv) {
    case "dev":
      return "dev";
    case "prod":
    case "production":
      return "prod";
    case "stag":
    case "staging":
      return "stag";
    default:
      return "prod";
  }
};

export const usmDomainFromEnv = (): string => {
  const apiEnv = apiEnvFromEnv();
  switch (apiEnv) {
    case "dev":
      return "http://localhost:3000";
    case "stag":
      return "https://usm-i7x0.ultrasound.money";
    case "prod":
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

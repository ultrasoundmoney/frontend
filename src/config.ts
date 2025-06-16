export type Env = "dev" | "stag" | "prod";

export const getApiDomain = (): string => {
  const apiEnv = (process.env.NEXT_PUBLIC_ENV as Env) ?? "prod";
  switch (apiEnv) {
    case "dev":
      return "https://ultrasound.money";
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

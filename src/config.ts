type Env = "dev" | "prod" | "stag";

export const getEnv = (): Env => {
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

export const getApiEnv = (): Env => {
  const apiEnv = process.env.NEXT_PUBLIC_API_ENV;

  if (apiEnv === undefined) {
    return getEnv() === "stag" ? "stag" : "prod";
  }

  switch (apiEnv) {
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

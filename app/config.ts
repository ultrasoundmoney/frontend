type Env = "dev" | "prod" | "staging";

const getEnv = (): Env => {
  const rawEnv = process.env.NEXT_PUBLIC_ENV;

  switch (rawEnv) {
    case "prod":
      return "prod";
    case "dev":
      return "dev";
    case "staging":
      return "staging";
    case "stag":
      return "staging";
    default:
      console.warn("no ENV in env, defaulting to dev");
      return "dev";
  }
};

export const env = getEnv();

const getApiEnv = (): Env => {
  const apiEnv = process.env.NEXT_PUBLIC_API_ENV;

  if (apiEnv === undefined) {
    return env === "staging" ? "staging" : "prod";
  }

  switch (apiEnv) {
    case "prod":
      return "prod";
    case "dev":
      return "dev";
    case "staging":
      return "staging";
    case "stag":
      return "staging";
    default:
      console.warn("no ENV in env, defaulting to dev");
      return "dev";
  }
};

export const apiEnv = getApiEnv();

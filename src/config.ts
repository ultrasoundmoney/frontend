type Env = "dev" | "prod" | "staging";

const parseEnv = (): Env => {
  const rawEnv = process.env.NEXT_PUBLIC_ENV;

  switch (rawEnv) {
    case "prod":
      return "prod";
    case "dev":
      return "dev";
    case "staging":
      return "staging";
    default:
      console.warn("no ENV in env, defaulting to dev");
      return "dev";
  }
};

const parseApiEnv = (): Env => {
  const rawEnv = process.env.NEXT_PUBLIC_API_ENV;

  if (rawEnv === undefined) {
    return parseEnv();
  }

  switch (rawEnv) {
    case "prod":
      return "prod";
    case "dev":
      return "dev";
    case "staging":
      return "staging";
    default:
      console.warn("no ENV in env, defaulting to dev");
      return "dev";
  }
};

type Config = {
  env: Env;
  apiEnv: Env;
};

const config: Config = {
  env: parseEnv(),
  apiEnv: parseApiEnv(),
};

export default config;

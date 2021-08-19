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

type Config = {
  env: Env;
};

const config: Config = {
  env: parseEnv(),
};

export default config;

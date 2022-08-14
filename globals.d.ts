type EnvironmentVariables = {
  ENV: "dev" | "staging" | "prod";
};

interface Window {
  ENVIRONMENT_VARIABLES: EnvironmentVariables;
}

import * as Config from "./config";

export const featureFlags = {
  leaderboardCategory: Config.apiEnv === "dev" || Config.apiEnv === "staging",
};

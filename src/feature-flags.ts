import * as Config from "./config";

export const featureFlags = {
  leaderboardCategory: Config.env === "dev" || Config.env === "staging",
  flippenings: Config.env === "dev" || Config.env === "staging",
};

import * as Config from "./config";

export const featureFlags = {
  enableCategories: Config.env === "dev" || Config.env === "staging",
};

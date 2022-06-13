import { useReducer } from "react";
import * as Config from "./config";

export const flags = [
  "enableCategories",
  "showCategorySlugs",
  "showCategoryCounts",
] as const;
export type Flag = typeof flags[number];

export type FeatureFlags = Record<Flag, boolean>;

export const defaults: FeatureFlags = {
  enableCategories: (Config.env === "dev" || Config.env === "staging") ?? false,
  showCategoryCounts: false,
  showCategorySlugs: false,
};

export const displayFlagMap: Record<Flag, string> = {
  enableCategories: "burn categories",
  showCategoryCounts: "show category counts",
  showCategorySlugs: "show category slugs",
};

const reducer = (
  state: FeatureFlags,
  action: { flag: Flag; enabled: boolean },
) => ({ ...state, [action.flag]: action.enabled });

export const useFeatureFlags = () => {
  const [featureFlags, setFlag] = useReducer(reducer, defaults);

  return { featureFlags, setFlag };
};

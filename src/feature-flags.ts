import { useReducer } from "react";

export const flags = [
  "showCategoryCounts",
  "showCategorySlugs",
  "showFairPrice",
] as const;
export type Flag = typeof flags[number];

export type FeatureFlags = Record<Flag, boolean>;

export const defaults: FeatureFlags = {
  showCategoryCounts: false,
  showCategorySlugs: false,
  showFairPrice: false,
};

export const displayFlagMap: Record<Flag, string> = {
  showCategoryCounts: "show category counts",
  showCategorySlugs: "show category slugs",
  showFairPrice: "show fair price",
};

const reducer = (
  state: FeatureFlags,
  action: { flag: Flag; enabled: boolean },
) => ({ ...state, [action.flag]: action.enabled });

export const useFeatureFlags = () => {
  const [featureFlags, setFlag] = useReducer(reducer, defaults);

  return { featureFlags, setFlag };
};

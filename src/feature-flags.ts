import { useReducer } from "react";
import * as Config from "./config";

export const flags = ["enableCategories"] as const;
export type Flag = typeof flags[number];

export type FeatureFlags = Record<Flag, boolean>;

export const defaults: FeatureFlags = {
  enableCategories:
    (false && (Config.env === "dev" || Config.env === "staging")) ?? false,
};

export const displayFlagMap: Record<Flag, string> = {
  enableCategories: "burn categories",
};

const reducer = (
  state: FeatureFlags,
  action: { flag: Flag; enabled: boolean },
) => ({ ...state, [action.flag]: action.enabled });

export const useFeatureFlags = () => {
  const [featureFlags, setFlag] = useReducer(reducer, defaults);

  return { featureFlags, setFlag };
};

import { createContext, useReducer } from "react";

export const flags = [
  "previewSkeletons",
  "showCategoryCounts",
  "showCategorySlugs",
  "showMetadataTools",
  "useWebSockets",
  "simulatePostMerge",
] as const;
export type Flag = typeof flags[number];

export type FeatureFlags = Record<Flag, boolean>;

export const defaults: FeatureFlags = {
  previewSkeletons: false,
  showCategoryCounts: false,
  showCategorySlugs: false,
  showMetadataTools: false,
  useWebSockets: false,
  simulatePostMerge: false,
};

export const displayFlagMap: Record<Flag, string> = {
  previewSkeletons: "preview skeletons",
  showCategoryCounts: "show category counts",
  showCategorySlugs: "show category slugs",
  showMetadataTools: "show metadata tools",
  useWebSockets: "use websockets",
  simulatePostMerge: "simulate post-merge",
};

const reducer = (
  state: FeatureFlags,
  action: { flag: Flag; enabled: boolean },
) => ({ ...state, [action.flag]: action.enabled });

export const useFeatureFlags = () => {
  const [featureFlags, setFlag] = useReducer(reducer, defaults);
  return { featureFlags, setFlag };
};

export const FeatureFlagsContext = createContext(defaults);

import { createContext, useReducer } from "react";

export const flags = [
  "enableSupplyLegendClick",
  "previewSkeletons",
  "showCategoryCounts",
  "showCategorySlugs",
  "showMetadataTools",
  "showTooltips",
  "simulateDeflationary",
  "useWebSockets",
] as const;
export type Flag = typeof flags[number];

export type FeatureFlags = Record<Flag, boolean>;

export const defaults: FeatureFlags = {
  enableSupplyLegendClick: false,
  previewSkeletons: false,
  showCategoryCounts: false,
  showCategorySlugs: false,
  showMetadataTools: false,
  showTooltips: false,
  simulateDeflationary: false,
  useWebSockets: false,
};

export const displayFlagMap: Record<Flag, string> = {
  enableSupplyLegendClick: "enable supply legend click",
  previewSkeletons: "preview skeletons",
  showCategoryCounts: "show category counts",
  showCategorySlugs: "show category slugs",
  showMetadataTools: "show metadata tools",
  showTooltips: "show tooltips",
  simulateDeflationary: "simulate deflationary",
  useWebSockets: "use websockets",
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

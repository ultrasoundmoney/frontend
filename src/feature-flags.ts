import * as Config from "./config";

export const getUrlFeatureFlags = (): string[] | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const featureFlags = urlSearchParams.get("ff");

  if (typeof featureFlags !== "string" || featureFlags.length === 0) {
    return undefined;
  }

  return featureFlags.split(",");
};

const defaults: Record<string, boolean> = {
  enableCategories: Config.env === "dev" || Config.env === "staging",
};

export const getFeatureFlags = () => {
  const urlFeatureFlags = getUrlFeatureFlags();
  const featureFlags = {
    ...defaults,
  };

  urlFeatureFlags?.forEach((flag) => {
    featureFlags[flag] = true;
  });

  return featureFlags;
};

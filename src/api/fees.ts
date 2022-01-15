import * as Config from "../config";

export const feesBasePath =
  Config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fees"
    : Config.apiEnv === "dev"
    ? "http://localhost:8080/fees"
    : "https://api.ultrasound.money/fees";


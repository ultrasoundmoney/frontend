import * as Config from "../config";

export const feesBasePath =
  Config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fees"
    : Config.apiEnv === "dev"
    ? "http://localhost:8080/fees"
    : "https://api.ultrasound.money/fees";

export const feesWsUrl =
  Config.apiEnv === "staging"
    ? "wss://api-stag.ultrasound.money/ws"
    : Config.apiEnv === "dev"
    ? "ws://localhost:8081/ws"
    : "wss://api.ultrasound.money/ws";

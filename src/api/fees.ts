import * as Config from "../config";

export const feesBasePath =
  Config.getApiEnv() === "stag"
    ? "https://api-stag.ultrasound.money/fees"
    : Config.getApiEnv() === "dev"
    ? "http://localhost:8080/fees"
    : "https://api.ultrasound.money/fees";

export const feesWsUrl =
  Config.getApiEnv() === "stag"
    ? "wss://api-stag.ultrasound.money/ws"
    : Config.getApiEnv() === "dev"
    ? "ws://localhost:8081/ws"
    : "wss://api.ultrasound.money/ws";

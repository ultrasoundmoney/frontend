import { pipe } from "fp-ts/lib/function";
import { fetchApiJson } from "../fetchers";
import type { RelayApiTimeFrames } from "./time_frames";
import { E, T, TEAlt } from "../../fp";

type SanctionsDelayRaw = {
  avgDelay: number;
  txType: "uncensored" | "censored";
  txCount: number;
};

export type SanctionsDelay = {
  count: number;
  censored_count: number;
  average_censored_delay: number;
};

export type SanctionsDelayPerTimeFrame = Record<"d7" | "d30", SanctionsDelay>;

const getSanctionsDelay = (rawDelays: SanctionsDelayRaw[]) => {
  const data = rawDelays;
  const uncensored = data.filter((d) => d.txType === "uncensored")[0];
  const censored = data.filter((d) => d.txType === "censored")[0];

  if (!uncensored || !censored) throw new Error("Invalid data");

  return {
    average_censored_delay: censored.avgDelay - uncensored.avgDelay,
    censored_count: censored.txCount,
    count: uncensored.txCount + censored.txCount,
  };
};

type RawData = Record<RelayApiTimeFrames, SanctionsDelayRaw[]>;

export const getSanctionsDelayPerTimeFrame: T.Task<SanctionsDelayPerTimeFrame> =
  pipe(
    () => fetchApiJson<RawData>("/api/censorship/censorship-categories"),
    T.map((body) =>
      "error" in body
        ? E.left(body.error)
        : E.right({
            d7: getSanctionsDelay(body.data["sevenDays"]),
            d30: getSanctionsDelay(body.data["thirtyDays"]),
          }),
    ),
    TEAlt.getOrThrow,
  );

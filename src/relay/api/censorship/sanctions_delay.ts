import { pipe } from "fp-ts/lib/function";
import { fetchApiJsonTE } from "../../fetchers";
import type { RelayApiTimeFrames } from "../time_frames";
import { T, TEAlt } from "../../../fp";
import type { SanctionsDelay } from "../../sections/CensorshipSection/SanctionsDelayWidget";

type SanctionsDelayRaw = {
  avgDelay: number;
  txType: "uncensored" | "censored";
  txCount: number;
};

export type SanctionsDelayPerTimeFrame = Record<"d7" | "d30", SanctionsDelay>;

const sanctionsDelayFromRaws = (rawDelays: SanctionsDelayRaw[]) => {
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

export const fetchSanctionsDelayPerTimeFrame: T.Task<SanctionsDelayPerTimeFrame> =
  pipe(
    fetchApiJsonTE<RawData>("/api/censorship/censorship-categories"),
    TEAlt.unwrap,
    T.map((body) => ({
      d7: sanctionsDelayFromRaws(body.sevenDays),
      d30: sanctionsDelayFromRaws(body.thirtyDays),
    })),
  );

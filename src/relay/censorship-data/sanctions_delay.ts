import sanctions_delay_7d from "./sanctions_delay_7d.json";
import sanctions_delay_30d from "./sanctions_delay_30d.json";

type SanctionsDelayRaw = {
  avg: number;
  t: "uncensored" | "censored";
  c: number;
};

const rawData: Record<"d7" | "d30", SanctionsDelayRaw[]> = {
  d7: sanctions_delay_7d as SanctionsDelayRaw[],
  d30: sanctions_delay_30d as SanctionsDelayRaw[],
};

export type SanctionsDelay = {
  count: number;
  censored_count: number;
  average_censored_delay: number;
};

export type SanctionsDelayPerTimeFrame = Record<"d7" | "d30", SanctionsDelay>;

const getSanctionsDelay = (timeFrame: "d7" | "d30") => {
  const data = rawData[timeFrame];
  const uncensored = data.filter((d) => d.t === "uncensored")[0];
  const censored = data.filter((d) => d.t === "censored")[0];

  if (!uncensored || !censored) throw new Error("Invalid data");

  return {
    average_censored_delay: censored.avg - uncensored.avg,
    censored_count: censored.c,
    count: uncensored.c + censored.c,
  };
};

export const sanctionsDelayPerTimeFrame: SanctionsDelayPerTimeFrame = {
  d7: getSanctionsDelay("d7"),
  d30: getSanctionsDelay("d30"),
};

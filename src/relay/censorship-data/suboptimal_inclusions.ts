import suboptimal_inclusion_7d from "./suboptimal_inclusions_7d.json";
import suboptimal_inclusion_30d from "./suboptimal_inclusions_30d.json";
import type { SuboptimalTransaction } from "../sections/InclusionDelaySection/SuboptimalInclusions";

const rawData: Record<"d7" | "d30", SuboptimalTransaction[]> = {
  d7: suboptimal_inclusion_7d,
  d30: suboptimal_inclusion_30d,
};

export type SuboptimalInclusionsPerTimeFrame = Record<
  "d7" | "d30",
  SuboptimalTransaction[]
>;

const getSanctionsDelay = (
  timeFrame: "d7" | "d30",
): SuboptimalTransaction[] => {
  return rawData[timeFrame];
};

export const suboptimalInclusionsPerTimeFrame: SuboptimalInclusionsPerTimeFrame =
  {
    d7: getSanctionsDelay("d7"),
    d30: getSanctionsDelay("d30"),
  };

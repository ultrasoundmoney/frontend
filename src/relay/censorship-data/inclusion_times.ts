import inclusion_delay_d7 from "./inclusion_delay_7d.json";
import inclusion_delay_d30 from "./inclusion_delay_30d.json";
import { A, N, OrdM, pipe } from "../../fp";
import type {
  Category,
  InclusionTime,
} from "../sections/InclusionDelaySection/InclusionTimesWidget";

type InclusionTimeRaw = {
  avg_delay: number;
  avg_block_delay: number;
  n: number;
  t_type: string;
};

const rawData: Record<"d7" | "d30", InclusionTimeRaw[]> = {
  d7: inclusion_delay_d7,
  d30: inclusion_delay_d30,
};

const rawCategoryMap: Record<string, Category> = {
  congested: "congestion",
  low_base_fee: "low_base_fee",
  low_tip: "low_tip",
  miner: "private",
  normal: "optimal",
  ofac: "sanctions_us",
  ofac_delayed: "sanctions_us",
  unknown: "unknown",
};

export type InclusionTimesPerTimeFrame = Record<"d7" | "d30", InclusionTime[]>;

const byTransactionCountDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((d: InclusionTime) => d.transaction_count),
);

const getInclusionTimesPerTimeFrame = (
  timeFrame: "d7" | "d30",
): InclusionTime[] => {
  // The congested category looks wrong, so we filter it out.
  const raw_inclusion_times = rawData[timeFrame].filter(
    (d) => d.t_type !== "congested",
  );
  const totalTransactions = raw_inclusion_times.reduce(
    (acc, cur) => acc + cur.n,
    0,
  );
  const inclusion_times = raw_inclusion_times.map((d) => ({
    id: rawCategoryMap[d.t_type] ?? "unknown",
    transaction_count: d.n,
    average_time: d.avg_delay,
    percent: d.n / totalTransactions,
  }));

  // Since ofac and ofac_delayed map to the same category, we have sanctions-us twice. We merge them.
  const { left: uniqueInclusionTimes, right: sanctionsUs } = pipe(
    inclusion_times,
    A.partition((d) => d.id === "sanctions_us"),
  );
  const sanctionsUsTotal = sanctionsUs.reduce(
    (acc, cur) => acc + cur.transaction_count,
    0,
  );
  const sanctionsUsAverageDelay =
    sanctionsUs.reduce(
      (acc, cur) => acc + cur.average_time * cur.transaction_count,
      0,
    ) / sanctionsUsTotal;
  const sanctionsUsPercent = sanctionsUs.reduce(
    (acc, cur) => acc + cur.percent,
    0,
  );
  const mergedSanctionsUs: InclusionTime = {
    average_time: sanctionsUsAverageDelay,
    id: "sanctions_us",
    percent: sanctionsUsPercent,
    transaction_count: sanctionsUsTotal,
  };

  // Sanctions UK is not included in the data, so we add it manually
  const sanctionsUk: InclusionTime = {
    average_time: 0,
    id: "sanctions_uk",
    percent: 0,
    transaction_count: 0,
  };

  const inclusionTimes = pipe(
    [...uniqueInclusionTimes, mergedSanctionsUs, sanctionsUk],
    A.sort(byTransactionCountDesc),
  );

  return inclusionTimes;
};

export const suboptimalInclusionsPerTimeFrame = {
  d7: getInclusionTimesPerTimeFrame("d7"),
  d30: getInclusionTimesPerTimeFrame("d30"),
};

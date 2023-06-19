import { A, N, OrdM, pipe, T, TEAlt } from "../../../fp";
import type {
  Category,
  InclusionTime,
} from "../../sections/InclusionDelaySection/InclusionTimesWidget";
import type { RelayApiTimeFrames } from "../time_frames";
import { fetchCensorshipApiJsonTE } from "../../fetchers";

type InclusionTimeRaw = {
  avgBlockDelay: number;
  avgDelay: number;
  delayType: Category;
  txCount: number;
};

type DelayCategoriesRaw = Record<RelayApiTimeFrames, InclusionTimeRaw[]>;

const categoryNameMap: Record<Category, string> = {
  borderline: "boundary",
  congested: "congestion",
  likely_insufficient_balance: "low balance",
  low_base_fee: "low fee",
  low_tip: "low fee",
  miner: "private",
  ofac_delayed: "sanctions",
  optimal: "optimal",
  unknown: "unknown",
  sanctions_uk: "sanctions",
};

const categoryDescriptionMap: Partial<Record<Category, string>> = {
  borderline: "network latency",
  congested: "blocks full",
  likely_insufficient_balance: "cannot pay fee",
  low_base_fee: "base fee",
  low_tip: "tip",
  miner: "outside mempool",
  ofac_delayed: "OFAC (US)",
  optimal: "next block",
  sanctions_uk: "UK",
  unknown: "not categorised",
};

export type InclusionTimesPerTimeFrame = Record<"d7" | "d30", InclusionTime[]>;

const byTransactionCountDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((d: InclusionTime) => d.transaction_count),
);

const getInclusionTimes = (rawData: InclusionTimeRaw[]): InclusionTime[] => {
  const totalTransactions = rawData.reduce((acc, cur) => acc + cur.txCount, 0);
  const inclusion_times = rawData
    // We don't want to show the borderline category
    .filter((transaction) => transaction.delayType !== "borderline")
    .map((d): InclusionTime => {
      const description = categoryDescriptionMap[d.delayType];
      return {
        ...(description && { description }),
        average_time: d.avgDelay,
        id: d.delayType ?? "unknown",
        name: categoryNameMap[d.delayType] ?? "unknown?",
        percent: d.txCount / totalTransactions,
        transaction_count: d.txCount,
      };
    });

  // Sanctions UK is not included in the data, so we add it manually
  const sanctionsUk: InclusionTime = {
    average_time: 0,
    description: "UK",
    id: "sanctions_uk",
    name: "sanctions",
    percent: 0,
    transaction_count: 0,
  };

  const inclusionTimes = pipe(
    [...inclusion_times, sanctionsUk],
    A.sort(byTransactionCountDesc),
  );

  return inclusionTimes;
};

export const fetchInclusionTimesPerTimeFrame = pipe(
  fetchCensorshipApiJsonTE<DelayCategoriesRaw>(
    "/api/censorship/delay-categories",
  ),
  TEAlt.unwrap,
  T.map((body) => ({
    d7: getInclusionTimes(body.sevenDays),
    d30: getInclusionTimes(body.thirtyDays),
  })),
);

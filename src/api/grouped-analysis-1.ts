import useSWR from "swr";
import * as Duration from "../duration";
import type { WeiNumber } from "../eth-units";
import type { BurnRecords, BurnRecordsF } from "./burn-records";
import { decodeBurnRecords } from "./burn-records";
import { fetchJson } from "./fetchers";
import type { Leaderboards } from "./leaderboards";

type WeiPerMinute = number;

export type BurnRates = {
  burnRate5m: WeiPerMinute;
  burnRate5mUsd: number;
  burnRate1h: WeiPerMinute;
  burnRate1hUsd: number;
  burnRate24h: WeiPerMinute;
  burnRate24hUsd: number;
  burnRate30d: WeiPerMinute;
  burnRate30dUsd: number;
  burnRate7d: WeiPerMinute;
  burnRate7dUsd: number;
  burnRateAll: WeiPerMinute;
  burnRateAllUsd: number;
};

export type FeesBurned = {
  feesBurned5m: WeiNumber;
  feesBurned5mUsd: number;
  feesBurned1h: WeiNumber;
  feesBurned1hUsd: number;
  feesBurned24h: WeiNumber;
  feesBurned24hUsd: number;
  feesBurned7d: WeiNumber;
  feesBurned7dUsd: number;
  feesBurned30d: WeiNumber;
  feesBurned30dUsd: number;
  feesBurnedAll: WeiNumber;
  feesBurnedAllUsd: number;
};

export type LatestBlock = {
  fees: WeiNumber;
  feesUsd: number;
  number: number;
  baseFeePerGas: WeiNumber;
  minedAt: string;
};

export type EthPrice = {
  usd: number;
  usd24hChange: number;
};

export type DeflationaryStreakMode = "preMerge" | "postMerge";
export type DeflationaryStreak = {
  startedOn: string;
  count: number;
};
export type DeflationaryStreakState = Record<
  DeflationaryStreakMode,
  DeflationaryStreak | null
>;
export type GroupedAnalysis1 = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: BurnRecords["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | undefined;
  feesBurned: FeesBurned;
  latestBlockFees: LatestBlock[];
  leaderboards: Leaderboards;
  number: number;
};

export type GroupedAnalysis1F = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: BurnRecordsF["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | undefined;
  feesBurned: FeesBurned;
  latestBlockFees: LatestBlock[];
  leaderboards: Leaderboards;
  number: number;
};

export const decodeGroupedAnalysis1 = (
  raw: GroupedAnalysis1F,
): GroupedAnalysis1 => ({
  ...raw,
  burnRecords: decodeBurnRecords({
    number: raw.number,
    records: raw.burnRecords,
  }).records,
});

export const useGroupedAnalysis1 = (): GroupedAnalysis1F => {
  const { data } = useSWR<GroupedAnalysis1F>(
    "/api/fees/grouped-analysis-1",
    fetchJson,
    {
      refreshInterval: Duration.millisFromSeconds(1),
    },
  );

  // We use suspense.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

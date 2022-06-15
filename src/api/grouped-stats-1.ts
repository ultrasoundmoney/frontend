import useSWR from "swr";
import * as Duration from "../duration";
import { NEA } from "../fp";
import { BurnRecords, decodeBurnRecords, RawBurnRecords } from "./burn-records";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";
import { Leaderboards } from "./leaderboards";

type WeiPerMinute = number;
type Wei = number;

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
  feesBurned5m: Wei;
  feesBurned5mUsd: number;
  feesBurned1h: Wei;
  feesBurned1hUsd: number;
  feesBurned24h: Wei;
  feesBurned24hUsd: number;
  feesBurned7d: Wei;
  feesBurned7dUsd: number;
  feesBurned30d: Wei;
  feesBurned30dUsd: number;
  feesBurnedAll: Wei;
  feesBurnedAllUsd: number;
};

export type LatestBlock = {
  fees: Wei;
  feesUsd: number;
  number: number;
  baseFeePerGas: Wei;
  minedAt: string;
};

export type EthPrice = {
  usd: number;
  usd24hChange: number;
  btc: number;
  btc24hChange: number;
};

export type DeflationaryStreakMode = "preMerge" | "postMerge";
export type DeflationaryStreak = {
  from: string;
  count: number;
};
export type DeflationaryStreakState = Record<
  DeflationaryStreakMode,
  DeflationaryStreak | null
>;
export type FeeData = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: BurnRecords["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | undefined;
  feesBurned: FeesBurned;
  latestBlockFees: NEA.NonEmptyArray<LatestBlock>;
  leaderboards: Leaderboards;
  number: number;
};

type RawFeeData = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: RawBurnRecords["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | null;
  feesBurned: FeesBurned;
  latestBlockFees: NEA.NonEmptyArray<LatestBlock>;
  leaderboards: Leaderboards;
  number: number;
};

const decodeFeeData = (raw: RawFeeData): FeeData => ({
  ...raw,
  ethPrice: raw.ethPrice ?? undefined,
  burnRecords: decodeBurnRecords({
    number: raw.number,
    records: raw.burnRecords,
  }).records,
});

export const useGroupedStats1 = (): FeeData | undefined => {
  const { data } = useSWR<RawFeeData>(`${feesBasePath}/all`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(4),
  });

  return data === undefined ? undefined : decodeFeeData(data);
};

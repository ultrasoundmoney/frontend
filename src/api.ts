import * as Config from "./config";
import useSWR from "swr";
import { LeaderboardEntry } from "./components/BurnLeaderboard";
import { millisFromSeconds } from "./duration";
import { TimeFrame } from "./components/TimeFrameControl";

export const famBasePath =
  Config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fam"
    : Config.apiEnv === "dev"
    ? "http://localhost:8080/fam"
    : "https://api.ultrasound.money/fam";

export const feesBasePath =
  Config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fees"
    : Config.apiEnv === "dev"
    ? "http://localhost:8080/fees"
    : "https://api.ultrasound.money/fees";

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

export type Leaderboards = {
  leaderboard1h: LeaderboardEntry[];
  leaderboard24h: LeaderboardEntry[];
  leaderboard7d: LeaderboardEntry[];
  leaderboard30d: LeaderboardEntry[];
  leaderboardAll: LeaderboardEntry[];
};

export type LatestBlockFees = {
  fees: Wei;
  feesUsd: number;
  number: number;
  baseFeePerGas: Wei;
  minedAt: string;
};

export type FeeData = {
  baseFeePerGas: number | undefined;
  burnRates: BurnRates | undefined;
  latestBlockFees: LatestBlockFees[];
  number: number | undefined;
  feesBurned: FeesBurned | undefined;
  leaderboards: Leaderboards | undefined;
};

export const useFeeData = (): FeeData => {
  const { data } = useSWR(`${feesBasePath}/all`, {
    refreshInterval: milisFromSeconds(4),
  });

  return data !== undefined
    ? {
        baseFeePerGas: data.baseFeePerGas,
        burnRates: data.burnRates,
        latestBlockFees: data.latestBlockFees,
        number: data.number,
        feesBurned: data.feesBurned,
        leaderboards: data.leaderboards,
      }
    : {
        baseFeePerGas: undefined,
        burnRates: undefined,
        latestBlockFees: [],
        number: undefined,
        feesBurned: undefined,
        leaderboards: undefined,
      };
};

export const setContractTwitterHandle = async (
  token: string,
  address: string,
  handle: string
) => {
  const res = await fetch(
    `${feesBasePath}/set-contract-twitter-handle?address=${address}&token=${token}&handle=${handle}`
  );

  if (res.status !== 200) {
    console.error("failed to add twitter handle");
    return;
  }

  console.log(`successfully added twitter handle ${handle} for ${address}`);
};

export const setContractName = async (
  token: string,
  address: string,
  name: string
) => {
  const res = await fetch(
    `${feesBasePath}/set-contract-name?address=${address}&token=${token}&name=${name}`
  );

  if (res.status !== 200) {
    console.error("failed to add contract name");
    return;
  }

  console.log(`successfully added contract name ${name} for ${address}`);
};

export const setContractCategory = async (
  token: string,
  address: string,
  category: string
) => {
  const res = await fetch(
    `${feesBasePath}/set-contract-category?address=${address}&token=${token}&category=${category}`
  );

  if (res.status !== 200) {
    console.error("failed to add contract category");
    return;
  }

  console.log(
    `successfully added contract category ${category} for ${address}`
  );
};

export type EthPrice = {
  usd: number;
  usd24hChange: number;
  btc: number;
  btc24hChange: number;
};

type BaseFeePerGas = {
  baseFeePerGas: number;
};

export const useEthPrice = (): EthPrice | undefined => {
  const { data } = useSWR<EthPrice>(`${feesBasePath}/eth-price`, {
    refreshInterval: millisFromSeconds(4),
  });

  return data;
};

export const useBaseFeePerGas = (): number | undefined => {
  const { data } = useSWR<BaseFeePerGas>(`${feesBasePath}/base-fee-per-gas`, {
    refreshInterval: milisFromSeconds(4),
    refreshWhenHidden: true,
  });

  return data?.baseFeePerGas;
};

export type AverageEthPrice = {
  all: 3536.800133928138;
  d30: 4090.2621816488527;
  d7: 4537.676751145321;
  h1: 4751.528260560356;
  h24: 4717.513628893767;
  m5: 4743.869230769231;
};

export const newTimeframeMap: Record<TimeFrame, keyof AverageEthPrice> = {
  "5m": "m5",
  "1h": "h1",
  "24h": "h24",
  "7d": "d7",
  "30d": "d30",
  all: "all",
};

export const useAverageEthPrice = (
  timeFrame: TimeFrame
): number | undefined => {
  const { data } = useSWR<AverageEthPrice>(
    `${feesBasePath}/average-eth-price`,
    {
      refreshInterval: milisFromSeconds(8),
    }
  );

  return data === undefined ? undefined : data[newTimeframeMap[timeFrame]];
};

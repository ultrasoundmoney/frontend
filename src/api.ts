import useSWR from "swr";
import config from "./config";
import { milisFromSeconds } from "./duration";
import { LeaderboardEntry } from "./components/BurnLeaderboard";

export const famBasePath = "https://api-prod.ultrasound.money/fam";

export const feesBasePath =
  config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fees"
    : config.apiEnv === "dev"
    ? "http://localhost:8080/fees"
    : "https://api.ultrasound.money/fees";

type WeiPerMinute = number;
type Wei = number;

export type BurnRates = {
  burnRate1h: WeiPerMinute;
  burnRate24h: WeiPerMinute;
  burnRate30d: WeiPerMinute;
  burnRate7d: WeiPerMinute;
  burnRateAll: WeiPerMinute;
};

export type FeesBurned = {
  feesBurned1h: Wei;
  feesBurned24h: Wei;
  feesBurned7d: Wei;
  feesBurned30d: Wei;
  feesBurnedAll: Wei;
};

export type Leaderboards = {
  leaderboard1h: LeaderboardEntry[];
  leaderboard24h: LeaderboardEntry[];
  leaderboard7d: LeaderboardEntry[];
  leaderboard30d: LeaderboardEntry[];
  leaderboardAll: LeaderboardEntry[];
};

export type FeeData = {
  baseFeePerGas: number | undefined;
  burnRates: BurnRates | undefined;
  latestBlockFees: {
    fees: Wei;
    number: number;
  }[];
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

export type EthPrice = {
  usd: number;
  usd24hChange: number;
  btc: number;
  btc24hChange: number;
};

export const useEthPrices = () => {
  const { data } = useSWR<EthPrice>(`${feesBasePath}/eth-price`);

  return data !== undefined ? { ethPrices: data } : { ethPrices: undefined };
};

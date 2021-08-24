import useSWR from "swr";
import config from "./config";
import { milisFromSeconds } from "./duration";

export const famBasePath = "https://api.ultrasound.money/fam";

export const feesBasePath =
  config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fees"
    : "https://api-prod.ultrasound.money/fees";

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

export type FeeData = {
  baseFeePerGas: number | undefined;
  burnRates: BurnRates | undefined;
  latestBlockFees: {
    fees: Wei;
    number: number;
  }[];
  number: number | undefined;
  feesBurned: FeesBurned | undefined;
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
      }
    : {
        baseFeePerGas: undefined,
        burnRates: undefined,
        latestBlockFees: [],
        number: undefined,
        feesBurned: undefined,
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

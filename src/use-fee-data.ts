import useSWR from "swr";

type TimestampStr = string;
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

type FeeData = {
  baseFeePerGas: number | undefined;
  burnRates: BurnRates | undefined;
  feesBurnedPerInterval: Record<TimestampStr, number> | undefined;
  latestBlockFees: {
    fees: Wei;
    number: number;
  }[];
  number: number | undefined;
  feesBurned: FeesBurned | undefined;
  isLoading: boolean;
  isError: Error | undefined;
};

const useFeeData = (): FeeData => {
  const { data, error } = useSWR(`https://api.ultrasound.money/fees/all`, {
    refreshInterval: 8000,
  });

  return {
    baseFeePerGas: data?.baseFeePerGas,
    burnRates: data?.burnRates,
    feesBurnedPerInterval: data?.feesBurnedPerInterval,
    latestBlockFees: data?.latestBlockFees ?? [],
    number: data?.number,
    feesBurned: data?.feesBurned,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFeeData;

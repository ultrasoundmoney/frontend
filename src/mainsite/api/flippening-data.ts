import useSWR from "swr";
import * as Duration from "../../duration";
import { fetchJsonSwr } from "./fetchers";

export type FlippeningDataPoint = {
  bitcoinSupply: number;
  btcMarketCap: number;
  btcPrice: number;
  ethPrice: number;
  ethMarketCap: number;
  ethSupply: number;
  isPresalePeriod: boolean;
  marketcapRatio: number;
  t: number;
};

export const useFlippeningData = (): FlippeningDataPoint[] | undefined => {
  const { data } = useSWR<FlippeningDataPoint[]>(
    "/api/v2/fees/flippening-data",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromMinutes(60),
    },
  );

  return data;
};

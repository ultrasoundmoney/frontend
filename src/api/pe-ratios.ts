import useSWR from "swr";
import { fetchJsonSwr } from "./fetchers";

export type PeRatios = {
  AAPL: number;
  AMZN: number;
  DIS: number;
  GOOGL: number;
  INTC: number;
  NFLX: number;
  TSLA: number;
};

export const usePeRatios = (): PeRatios | undefined => {
  const { data } = useSWR<PeRatios>("/api/fees/pe-ratios", fetchJsonSwr, {});

  return data;
};

import useSWR from "swr";
import { fetchJsonSwr } from "./fetchers";

export type PeRatios = {
  AAPL: number | null;
  AMZN: number | null;
  DIS: number | null;
  GOOGL: number | null;
  INTC: number | null;
  NFLX: number | null;
  TSLA: number | null;
};

export const usePeRatios = (): PeRatios | undefined => {
  const { data } = useSWR<PeRatios>("/api/fees/pe-ratios", fetchJsonSwr, {});

  return data;
};

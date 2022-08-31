import useSWR from "swr";
import { fetchJson } from "./fetchers";

type PeRatios = {
  AAPL: number;
  AMZN: number;
  DIS: number;
  GOOGL: number;
  INTC: number;
  NFLX: number;
  TSLA: number;
};

export const usePeRatios = (): PeRatios | undefined => {
  const { data } = useSWR<PeRatios>("/api/fees/pe-ratios", fetchJson, {});

  return data;
};

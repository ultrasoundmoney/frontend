import useSWR from "swr";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

type PeRatios = {
  AAPL: number;
  AMZN: number;
  GOOGL: number;
  INTC: number;
  NFLX: number;
  TSLA: number;
};

export const usePeRatios = (): PeRatios | undefined => {
  const { data } = useSWR<PeRatios>(`${feesBasePath}/pe-ratios`, fetcher, {});

  return data;
};

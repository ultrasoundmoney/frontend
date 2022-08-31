import useSWR from "swr";
import * as Duration from "../duration";
import type { TimeFrameNext } from "../time-frames";
import { fetchJson } from "./fetchers";
import type { EthPrice } from "./grouped-analysis-1";

export const useEthPrice = (): EthPrice | undefined => {
  const { data } = useSWR<EthPrice>("/api/fees/eth-price", fetchJson, {
    refreshInterval: Duration.millisFromSeconds(8),
  });

  return data;
};

export type AverageEthPrice = Record<TimeFrameNext, number>;

export const useAverageEthPrice = (): AverageEthPrice | undefined => {
  const { data } = useSWR<AverageEthPrice>(
    "/api/fees/average-eth-price",
    fetchJson,
    {
      refreshInterval: Duration.millisFromSeconds(8),
    },
  );

  return data === undefined ? undefined : data;
};

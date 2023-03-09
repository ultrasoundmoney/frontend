import useSWR from "swr";
import * as Duration from "../duration";
import type { TimeFrameNoMerge } from "../time-frames";
import { fetchJsonSwr } from "./fetchers";

export type AverageEthPrice = Record<TimeFrameNoMerge, number>;

export const useAverageEthPrice = (): AverageEthPrice | undefined => {
  const { data } = useSWR<AverageEthPrice>(
    "/api/fees/average-eth-price",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromSeconds(8),
    },
  );

  return data === undefined ? undefined : data;
};
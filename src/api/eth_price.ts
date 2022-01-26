import * as Duration from "../duration";
import useSWR from "swr";
import { EthPrice } from "./grouped_stats_1";
import { TimeFrameNext } from "../time_frames";
import { feesBasePath } from "./fees";

export const useEthPrice = (): EthPrice | undefined => {
  const { data } = useSWR<EthPrice>(`${feesBasePath}/eth-price`, {
    refreshInterval: Duration.millisFromSeconds(8),
  });

  return data;
};

export type AverageEthPrice = Record<TimeFrameNext, number>;

export const useAverageEthPrice = (): AverageEthPrice | undefined => {
  const { data } = useSWR<AverageEthPrice>(
    `${feesBasePath}/average-eth-price`,
    {
      refreshInterval: Duration.millisFromSeconds(8),
    },
  );

  return data === undefined ? undefined : data;
};

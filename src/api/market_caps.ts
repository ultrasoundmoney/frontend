import useSWR from "swr";
import * as Duration from "../duration";
import { feesBasePath } from "./fees";

type MarketCaps = {
  btcMarketCap: number;
  ethMarketCap: number;
  goldMarketCap: number;
  usdM3MarketCap: number;
  timestamp: Date;
};

export const useMarketCaps = (): MarketCaps | undefined => {
  const { data } = useSWR<MarketCaps>(`${feesBasePath}/market-caps`, {
    refreshInterval: Duration.millisFromSeconds(30),
  });

  return data;
};

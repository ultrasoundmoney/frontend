import useSWR from "swr";
import * as Duration from "../duration";
import { fetchJson } from "./fetchers";

type MarketCaps = {
  btcMarketCap: number;
  ethMarketCap: number;
  goldMarketCap: number;
  usdM3MarketCap: number;
  timestamp: Date;
};

export const useMarketCaps = (): MarketCaps | undefined => {
  const { data } = useSWR<MarketCaps>("/api/fees/market-caps", fetchJson, {
    refreshInterval: Duration.millisFromSeconds(30),
  });

  return data;
};

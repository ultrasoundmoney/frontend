import useSWR from "swr";
import * as Duration from "../../duration";
import { fetchJsonSwr } from "./fetchers";
import { useFlippeningData } from "./flippening-data";

type MarketCaps = {
  btcMarketCap: number;
  ethMarketCap: number;
  goldMarketCap: number;
  usdM3MarketCap: number;
  timestamp: Date;
};

export const useMarketCaps = (): MarketCaps | undefined => {
  const { data } = useSWR<MarketCaps>("/api/fees/market-caps", fetchJsonSwr, {
    refreshInterval: Duration.millisFromSeconds(30),
  });
  const flippeningData = useFlippeningData();
  const lastFlippeningDatapoint = flippeningData?.[flippeningData.length - 1];

  const marketCapData =
    (data  === undefined || lastFlippeningDatapoint === undefined)
      ? undefined
      : {
          btcMarketCap: lastFlippeningDatapoint.btcMarketcap,
          ethMarketCap: lastFlippeningDatapoint.ethMarketcap,
          goldMarketCap: data.goldMarketCap,
          usdM3MarketCap: data.usdM3MarketCap,
          timestamp: data.timestamp,
        };

  return marketCapData;
};

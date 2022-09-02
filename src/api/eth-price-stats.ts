import useSWR from "swr";
import * as Duration from "../duration";
import type { DateTimeString } from "../time";
import { fetchJson } from "./fetchers";

export type EthPriceStats = {
  h24Change: number;
  timestamp: DateTimeString;
  usd: number;
};

const url = "/api/v2/fees/eth-price-stats";

export const fetchEthPriceStats = () => fetchJson<EthPriceStats>(url);

export const useEthPriceStats = (): EthPriceStats | undefined => {
  const { data } = useSWR<EthPriceStats>(url, fetchJson, {
    refreshInterval: Duration.millisFromSeconds(20),
  });

  return data;
};

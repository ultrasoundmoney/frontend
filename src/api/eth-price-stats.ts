import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
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
    refreshInterval: secondsToMilliseconds(10),
  });

  return data;
};

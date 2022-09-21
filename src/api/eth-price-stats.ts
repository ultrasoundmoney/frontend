import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchJson, fetchJsonSwr } from "./fetchers";

export type EthPriceStats = {
  h24Change: number;
  timestamp: DateTimeString;
  usd: number;
};

const url = "/api/v2/fees/eth-price-stats";

export const fetchEthPriceStats = (): Promise<ApiResult<EthPriceStats>> =>
  fetchJson<EthPriceStats>(url);

export const useEthPriceStats = (): EthPriceStats => {
  const { data } = useSWR<EthPriceStats>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(10),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

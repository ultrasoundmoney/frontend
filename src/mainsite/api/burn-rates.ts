import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { DateTimeString } from "../../time";
import type { ApiResult } from "../../fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";
import type { TimeFrame } from "../time-frames";

export type BurnRate = {
  block_number: number;
  rate: {
    eth_per_minute: number;
    usd_per_minute: number;
  };
  timestamp: DateTimeString;
};

export type BurnRates = Record<TimeFrame, BurnRate>;

const url = "/api/v2/fees/burn-rates";

export const fetchBurnRates = (): Promise<ApiResult<BurnRates>> =>
  fetchApiJson<BurnRates>(url);

export const useBurnRates = (): BurnRates => {
  const { data } = useSWR<BurnRates>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

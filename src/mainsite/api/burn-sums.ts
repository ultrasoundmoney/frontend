import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { DateTimeString } from "../../time";
import type { ApiResult } from "../../fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";
import type { TimeFrame } from "../time-frames";

export type BurnSum = {
  block_number: number;
  sum: {
    eth: number;
    usd: number;
  };
  timestamp: DateTimeString;
};

export type BurnSums = Record<TimeFrame, BurnSum>;

const url = "/api/v2/fees/burn-sums";

export const fetchBurnSums = (): Promise<ApiResult<BurnSums>> =>
  fetchApiJson<BurnSums>(url);

export const useBurnSums = (): BurnSums => {
  const { data } = useSWR<BurnSums>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

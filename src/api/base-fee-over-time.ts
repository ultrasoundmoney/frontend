import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Gwei, WeiNumber } from "../eth-units";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";

export type BaseFeeAtTime = {
  block_number: number | null;
  timestamp: DateTimeString;
  wei: WeiNumber;
};

export type BaseFeeOverTime = {
  barrier: Gwei;
  block_number: number;
  d1: BaseFeeAtTime[];
  d30: BaseFeeAtTime[];
  d7: BaseFeeAtTime[];
  h1: BaseFeeAtTime[];
  m5: BaseFeeAtTime[];
  since_burn: BaseFeeAtTime[];
  since_merge: BaseFeeAtTime[] | null;
};

const url = "/api/v2/fees/base-fee-over-time";

export const fetchBaseFeeOverTime = (): Promise<ApiResult<BaseFeeOverTime>> =>
  fetchApiJson<BaseFeeOverTime>(url);

export const useBaseFeeOverTime = (): BaseFeeOverTime | undefined => {
  const { data } = useSWR<BaseFeeOverTime>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

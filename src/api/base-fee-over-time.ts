import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Gwei, WeiNumber } from "../eth-units";
import type { ApiResult } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";

export type BaseFeeAtTime = {
  block_number: number;
  wei: WeiNumber;
};

export type BaseFeeOverTime = {
  barrier: Gwei;
  block_number: number;
  d1: BaseFeeAtTime[];
};

const url = "/api/v2/fees/base-fee-over-time";

export const fetchBaseFeeOverTime = (): Promise<ApiResult<BaseFeeOverTime>> =>
  fetchJsonSwr<ApiResult<BaseFeeOverTime>>(url);

export const useBaseFeeOverTime = (): BaseFeeOverTime | undefined => {
  const { data } = useSWR<BaseFeeOverTime>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

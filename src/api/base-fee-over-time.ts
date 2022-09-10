import useSWR from "swr";
import { millisFromMinutes } from "../duration";
import type { Gwei, WeiNumber } from "../eth-units";
import { fetchJson } from "./fetchers";

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

export const fetchBaseFeeOverTime = (): Promise<BaseFeeOverTime> =>
  fetchJson<BaseFeeOverTime>(url);

export const useBaseFeeOverTime = (): BaseFeeOverTime | undefined => {
  const { data } = useSWR<BaseFeeOverTime>(url, fetchJson, {
    refreshInterval: millisFromMinutes(1),
  });

  return data;
};

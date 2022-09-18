import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { GweiNumber, WeiNumber } from "../eth-units";
import { WEI_PER_GWEI } from "../eth-units";
import type { ApiResult } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";

export type BaseFeePerGasStats = {
  average: WeiNumber;
  barrier: GweiNumber;
  max: WeiNumber;
  min: WeiNumber;
};

const url = "/api/v2/fees/base-fee-per-gas-stats";

export const fetchBaseFeePerGasStats = (): Promise<
  ApiResult<BaseFeePerGasStats>
> => fetchJsonSwr<ApiResult<BaseFeePerGasStats>>(url);

export const useBaseFeePerGasStats = (): BaseFeePerGasStats | undefined => {
  const { data } = useSWR<BaseFeePerGasStats>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data !== undefined
    ? { ...data, barrier: data.barrier * WEI_PER_GWEI }
    : undefined;
};

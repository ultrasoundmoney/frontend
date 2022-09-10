import useSWR from "swr";
import { GweiNumber, WeiNumber, WEI_PER_GWEI } from "../eth-units";
import { fetchJson } from "./fetchers";

export type BaseFeePerGasStats = {
  average: WeiNumber;
  barrier: GweiNumber;
  max: WeiNumber;
  min: WeiNumber;
};

const url = "/api/v2/fees/base-fee-per-gas-stats";

export const fetchBaseFeePerGasStats = (): Promise<BaseFeePerGasStats> =>
  fetchJson<BaseFeePerGasStats>(url);

export const useBaseFeePerGasStats = (): BaseFeePerGasStats | undefined => {
  const { data } = useSWR<BaseFeePerGasStats>(url, fetchJson, {
    refreshInterval: 4000,
  });

  return data !== undefined
    ? { ...data, barrier: data.barrier * WEI_PER_GWEI }
    : undefined;
};

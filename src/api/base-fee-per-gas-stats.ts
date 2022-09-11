import useSWR from "swr";
import { millisFromMinutes } from "../duration";
import type { GweiNumber, WeiNumber } from "../eth-units"
import { WEI_PER_GWEI } from "../eth-units";
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
    refreshInterval: millisFromMinutes(1),
  });

  return data !== undefined
    ? { ...data, barrier: data.barrier * WEI_PER_GWEI }
    : undefined;
};

import useSWR from "swr";
import type { DateTimeString } from "../../time";
import { fetchJsonSwr } from "./fetchers";

export type EffectiveBalanceSum = number;
export type EffectiveBalanceSumNext = {
  timestamp: DateTimeString;
  sum: EffectiveBalanceSum;
};

export const useEffectiveBalanceSum = ():
  | EffectiveBalanceSumNext
  | undefined => {
  const { data } = useSWR<EffectiveBalanceSum | EffectiveBalanceSumNext>(
    `/api/fees/effective-balance-sum`,
    fetchJsonSwr,
  );

  const effectiveBalanceSum =
    typeof data === "number"
      ? { timestamp: new Date().toISOString(), sum: data }
      : data;

  return effectiveBalanceSum;
};

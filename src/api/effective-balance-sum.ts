import useSWR from "swr";
import { fetchJson } from "./fetchers";

export type EffectiveBalanceSum = number;

export const useEffectiveBalanceSum = (): EffectiveBalanceSum | undefined => {
  const { data } = useSWR<EffectiveBalanceSum>(
    `/api/fees/effective-balance-sum`,
    fetchJson,
  );

  return data;
};

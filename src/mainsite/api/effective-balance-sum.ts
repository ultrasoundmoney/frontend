import useSWR from "swr";
import { fetchJsonSwr } from "./fetchers";

export type EffectiveBalanceSum = number;

export const useEffectiveBalanceSum = (): EffectiveBalanceSum | undefined => {
  const { data } = useSWR<EffectiveBalanceSum>(
    `/api/fees/effective-balance-sum`,
    fetchJsonSwr,
  );

  return data;
};

import useSWR from "swr";
import type { GweiNumber } from "../../eth-units";
import type { DateTimeString } from "../../time";
import { fetchJsonSwr } from "./fetchers";

export type EffectiveBalanceSum = {
  slot: number;
  sum: GweiNumber;
  timestamp: DateTimeString;
};

export const useEffectiveBalanceSum = (): EffectiveBalanceSum | undefined => {
  const { data } = useSWR<EffectiveBalanceSum>(
    `/api/fees/effective-balance-sum`,
    fetchJsonSwr,
  );

  return data;
};

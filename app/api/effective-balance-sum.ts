import useSWR from "swr";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

export type EffectiveBalanceSum = number;

export const useEffectiveBalanceSum = (): EffectiveBalanceSum | undefined => {
  const { data } = useSWR<EffectiveBalanceSum>(
    `${feesBasePath}/effective-balance-sum`,
    fetcher,
  );

  if (data === undefined) {
    return undefined;
  }

  return data;
};

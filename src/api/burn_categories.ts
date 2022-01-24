import useSWR from "swr";
import { feesBasePath } from "./fees";

export type Category = "nft" | "defi" | "mev" | "l2";

type BurnCategory = {
  category: Category;
  fees: number;
  feesUsd: number;
  transactionCount: number;
  percentOfTotalBurn: number;
  percentOfTotalBurnUsd: number;
};

export type BurnCategories = BurnCategory[];

export const useBurnCategories = () => {
  const { data } = useSWR<BurnCategories>(`${feesBasePath}/burn-categories`);

  return data;
};

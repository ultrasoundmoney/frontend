import useSWR from "swr";
import { feesBasePath } from "./fees";

export type Category =
  | "defi"
  | "gaming"
  | "l1"
  | "l1-bridge"
  | "l2"
  | "mev"
  | "nft"
  | "woof";

export const categoryDisplayMap: Record<Category, string> = {
  "l1-bridge": "L1 Bridge",
  defi: "DeFi",
  gaming: "Gaming",
  l1: "L1",
  l2: "L2",
  mev: "MEV",
  nft: "NFTs",
  woof: "Woof",
};

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

import useSWR from "swr";
import type { TimeFrameNext } from "../time-frames";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

const category = [
  "defi",
  "gaming",
  "l1",
  "l1-bridge",
  "l2",
  "mev",
  "nft",
  "woof",
] as const;

export type Category = typeof category[number];

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

export const getIsKnownCategory = (u: unknown): u is Category =>
  typeof u === "string" && category.includes(u as Category);

export type BurnCategory = {
  category: Category;
  fees: number;
  feesUsd: number;
  transactionCount: number;
  percentOfTotalBurn: number;
  percentOfTotalBurnUsd: number;
};

export type BurnCategories = Record<TimeFrameNext, BurnCategory[]>;

export const useBurnCategories = () => {
  const { data } = useSWR<BurnCategories>(
    `${feesBasePath}/burn-categories`,
    fetcher,
  );

  return data;
};

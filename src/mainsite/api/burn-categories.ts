import useSWR from "swr";
import type { TimeFrame } from "../time-frames";
import { fetchJsonSwr } from "./fetchers";

export const categoryId = [
  "cex",
  "defi",
  // Contract creations is a special case and currently injected on the frontend.
  "creations",
  "blobs",
  // Eth transfers is a special case and currently injected on the frontend.
  "transfers",
  "gaming",
  "l1",
  "l1-bridge",
  "l2",
  "mev",
  // Misc is a special case and currently injected on the frontend.
  "misc",
  "nft",
  "woof",
] as const;

export type CategoryId = typeof categoryId[number];

export const categoryDisplayMap: Record<CategoryId, string> = {
  "l1-bridge": "L1 bridge",
  cex: "CEX",
  defi: "defi",
  gaming: "gaming",
  l1: "L1",
  l2: "L2",
  mev: "MEV",
  misc: "misc (CEX, memecoins, etc)",
  nft: "NFTs",
  transfers: "ETH transfers",
  creations: "contract creations",
  blobs: "blob fees",
  woof: "woof",
};

export const getIsKnownCategory = (u: unknown): u is CategoryId =>
  typeof u === "string" && categoryId.includes(u as CategoryId);

export type BurnCategory = {
  category: CategoryId;
  fees: number;
  feesUsd: number;
  transactionCount: number;
  percentOfTotalBurn: number;
  percentOfTotalBurnUsd: number;
};

export type BurnCategories = Record<TimeFrame, BurnCategory[]>;

export const useBurnCategories = () => {
  const { data } = useSWR<BurnCategories>(
    "/api/fees/burn-categories",
    fetchJsonSwr,
  );

  return data;
};

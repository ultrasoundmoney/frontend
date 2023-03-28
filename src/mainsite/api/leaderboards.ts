import type { Category } from "./burn-categories";
import type { Linkables } from "./profiles";

type ContractEntry = {
  address: string;
  category: Category | string | null | undefined;
  detail: string | null | undefined;
  famFollowerCount: number | undefined;
  fees: number;
  feesUsd: number;
  followerCount: number | undefined;
  image: string | null | undefined;
  isBot: boolean;
  name: string | null | undefined;
  twitterBio: string | undefined;
  twitterHandle: string | undefined;
  twitterLinks: Linkables | undefined;
  twitterName: string | undefined;
  twitterUrl: string | undefined;
  type: "contract";
  /**
   * @deprecated
   */
  id: string;
};

type EthTransfersEntry = {
  type: "eth-transfers";
  name: string;
  fees: number;
  feesUsd: number;
  /**
   * @deprecated
   */
  id: string;
};

type ContractCreationsEntry = {
  type: "contract-creations";
  name: string;
  fees: number;
  feesUsd: number;
  /**
   * @deprecated
   */
  id: string;
};

// Name is undefined because we don't always know the name for a contract. Image is undefined because we don't always have an image for a contract. Address is undefined because base fees paid for ETH transfers are shared between many addresses.
export type LeaderboardEntry =
  | ContractEntry
  | EthTransfersEntry
  | ContractCreationsEntry;

export type Leaderboards = {
  leaderboard5m: LeaderboardEntry[];
  leaderboard1h: LeaderboardEntry[];
  leaderboard24h: LeaderboardEntry[];
  leaderboard7d: LeaderboardEntry[];
  leaderboard30d: LeaderboardEntry[];
  leaderboardSinceMerge: LeaderboardEntry[];
  leaderboardSinceBurn: LeaderboardEntry[];
};

import useSWR from "swr";
import * as Duration from "../duration";
import { fetchJson } from "./fetchers";
import type { Linkables } from "./profiles";

export type TvsRanking = {
  coinGeckoUrl: string | undefined;
  contractAddresses: string[];
  detail: string | undefined;
  famFollowerCount: number | undefined;
  followerCount: number | undefined;
  imageUrl: string | undefined;
  imageUrlAlt: string | undefined;
  links: Linkables | undefined;
  marketCap: number;
  name: string;
  nftGoUrl: string | undefined;
  tooltipDescription: string | undefined;
  tooltipName: string | undefined;
  twitterUrl: string | undefined;
};

export type TotalValueSecured = {
  erc20Leaderboard: TvsRanking[];
  nftLeaderboard: TvsRanking[];
  erc20Total: number;
  nftTotal: number;
  ethTotal: number;
  sum: number;
  securityRatio: number;
};

export const useTotalValueSecured = (): TotalValueSecured | undefined => {
  const { data } = useSWR<TotalValueSecured>(
    "/api/fees/total-value-secured",
    fetchJson,
    {
      refreshInterval: Duration.millisFromSeconds(10),
    },
  );

  return data;
};

import useSWR from "swr";
import * as Duration from "../duration";
import type { NEA } from "../fp";
import fetcher from "./default-fetcher";
import type { Linkables } from "./fam";
import { feesBasePath } from "./fees";

export type TvsRanking = {
  coinGeckoUrl: string | undefined;
  contractAddresses: NEA.NonEmptyArray<string>;
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
    `${feesBasePath}/total-value-secured`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(10),
    },
  );

  return data;
};

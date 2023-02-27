import useSWR from "swr";
import * as Duration from "../../duration";
import { fetchJsonSwr } from "./fetchers";

export type IssuanceBreakdown = {
  crowdSale: number;
  earlyContributors: number;
  ethereumFoundation: number;
  proofOfWork: number;
  proofOfStake: number;
};

export const useIssuanceBreakdown = (): IssuanceBreakdown | undefined => {
  const { data } = useSWR<IssuanceBreakdown>(
    // tmp endpoint to cache bust.
    "/api/fees/issuance-breakdown",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromHours(1),
    },
  );

  return data;
};

export const getPercentOfTotal = (
  issuanceBreakdown: IssuanceBreakdown,
  field: keyof IssuanceBreakdown,
): number => {
  const total =
    issuanceBreakdown.crowdSale +
    issuanceBreakdown.ethereumFoundation +
    issuanceBreakdown.earlyContributors +
    issuanceBreakdown.proofOfStake +
    issuanceBreakdown.proofOfWork;
  return issuanceBreakdown[field] / total;
};

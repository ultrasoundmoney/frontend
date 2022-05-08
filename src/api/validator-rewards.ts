import useSWR from "swr";
import * as Duration from "../duration";
import { O } from "../fp";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

export type ValidatorRewards = {
  issuance: {
    annualReward: number;
    apr: number;
  };
  tips: {
    annualReward: number;
    apr: number;
  };
  mev: {
    annualReward: number;
    apr: number;
  };
};

export const useValidatorRewards = (): O.Option<ValidatorRewards> => {
  const { data } = useSWR<ValidatorRewards>(
    `${feesBasePath}/validator-rewards`,
    fetcher,
    {
      refreshInterval: Duration.millisFromHours(1),
    },
  );

  if (data === undefined) {
    return O.none;
  }

  return O.some(data);
};

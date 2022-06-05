import useSWR from "swr";
import * as Duration from "../duration";
import { O, pipe } from "../fp";
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
    // tmp endpoint to cache bust.
    `${feesBasePath}/validator-rewards-2`,
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

export const getPercentOfTotal = (
  validatorRewards: O.Option<ValidatorRewards>,
  field: keyof ValidatorRewards,
) =>
  pipe(
    validatorRewards,
    O.map((validatorRewards) =>
      pipe(
        validatorRewards.issuance.annualReward +
          validatorRewards.tips.annualReward +
          validatorRewards.mev.annualReward,
        (total) => validatorRewards[field].annualReward / total,
      ),
    ),
  );

export const getTotalAnnualReward = (
  validatorRewards: O.Option<ValidatorRewards>,
) =>
  pipe(
    validatorRewards,
    O.map(
      (validatorRewards) =>
        validatorRewards.issuance.annualReward +
        validatorRewards.tips.annualReward +
        validatorRewards.mev.annualReward,
    ),
  );

export const getTotalApr = (validatorRewards: O.Option<ValidatorRewards>) =>
  pipe(
    validatorRewards,
    O.map(
      (validatorRewards) =>
        validatorRewards.issuance.apr +
        validatorRewards.tips.apr +
        validatorRewards.mev.apr,
    ),
  );

export const getAnnualRewards = (
  validatorRewards: O.Option<ValidatorRewards>,
  field: keyof ValidatorRewards,
) =>
  pipe(
    validatorRewards,
    O.map((validatorRewards) => validatorRewards[field].annualReward),
  );

export const getApr = (
  validatorRewards: O.Option<ValidatorRewards>,
  field: keyof ValidatorRewards,
) =>
  pipe(
    validatorRewards,
    O.map((validatorRewards) => validatorRewards[field].apr),
  );

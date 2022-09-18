import useSWR from "swr";
import * as Duration from "../duration";
import { fetchJsonSwr } from "./fetchers";

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

export const useValidatorRewards = (): ValidatorRewards | undefined => {
  const { data } = useSWR<ValidatorRewards>(
    // tmp endpoint to cache bust.
    "/api/fees/validator-rewards",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromHours(1),
    },
  );

  return data;
};

export const getPercentOfTotal = (
  validatorRewards: ValidatorRewards | undefined,
  field: keyof ValidatorRewards,
): number | undefined => {
  if (validatorRewards === undefined) {
    return undefined;
  }

  const total =
    validatorRewards.issuance.annualReward +
    validatorRewards.tips.annualReward +
    validatorRewards.mev.annualReward;

  return validatorRewards[field].annualReward / total;
};

export const getTotalAnnualReward = (
  validatorRewards: ValidatorRewards | undefined,
): number | undefined =>
  validatorRewards === undefined
    ? undefined
    : validatorRewards.issuance.annualReward +
      validatorRewards.tips.annualReward +
      validatorRewards.mev.annualReward;

export const getTotalApr = (
  validatorRewards: ValidatorRewards,
): number | undefined =>
  validatorRewards === undefined
    ? undefined
    : validatorRewards.issuance.apr +
      validatorRewards.tips.apr +
      validatorRewards.mev.apr;

export const getAnnualRewards = (
  validatorRewards: ValidatorRewards | undefined,
  field: keyof ValidatorRewards,
): number | undefined =>
  validatorRewards === undefined
    ? undefined
    : validatorRewards[field].annualReward;

export const getApr = (
  validatorRewards: ValidatorRewards | undefined,
  field: keyof ValidatorRewards,
): number | undefined =>
  validatorRewards === undefined ? undefined : validatorRewards[field].apr;

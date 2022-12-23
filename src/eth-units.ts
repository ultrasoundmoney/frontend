import JSBI from "jsbi";
import { useIssuanceEstimate } from "./api/issuance-estimate";

export const WEI_PER_GWEI_JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(9),
);

export const WEI_PER_ETH = 1e18;
export const WEI_PER_GWEI = 1e9;

export const GWEI_PER_ETH = 1e9;

export type Gwei = number;
export type Eth = number;

// Some values are too big to safely fit in Number.MAX_SAFE_INTEGER (2^53) but we do want to display accurately, we use strings and JSBI for those.
export type WeiString = string;

// When precision is no issue or the precise number will fit in 2^53 for the foreseeable future, we use number.
export type WeiNumber = number;

export type GweiNumber = number;

export type EthNumber = number;

const SLOTS_PER_MINUTE = 5;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365.25;
const SLOTS_PER_YEAR =
  DAYS_PER_YEAR * HOURS_PER_DAY * MINUTES_PER_HOUR * SLOTS_PER_MINUTE;

// WARNING: uses useIssuanceEstimate which expects only to be called inside of a tree with a SWRConfig which fetched the issuanceEstimate server side.
export const usePosIssuanceYear = (): EthNumber => {
  const issuanceEstimate = useIssuanceEstimate();
  return (
    (SLOTS_PER_YEAR * issuanceEstimate.issuance_per_slot_gwei) / GWEI_PER_ETH
  );
};

const SLOTS_PER_DAY = SLOTS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

export const usePosIssuancePerDay = (): EthNumber => {
  const issuanceEstimate = useIssuanceEstimate();
  return (
    (issuanceEstimate.issuance_per_slot_gwei * SLOTS_PER_DAY) / GWEI_PER_ETH
  );
};

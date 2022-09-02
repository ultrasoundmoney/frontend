import JSBI from "jsbi";

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

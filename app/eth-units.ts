import JSBI from "jsbi";

export const WEI_PER_GWEI_JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(9),
);

export const WEI_PER_ETH = 1e18;

export const GWEI_PER_ETH = 1e9;

export type Eth = number;
export type Gwei = number;

export type WeiJSBI = JSBI;

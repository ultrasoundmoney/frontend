import JSBI from "jsbi";

export const WEI_PER_GWEI_JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(9),
);

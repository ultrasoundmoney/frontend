import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { WEI_PER_ETH } from "./eth-units";

const intlFormatter = new Intl.NumberFormat();
export function intlFormat(num: number): string {
  return intlFormatter.format(num);
}

const twoDigit = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatWeiTwoDigit = (wei: number): string =>
  twoDigit.format(wei / WEI_PER_ETH);

export const formatTwoDigit = (num: number): string => twoDigit.format(num);

const zeroDecimals = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const formatZeroDecimals = (num: number): string =>
  zeroDecimals.format(num);

const oneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatOneDecimal = (num: number): string => oneDecimal.format(num);

const usdZeroDecimals = new Intl.NumberFormat("en-US", {
  currency: "usd",
  style: "currency",
  maximumFractionDigits: 0,
});

export const formatUsdZeroDecimals = (num: number): string =>
  usdZeroDecimals.format(num);

const percentOneDecimalSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "always",
  style: "percent",
});

export const formatPercentOneDecimalSigned = (percent: number): string =>
  percentOneDecimalSigned.format(percent);

const percentOneDecimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
});

export const formatPercentOneDecimal = (percent: number): string =>
  percentOneDecimal.format(percent);

const percentNoDecimals = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "percent",
});

export const formatPercentNoDecimals = (percent: number) =>
  percentNoDecimals.format(percent);

const percentTwoDecimals = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "percent",
});

export const formatPercentTwoDecimals = (fraction: number): string =>
  percentTwoDecimals.format(fraction);

const compactNumber = new Intl.NumberFormat("en", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  notation: "compact",
});

export const formatCompact = (num: number) => compactNumber.format(num);

const compactNumberOneDecimal = new Intl.NumberFormat("en", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
  notation: "compact",
});

export const formatCompactOneDecimal = (num: number) =>
  compactNumberOneDecimal.format(num);

export const gweiFromWei = (wei: number): number => wei / 1e9;

export const ethFromWei = (wei: number): number => wei / 1e18;

export const ethFromWeiBIUnsafe = (wei: JSBI): number =>
  JSBI.toNumber(
    JSBI.divide(wei, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))),
  );

export const ethFromGwei = (gwei: number): number => gwei / 1e9;

export function convertToInternationalCurrencySystem(labelValue: number) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? Number(Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? Number(Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? Number(Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue)).toFixed(2);
}

export const capitalize = (str: unknown) =>
  typeof str === "string"
    ? `${str[0]?.toUpperCase()}${str.slice(1)}`
    : undefined;

export const formatDistance = (dt: Date) => {
  const monthsDelta = DateFns.differenceInMonths(new Date(), dt);
  const weeksDelta = DateFns.differenceInWeeks(new Date(), dt);
  const daysDelta = DateFns.differenceInDays(new Date(), dt);
  const hoursDelta = DateFns.differenceInHours(new Date(), dt);
  const minutesDelta = DateFns.differenceInMinutes(new Date(), dt);
  const secondsDelta = DateFns.differenceInSeconds(new Date(), dt);

  if (monthsDelta > 0) {
    return `${monthsDelta}M`;
  }

  if (weeksDelta > 0) {
    return `${weeksDelta}w`;
  }

  if (daysDelta > 0) {
    return `${daysDelta}d`;
  }

  if (hoursDelta > 0) {
    return `${hoursDelta}h`;
  }

  if (minutesDelta > 0) {
    return `${minutesDelta}m`;
  }

  if (secondsDelta > 0) {
    return `${secondsDelta}s`;
  }

  return "??";
};

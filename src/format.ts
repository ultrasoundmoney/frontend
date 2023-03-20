import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { GWEI_PER_ETH, WEI_PER_ETH, WEI_PER_GWEI } from "./eth-units";

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

const twoDigitSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
});

export const formatTwoDigitsSigned = (num: number): string =>
  twoDigitSigned.format(num);

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
  minimumFractionDigits: 0,
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

const percentTwoDecimalSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
  style: "percent",
});

export const formatPercentTwoDecimalSigned = (percent: number): string =>
  percentTwoDecimalSigned.format(percent);

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

const percentThreeDecimals = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
  style: "percent",
});

export const formatPercentThreeDecimals = (fraction: number): string =>
  percentThreeDecimals.format(fraction);

const percentThreeDecimalsSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
  style: "percent",
  signDisplay: "always",
});

export const formatPercentThreeDecimalsSigned = (fraction: number): string =>
  percentThreeDecimalsSigned.format(fraction);

const percentFourDecimalsSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  style: "percent",
  signDisplay: "always",
});

export const formatPercentFourDecimalsSigned = (fraction: number): string =>
  percentFourDecimalsSigned.format(fraction);

const percentFiveDecimalsSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
  style: "percent",
  signDisplay: "always",
});

export const formatPercentFiveDecimalsSigned = (fraction: number): string =>
  percentFiveDecimalsSigned.format(fraction);

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

export const gweiFromWei = (wei: number): number => wei / WEI_PER_GWEI;

export const ethFromWei = (wei: number): number => wei / WEI_PER_ETH;

export const ethFromWeiBIUnsafe = (wei: JSBI): number =>
  JSBI.toNumber(
    JSBI.divide(wei, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))),
  );

export const ethFromGwei = (gwei: number): number => gwei / GWEI_PER_ETH;

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

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY;

/** Formats a distance in time using the smallest possible whole unit, but no smaller than seconds. */
export const formatDuration = (seconds: number, long = false): string => {
  const weeksDelta = Math.floor(seconds / SECONDS_PER_WEEK);
  if (weeksDelta > 0) {
    return long ? `${weeksDelta} weeks` : `${weeksDelta}w`;
  }

  const daysDelta = Math.floor((seconds % SECONDS_PER_WEEK) / SECONDS_PER_DAY);
  if (daysDelta > 0) {
    return long ? `${daysDelta} days` : `${daysDelta}d`;
  }

  const hoursDelta = Math.floor((seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  if (hoursDelta > 0) {
    return long ? `${hoursDelta} hours` : `${hoursDelta}h`;
  }

  const minutesDelta = Math.floor(
    (seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  if (minutesDelta > 0) {
    return long ? `${minutesDelta} minutes` : `${minutesDelta}m`;
  }

  return long ? `${seconds.toFixed(1)} seconds` : `${seconds.toFixed(1)}s`;
};

export const formatDurationToNow = (now: Date, dt: Date) => {
  const distance = DateFns.differenceInSeconds(now, dt);
  return formatDuration(distance);
};

export const formatBlockNumber = (number: unknown) =>
  typeof number === "number" ? `#${formatZeroDecimals(number)}` : undefined;

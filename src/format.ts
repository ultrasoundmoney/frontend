import { pipe } from "fp-ts/lib/function";
import JSBI from "jsbi";

const intlFormatter = new Intl.NumberFormat();
export function intlFormat(num: number): string {
  return intlFormatter.format(num);
}

const twoDigit = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatWeiTwoDigit = (wei: number): string =>
  pipe(wei, ethFromWei, (num) => twoDigit.format(num));

export const formatTwoDigit = (num: number): string => twoDigit.format(num);

const zeroDigit = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatZeroDigit = (num: number): string => zeroDigit.format(num);

const oneDigit = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatOneDigit = (num: number): string => oneDigit.format(num);

const usdZeroDigit = new Intl.NumberFormat("en-US", {
  currency: "usd",
  style: "currency",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatUsdZeroDigit = (num: number): string =>
  usdZeroDigit.format(num);

const percentOneDigitSigned = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "always",
  style: "percent",
});

export const formatPercentOneDigitSigned = (percent: number): string =>
  percentOneDigitSigned.format(percent);

const percentOneDigit = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  style: "percent",
});

export const formatPercentOneDigit = (percent: number): string =>
  percentOneDigit.format(percent);

const noDigit = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatNoDigit = (num: number): string => noDigit.format(num);

const compactNumber = new Intl.NumberFormat("en", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  notation: "compact",
});

export const formatCompact = (num: number) => compactNumber.format(num);

export const gweiFromWei = (wei: number): number => wei / 10 ** 9;

export const ethFromWei = (wei: number): number => wei / 10 ** 18;

export const ethFromWeiBIUnsafe = (wei: JSBI): number =>
  JSBI.toNumber(
    JSBI.divide(wei, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))),
  );

export const followerCountConvert = (num: number) => {
  if (num > 999 && num < 1000000) {
    // convert to K for number from > 1000 < 1 million
    return (num / 1000).toFixed(1) + "K";
  } else if (num > 1000000) {
    // convert to M for number from > 1 million
    return (num / 1000000).toFixed(1) + "M";
  } else if (num <= 999) {
    // if value < 1000, nothing to do
    return num;
  }
};

export const convertDateStringReadable = (date: string | number) => {
  if (date != undefined || date != null) {
    const dateString = new Date(date).toDateString();
    const dateStringToArr = dateString.split(" ");
    return `${dateStringToArr[1]} ${dateStringToArr[2]},${dateStringToArr[3]}`;
  }
};

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

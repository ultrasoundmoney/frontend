import { pipe } from "fp-ts/lib/function";
import { weiToEth } from "./utils/metric-utils";

export function formatLargeNumber(
  n: number,
  precision: number,
  i18n: Data
): string {
  let abbrev;
  if (n >= 1e6) {
    n = n / 1e6;
    abbrev = i18n.numeric_billion_abbrev;
  } else if (n >= 1e3) {
    n = n / 1e3;
    abbrev = i18n.numeric_thousand_abbrev;
  }
  if (precision !== undefined) {
    // Need to parseFloat again to avoid scientific notation
    n = parseFloat(n.toPrecision(precision));
  }
  return abbrev ? `${n}${abbrev}` : String(n);
}

const intlFormatter = new Intl.NumberFormat();
export function intlFormat(num: number): string {
  return intlFormatter.format(num);
}

const twoDigit = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatWeiTwoDigit = (wei: number): string =>
  pipe(wei, weiToEth, (num) => twoDigit.format(num));

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
} as any);

export const formatPercentOneDigitSigned = (percent: number): string =>
  percentOneDigitSigned.format(percent);

const noDigit = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatNoDigit = (num: number): string => noDigit.format(num);

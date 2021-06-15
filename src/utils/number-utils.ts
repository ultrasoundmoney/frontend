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

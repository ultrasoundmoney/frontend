import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { WeiNumber } from "../../eth-units";
import type { DateTimeString } from "../../time";
import type { ApiError, FetchError } from "../../fetchers";
import { fetchApiJsonTE } from "../../fetchers";
import { fetchJsonSwr } from "./fetchers";
import type { TE } from "../../fp";
import { O } from "../../fp";
import { usmDomainFromEnv } from "../../config";

export type BaseFeePerGas = {
  timestamp: DateTimeString;
  // Highest gas price seen, ~4000 Gwei, if we want 10x- 100x future proof, we need to handle
  // 4000 * 100 * 1e9 (Gwei), which wouldn't fit in i32, but is <1% of i64. Fits easily within
  // max safe integer for floats, 2^53.
  wei: WeiNumber;
};

const url = "/api/v2/fees/base-fee-per-gas";

export const fetchBaseFeePerGas = (): TE.TaskEither<
  FetchError | ApiError,
  BaseFeePerGas
> => fetchApiJsonTE<BaseFeePerGas>(usmDomainFromEnv(), url);

export const useBaseFeePerGas = (): O.Option<BaseFeePerGas> => {
  const { data } = useSWR<BaseFeePerGas>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
    refreshWhenHidden: true,
  });

  return O.fromNullable(data);
};

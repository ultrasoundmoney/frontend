import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";
import type { BlockNumber } from "./supply-over-time";

export type BaseFeePerGasBarrier = {
  // In Gwei/gas.
  barrier: number;
  block_number: BlockNumber;
  timestamp: DateTimeString;
};

const url = "/api/v2/fees/base-fee-per-gas-barrier";

export const fetchBaseFeePerGasBarrier = (): Promise<
  ApiResult<BaseFeePerGasBarrier>
> => fetchApiJson<BaseFeePerGasBarrier>(url);

export const useBaseFeePerGasBarrier = (): BaseFeePerGasBarrier => {
  const { data } = useSWR<BaseFeePerGasBarrier>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(60),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { GweiNumber, WeiNumber } from "../eth-units";
import type { ApiResult } from "./fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";

export type BaseFeePerGasStatsTimeFrame = {
  average: WeiNumber;
  max_block_number: number;
  max: WeiNumber;
  min: WeiNumber;
  min_block_number: number;
};

export type BaseFeePerGasStats = {
  barrier: GweiNumber;
  d1: BaseFeePerGasStatsTimeFrame;
  d30: BaseFeePerGasStatsTimeFrame;
  d7: BaseFeePerGasStatsTimeFrame;
  h1: BaseFeePerGasStatsTimeFrame;
  m5: BaseFeePerGasStatsTimeFrame;
  since_burn: BaseFeePerGasStatsTimeFrame | null;
  since_merge: BaseFeePerGasStatsTimeFrame | null;
};

const url = "/api/v2/fees/base-fee-per-gas-stats";

export const fetchBaseFeePerGasStats = (): Promise<
  ApiResult<BaseFeePerGasStats>
> => fetchApiJson<BaseFeePerGasStats>(url);

export const useBaseFeePerGasStats = (): BaseFeePerGasStats => {
  const { data } = useSWR<BaseFeePerGasStats>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

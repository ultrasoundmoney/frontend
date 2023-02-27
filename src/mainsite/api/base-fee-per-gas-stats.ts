import {
  hoursToMilliseconds,
  minutesToMilliseconds,
  secondsToMilliseconds,
} from "date-fns";
import useSWR from "swr";
import type { GweiNumber, WeiNumber } from "../../eth-units";
import type { DateTimeString } from "../../time";
import type { TimeFrame } from "../time-frames";
import type { ApiResult } from "./fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";
import type { BlockNumber } from "./supply-over-time";

export type BaseFeePerGasStats = {
  average: WeiNumber;
  max_block_number: number;
  max: WeiNumber;
  min: WeiNumber;
  min_block_number: number;
};

export type BaseFeePerGasStatsEnvelope = {
  barrier: GweiNumber;
  base_fee_per_gas_stats: Record<TimeFrame, BaseFeePerGasStats>;
  block_number: BlockNumber;
  timestamp: DateTimeString;
};

const url = "/api/v2/fees/base-fee-per-gas-stats";

export const fetchBaseFeePerGasStats = (): Promise<
  ApiResult<BaseFeePerGasStatsEnvelope>
> => fetchApiJson<BaseFeePerGasStatsEnvelope>(url);

export const useBaseFeePerGasStats = ():
  | BaseFeePerGasStatsEnvelope
  | undefined => {
  const { data } = useSWR<BaseFeePerGasStatsEnvelope>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

export const fetchBaseFeePerGasStatsTimeFrame = (
  timeFrame: TimeFrame,
): Promise<ApiResult<BaseFeePerGasStats>> =>
  fetchApiJson<BaseFeePerGasStats>(`${url}?time_frame=${timeFrame}`);

const refreshIntervalMap: Record<TimeFrame, number> = {
  m5: secondsToMilliseconds(4),
  h1: secondsToMilliseconds(4),
  d1: minutesToMilliseconds(1),
  d7: minutesToMilliseconds(10),
  d30: hoursToMilliseconds(1),
  since_burn: hoursToMilliseconds(1),
  since_merge: hoursToMilliseconds(1),
};

export const useBaseFeePerGasStatsTimeFrame = (
  timeFrame: TimeFrame,
): BaseFeePerGasStats => {
  const { data } = useSWR<BaseFeePerGasStats>(
    `${url}?time_frame=${timeFrame}`,
    fetchJsonSwr,
    {
      refreshInterval: refreshIntervalMap[timeFrame],
    },
  );

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

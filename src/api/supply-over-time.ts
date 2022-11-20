import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Slot } from "../beacon-units";
import type { EthNumber } from "../eth-units";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type SupplyAtTime = {
  slot: Slot | null;
  supply: EthNumber;
  timestamp: DateTimeString;
};

export type BlockNumber = number;

// These may be empty when our backend fails to sync blocks for more than 5
// minutes.
export type SupplyOverTime = {
  block_number: BlockNumber;
  d1: SupplyAtTime[];
  d30: SupplyAtTime[];
  d7: SupplyAtTime[];
  h1: SupplyAtTime[];
  m5: SupplyAtTime[];
  since_merge: SupplyAtTime[];
  slot: Slot;
  timestamp: DateTimeString;
};

const url = "/api/v2/fees/supply-over-time";

export const fetchSupplyOverTime = (): Promise<ApiResult<SupplyOverTime>> =>
  fetchApiJson<SupplyOverTime>(url);

export const useSupplyOverTime = (): SupplyOverTime | undefined =>
  useSWR<SupplyOverTime>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  }).data;

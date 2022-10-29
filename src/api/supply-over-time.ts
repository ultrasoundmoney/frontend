import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Slot } from "../beacon-units";
import type { EthNumber } from "../eth-units";
import type { DateTimeString } from "../time";
import type { EthPriceStats } from "./eth-price-stats";
import type { ApiResult } from "./fetchers";
import { fetchJson, fetchJsonSwr } from "./fetchers";

export type SupplyAtTime = {
  slot: Slot | null;
  supply: EthNumber;
  timestamp: DateTimeString;
};

export type BlockNumber = number;

export type TimeFrameV2Api = "m5" | "h1" | "d1" | "d7" | "d30" | "since_merge";

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

export const fetchSupplyOverTime = (): Promise<ApiResult<EthPriceStats>> =>
  fetchJson<EthPriceStats>(url);

export const useSupplyOverTime = (): SupplyOverTime | undefined => {
  const { data } = useSWR<SupplyOverTime>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

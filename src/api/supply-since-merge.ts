import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Slot } from "../beacon-units";
import type { EthNumber } from "../eth-units";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";

export type SupplyAtTime = {
  timestamp: DateTimeString;
  supply: EthNumber;
};

export type SupplySinceMerge = {
  balances_slot: Slot;
  block_number: number;
  deposits_slot: Slot;
  supply_by_hour: SupplyAtTime[];
  timestamp: DateTimeString;
};

const url = "/api/v2/fees/supply-since-merge";

export const fetchSupplySinceMerge = (): Promise<ApiResult<SupplySinceMerge>> =>
  fetchJson<SupplySinceMerge>(url);

export const useSupplySinceMerge = (): SupplySinceMerge | undefined => {
  const { data } = useSWR<SupplySinceMerge>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Slot } from "../beacon-units";
import type { WeiString } from "../eth-units";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type SupplyChange = {
  from_slot: Slot;
  from_timestamp: DateTimeString;
  from_supply: WeiString;
  to_slot: Slot;
  to_timestamp: DateTimeString;
  to_supply: WeiString;
  change: WeiString;
};

export type SupplyChanges = {
  d1: SupplyChange | null;
  d30: SupplyChange | null;
  d7: SupplyChange | null;
  h1: SupplyChange | null;
  m5: SupplyChange | null;
  since_burn: SupplyChange | null;
  since_merge: SupplyChange | null;
  slot: Slot;
  timestamp: DateTimeString;
};

const url = "/api/v2/fees/supply-changes";

export const fetchSupplyChanges = (): Promise<ApiResult<SupplyChanges>> =>
  fetchApiJson<SupplyChanges>(url);

export const useSupplyChanges = (): SupplyChanges =>
  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useSWR<SupplyChanges>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  }).data!;

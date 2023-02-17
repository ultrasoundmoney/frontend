import { minutesToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Slot } from "../beacon-units";
import type { GweiNumber } from "../eth-units";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";

export type IssuanceEstimate = {
  slot: Slot;
  timestamp: DateTimeString;
  issuance_per_slot_gwei: GweiNumber;
};

const url = "/api/v2/fees/issuance-estimate";

export const fetchIssuanceEstimate = (): Promise<ApiResult<IssuanceEstimate>> =>
  fetchApiJson<IssuanceEstimate>(url);

export const useIssuanceEstimate = (): IssuanceEstimate => {
  const { data } = useSWR<IssuanceEstimate>(url, fetchJsonSwr, {
    refreshInterval: minutesToMilliseconds(10),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};

import { isBefore, secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { Slot } from "../beacon-units";
import type { EthNumber } from "../eth-units";
import { PARIS_TIMESTAMP } from "../hardforks/paris";
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

// To calculate rates based on points we look at the first and last point in a
// time frame. This works for all but the since-merge time frame as it
// currently includes pre-merge points we don't want to include in the rate
// calculation. To rectify this we slice them out until the backend stops
// sending them.
// TODO: deploy this code to prod so the frontend has correct behavior when
// receiving only post-merge points.
// TODO: have the backend stop sending pre-merge points for the since-merge
// time frame.
// TODO: remove the pre-merge point filtering code.
const filterPostParisPoints = (points: SupplyAtTime[]): SupplyAtTime[] => {
  const mergeIndex = points.findIndex(
    // !isBefore meaning at or after Paris
    ({ timestamp }) => !isBefore(new Date(timestamp), PARIS_TIMESTAMP),
  );
  return points.slice(mergeIndex);
};

export const fetchSupplyOverTime = (): Promise<ApiResult<SupplyOverTime>> =>
  fetchApiJson<SupplyOverTime>(url).then((res) => {
    if ("error" in res) {
      return res;
    }

    return {
      ...res,
      data: {
        ...res.data,
        since_merge: filterPostParisPoints(res.data.since_merge),
      },
    };
  });

export const useSupplyOverTime = (): SupplyOverTime | undefined => {
  const { data } = useSWR<SupplyOverTime>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  if (data === undefined) {
    return undefined;
  }

  return {
    ...data,
    since_merge: filterPostParisPoints(data.since_merge),
  };
};

import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { DateTimeString } from "../time";
import { fetchJson } from "./fetchers";

// type PendingStatus = {
//   status: "pending";
// };

type MergedStatus = {
  status: "merged";
  timestamp: DateTimeString;
  supply: number;
  block_number: number;
};

export type MergeStatus = MergedStatus;

// Although this endpoint will never return 'pending' again, it still provides some data widgets depend on. It should be migrated to expose said data on /merge-stats
const url = "/api/v2/fees/merge-status";

export const fetchMergeStatus = (): Promise<MergeStatus> =>
  fetchJson<MergeStatus>(url);

export const useMergeStatus = (): MergedStatus | undefined => {
  const { data } = useSWR<MergedStatus>(url, fetchJson, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

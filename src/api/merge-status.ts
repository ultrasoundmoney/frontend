import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { DateTimeString } from "../time";
import { fetchJson } from "./fetchers";

type PendingStatus = {
  status: "pending";
};

type MergedStatus = {
  status: "merged";
  timestamp: DateTimeString;
  supply: number;
  block_number: number;
};

export type MergeStatus = PendingStatus | MergedStatus;

const url = "/api/v2/fees/merge-status";

export const fetchMergeStatus = (): Promise<MergeStatus> =>
  fetchJson<MergeStatus>(url);

export const useMergeStatus = (): MergeStatus | undefined => {
  const { data } = useSWR<MergeStatus>(url, fetchJson, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};

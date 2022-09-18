import useSWR from "swr";
import { getDomain } from "../config";
import * as Duration from "../duration";
import type { DateTimeString } from "../time";
import type { ApiResult } from "./fetchers";
import { fetchJson, fetchJsonSwr } from "./fetchers";

export type MergeEstimate = {
  blockNumber: number;
  blocksLeft: number;
  difficulty: string;
  estimatedDateTime: DateTimeString;
  timestamp: DateTimeString;
  totalDifficulty: string;
};

export const fetchMergeEstimate = (): Promise<ApiResult<MergeEstimate>> =>
  fetchJson<MergeEstimate>(`${getDomain()}/api/v2/fees/merge-estimate`);

export const useMergeEstimate = (): MergeEstimate | undefined => {
  const { data } = useSWR<MergeEstimate>(
    "/api/v2/fees/merge-estimate",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  return data;
};

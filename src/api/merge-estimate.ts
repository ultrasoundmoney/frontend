import useSWR from "swr";
import * as Duration from "../duration";
import type { DateTimeString } from "../time";
import { fetchJson } from "./fetchers";

export type MergeEstimate = {
  blockNumber: number;
  blocksLeft: number;
  difficulty: string;
  estimatedDateTime: DateTimeString;
  timestamp: DateTimeString;
  totalDifficulty: string;
};

export const useMergeEstimate = (): MergeEstimate | undefined => {
  const { data } = useSWR<MergeEstimate>(
    "/api/fees/merge-estimate",
    fetchJson,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  return data;
};

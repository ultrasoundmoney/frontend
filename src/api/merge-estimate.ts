import useSWR from "swr";
import * as Duration from "../duration";
import type { DateTimeString } from "../time";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

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
    `${feesBasePath}/merge-estimate`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  return data;
};

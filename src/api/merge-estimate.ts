import * as DateFns from "date-fns";
import { useMemo } from "react";
import useSWR from "swr";
import * as Duration from "../duration";
import type { DateTimeString } from "../time";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

type MergeEstimateF = {
  blockNumber: number;
  blocksLeft: number;
  difficulty: string;
  estimatedDateTime: DateTimeString;
  totalDifficulty: string;
};

type MergeEstimate = {
  blockNumber: number;
  blocksLeft: number;
  difficulty: string;
  estimatedDateTime: Date;
  totalDifficulty: string;
};

const decodeMergeEstimate = (
  mergeEstimateF: MergeEstimateF,
): MergeEstimate => ({
  ...mergeEstimateF,
  estimatedDateTime: DateFns.parseISO(mergeEstimateF.estimatedDateTime),
});

export const useMergeEstimate = (): MergeEstimate | undefined => {
  const { data } = useSWR<MergeEstimateF>(
    `${feesBasePath}/merge-estimate`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  return useMemo(() => {
    if (data === undefined) {
      return undefined;
    }

    return decodeMergeEstimate(data);
  }, [data]);
};

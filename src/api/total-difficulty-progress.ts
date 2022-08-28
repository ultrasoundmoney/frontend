import { useMemo } from "react";
import useSWR from "swr";
import type { DateTimeString } from "../time";
import fetcher from "./default-fetcher";
import * as DateFns from "date-fns";
import { TOTAL_TERMINAL_DIFFICULTY } from "../components/SupplyWidgets/MergeEstimateWidget";

// TODO: remove snake case variants when API has migrated.

type JsTimestamp = number;
type Point = [JsTimestamp, number];
type DifficultyByDay = {
  number: number;
  timestamp: DateTimeString;
  totalDifficulty: number;
  total_difficulty: number;
};

type TotalDifficultyProgressResponse = {
  blockNumber: number;
  totalDifficultyByDay: DifficultyByDay[];
  total_difficulty_by_day: DifficultyByDay[];
};

type TotalDifficultyProgress = Point[];

export const useTotalDifficultyProgress = ():
  | TotalDifficultyProgress
  | undefined => {
  const { data } = useSWR<TotalDifficultyProgressResponse>(
    `/api/v2/fees/total-difficulty-progress`,
    fetcher,
    {},
  );

  return useMemo(
    () =>
      data === undefined
        ? undefined
        : (data.totalDifficultyByDay || data.total_difficulty_by_day).map(
            ({ timestamp, totalDifficulty, total_difficulty }) => [
              DateFns.getTime(DateFns.parseISO(timestamp)),
              ((totalDifficulty || total_difficulty) /
                TOTAL_TERMINAL_DIFFICULTY) *
                100,
            ],
          ),
    [data],
  );
};

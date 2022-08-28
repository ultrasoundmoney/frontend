import { useMemo } from "react";
import useSWR from "swr";
import type { DateTimeString } from "../time";
import fetcher from "./default-fetcher";
import * as DateFns from "date-fns";
import { TOTAL_TERMINAL_DIFFICULTY } from "../components/SupplyWidgets/MergeEstimateWidget";

type JsTimestamp = number;
type Point = [JsTimestamp, number];
type DifficultyByDay = {
  number: number;
  timestamp: DateTimeString;
  total_difficulty: number;
};

type TotalDifficultyProgressResponse = {
  block_number: number;
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
        : data.total_difficulty_by_day.map(
            ({ timestamp, total_difficulty }) => [
              DateFns.getTime(DateFns.parseISO(timestamp)),
              (total_difficulty / TOTAL_TERMINAL_DIFFICULTY) * 100,
            ],
          ),
    [data],
  );
};

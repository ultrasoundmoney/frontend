import * as DateFns from "date-fns";
import useSWR from "swr";
import { TOTAL_TERMINAL_DIFFICULTY } from "../components/SupplyWidgets/MergeEstimateWidget";
import type { DateTimeString } from "../time";
import fetcher from "./default-fetcher";

type DifficultyByDay = {
  number: number;
  timestamp: DateTimeString;
  totalDifficulty: number;
};

export type TotalDifficultyProgress = {
  blockNumber: number;
  totalDifficultyByDay: DifficultyByDay[];
};

type JsTimestamp = number;
type Point = [JsTimestamp, number];
export type TotalDifficultyProgressPoints = Point[];

export const pointsFromTotalDifficultyProgress = (
  res: TotalDifficultyProgress,
): TotalDifficultyProgressPoints =>
  res.totalDifficultyByDay.map(({ timestamp, totalDifficulty }) => [
    DateFns.getTime(DateFns.parseISO(timestamp)),
    (totalDifficulty / TOTAL_TERMINAL_DIFFICULTY) * 100,
  ]);

export const useTotalDifficultyProgress = ():
  | TotalDifficultyProgress
  | undefined => {
  const { data } = useSWR<TotalDifficultyProgress>(
    `/api/v2/fees/total-difficulty-progress`,
    fetcher,
    {},
  );

  return data;
};

import * as DateFns from "date-fns";
import useSWR from "swr";
import { TOTAL_TERMINAL_DIFFICULTY } from "../eth-constants";
import type { DateTimeString } from "../time";
import { fetchJson } from "./fetchers";

type DifficultyByDay = {
  number: number;
  timestamp: DateTimeString;
  totalDifficulty: number;
};

export type TotalDifficultyProgress = {
  blockNumber: number;
  timestamp: DateTimeString;
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
    "/api/v2/fees/total-difficulty-progress",
    fetchJson,
    { refreshInterval: DateFns.secondsToMilliseconds(4) },
  );

  return data;
};

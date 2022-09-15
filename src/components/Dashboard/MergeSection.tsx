import {
  addMinutes,
  differenceInMilliseconds,
  getTime,
  isBefore,
  parseISO,
  startOfMinute,
  subMilliseconds,
} from "date-fns";
import _last from "lodash/last";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import type { MergeEstimate } from "../../api/merge-estimate";
import { useTotalDifficultyProgress } from "../../api/total-difficulty-progress";
import { pointsFromTotalDifficultyProgress } from "../../api/total-difficulty-progress";
import { TOTAL_TERMINAL_DIFFICULTY } from "../../eth-constants";
import MergeEstimateWidget from "../MergeEstimateWidget";
import TotalDifficultyProgressWidget from "../TotalDifficultyProgressWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import type { MergeStatus } from "../../api/merge-status";
import { EthSupply } from "../../api/eth-supply";
import { useSupplySinceMerge } from "../../api/supply-since-merge";
import { EthNumber } from "../../eth-units";
const SupplySinceMergeWidget = dynamic(
  () => import("../SupplySinceMergeWidget"),
);
const TotalDifficultyProjectionWidget = dynamic(
  () => import("../TotalDifficultyProjectionWidget"),
);

type JsTimestamp = number;
type Percent = number;
export type TTDPercentPoint = [JsTimestamp, Percent];

export type SupplyPoint = [JsTimestamp, EthNumber];

type Props = {
  ethSupply: EthSupply;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
};

const MergeSection: FC<Props> = ({ ethSupply, mergeEstimate, mergeStatus }) => {
  const supplySinceMerge = useSupplySinceMerge();
  const totalDifficultyProgress = useTotalDifficultyProgress();
  const [difficultyProjectionSeries, setDifficultyProjectionSeries] =
    useState<TTDPercentPoint[]>();
  const progress = Math.min(
    1,
    Number(mergeEstimate.totalDifficulty) / TOTAL_TERMINAL_DIFFICULTY,
  );

  const totalDifficultyByDay = useMemo(
    () =>
      totalDifficultyProgress === undefined
        ? undefined
        : pointsFromTotalDifficultyProgress(totalDifficultyProgress),
    [totalDifficultyProgress],
  );

  useEffect(() => {
    if (totalDifficultyProgress === undefined) {
      return undefined;
    }

    const lastTotalDifficultyPoint = _last(totalDifficultyByDay);

    if (lastTotalDifficultyPoint === undefined) {
      throw new Error("expect at least one point in totalDifficultyByDay");
    }

    // This will update every block, consider reducing that frequency.
    const generatedProjection: TTDPercentPoint[] = [];
    const mergeTimestamp = parseISO(mergeEstimate.estimatedDateTime);

    const periodMillis = differenceInMilliseconds(
      mergeTimestamp,
      lastTotalDifficultyPoint[0],
    );
    const percentLeft = 100 - lastTotalDifficultyPoint[1];
    let timestamp = startOfMinute(addMinutes(lastTotalDifficultyPoint[0], 1));
    while (isBefore(timestamp, mergeTimestamp)) {
      const millisSinceLast = subMilliseconds(
        timestamp,
        getTime(lastTotalDifficultyPoint[0]),
      );
      const fraction = getTime(millisSinceLast) / periodMillis;
      const percent = lastTotalDifficultyPoint[1] + fraction * percentLeft;
      const point = [getTime(timestamp), percent] as TTDPercentPoint;
      generatedProjection.push(point);
      timestamp = addMinutes(timestamp, 1);
    }

    setDifficultyProjectionSeries(generatedProjection);
  }, [
    mergeEstimate.estimatedDateTime,
    totalDifficultyByDay,
    totalDifficultyProgress,
  ]);

  const difficultyMap = Object.fromEntries(
    new Map(totalDifficultyByDay).entries(),
  );

  const difficultyProjectionMap = Object.fromEntries(
    new Map(difficultyProjectionSeries ?? []).entries(),
  );

  const supplySinceMergeSeries = useMemo(() => {
    return supplySinceMerge?.supply_by_minute.map(
      ({ timestamp, supply }) =>
        [getTime(parseISO(timestamp)), supply] as SupplyPoint,
      // [getTime(parseISO(timestamp)) - (1000 * 60 * 60, supply] as SupplyPoint,
    );
  }, [supplySinceMerge]);

  const supplySinceMergeMap = Object.fromEntries(
    new Map(supplySinceMergeSeries ?? []).entries(),
  );

  return (
    <BasicErrorBoundary>
      <Suspense>
        <div
          className="mt-16 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16"
          id="merge"
        >
          <div className="flex flex-col lg:flex-row gap-x-4 gap-y-4 mt-16">
            <div className="flex flex-col gap-y-4 md:w-full md:min-w-fit">
              <TotalDifficultyProgressWidget
                mergeStatus={mergeStatus}
                mergeEstimate={mergeEstimate}
                progress={progress}
              />
              <MergeEstimateWidget
                ethSupply={ethSupply}
                mergeEstimate={mergeEstimate}
                mergeStatus={mergeStatus}
              />
            </div>
            <SupplySinceMergeWidget
              mergeStatus={mergeStatus}
              supplySinceMergeSeries={supplySinceMergeSeries}
              supplySinceMergeMap={supplySinceMergeMap}
              timestamp={supplySinceMerge?.timestamp}
            />
          </div>
        </div>
      </Suspense>
    </BasicErrorBoundary>
  );
};

export default MergeSection;

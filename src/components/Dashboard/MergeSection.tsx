import {
  addHours,
  differenceInMilliseconds,
  getTime,
  isBefore,
  parseISO,
  startOfHour,
  subMilliseconds,
} from "date-fns";
import _last from "lodash/last";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useMemo } from "react";
import type { EthSupply } from "../../api/eth-supply";
import type { MergeEstimate } from "../../api/merge-estimate";
import type { TotalDifficultyProgress } from "../../api/total-difficulty-progress";
import { pointsFromTotalDifficultyProgress } from "../../api/total-difficulty-progress";
import { TOTAL_TERMINAL_DIFFICULTY } from "../../eth-constants";
import MergeEstimateWidget from "../MergeEstimateWidget";
import EthSupplyWidget from "../SupplyWidgets/EthSupplyWidget";
import TotalDifficultyProgressWidget from "../TotalDifficultyProgressWidget";
const PercentageToTTDWidget = dynamic(() => import("../PercentageToTTDWidget"));

type Props = {
  ethSupply: EthSupply;
  mergeEstimate: MergeEstimate;
  totalDifficultyProgress: TotalDifficultyProgress;
};

const MergeSection: FC<Props> = ({
  ethSupply,
  mergeEstimate,
  totalDifficultyProgress,
}) => {
  const progress =
    Number(mergeEstimate.totalDifficulty) / TOTAL_TERMINAL_DIFFICULTY;

  const totalDifficultyByDay = useMemo(
    () => pointsFromTotalDifficultyProgress(totalDifficultyProgress),
    [totalDifficultyProgress],
  );

  const lastTotalDifficultyPoint = _last(totalDifficultyByDay);
  if (lastTotalDifficultyPoint === undefined) {
    throw new Error("expect totalDifficultyByDay to have at least one point");
  }

  // This will update every block, consider reducing that frequency.
  const difficultyProjectionSeries: [number, number][] = [];
  const mergeTimestamp = parseISO(mergeEstimate.estimatedDateTime);

  const periodMillis = differenceInMilliseconds(
    mergeTimestamp,
    lastTotalDifficultyPoint[0],
  );
  const percentLeft = 100 - lastTotalDifficultyPoint[1];
  let timestamp = startOfHour(addHours(lastTotalDifficultyPoint[0], 1));
  while (isBefore(timestamp, mergeTimestamp)) {
    const millisSinceLast = subMilliseconds(
      timestamp,
      getTime(lastTotalDifficultyPoint[0]),
    );
    const fraction = getTime(millisSinceLast) / periodMillis;
    const percent = lastTotalDifficultyPoint[1] + fraction * percentLeft;
    const point = [getTime(timestamp), percent] as [number, number];
    difficultyProjectionSeries.push(point);
    timestamp = addHours(timestamp, 1);
  }

  const difficultyMap = Object.fromEntries(
    new Map(totalDifficultyByDay).entries(),
  );

  const difficultyProjectionMap = Object.fromEntries(
    new Map(difficultyProjectionSeries).entries(),
  );

  return (
    <div
      className="mt-32 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16"
      id="merge"
    >
      <div className="flex flex-col lg:flex-row gap-x-4 gap-y-4">
        <div className="flex flex-col gap-y-4 md:w-full md:min-w-fit">
          <TotalDifficultyProgressWidget
            mergeEstimate={mergeEstimate}
            progress={progress}
          />
          <MergeEstimateWidget mergeEstimate={mergeEstimate} />
          <EthSupplyWidget ethSupply={ethSupply}></EthSupplyWidget>
        </div>
        <PercentageToTTDWidget
          difficultyMap={difficultyMap}
          difficultyProjectionMap={difficultyProjectionMap}
          difficultyProjectionSeries={difficultyProjectionSeries}
          difficultySeries={totalDifficultyByDay}
          timestamp={totalDifficultyProgress.timestamp}
        />
      </div>
    </div>
  );
};

export default MergeSection;

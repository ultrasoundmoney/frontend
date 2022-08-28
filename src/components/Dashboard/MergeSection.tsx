import type { FC } from "react";
import { useTotalDifficultyProgress } from "../../api/total-difficulty-progress";
import _last from "lodash/last";
import PercentageToTTDWidget from "../PercentageToTTDWidget";
import EthSupplyWidget from "../SupplyWidgets/EthSupplyWidget";
import MergeEstimateWidget, {
  TOTAL_TERMINAL_DIFFICULTY,
} from "../SupplyWidgets/MergeEstimateWidget";
import TotalDifficultyProgressWidget from "../TotalDifficultyProgressWidget";
import type { MergeEstimate } from "../../api/merge-estimate";
import * as DateFns from "date-fns";

type Props = {
  mergeEstimate: MergeEstimate | undefined;
  totalDifficulty: number;
};
const MergeSection: FC<Props> = ({ mergeEstimate }) => {
  const totalDifficultyByDay = useTotalDifficultyProgress();
  const lastTotalDifficultyPoint = _last(totalDifficultyByDay);
  const difficultyProjectionSeries =
    lastTotalDifficultyPoint === undefined || mergeEstimate === undefined
      ? undefined
      : [
          lastTotalDifficultyPoint,
          [DateFns.getTime(mergeEstimate.estimatedDateTime), 100] as [
            number,
            number,
          ],
        ];
  const progress =
    mergeEstimate === undefined
      ? undefined
      : Number(mergeEstimate.totalDifficulty) / TOTAL_TERMINAL_DIFFICULTY;
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
      <div className="flex flex-col md:flex-row gap-x-4 gap-y-4">
        <div className="flex flex-col gap-y-4 md:min-w-fit">
          <TotalDifficultyProgressWidget progress={progress} />
          <MergeEstimateWidget />
          <EthSupplyWidget></EthSupplyWidget>
        </div>
        <PercentageToTTDWidget
          difficultyMap={difficultyMap}
          difficultyProjectionMap={difficultyProjectionMap}
          difficultyProjectionSeries={difficultyProjectionSeries ?? []}
          difficultySeries={totalDifficultyByDay ?? []}
        />
      </div>
    </div>
  );
};

export default MergeSection;

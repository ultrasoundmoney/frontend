import type { FC } from "react";
import PercentageToTTDWidget from "../PercentageToTTDWidget";
import EthSupplyWidget from "../SupplyWidgets/EthSupplyWidget";
import MergeEstimateWidget, {
  TOTAL_TERMINAL_DIFFICULTY,
} from "../SupplyWidgets/MergeEstimateWidget";
import TotalDifficultyProgressWidget from "../TotalDifficultyProgressWidget";

type Props = { totalDifficulty: number };

const TotalDifficultyProgressSection: FC<Props> = ({ totalDifficulty }) => (
  <div
    className="mt-32 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16"
    id="merge"
  >
    <div className="flex flex-col md:flex-row gap-x-4">
      <div className="flex flex-col gap-y-4">
        <TotalDifficultyProgressWidget
          progress={totalDifficulty / TOTAL_TERMINAL_DIFFICULTY}
        />
        <MergeEstimateWidget />
        <EthSupplyWidget></EthSupplyWidget>
      </div>
      <PercentageToTTDWidget
        difficultyMap={{}}
        difficultyProjectionMap={{}}
        difficultyProjectionSeries={[
          [1659804800000, 95.2],
          [1659904800000, 95.5],
          [1660024946000, 96],
        ]}
        difficultySeries={[
          [1659304800000, 93],
          [1659404800000, 93],
          [1659504800000, 94],
          [1659604800000, 94],
          [1659704800000, 95],
        ]}
      />
    </div>
  </div>
);
export default TotalDifficultyProgressSection;

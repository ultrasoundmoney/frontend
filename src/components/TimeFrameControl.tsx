import { FC } from "react";
import {
  displayTimeFrameNextMap,
  TimeFrameNext,
  timeFramesNext,
} from "../time_frames";

type Props = {
  selectedTimeframe: TimeFrameNext;
  onSetFeePeriod: (timeframe: TimeFrameNext) => void;
};

const TimeFrameControl: FC<Props> = ({ selectedTimeframe, onSetFeePeriod }) => {
  const activePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <div className="flex flex-row items-center lg:gap-x-2">
      {timeFramesNext.map((timeFrame) => (
        <button
          key={timeFrame}
          className={`font-roboto font-extralight text-sm md:text-base px-3 py-1 border border-transparent select-none ${
            selectedTimeframe === timeFrame
              ? activePeriodClasses
              : "text-blue-spindle"
          }`}
          onClick={() => onSetFeePeriod(timeFrame)}
        >
          {displayTimeFrameNextMap[timeFrame]}
        </button>
      ))}
    </div>
  );
};

export default TimeFrameControl;

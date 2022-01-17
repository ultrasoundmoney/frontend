import { FC } from "react";
import {
  displayTimeFrameNextMap,
  TimeFrameNext,
  timeFramesNext,
} from "../time_frames";

export const Button: FC<{ isActive: boolean; onClick: () => void }> = ({
  children,
  isActive,
  onClick,
}) => (
  <button
    className={`
      font-roboto font-extralight
      text-sm md:text-base
      px-3 py-1
      select-none
      ${
        isActive
          ? "text-white bg-blue-highlightbg border border-blue-highlightborder rounded-sm"
          : "text-blue-spindle"
      }
      `}
    onClick={onClick}
  >
    {children}
  </button>
);

type Props = {
  selectedTimeframe: TimeFrameNext;
  onSetTimeFrame: (timeframe: TimeFrameNext) => void;
};

const TimeFrameControl: FC<Props> = ({ selectedTimeframe, onSetTimeFrame }) => (
  <div className="flex flex-row items-center lg:gap-x-2">
    {timeFramesNext.map((timeFrame) => (
      <Button
        key={timeFrame}
        isActive={selectedTimeframe === timeFrame}
        onClick={() => onSetTimeFrame(timeFrame)}
      >
        {displayTimeFrameNextMap[timeFrame]}
      </Button>
    ))}
  </div>
);

export default TimeFrameControl;

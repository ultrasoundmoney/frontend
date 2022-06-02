import { FC } from "react";
import {
  displayTimeFrameNextMap,
  TimeFrameNext,
  timeFramesNext,
} from "../../../time-frames";

export const Button: FC<{ isActive: boolean; onClick: () => void }> = ({
  children,
  isActive,
  onClick,
}) => (
  <button
    className={`
      font-roboto font-light
      text-xs tracking-widest
      px-3 py-2
      select-none
      border
      ${
        isActive
          ? "text-white bg-blue-highlightbg border-blue-highlightborder rounded-sm"
          : "text-blue-spindle border-transparent"
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
  <div className="flex flex-row items-baseline lg:gap-x-1">
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

import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../dates";
import { displayTimeFrameMap, TimeFrame } from "./TimeFrameControl";

type Props = {
  compressWhitespace?: boolean;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
};

const TimeFrameIndicator: FC<Props> = ({
  compressWhitespace = false,
  onClickTimeFrame,
  timeFrame,
}) => {
  const daysSinceLondonFork = DateFns.differenceInDays(
    new Date(),
    londonHardforkTimestamp
  );

  const timeFrameDaysOpacity = timeFrame === "all" ? "opacity-1" : "opacity-0";
  const timeFrameDaysDisplay =
    compressWhitespace === true && timeFrame !== "all" ? "hidden" : "";

  return (
    <div className="flex gap-x-2 md:gap-x-4 items-center">
      <span
        className={`font-roboto font-extralight text-blue-shipcove transition-opacity ${timeFrameDaysOpacity} ${timeFrameDaysDisplay}`}
      >
        ({`${daysSinceLondonFork}d`})
      </span>
      {timeFrame !== undefined && (
        <button
          className={`font-roboto font-extralight px-3 py-1 border text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg`}
          onClick={onClickTimeFrame}
        >
          {displayTimeFrameMap[timeFrame]}
        </button>
      )}
    </div>
  );
};

export default TimeFrameIndicator;

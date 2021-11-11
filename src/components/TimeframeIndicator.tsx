import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../dates";
import { displayTimeFrameMap, TimeFrame } from "./TimeFrameControl";

type Props = { onClickTimeFrame: () => void; timeFrame: TimeFrame };

const TimeFrameIndicator: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const daysSinceLondonFork = DateFns.differenceInDays(
    new Date(),
    londonHardforkTimestamp
  );

  return (
    <div className="flex items-center">
      <span
        className={`font-roboto font-extralight text-blue-shipcove text-sm transition-opacity ${
          timeFrame === "all" ? "opacity-1" : "opacity-0"
        }`}
      >
        ({`${daysSinceLondonFork}d`})
      </span>
      <div className="w-4"></div>
      {timeFrame !== undefined && (
        <button
          className={`font-roboto font-extralight text-sm lg:text-lg px-3 py-1 border text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg`}
          onClick={onClickTimeFrame}
        >
          {displayTimeFrameMap[timeFrame]}
        </button>
      )}
    </div>
  );
};

export default TimeFrameIndicator;

import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../../dates";
import { pipe } from "../../fp";
import { displayTimeFrameNextMap, TimeFrameNext } from "../../time_frames";

const getFormattedDays = () =>
  pipe(
    DateFns.differenceInDays(new Date(), londonHardforkTimestamp),
    (daysCount) => `${daysCount}d`,
  );

type Props = {
  onClickTimeFrame: () => void;
  showDays?: boolean;
  timeFrame: TimeFrameNext;
};

const TimeFrameIndicator: FC<Props> = ({
  onClickTimeFrame,
  showDays = true,
  timeFrame,
}) => (
  <div className="flex gap-x-2 md:gap-x-4 items-center">
    <span
      className={`
        font-roboto font-extralight
        text-blue-shipcove
        transition-opacity
        ${timeFrame === "all" ? "visible" : "invisible"}
        ${showDays === false ? "hidden" : ""}
      `}
    >
      {getFormattedDays()}
    </span>
    {timeFrame !== undefined && (
      <button
        className={`
          font-roboto font-extralight
          px-3 py-1
          text-white
          border border-blue-highlightborder rounded-sm
          bg-blue-highlightbg
          select-none
        `}
        onClick={onClickTimeFrame}
      >
        {displayTimeFrameNextMap[timeFrame]}
      </button>
    )}
  </div>
);

export default TimeFrameIndicator;

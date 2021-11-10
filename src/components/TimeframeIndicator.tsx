import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../dates";
import { displayTimeFrameMap, TimeFrame } from "./TimeFrameControl";

const TimeFrameIndicator: FC<{ timeframe: TimeFrame }> = ({ timeframe }) => {
  const daysSinceLondonFork = DateFns.differenceInDays(
    new Date(),
    londonHardforkTimestamp
  );

  return (
    <span className="font-roboto font-normal text-blue-manatee text-sm pl-2">
      (
      {timeframe === "all"
        ? `${daysSinceLondonFork}d`
        : `${displayTimeFrameMap[timeframe]}`}
      )
    </span>
  );
};

export default TimeFrameIndicator;

import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../dates";
import { displayTimeframeMap, Timeframe } from "./FeePeriodControl";

const TimeframeIndicator: FC<{ timeframe: Timeframe }> = ({ timeframe }) => {
  const daysSinceLondonFork = DateFns.differenceInDays(
    new Date(),
    londonHardforkTimestamp
  );

  return (
    <span className="font-roboto font-normal text-blue-manatee text-sm pl-2">
      (
      {timeframe === "all"
        ? `${daysSinceLondonFork}d`
        : `${displayTimeframeMap[timeframe]}`}
      )
    </span>
  );
};

export default TimeframeIndicator;

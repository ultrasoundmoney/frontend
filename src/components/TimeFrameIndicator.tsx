import * as DateFns from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { londonHardfork } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrameNext } from "../time-frames";
import { displayTimeFrameNextMap } from "../time-frames";
import { WidgetTitle } from "./WidgetSubcomponents";

const getFormattedDays = (now: Date) => {
  const daysCount = DateFns.differenceInDays(now, londonHardfork);
  return `${daysCount}d`;
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const TimeFrameIndicator: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const [daysSinceLondon, setDaysSinceLondon] = useState<string>();

  useEffect(() => {
    setTimeout(() => {
      setDaysSinceLondon(getFormattedDays(new Date()));
    }, millisFromHours(1));
  });

  return (
    <button className="flex gap-x-2 items-baseline" onClick={onClickTimeFrame}>
      <WidgetTitle>time frame</WidgetTitle>
      <p className="font-roboto font-light text-white text-xs">
        {timeFrame === "all"
          ? daysSinceLondon
          : displayTimeFrameNextMap[timeFrame]}
      </p>
    </button>
  );
};

export default TimeFrameIndicator;

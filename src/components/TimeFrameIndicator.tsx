import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { londonHardFork, mergeDateTime } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrame } from "../time-frames";
import { displayLimitedTimeFrameMap } from "../time-frames";
import LabelText from "./TextsNext/LabelText";
import { LondonHardForkTooltip } from "./TimeFrameControl";

const getFormattedDays = (now: Date, fork: Date): string => {
  const daysCount = differenceInDays(now, fork);
  return `${daysCount}d`;
};

type Props = {
  className?: string;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
};

const TimeFrameIndicator: FC<Props> = ({
  className = "",
  onClickTimeFrame,
  timeFrame,
}) => {
  const [daysSinceLondon, setDaysSinceLondon] = useState<string>();
  const [daysSinceMerge, setDaysSinceMerge] = useState<string>();

  useEffect(() => {
    setDaysSinceLondon(getFormattedDays(new Date(), londonHardFork));
    setDaysSinceMerge(getFormattedDays(new Date(), mergeDateTime));

    const id = setTimeout(() => {
      setDaysSinceLondon(getFormattedDays(new Date(), londonHardFork));
      setDaysSinceMerge(getFormattedDays(new Date(), mergeDateTime));
    }, millisFromHours(1));

    return () => clearTimeout(id);
  }, []);

  return (
    <LondonHardForkTooltip zLevel="z-30" timeFrame={timeFrame}>
      <button
        className={`flex items-baseline gap-x-2 hover:brightness-90 active:brightness-75 ${className}`}
        onClick={onClickTimeFrame}
      >
        <LabelText>
          {timeFrame === "since_burn"
            ? "since burn"
            : timeFrame === "since_merge"
            ? "since merge"
            : "time frame"}
        </LabelText>
        <p className="font-roboto text-xs text-white">
          {timeFrame === "since_burn"
            ? daysSinceLondon
            : timeFrame === "since_merge"
            ? daysSinceMerge
            : displayLimitedTimeFrameMap[timeFrame]}
        </p>
      </button>
    </LondonHardForkTooltip>
  );
};

export default TimeFrameIndicator;

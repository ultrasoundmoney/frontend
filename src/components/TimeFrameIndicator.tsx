import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { londonHardFork } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrameNext } from "../time-frames";
import { displayLimitedTimeFrameMap } from "../time-frames";
import LabelText from "./TextsNext/LabelText";
import HoverTooltip from "./HoverTooltip";

const getFormattedDays = (now: Date) => {
  const daysCount = differenceInDays(now, londonHardFork);
  return `${daysCount}d`;
};

type Props = {
  className?: string;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const TimeFrameIndicator: FC<Props> = ({
  className = "",
  onClickTimeFrame,
  timeFrame,
}) => {
  const [daysSinceLondon, setDaysSinceLondon] = useState<string>();

  useEffect(() => {
    setDaysSinceLondon(getFormattedDays(new Date()));

    const id = setTimeout(() => {
      setDaysSinceLondon(getFormattedDays(new Date()));
    }, millisFromHours(1));

    return () => clearTimeout(id);
  }, []);

  return (
    <HoverTooltip
      zLevel="z-30"
      text={
        timeFrame === "since_burn"
          ? "since London hark fork where EIP-1559 was activated"
          : undefined
      }
    >
      <button
        className={`flex items-baseline gap-x-2 ${className}`}
        onClick={onClickTimeFrame}
      >
        <LabelText>
          {timeFrame === "since_burn" ? "since burn" : "time frame"}
        </LabelText>
        <p className="font-roboto text-xs text-white">
          {timeFrame === "since_burn"
            ? daysSinceLondon
            : displayLimitedTimeFrameMap[timeFrame]}
        </p>
      </button>
    </HoverTooltip>
  );
};

export default TimeFrameIndicator;

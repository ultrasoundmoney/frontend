import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { londonHardFork } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrameNext } from "../time-frames";
import { displayTimeFrameNextMap } from "../time-frames";
import LabelText from "./TextsNext/LabelText";

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
    <button
      className={`flex items-baseline gap-x-2 ${className}`}
      onClick={onClickTimeFrame}
      title="since London hark fork where EIP-1559 was activated"
    >
      <LabelText>{timeFrame === "all" ? "since burn" : "time frame"}</LabelText>
      <p className="font-roboto text-xs text-white">
        {timeFrame === "all"
          ? daysSinceLondon
          : displayTimeFrameNextMap[timeFrame]}
      </p>
    </button>
  );
};

export default TimeFrameIndicator;

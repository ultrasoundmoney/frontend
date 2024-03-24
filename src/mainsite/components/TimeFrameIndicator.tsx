import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { LondonHardForkTooltip } from "../../components/TimeFrameControl";
import { londonHardFork, mergeDateTime } from "../../dates";
import { millisFromHours } from "../../duration";
import type { TimeFrame } from "../time-frames";
import { displayLimitedTimeFrameMap } from "../time-frames";
import { OnClick } from "../../components/TimeFrameControl";

const getFormattedDays = (now: Date, fork: Date): string => {
  const daysCount = differenceInDays(now, fork);
  return `${daysCount}d`;
};

type Props = {
  className?: string;
  hideTimeFrameLabel?: boolean;
  onClickTimeFrame?: OnClick;
  timeFrame: TimeFrame;
};

const TimeFrameIndicator: FC<Props> = ({ className = "",
  hideTimeFrameLabel,
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

  const ContainerElement = onClickTimeFrame === undefined ? "div" : "button";

  return (
    <LondonHardForkTooltip zLevel="z-30" timeFrame={timeFrame}>
      <ContainerElement
        className={`
          flex items-baseline gap-x-2
          ${
            onClickTimeFrame === undefined
              ? ""
              : "select-none hover:brightness-90 active:brightness-75"
          }
          ${className}
        `}
        onClick={onClickTimeFrame}
      >
        <LabelText className={hideTimeFrameLabel ? "hidden sm:block" : "block"}>
          {timeFrame === "since_burn"
            ? "since burn"
            : timeFrame === "since_merge"
            ? "since merge"
            : "time frame"}
        </LabelText>
        <p className="text-xs text-white font-roboto">
          {timeFrame === "since_burn"
            ? daysSinceLondon
            : timeFrame === "since_merge"
            ? daysSinceMerge
            : displayLimitedTimeFrameMap[timeFrame]}
        </p>
      </ContainerElement>
    </LondonHardForkTooltip>
  );
};

export default TimeFrameIndicator;

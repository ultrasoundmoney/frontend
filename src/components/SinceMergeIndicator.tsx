import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { parisHardFork } from "../dates";
import { millisFromHours } from "../duration";
import type { LimitedTimeFrameWithMerge } from "./Dashboard/SupplyDashboard";
import HoverTooltip from "./HoverTooltip";
import { TimeFrameText } from "./Texts";
import { WidgetTitle } from "./WidgetSubcomponents";

const getFormattedDays = (now: Date) => {
  const daysCount = differenceInDays(now, parisHardFork);
  return `${daysCount}d`;
};

const displayTimeframeV2Map: Record<
  Exclude<LimitedTimeFrameWithMerge, "since_merge">,
  string | undefined
> = {
  d1: "1d",
  d30: "30d",
  d7: "7d",
  h1: "1h",
  m5: "5m",
};

const SinceMergeIndicator: FC<{
  onClick?: () => void;
  timeFrame: LimitedTimeFrameWithMerge;
}> = ({ onClick, timeFrame }) => {
  const [daysSinceParis, setDaysSinceParis] = useState<string>();

  useEffect(() => {
    setDaysSinceParis(getFormattedDays(new Date()));

    const id = setTimeout(() => {
      setDaysSinceParis(getFormattedDays(new Date()));
    }, millisFromHours(1));

    return () => clearTimeout(id);
  }, []);

  return (
    <HoverTooltip
      text={
        timeFrame === "since_merge"
          ? "since the merge where proof-of-stake was activated"
          : undefined
      }
    >
      <button className="flex items-baseline gap-x-2" onClick={onClick}>
        {timeFrame === "since_merge" ? (
          <>
            <WidgetTitle>since merge</WidgetTitle>
            <TimeFrameText>{daysSinceParis}</TimeFrameText>
          </>
        ) : (
          <>
            <WidgetTitle>time frame</WidgetTitle>
            <TimeFrameText>{displayTimeframeV2Map[timeFrame]}</TimeFrameText>
          </>
        )}
      </button>
    </HoverTooltip>
  );
};

export default SinceMergeIndicator;

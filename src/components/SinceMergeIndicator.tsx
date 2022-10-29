import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { parisHardFork } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrameV2 } from "./EthSupplyWidget";
import { TimeFrameText } from "./Texts";
import { WidgetTitle } from "./WidgetSubcomponents";

const getFormattedDays = (now: Date) => {
  const daysCount = differenceInDays(now, parisHardFork);
  return `${daysCount}d`;
};

const displayTimeframeV2Map: Record<
  Exclude<TimeFrameV2, "since_merge">,
  string | undefined
> = {
  d1: "d1",
  d30: "d30",
  d7: "d7",
  h1: "h1",
  m5: "m5",
};

const SinceMergeIndicator: FC<{
  onClick?: () => void;
  timeFrame: TimeFrameV2;
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
  );
};

export default SinceMergeIndicator;

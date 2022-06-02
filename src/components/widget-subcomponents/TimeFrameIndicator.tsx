import * as DateFns from "date-fns";
import { FC, useEffect, useState } from "react";
import { WidgetTitle } from ".";
import { londonHardfork } from "../../dates";
import { millisFromHours } from "../../duration";
import { pipe } from "../../fp";
import { displayTimeFrameNextMap, TimeFrameNext } from "../../time-frames";

const getFormattedDays = () =>
  pipe(
    DateFns.differenceInDays(new Date(), londonHardfork),
    (daysCount) => `${daysCount}d`,
  );

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const TimeFrameIndicator: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const [daysSinceLondon, setDaysSinceLondon] = useState<string>(
    getFormattedDays(),
  );

  useEffect(() => {
    setTimeout(() => {
      setDaysSinceLondon(getFormattedDays());
    }, millisFromHours(1));
  });

  return (
    <button className="flex gap-x-2 items-baseline" onClick={onClickTimeFrame}>
      <WidgetTitle>time frame</WidgetTitle>
      <p
        className="
  font-roboto font-light
  text-white text-xs
  "
      >
        {timeFrame === "all"
          ? daysSinceLondon
          : displayTimeFrameNextMap[timeFrame]}
      </p>
    </button>
  );
};

export default TimeFrameIndicator;

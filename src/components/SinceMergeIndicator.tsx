import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { parisHardFork } from "../dates";
import { millisFromHours } from "../duration";
import { WidgetTitle } from "./WidgetSubcomponents";

const getFormattedDays = (now: Date) => {
  const daysCount = differenceInDays(now, parisHardFork);
  return `${daysCount}d`;
};

const SinceMergeIndicator: FC = () => {
  const [daysSinceParis, setDaysSinceParis] = useState<string>();

  useEffect(() => {
    setDaysSinceParis(getFormattedDays(new Date()));

    const id = setTimeout(() => {
      setDaysSinceParis(getFormattedDays(new Date()));
    }, millisFromHours(1));

    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex items-baseline gap-x-2">
      <WidgetTitle>since merge</WidgetTitle>
      <p className="font-roboto text-xs text-white">{daysSinceParis}</p>
    </div>
  );
};

export default SinceMergeIndicator;

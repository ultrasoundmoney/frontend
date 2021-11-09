import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../dates";
import { displayTimeframeMap, Timeframe } from "./FeePeriodControl";

export const WidgetBackground: FC = ({ children }) => (
  <div className="bg-blue-tangaroa w-full rounded-lg p-8">{children}</div>
);

export const WidgetTitle: FC<{ timeframe?: Timeframe; title: string }> = ({
  timeframe,
  title,
}) => {
  const daysSinceLondonFork = DateFns.differenceInDays(
    new Date(),
    londonHardforkTimestamp
  );

  return (
    <div className="flex">
      <p className="font-inter font-light text-blue-spindle text-md mb-4 md:mb-0 lg:mb-4 xl:mb-0 uppercase">
        {title}
      </p>
      {timeframe !== undefined && (
        <span className="font-roboto font-normal text-blue-manatee text-sm pl-2">
          (
          {timeframe === "all"
            ? `${daysSinceLondonFork}d`
            : `${displayTimeframeMap[timeframe]}`}
          )
        </span>
      )}
    </div>
  );
};

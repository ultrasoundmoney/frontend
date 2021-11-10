import * as DateFns from "date-fns";
import { FC } from "react";
import { londonHardforkTimestamp } from "../dates";
import { displayTimeFrameMap, TimeFrame } from "./TimeFrameControl";

export const WidgetBackground: FC = ({ children }) => (
  <div className="bg-blue-tangaroa w-full rounded-lg p-8">{children}</div>
);

export const WidgetTitle: FC<{
  align?: "right";
  timeFrame?: TimeFrame;
  title: string;
}> = ({ align, timeFrame, title }) => {
  const daysSinceLondonFork = DateFns.differenceInDays(
    new Date(),
    londonHardforkTimestamp
  );

  return (
    <div className={`flex mb-4 ${align === "right" ? "md:justify-end" : ""}`}>
      <p className="font-inter font-light text-blue-spindle text-md uppercase">
        {title}
      </p>
      {timeFrame !== undefined && (
        <span className="font-roboto font-normal text-blue-manatee text-sm pl-2">
          (
          {timeFrame === "all"
            ? `${daysSinceLondonFork}d`
            : `${displayTimeFrameMap[timeFrame]}`}
          )
        </span>
      )}
    </div>
  );
};

import React, { FC } from "react";
import { TimeFrame } from "../time_frames";
import TimeFrameIndicator from "./TimeframeIndicator";

export const WidgetBackground: FC = ({ children }) => (
  <div className="bg-blue-tangaroa w-full rounded-lg p-8">{children}</div>
);

type WidgetTitleProps = {
  align?: "right";
  onClickTimeFrame?: () => void;
  timeFrame?: TimeFrame;
  title: string;
};

export const WidgetTitle: FC<WidgetTitleProps> = ({
  onClickTimeFrame,
  timeFrame,
  title,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className="font-inter font-light text-blue-spindle text-md uppercase">
        {title}
      </p>
      {timeFrame !== undefined && onClickTimeFrame !== undefined && (
        <TimeFrameIndicator
          onClickTimeFrame={onClickTimeFrame}
          timeFrame={timeFrame}
        />
      )}
    </div>
  );
};

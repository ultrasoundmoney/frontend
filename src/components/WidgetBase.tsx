import type { FC, ReactNode } from "react";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import {
  WidgetBackground,
  WidgetTitle,
} from "./WidgetSubcomponents";
import TimeFrameIndicator from "../mainsite/components/TimeFrameIndicator";
import type { TimeFrame } from "../mainsite/time-frames";
import type { OnClick } from "./TimeFrameControl";

type Props = {
  children: ReactNode;
  className?: string;
  hideTimeFrameLabel?: boolean;
  onClickTimeFrame?: OnClick;
  timeFrame?: TimeFrame;
  title: string;
};

const WidgetBase: FC<Props> = ({
  children,
  className = "",
  hideTimeFrameLabel,
  onClickTimeFrame,
  timeFrame,
  title,
}) => (
  <WidgetErrorBoundary title={title}>
    <WidgetBackground className={`flex flex-col gap-y-4 ${className}`}>
      <div className="flex justify-between items-center gap-2-x">
        <WidgetTitle>{title}</WidgetTitle>
        {timeFrame && (
          <TimeFrameIndicator
            hideTimeFrameLabel={hideTimeFrameLabel}
            onClickTimeFrame={onClickTimeFrame}
            timeFrame={timeFrame}
          />
        )}
      </div>
      {children}
    </WidgetBackground>
  </WidgetErrorBoundary>
);

export default WidgetBase;
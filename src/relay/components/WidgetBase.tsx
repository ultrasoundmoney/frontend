import type { FC, ReactNode } from "react";
import WidgetErrorBoundary from "../../components/WidgetErrorBoundary";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import TimeFrameIndicator from "../../mainsite/components/TimeFrameIndicator";
import type { TimeFrame } from "../../mainsite/time-frames";

type Props = {
  className?: string;
  children: ReactNode;
  onClickTimeFrame?: () => void;
  timeFrame: TimeFrame;
  title: string;
};

const WidgetBase: FC<Props> = ({
  className = "",
  children,
  timeFrame,
  title,
  onClickTimeFrame,
}) => (
  <WidgetErrorBoundary title={title}>
    <WidgetBackground className={`flex flex-col gap-y-4 ${className}`}>
      <div className="gap-2-x flex items-center justify-between">
        <WidgetTitle>{title}</WidgetTitle>
        <TimeFrameIndicator
          onClickTimeFrame={onClickTimeFrame}
          timeFrame={timeFrame}
        />
      </div>
      {children}
    </WidgetBackground>
  </WidgetErrorBoundary>
);

export default WidgetBase;

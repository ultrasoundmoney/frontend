import type { FC, HTMLAttributes, ReactNode } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import type { TimeFrame } from "../time-frames";
import TimeFrameIndicator from "./TimeFrameIndicator";
import type { OnClick } from "../../components/TimeFrameControl";

type Group1BaseProps = {
  backgroundClassName?: HTMLAttributes<HTMLDivElement>["className"];
  children: ReactNode;
  onClickTimeFrame: OnClick;
  timeFrame: TimeFrame;
  title: string;
};

const BurnGroupBase: FC<Group1BaseProps> = ({
  backgroundClassName,
  children,
  onClickTimeFrame,
  timeFrame,
  title,
}) => (
  <WidgetBackground className={backgroundClassName}>
    <div className="flex items-baseline justify-between">
      <WidgetTitle>{title}</WidgetTitle>
      <TimeFrameIndicator
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
      />
    </div>
    {children}
  </WidgetBackground>
);

export default BurnGroupBase;

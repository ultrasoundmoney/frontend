import { FC, HTMLAttributes } from "react";
import { TimeFrameNext } from "../../time-frames";
import TimeFrameIndicator from "./TimeFrameIndicator";

type BackgroundProps = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export const WidgetBackground: FC<BackgroundProps> = ({
  className,
  children,
}) => (
  <div className={`bg-blue-tangaroa rounded-lg p-8 ${className ?? ""}`}>
    {children}
  </div>
);

export const WidgetTitle: FC = ({ children }) => (
  <p className="font-inter font-light text-blue-spindle text-md uppercase">
    {children}
  </p>
);

type Group1BaseProps = {
  backgroundClassName?: HTMLAttributes<HTMLDivElement>["className"];
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
  title: string;
};

export const Group1Base: FC<Group1BaseProps> = ({
  backgroundClassName,
  children,
  onClickTimeFrame,
  timeFrame,
  title,
}) => (
  <WidgetBackground className={backgroundClassName}>
    <div className="flex items-center justify-between">
      <WidgetTitle>{title}</WidgetTitle>
      <TimeFrameIndicator
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
      />
    </div>
    {children}
  </WidgetBackground>
);

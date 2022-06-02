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

export const WidgetTitle: FC<{
  className?: string;
}> = ({ className, children }) => (
  <p
    className={`font-inter font-light text-blue-spindle text-xs uppercase tracking-widest ${
      className ?? ""
    }`}
  >
    {children}
  </p>
);

type Group1BaseProps = {
  backgroundClassName?: HTMLAttributes<HTMLDivElement>["className"];
  timeFrame: TimeFrameNext;
  title: string;
};

export const Group1Base: FC<Group1BaseProps> = ({
  backgroundClassName,
  children,
  timeFrame,
  title,
}) => (
  <WidgetBackground className={backgroundClassName}>
    <div className="flex items-center justify-between">
      <WidgetTitle>{title}</WidgetTitle>
      <TimeFrameIndicator timeFrame={timeFrame} />
    </div>
    {children}
  </WidgetBackground>
);

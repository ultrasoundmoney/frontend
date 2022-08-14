import { FC, HTMLAttributes, ReactNode } from "react";
import { TimeFrameNext } from "../../time-frames";
import TimeFrameIndicator from "../TimeFrameIndicator";

type BackgroundProps = {
  children: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export const WidgetBackground: FC<BackgroundProps> = ({
  children,
  className,
}) => (
  <div
    className={`
      bg-slateus-700 rounded-lg p-8
      ${className ?? ""}
    `}
  >
    {children}
  </div>
);

export const WidgetTitle: FC<{
  children: ReactNode;
  className?: string;
}> = ({ className, children }) => (
  <p
    className={`
      font-inter font-light
      text-blue-spindle text-xs
      uppercase tracking-widest
      ${className ?? ""}
    `}
  >
    {children}
  </p>
);

type Group1BaseProps = {
  backgroundClassName?: HTMLAttributes<HTMLDivElement>["className"];
  children: ReactNode;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
  title: string;
};

export const BurnGroupBase: FC<Group1BaseProps> = ({
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

import type { FC, HTMLAttributes, ReactNode } from "react";
import type { TimeFrameNext } from "../../time-frames";
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
      rounded-lg bg-slateus-700 p-8
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
      font-inter text-xs
      font-light uppercase
      tracking-widest text-slateus-200
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

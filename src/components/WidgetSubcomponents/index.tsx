import type { FC, HTMLAttributes, ReactNode } from "react";

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

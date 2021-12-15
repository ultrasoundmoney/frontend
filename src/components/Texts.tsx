import { FC } from "react";

export const LabelText: FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={`font-inter font-light text-blue-spindle text-md uppercase ${className}`}
  >
    {children}
  </span>
);

export const UnitText: FC = ({ children }) => (
  <span className="font-roboto text-blue-spindle font-extralight">
    {children}
  </span>
);

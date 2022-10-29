import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
};

const TimeFrameText: FC<Props> = ({
  children,
  className,
  color = "text-slateus-200",
}) => (
  <BaseText
    font="font-roboto"
    color={color}
    className={`
      text-xs
      font-normal
      uppercase tracking-widest
      ${className}
    `}
  >
    {children}
  </BaseText>
);

export default TimeFrameText;

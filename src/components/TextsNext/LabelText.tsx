import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
};

const LabelText: FC<Props> = ({
  children,
  className = "",
  color = "text-slateus-200",
}) => (
  <BaseText
    font="font-inter"
    size="text-xs"
    className={`uppercase tracking-widest ${className}`}
    color={color}
  >
    {children}
  </BaseText>
);

export default LabelText;

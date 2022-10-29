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
    color={color}
    className={`
      text-xs
      uppercase tracking-widest
      ${className}
    `}
  >
    {children}
  </BaseText>
);

export default LabelText;

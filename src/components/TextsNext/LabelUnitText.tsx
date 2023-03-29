import type { FC, ReactNode } from "react";
import { BaseText } from "../Texts";

export const LabelUnitText: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <BaseText
    className={`tracking-widest ${className}`}
    color="text-slateus-200"
    font="font-roboto"
    size="text-xs"
    weight="font-light"
  >
    {children}
  </BaseText>
);
